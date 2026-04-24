"""
JSON-tree-based career path engine.

Traverses the career_tree.json depth-first, applying rule-based filters:
  - marks   >= node.marks_required
  - budget  >= node.budget_min
Builds flat node + edge lists suitable for ReactFlow.
"""
from __future__ import annotations
from typing import Any
from models.json_schemas import (
    ExploreInput,
    JsonPathNode,
    JsonPathEdge,
    JsonPathResponse,
)
from services.tree_loader import load_career_tree, get_substreams

# ── Budget parser ────────────────────────────────────────────────────────────

def _budget_min(node: dict) -> int:
    return int(node.get("budget_min", 0))


# ── Node builders ────────────────────────────────────────────────────────────

_node_counter: list[int] = [0]


def _next_id() -> int:
    _node_counter[0] += 1
    return _node_counter[0]


def _reset():
    _node_counter[0] = 0


def _make_node(raw: dict, depth: int = 0) -> JsonPathNode:
    nid = _next_id()
    return JsonPathNode(
        id=nid,
        raw_id=nid,
        title=raw.get("name", "Unknown"),
        description=raw.get("eligibility", ""),
        type=raw.get("type", "option"),
        cost=raw.get("average_cost_range", "N/A"),
        exams=raw.get("entrance_exams", []),
        colleges=raw.get("top_colleges", []),
        career_outcomes=raw.get("career_outcomes", []),
        marks_required=int(raw.get("marks_required", 0)),
        budget_min=_budget_min(raw),
        depth=depth,
    )


# ── Main traversal ───────────────────────────────────────────────────────────

def _traverse(
    node_raw: dict,
    marks: float,
    budget: float,
    depth: int,
    nodes: list[JsonPathNode],
    edges: list[JsonPathEdge],
    parent_id: int | None,
    blocked_paths: list[dict],
) -> JsonPathNode | None:
    """
    Recursively traverse the tree.
    Returns the built node if eligible, else None.
    Ineligible paths are added to blocked_paths (alternatives).
    """
    marks_ok = marks >= int(node_raw.get("marks_required", 0))
    budget_ok = budget >= _budget_min(node_raw)

    if not marks_ok or not budget_ok:
        blocked_paths.append({
            "reason": (
                f"Marks < {node_raw.get('marks_required', 0)}%"
                if not marks_ok
                else f"Budget < ₹{_budget_min(node_raw):,}"
            ),
            **node_raw,
        })
        return None

    node = _make_node(node_raw, depth)
    nodes.append(node)

    if parent_id is not None:
        edges.append(JsonPathEdge(from_node=parent_id, to_node=node.id))

    # Recurse into next_steps
    for child_raw in node_raw.get("next_steps", []):
        _traverse(child_raw, marks, budget, depth + 1, nodes, edges, node.id, blocked_paths)

    return node


def _traverse_option(
    option: dict,
    marks: float,
    budget: float,
    depth: int,
    nodes: list[JsonPathNode],
    edges: list[JsonPathEdge],
    parent_id: int | None,
    blocked_paths: list[dict],
) -> JsonPathNode | None:
    """Handle 'stream' type options that have next_steps."""
    marks_ok = marks >= int(option.get("marks_required", 0))
    budget_ok = budget >= _budget_min(option)

    if not marks_ok or not budget_ok:
        blocked_paths.append({
            "reason": (
                f"Marks < {option.get('marks_required', 0)}%"
                if not marks_ok
                else f"Budget < ₹{_budget_min(option):,}"
            ),
            **option,
        })
        return None

    parent_node = _make_node(option, depth)
    nodes.append(parent_node)
    if parent_id is not None:
        edges.append(JsonPathEdge(from_node=parent_id, to_node=parent_node.id))

    for child_raw in option.get("next_steps", []):
        _traverse(child_raw, marks, budget, depth + 1, nodes, edges, parent_node.id, blocked_paths)

    return parent_node


# ── Public entry point ───────────────────────────────────────────────────────

