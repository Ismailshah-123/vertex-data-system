"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CinematicVideo from "@/components/media/CinematicVideo";
import dynamic from "next/dynamic";

const VertexIntelligentArchitecture = dynamic(
  () => import("@/components/vertex-3d-hero/VertexIntelligentArchitecture").then(m => m.VertexIntelligentArchitecture),
  {
    ssr: false, // canvas/WebGL-only, nothing meaningful to server-render
    loading: () => (
      <div className="w-full h-full rounded-2xl"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,229,180,0.06), transparent 70%)" }} />
    ),
  }
);

/* ─── Data ───────────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    icon: "◆", tag: "Flagship Service", title: "CRM Automation & Lead Gen",
    sub: "Your pipeline, running itself",
    desc: "AI-qualified leads, automated cold outreach, and meeting booking — synced directly into the CRM you already use.",
    chips: ["Cold calling & email", "Lead scoring"],
    href: "/services/crm-automation",
  },
  {
    icon: "▲", tag: "Core Service", title: "Data Analytics & BI",
    sub: "Real-time, not retrospective",
    desc: "Semantic data models and live dashboards that replace 48-hour reports with a single source of truth your whole company trusts.",
    chips: ["Live dashboards", "Semantic layer"],
    href: "/services/analytics",
  },
  {
    icon: "◈", tag: "Core Service", title: "Web Development",
    sub: "Built fast, built to convert",
    desc: "Modern, production-grade websites and web apps on a stack that's fast today and genuinely maintainable in a year.",
    chips: ["Next.js", "Performance budgets"],
    href: "/services/web-development",
  },
  {
    icon: "⬡", tag: "Knowledge Systems", title: "AI Knowledge Assistants",
    sub: "Grounded in your data",
    desc: "Retrieval-augmented chatbots that answer from your private knowledge — accurate, cited, and permission-aware.",
    chips: ["RAG", "Source citations"],
    href: "/services/rag-chatbots",
  },
  {
    icon: "▣", tag: "Voice Systems", title: "Voice AI Agents",
    sub: "Natural, not scripted",
    desc: "Inbound and outbound voice agents with streaming transcription, natural turn-taking, and a clean handoff to a human.",
    chips: ["Inbound & outbound", "Barge-in"],
    href: "/services/voice-ai",
  },
  {
    icon: "◉", tag: "Autonomous Systems", title: "Agentic AI & Automation",
    sub: "Systems that act, safely",
    desc: "Multi-agent architectures that plan, use tools, and complete complex workflows end-to-end with full observability.",
    chips: ["Tool-using agents", "Approval gates"],
    href: "/services/agentic-ai",
  },
];

const PROCESS = [
  { n: "01", icon: "◎", title: "Discover", body: "We map high-value use cases, quantify ROI, and pressure-test feasibility before a line of code." },
  { n: "02", icon: "◈", title: "Design",   body: "Reference architecture, data flows, guardrails, and an evaluation strategy tailored to your risk." },
  { n: "03", icon: "▲", title: "Build",    body: "Rapid, eval-driven iteration in short cycles — you see working software every week." },
  { n: "04", icon: "▣", title: "Deploy",   body: "Ship to your cloud or on-prem with monitoring, canary rollouts, and safe rollback." },
  { n: "05", icon: "⬈", title: "Scale",    body: "Optimize cost and latency, expand to new workflows, and enable your team to own it." },
];

const DIFFERENTIATORS = [
  {
    icon: "✓", title: "Evaluation-driven",
    desc: "Every model and pipeline gets a benchmark suite before it ships — accuracy, latency, and cost tracked against a baseline you sign off on, not a demo we hand-picked.",
  },
  {
    icon: "☁", title: "Deployed your way",
    desc: "Runs where your compliance team already trusts it — your AWS/Azure/GCP account, an isolated VPC, or fully air-gapped on-prem with open-weight models when nothing can leave the building.",
  },
  {
    icon: "◇", title: "Source-code handover",
    desc: "Full repository access from day one, not just at offboarding — commit history, architecture notes, and a runbook your own engineers can pick up without calling us.",
  },
  {
    icon: "◐", title: "Human in the loop",
    desc: "We map out exactly where a wrong automated call would actually hurt — refunds, compliance, patient records — and put a person there, instead of a blanket review queue on everything.",
  },
];

const INDUSTRIES_TEASER = [
  { icon: "◆", name: "Financial Services",         desc: "Fraud detection and advisory copilots built to satisfy the regulator, not just the demo.",
    helps: ["Real-time fraud detection", "Regulatory reporting automation", "Client advisory copilots", "Risk model governance"] },
  { icon: "✚", name: "Healthcare & Life Sciences", desc: "Clinical documentation and research tooling, HIPAA-aligned from the first line of code.",
    helps: ["Clinical documentation NLP", "Research acceleration", "Appointment & intake handling", "HIPAA-aligned architecture"] },
  { icon: "⬡", name: "Manufacturing",              desc: "Vision-based quality inspection and predictive maintenance that catches failure early.",
    helps: ["Computer vision QA", "Predictive maintenance", "Supplier knowledge search", "Quality report drafting"] },
  { icon: "▣", name: "Retail & E-commerce",        desc: "Demand forecasting and personalization that moves before the season does.",
    helps: ["Demand forecasting", "Personalization engines", "Catalogue & content generation", "Order & returns assistants"] },
  { icon: "⚖", name: "Legal & Compliance",         desc: "Contract intelligence and policy research with citations you can actually verify.",
    helps: ["Contract review support", "Policy & compliance Q&A", "Clause extraction", "Due-diligence drafting"] },
  { icon: "◉", name: "Technology & SaaS",          desc: "Ship AI features fast on infrastructure built for your first agent and your millionth call.",
    helps: ["Embedded in-product AI", "Documentation search", "Support deflection", "Internal tooling agents"] },
];

const STATS = [
  { value: "1:1",   label: "Direct founder access" },
  { value: "100%",  label: "Source code ownership" },
  { value: "2026",  label: "Founded" },
  { value: "0",     label: "Account managers" },
];

const STACK_GROUPS = [
  { title: "Models",         items: ["Claude (Opus / Sonnet / Haiku)", "GPT-4 class", "Llama", "Mistral", "Gemini", "Fine-tuned open models"] },
  { title: "Orchestration",  items: ["LangGraph", "LlamaIndex", "Custom agent runtimes", "Temporal", "Model Context Protocol"] },
  { title: "Data & Retrieval", items: ["pgvector", "Pinecone", "Weaviate", "Elasticsearch", "Hybrid search"] },
  { title: "Evaluation",     items: ["Braintrust", "Ragas", "Custom eval harness", "LLM-as-judge", "Human review"] },
  { title: "Observability",  items: ["OpenTelemetry", "Langfuse", "Datadog", "Prometheus", "Grafana"] },
  { title: "Infrastructure", items: ["AWS", "GCP", "Azure", "Kubernetes", "vLLM", "Ray"] },
];

const FAQS = [
  { q: "How fast can you deliver a production system?", a: "Most pilots reach a production-ready prototype in 6–9 weeks. Full builds typically run 3–5 months depending on integrations and compliance requirements." },
  { q: "How do engagements start?", a: "With a free 60-minute discovery call — no pitch deck. We map your highest-value use case and show you a concrete path to production before you commit to anything." },
  { q: "Can our data stay private?", a: "Yes. We support fully on-prem and VPC-isolated deployments with zero data egress. Nothing leaves your infrastructure unless you explicitly choose a managed option." },
  { q: "Are you compliant with our standards?", a: "We're early-stage and don't hold formal certifications like SOC 2 yet — we won't tell you otherwise. What you do get: architecture designed around your compliance requirements from day one (access controls, audit logging, data residency), and a direct conversation about exactly what's been audited and what hasn't before you commit." },
  { q: "Which models do you use?", a: "We're model-agnostic — Claude, GPT-4 class, Llama, Mistral, Gemini, or fine-tuned open models, chosen for the job rather than a fixed preference." },
  { q: "How do you prevent hallucinations?", a: "Retrieval grounding, citation verification, confidence scoring, and human-in-the-loop review for anything above a risk threshold you define." },
];

/* ─── Reveal hook ────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ value }: { value: string }) {
  const { ref, visible } = useReveal(0.5);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!visible) return;
    // Only animate values shaped like [prefix][number][suffix] (e.g. "$1.5M", "100%").
    // Values with no clean single numeric run (e.g. "1:1") render as-is, unanimated.
    const match = value.match(/^(\D*)([\d.]+)(\D*)$/);
    if (!match) { setDisplay(value); return; }
    const [, prefix, numStr, suffix] = match;
    const num = parseFloat(numStr);
    let startTime = 0;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const v = num * ease;
      setDisplay(prefix + (Number.isInteger(num) ? Math.round(v).toString() : v.toFixed(1)) + suffix);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [visible, value]);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{display}</span>;
}

function MagneticBtn({ children, className = "", href }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    ref.current.style.transform = `translate(${x * 10}px, ${y * 6}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };

  if (href) {
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>}
        className={`transition-transform duration-200 inline-block ${className}`}
        onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>}
      className={`transition-transform duration-200 inline-block ${className}`}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1e2b28] last:border-0">
      <button onClick={() => setOpen(v => !v)} className="w-full text-left py-5 flex items-center justify-between gap-6 group">
        <span className={`text-base font-semibold transition-colors ${open ? "text-[#00e5b4]" : "text-white group-hover:text-[#8aada8]"}`}>{q}</span>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${open ? "border-[#00e5b4] text-[#00e5b4] rotate-45" : "border-[#2a3d38] text-[#3a5550]"}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ${open ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"}`}>
        <p className="text-sm text-[#5a7570] leading-relaxed max-w-xl">{a}</p>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // When reduced motion is preferred, content still appears via variants
  // (hidden -> visible), it just doesn't spring, slide, or scale to get there.
  const heroItemTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 100, damping: 20 };
  const heroItemVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  useEffect(() => {
    const onScroll = () => {
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        heroTextRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 500));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* ── HERO (dark) ────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center px-8 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_75%_at_35%_45%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,180,0.06)_0%,transparent_70%)] animate-pulse pointer-events-none" />

        <div className="max-w-screen-xl mx-auto w-full grid md:grid-cols-[1.15fr_0.85fr] gap-16 items-center relative">
          <motion.div
            ref={heroTextRef}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
            }}
          >
            <motion.div
              className="flex items-center gap-3 mb-7"
              variants={heroItemVariants}
              transition={heroItemTransition}
            >
              <span className="w-6 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs font-semibold tracking-[0.2em] uppercase">Enterprise AI Systems</span>
            </motion.div>

            <h1 className="text-[clamp(2.6rem,5.5vw,4.6rem)] font-black leading-[1.05] tracking-[-0.03em] mb-7">
              {["Build Enterprise AI Systems", null, "That Actually Deliver", null, "Business Value."].map((line, i) =>
                line === null ? <br key={i} /> : (
                  <motion.span
                    key={i}
                    className={`inline-block ${line.includes("Actually Deliver") ? "text-[#00e5b4]" : ""}`}
                    variants={reduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}
                    transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 90, damping: 18 }}
                  >
                    {line}
                  </motion.span>
                )
              )}
            </h1>

            <motion.p
              className="text-[#8aada8] text-base max-w-lg leading-relaxed mb-10"
              variants={heroItemVariants}
              transition={heroItemTransition}
            >
              We build production ML systems, autonomous AI agents, and real-time analytics infrastructure — the kind that runs unattended in your stack for years, not the kind that only survives a demo.
            </motion.p>

            <motion.div
              className="flex items-center gap-4 flex-wrap"
              variants={heroItemVariants}
              transition={heroItemTransition}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Link href="/contact" className="inline-block bg-[#00e5b4] text-black font-bold px-7 py-3.5 rounded-xl text-sm
                  hover:bg-white hover:shadow-[0_0_50px_rgba(0,229,180,0.4)] transition-[background-color,box-shadow] duration-300">
                  Start a project →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Link href="/projects" className="inline-block border border-[#2a3d38] text-white font-semibold px-7 py-3.5 rounded-xl text-sm
                  hover:border-[#00e5b4] hover:text-[#00e5b4] transition-colors duration-300">
                  See our work
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Vertex Intelligent Architecture — 3D */}
          <motion.div
            className="w-full aspect-square max-w-[520px] mx-auto md:mx-0"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 80, damping: 16, delay: 0.5 }}
          >
            <VertexIntelligentArchitecture />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <span className="text-[#3a5550] text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#00e5b4] to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* Trust strip intentionally removed — there are no real clients yet to
          honestly show here. See CHANGELOG_CREDIBILITY_SWEEP.md. */}


      {/* ── CAPABILITIES (light) ───────────────────────────────────────── */}
      <section className="bg-[#0d0f0e] text-[#f0f5f3] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between mb-16 flex-wrap gap-6">
            <div>
              <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">What We Do</p></Reveal>
              <Reveal delay={80}>
                <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] max-w-xl">
                  AI capabilities, built for <span className="text-[#00e5b4]">production</span>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="text-[#5a7570] text-sm max-w-md mt-5 leading-relaxed">
                  From first prototype to a system serving real users — every capability comes with evaluation, guardrails, and observability baked in.
                </p>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <Link href="/services" className="text-sm font-semibold text-[#00e5b4] border border-[#00e5b4]/30 px-5 py-2.5 rounded-lg hover:bg-[#00e5b4] hover:text-black transition-all duration-300 whitespace-nowrap">
                All services →
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <Link href={c.href} className="group block bg-[#0a0c0b] rounded-2xl p-7 h-full border border-[#1e2b28]
                  hover:border-[#00e5b4]/40 hover:shadow-[0_20px_50px_rgba(0,229,180,0.08)] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#00e5b4] text-black flex items-center justify-center text-lg mb-5
                    group-hover:scale-110 transition-transform duration-300">
                    {c.icon}
                  </div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#00e5b4] font-semibold mb-2">{c.tag}</div>
                  <h3 className="text-lg font-black tracking-tight mb-1 text-white">{c.title}</h3>
                  <p className="text-xs text-[#00e5b4] font-medium mb-3">{c.sub}</p>
                  <p className="text-sm text-[#5a7570] leading-relaxed mb-5">{c.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.chips.map(chip => (
                      <span key={chip} className="text-[10px] px-2.5 py-1 rounded-full bg-[#111413] text-[#5a7570] group-hover:bg-[#00e5b4]/10 group-hover:text-[#00e5b4] transition-colors">{chip}</span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC VISUAL: BRAND MOMENT ───────────────────────────────── */}
      <section className="bg-[#0d0f0e] py-20 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <CinematicVideo
            src="/videos/vertex-logo-assembly.mp4"
            poster="/videos/vertex-logo-assembly-poster.jpg"
            label="Scattered signals assembling into the Vertex Data Systems mark"
          />
        </div>
      </section>

      {/* ── SOLUTIONS BANNER (dark) ────────────────────────────────────── */}
      <section className="bg-[#0a0c0b] py-28 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="max-w-screen-xl mx-auto text-center relative">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-5 font-semibold">AI Solutions</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-black tracking-tight leading-[1.05] mb-5">
              One platform. <span className="text-[#00e5b4]">Every AI capability.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] max-w-xl mx-auto mb-16">
              Composable building blocks that snap together into the exact system your business needs.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { title: "RAG grounded in your data", desc: "Accurate, cited, and permission-aware answers over private knowledge.", href: "/services/rag-chatbots" },
              { title: "Voice agents that sound human", desc: "Natural turn-taking and streaming transcription, with a clean handoff to a person when needed.", href: "/services/voice-ai" },
              { title: "Agentic AI that acts",       desc: "Multi-agent systems that plan, use tools, and complete work end-to-end safely.", href: "/services/agentic-ai" },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <Link href={s.href} className="group block bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-7 h-full
                  hover:border-[#00e5b4]/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-base group-hover:text-[#00e5b4] transition-colors">{s.title}</h3>
                    <span className="text-[#3a5550] group-hover:text-[#00e5b4] transition-colors">↗</span>
                  </div>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{s.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────── */}
      <section className="bg-[#0d0f0e] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          {/* Left — eyebrow, heading, description */}
          <div>
            <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Our Standards</p></Reveal>
            <Reveal delay={80}>
              <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] mb-5">
                What you get on <span className="text-[#00e5b4]">every engagement</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[#5a7570] leading-relaxed">
                We'd rather be judged on how we build than on numbers you can't verify.
              </p>
            </Reveal>
          </div>

          {/* Right — 2×2 card grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.title} delay={i * 70}>
                <div className="bg-[#0a0c0b] rounded-2xl p-7 h-full border border-[#1e2b28] hover:border-[#00e5b4]/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#161918] border border-[#1e2b28] text-[#00e5b4] flex items-center justify-center text-base mb-5 font-bold">
                    {d.icon}
                  </div>
                  <h3 className="text-base font-black tracking-tight mb-2 text-white">{d.title}</h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC VISUAL: SYSTEM FLOW ────────────────────────────────── */}
      <section className="bg-[#0d0f0e] py-24 md:py-32 px-8 border-t border-[#1e2b28] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-16 items-center relative">
          {/* Copy */}
          <Reveal>
            <div className="relative pl-6 border-l border-[#1e2b28]">
              <span className="absolute top-0 -left-px w-px h-10 bg-[#00e5b4]/40" />
              <span className="absolute bottom-0 -left-px w-px h-10 bg-[#00e5b4]/40" />
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[11px] text-[#00e5b4] uppercase tracking-widest">01 // System Flow</span>
              </div>
              <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-black tracking-tight leading-[1.1] mb-5">
                Scattered data, one coherent system.
              </h2>
              <p className="text-[#8aada8] text-base leading-relaxed mb-8 max-w-md">
                Most organizations don't have a data problem — they have a dozen disconnected systems that were never designed to talk to each other. This is the same pipeline architecture behind every project on this site: ingestion, normalization, and routing, built to hold up once it's actually carrying production traffic.
              </p>
              <Link href="/process"
                className="inline-flex items-center gap-2 border border-[#2a3d38] text-white font-semibold px-6 py-3.5 rounded-xl text-sm
                  hover:border-[#00e5b4] hover:text-[#00e5b4] transition-colors duration-300 group">
                See how it's built
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </Reveal>

          {/* Video, in an architectural frame */}
          <Reveal delay={100}>
            <div className="relative border border-[#1e2b28] bg-[#0a0c0b] p-3">
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00e5b4]/40" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00e5b4]/40" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00e5b4]/40" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00e5b4]/40" />
              <CinematicVideo
                src="/videos/system-flow.mp4"
                poster="/videos/system-flow-poster.jpg"
                label="Fragmented data streams resolving into a single organized system"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROCESS (light) ────────────────────────────────────────────── */}
      <section className="bg-[#0a0c0b] py-28 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">How We Work</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] mb-20 max-w-xl">
              From idea to production in <span className="text-[#00e5b4]">weeks, not years</span>
            </h2>
          </Reveal>

          <div className="relative">
            {/* Mobile / tablet — vertical timeline, always a full column, no remainder */}
            <div className="lg:hidden relative">
              <div className="absolute left-[21px] top-2 bottom-2 w-px bg-[#1e2b28]" />
              <div className="space-y-10">
                {PROCESS.map((step, i) => (
                  <Reveal key={step.n} delay={i * 80}>
                    <div className="flex items-start gap-5">
                      <div className="w-11 h-11 rounded-xl border border-[#00e5b4]/30 bg-[#0d0f0e] flex items-center justify-center text-base text-[#00e5b4] shrink-0 relative z-10">
                        {step.icon}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-lg font-black tracking-tight mb-2 text-white">
                          <span className="text-[#3a5550] font-mono text-sm mr-2 align-middle">{step.n}</span>
                          {step.title}
                        </h3>
                        <p className="text-sm text-[#5a7570] leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Desktop — exact 5-across, 5 items ÷ 5 columns, never a remainder */}
            <div className="hidden lg:grid grid-cols-5 gap-x-8 relative">
              <div className="absolute left-0 right-0 top-[22px] h-px bg-[#1e2b28]" />
              {PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 80}>
                  <div className="w-11 h-11 rounded-xl border border-[#00e5b4]/30 bg-[#0a0c0b] flex items-center justify-center text-base text-[#00e5b4] mb-5 relative z-10">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-black tracking-tight mb-2 text-white">
                    <span className="text-[#3a5550] font-mono text-xs mr-1.5 align-middle">{step.n}</span>
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{step.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC VISUAL: INTELLIGENCE NETWORK ───────────────────────── */}
      <section className="bg-[#0a0c0b] py-20 px-8">
        <div className="max-w-screen-xl mx-auto">
          <CinematicVideo
            src="/videos/intelligence-network.mp4"
            poster="/videos/intelligence-network-poster.jpg"
            label="A network of signals converging into a single intelligent system"
          />
        </div>
      </section>

      {/* ── INDUSTRIES TEASER ─────────────────────────────────────────── */}
      <section className="bg-[#0a0c0b] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Who We Serve</p></Reveal>
            <Reveal delay={80}>
              <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] mb-5">
                Built for sectors with the most to <span className="text-[#00e5b4]">gain from AI</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[#5a7570] text-sm leading-relaxed mb-7">
                Domain context and compliance know-how for industries where a wrong answer actually costs something.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <Link href="/clients" className="inline-block text-sm font-semibold text-[#00e5b4] border border-[#00e5b4]/30 px-5 py-2.5 rounded-lg hover:bg-[#00e5b4] hover:text-black transition-all duration-300">
                All industries →
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRIES_TEASER.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 60}>
                <div className="bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-7 h-full flex flex-col
                  hover:border-[#00e5b4]/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#161918] border border-[#1e2b28] text-[#00e5b4] flex items-center justify-center text-base mb-5 font-bold shrink-0">
                    {ind.icon}
                  </div>
                  <h3 className="font-black text-base tracking-tight mb-2">{ind.name}</h3>
                  <p className="text-xs text-[#5a7570] leading-relaxed mb-5">{ind.desc}</p>

                  <p className="text-[10px] tracking-[0.15em] text-[#3a5550] uppercase font-semibold mb-3">Where we help</p>
                  <div className="grid grid-cols-1 gap-1.5 mb-6">
                    {ind.helps.map(h => (
                      <div key={h} className="flex items-start gap-2 text-xs text-[#8aa39e]">
                        <span className="text-[#00e5b4] shrink-0 mt-px">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/clients" className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#00e5b4] hover:underline">
                    Explore {ind.name} →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH ECOSYSTEM (dark) ──────────────────────────────────────── */}
      <section className="bg-[#0d0f0e] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Technology Ecosystem</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] mb-5">
              Model-agnostic. <span className="text-[#00e5b4]">Battle-tested tools.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] max-w-xl mb-16 leading-relaxed">
              We choose the right model and infrastructure for the job — frontier or open, cloud or on-prem — and wire it into a stack built to last.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {STACK_GROUPS.map((group, i) => (
              <Reveal key={group.title} delay={i * 60}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#00e5b4] font-semibold mb-4">{group.title}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-full border border-[#1e2b28] text-[#8aada8] hover:border-[#00e5b4]/40 hover:text-[#00e5b4] transition-all duration-200">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS (light) ──────────────────────────────────────────────── */}
      <section className="bg-[#0a0c0b] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto text-center">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">By The Numbers</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black tracking-tight leading-[1.05] mb-4">
              Outcomes that reach the <span className="text-[#00e5b4]">P&L</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] max-w-lg mx-auto mb-16">We measure success in production reliability and business value — not demos.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="bg-[#0d0f0e] rounded-2xl p-5 sm:p-6 md:p-8 border border-[#1e2b28]">
                  <div className="text-4xl font-black tracking-tight text-[#00e5b4] mb-2 tabular-nums"><Counter value={s.value} /></div>
                  <div className="text-xs text-[#5a7570] tracking-wide">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKING STYLE (dark) ───────────────────────────────────────── */}
      <section className="bg-[#0a0c0b] py-28 px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,229,180,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Working style</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight leading-tight mb-12">
              Built the way I'd want to <span className="text-[#00e5b4]">hire</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <div className="text-5xl text-[#1a2422] font-serif mb-4">"</div>
            <p className="text-lg text-[#c8d8d4] leading-relaxed mb-8 -mt-8">
              You get one person who understands your system end to end — not a rotating cast of account managers. I write the code, I own the outcome, and I'm reachable when something breaks.
            </p>
            <div className="w-10 h-10 rounded-full bg-[#00e5b4]/10 border border-[#00e5b4]/30 flex items-center justify-center mx-auto mb-3 text-[#00e5b4] font-black text-sm">
              V
            </div>
            <p className="text-xs text-[#3a5550]">Ismail Shah, Founder — Vertex Data Systems</p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ (light) ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d0f0e] py-28 px-8 border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-16">
          <div>
            <Reveal><p className="text-[10px] tracking-[0.2em] uppercase text-[#00e5b4] font-semibold mb-4">FAQ</p></Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl font-black tracking-tight mb-4">Questions, <span className="text-[#00e5b4]">answered</span></h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-sm text-[#5a7570] mb-4">Everything enterprise buyers ask before they engage.</p>
              <Link href="/faq" className="text-sm font-semibold text-[#00e5b4] hover:underline">
                Still curious? See all FAQs →
              </Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="bg-[#0a0c0b] rounded-2xl border border-[#1e2b28] px-8">
              {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA (dark) ───────────────────────────────────────────── */}
      <section id="contact" className="bg-[#0a0c0b] py-28 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,180,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-black tracking-tight leading-tight mb-6">
              Ready to build AI that<br /><span className="text-[#00e5b4]">actually delivers?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[#8aada8] max-w-lg mx-auto mb-10">
              Book a discovery call. We'll map the highest-value use case in your business and show you a path to production.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <MagneticBtn href="/contact" className="bg-[#00e5b4] text-black font-bold px-8 py-4 rounded-xl text-sm
                hover:bg-white hover:shadow-[0_0_50px_rgba(0,229,180,0.4)] transition-all duration-300">
                Start a project →
              </MagneticBtn>
              <MagneticBtn href="/case-studies" className="border border-[#2a3d38] text-white font-semibold px-8 py-4 rounded-xl text-sm
                hover:border-[#00e5b4] hover:text-[#00e5b4] transition-all duration-300">
                See what we've built
              </MagneticBtn>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
