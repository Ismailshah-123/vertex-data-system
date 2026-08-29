"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Data — your own framing: WHY each category exists, not just a list ─── */
const CATEGORIES = [
  {
    id: "models",
    title: "Model Layer",
    reasoning: "We don't marry one vendor. Every model has a shape it's actually good at — the job decides the model, not the other way round.",
    items: [
      { name: "Claude (Opus / Sonnet / Haiku)", use: "Reasoning-heavy agents, long-context retrieval, safety-critical generation" },
      { name: "GPT-4 class",                   use: "General-purpose generation, broad tool-calling support" },
      { name: "Llama 3.1 / Mistral",            use: "Fine-tuning on proprietary data, on-prem deployment, cost-sensitive scale" },
      { name: "Gemini",                         use: "Native multimodal tasks, long video/audio context" },
    ],
    color: "#00e5b4",
  },
  {
    id: "orchestration",
    title: "Orchestration",
    reasoning: "Agents that plan and act need a runtime that can pause, retry, and recover — not just a prompt loop that hopes for the best.",
    items: [
      { name: "LangGraph",              use: "Stateful multi-agent graphs with explicit control flow" },
      { name: "Custom agent runtimes",  use: "When off-the-shelf orchestration can't express your business logic" },
      { name: "Temporal",               use: "Long-running, durable workflows that survive restarts and failures" },
      { name: "Model Context Protocol", use: "Standardised tool and data access across agent frameworks" },
    ],
    color: "#00d19e",
  },
  {
    id: "retrieval",
    title: "Data & Retrieval",
    reasoning: "Retrieval quality is the ceiling on generation quality. We pick the retrieval architecture based on what you're actually searching, not what's trending.",
    items: [
      { name: "pgvector",       use: "Vector search inside your existing Postgres — no new infra to operate" },
      { name: "Pinecone / Weaviate", use: "Managed vector search at scale with metadata filtering" },
      { name: "Elasticsearch",  use: "Hybrid keyword + semantic search for legal, technical, and compliance content" },
      { name: "Hybrid search",  use: "Combining dense and sparse retrieval when exact terminology matters" },
    ],
    color: "#00c49a",
  },
  {
    id: "evaluation",
    title: "Evaluation",
    reasoning: "A model without an evaluation harness is a hope, not a system. This is the layer most agencies skip and the one we refuse to.",
    items: [
      { name: "Braintrust / Ragas",   use: "Automated regression testing on every model or prompt change" },
      { name: "Custom eval harness",  use: "Built against your specific business-outcome metrics, not generic benchmarks" },
      { name: "LLM-as-judge",         use: "Scalable quality scoring where human review can't keep pace" },
      { name: "Human review",         use: "The final gate before anything ships to production, always" },
    ],
    color: "#00b48a",
  },
  {
    id: "observability",
    title: "Observability",
    reasoning: "You can't fix what you can't see. Every system we ship comes wired for drift detection and cost visibility from day one.",
    items: [
      { name: "OpenTelemetry", use: "Standardised tracing across every service in the pipeline" },
      { name: "Langfuse",      use: "LLM-specific tracing — prompts, completions, token cost, latency" },
      { name: "Datadog",       use: "Infrastructure-wide monitoring and alerting" },
      { name: "Prometheus / Grafana", use: "Custom metrics dashboards for model performance and drift" },
    ],
    color: "#00a07a",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    reasoning: "Cloud or on-prem, we build for your constraints — regulatory, budgetary, or latency — not for what's easiest for us.",
    items: [
      { name: "AWS / GCP / Azure", use: "Managed cloud deployment with your existing vendor relationship" },
      { name: "Kubernetes",        use: "Multi-environment orchestration for teams running at real scale" },
      { name: "vLLM / Ray",        use: "High-throughput self-hosted inference for cost-sensitive or private deployments" },
    ],
    color: "#008a68",
  },
];

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Category block with expandable item reasoning ──────────────────────── */
function CategoryBlock({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const [activeItem, setActiveItem] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <section id={cat.id} className="border-b border-[#1e2b28] last:border-0">
      <div ref={ref}
        className={`max-w-screen-xl mx-auto px-8 py-20 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-14">
          {/* Left: category identity */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs text-[#3a5550]">{String(index + 1).padStart(2, "0")}</span>
              <span className="w-8 h-px bg-[#2a3d38]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-5">{cat.title}</h2>
            <p className="text-[#8aada8] leading-relaxed text-sm mb-8">{cat.reasoning}</p>

            <div className="flex flex-col gap-1">
              {cat.items.map((item, i) => (
                <button key={item.name} onClick={() => setActiveItem(i)}
                  className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-3
                    ${activeItem === i ? "bg-[#0d1a16]" : "hover:bg-[#0d0f0e]"}`}>
                  <span className={`text-sm font-semibold ${activeItem === i ? "text-white" : "text-[#5a7570]"}`}>{item.name}</span>
                  <span className={`text-lg transition-all duration-200 ${activeItem === i ? "opacity-100" : "opacity-0 -translate-x-2"}`}
                    style={{ color: cat.color }}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: active item detail card */}
          <div>
            <div className="border border-[#1e2b28] rounded-2xl p-10 relative overflow-hidden group hover:border-[#2a3d38] transition-colors h-full flex flex-col justify-center">
              <div className="absolute inset-0 opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at top right, ${cat.color}06, transparent 60%)` }} />
              <div key={activeItem} className="relative" style={{ animation: "fadeSlide 0.3s ease forwards" }}>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: cat.color }}>When we reach for this</p>
                <h3 className="text-2xl font-black tracking-tight mb-4">{cat.items[activeItem].name}</h3>
                <p className="text-[#8aada8] leading-relaxed">{cat.items[activeItem].use}</p>
              </div>

              {/* Dot grid decoration */}
              <div className="mt-10 grid grid-cols-10 gap-1.5 opacity-40">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full"
                    style={{ background: cat.color, opacity: Math.random() > 0.5 ? 0.3 : 0.08 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function StackPage() {
  const [activeNav, setActiveNav] = useState("models");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 500));
      }
      CATEGORIES.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 200) setActiveNav(c.id);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_70%_50%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,180,0.05),transparent_70%)] pointer-events-none animate-pulse" />

        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Technology Ecosystem</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6.5vw,6rem)] font-black tracking-tight leading-[0.95] mb-8">
              Model-agnostic.<br /><span className="text-[#00e5b4]">Reasoning-first.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              We don't sell you a stack because it's fashionable. Every tool below earns its place because we've watched it fail, and watched it work, in real production systems.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-2 mt-10">
              {CATEGORIES.map(c => (
                <a key={c.id} href={`#${c.id}`}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200
                    ${activeNav === c.id ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/05" : "border-[#1e2b28] text-[#3a5550] hover:border-[#00e5b4]/40 hover:text-[#00e5b4]"}`}>
                  {c.title}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STICKY NAV ────────────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-40 bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28] overflow-x-auto">
        <div className="max-w-screen-xl mx-auto px-8 flex items-center gap-0">
          {CATEGORIES.map(c => (
            <a key={c.id} href={`#${c.id}`}
              className={`shrink-0 text-xs font-semibold px-5 py-4 border-b-2 transition-all duration-200
                ${activeNav === c.id ? "border-[#00e5b4] text-[#00e5b4]" : "border-transparent text-[#3a5550] hover:text-[#8aada8]"}`}>
              {c.title}
            </a>
          ))}
        </div>
      </div>

      {CATEGORIES.map((cat, i) => <CategoryBlock key={cat.id} cat={cat} index={i} />)}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-t border-[#1e2b28] text-center">
        <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Not Sure What Fits?</p></Reveal>
        <Reveal delay={100}>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-10">
            We'll tell you the honest answer.<br /><span className="text-[#00e5b4]">Even if it's "not us."</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Talk to an Engineer →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
