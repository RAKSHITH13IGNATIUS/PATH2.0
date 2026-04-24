"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Edit3, Save, GitBranch, ExternalLink,
  GraduationCap, BookOpen, IndianRupee, Target, Star,
} from "lucide-react";
import { JsonPathNode } from "@/services/exploreApi";

interface Props {
  node: JsonPathNode;
  onClose: () => void;
  onBranch: () => void;
  onSelect: (title: string) => void;
  isSelected: boolean;
}

export default function ExploreDetailPanel({ node, onClose, onBranch, onSelect, isSelected }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: node.title, description: node.description, cost: node.cost });

  useEffect(() => {
    setDraft({ title: node.title, description: node.description, cost: node.cost });
    setEditing(false);
  }, [node.id]);

  return (
    <AnimatePresence>
      <motion.aside
        key={node.id}
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="absolute top-0 right-0 h-full w-[400px] glass-strong border-l border-purple-500/20 flex flex-col z-20"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/12">
          <div className="flex items-center gap-2">
            <TypeBadge type={node.type} />
            {node.marks_required > 0 && (
              <span className="text-[9px] text-[#8b84b0] px-2 py-0.5 rounded-full glass border border-purple-500/15">
                {node.marks_required}%+ required
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              title="Mark as selected path"
              onClick={() => onSelect(node.title)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSelected
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "hover:bg-purple-500/15 text-[#8b84b0] hover:text-purple-300"
              }`}
            >
              <Star size={13} fill={isSelected ? "currentColor" : "none"} />
            </button>
            {node.type !== "stream" && node.type !== "substream" && (
              <button
                title="Branch: explore PG options"
                onClick={onBranch}
                className="p-1.5 rounded-lg hover:bg-purple-500/15 text-[#8b84b0] hover:text-purple-300 transition-colors"
              >
                <GitBranch size={13} />
              </button>
            )}
            <button
              onClick={() => setEditing((e) => !e)}
              className="p-1.5 rounded-lg hover:bg-purple-500/15 text-[#8b84b0] hover:text-purple-300 transition-colors"
            >
              {editing ? <Save size={13} /> : <Edit3 size={13} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-500/15 text-[#8b84b0] hover:text-red-400 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Title */}
          {editing ? (
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-purple-400"
            />
          ) : (
            <h2 className="text-lg font-black text-white leading-snug">{draft.title}</h2>
          )}

          {/* Description / Eligibility */}
          <Section icon={Target} label="Eligibility">
            {editing ? (
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={2}
                className="w-full bg-purple-500/10 border border-purple-500/25 rounded-lg px-3 py-2 text-xs text-[#c9c4e8] focus:outline-none focus:border-purple-400 resize-none"
              />
            ) : (
              <p className="text-xs text-[#8b84b0] leading-relaxed">{draft.description}</p>
            )}
          </Section>

          {/* Cost */}
          {node.cost && node.cost !== "N/A" && (
            <Section icon={IndianRupee} label="Cost Range">
              {editing ? (
                <input
                  value={draft.cost}
                  onChange={(e) => setDraft((d) => ({ ...d, cost: e.target.value }))}
                  className="w-full bg-purple-500/10 border border-purple-500/25 rounded-lg px-2 py-1 text-xs text-purple-300 focus:outline-none"
                />
              ) : (
                <span className="text-sm font-bold text-purple-300">{draft.cost}</span>
              )}
              {node.budget_min > 0 && (
                <span className="ml-2 text-[9px] text-[#8b84b0]">(min ₹{(node.budget_min / 100000).toFixed(1)}L/yr)</span>
              )}
            </Section>
          )}

          {/* Exams */}
          {node.exams.length > 0 && (
            <Section icon={BookOpen} label="Entrance Exams">
              <div className="flex flex-wrap gap-1.5">
                {node.exams.map((e) => (
                  <span key={e} className="px-2 py-0.5 rounded-full text-[10px] bg-purple-600/20 border border-purple-500/25 text-purple-300">
                    {e}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Colleges */}
          {node.colleges.length > 0 && (
            <Section icon={GraduationCap} label={`Top Colleges (${node.colleges.length})`}>
              <div className="space-y-1.5">
                {node.colleges.map((c, i) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg glass border border-purple-500/10 hover:border-purple-500/25 transition-colors group"
                  >
                    <span className="text-[9px] text-purple-400/60 font-bold w-4 flex-shrink-0">{i + 1}</span>
                    <span className="text-xs text-[#c9c4e8] flex-1">{c}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Career outcomes */}
          {node.career_outcomes.length > 0 && (
            <Section icon={Star} label="Career Outcomes">
              <div className="flex flex-wrap gap-1.5">
                {node.career_outcomes.map((o) => (
                  <span
                    key={o}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/20 text-purple-200"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Budget alert */}
          {node.budget_min > 0 && (
            <div className="glass rounded-xl p-3 border border-orange-500/20">
              <div className="text-[9px] font-bold uppercase tracking-wider text-orange-400 mb-1">Budget Note</div>
              <p className="text-[10px] text-[#8b84b0] leading-relaxed">
                Minimum annual spend required: <strong className="text-orange-300">₹{(node.budget_min / 100000).toFixed(1)}L</strong>.
                This covers tuition only — hostel, books and living costs are additional.
              </p>
            </div>
          )}

          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Save size={12} /> Save Changes
            </button>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={11} className="text-purple-400" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400/60">{label}</span>
      </div>
      {children}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    degree: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    exam: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    stream: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    substream: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    option: "bg-purple-400/15 text-purple-300 border-purple-400/25",
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[type] ?? "bg-purple-500/15 text-purple-300 border-purple-500/25"}`}>
      {type}
    </span>
  );
}
