"use client";
import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle, GlassCard, StaggerChildren, itemVariant } from "./SectionWrapper";
import { RESUME } from "../data";

export default function About() {
  return (
    <SectionWrapper id="about">
      <SectionTitle>
        About <span className="gradient-text">Me</span>
      </SectionTitle>

      {/* Summary card — full width */}
      <motion.div variants={itemVariant} className="mb-6">
        <GlassCard className="p-6 md:p-8" hover={false}>
          <div className="flex gap-4 items-start">
            <div className="text-4xl flex-shrink-0">👨‍💻</div>
            <div>
              <h3 className="font-bold text-base mb-2">
                <span className="gradient-text">PGDM AI & Data Science in Healthcare</span> · Python · ML · Power BI · Tableau · Figma
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{RESUME.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Curiosity-Driven Learning", "Analytical Thinking", "Adaptability", "Interdisciplinary Approach"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
        <motion.div variants={itemVariant}>
          <GlassCard className="p-6 h-full">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-base mb-2">Objective</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{RESUME.objective}</p>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariant}>
          <GlassCard className="p-6 h-full">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold text-base mb-3">Languages</h3>
            <div className="space-y-2">
              {RESUME.languages.map((l) => (
                <div key={l.lang} className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/[0.04] text-sm">
                  <span className="text-slate-200">{l.lang}</span>
                  <span className="text-cyan-400 text-xs font-semibold">{l.level}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariant}>
          <GlassCard className="p-6 h-full">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold text-base mb-3">Find Me Online</h3>
            <div className="space-y-2.5">
              <a href={`mailto:${RESUME.email}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors group">
                <span className="text-base">✉️</span>
                <span className="group-hover:underline break-all">{RESUME.email}</span>
              </a>
              <a href={RESUME.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-violet-300 transition-colors group">
                <span className="text-base">💼</span>
                <span className="group-hover:underline">LinkedIn Profile ↗</span>
              </a>
              <a href={RESUME.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-violet-300 transition-colors group">
                <span className="text-base">🐙</span>
                <span className="group-hover:underline">github.com/ganapathi-ai ↗</span>
              </a>
              <a href={RESUME.socials.credly} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-violet-300 transition-colors group">
                <span className="text-base">🏅</span>
                <span className="group-hover:underline">Credly Badges ↗</span>
              </a>
              <a href={RESUME.socials.orcid} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-green-300 transition-colors group">
                <span className="text-base">🔬</span>
                <span className="group-hover:underline">ORCID Profile ↗</span>
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </StaggerChildren>

      {/* Education Timeline */}
      <SectionTitle>
        Education <span className="gradient-text">Timeline</span>
      </SectionTitle>

      <div className="relative pl-8">
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-600 via-cyan-500 to-transparent" />

        <StaggerChildren className="space-y-5">
          {RESUME.education.map((e, i) => (
            <motion.div key={i} variants={itemVariant} className="relative">
              <div className="absolute -left-[2.35rem] top-5 w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(124,58,237,0.7)]" />
              <GlassCard className="p-5">
                <span className="text-xs font-bold text-cyan-400 tracking-wide uppercase block mb-1">
                  {e.year}{e.score ? ` · ${e.score}` : ""}
                </span>
                <h3 className="font-semibold text-sm mb-0.5">{e.degree}</h3>
                <p className="text-slate-500 text-xs">{e.institution}</p>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </SectionWrapper>
  );
}