def build_json_path(inp: ExploreInput) -> JsonPathResponse:
    _reset()
    tree = load_career_tree()

    stream_data = tree.get(inp.stream)
    if not stream_data:
        available = list(tree.keys())
        raise ValueError(f"Stream '{inp.stream}' not found. Available: {available}")

    all_nodes: list[JsonPathNode] = []
    all_edges: list[JsonPathEdge] = []
    blocked: list[dict] = []

    # Root node — the stream itself
    root = JsonPathNode(
        id=_next_id(),
        raw_id=0,
        title=inp.stream,
        description=f"You selected {inp.stream} stream with {inp.marks}% marks and ₹{inp.budget:,} annual budget.",
        type="stream",
        cost="N/A",
        exams=[],
        colleges=[],
        career_outcomes=[],
        marks_required=0,
        budget_min=0,
        depth=0,
    )
    all_nodes.append(root)

    for substream in stream_data.get("substreams", []):
        sub_name = substream.get("name", "")

        # Substream node
        sub_node = JsonPathNode(
            id=_next_id(),
            raw_id=0,
            title=f"{inp.stream} — {sub_name}",
            description=f"Substream: {sub_name} | After: {substream.get('after_stage', '12th')}",
            type="substream",
            cost="N/A",
            exams=[],
            colleges=[],
            career_outcomes=[],
            marks_required=0,
            budget_min=0,
            depth=1,
        )
        all_nodes.append(sub_node)
        all_edges.append(JsonPathEdge(from_node=root.id, to_node=sub_node.id))

        for option in substream.get("options", []):
            o_type = option.get("type", "option")
            if o_type == "stream":
                _traverse_option(option, inp.marks, inp.budget, 2, all_nodes, all_edges, sub_node.id, blocked)
            else:
                _traverse(option, inp.marks, inp.budget, 2, all_nodes, all_edges, sub_node.id, blocked)

    # ── Alternatives: blocked paths within budget*1.5 ────────────────────────
    alt_nodes: list[JsonPathNode] = []
    alt_edges: list[JsonPathEdge] = []
    _reset()

    seen_alt_names: set[str] = set()
    for b in blocked:
        name = b.get("name", "")
        if name in seen_alt_names:
            continue
        seen_alt_names.add(name)
        # Check if reachable with 50% more budget or 10% more marks
        marks_ok = inp.marks >= int(b.get("marks_required", 0))
        budget_stretch = inp.budget * 1.5 >= _budget_min(b)
        marks_stretch = (inp.marks + 10) >= int(b.get("marks_required", 0))
        if (marks_ok and budget_stretch) or (marks_stretch and inp.budget >= _budget_min(b)):
            alt = _make_node(b, 0)
            alt.description = f"[ALTERNATIVE — {b['reason']}] " + alt.description
            alt_nodes.append(alt)

    # ── Summary ──────────────────────────────────────────────────────────────
    degree_count = sum(1 for n in all_nodes if n.type in ("degree", "exam"))
    summary = (
        f"Found {degree_count} eligible paths in {inp.stream} stream for "
        f"{inp.marks}% marks and ₹{inp.budget:,}/year budget. "
        f"{len(alt_nodes)} alternative paths available if you stretch budget or improve marks."
    )

    return JsonPathResponse(
        nodes=all_nodes,
        edges=[{"from": e.from_node, "to": e.to_node} for e in all_edges],
        alternatives=alt_nodes,
        summary=summary,
    )


