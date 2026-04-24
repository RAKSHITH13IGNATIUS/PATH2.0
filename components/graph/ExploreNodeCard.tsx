"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { JsonPathNode } from "@/services/exploreApi";

const TYPE_STYLES: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  stream: {
    bg: "bg-[#120830]",
    border: "border-violet-500/60",
    badge: "bg-violet-500/20 text-violet-300",
    dot: "bg-violet-400",
  },
  substream: {
    bg: "bg-[#0e0a24]",
    border: "border-purple-500/40",
    badge: "bg-purple-500/15 text-purple-300",
    dot: "bg-purple-400",
  },
  degree: {
    bg: "bg-[#0b0920]",
    border: "border-indigo-500/50",
    badge: "bg-indigo-500/20 text-indigo-300",
    dot: "bg-indigo-400",
  },
  exam: {
    bg: "bg-[#0a1020]",
    border: "border-blue-500/50",
    badge: "bg-blue-500/20 text-blue-300",
    dot: "bg-blue-400",
  },
  option: {
    bg: "bg-[#0d0d20]",
    border: "border-purple-400/30",
    badge: "bg-purple-400/15 text-purple-300",
    dot: "bg-purple-300",
  },
  branch_root: {
    bg: "bg-[#120820]",
    border: "border-fuchsia-500/50",
    badge: "bg-fuchsia-500/20 text-fuchsia-300",
    dot: "bg-fuchsia-400",
  },
};

const FALLBACK = {
  bg: "bg-[#0d0d1a]",
  border: "border-purple-500/30",
  badge: "bg-purple-500/15 text-purple-300",
  dot: "bg-purple-400",
};

export default function ExploreNodeCard({ data, selected }: NodeProps<{ node: JsonPathNode; isAlt?: boolean }>) {
  const { node, isAlt } = data;
  const s = TYPE_STYLES[node.type] ?? FALLBACK;

  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 w-[270px] select-none transition-all duration-200
        ${s.bg} ${s.border}
        ${isAlt ? "opacity-60 border-dashed" : ""}
        ${selected ? "ring-2 ring-purple-400/60 shadow-lg shadow-purple-500/20" : ""}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "rgba(124,58,237,0.7)", border: "none", width: 7, height: 7 }}
      />

      {/* Header */}
      <div className="flex items-start gap-2.5 mb-2">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${s.badge}`}>
              {isAlt ? "alt · " : ""}{node.type}
            </span>
            {node.marks_required > 0 && (
              <span className="text-[9px] text-[#8b84b0]">{node.marks_required}%+</span>
            )}
          </div>
          <div className="text-[13px] font-bold text-white leading-snug">{node.title}</div>
        </div>
      </div>

      {/* Cost */}
      {node.cost && node.cost !== "N/A" && (
        <div className="text-[10px] text-purple-300 font-medium mb-1.5">{node.cost}</div>
      )}

      {/* Colleges preview */}
      {node.colleges.length > 0 && (
        <div className="text-[10px] text-[#8b84b0] truncate">
          {node.colleges.slice(0, 2).join(" · ")}
          {node.colleges.length > 2 && ` +${node.colleges.length - 2}`}
        </div>
      )}

      {/* Career outcomes preview */}
      {node.career_outcomes.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {node.career_outcomes.slice(0, 2).map((c) => (
            <span key={c} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#8b84b0]">
              {c}
            </span>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "rgba(124,58,237,0.7)", border: "none", width: 7, height: 7 }}
      />
    </div>
  );
}
