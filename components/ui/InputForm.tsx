"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { UserInput } from "@/services/api";

const GRADES = ["10th", "12th"];
const DISTRICTS = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dharwad", "Dakshina Kannada",
  "Belagavi", "Kalaburagi", "Tumakuru", "Shivamogga", "Ballari", "Vijayapura",
  "Udupi", "Hassan", "Chitradurga", "Davanagere", "Raichur", "Bidar", "Gadag",
  "Haveri", "Koppal", "Mandya", "Chikkamagaluru", "Kolar", "Kodagu",
  "Chikkaballapura", "Chamarajanagar", "Yadgir", "Vijayanagara", "Uttara Kannada",
  "Bagalkote", "Bengaluru South",
];
const CAREERS = [
  "Engineering", "Medical / MBBS", "Computer Science / IT", "Commerce / BBA",
  "Law", "Science (BSc)", "Architecture", "Pharmacy", "Agriculture",
  "Nursing", "Arts / Humanities", "Education / Teaching",
];

const DARK = {
  card:        "rgba(255,255,255,0.04)",
  border:      "rgba(255,255,255,0.09)",
  label:       "#9a8ca2",
  text:        "#e1e3e4",
  mutedText:   "#6b6278",
  inputBg:     "#0c0f10",
  inputBorder: "rgba(255,255,255,0.1)",
  inputText:   "#e1e3e4",
  btnInactive: "rgba(255,255,255,0.05)",
  btnInactiveText: "#9a8ca2",
  btnInactiveBorder: "rgba(255,255,255,0.1)",
  headerBorder: "rgba(255,255,255,0.06)",
};
const LIGHT = {
  card:        "rgba(255,255,255,0.88)",
  border:      "rgba(161,0,255,0.18)",
  label:       "#7c3aed",
  text:        "#1a1040",
  mutedText:   "#6b5b8a",
  inputBg:     "#f5f3ff",
  inputBorder: "rgba(161,0,255,0.2)",
  inputText:   "#1a1040",
  btnInactive: "rgba(161,0,255,0.05)",
  btnInactiveText: "#6b5b8a",
  btnInactiveBorder: "rgba(161,0,255,0.15)",
  headerBorder: "rgba(161,0,255,0.1)",
};

interface Props {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
  dark?: boolean;
}

export default function InputForm({ onSubmit, loading, dark = true }: Props) {
  const T = dark ? DARK : LIGHT;
  const [form, setForm] = useState<UserInput>({
    grade: "12th",
    marks: 75,
    budget: 150000,
    location: "Bengaluru Urban",
    career_interest: "Engineering",
  });

  const set = (key: keyof UserInput, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 4, borderBottom: `1px solid ${T.headerBorder}` }}>
        <Sparkles size={15} style={{ color: "#a100ff" }} />
        <h2 style={{ color: T.text, fontWeight: 700, fontSize: 15, margin: 0 }}>Your Profile</h2>
      </div>

      {/* Grade */}
      <Field label="Grade" T={T}>
        <div style={{ display: "flex", gap: 8 }}>
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("grade", g)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: form.grade === g ? "#a100ff" : T.btnInactive,
                color: form.grade === g ? "#fff" : T.btnInactiveText,
                border: form.grade === g ? "1px solid #a100ff" : `1px solid ${T.btnInactiveBorder}`,
                boxShadow: form.grade === g ? "0 0 16px rgba(161,0,255,0.3)" : "none",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>

      {/* Marks */}
      <Field label={`Marks — ${form.marks}%`} T={T}>
        <input
          type="range"
          min={30}
          max={100}
          step={1}
          value={form.marks}
          onChange={(e) => set("marks", Number(e.target.value))}
          style={{ width: "100%", accentColor: "#a100ff", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.mutedText, marginTop: 4 }}>
          <span>30%</span>
          <span style={{ color: "#a100ff", fontWeight: 700 }}>{form.marks}%</span>
          <span>100%</span>
        </div>
      </Field>

      {/* Budget */}
      <Field label={`Annual Budget — ₹${Number(form.budget).toLocaleString("en-IN")}`} T={T}>
        <input
          type="range"
          min={20000}
          max={2000000}
          step={10000}
          value={form.budget}
          onChange={(e) => set("budget", Number(e.target.value))}
          style={{ width: "100%", accentColor: "#a100ff", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.mutedText, marginTop: 4 }}>
          <span>₹20K</span>
          <span style={{ color: "#a100ff", fontWeight: 700 }}>₹{(Number(form.budget) / 100000).toFixed(1)}L</span>
          <span>₹20L</span>
        </div>
      </Field>

      {/* Location */}
      <Field label="Preferred District" T={T}>
        <div style={{ position: "relative" }}>
          <select
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            style={{
              width: "100%",
              background: T.inputBg,
              border: `1px solid ${T.inputBorder}`,
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 13,
              color: T.inputText,
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
            }}
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d} style={{ background: T.inputBg }}>{d}</option>
            ))}
          </select>
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.mutedText, pointerEvents: "none", fontSize: 11 }}>▾</span>
        </div>
      </Field>

      {/* Career Interest */}
      <Field label="Career Interest" T={T}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {CAREERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("career_interest", c)}
              style={{
                padding: "7px 8px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                background: form.career_interest === c ? "rgba(161,0,255,0.2)" : T.btnInactive,
                color: form.career_interest === c ? "#c084fc" : T.btnInactiveText,
                border: form.career_interest === c ? "1px solid rgba(161,0,255,0.5)" : `1px solid ${T.btnInactiveBorder}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 12,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "rgba(161,0,255,0.4)" : "linear-gradient(135deg, #a100ff, #ff36c9)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: loading ? "none" : "0 0 24px rgba(161,0,255,0.35)",
          transition: "opacity 0.2s",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <><Loader2 size={15} className="animate-spin" /> Generating Path...</>
        ) : (
          <><Sparkles size={15} /> Generate My Path</>
        )}
      </button>
    </motion.form>
  );
}

function Field({ label, children, T }: { label: string; children: React.ReactNode; T: typeof DARK }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: T.label, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