def build_branch(
    stream: str,
    from_node_title: str,
    marks: float,
    budget: float,
) -> JsonPathResponse:
    """Return PG / specialisation options branching from a given node title."""
    _reset()

    PG_MAP: dict[str, list[dict]] = {
        "MBBS": [
            {"name": "MD/MS", "type": "degree", "eligibility": "MBBS + NEET PG", "marks_required": 0,
             "average_cost_range": "₹5L-30L", "budget_min": 500000,
             "top_colleges": ["AIIMS Delhi", "PGI Chandigarh", "JIPMER"],
             "entrance_exams": ["NEET PG"], "career_outcomes": ["Specialist Doctor", "Consultant"]},
            {"name": "DNB / Diploma", "type": "degree", "eligibility": "MBBS", "marks_required": 0,
             "average_cost_range": "₹2L-10L", "budget_min": 200000,
             "top_colleges": ["NBE Accredited Hospitals"],
             "entrance_exams": ["NEET PG", "DNB CET"], "career_outcomes": ["Specialist", "Hospital Consultant"]},
        ],
        "BTech CSE": [
            {"name": "MTech / MS", "type": "degree", "eligibility": "BTech GATE", "marks_required": 0,
             "average_cost_range": "₹2L-10L", "budget_min": 200000,
             "top_colleges": ["IITs", "NITs", "IIITs"],
             "entrance_exams": ["GATE"], "career_outcomes": ["Research Engineer", "Principal Engineer"]},
            {"name": "MBA (IIM)", "type": "degree", "eligibility": "CAT", "marks_required": 0,
             "average_cost_range": "₹15L-30L", "budget_min": 1500000,
             "top_colleges": ["IIM A", "IIM B", "IIM C"],
             "entrance_exams": ["CAT", "XAT"], "career_outcomes": ["Product Manager", "Strategy Consultant"]},
        ],
        "BBA": [
            {"name": "MBA", "type": "degree", "eligibility": "CAT/XAT", "marks_required": 0,
             "average_cost_range": "₹10L-25L", "budget_min": 1000000,
             "top_colleges": ["IIM Ahmedabad", "IIM Bangalore", "XLRI"],
             "entrance_exams": ["CAT", "XAT", "GMAT"],
             "career_outcomes": ["Management Consultant", "Marketing Manager"]},
        ],
        "BA Economics": [
            {"name": "MA Economics", "type": "degree", "eligibility": "BA Economics 55%+", "marks_required": 55,
             "average_cost_range": "₹1L-4L", "budget_min": 100000,
             "top_colleges": ["DSE", "ISI Kolkata", "JNU"],
             "entrance_exams": ["DSE Entrance", "JNU Entrance"],
             "career_outcomes": ["Economist", "Policy Analyst", "IES Officer"]},
        ],
        "BA LLB": [
            {"name": "LLM", "type": "degree", "eligibility": "LLB 55%+", "marks_required": 55,
             "average_cost_range": "₹3L-12L", "budget_min": 300000,
             "top_colleges": ["NLU Delhi", "NLSIU Bangalore", "Oxford (UK)"],
             "entrance_exams": ["CLAT PG", "Institution-specific"],
             "career_outcomes": ["Senior Advocate", "Legal Academic", "International Law"]},
        ],
    }

    # Find best match in PG_MAP
    match_key = None
    for key in PG_MAP:
        if key.lower() in from_node_title.lower() or from_node_title.lower() in key.lower():
            match_key = key
            break

    if not match_key:
        # Generic PG branch
        pg_options = [
            {"name": "Postgraduate Degree", "type": "degree", "eligibility": "Undergraduate degree",
             "marks_required": 0, "average_cost_range": "₹2L-15L", "budget_min": 200000,
             "top_colleges": ["Central Universities", "IITs/NITs", "Top Private Universities"],
             "entrance_exams": ["GATE", "CAT", "CUET PG", "University Entrance"],
             "career_outcomes": ["Senior Specialist", "Researcher", "Professor"]},
        ]
    else:
        pg_options = PG_MAP[match_key]

    nodes: list[JsonPathNode] = []
    edges: list[JsonPathEdge] = []

    branch_root = JsonPathNode(
        id=_next_id(), raw_id=0,
        title=f"After {from_node_title}",
        description="Postgraduate & specialisation options",
        type="branch_root", cost="N/A", exams=[], colleges=[],
        career_outcomes=[], marks_required=0, budget_min=0, depth=0,
    )
    nodes.append(branch_root)

    for pg in pg_options:
        n = _traverse(pg, marks, budget, 1, nodes, edges, branch_root.id, [])
        if n is None:
            pg_copy = dict(pg)
            pg_copy["description"] = f"[Needs higher budget] {pg.get('eligibility', '')}"
            node = _make_node(pg_copy, 1)
            node.description = f"Requires ₹{_budget_min(pg):,}/yr — stretch your budget"
            nodes.append(node)
            edges.append(JsonPathEdge(from_node=branch_root.id, to_node=node.id))

    return JsonPathResponse(
        nodes=nodes,
        edges=[{"from": e.from_node, "to": e.to_node} for e in edges],
        alternatives=[],
        summary=f"Postgraduate paths branching from {from_node_title}.",
    )
