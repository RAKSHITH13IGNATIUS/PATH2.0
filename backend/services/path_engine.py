import pandas as pd
from typing import Optional
from models.schemas import UserInput, PathNode, College, AlternativePath, PathResponse
from services.data_loader import (
    load_dataset,
    get_programs_for_career,
    get_exams_for_program,
    get_eligible_stream,
    get_resources,
)

# District aliases for fuzzy matching
DISTRICT_ALIASES = {
    "bangalore": "Bengaluru Urban",
    "bengaluru": "Bengaluru Urban",
    "bengaluru urban": "Bengaluru Urban",
    "bengaluru rural": "Bengaluru Rural",
    "bangalore rural": "Bengaluru Rural",
    "mysore": "Mysuru",
    "mysuru": "Mysuru",
    "hubli": "Dharwad",
    "dharwad": "Dharwad",
    "mangalore": "Dakshina Kannada",
    "mangaluru": "Dakshina Kannada",
    "dakshina kannada": "Dakshina Kannada",
    "belgaum": "Belagavi",
    "belagavi": "Belagavi",
    "gulbarga": "Kalaburagi",
    "kalaburagi": "Kalaburagi",
    "tumkur": "Tumakuru",
    "tumakuru": "Tumakuru",
    "shimoga": "Shivamogga",
    "shivamogga": "Shivamogga",
    "bellary": "Ballari",
    "ballari": "Ballari",
    "bijapur": "Vijayapura",
    "vijayapura": "Vijayapura",
    "udupi": "Udupi",
    "hassan": "Hassan",
    "chitradurga": "Chitradurga",
    "davanagere": "Davanagere",
    "raichur": "Raichur",
    "bidar": "Bidar",
    "gadag": "Gadag",
    "haveri": "Haveri",
    "koppal": "Koppal",
    "mandya": "Mandya",
    "chikmagalur": "Chikkamagaluru",
    "chikkamagaluru": "Chikkamagaluru",
    "kolar": "Kolar",
    "kodagu": "Kodagu",
    "coorg": "Kodagu",
    "chikkaballapura": "Chikkaballapura",
    "chamarajanagar": "Chamarajanagar",
    "yadgir": "Yadgir",
    "vijayanagara": "Vijayanagara",
    "uttara kannada": "Uttara Kannada",
    "bagalkote": "Bagalkote",
}


def normalize_district(location: str) -> Optional[str]:
    loc = location.lower().strip()
    return DISTRICT_ALIASES.get(loc)


def score_college(row: pd.Series, budget: float, district: Optional[str], marks: float) -> float:
    score = 0.0
    # Budget fit (lower fee = better score for tight budgets)
    fee = row["fee"]
    if fee <= budget:
        score += 40
        if fee <= budget * 0.6:
            score += 10  # well within budget
    else:
        score -= 20  # over budget

    # Location match
    if district and row["district"] == district:
        score += 25
    elif district and district.split()[0] in row["district"]:
        score += 10

    # Tier bonus
    tier = str(row["tier"]).strip()
    if tier == "Tier 1":
        score += 20
    elif tier == "Tier 2":
        score += 10

    # Package bonus
    if row["avg_package"] > 500000:
        score += 10

    return score


def filter_colleges(
    df: pd.DataFrame,
    programs: list[str],
    budget: float,
    district: Optional[str],
    marks: float,
    max_results: int = 6,
) -> list[College]:
    filtered = df[df["program"].isin(programs)].copy()
    if filtered.empty:
        # fallback: partial match
        pattern = "|".join([p.split(" ")[0] for p in programs if p])
        filtered = df[df["program"].str.contains(pattern, case=False, na=False)].copy()

    if filtered.empty:
        return []

    # Score and sort
    filtered["_score"] = filtered.apply(
        lambda row: score_college(row, budget, district, marks), axis=1
    )
    filtered = filtered.sort_values("_score", ascending=False).head(max_results * 3)

    colleges = []
    seen_names = set()
    for _, row in filtered.iterrows():
        if row["name"] in seen_names:
            continue
        seen_names.add(row["name"])
        fee_val = float(row["fee"]) if pd.notna(row["fee"]) else 0
        mgmt_fee = float(row["management_fee"]) if pd.notna(row["management_fee"]) else 0
        avg_pkg = float(row["avg_package"]) if pd.notna(row["avg_package"]) else 0
        cr = row["closing_rank"]
        colleges.append(College(
            aishe_code=str(row["aishe_code"]),
            name=str(row["name"]),
            district=str(row["district"]),
            location_type=str(row["location_type"]),
            program=str(row["program"]),
            entrance_exam=str(row["entrance_exam"]),
            quota=str(row["quota"]),
            closing_rank=int(cr) if pd.notna(cr) else "N/A",
            fee=fee_val,
            management_fee=mgmt_fee,
            avg_package=avg_pkg,
            tier=str(row["tier"]),
            university=str(row["university_name"]),
            website=str(row["website"]),
        ))
        if len(colleges) >= max_results:
            break
    return colleges


