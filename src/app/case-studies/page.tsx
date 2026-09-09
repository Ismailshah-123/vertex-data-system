"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CASE_STUDIES } from "./data";
import SpotlightCard from "@/components/ui/SpotlightCard";

const VertexTransformationVisual = dynamic(
  () => import("@/components/vertex-3d-transformation/VertexTransformationVisual").then(m => m.VertexTransformationVisual),
  { ssr: false, loading: () => null }
);

/* ─────────────────────────────────────────────────────────────────────────
   /case-studies

   IMPORTANT — read before editing this file:
   This page shows REAL independent/prototype projects, not client work.
   Vertex Data Systems doesn't have paying clients yet. Every entry here is either
   (a) a genuine project Ismail built and can speak to in detail, clearly
   labeled with its actual status ("Independent project", "Prototype",
   "In development", "Deployed"), or (b) an explicitly labeled CONCEPT —
   a proposed approach to a common problem, never presented as completed
   or deployed work.

   Do not add fabricated client names, dollar figures, testimonials, or
   "results" that weren't actually measured. If real client case studies
   exist in the future, add them as a new, clearly-dated category rather
   than blending them in with these.
───────────────────────────────────────────────────────────────────────── */

const CONCEPTS = [
  {
    category: "Concept · Proposed Architecture",
    title: "Automated Lead Qualification & Cold Outreach Engine",
    note: "This is a concept, not a completed or deployed project — included because CRM automation is Vertex Data Systems' primary focus, and this is the reference architecture we'd actually build.",
    problem: "Sales teams lose momentum between a lead coming in and a rep actually calling them — manual qualification and cold-outreach sequencing eats the hours that matter most.",
    approach: "An AI layer sitting on top of an existing CRM (HubSpot/Salesforce) that scores incoming leads, drafts and sequences cold email/call outreach, and books qualified meetings directly onto a rep's calendar — with a human review queue before anything goes out at scale.",
    stack: ["HubSpot/Salesforce API", "Twilio", "n8n", "Claude", "GPT-4"],
    expectedOutcome: "Faster lead response time and more rep hours spent talking to qualified prospects instead of triaging a list by hand.",
  },
  {
    category: "Concept · Proposed Architecture",
    title: "Agentic Support Automation",
    note: "This is a concept, not a completed or deployed project — included because agentic support automation is one of our core service offerings, and this is the reference architecture we'd actually build.",
    problem: "Most \"AI support\" is a chatbot that deflects to a human the moment a ticket gets non-trivial — teams end up triaging the hard cases manually anyway, with an extra layer in between.",
    approach: "A three-tier agent architecture — triage, resolver, and escalation — integrated directly with an existing helpdesk (Zendesk, Intercom), with a guardrails layer for PII protection and sentiment-based escalation, run in shadow mode against real ticket volume for three weeks before any customer-facing rollout, then phased in gradually.",
    stack: ["LangGraph", "Claude API", "Guardrails AI", "Zendesk API"],
    expectedOutcome: "The large majority of ticket volume resolved autonomously, with clean escalation on the rest — not another chatbot that deflects the moment something's non-trivial.",
  },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-8 overflow-hidden">
        {/* 3D transformation engine — ambient backdrop, behind all text content */}
        <div className="absolute inset-0 opacity-60">
          <VertexTransformationVisual />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_40%,black,transparent)] pointer-events-none" />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
          bg-[radial-gradient(circle,rgba(0,229,180,0.05)_0%,transparent_70%)] pointer-events-none animate-pulse" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Proof of Work</p></Reveal>
          <Reveal delay={80}>
            <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight leading-[1.02] mb-6">
              We're early. Here's what we've actually built.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] text-lg leading-relaxed">
              Vertex Data Systems doesn't have client case studies yet — we're a new company. What we do have is real, independent engineering work: production-style systems built end to end, not tutorials followed to completion. Every status label below is accurate. Nothing here is a client engagement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────── */}
      <section className="px-8 pb-8">
        <div className="max-w-screen-xl mx-auto space-y-6">
          {CASE_STUDIES.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <SpotlightCard as="a" href={`/case-studies/${p.id}`} className="block p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full border" style={{ color: p.color, borderColor: `${p.color}44` }}>
                    {p.status}
                  </span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">{p.category}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">{p.title}</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The problem</p>
                    <p className="text-sm text-[#8aa39e] leading-relaxed">{p.problem}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The approach</p>
                    <p className="text-sm text-[#8aa39e] leading-relaxed">{p.approach}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-3">Key features</p>
                  <div className="flex flex-wrap gap-2">
                    {p.features.map(f => (
                      <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-[#0d0f0e] border border-[#1e2b28] text-[#8aa39e]">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#1e2b28]">
                  <div className="max-w-xl">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">What this demonstrates</p>
                    <p className="text-sm" style={{ color: p.color }}>{p.outcome}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {p.stack.map(s => (
                      <span key={s} className="text-[10px] font-mono text-[#3a5550]">{s}{s !== p.stack[p.stack.length - 1] ? " ·" : ""}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-[#00e5b4] mt-6 flex items-center gap-1.5">
                  Read the full case study
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONCEPT SCENARIOS ─────────────────────────────────────────── */}
      <section className="px-8 py-20 border-t border-[#1e2b28] bg-[#0d0f0e]">
        <div className="max-w-screen-xl mx-auto space-y-6">
          <Reveal><p className="text-[#3a5550] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Concepts — Not Completed Projects</p></Reveal>
          {CONCEPTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <div className="border border-dashed border-[#2a3d38] rounded-2xl p-8 md:p-10">
                <p className="text-xs text-[#5a7570] italic mb-6">{c.note}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">{c.category}</p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">{c.title}</h2>
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The problem</p>
                    <p className="text-sm text-[#8aa39e] leading-relaxed">{c.problem}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The proposed approach</p>
                    <p className="text-sm text-[#8aa39e] leading-relaxed">{c.approach}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#1e2b28]">
                  <p className="text-sm text-[#00e5b4]">{c.expectedOutcome}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.stack.map(s => (<span key={s} className="text-[10px] font-mono text-[#3a5550]">{s}</span>))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 text-center">
        <Reveal>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-10">
            Want something built like this,<br />for your actual problem?
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
