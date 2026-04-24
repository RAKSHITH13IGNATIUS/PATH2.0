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

interface Props {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
}

export default function InputForm({ onSubmit, loading }: Props) {
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
      className="glass-strong rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-purple-400" />
        <h2 className="text-white font-bold text-base">Your Profile</h2>
      </div>

      {/* Grade */}
      <Field label="Grade">
        <div className="flex gap-2">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("grade", g)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                form.grade === g
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "glass border border-purple-500/20 text-[#8b84b0] hover:border-purple-500/40"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>

      {/* Marks */}
      <Field label={`Marks: ${form.marks}%`}>
        <input
          type="range"
          min={30}
          max={100}
          step={1}
          value={form.marks}
          onChange={(e) => set("marks", Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#8b84b0] mt-1">
          <span>30%</span>
          <span className="text-purple-400 font-bold">{form.marks}%</span>
          <span>100%</span>
        </div>
      </Field>

      {/* Budget */}
      <Field label={`Annual Budget: ₹${Number(form.budget).toLocaleString("en-IN")}`}>
        <input
          type="range"
          min={20000}
          max={2000000}
          step={10000}
          value={form.budget}
          onChange={(e) => set("budget", Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#8b84b0] mt-1">
          <span>₹20K</span>
          <span className="text-purple-400 font-bold">₹{(Number(form.budget) / 100000).toFixed(1)}L</span>
          <span>₹20L</span>
        </div>
      </Field>

      {/* Location */}
      <Field label="Preferred District">
        <select
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          className="w-full bg-[#0d0d1a] border border-purple-500/25 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>

      {/* Career Interest */}
      <Field label="Career Interest">
        <div className="grid grid-cols-2 gap-1.5">
          {CAREERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("career_interest", c)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left transition-all duration-150 ${
                form.career_interest === c
                  ? "bg-purple-600/80 text-white border border-purple-400/50"
                  : "glass border border-purple-500/15 text-[#8b84b0] hover:border-purple-500/30 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 glow-purple"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating Path...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate My Path
          </>
        )}
      </button>
    </motion.form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
