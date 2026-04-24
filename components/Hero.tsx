"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0c0c0e]">
      {/* Layered background */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0e] via-[#131318] to-[#0e0c10]" />

        {/* Accent glow top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#e8650a] opacity-[0.08] blur-[120px]" />
        {/* Accent glow bottom-right */}
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#5b21b6] opacity-[0.06] blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating product mockups */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block pointer-events-none">
        {/* Main card mockup */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] right-[8%] w-72 h-44"
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#1e1e24] to-[#2a2a34] border border-white/[0.07] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e8650a]/10 to-transparent" />
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <div>
                <div className="w-20 h-1 bg-white/30 rounded mb-1.5" />
                <div className="w-14 h-0.5 bg-white/15 rounded" />
              </div>
              <div className="flex justify-between items-end">
                <div className="w-10 h-6 rounded bg-[#e8650a]/70" />
                <div className="text-[10px] text-white/30 font-mono">PRESSLY</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brochure mockup */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] right-[28%] w-48 h-64"
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#1a1a22] to-[#111115] border border-white/[0.06] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="h-1/2 bg-gradient-to-br from-[#e8650a]/30 to-[#5b21b6]/20" />
            <div className="p-4 flex flex-col gap-2">
              <div className="w-16 h-1 bg-white/25 rounded" />
              <div className="w-12 h-0.5 bg-white/12 rounded" />
              <div className="w-20 h-0.5 bg-white/12 rounded" />
            </div>
          </div>
        </motion.div>

        {/* Packaging mockup */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[18%] right-[12%] w-56 h-56"
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#1c1c22] to-[#16161c] border border-white/[0.05] shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-[#e8650a] to-[#d4560a] opacity-80 shadow-inner" />
          </div>
        </motion.div>

        {/* Small tag */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[62%] right-[6%] glass-dark px-3 py-2 rounded-xl text-[11px] text-white/60 font-mono border border-white/[0.05]"
        >
          <span className="text-[#e8650a]">●</span> CMYK ready
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-[12px] text-white/50 font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8650a] animate-pulse" />
            Trusted by 2,400+ brands worldwide
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-[56px] md:text-[72px] lg:text-[82px] font-black text-white leading-[1.0] tracking-[-0.03em] mb-6"
          >
            Print that
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#e8650a] via-[#ff8534] to-[#e8650a] bg-clip-text text-transparent">
                commands
              </span>
            </span>
            <br />
            attention.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-[17px] text-white/45 leading-relaxed max-w-lg mb-10 font-light"
          >
            Premium print production for brands that refuse to compromise.
            From business cards to packaging — crafted with precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3"
          >
            <a
              href="#services"
              className="group inline-flex items-center gap-2 bg-[#e8650a] hover:bg-[#d4560a] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(232,101,10,0.3)] hover:shadow-[0_0_60px_rgba(232,101,10,0.5)]"
            >
              Explore products
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#showcase"
              className="group inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/80 font-medium text-[14px] px-6 py-3.5 rounded-full transition-all duration-300"
            >
              <Play size={13} fill="currentColor" />
              See our work
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-16 flex gap-8 pt-8 border-t border-white/[0.07]"
          >
            {[
              { value: "48hr", label: "Turnaround" },
              { value: "99.2%", label: "On-time delivery" },
              { value: "50k+", label: "Orders shipped" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[24px] font-bold text-white leading-tight">
                  {stat.value}
                </div>
                <div className="text-[12px] text-white/35 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8f7f4] to-transparent" />
    </section>
  );
}
