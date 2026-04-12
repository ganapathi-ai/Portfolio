"use client";
import { motion } from "framer-motion";
import MorphSphere from "./MorphSphere";
import { RESUME } from "../data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: "easeOut" as const },
});

const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex items-center justify-between gap-8 px-6 md:px-16 lg:px-24 pt-24 pb-16"
    >
      {/* Left content */}
      <div className="flex-1 max-w-2xl">
        <motion.div {...fadeUp(0.1)}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-violet-300 border border-violet-500/40 bg-violet-500/10 mb-6">
            {RESUME.title}
          </span>
        </motion.div>

        <motion.h1
          className="font-black leading-[1.04] mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem,6.5vw,5.8rem)" }}
        >
          <motion.span className="block text-white" {...fadeUp(0.18)}>
            {RESUME.name.split(" ")[0]}
          </motion.span>
          <motion.span className="block gradient-text" {...fadeUp(0.28)}>
            {RESUME.name.split(" ")[1]}
          </motion.span>
        </motion.h1>

        <motion.p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg" {...fadeUp(0.38)}>
          Bridging{" "}
          <span className="text-violet-400 font-semibold">Healthcare</span> &{" "}
          <span className="text-cyan-400 font-semibold">Artificial Intelligence</span> — applying machine learning, data analysis & business intelligence to drive clinical innovation.
        </motion.p>

        <motion.div className="flex flex-wrap gap-3 mb-10" {...fadeUp(0.48)}>
          <a
            href="#projects"
            className="px-7 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] hover:scale-105 transition-all duration-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-7 py-3 rounded-full font-semibold text-sm text-slate-200 border border-white/15 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200"
          >
            Get In Touch
          </a>
          <a
            href={`mailto:${RESUME.email}`}
            className="px-7 py-3 rounded-full font-semibold text-sm text-slate-200 border border-white/15 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200"
          >
            Email Me
          </a>
        </motion.div>

        <motion.div className="flex flex-wrap gap-3" {...fadeUp(0.56)}>
          {[
            { href: RESUME.socials.linkedin, icon: <LinkedInIcon />, label: "LinkedIn" },
            { href: RESUME.socials.github, icon: <GithubIcon />, label: "GitHub" },
            { href: RESUME.socials.credly, icon: "🏅", label: "Credly" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 text-sm font-medium hover:border-cyan-400/40 hover:text-cyan-300 hover:bg-cyan-400/5 transition-all duration-200"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/[0.06]" {...fadeUp(0.64)}>
          {[
            { num: "13+", label: "Projects" },
            { num: "5", label: "Internships" },
            { num: "12+", label: "Certifications" },
            { num: "2", label: "Active Roles" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black gradient-text">{s.num}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — 3D sphere */}
      <motion.div
        className="hidden lg:flex flex-shrink-0 items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <MorphSphere />
      </motion.div>
    </section>
  );
}
