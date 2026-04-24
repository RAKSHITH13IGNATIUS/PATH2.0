"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Map, BookOpen, TrendingUp, Star, ChevronDown, GraduationCap, MapPin, Calendar, Users, Award, Target, Sparkles, Brain, Rocket, Shield } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

const ORBS = [
  { x: "15%", y: "20%", size: 300, opacity: 0.12 },
  { x: "75%", y: "60%", size: 400, opacity: 0.08 },
  { x: "50%", y: "85%", size: 250, opacity: 0.1 },
];

const FEATURES = [
  {
    icon: Map,
    title: "Visual Roadmap",
    desc: "Interactive node graph showing every step from today to your dream career. See the complete journey laid out visually with clickable nodes revealing detailed information at each stage."
  },
  {
    icon: Zap,
    title: "Rule-Based Engine",
    desc: "5,040+ Karnataka colleges filtered by marks, budget, location & exams — no guesswork. Our intelligent algorithms match your profile with precision, considering entrance exams like CET, NEET, JEE, COMEDK, and CLAT."
  },
  {
    icon: BookOpen,
    title: "Exam Guidance",
    desc: "CET, NEET, JEE, CLAT and more — matched to your stream and marks automatically. Get personalized exam recommendations based on your academic profile and career aspirations."
  },
  {
    icon: TrendingUp,
    title: "Placement Insights",
    desc: "Real average package data from Karnataka colleges to help you decide smarter. Access verified placement statistics, company tie-ups, and career outcomes to make informed decisions."
  },
  {
    icon: Brain,
    title: "Smart Matching",
    desc: "Advanced AI-powered matching algorithm considers your academic performance, budget constraints, location preferences, and career goals to suggest the best-fit colleges and courses."
  },
  {
    icon: Shield,
    title: "Data-Driven Decisions",
    desc: "Every recommendation is backed by verified data from 5,040+ institutions across 31 districts. No AI hallucinations, just facts from official sources and real student experiences."
  }
];

const STATS = [
  { value: "5,040+", label: "Colleges Analyzed", icon: GraduationCap },
  { value: "31", label: "Districts Covered", icon: MapPin },
  { value: "100+", label: "Career Paths", icon: Target },
  { value: "15+", label: "Entrance Exams", icon: Award },
];

