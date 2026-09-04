"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   /projects — the orderable catalog.

   A menu of project TYPES you can commission today, each with its own
   detail page and its own scoped order form (see /projects/[slug]/page.tsx).

   Every card here links to a real detail page. Every detail page has
   a "Start this project" form that pre-fills the project type so the
   lead lands in your inbox already scoped — no generic contact form
   guessing what someone actually wants.
───────────────────────────────────────────────────────────────────────── */

const CATEGORIES = ["All", "Data", "ML & AI", "Vision", "Security"];

const PROJECTS = [
  {
    slug: "analytics-platform-build",
    category: "Data",
    name: "Analytics & BI Platform Build",
    tagline: "A live source of truth, not another spreadsheet.",
    summary: "Full warehouse architecture, semantic layer, and executive dashboards — replacing your 48-hour report cycle with something that refreshes every 15 minutes.",
    timeline: "6–10 weeks",
    color: "#00e5b4",
    tags: ["dbt", "BigQuery", "Looker"],
  },
  {
    slug: "data-warehouse-migration",
    category: "Data",
    name: "Data Warehouse Migration",
    tagline: "Move without losing a single number.",
    summary: "Migrate from legacy infrastructure to a modern cloud warehouse with full data validation, parallel-run verification, and zero unplanned downtime.",
    timeline: "8–14 weeks",
    color: "#00d19e",
    tags: ["Snowflake", "Fivetran", "Airflow"],
  },
  {
    slug: "predictive-model-deployment",
    category: "ML & AI",
    name: "Predictive Model Deployment",
    tagline: "From notebook to production, properly.",
    summary: "Take an existing model — or build one from scratch — and wrap it in the MLOps infrastructure that keeps it accurate for years, not weeks.",
    timeline: "6–12 weeks",
    color: "#00c49a",
    tags: ["PyTorch", "MLflow", "Feature Store"],
  },
  {
    slug: "agentic-support-system",
    category: "ML & AI",
    name: "Agentic Support Automation",
    tagline: "Autonomous resolution, not another chatbot.",
    summary: "A multi-agent system that triages, resolves, and escalates real support volume — three-tier architecture built to handle the large majority of it autonomously.",
    timeline: "8–12 weeks",
    color: "#00b48a",
    tags: ["LangGraph", "Claude API", "Guardrails"],
  },
  {
    slug: "rag-knowledge-assistant",
    category: "ML & AI",
    name: "RAG Knowledge Assistant",
    tagline: "Your documents, finally searchable and answerable.",
    summary: "A retrieval-augmented chatbot trained on your proprietary knowledge base, with full citation and confidence scoring built in.",
    timeline: "5–9 weeks",
    color: "#00a07a",
    tags: ["RAG", "Pinecone", "LlamaIndex"],
  },
  {
    slug: "vision-quality-inspection",
    category: "Vision",
    name: "Vision-Based Quality Inspection",
    tagline: "Catch the defect before it leaves the line.",
    summary: "Real-time computer vision deployed at the edge, integrated with your existing SCADA system for automated quarantine and line-stop triggers.",
    timeline: "10–16 weeks",
    color: "#00d4c4",
    tags: ["YOLOv9", "TensorRT", "NVIDIA Jetson"],
  },
  {
    slug: "property-developer-crm",
    category: "CRM",
    name: "CRM for Property Developers",
    tagline: "From first inquiry to handover, one system.",
    summary: "Lead capture, live unit inventory, automated follow-ups, and a sales pipeline built around how property developers actually sell.",
    timeline: "6–10 weeks",
    color: "#00c49a",
    tags: ["CRM", "Sales Automation", "Real Estate"],
  },
  {
    slug: "school-management-crm",
    category: "CRM",
    name: "CRM for Schools & Educational Institutions",
    tagline: "Admissions that don't lose track of a single family.",
    summary: "Inquiry-to-enrollment pipeline with automated parent follow-ups, built around how schools actually recruit.",
    timeline: "6–10 weeks",
    color: "#00b48a",
    tags: ["CRM", "Education", "Enrollment Automation"],
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

function ProjectCard({ p, index }: { p: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={`/projects/${p.slug}`}
        className={`group block bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-7 h-full
          transition-all duration-400 ${hovered ? "-translate-y-1 border-[#2a3d38] shadow-[0_24px_70px_rgba(0,0,0,0.4)]" : ""}`}>
        <div className={`h-px w-full mb-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border" style={{ borderColor: `${p.color}40`, color: p.color }}>
            {p.category}
          </span>
          <span className="text-[10px] text-[#2a3d38]">{p.timeline}</span>
        </div>
        <h3 className={`font-bold text-lg leading-snug mb-1 transition-colors duration-300 ${hovered ? "text-[#00e5b4]" : "text-white"}`}>{p.name}</h3>
        <p className="text-xs font-medium mb-4" style={{ color: p.color }}>{p.tagline}</p>
        <p className="text-sm text-[#5a7570] leading-relaxed mb-6">{p.summary}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {p.tags.map(t => <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-[#1e2b28] text-[#3a5550]">{t}</span>)}
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-[#111]">
          <div>
            <div className="text-[9px] text-[#3a5550] uppercase tracking-widest">Typical timeline</div>
            <div className="text-lg font-black" style={{ color: p.color }}>{p.timeline}</div>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 ${hovered ? "text-[#00e5b4] translate-x-1" : "text-[#3a5550]"}`}>
            View & request →
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
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

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Project Catalog</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black tracking-tight leading-[0.95] mb-6">
              Pick a project.<br /><span className="text-[#00e5b4]">See exactly what it costs.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              Each project below has a fixed starting price, a realistic timeline, and its own detail page. Click through, see the full scope, and order directly — no back-and-forth to find out what something costs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FILTER ────────────────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-40 bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28] px-8 py-4">
        <div className="max-w-screen-xl mx-auto flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-200
                ${filter === c ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/08" : "border-[#1e2b28] text-[#3a5550] hover:border-[#2a3d38] hover:text-[#8aada8]"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 border-t border-[#1e2b28] bg-[#0d0f0e] text-center">
        <Reveal>
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Not sure which fits?</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-10">
            Tell us the problem.<br />We'll tell you what it takes.
          </h2>
          <Link href="/#contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Book a discovery call →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
