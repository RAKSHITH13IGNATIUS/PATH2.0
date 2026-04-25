"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, AlertCircle, Loader2, LayoutDashboard,
  ChevronLeft, Sun, Moon,
} from "lucide-react";
import Link from "next/link";
import InputForm from "@/components/ui/InputForm";
import PathGraph from "@/components/graph/PathGraph";
import { UserInput, PathResponse, generatePath, branchPath, downloadPDF } from "@/services/api";

type AppState = "idle" | "loading" | "result" | "error";

/* ── Theme tokens ─────────────────────────────────────────── */
const DARK = {
  bg:          "#05050f",
  sidebar:     "rgba(255,255,255,0.03)",
  header:      "rgba(5,5,15,0.85)",
  border:      "rgba(161,0,255,0.15)",
  cardBg:      "rgba(255,255,255,0.04)",
  cardBorder:  "rgba(161,0,255,0.2)",
  text:        "#e1e3e4",
  textMuted:   "#8b84b0",
  accent:      "#a100ff",
  accentLight: "#e1b6ff",
  dot:         "rgba(161,0,255,0.25)",
};
const LIGHT = {
  bg:          "#f5f3ff",
  sidebar:     "rgba(255,255,255,0.85)",
  header:      "rgba(248,246,255,0.92)",
  border:      "rgba(161,0,255,0.18)",
  cardBg:      "rgba(255,255,255,0.9)",
  cardBorder:  "rgba(161,0,255,0.25)",
  text:        "#1a1040",
  textMuted:   "#6b5b8a",
  accent:      "#a100ff",
  accentLight: "#7c3aed",
  dot:         "rgba(161,0,255,0.12)",
};

