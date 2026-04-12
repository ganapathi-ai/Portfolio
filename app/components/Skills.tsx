"use client";
import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle, GlassCard, StaggerChildren, itemVariant } from "./SectionWrapper";
import { RESUME } from "../data";

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionTitle>
        Technical <span className="gradient-text">Skills</span>
      </SectionTitle>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {RESUME.skills.map((s) => (
          <motion.div key={s.label} variants={itemVariant}>
            <GlassCard className="p-5 h-full">
              <h3 className="text-sm font-semibold mb-3">{s.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-violet-500/15 hover:border-violet-500/40 hover:text-violet-300 transition-all duration-200 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </StaggerChildren>

      {/* Certifications */}
      <SectionTitle>
        Certifications & <span className="gradient-text">Achievements</span>
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Certifications</h3>
          <StaggerChildren className="space-y-2">
            {RESUME.certifications.map((c, i) => (
              <motion.div key={i} variants={itemVariant}>
                <GlassCard className="p-3.5 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{c.icon}</span>
                  <p className="text-xs text-slate-400 leading-snug">{c.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">Achievements & Events</h3>
          <StaggerChildren className="space-y-2">
            {RESUME.achievements.map((a, i) => (
              <motion.div key={i} variants={itemVariant}>
                <GlassCard className="p-3.5 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <p className="text-xs text-slate-400 leading-snug">{a.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerChildren>

          {/* Highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4"
          >
            <GlassCard className="p-5" hover={false}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎓</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Completed <span className="text-violet-400 font-semibold">12-week NPTEL Deep Learning</span> course by IIT Ropar — one of India's most rigorous online AI programs.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
