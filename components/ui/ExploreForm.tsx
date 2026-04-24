"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, FlaskConical } from "lucide-react";
import { ExploreInput } from "@/services/exploreApi";

const STREAMS = ["Science", "Commerce", "Arts"];
const STREAM_ICONS: Record<string, string> = {
  Science: "⚗️",
  Commerce: "📊",
  Arts: "🎨",
};
const STREAM_DESCS: Record<string, string> = {
  Science: "PCM · PCB · PCMB",
  Commerce: "Accounts · Business · Finance",
  Arts: "Humanities · Law · Design",
};

interface Props {
  onSubmit: (data: ExploreInput) => void;
  loading: boolean;
}

export default function ExploreForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<ExploreInput>({
    stream: "Science",
    marks: 70,
    budget: 500000,
    location: "",
  });

  const set = <K extends keyof ExploreInput>(k: K, v: ExploreInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inr = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical size={14} className="text-purple-400" />
        <span className="text-white font-bold text-sm">Career Explorer</span>
      </div>

      {/* Stream */}
      <div>
        <Label>Select Stream</Label>
        <div className="space-y-2">
          {STREAMS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("stream", s)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                form.stream === s
                  ? "bg-purple-600/30 border border-purple-400/60 shadow-lg shadow-purple-500/10"
                  : "glass border border-purple-500/15 hover:border-purple-500/35"
              }`}
            >
              <span className="text-xl">{STREAM_ICONS[s]}</span>
              <div>
                <div className="text-sm font-bold text-white">{s}</div>
                <div className="text-[10px] text-[#8b84b0]">{STREAM_DESCS[s]}</div>
              </div>
              {form.stream === s && (
                <div className="ml-auto w-2 h-2 rounded-full bg-purple-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Marks */}
      <div>
        <Label>Marks: {form.marks}%</Label>
        <input
          type="range"
          min={30}
          max={100}
          step={1}
          value={form.marks}
          onChange={(e) => set("marks", Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8b84b0] mt-1">
          <span>30%</span>
          <EligibilityBadge marks={form.marks} />
          <span>100%</span>
        </div>
      </div>

      {/* Budget */}
      <div>
        <Label>Annual Budget: {inr(form.budget)}</Label>
        <input
          type="range"
          min={40000}
          max={3000000}
          step={10000}
          value={form.budget}
          onChange={(e) => set("budget", Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8b84b0] mt-1">
          <span>₹40K</span>
          <span className="text-purple-400 font-bold">{inr(form.budget)}/yr</span>
          <span>₹30L</span>
        </div>
      </div>

      {/* Location */}
      <div>
        <Label>Preferred Location (optional)</Label>
        <input
          type="text"
          placeholder="e.g. Bengaluru, Delhi, Mumbai…"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          className="w-full bg-[#0d0d1a] border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#8b84b0] focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all glow-purple"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Building Paths…
          </>
        ) : (
          <>
            <Search size={14} />
            Explore Paths
          </>
        )}
      </button>
    </motion.form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-300/70 mb-2">
      {children}
    </label>
  );
}

function EligibilityBadge({ marks }: { marks: number }) {
  const { label, color } =
    marks >= 80 ? { label: "All Paths Open", color: "text-green-400" } :
    marks >= 65 ? { label: "Most Paths Open", color: "text-blue-400" } :
    marks >= 50 ? { label: "Core Paths Open", color: "text-yellow-400" } :
    { label: "Limited Paths", color: "text-red-400" };
  return <span className={`font-semibold text-[10px] ${color}`}>{label}</span>;
}
