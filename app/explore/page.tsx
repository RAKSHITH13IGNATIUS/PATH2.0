"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Download, Loader2, GitBranch,
  Compass, AlertCircle, Star,
} from "lucide-react";
import ExploreForm from "@/components/ui/ExploreForm";
import ExploreGraph from "@/components/graph/ExploreGraph";
import { ExploreInput, JsonPathResponse, exploreApi } from "@/services/exploreApi";

type State = "idle" | "loading" | "result" | "error";

export default function ExplorePage() {
  const [state, setState] = useState<State>("idle");
  const [pathData, setPathData] = useState<JsonPathResponse | null>(null);
  const [exploreInput, setExploreInput] = useState<ExploreInput | null>(null);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);

  const handleSubmit = async (inp: ExploreInput) => {
    setState("loading");
    setError("");
    setExploreInput(inp);
    setSelectedTitles([]);
    try {
      const data = await exploreApi.generatePath(inp);
      setPathData(data);
      setState("result");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not connect to backend. Run: cd backend && uvicorn main:app --reload"
      );
      setState("error");
    }
  };

  const handleBranch = async (nodeTitle: string) => {
    if (!exploreInput || !pathData) return;
    setBranchLoading(true);
    try {
      const branch = await exploreApi.branchPath(
        exploreInput.stream,
        nodeTitle,
        exploreInput.marks,
        exploreInput.budget
      );
      // Offset branch node IDs to avoid collisions
      const offset = Math.max(...pathData.nodes.map((n) => n.id), 0) + 500;
      const offsetNodes = branch.nodes.map((n) => ({ ...n, id: n.id + offset }));
      const offsetEdges = branch.edges.map((e) => ({
        from: e.from === branch.nodes[0]?.id ? e.from + offset : e.from + offset,
        to: e.to + offset,
      }));
      // Connect last eligible node to branch root
      const connector = {
        from: pathData.nodes.find((n) => n.title === nodeTitle)?.id ?? 0,
        to: offsetNodes[0]?.id ?? offset,
      };
      setPathData((prev) => ({
        ...prev!,
        nodes: [...prev!.nodes, ...offsetNodes],
        edges: [...prev!.edges, connector, ...offsetEdges],
      }));
    } catch {
      // silent
    } finally {
      setBranchLoading(false);
    }
  };

  const handleSelectTitle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handlePdf = async () => {
    if (!exploreInput) return;
    setPdfLoading(true);
    try {
      await exploreApi.exportPdf(exploreInput, selectedTitles);
    } catch (e) {
      alert("PDF failed: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#05050f] flex flex-col overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Topbar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3 glass border-b border-purple-500/12 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[#8b84b0] hover:text-purple-300 transition-colors text-sm">
            <ChevronLeft size={14} /> Home
          </Link>
          <div className="w-px h-4 bg-purple-500/20" />
          <Link href="/platform" className="text-[#8b84b0] hover:text-purple-300 transition-colors text-sm">
            Karnataka Explorer
          </Link>
          <div className="w-px h-4 bg-purple-500/20" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-violet-400 flex items-center justify-center">
              <Compass size={12} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">Career Explorer</span>
            <span className="text-[#8b84b0] text-xs hidden md:block">— All India Paths</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {branchLoading && (
            <div className="flex items-center gap-1.5 text-purple-300 text-xs">
              <Loader2 size={11} className="animate-spin" /> Branching…
            </div>
          )}
          {selectedTitles.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg glass border border-yellow-500/25 text-yellow-300 text-[10px]">
              <Star size={10} fill="currentColor" />
              {selectedTitles.length} starred
            </div>
          )}
          {pathData && (
            <button
              onClick={handlePdf}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-purple-500/25 text-purple-300 hover:bg-purple-500/12 text-xs font-semibold transition-all disabled:opacity-50"
            >
              {pdfLoading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
              Export PDF
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="relative flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="relative z-10 w-[290px] flex-shrink-0 border-r border-purple-500/10 overflow-y-auto p-4 space-y-4">
          <ExploreForm onSubmit={handleSubmit} loading={state === "loading"} />

          {/* Selected paths list */}
          <AnimatePresence>
            {selectedTitles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="glass rounded-xl p-3 border border-yellow-500/20"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={11} className="text-yellow-400" fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Starred Paths</span>
                </div>
                <div className="space-y-1">
                  {selectedTitles.map((t) => (
                    <div key={t} className="flex items-center justify-between text-[10px] text-[#8b84b0]">
                      <span className="truncate">{t}</span>
                      <button
                        onClick={() => handleSelectTitle(t)}
                        className="text-red-400/60 hover:text-red-400 ml-2 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard hint */}
          <div className="glass rounded-xl p-3 border border-purple-500/10">
            <div className="text-[9px] font-bold uppercase tracking-wider text-purple-400/50 mb-2">Tips</div>
            <div className="space-y-1.5 text-[10px] text-[#8b84b0]">
              <div>• <strong className="text-purple-300">Click</strong> any node to see details</div>
              <div>• <strong className="text-purple-300">⎇ Branch</strong> to explore PG paths</div>
              <div>• <strong className="text-purple-300">★ Star</strong> paths to include in PDF</div>
              <div>• <strong className="text-purple-300">Scroll / pinch</strong> to zoom</div>
            </div>
          </div>
        </aside>

        {/* Graph canvas */}
        <main className="relative flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-purple-600/12 border border-purple-500/20 flex items-center justify-center animate-float">
                  <Compass size={38} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Explore All India Career Paths</h2>
                  <p className="text-[#8b84b0] text-sm max-w-sm leading-relaxed">
                    Select your stream, marks and budget. The engine traverses the full career tree and shows every eligible path as an interactive graph.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-sm text-center">
                  {[
                    { icon: "⚗️", label: "Science", sub: "PCMB · PCM · PCB" },
                    { icon: "📊", label: "Commerce", sub: "CA · BBA · BCom" },
                    { icon: "🎨", label: "Arts", sub: "Law · Design · Civil" },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-3 border border-purple-500/10">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-xs font-bold text-white">{s.label}</div>
                      <div className="text-[9px] text-[#8b84b0]">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 animate-spin border-t-purple-500" />
                  <div className="absolute inset-2 rounded-full bg-purple-600/10" />
                </div>
                <div className="text-white font-semibold">Traversing career tree…</div>
                <div className="text-[#8b84b0] text-sm">Applying eligibility and budget rules</div>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/12 border border-red-500/25 flex items-center justify-center">
                  <AlertCircle size={26} className="text-red-400" />
                </div>
                <div className="text-white font-bold text-lg">Connection Failed</div>
                <p className="text-[#8b84b0] text-sm text-center max-w-sm">{error}</p>
                <div className="glass rounded-xl p-4 border border-orange-500/15 max-w-sm text-left">
                  <div className="text-orange-300 text-xs font-bold mb-2">Quick Fix:</div>
                  <code className="text-[10px] text-[#8b84b0] font-mono">
                    cd backend<br />
                    uvicorn main:app --reload
                  </code>
                </div>
              </motion.div>
            )}

            {state === "result" && pathData && exploreInput && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <ExploreGraph
                  pathData={pathData}
                  exploreInput={exploreInput}
                  onBranch={handleBranch}
                  selectedTitles={selectedTitles}
                  onSelectTitle={handleSelectTitle}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
