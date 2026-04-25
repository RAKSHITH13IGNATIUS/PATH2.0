"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { PathNode } from "@/services/api";
import { GraduationCap, BookOpen, FlaskConical, Building2, TrendingUp } from "lucide-react";

const TYPE_ICON: Record<string, React.ElementType> = {
  stage: GraduationCap,
  education: BookOpen,
  exam: FlaskConical,
  college: Building2,
  career: TrendingUp,
};

const TYPE_COLOR: Record<string, string> = {
  stage: "text-violet-300",
  education: "text-purple-300",
  exam: "text-fuchsia-300",
  college: "text-indigo-300",
  career: "text-pink-300",
};

export default function PathNodeCard({ data }: NodeProps<{ node: PathNode }>) {
  const { node } = data;
  const Icon = TYPE_ICON[node.type] ?? GraduationCap;
  const colorClass = TYPE_COLOR[node.type] ?? "text-purple-300";

  return (
    <div className="px-4 py-4 w-[280px] select-none" style={{ position: "relative", overflow: "hidden" }}>
      {/* Shimmer rim at top */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.6), transparent)",
        pointerEvents: "none",
      }} />

      <Handle type="target" position={Position.Left} style={{ background: "rgba(161,0,255,0.85)", border: "2px solid rgba(192,132,252,0.4)", width: 10, height: 10 }} />

      <div className="flex items-start gap-3">
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
          background: "rgba(161,0,255,0.12)",
          border: "1px solid rgba(161,0,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 10px rgba(161,0,255,0.15)",
        }}>
          <Icon size={15} className={colorClass} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(192,132,252,0.65)", marginBottom: 2 }}>
            {node.type}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0eaff", lineHeight: 1.35 }}>{node.title}</div>
          <div style={{ fontSize: 11, color: "#8b84b0", marginTop: 4, lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {node.description}
          </div>
        </div>
      </div>

      {/* Bottom action hint */}
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(161,0,255,0.1)", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 9, color: "rgba(161,0,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>click to expand →</span>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: "rgba(161,0,255,0.85)", border: "2px solid rgba(192,132,252,0.4)", width: 10, height: 10 }} />
    </div>
  );
}
