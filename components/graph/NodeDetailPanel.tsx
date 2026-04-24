"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, Save, GitBranch, ExternalLink, IndianRupee, Award } from "lucide-react";
import { PathNode, College } from "@/services/api";

interface Props {
  node: PathNode;
  editedData?: Partial<PathNode>;
  onClose: () => void;
  onEdit: () => void;
  onSave: (nodeId: number, changes: Partial<PathNode>) => void;
  onBranch: () => void;
  isEditing: boolean;
}

export default function NodeDetailPanel({ node, onClose, onEdit, onSave, onBranch, isEditing }: Props) {
  const [draft, setDraft] = useState({ title: node.title, description: node.description, cost: node.cost, eligibility: node.eligibility });

  useEffect(() => {
    setDraft({ title: node.title, description: node.description, cost: node.cost, eligibility: node.eligibility });
  }, [node.id]);

  const handleSave = () => onSave(node.id, draft);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-0 right-0 h-full w-[420px] glass-strong border-l border-purple-500/20 flex flex-col z-20 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/15">
              {node.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onBranch}
              title="Branch from here"
              className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <GitBranch size={14} />
            </button>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
              >
                <Save size={14} />
              </button>
            ) : (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
              >
                <Edit3 size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-[#8b84b0] hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Title */}
          {isEditing ? (
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-purple-400"
            />
          ) : (
            <h2 className="text-xl font-black text-white">{node.title}</h2>
          )}

          {/* Description */}
          <div>
            <SectionLabel>Description</SectionLabel>
            {isEditing ? (
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={3}
                className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-[#c9c4e8] focus:outline-none focus:border-purple-400 resize-none"
              />
            ) : (
              <p className="text-sm text-[#8b84b0] leading-relaxed">{node.description}</p>
            )}
          </div>

          {/* Cost & Eligibility */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon={IndianRupee} label="Cost">
              {isEditing ? (
                <input
                  value={draft.cost}
                  onChange={(e) => setDraft((d) => ({ ...d, cost: e.target.value }))}
                  className="w-full bg-transparent text-xs text-purple-300 font-medium focus:outline-none"
                />
              ) : (
                <span className="text-xs text-purple-300 font-medium">{node.cost}</span>
              )}
            </InfoCard>
            <InfoCard icon={Award} label="Eligibility">
              {isEditing ? (
                <input
                  value={draft.eligibility}
                  onChange={(e) => setDraft((d) => ({ ...d, eligibility: e.target.value }))}
                  className="w-full bg-transparent text-xs text-purple-300 font-medium focus:outline-none"
                />
              ) : (
                <span className="text-xs text-purple-300 font-medium">{node.eligibility}</span>
              )}
            </InfoCard>
          </div>

          {/* Exams */}
          {node.exams.length > 0 && (
            <div>
              <SectionLabel>Entrance Exams</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {node.exams.map((e) => (
                  <span key={e} className="px-2 py-0.5 rounded-full text-[11px] bg-purple-600/20 border border-purple-500/30 text-purple-300">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {node.resources.length > 0 && (
            <div>
              <SectionLabel>Learning Resources</SectionLabel>
              <div className="space-y-1">
                {node.resources.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-sm text-[#8b84b0]">
                    <div className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colleges */}
          {node.colleges.length > 0 && (
            <div>
              <SectionLabel>Recommended Colleges ({node.colleges.length})</SectionLabel>
              <div className="space-y-2">
                {node.colleges.map((c) => (
                  <CollegeCard key={c.aishe_code} college={c} />
                ))}
              </div>
            </div>
          )}

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Save size={14} /> Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60 mb-2">{children}</div>;
}

function InfoCard({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-3 border border-purple-500/15">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={11} className="text-purple-400" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400/70">{label}</span>
      </div>
      {children}
    </div>
  );
}

function CollegeCard({ college }: { college: College }) {
  return (
    <div className="glass rounded-xl p-3 border border-purple-500/10 hover:border-purple-500/25 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white leading-snug truncate">{college.name}</div>
          <div className="text-[10px] text-[#8b84b0] mt-0.5">{college.district} · {college.location_type}</div>
          <div className="text-[10px] text-purple-300 mt-0.5 truncate">{college.program}</div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${college.tier === "Tier 1" ? "bg-yellow-500/20 text-yellow-300" : college.tier === "Tier 2" ? "bg-purple-500/20 text-purple-300" : "bg-gray-500/20 text-gray-300"}`}>
            {college.tier}
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-purple-500/10 grid grid-cols-3 gap-2">
        <Stat label="GM Fee" value={`₹${(college.fee / 1000).toFixed(0)}K`} />
        <Stat label="Mgmt Fee" value={`₹${(college.management_fee / 1000).toFixed(0)}K`} />
        <Stat label="Avg Pkg" value={`₹${(college.avg_package / 100000).toFixed(1)}L`} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] text-[#8b84b0]">{college.entrance_exam} · {college.quota}</span>
        {college.website && college.website !== "N/A" && (
          <a
            href={college.website.startsWith("http") ? college.website : `https://${college.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] text-[#8b84b0]">{label}</div>
      <div className="text-[10px] font-bold text-purple-300">{value}</div>
    </div>
  );
}
