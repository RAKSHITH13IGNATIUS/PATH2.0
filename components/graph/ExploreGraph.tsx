"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background, Controls, MiniMap, useNodesState, useEdgesState,
  Node, Edge, MarkerType, BackgroundVariant, Connection, addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { JsonPathResponse, JsonPathNode, ExploreInput } from "@/services/exploreApi";
import ExploreNodeCard from "./ExploreNodeCard";
import ExploreDetailPanel from "./ExploreDetailPanel";

// ── Dagre auto-layout ─────────────────────────────────────────────────────────
const NODE_W = 280;
const NODE_H = 120;

function layoutGraph(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

// ── RF node/edge builders ─────────────────────────────────────────────────────
function toRFNodes(pathNodes: JsonPathNode[], isAlt = false): Node[] {
  return pathNodes.map((n) => ({
    id: String(n.id),
    type: "exploreNode",
    position: { x: 0, y: 0 },
    data: { node: n, isAlt },
    style: { padding: 0, background: "transparent", border: "none", width: NODE_W },
  }));
}

function toRFEdges(edges: { from: number; to: number }[], prefix = ""): Edge[] {
  return edges.map((e, i) => ({
    id: `${prefix}e${e.from}-${e.to}-${i}`,
    source: String(e.from),
    target: String(e.to),
    animated: true,
    style: { stroke: "rgba(124,58,237,0.6)", strokeWidth: 1.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(124,58,237,0.6)" },
  }));
}

const nodeTypes = { exploreNode: ExploreNodeCard };

interface Props {
  pathData: JsonPathResponse;
  exploreInput: ExploreInput;
  onBranch: (nodeTitle: string) => void;
  selectedTitles: string[];
  onSelectTitle: (title: string) => void;
}

export default function ExploreGraph({
  pathData, exploreInput, onBranch, selectedTitles, onSelectTitle,
}: Props) {
  const [activeNode, setActiveNode] = useState<JsonPathNode | null>(null);
  const [showAlts, setShowAlts] = useState(false);

  const baseRFNodes = useMemo(() => toRFNodes(pathData.nodes), [pathData.nodes]);
  const baseRFEdges = useMemo(() => toRFEdges(pathData.edges), [pathData.edges]);

  const altRFNodes = useMemo(
    () => pathData.alternatives.map((n) => ({
      ...toRFNodes([n], true)[0],
      id: `alt-${n.id}`,
    })),
    [pathData.alternatives]
  );

  const initialNodes = useMemo(() => layoutGraph(baseRFNodes, baseRFEdges), [baseRFNodes, baseRFEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseRFEdges);

  useEffect(() => {
    const laid = layoutGraph(baseRFNodes, baseRFEdges);
    setNodes(laid);
    setEdges(baseRFEdges);
    setActiveNode(null);
  }, [pathData]);

  const onConnect = useCallback(
    (c: Connection) => setEdges((es) => addEdge(c, es)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, rfNode: Node) => {
    const pn: JsonPathNode = rfNode.data.node;
    setActiveNode(pn);
  };

  const toggleAlts = () => {
    if (!showAlts) {
      // Inject alt nodes to the right side
      const altLaid = altRFNodes.map((n, i) => ({
        ...n,
        position: { x: 1400 + (i % 2) * 310, y: i * 160 },
      }));
      setNodes((prev) => {
        const altIds = new Set(altLaid.map((n) => n.id));
        return [...prev.filter((n) => !altIds.has(n.id)), ...altLaid];
      });
    } else {
      const altIds = new Set(altRFNodes.map((n) => n.id));
      setNodes((prev) => prev.filter((n) => !altIds.has(n.id)));
    }
    setShowAlts((v) => !v);
  };

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(124,58,237,0.12)" />
        <Controls className="!bottom-4 !left-4" />
        <MiniMap
          nodeColor={() => "rgba(124,58,237,0.4)"}
          maskColor="rgba(5,5,15,0.85)"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(124,58,237,0.2)" }}
        />
      </ReactFlow>

      {/* Alternatives toggle */}
      {pathData.alternatives.length > 0 && (
        <button
          onClick={toggleAlts}
          className={`absolute bottom-20 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
            ${showAlts
              ? "bg-purple-600/40 border border-purple-400/60 text-purple-200"
              : "glass border border-purple-500/25 text-purple-300 hover:bg-purple-500/15"}`}
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          {showAlts ? "Hide" : "Show"} {pathData.alternatives.length} Alternative{pathData.alternatives.length !== 1 ? "s" : ""}
        </button>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 z-10 glass rounded-xl px-3 py-2 border border-purple-500/15">
        <div className="text-[9px] font-bold uppercase tracking-wider text-purple-400/60 mb-1.5">Legend</div>
        {[
          { color: "bg-violet-400", label: "Stream" },
          { color: "bg-purple-400", label: "Substream" },
          { color: "bg-indigo-400", label: "Degree" },
          { color: "bg-blue-400", label: "Exam" },
          { color: "bg-yellow-400", label: "Alternative" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 mb-1">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[9px] text-[#8b84b0]">{label}</span>
          </div>
        ))}
      </div>

      {/* Summary banner */}
      {pathData.summary && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 max-w-sm">
          <div className="glass rounded-xl px-4 py-2 border border-purple-500/20 text-[10px] text-[#8b84b0] text-center leading-relaxed">
            {pathData.summary}
          </div>
        </div>
      )}

      {/* Detail panel */}
      {activeNode && (
        <ExploreDetailPanel
          node={activeNode}
          onClose={() => setActiveNode(null)}
          onBranch={() => {
            onBranch(activeNode.title);
            setActiveNode(null);
          }}
          onSelect={onSelectTitle}
          isSelected={selectedTitles.includes(activeNode.title)}
        />
      )}
    </div>
  );
}
