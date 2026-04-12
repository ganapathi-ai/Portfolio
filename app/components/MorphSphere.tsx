"use client";
import { motion } from "framer-motion";

const tags = [
  { label: "Python", pos: "top-[8%] left-[-8%]", delay: 0 },
  { label: "Deep Learning", pos: "top-[18%] right-[-12%]", delay: 0.8 },
  { label: "Healthcare AI", pos: "bottom-[22%] left-[-10%]", delay: 1.6 },
  { label: "Power BI", pos: "bottom-[8%] right-[-8%]", delay: 2.4 },
];

export default function MorphSphere() {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />

      {/* Orbit rings */}
      {[
        { size: "w-[240px] h-[240px] md:w-[300px] md:h-[300px]", dur: "8s", dir: "normal" },
        { size: "w-[280px] h-[280px] md:w-[340px] md:h-[340px]", dur: "13s", dir: "reverse" },
        { size: "w-[300px] h-[300px] md:w-[375px] md:h-[375px]", dur: "18s", dir: "normal" },
      ].map((o, i) => (
        <div
          key={i}
          className={`absolute ${o.size} rounded-full border border-white/[0.07]`}
          style={{ animation: `spin ${o.dur} linear infinite ${o.dir === "reverse" ? "reverse" : ""}` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </div>
      ))}

      {/* Core morphing sphere */}
      <motion.div
        className="relative w-[150px] h-[150px] md:w-[190px] md:h-[190px] rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed 40%, #06b6d4 80%, #0e7490)",
          boxShadow: "0 0 60px rgba(124,58,237,0.7), 0 0 120px rgba(124,58,237,0.3), inset 0 0 40px rgba(255,255,255,0.1)",
        }}
        animate={{
          borderRadius: [
            "50%",
            "60% 40% 55% 45% / 45% 55% 40% 60%",
            "40% 60% 45% 55% / 55% 45% 60% 40%",
            "55% 45% 60% 40% / 40% 60% 45% 55%",
            "50%",
          ],
          scale: [1, 1.05, 0.96, 1.08, 1],
          rotate: [0, 90, 180, 270, 360],
          boxShadow: [
            "0 0 60px rgba(124,58,237,0.7), 0 0 120px rgba(124,58,237,0.3)",
            "0 0 80px rgba(6,182,212,0.8), 0 0 160px rgba(6,182,212,0.3)",
            "0 0 70px rgba(245,158,11,0.6), 0 0 140px rgba(245,158,11,0.2)",
            "0 0 80px rgba(6,182,212,0.8), 0 0 160px rgba(6,182,212,0.3)",
            "0 0 60px rgba(124,58,237,0.7), 0 0 120px rgba(124,58,237,0.3)",
          ],
        }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Inner shine */}
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full bg-white/20 blur-sm rotate-[-30deg]" />
      </motion.div>

      {/* Floating skill tags */}
      {tags.map((t) => (
        <motion.div
          key={t.label}
          className={`absolute ${t.pos} px-3 py-1.5 rounded-full text-xs font-semibold text-violet-300 border border-violet-500/40 bg-violet-500/15 backdrop-blur-sm whitespace-nowrap`}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, delay: t.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {t.label}
        </motion.div>
      ))}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
