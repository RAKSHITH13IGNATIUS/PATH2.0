"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Edit3, Save, GitBranch, ExternalLink, IndianRupee, Award, Trash2, Plus } from "lucide-react";
import { PathNode, College } from "@/services/api";

const BRANCH_SUGGESTIONS: Record<string, string[]> = {
  stage:     ["PUC Science (PCM)", "PUC Commerce", "PUC Arts", "Polytechnic Diploma", "ITI Certificate"],
  education: ["BE / B.Tech", "MBBS", "B.Com / BBA", "BA / BSc", "Law (LLB)", "B.Design"],
  exam:      ["JEE Main", "NEET", "KCET", "COMEDK", "CLAT", "NDA", "CAT"],
  college:   ["Tier 1 Government College", "Tier 2 Private College", "Deemed University", "Distance / Online"],
  career:    ["Senior Role", "Team Lead / Manager", "Entrepreneurship", "Research & PhD", "International Opportunity"],
};

interface Props {
  node: PathNode;
  editedData?: Partial<PathNode>;
  onClose: () => void;
  onEdit: () => void;
  onSave: (nodeId: number, changes: Partial<PathNode>) => void;
  onBranch: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export default function NodeDetailPanel({ node, onClose, onEdit, onSave, onBranch, onDelete, isEditing }: Props) {
  const [draft, setDraft] = useState({
    title: node.title,
    description: node.description,
    cost: node.cost,
    eligibility: node.eligibility,
  });
  const [showBranchSuggestions, setShowBranchSuggestions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setDraft({ title: node.title, description: node.description, cost: node.cost, eligibility: node.eligibility });
    setShowBranchSuggestions(false);
    setConfirmDelete(false);
  }, [node.id]);

