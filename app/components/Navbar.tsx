"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RESUME } from "../data";

const links = ["hero", "about", "experience", "projects", "skills", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      let cur = "hero";
      links.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#050510]/95 border-b border-white/10"
          : "bg-[#050510]/60 border-b border-white/5"
      } backdrop-blur-xl`}
    >
      <span className="font-bold text-xl gradient-text font-mono tracking-widest">GK</span>

      {/* Desktop */}
      <ul className="hidden md:flex gap-8">
        {links.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`text-sm font-medium capitalize transition-colors duration-200 relative group ${
                active === id ? "text-violet-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {id === "hero" ? "Home" : id}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 ${
                  active === id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          </li>
        ))}
      </ul>

      <a
        href={RESUME.socials.github}
        target="_blank"
        rel="noreferrer"
        className="hidden md:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition-all"
      >
        GitHub ↗
      </a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-slate-300"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <div className="space-y-1.5">
          <span className={`block h-0.5 w-6 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </div>
      </button>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-[#050510]/98 border-b border-white/10 py-4 flex flex-col items-center gap-4 md:hidden"
        >
          {links.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium capitalize text-slate-300 hover:text-violet-400 transition-colors"
            >
              {id === "hero" ? "Home" : id}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