def build_path(user: UserInput) -> PathResponse:
    df = load_dataset()
    stream_info = get_eligible_stream(user.marks, user.grade)
    programs = get_programs_for_career(user.career_interest)
    district = normalize_district(user.location)
    resources = get_resources(user.career_interest)

    nodes: list[PathNode] = []
    edges: list[dict] = []

    # ── Node 1: Current Academic Stage ──────────────────────────────────────
    node_id = 1
    nodes.append(PathNode(
        id=node_id,
        title=f"Grade {user.grade} - {stream_info['stream']}",
        description=f"Your current academic stage. {stream_info['detail']}. "
                    f"With {user.marks}% marks you qualify for {stream_info['stream']}.",
        type="stage",
        colleges=[],
        cost="Current Stage",
        eligibility=f"Marks: {user.marks}% | Grade: {user.grade}",
        exams=[],
        resources=["NCERT Textbooks", "Previous Year Papers"],
    ))

    # ── Node 2: PUC / Intermediate (only for 10th graders) ──────────────────
    if user.grade == "10th":
        node_id = 2
        puc_stream = "Science (PCM)" if user.marks >= 60 else "Commerce"
        if "medical" in user.career_interest.lower() or "nursing" in user.career_interest.lower():
            puc_stream = "Science (PCB)"
        nodes.append(PathNode(
            id=node_id,
            title=f"PUC - {puc_stream}",
            description=f"Pursue {puc_stream} in PUC to qualify for your target programs. "
                        f"Focus on board exams and entrance exam preparation.",
            type="education",
            colleges=[],
            cost="₹15,000 - ₹40,000/year (Govt: Free)",
            eligibility=f"Minimum 50% in 10th. Your score: {user.marks}%",
            exams=["Karnataka SSLC Board", "PUC Board Exams"],
            resources=["NCERT Std 11-12", "PUE Board Prep", "Khan Academy"],
        ))
        edges.append({"from": 1, "to": 2})
        prev_id = 2
    else:
        prev_id = 1

    # ── Node 3: Entrance Exam Preparation ───────────────────────────────────
    exams = get_exams_for_program(programs[0] if programs else "B.E.")
    node_id = prev_id + 1
    nodes.append(PathNode(
        id=node_id,
        title="Entrance Exam Preparation",
        description=f"Prepare for {', '.join(exams[:3])} to secure admission to your target programs. "
                    f"Coaching and self-study are both valid paths.",
        type="exam",
        colleges=[],
        cost="₹30,000 - ₹1,50,000 (Coaching optional)",
        eligibility=f"Completed {user.grade} with {user.marks}%. {stream_info['detail']}.",
        exams=exams,
        resources=resources[:2] + ["NTA Official Website", "Previous Year Question Papers"],
    ))
    edges.append({"from": prev_id, "to": node_id})
    exam_node_id = node_id

    # ── Node 4: Degree Program ───────────────────────────────────────────────
    node_id = exam_node_id + 1
    primary_programs = programs[:3]
    colleges = filter_colleges(df, primary_programs, user.budget, district, user.marks, max_results=6)

    avg_fee = sum(c.fee for c in colleges) / len(colleges) if colleges else user.budget * 0.7
    cost_str = f"₹{int(avg_fee):,}/year" if colleges else f"₹{int(user.budget * 0.7):,}/year (estimated)"

    nodes.append(PathNode(
        id=node_id,
        title=f"Degree - {programs[0] if programs else 'B.E.'}",
        description=f"Enroll in {programs[0] if programs else 'your chosen degree'} at a college in "
                    f"{district or user.location}. "
                    f"{'Top colleges within your budget are listed.' if colleges else 'Expand your location or budget for more options.'}",
        type="college",
        colleges=colleges,
        cost=cost_str,
        eligibility=f"Entrance exam qualifying marks + {user.marks}% in {user.grade}",
        exams=exams,
        resources=resources,
    ))
    edges.append({"from": exam_node_id, "to": node_id})
    degree_node_id = node_id

    # ── Node 5: Career / Placement ───────────────────────────────────────────
    node_id = degree_node_id + 1
    avg_pkg = (
        sum(c.avg_package for c in colleges if c.avg_package > 0) / max(len([c for c in colleges if c.avg_package > 0]), 1)
        if colleges else 400000
    )
    nodes.append(PathNode(
        id=node_id,
        title="Career & Placement",
        description=f"Average placement package for this stream in Karnataka: ₹{int(avg_pkg):,}/year. "
                    f"Top employers hire from Tier 1 & Tier 2 colleges through campus drives.",
        type="career",
        colleges=[],
        cost=f"Expected CTC: ₹{int(avg_pkg):,}/year",
        eligibility="Degree completion + internship/projects",
        exams=["GATE (for M.Tech)", "MBA Entrance (optional)", "Industry Certifications"],
        resources=resources[-2:] + ["LinkedIn", "Internshala", "Naukri.com"],
    ))
    edges.append({"from": degree_node_id, "to": node_id})

    # ── Alternative Path 1: Different Location ───────────────────────────────
    alt_programs = programs[1:4] if len(programs) > 1 else programs
    alt_colleges = filter_colleges(df, alt_programs, user.budget * 1.2, None, user.marks, max_results=4)

    alt_nodes = [
        PathNode(
            id=10,
            title=f"Alt. Degree - {alt_programs[0] if alt_programs else programs[0]}",
            description=f"Explore {alt_programs[0] if alt_programs else programs[0]} across all Karnataka districts. "
                        f"Wider search gives more budget-friendly options.",
            type="college",
            colleges=alt_colleges,
            cost=f"₹{int(min((c.fee for c in alt_colleges), default=user.budget)):,} - ₹{int(max((c.fee for c in alt_colleges), default=user.budget)):,}/year",
            eligibility=f"{user.marks}% in {user.grade}",
            exams=get_exams_for_program(alt_programs[0] if alt_programs else "B.E."),
            resources=resources,
        )
    ]

    # ── Alternative Path 2: Budget stretch (management quota) ────────────────
    mgmt_colleges = filter_colleges(df, programs[:2], user.budget * 2, district, user.marks, max_results=4)
    for c in mgmt_colleges:
        c.fee = c.management_fee  # show management quota fee

    alt_path2_nodes = [
        PathNode(
            id=20,
            title=f"Management Quota - {programs[0] if programs else 'B.E.'}",
            description="Management quota seats are available at a higher fee without entrance exam ranks. "
                        "Good fallback if entrance exam rank is not sufficient.",
            type="college",
            colleges=mgmt_colleges,
            cost=f"₹{int(min((c.management_fee for c in mgmt_colleges), default=user.budget)):,} - ₹{int(max((c.management_fee for c in mgmt_colleges), default=user.budget)):,}/year (Mgmt Quota)",
            eligibility=f"{user.marks}% + Management Quota Application",
            exams=["Direct Application"],
            resources=resources,
        )
    ]

    alternative_paths = [
        AlternativePath(
            label="Explore All Karnataka Districts",
            nodes=alt_nodes,
            edges=[],
        ),
        AlternativePath(
            label="Management Quota Seats",
            nodes=alt_path2_nodes,
            edges=[],
        ),
    ]

    summary = (
        f"Based on your {user.grade} result of {user.marks}% and budget of ₹{int(user.budget):,}/year, "
        f"we found {len(colleges)} colleges in {district or user.location} matching your interest in "
        f"{user.career_interest}. "
        f"{'Your marks qualify you for top-tier programs.' if user.marks >= 75 else 'Focus on entrance exam preparation to improve your options.'}"
    )

    return PathResponse(nodes=nodes, edges=edges, alternative_paths=alternative_paths, summary=summary)


