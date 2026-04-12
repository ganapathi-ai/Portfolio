"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper, { SectionTitle, GlassCard } from "./SectionWrapper";
import { RESUME } from "../data";

const categories = ["All", "Analytics", "ML", "Deep Learning", "AI", "Web"];

const GithubIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

function ProjectCard({ p, index }: { p: (typeof RESUME.projects)[0]; index: number }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg)`;
  };

  const handleMouseLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: "easeOut" }}
      style={{ perspective: "800px" }}
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full"
        style={{ transition: "transform 0.3s ease", transformStyle: "preserve-3d" }}
      >
        <GlassCard className="p-6 h-full flex flex-col">
          <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-violet-600/5 to-cyan-500/5" />

          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="text-3xl">{p.icon}</div>
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 text-slate-500 hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200 flex-shrink-0"
              >
                <GithubIcon />
                View
              </a>
            )}
          </div>

          <h3 className="font-bold text-sm leading-snug mb-2">{p.title}</h3>
          <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-4">{p.desc}</p>

          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
              >
                {t}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? RESUME.projects : RESUME.projects.filter((p) => p.category === active);

  const githubCount = RESUME.projects.filter((p) => p.github).length;

  return (
    <SectionWrapper id="projects">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <SectionTitle>
          Featured <span className="gradient-text">Projects</span>
        </SectionTitle>
        <a
          href={RESUME.socials.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-white/10 text-slate-400 hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200 self-start sm:self-auto mb-10 sm:mb-0 -mt-8 sm:mt-0"
        >
          <GithubIcon />
          {githubCount} repos on GitHub ↗
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              active === c
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                : "border border-white/10 text-slate-400 hover:border-violet-500/40 hover:text-violet-300"
            }`}
          >
            {c}
            {c === "All" && (
              <span className="ml-1.5 text-[10px] opacity-60">{RESUME.projects.length}</span>
            )}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <ProjectCard key={p.title} p={p} index={i} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
