"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, AlertCircle, Loader2, LayoutDashboard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import InputForm from "@/components/ui/InputForm";
import PathGraph from "@/components/graph/PathGraph";
import { UserInput, PathResponse, generatePath, branchPath, downloadPDF } from "@/services/api";

type AppState = "idle" | "loading" | "result" | "error";

export default function PlatformPage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [pathData, setPathData] = useState<PathResponse | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [error, setError] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  const handleSubmit = async (input: UserInput) => {
    setAppState("loading");
    setError("");
    setUserInput(input);
    try {
      const data = await generatePath(input);
      setPathData(data);
      setAppState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to backend. Make sure the API is running on port 8000.");
      setAppState("error");
    }
  };

  const handleBranch = async (nodeId: number, nodeTitle: string) => {
    if (!userInput || !pathData) return;
    setBranchLoading(true);
    try {
      const branchData = await branchPath(userInput, nodeId, nodeTitle);
      setPathData((prev) => {
        if (!prev) return branchData;
        const existingIds = new Set(prev.nodes.map((n) => n.id));
        const newNodes = branchData.nodes.filter((n) => !existingIds.has(n.id));
        const edgesFromBranch = branchData.edges.map((e) => ({
          ...e,
          from: nodeId === e.from ? nodeId : e.from,
        }));
        const connectingEdge = { from: nodeId, to: branchData.nodes[0]?.id ?? nodeId + 1 };
        return {
          ...prev,
          nodes: [...prev.nodes, ...newNodes],
          edges: [...prev.edges, connectingEdge, ...edgesFromBranch],
        };
      });
    } catch {
      // silently handle branch error
    } finally {
      setBranchLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!userInput) return;
    setPdfLoading(true);
    try {
      await downloadPDF(userInput);
    } catch (err) {
      alert("PDF export failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#05050f] flex flex-col overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Topbar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3 glass border-b border-purple-500/15 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[#8b84b0] hover:text-purple-300 transition-colors text-sm">
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="w-px h-4 bg-purple-500/20" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">P</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">P.A.T.H.</span>
            <span className="text-[#8b84b0] text-xs">— Personalized Academic & Career Trajectory Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {branchLoading && (
            <div className="flex items-center gap-1.5 text-purple-300 text-xs">
              <Loader2 size={12} className="animate-spin" /> Branching...
            </div>
          )}
          {pathData && (
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-purple-500/30 text-purple-300 hover:bg-purple-500/15 text-xs font-semibold transition-all disabled:opacity-50"
            >
              {pdfLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              Export PDF
            </button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <div className="relative flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="relative z-10 w-[300px] flex-shrink-0 border-r border-purple-500/10 overflow-y-auto p-4">
          <InputForm onSubmit={handleSubmit} loading={appState === "loading"} />

          {/* Summary */}
          <AnimatePresence>
            {pathData?.summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 glass rounded-xl p-4 border border-purple-500/15"
              >
                <div className="flex items-center gap-2 mb-2">
                  <LayoutDashboard size={13} className="text-purple-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Summary</span>
                </div>
                <p className="text-xs text-[#8b84b0] leading-relaxed">{pathData.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Graph area */}
        <main className="relative flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {appState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center mb-6 animate-float">
                  <LayoutDashboard size={36} className="text-purple-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-3">Your Roadmap Awaits</h2>
                <p className="text-[#8b84b0] text-sm max-w-sm leading-relaxed">
                  Fill in your profile on the left and click <strong className="text-purple-400">Generate My Path</strong> to visualize your personalized academic journey.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
                  {["Marks & Grade", "Budget & Location", "Career Goal"].map((s, i) => (
                    <div key={s} className="glass rounded-xl p-3 text-center border border-purple-500/10">
                      <div className="text-2xl font-black text-gradient mb-1">0{i + 1}</div>
                      <div className="text-[10px] text-[#8b84b0]">{s}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {appState === "loading" && (
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
                <div className="text-white font-semibold">Analyzing your profile...</div>
                <div className="text-[#8b84b0] text-sm">Matching against 5,040+ Karnataka colleges</div>
              </motion.div>
            )}

            {appState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle size={28} className="text-red-400" />
                </div>
                <div className="text-white font-bold text-lg">Connection Failed</div>
                <p className="text-[#8b84b0] text-sm text-center max-w-sm leading-relaxed">{error}</p>
                <div className="glass rounded-xl p-4 border border-orange-500/20 max-w-sm text-left">
                  <div className="text-orange-300 text-xs font-bold mb-2">Quick Fix:</div>
                  <code className="text-[11px] text-[#8b84b0] font-mono">
                    cd backend<br />
                    pip install -r requirements.txt<br />
                    uvicorn main:app --reload
                  </code>
                </div>
              </motion.div>
            )}

            {appState === "result" && pathData && userInput && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <PathGraph
                  pathData={pathData}
                  userInput={userInput}
                  onBranch={handleBranch}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