const BENEFITS = [
  {
    icon: Rocket,
    title: "Save Time & Effort",
    desc: "Stop endless Googling. Get personalized college recommendations in minutes instead of weeks of research."
  },
  {
    icon: Target,
    title: "Make Informed Choices",
    desc: "Compare colleges side-by-side with real placement data, fee structures, and admission criteria."
  },
  {
    icon: Sparkles,
    title: "Discover Hidden Gems",
    desc: "Find excellent colleges that match your profile but might not be on your radar through traditional search."
  },
  {
    icon: Users,
    title: "Expert-Verified Data",
    desc: "All information is verified from official sources and updated regularly to ensure accuracy."
  }
];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const openPlatform = () => window.open("/platform", "_blank");
  const openExplore = () => window.open("/explore", "_blank");

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingAnimation onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#05050f] overflow-x-hidden relative">
        <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />

        {ORBS.map((orb, i) => (
          <div
            key={i}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              background: `radial-gradient(circle, rgba(124,58,237,${orb.opacity}) 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) translate(${(mousePos.x - 0.5) * 20}px, ${(mousePos.y - 0.5) * 20}px)`,
              transition: "transform 0.8s ease-out",
            }}
          />
        ))}

        <div className="fixed inset-0 pointer-events-none">
          {STARS.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Glass Navbar */}
        <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#05050f]/40 border-b border-purple-500/10 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-400/10 flex items-center justify-center backdrop-blur-xl border border-purple-500/30">
                <img src="/path-logo.png" alt="PATH Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="font-black text-white text-2xl tracking-tight">P.A.T.H.</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-purple-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-purple-300 hover:text-white transition-colors duration-200">How It Works</a>
              <a href="/explore" className="text-sm font-medium text-purple-300 hover:text-white transition-colors duration-200">Explore</a>
              <button
                onClick={openPlatform}
                className="path-button flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                Launch <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY }}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-purple-500/40 text-purple-300 text-sm font-medium backdrop-blur-xl"
          >
            <Star size={14} className="fill-purple-400 text-purple-400" />
            5,040+ Karnataka Colleges · 31 Districts · 100% Data-Driven
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-8 max-w-5xl"
          >
            <span className="text-white">Your Future Starts</span>
            <br />
            <span className="text-shimmer">With The Right P.A.T.H.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-2xl text-lg text-[#a0a0c0] leading-relaxed mb-12"
          >
            Get personalized college recommendations based on your marks, budget, and goals. We analyze 5,040+ Karnataka colleges to find your perfect match.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <button
              onClick={openPlatform}
              className="path-button group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg"
            >
              Start Your Journey
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={openExplore}
              className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl glass border-2 border-purple-400/50 text-purple-200 font-bold text-lg hover:bg-purple-500/20 transition-all duration-200 hover:scale-105 backdrop-blur-xl"
            >
              Explore All Careers
              <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-xl border border-purple-500/20">
                <s.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-4xl font-black text-gradient mb-2">{s.value}</div>
                <div className="text-sm text-[#a0a0c0] font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-purple-500/50"
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.section>

        {/* Why P.A.T.H. Section */}
        <section className="relative py-32 px-6 min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Why Choose <span className="text-gradient">P.A.T.H.</span>?
              </h2>
              <p className="text-[#a0a0c0] text-lg max-w-2xl mx-auto leading-relaxed">
                Data-driven recommendations, smart matching, and verified information—all in one platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    rotateY: 3,
                    rotateX: -3,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                  className="glass rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer backdrop-blur-xl border-2 border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mx-auto">
                    <benefit.icon size={28} className="text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-all text-center">{benefit.title}</h3>
                  <p className="text-[#a0a0c0] text-base leading-relaxed group-hover:text-purple-300 transition-colors text-center">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-32 px-6 min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Everything You Need In <span className="text-gradient">One Platform</span>
              </h2>
              <p className="text-[#a0a0c0] text-lg max-w-2xl mx-auto leading-relaxed">
                Built on verified data from 5,040+ colleges across Karnataka.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {FEATURES.slice(0, 3).map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer backdrop-blur-xl border border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/20 text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 mx-auto">
                    <f.icon size={28} className="text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-[#a0a0c0] text-sm leading-relaxed">{f.desc.split('.')[0]}.</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
              {FEATURES.slice(3, 6).map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer backdrop-blur-xl border border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/20 text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 mx-auto">
                    <f.icon size={28} className="text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-[#a0a0c0] text-sm leading-relaxed">{f.desc.split('.')[0]}.</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="relative py-32 px-6 min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black text-white text-center mb-8"
            >
              How <span className="text-gradient">P.A.T.H.</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#a0a0c0] text-lg text-center mb-20 max-w-2xl mx-auto"
            >
              Simple steps to discover your perfect college match.
            </motion.p>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-500/50 to-transparent rounded-full" />
              {[
                {
                  step: "01",
                  title: "Enter Your Profile",
                  desc: "Share your marks, budget, location preference, and career goals in under 2 minutes."
                },
                {
                  step: "02",
                  title: "Get Smart Matches",
                  desc: "Our engine analyzes 5,040+ colleges and ranks them based on your profile."
                },
                {
                  step: "03",
                  title: "Explore Your Roadmap",
                  desc: "View an interactive visual journey from entrance exams to your dream career."
                },
                {
                  step: "04",
                  title: "Download & Apply",
                  desc: "Export a detailed PDF report with college details, timelines, and action steps."
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-6 mb-10 pl-4"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white font-black text-base glow-purple z-10 relative shadow-lg shadow-purple-500/50">
                      {item.step}
                    </div>
                  </div>
                  <div className="pt-3 flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-[#a0a0c0] text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Start Your Journey <span className="text-gradient">Today</span>
            </h2>
            <p className="text-[#a0a0c0] text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover the perfect college match for your profile. Join thousands of students making smarter decisions with P.A.T.H.
            </p>
            <button
              onClick={openPlatform}
              className="path-button group inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-bold text-xl"
            >
              Launch P.A.T.H.
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">5,040+</div>
                <div className="text-sm text-[#8b84b0]">Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">31</div>
                <div className="text-sm text-[#8b84b0]">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">100%</div>
                <div className="text-sm text-[#8b84b0]">Data-Driven</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-purple-500/10 py-16 px-6 backdrop-blur-2xl bg-[#05050f]/80">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-400/10 flex items-center justify-center backdrop-blur-xl border border-purple-500/30">
                    <img src="/path-logo.png" alt="PATH Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <span className="font-black text-white text-2xl tracking-tight">P.A.T.H.</span>
                </div>
                <p className="text-[#8b84b0] text-sm leading-relaxed mb-4">
                  Personalized Academic & Career Trajectory Hub
                </p>
                <p className="text-[#7a7a9a] text-xs leading-relaxed max-w-sm">
                  Empowering Karnataka students to make data-driven college decisions with verified information from 5,040+ institutions across 31 districts.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-[#8b84b0] text-sm hover:text-purple-400 transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-[#8b84b0] text-sm hover:text-purple-400 transition-colors">How It Works</a></li>
                  <li><a href="/explore" className="text-[#8b84b0] text-sm hover:text-purple-400 transition-colors">Explore Careers</a></li>
                  <li><a href="/platform" className="text-[#8b84b0] text-sm hover:text-purple-400 transition-colors">Launch Platform</a></li>
                </ul>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-white font-bold text-sm mb-4">Coverage</h4>
                <ul className="space-y-2">
                  <li className="text-[#8b84b0] text-sm">5,040+ Colleges</li>
                  <li className="text-[#8b84b0] text-sm">31 Districts</li>
                  <li className="text-[#8b84b0] text-sm">100+ Career Paths</li>
                  <li className="text-[#8b84b0] text-sm">15+ Entrance Exams</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#6b6b8b] text-xs">
                © 2025 P.A.T.H. All rights reserved. Built with data-driven precision.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#6b6b8b] text-xs hover:text-purple-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-[#6b6b8b] text-xs hover:text-purple-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-[#6b6b8b] text-xs hover:text-purple-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