def build_branch_path(user: UserInput, from_node_id: int, from_node_title: str) -> PathResponse:
    df = load_dataset()
    district = normalize_district(user.location)
    resources = get_resources(user.career_interest)

    # Branch: postgraduate options from degree node
    pg_programs = []
    ci = user.career_interest.lower()
    if "engineering" in ci or "computer" in ci or "technology" in ci:
        pg_programs = ["M.Tech", "MBA", "M.Sc Computer Science"]
    elif "medical" in ci:
        pg_programs = ["MD", "MS", "MPT (Master of Physiotherapy)", "M.Sc Nursing"]
    elif "commerce" in ci:
        pg_programs = ["MBA", "M.Com", "CA"]
    elif "law" in ci:
        pg_programs = ["LLM", "Judicial Services"]
    else:
        pg_programs = ["MBA", "M.Sc", "M.A."]

    pg_colleges = filter_colleges(df, pg_programs, user.budget * 1.5, district, user.marks, max_results=5)

    nodes = [
        PathNode(
            id=100,
            title="Postgraduate Studies",
            description=f"After your degree, consider {pg_programs[0]} for career advancement. "
                        f"PG degrees significantly increase placement packages.",
            type="education",
            colleges=pg_colleges,
            cost=f"₹50,000 - ₹3,00,000/year",
            eligibility=f"Undergraduate degree with 50%+",
            exams=["GATE", "PGCET", "CAT/MAT/XAT", "University Entrance"],
            resources=resources,
        ),
        PathNode(
            id=101,
            title="Industry Certification",
            description="Industry certifications (AWS, Google, Cisco, etc.) boost employability immediately after graduation.",
            type="career",
            colleges=[],
            cost="₹10,000 - ₹80,000 (one-time)",
            eligibility="Open to all graduates",
            exams=["Certification Exams (vendor-specific)"],
            resources=["Coursera", "Udemy", "edX", "LinkedIn Learning"],
        ),
    ]

    return PathResponse(
        nodes=nodes,
        edges=[{"from": 100, "to": 101}],
        alternative_paths=[],
        summary=f"Branching from '{from_node_title}': Postgraduate and certification paths.",
    )
