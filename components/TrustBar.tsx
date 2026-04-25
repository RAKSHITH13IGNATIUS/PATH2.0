"use client";

import { motion } from "framer-motion";

const brands = [
  "Notion", "Linear", "Vercel", "Figma", "Stripe", "Loom", "Arc", "Raycast",
];

const stats = [
  { value: "2,400+", label: "Brands served" },
  { value: "50,000+", label: "Orders shipped" },
  { value: "4.9/5", label: "Avg. rating" },
  { value: "48 hr", label: "Avg. turnaround" },
];

export default function TrustBar() {
  return (
    <section className="py-20 bg-[#f8f7f4]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-[0.1em] mb-10"
        >
          Trusted by the world&apos;s best brands
        </motion.p>

        {/* Brand logos (text style — premium feel) */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-20">
          {brands.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="text-[18px] font-bold text-[#c8c5be] hover:text-[#7a7a7a] transition-colors duration-300 cursor-default tracking-tight"
            >
              {brand}
            </motion.span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e5e2dc] rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#f8f7f4] px-8 py-10 flex flex-col items-center text-center"
            >
              <span className="text-[36px] font-black text-[#0f0f0f] tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="mt-2 text-[13px] text-[#7a7a7a] font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
