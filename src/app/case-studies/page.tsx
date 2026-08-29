"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   /case-studies

   IMPORTANT — read before editing this file:
   This page shows REAL independent/prototype projects, not client work.
   VertexData doesn't have paying clients yet. Every entry here is either
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

const PROJECTS = [
  {
    id: "voice-agent-platform",
    status: "Independent project",
    category: "Voice AI · Multi-Tenant SaaS",
    title: "AI Voice Agent Platform",
    problem: "Most AI phone agent demos are single-tenant proofs of concept — they don't handle multiple businesses, real billing, or the reliability bar a paying customer would actually need.",
    approach: "Built a multi-tenant SaaS platform letting businesses across 11+ industries deploy AI phone agents — RAG-based knowledge retrieval so answers are grounded in each business's own information, automated appointment booking, and WhatsApp/email confirmations.",
    stack: ["FastAPI", "PostgreSQL", "Vapi", "Groq", "Stripe", "Pytest"],
    features: ["Multi-tenant architecture", "RAG knowledge retrieval", "Automated booking + confirmations", "Stripe billing integration", "35+ test Pytest suite"],
    outcome: "A working platform architecture — not just a call demo — proving multi-tenant voice AI deployment with the billing and test coverage a real product needs.",
    color: "#00e5b4",
  },
  {
    id: "ai-interviewer",
    status: "Deployed",
    category: "Voice AI · HR Tech",
    title: "AI Interviewer",
    problem: "Screening interviews are time-consuming and inconsistent between candidates when done manually at volume.",
    approach: "Built an end-to-end AI interview platform: analyzes an uploaded resume, conducts a live voice interview over WebRTC, and generates a structured hiring evaluation within minutes of the call ending.",
    stack: ["FastAPI", "PostgreSQL", "Streamlit", "Vapi", "WebRTC"],
    features: ["Resume analysis", "Live voice interview via WebRTC", "Structured evaluation generation", "Deployed on Render"],
    outcome: "A live, deployed system — not a mockup — demonstrating real-time voice AI paired with structured decision-support output.",
    color: "#00d19e",
  },
  {
    id: "career-gpt",
    status: "In active development",
    category: "Agentic AI · Automation",
    title: "AI Job Hunter (CareerGPT)",
    problem: "Job searching is fragmented across separate steps — finding roles, tailoring a resume for each one, and building outreach content — that most tools handle in isolation, if at all.",
    approach: "A 9-agent system automating job discovery, resume tailoring by role, and LinkedIn content generation, built with a multi-provider fallback chain so no single LLM outage stops the pipeline.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Qdrant", "Groq", "Claude", "GPT-4", "Gemini"],
    features: ["9-agent orchestration", "Role-specific resume tailoring", "Vector search via Qdrant", "Multi-provider LLM fallback chain"],
    outcome: "Demonstrates production-grade multi-agent orchestration with real reliability engineering — not a single-LLM wrapper.",
    color: "#00bcd4",
  },
  {
    id: "cancer-detection",
    status: "Proof of concept",
    category: "Computer Vision · Healthcare AI",
    title: "Multi-Cancer Detection System",
    problem: "Early detection across different cancer types usually requires organ-specific imaging expertise that isn't uniformly available.",
    approach: "A deep learning platform with 9 independently trained CNN models (ResNet50, EfficientNet) for organ-specific cancer classification, including brain and lung, with an image upload interface that identifies the cancer type and localizes the affected region.",
    stack: ["Python", "TensorFlow/PyTorch", "ResNet50", "EfficientNet"],
    features: ["9 independently trained CNN models", "Organ-specific classification", "Region localization on the image", "Clinical-report-style output"],
    outcome: "Demonstrates computer vision capability across multiple specialized classification tasks with a genuinely usable output format, not just a single-class demo.",
    color: "#b000e5",
  },
];

const CONCEPT = {
  category: "Concept · Proposed Architecture",
  title: "Automated Lead Qualification & Cold Outreach Engine",
  note: "This is a concept, not a completed or deployed project — included because CRM automation is VertexData's primary focus, and this is the reference architecture we'd actually build.",
  problem: "Sales teams lose momentum between a lead coming in and a rep actually calling them — manual qualification and cold-outreach sequencing eats the hours that matter most.",
  approach: "An AI layer sitting on top of an existing CRM (HubSpot/Salesforce) that scores incoming leads, drafts and sequences cold email/call outreach, and books qualified meetings directly onto a rep's calendar — with a human review queue before anything goes out at scale.",
  stack: ["HubSpot/Salesforce API", "Twilio", "n8n", "Claude", "GPT-4"],
  expectedOutcome: "Faster lead response time and more rep hours spent talking to qualified prospects instead of triaging a list by hand.",
};

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
      <section className="pt-36 pb-20 px-8">
        <div className="max-w-screen-xl mx-auto max-w-3xl">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Proof of Work</p></Reveal>
          <Reveal delay={80}>
            <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight leading-[1.02] mb-6">
              We're early. Here's what we've actually built.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] text-lg leading-relaxed">
              VertexData doesn't have client case studies yet — we're a new company. What we do have is real, independent engineering work: production-style systems built end to end, not tutorials followed to completion. Every status label below is accurate. Nothing here is a client engagement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────── */}
      <section className="px-8 pb-8">
        <div className="max-w-screen-xl mx-auto space-y-6">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <div className="border border-[#1e2b28] rounded-2xl p-8 md:p-10 hover:border-[#2a3d38] transition-colors duration-300">
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
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONCEPT SCENARIO ──────────────────────────────────────────── */}
      <section className="px-8 py-20 border-t border-[#1e2b28] bg-[#0d0f0e]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#3a5550] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Concept — Not a Completed Project</p></Reveal>
          <Reveal delay={60}>
            <div className="border border-dashed border-[#2a3d38] rounded-2xl p-8 md:p-10">
              <p className="text-xs text-[#5a7570] italic mb-6">{CONCEPT.note}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">{CONCEPT.category}</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">{CONCEPT.title}</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The problem</p>
                  <p className="text-sm text-[#8aa39e] leading-relaxed">{CONCEPT.problem}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">The proposed approach</p>
                  <p className="text-sm text-[#8aa39e] leading-relaxed">{CONCEPT.approach}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#1e2b28]">
                <p className="text-sm text-[#00e5b4]">{CONCEPT.expectedOutcome}</p>
                <div className="flex flex-wrap gap-1.5">
                  {CONCEPT.stack.map(s => (<span key={s} className="text-[10px] font-mono text-[#3a5550]">{s}</span>))}
                </div>
              </div>
            </div>
          </Reveal>
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
