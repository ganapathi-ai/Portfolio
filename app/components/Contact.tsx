"use client";
import { motion } from "framer-motion";
import SectionWrapper, { SectionTitle, GlassCard, StaggerChildren, itemVariant } from "./SectionWrapper";
import { RESUME } from "../data";

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="text-center mb-12">
        <SectionTitle>
          Let&apos;s <span className="gradient-text">Connect</span>
        </SectionTitle>
        <p className="text-slate-400 text-lg -mt-6">
          Open to collaborations, research, and AI/healthcare projects.
        </p>
      </div>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          {
            icon: "✉️",
            label: "Email",
            value: RESUME.email,
            href: `mailto:${RESUME.email}`,
          },
          {
            icon: "💼",
            label: "LinkedIn",
            value: "ganapathi-kakarla-ai-data-science",
            href: RESUME.socials.linkedin,
          },
          {
            icon: "🐙",
            label: "GitHub",
            value: "ganapathi-ai",
            href: RESUME.socials.github,
          },
          {
            icon: "🔬",
            label: "ORCID",
            value: "0009-0003-1251-6581",
            href: RESUME.socials.orcid,
          },
        ].map((c) => (
          <motion.div key={c.label} variants={itemVariant}>
            <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <GlassCard className="p-5 text-center cursor-pointer group">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
                  {c.label}
                </div>
                <div className="text-xs text-slate-300 group-hover:text-cyan-400 transition-colors font-medium break-all leading-snug">
                  {c.value}
                </div>
              </GlassCard>
            </a>
          </motion.div>
        ))}
      </StaggerChildren>

      {/* CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-12 max-w-2xl mx-auto"
      >
        <GlassCard className="p-8 text-center" hover={false}>
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="font-bold text-lg mb-2">Available for Opportunities</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Currently pursuing PGDM in AI & Data Science in Healthcare at IIHMR Bangalore. Actively seeking roles in{" "}
            <span className="text-violet-400">Healthcare AI</span>,{" "}
            <span className="text-cyan-400">Data Science</span>, and{" "}
            <span className="text-amber-400">Clinical Analytics</span>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`mailto:${RESUME.email}`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:scale-105 transition-all duration-200"
            >
              Send Me an Email ↗
            </a>
            <a
              href={RESUME.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-slate-200 border border-white/15 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200"
            >
              Connect on LinkedIn ↗
            </a>
          </div>
        </GlassCard>
      </motion.div>


    </SectionWrapper>
  );
}