/* ── Animation variants ───────────────────────────────────── */
const slideDown = {
  hidden:  { y: -40, opacity: 0 },
  visible: { y: 0,   opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};
const slideLeft = {
  hidden:  { x: -60, opacity: 0 },
  visible: { x: 0,   opacity: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
};
const staggerKids = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const popUp = {
  hidden:  { scale: 0.85, opacity: 0, y: 16 },
  visible: { scale: 1,    opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
};
const floatAnim = {
  y: [0, -10, 0],
  transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
};

export default function PlatformPage() {
  const [appState,     setAppState]     = useState<AppState>("idle");
  const [pathData,     setPathData]     = useState<PathResponse | null>(null);
  const [userInput,    setUserInput]    = useState<UserInput | null>(null);
  const [error,        setError]        = useState<string>("");
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [branchLoading,setBranchLoading]= useState(false);
  const [dark,         setDark]         = useState(true);

  const T = dark ? DARK : LIGHT;

  /* ── API handlers (unchanged logic) ─────────────────────── */
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
    } catch { /* silent */ } finally {
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

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <motion.div
      animate={{ background: T.bg }}
      transition={{ duration: 0.4 }}
      style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
    >
      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-15%", left: "-10%",
            width: 500, height: 500, borderRadius: "50%",
            background: dark
              ? "radial-gradient(circle, rgba(161,0,255,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(161,0,255,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "-10%", right: "-5%",
            width: 400, height: 400, borderRadius: "50%",
            background: dark
              ? "radial-gradient(circle, rgba(255,54,201,0.09) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,54,201,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: dark ? 0.5 : 0.3,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${T.dot} 1.5px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}/>
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <motion.header
        variants={slideDown} initial="hidden" animate="visible"
        style={{
          position: "relative", zIndex: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 52,
          background: T.header,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: T.textMuted, textDecoration: "none" }}>
            <ChevronLeft size={14} /> Back
          </Link>
          <div style={{ width: 1, height: 16, background: T.border }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.img
              whileHover={{ rotate: 8, scale: 1.1 }}
              src="/path-logo.jpeg"
              alt="P.A.T.H. logo"
              style={{ width: 28, height: 28, borderRadius: 7, objectFit: "contain", background: "#fff", padding: 2, boxShadow: "0 0 10px rgba(161,0,255,0.35)" }}
            />
            <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>P.A.T.H.</span>
            <span style={{ color: T.textMuted, fontSize: 11 }}>— Probing Awareness and Tailored Horizon</span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {branchLoading && (
            <motion.div
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.accentLight }}
            >
              <Loader2 size={12} className="animate-spin" /> Branching...
            </motion.div>
          )}

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
            onClick={() => setDark((d) => !d)}
            style={{
              width: 34, height: 34, borderRadius: 10, border: `1px solid ${T.border}`,
              background: T.cardBg, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: T.accentLight,
            }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              {dark
                ? <motion.div key="sun"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun  size={15}/></motion.div>
                : <motion.div key="moon" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={15}/></motion.div>
              }
            </AnimatePresence>
          </motion.button>

          {/* PDF export */}
          <AnimatePresence>
            {pathData && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
                  background: T.cardBg, color: T.accentLight,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  opacity: pdfLoading ? 0.5 : 1,
                }}
              >
                {pdfLoading ? <Loader2 size={12} className="animate-spin"/> : <Download size={12}/>}
                Export PDF
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ── Main layout ────────────────────────────────────── */}
      <div style={{ position: "relative", display: "flex", flex: 1, minHeight: 0, zIndex: 1 }}>

        {/* Sidebar */}
        <motion.aside
          variants={slideLeft} initial="hidden" animate="visible"
          style={{
            width: 300, flexShrink: 0, overflowY: "auto",
            borderRight: `1px solid ${T.border}`,
            background: T.sidebar,
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            padding: 16, display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          {/* Form entrance */}
          <motion.div variants={staggerKids} initial="hidden" animate="visible">
            <motion.div variants={popUp}>
              <InputForm onSubmit={handleSubmit} loading={appState === "loading"} dark={dark} />
            </motion.div>
          </motion.div>

          {/* Summary card */}
          <AnimatePresence>
            {pathData?.summary && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: 14, padding: 14,
                  background: T.cardBg, border: `1px solid ${T.cardBorder}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <LayoutDashboard size={12} style={{ color: T.accent }} />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: T.accent }}>
                    Summary
                  </span>
                </div>
                <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, margin: 0 }}>{pathData.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* Graph / content area */}
        <main style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">

            {/* Idle */}
            {appState === "idle" && (
              <motion.div
                key="idle"
                variants={staggerKids} initial="hidden" animate="visible" exit={fadeIn.hidden}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: "0 32px",
                }}
              >
                {/* Floating icon */}
                <motion.div
                  variants={popUp}
                  animate={floatAnim}
                  style={{
                    width: 80, height: 80, borderRadius: 24, marginBottom: 24,
                    background: dark ? "rgba(161,0,255,0.12)" : "rgba(161,0,255,0.08)",
                    border: `1px solid ${T.cardBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 40px rgba(161,0,255,0.15)",
                  }}
                >
                  <LayoutDashboard size={36} style={{ color: T.accent }} />
                </motion.div>

                <motion.h2 variants={popUp} style={{ fontSize: 24, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>
                  Your Roadmap Awaits
                </motion.h2>
                <motion.p variants={popUp} style={{ fontSize: 14, color: T.textMuted, maxWidth: 320, lineHeight: 1.65, margin: 0 }}>
                  Fill in your profile on the left and click{" "}
                  <strong style={{ color: T.accent }}>Generate My Path</strong>{" "}
                  to visualize your personalized academic journey.
                </motion.p>

                {/* Step cards */}
                <motion.div
                  variants={staggerKids}
                  style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 32, maxWidth: 360, width: "100%" }}
                >
                  {["Marks & Grade", "Budget & Location", "Career Goal"].map((s, i) => (
                    <motion.div
                      key={s}
                      variants={popUp}
                      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(161,0,255,0.15)" }}
                      style={{
                        borderRadius: 14, padding: "14px 10px", textAlign: "center",
                        background: T.cardBg, border: `1px solid ${T.cardBorder}`,
                        cursor: "default",
                      }}
                    >
                      <motion.div
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{
                          fontSize: 22, fontWeight: 900, marginBottom: 6,
                          background: "linear-gradient(90deg, #a100ff, #ff36c9, #a100ff)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}
                      >
                        0{i + 1}
                      </motion.div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>{s}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Loading */}
            {appState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20,
                }}
              >
                {/* Animated rings */}
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2 - i * 0.2, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: "absolute",
                        inset: i * 10,
                        borderRadius: "50%",
                        border: `2px solid transparent`,
                        borderTopColor: i === 0 ? "#a100ff" : i === 1 ? "#ff36c9" : "#e1b6ff",
                        opacity: 1 - i * 0.25,
                      }}
                    />
                  ))}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: "absolute", inset: 24, borderRadius: "50%",
                      background: "rgba(161,0,255,0.2)",
                    }}
                  />
                </div>

                <div>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ fontSize: 16, fontWeight: 700, color: T.text, textAlign: "center", marginBottom: 6 }}
                  >
                    Analyzing your profile...
                  </motion.div>
                  <div style={{ fontSize: 13, color: T.textMuted, textAlign: "center" }}>
                    Matching against 5,040+ Karnataka colleges
                  </div>
                </div>

                {/* Animated dots row */}
                <div style={{ display: "flex", gap: 8 }}>
                  {[0,1,2,3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                      style={{ width: 8, height: 8, borderRadius: "50%", background: "#a100ff" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error */}
            {appState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 32px",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    width: 56, height: 56, borderRadius: 18,
                    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <AlertCircle size={26} style={{ color: "#fca5a5" }} />
                </motion.div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Connection Failed</div>
                <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", maxWidth: 340, lineHeight: 1.65, margin: 0 }}>{error}</p>
                <div style={{
                  borderRadius: 14, padding: 16, maxWidth: 340, width: "100%",
                  background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fb923c", marginBottom: 8 }}>Quick Fix:</div>
                  <code style={{ fontSize: 11, color: T.textMuted, fontFamily: "monospace", lineHeight: 1.8 }}>
                    cd backend<br/>
                    pip install -r requirements.txt<br/>
                    uvicorn main:app --reload
                  </code>
                </div>
              </motion.div>
            )}

            {/* Result */}
            {appState === "result" && pathData && userInput && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute", inset: 0 }}
              >
                {/* Animated "Results ready" flash */}
                <motion.div
                  initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
                    background: "radial-gradient(circle at 50% 50%, rgba(161,0,255,0.18) 0%, transparent 70%)",
                  }}
                />
                <PathGraph pathData={pathData} userInput={userInput} onBranch={handleBranch} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
