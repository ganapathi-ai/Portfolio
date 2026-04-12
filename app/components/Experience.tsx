"use client";
import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle, GlassCard, StaggerChildren, itemVariant } from "./SectionWrapper";
import { RESUME } from "../data";

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionTitle>
        Work <span className="gradient-text">Experience</span>
      </SectionTitle>

      {/* Timeline layout */}
      <div className="relative pl-8 mb-10">
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 via-violet-600 via-cyan-500 to-transparent" />

        <StaggerChildren className="space-y-4">
          {RESUME.experience.map((e, i) => (
            <motion.div key={i} variants={itemVariant} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[2.35rem] top-5 flex-shrink-0">
                {e.active ? (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                  </span>
                ) : (
                  <span className="inline-flex rounded-full h-3 w-3 bg-slate-600 border border-slate-500" />
                )}
              </div>

              <GlassCard className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-bold text-sm">{e.role}</h3>
                      {e.active && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 border border-green-500/30 text-green-400 uppercase tracking-wide">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs">
                      {e.company} · <span className="text-slate-500">{e.location}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-cyan-400 font-semibold">{e.period}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{e.duration}</div>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-3">{e.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-violet-500/15 border border-violet-500/25 text-violet-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      {/* Dual-domain callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <GlassCard className="p-6" hover={false}>
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="text-5xl flex-shrink-0">🔀</div>
            <div>
              <h3 className="font-bold text-base mb-2">Unique Dual-Domain Background</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Over <span className="text-violet-400 font-semibold">3+ years of hands-on clinical cardiovascular experience</span> across KIMS Hospitals, KIMS-Sunshine, and Great Eastern Medical School — combined with <span className="text-cyan-400 font-semibold">cutting-edge AI/ML internships</span> at Ethara AI, Unified Mentor, and Clinchbridge. This rare intersection enables domain-aware healthcare AI solutions that bridge the clinical-technical gap.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}
