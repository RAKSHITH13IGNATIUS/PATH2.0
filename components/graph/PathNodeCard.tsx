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
    <div className="px-4 py-4 w-[280px] select-none">
      <Handle type="target" position={Position.Left} style={{ background: "rgba(124,58,237,0.7)", border: "none", width: 8, height: 8 }} />

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={16} className={colorClass} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400/70 mb-0.5">
            {node.type}
          </div>
          <div className="text-sm font-bold text-white leading-snug">{node.title}</div>
          <div className="text-[11px] text-[#8b84b0] mt-1 line-clamp-2 leading-relaxed">
            {node.description}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-purple-500/10 flex items-center justify-between">
        <span className="text-[10px] text-purple-300 font-medium">{node.cost}</span>
        {node.colleges.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/25 text-purple-300">
            {node.colleges.length} colleges
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: "rgba(124,58,237,0.7)", border: "none", width: 8, height: 8 }} />
    </div>
  );
}
