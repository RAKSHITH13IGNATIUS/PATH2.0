"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowUpRight, Map, BarChart2, CreditCard, GitBranch, Globe, Share2 } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Shared container ──────────────────────────────────────── */
function Container({ children, className = "", center = false, style = {} }: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        width: "100%",
        paddingLeft: 24,
        paddingRight: 24,
        ...(center ? { textAlign: "center" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Feature card ──────────────────────────────────────────── */
function FeatureCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1f2223" : "#1a1d1e",
        border: hovered ? "1px solid rgba(161,0,255,0.25)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        padding: 36,
        height: "100%",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(161,0,255,0.1)" : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}

/* ── Hero video preview ────────────────────────────────────── */
function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.75;
    }
  }, []);

  return (
    <div style={{
      width: "100%",
      borderRadius: 20,
      position: "relative",
      overflow: "hidden",
      background: "#0c0f10",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 0 80px rgba(161,0,255,0.12), 0 40px 80px rgba(0,0,0,0.4)",
    }}>
      <video
        ref={videoRef}
        src="/expo2.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", display: "block" }}
      />
      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to top, #111415 0%, transparent 100%)",
        pointerEvents: "none",
      }}/>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingAnimation onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div style={{ background: "#111415", color: "#e1e3e4", minHeight: "100vh", overflowX: "hidden", fontFamily: "var(--font-sans)" }}>

        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(17,20,21,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <Container className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/path-logo.jpeg"
                alt="P.A.T.H. logo"
                style={{ width: 42, height: 42, objectFit: "contain", borderRadius: 8, background: "#fff" }}
              />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", fontFamily: "var(--font-display)" }}>
                P.A.T.H.
              </span>
            </div>

            {/* Center nav links */}
            <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 14 }}>
              <a href="#features"     style={{ color: "#e1b6ff", borderBottom: "2px solid #6d28d9", paddingBottom: 2 }}>Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors" style={{ color: "#9a8ca2" }}>How it Works</a>
              <a href="/explore"      className="hover:text-white transition-colors" style={{ color: "#9a8ca2" }}>Dashboard</a>
              <a href="#"             className="hover:text-white transition-colors" style={{ color: "#9a8ca2" }}>Resources</a>
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="hover:text-white transition-colors" style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#9a8ca2", background: "none", border: "none", cursor: "pointer" }}>
                Login
              </button>
              <button
                onClick={() => window.open("/platform", "_blank")}
                style={{
                  fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
                  padding: "9px 22px", borderRadius: 999, border: "none", cursor: "pointer",
                  background: "#a100ff", color: "#f9e8ff",
                  boxShadow: "0 0 18px rgba(161,0,255,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                Start Your Path
              </button>
            </div>
          </Container>
        </nav>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section style={{
          position: "relative",
          paddingTop: 180,
          paddingBottom: 160,
          overflow: "hidden",
          background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(161,0,255,0.22) 0%, transparent 65%)",
        }}>
          {/* Dot grid — visible */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(161,0,255,0.45) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}/>

          <Container className="relative z-10" center>
            <motion.div variants={stagger} initial="hidden" animate="visible">

              {/* Badge */}
              <motion.div variants={fadeUp} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999, marginBottom: 32,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff36c9", animation: "pulse 2s infinite" }}/>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.12em", fontWeight: 600, color: "#ffaedd", textTransform: "uppercase" }}>
                  Next-Gen Career Navigation
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.4rem, 5.5vw, 3.4rem)",
                  fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em",
                  color: "#fff", margin: "0 auto 24px", maxWidth: 740,
                }}
              >
                From Learning to Earning –{" "}
                <span style={{
                  background: "linear-gradient(135deg, #e1b6ff 0%, #ffaedd 55%, #a100ff 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Start Your Journey Today
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p variants={fadeUp} style={{
                fontSize: 17, lineHeight: 1.7, color: "#d1c1d8",
                maxWidth: 520, margin: "0 auto 40px",
              }}>
                Discover structured career paths tailored to your unique skills, ambitions, and
                economic goals. Precision-guided clarity for the modern professional.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 80 }}>
                <button
                  onClick={() => window.open("/platform", "_blank")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                    fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
                    background: "#a100ff", color: "#f9e8ff",
                    boxShadow: "0 0 28px rgba(161,0,255,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  Start Your Path <ArrowUpRight size={17}/>
                </button>
                <button
                  onClick={() => window.open("/explore", "_blank")}
                  style={{
                    padding: "14px 32px", borderRadius: 12, cursor: "pointer",
                    fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.13)",
                    color: "#e1e3e4", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Explore Trends
                </button>
              </motion.div>

              {/* Dashboard preview */}
              <motion.div variants={fadeUp} style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
                <div style={{ position: "absolute", inset: -32, pointerEvents: "none" }} aria-hidden>
                  <div style={{ position: "absolute", left: "20%", top: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, borderRadius: "50%", background: "rgba(161,0,255,0.22)", filter: "blur(70px)" }}/>
                  <div style={{ position: "absolute", right: "20%", top: "50%", transform: "translate(50%,-50%)",  width: 200, height: 200, borderRadius: "50%", background: "rgba(255,54,201,0.18)", filter: "blur(55px)" }}/>
                </div>
                <div style={{
                  position: "relative", borderRadius: 20, padding: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                }}>
                  <HeroVideo/>
                </div>
              </motion.div>

            </motion.div>
          </Container>
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section id="features" style={{ padding: "140px 0" }}>
          <Container>

            {/* Section header */}
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              style={{ textAlign: "center", marginBottom: 64 }}
            >
              <motion.h2
                variants={fadeUp}
                style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 16 }}
              >
                Master Your Trajectory
              </motion.h2>
              <motion.div
                variants={fadeUp}
                style={{ height: 3, width: 80, background: "#a100ff", borderRadius: 4, margin: "0 auto" }}
              />
            </motion.div>

            {/* Bento grid */}
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 20 }}
            >
              {/* Card 1 — 7 cols */}
              <motion.div variants={fadeUp} style={{ gridColumn: "span 7" }}>
                <FeatureCard>
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "rgba(161,0,255,0.18)", border: "1px solid rgba(161,0,255,0.3)" }}>
                    <Map size={22} style={{ color: "#e1b6ff" }}/>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                    Personalized Career Roadmaps
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9a8ca2", marginBottom: 24 }}>
                    Algorithmically generated routes from your current skillset to your dream destination.
                    No generic advice, just precise steps.
                  </p>
                  {/* Path visualizer bar */}
                  <div style={{ position: "relative", height: 80, borderRadius: 12, background: "rgba(0,0,0,0.3)", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", top: "50%", left: 16, right: 16, height: 2, transform: "translateY(-50%)",
                      background: "linear-gradient(90deg, transparent, #a100ff, #ff36c9, transparent)", borderRadius: 2,
                    }}/>
                    {[{ l: "25%", c: "#e1b6ff", s: "rgba(161,0,255,0.5)" }, { l: "50%", c: "#ffaedd", s: "rgba(255,54,201,0.5)" }, { l: "76%", c: "#fff", s: "rgba(255,255,255,0.3)" }].map(dot => (
                      <div key={dot.l} style={{
                        position: "absolute", top: "50%", left: dot.l,
                        transform: "translate(-50%,-50%)", width: 14, height: 14,
                        borderRadius: "50%", background: dot.c, boxShadow: `0 0 14px ${dot.s}`,
                      }}/>
                    ))}
                  </div>
                </FeatureCard>
              </motion.div>

              {/* Card 2 — 5 cols */}
              <motion.div variants={fadeUp} style={{ gridColumn: "span 5" }}>
                <FeatureCard>
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "rgba(255,54,201,0.15)", border: "1px solid rgba(255,54,201,0.25)" }}>
                    <BarChart2 size={22} style={{ color: "#ffaedd" }}/>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                    Data-driven Decisions
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9a8ca2" }}>
                    Real-time market analysis showing salary projections, skill demand spikes, and
                    industry saturation metrics.
                  </p>
                </FeatureCard>
              </motion.div>

              {/* Card 3 — 5 cols */}
              <motion.div variants={fadeUp} style={{ gridColumn: "span 5" }}>
                <FeatureCard>
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "rgba(255,183,127,0.15)", border: "1px solid rgba(255,183,127,0.25)" }}>
                    <CreditCard size={22} style={{ color: "#ffb77f" }}/>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                    College &amp; Cost Insights
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9a8ca2" }}>
                    Calculate ROI on education. Compare tuition costs against future earning potential
                    with surgical precision.
                  </p>
                </FeatureCard>
              </motion.div>

              {/* Card 4 — 7 cols */}
              <motion.div variants={fadeUp} style={{ gridColumn: "span 7" }}>
                <FeatureCard>
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "rgba(225,182,255,0.1)", border: "1px solid rgba(225,182,255,0.18)" }}>
                    <GitBranch size={22} style={{ color: "#e1b6ff" }}/>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                    Multiple Path Options
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9a8ca2" }}>
                    Pivot with confidence. Our system generates &lsquo;Plan B&rsquo; and &lsquo;Plan C&rsquo; scenarios so
                    you&apos;re never stranded in a shifting economy.
                  </p>
                </FeatureCard>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* ── How It Works ───────────────────────────────────── */}
        <section id="how-it-works" style={{ padding: "140px 0", background: "#0c0f10" }}>
          <Container>

            {/* Header */}
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              style={{ textAlign: "center", marginBottom: 96 }}
            >
              <motion.h2
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
                  color: "#fff", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.18em",
                }}
              >
                The Navigation Sequence
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: 14, color: "#9a8ca2" }}>
                Your roadmap generated in three tactical steps
              </motion.p>
            </motion.div>

            {/* Steps */}
            <div style={{ position: "relative" }}>
              {/* Connector */}
              <div style={{
                position: "absolute", top: 40, left: 0, right: 0, height: 1,
                background: "rgba(255,255,255,0.08)",
              }}/>
              <motion.div
                variants={stagger} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}
              >
                {[
                  { n: "01", title: "Enter Details",   desc: "Input your current skills, academic background, and ultimate career goals into our secure engine." },
                  { n: "02", title: "System Analyzes", desc: "Our AI cross-references millions of data points, job trends, and educational outcomes." },
                  { n: "03", title: "Get Roadmap",     desc: "Receive a comprehensive, interactive horizon plan with specific milestones and resources." },
                ].map(step => (
                  <motion.div
                    key={step.n}
                    variants={fadeUp}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                  >
                    <div style={{
                      width: 80, height: 80, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                      position: "relative", zIndex: 1,
                    }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                        {step.n}
                      </span>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9a8ca2", maxWidth: 240 }}>
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section style={{ padding: "140px 0" }}>
          <Container>
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.div
                variants={fadeUp}
                style={{
                  borderRadius: 32, padding: "80px 60px", textAlign: "center",
                  background: "#1a1d1e", border: "1px solid rgba(255,255,255,0.07)",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(161,0,255,0.14) 0%, transparent 70%)",
                }}/>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: 700, color: "#fff", marginBottom: 20, position: "relative",
                }}>
                  Ready to Calibrate Your Future?
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#9a8ca2", maxWidth: 420, margin: "0 auto 48px", position: "relative" }}>
                  Join 10,000+ professionals navigating their careers with surgical precision.
                </p>
                <button
                  onClick={() => window.open("/platform", "_blank")}
                  style={{
                    position: "relative", padding: "16px 52px", borderRadius: 16, border: "none", cursor: "pointer",
                    fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    background: "#ffffff", color: "#111415",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  Start Your Path
                </button>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer style={{ background: "#0c0f10", borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>

          {/* Watermark — sits behind content, pinned to bottom of footer */}
          <div aria-hidden style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            textAlign: "center", pointerEvents: "none", userSelect: "none",
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(72px, 15vw, 180px)",
            lineHeight: 0.85, letterSpacing: "0.08em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(161,0,255,0.13)",
            zIndex: 0,
          }}>
            P.A.T.H.
          </div>

          <Container style={{ paddingTop: 72, paddingBottom: 80, position: "relative", zIndex: 1 }}>

            {/* Top row — brand + links + social */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between", alignItems: "flex-start", marginBottom: 56 }}>

              {/* Brand block */}
              <div style={{ minWidth: 220, maxWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <img src="/path-logo.jpeg" alt="P.A.T.H. logo"
                    style={{ width: 46, height: 46, objectFit: "contain", borderRadius: 10, background: "#fff", padding: 3, boxShadow: "0 0 14px rgba(161,0,255,0.2)" }}
                  />
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                      P.A.T.H.
                    </div>
                    <div style={{ color: "#6b6278", fontSize: 10, letterSpacing: "0.04em", marginTop: 3 }}>
                      Probing Awareness &amp; Tailored Horizon
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b6278", margin: 0 }}>
                  Built for Karnataka students finding their way forward — structured paths from learning to earning.
                </p>
              </div>

              {/* Nav columns */}
              <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
                {/* Product */}
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8ca2", marginBottom: 18 }}>
                    Product
                  </p>
                  {[["Features", "#features"], ["How it Works", "#how-it-works"], ["Dashboard", "/explore"], ["Platform", "/platform"]].map(([label, href]) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <a href={href} style={{ fontSize: 14, color: "#6b6278", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e1e3e4")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#6b6278")}>
                        {label}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Legal */}
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8ca2", marginBottom: 18 }}>
                    Legal
                  </p>
                  {[["Privacy Policy", "#"], ["Terms of Service", "#"], ["Contact Us", "#"]].map(([label, href]) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <a href={href} style={{ fontSize: 14, color: "#6b6278", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e1e3e4")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#6b6278")}>
                        {label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social icons */}
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8ca2", marginBottom: 18 }}>
                  Connect
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {([<Share2 key="s" size={15}/>, <Globe key="g" size={15}/>]).map((icon, i) => (
                    <div key={i} style={{
                      width: 38, height: 38, borderRadius: "50%", display: "flex",
                      alignItems: "center", justifyContent: "center", cursor: "pointer",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#6b6278", transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(161,0,255,0.4)"; (e.currentTarget as HTMLDivElement).style.color = "#e1b6ff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLDivElement).style.color = "#6b6278"; }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }}/>

            {/* Bottom bar */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 12, color: "#6b6278", margin: 0 }}>
                © 2025 P.A.T.H. · Probing Awareness &amp; Tailored Horizon · Built for the ambitious.
              </p>
              <p style={{ fontSize: 12, color: "#6b6278", margin: 0 }}>
                Made with ♥ for Karnataka students
              </p>
            </div>

          </Container>
        </footer>

      </div>
    </>
  );
}