  const handleSave = () => onSave(node.id, draft);
  const suggestions = BRANCH_SUGGESTIONS[node.type] ?? [];

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 400, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      style={{
        width: 400,
        minWidth: 400,
        height: "100%",
        background: "rgba(13,10,28,0.97)",
        borderLeft: "1px solid rgba(161,0,255,0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(161,0,255,0.12)",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "#e1b6ff",
          padding: "3px 10px", borderRadius: 999,
          background: "rgba(161,0,255,0.15)", border: "1px solid rgba(161,0,255,0.25)",
        }}>
          {node.type}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Branch */}
          <IconBtn
            title="Branch from this node"
            onClick={() => setShowBranchSuggestions((v) => !v)}
            color="#e1b6ff"
            hoverBg="rgba(161,0,255,0.2)"
          >
            <GitBranch size={14} />
          </IconBtn>

          {/* Edit / Save */}
          {isEditing ? (
            <IconBtn title="Save changes" onClick={handleSave} color="#86efac" hoverBg="rgba(74,222,128,0.15)">
              <Save size={14} />
            </IconBtn>
          ) : (
            <IconBtn title="Edit node" onClick={onEdit} color="#e1b6ff" hoverBg="rgba(161,0,255,0.2)">
              <Edit3 size={14} />
            </IconBtn>
          )}

          {/* Delete */}
          {confirmDelete ? (
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={onDelete}
                style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                  background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)",
                  color: "#fca5a5", cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9a8ca2", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <IconBtn title="Delete node" onClick={() => setConfirmDelete(true)} color="#fca5a5" hoverBg="rgba(239,68,68,0.15)">
              <Trash2 size={14} />
            </IconBtn>
          )}

          {/* Close */}
          <IconBtn title="Close" onClick={onClose} color="#9a8ca2" hoverBg="rgba(255,255,255,0.08)">
            <X size={14} />
          </IconBtn>
        </div>
      </div>

      {/* Branch suggestion tray */}
      {showBranchSuggestions && (
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(161,0,255,0.1)",
          background: "rgba(161,0,255,0.05)",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9a8ca2", marginBottom: 8 }}>
            Branch suggestions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { onBranch(); setShowBranchSuggestions(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  background: "rgba(161,0,255,0.12)", border: "1px solid rgba(161,0,255,0.3)", color: "#e1b6ff",
                  transition: "background 0.15s",
                }}
              >
                <Plus size={10} /> {s}
              </button>
            ))}
            <button
              onClick={() => { onBranch(); setShowBranchSuggestions(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer",
                background: "rgba(255,54,201,0.1)", border: "1px solid rgba(255,54,201,0.25)", color: "#ffaedd",
                transition: "background 0.15s",
              }}
            >
              <GitBranch size={10} /> AI Generate
            </button>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Title */}
        {isEditing ? (
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            style={{
              width: "100%", background: "rgba(161,0,255,0.1)", border: "1px solid rgba(161,0,255,0.35)",
              borderRadius: 10, padding: "8px 12px", color: "#fff", fontWeight: 700, fontSize: 16,
              outline: "none", boxSizing: "border-box",
            }}
          />
        ) : (
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1.3 }}>{node.title}</h2>
        )}

        {/* Description */}
        <Section label="Description">
          {isEditing ? (
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={3}
              style={{
                width: "100%", background: "rgba(161,0,255,0.08)", border: "1px solid rgba(161,0,255,0.25)",
                borderRadius: 10, padding: "8px 12px", color: "#c9c4e8", fontSize: 13,
                outline: "none", resize: "none", boxSizing: "border-box",
              }}
            />
          ) : (
            <p style={{ color: "#8b84b0", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{node.description}</p>
          )}
        </Section>

        {/* Cost & Eligibility */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <InfoCard icon={IndianRupee} label="Cost">
            {isEditing ? (
              <input
                value={draft.cost}
                onChange={(e) => setDraft((d) => ({ ...d, cost: e.target.value }))}
                style={{ background: "transparent", border: "none", outline: "none", color: "#e1b6ff", fontSize: 12, fontWeight: 600, width: "100%" }}
              />
            ) : (
              <span style={{ color: "#e1b6ff", fontSize: 12, fontWeight: 600 }}>{node.cost}</span>
            )}
          </InfoCard>
          <InfoCard icon={Award} label="Eligibility">
            {isEditing ? (
              <input
                value={draft.eligibility}
                onChange={(e) => setDraft((d) => ({ ...d, eligibility: e.target.value }))}
                style={{ background: "transparent", border: "none", outline: "none", color: "#e1b6ff", fontSize: 12, fontWeight: 600, width: "100%" }}
              />
            ) : (
              <span style={{ color: "#e1b6ff", fontSize: 12, fontWeight: 600 }}>{node.eligibility}</span>
            )}
          </InfoCard>
        </div>

        {/* Exams */}
        {node.exams.length > 0 && (
          <Section label="Entrance Exams">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {node.exams.map((e) => (
                <span key={e} style={{
                  padding: "3px 10px", borderRadius: 999, fontSize: 11,
                  background: "rgba(161,0,255,0.18)", border: "1px solid rgba(161,0,255,0.3)", color: "#e1b6ff",
                }}>
                  {e}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Resources */}
        {node.resources.length > 0 && (
          <Section label="Learning Resources">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {node.resources.map((r) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#8b84b0" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a100ff", flexShrink: 0 }}/>
                  {r}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Colleges */}
        {node.colleges.length > 0 && (
          <Section label={`Recommended Colleges (${node.colleges.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {node.colleges.map((c) => (
                <CollegeCard key={c.aishe_code} college={c} />
              ))}
            </div>
          </Section>
        )}

        {/* Save button when editing */}
        {isEditing && (
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #a100ff, #7c3aed)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 0 20px rgba(161,0,255,0.3)",
            }}
          >
            <Save size={14} /> Save Changes
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Small helpers ─────────────────────────────────────────── */

function IconBtn({ children, title, onClick, color, hoverBg }: {
  children: React.ReactNode; title: string;
  onClick: () => void; color: string; hoverBg: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 6, borderRadius: 8, border: "none", cursor: "pointer",
        background: hovered ? hoverBg : "transparent",
        color: hovered ? color : "#9a8ca2",
        transition: "background 0.15s, color 0.15s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(161,0,255,0.6)", marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function InfoCard({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(161,0,255,0.15)",
      borderRadius: 12, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon size={11} style={{ color: "#a100ff" }} />
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(161,0,255,0.7)" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function CollegeCard({ college }: { college: College }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(161,0,255,0.12)",
      borderRadius: 12, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{college.name}</div>
          <div style={{ fontSize: 10, color: "#8b84b0", marginTop: 2 }}>{college.district} · {college.location_type}</div>
          <div style={{ fontSize: 10, color: "#e1b6ff", marginTop: 2 }}>{college.program}</div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999, flexShrink: 0,
          background: college.tier === "Tier 1" ? "rgba(234,179,8,0.15)" : college.tier === "Tier 2" ? "rgba(161,0,255,0.15)" : "rgba(255,255,255,0.08)",
          color: college.tier === "Tier 1" ? "#fde047" : college.tier === "Tier 2" ? "#e1b6ff" : "#9a8ca2",
          border: college.tier === "Tier 1" ? "1px solid rgba(234,179,8,0.3)" : "1px solid rgba(161,0,255,0.25)",
        }}>
          {college.tier}
        </span>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(161,0,255,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
        <Stat label="GM Fee"   value={`₹${(college.fee / 1000).toFixed(0)}K`} />
        <Stat label="Mgmt Fee" value={`₹${(college.management_fee / 1000).toFixed(0)}K`} />
        <Stat label="Avg Pkg"  value={`₹${(college.avg_package / 100000).toFixed(1)}L`} />
      </div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: "#8b84b0" }}>{college.entrance_exam} · {college.quota}</span>
        {college.website && college.website !== "N/A" && (
          <a
            href={college.website.startsWith("http") ? college.website : `https://${college.website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "#a100ff" }}
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
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "#8b84b0" }}>{label}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#e1b6ff" }}>{value}</div>
    </div>
  );
}
