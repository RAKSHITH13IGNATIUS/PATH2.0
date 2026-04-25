"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { PathResponse, PathNode, PathEdge, UserInput } from "@/services/api";
import PathNodeCard from "./PathNodeCard";
import NodeDetailPanel from "./NodeDetailPanel";

const NODE_COLORS: Record<string, string> = {
  stage:     "#1e1040",
  education: "#1a0f38",
  exam:      "#120b2e",
  college:   "#0f0d2a",
  career:    "#160d3a",
};

const NODE_BORDER: Record<string, string> = {
  stage:     "rgba(168,85,247,0.6)",
  education: "rgba(124,58,237,0.7)",
  exam:      "rgba(192,132,252,0.5)",
  college:   "rgba(139,92,246,0.6)",
  career:    "rgba(167,139,250,0.6)",
};

function buildRFNodes(pathNodes: PathNode[], offset = 0): Node[] {
  return pathNodes.map((n, i) => ({
    id: String(n.id + offset),
    type: "pathNode",
    position: { x: 320 * i, y: 0 },
    data: { node: n },
    style: {
      background: NODE_COLORS[n.type] ?? "#0d0d1a",
      border: `1.5px solid ${NODE_BORDER[n.type] ?? "rgba(124,58,237,0.4)"}`,
      borderRadius: 16,
      padding: 0,
      width: 280,
    },
  }));
}

function buildRFEdges(pathEdges: PathEdge[], offset = 0): Edge[] {
  return pathEdges.map((e, i) => ({
    id: `e-${e.from + offset}-${e.to + offset}-${i}`,
    source: String(e.from + offset),
    target: String(e.to + offset),
    animated: true,
    style: { stroke: "rgba(124,58,237,0.7)", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(124,58,237,0.7)" },
  }));
}

const nodeTypes = { pathNode: PathNodeCard };

interface Props {
  pathData: PathResponse;
  userInput: UserInput;
  onBranch: (nodeId: number, nodeTitle: string) => void;
}

export default function PathGraph({ pathData, userInput, onBranch }: Props) {
  const [selectedNode, setSelectedNode]   = useState<PathNode | null>(null);
  const [editingNode, setEditingNode]     = useState<PathNode | null>(null);
  const [editedNodes, setEditedNodes]     = useState<Record<number, Partial<PathNode>>>({});

  const initialRFNodes = useMemo(() => buildRFNodes(pathData.nodes), [pathData.nodes]);
  const initialRFEdges = useMemo(() => buildRFEdges(pathData.edges), [pathData.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialRFNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialRFEdges);

  useEffect(() => {
    setNodes(buildRFNodes(pathData.nodes));
    setEdges(buildRFEdges(pathData.edges));
    setSelectedNode(null);
    setEditingNode(null);
  }, [pathData]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, rfNode: Node) => {
    const pathNode: PathNode = rfNode.data.node;
    const merged = { ...pathNode, ...(editedNodes[pathNode.id] ?? {}) };
    setSelectedNode(merged);
  };

  const handleSaveEdit = (nodeId: number, changes: Partial<PathNode>) => {
    setEditedNodes((prev) => ({ ...prev, [nodeId]: { ...(prev[nodeId] ?? {}), ...changes } }));
    setSelectedNode((prev) => (prev ? { ...prev, ...changes } : prev));
    setEditingNode(null);
  };

  // Delete selected node + its connected edges
  const handleDeleteNode = (nodeId: number) => {
    const idStr = String(nodeId);
    setNodes((ns) => ns.filter((n) => n.id !== idStr));
    setEdges((es) => es.filter((e) => e.source !== idStr && e.target !== idStr));
    setSelectedNode(null);
  };

  return (
    // Flex row — when panel open the graph shrinks, no overlap
    <div className="flex w-full h-full">

      {/* Graph area */}
      <div className="flex-1 relative min-w-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="rgba(161,0,255,0.3)"
          />
          <Controls className="!bottom-4 !left-4" showInteractiveButton={false} />
          <MiniMap
            nodeColor={(n) => NODE_COLORS[n.data?.node?.type] ?? "#1a1040"}
            maskColor="rgba(5,5,15,0.8)"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(124,58,237,0.3)" }}
          />

          {/* Top-right: node + edge count badge */}
          <Panel position="top-right">
            <div style={{
              display: "flex", gap: 8, padding: "6px 12px",
              background: "rgba(13,10,28,0.85)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(161,0,255,0.25)", borderRadius: 20,
              fontSize: 11, color: "#9a8ca2", userSelect: "none",
            }}>
              <span style={{ color: "#c084fc", fontWeight: 700 }}>{nodes.length}</span>
              <span>nodes</span>
              <span style={{ color: "rgba(161,0,255,0.4)" }}>·</span>
              <span style={{ color: "#c084fc", fontWeight: 700 }}>{edges.length}</span>
              <span>connections</span>
            </div>
          </Panel>

          {/* Bottom-center: hint when nothing selected */}
          {!selectedNode && (
            <Panel position="bottom-center">
              <div style={{
                padding: "5px 14px", marginBottom: 8,
                background: "rgba(13,10,28,0.75)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(161,0,255,0.2)", borderRadius: 20,
                fontSize: 11, color: "#6b6278", userSelect: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ color: "rgba(161,0,255,0.6)", fontSize: 13 }}>⬡</span>
                Click a node to explore · Drag to rearrange · Scroll to zoom
              </div>
            </Panel>
          )}
        </ReactFlow>

        {/* Alternative paths */}
        {pathData.alternative_paths.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {pathData.alternative_paths.map((alt, i) => (
              <button
                key={i}
                onClick={() => {
                  const altNodes = buildRFNodes(alt.nodes, 1000 + i * 100);
                  altNodes.forEach((n) => { n.position.y = 280; });
                  const altEdges = buildRFEdges(alt.edges, 1000 + i * 100);
                  setNodes((prev) => {
                    const ids = new Set(altNodes.map((n) => n.id));
                    return [...prev.filter((n) => !ids.has(n.id)), ...altNodes];
                  });
                  setEdges((prev) => [...prev, ...altEdges]);
                }}
                className="px-3 py-1.5 rounded-lg glass border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-all"
              >
                + {alt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel — sits beside graph, no overlay */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          editedData={editedNodes[selectedNode.id]}
          onClose={() => setSelectedNode(null)}
          onEdit={() => setEditingNode(selectedNode)}
          onSave={handleSaveEdit}
          onBranch={() => onBranch(selectedNode.id, selectedNode.title)}
          onDelete={() => handleDeleteNode(selectedNode.id)}
          isEditing={editingNode?.id === selectedNode.id}
        />
      )}
    </div>
  );
}
