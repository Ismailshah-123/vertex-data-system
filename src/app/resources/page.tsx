"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const RESOURCE_TYPES = ["All", "Documentation", "Research", "Whitepaper", "Guide"];

const RESOURCES = [
  {
    type: "Documentation", title: "Agent Evaluation Framework — Reference Guide",
    desc: "The evaluation harness used to score agent performance before anything ships — an LLM-as-judge rubric plus human review checkpoints, written up as a reusable reference.",
    format: "In progress", href: "#", color: "#00e5b4",
  },
  {
    type: "Research", title: "Retrieval Quality vs Generation Quality",
    desc: "Where RAG answer quality actually breaks down in practice, and why it's rarely the model — lessons from building and debugging retrieval pipelines.",
    format: "In progress", href: "#", color: "#00d19e",
  },
  {
    type: "Whitepaper", title: "AI Security for Regulated Industries",
    desc: "A practical framework for thinking through LLM deployment security — access controls, data handling, and audit logging — for teams under compliance pressure.",
    format: "In progress", href: "#", color: "#9b5de5",
  },
  {
    type: "Guide", title: "The MLOps Maturity Checklist",
    desc: "A working checklist for whether an ML system will still be accurate in 12 months — questions worth asking before signing off on any deployment.",
    format: "In progress", href: "#", color: "#00c49a",
  },
  {
    type: "Research", title: "Why Most Agentic AI Pilots Never Reach Production",
    desc: "The common failure patterns that keep agent projects stuck in demo mode, and the architecture decisions that actually get them shipped.",
    format: "In progress", href: "#", color: "#00b48a",
  },
  {
    type: "Documentation", title: "Model Context Protocol — Implementation Notes",
    desc: "Practical notes on wiring MCP into agentic systems, including the integration details the spec itself doesn't cover.",
    format: "In progress", href: "#", color: "#00a07a",
  },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ResourceCard({ r, index }: { r: typeof RESOURCES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        className={`group block bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-7 h-full
          transition-all duration-400 ${hovered ? "-translate-y-1 border-[#2a3d38] shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : ""}`}>
        <div className={`h-px w-full mb-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border"
            style={{ borderColor: `${r.color}40`, color: r.color }}>
            {r.type}
          </span>
          <span className="text-[10px] text-[#2a3d38]">{r.format}</span>
        </div>
        <h3 className={`font-bold text-lg leading-snug mb-3 transition-colors duration-300 ${hovered ? "text-[#00e5b4]" : "text-white"}`}>
          {r.title}
        </h3>
        <p className="text-sm text-[#5a7570] leading-relaxed">{r.desc}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [filter, setFilter] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 500));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = filter === "All" ? RESOURCES : RESOURCES.filter(r => r.type === filter);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Research & Resources</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black tracking-tight leading-[0.95] mb-6">
              What we've learned.<br /><span className="text-[#00e5b4]">Written down.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              Documentation, research notes, and frameworks from real engineering work — not marketing content dressed up as insight. Most of what's below is still being written; titles and topics are locked in, full write-ups are coming.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FILTER ────────────────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-40 bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28] px-8 py-4">
        <div className="max-w-screen-xl mx-auto flex gap-2 flex-wrap">
          {RESOURCE_TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-200
                ${filter === t ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/08" : "border-[#1e2b28] text-[#3a5550] hover:border-[#2a3d38] hover:text-[#8aada8]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => <ResourceCard key={r.title} r={r} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 border-t border-[#1e2b28] bg-[#0d0f0e] text-center">
        <Reveal>
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Want the next one first?</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-10">
            Join the research list.
          </h2>
          <Link href="/blog"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Read the Blog →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
