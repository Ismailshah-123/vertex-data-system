"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CinematicVideo from "@/components/media/CinematicVideo";

const AIOrb = dynamic(() => import("@/components/three/AIOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-[#00e5b4]/20 animate-pulse" />
    </div>
  ),
});

/* ─── Data — 9 full services ─────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "crm-automation",
    number: "01",
    category: "Revenue Engine",
    title: "CRM Automation & Lead Generation",
    headline: "Turn your CRM into a self-running pipeline, not a data graveyard.",
    description:
      "We connect your CRM to an AI layer that qualifies leads, runs cold outreach, and books meetings — so your team spends time closing, not chasing. Built on the CRM you already use, with a human checkpoint wherever a wrong move would cost you a relationship.",
    whatWeDeliver: [
      "AI lead scoring synced directly into your existing pipeline stages",
      "Automated cold calling and cold email sequences that don't read as robotic",
      "Meeting booking that handles scheduling, reminders, and no-show follow-up",
      "CRM hygiene — auto-enrichment, deduplication, and stage tracking without manual entry",
      "A full audit trail of every automated touch, so nothing happens you can't see",
    ],
    stack: ["HubSpot", "Salesforce", "Twilio", "n8n", "Zapier", "Claude", "GPT-4", "Make"],
    metric: { value: "24/7", label: "automated outreach that never stops for a lunch break" },
    clientResult: "Every sequence ships with a human review queue and a kill-switch — so cold outreach scales without your brand voice going sideways.",
    color: "#00e5b4",
  },
  {
    id: "analytics",
    number: "02",
    category: "Business Intelligence",
    title: "Data Analytics & BI",
    headline: "Answers your team trusts, not another dashboard nobody opens.",
    description:
      "We build the semantic layer and live dashboards that replace 48-hour reports with a single source of truth — so 'what's our churn rate' means the same thing whether finance or product is asking.",
    whatWeDeliver: [
      "A semantic data model that's the same source of truth across every team",
      "Real-time dashboards wired to your actual production data, not a nightly export",
      "Cohort, churn, and LTV analysis built into the reporting layer itself",
      "Self-serve reporting your team can actually use without pinging a data analyst",
      "A cleanup audit of existing reports — most companies have 3 different 'truths'",
    ],
    stack: ["Python", "SQL", "dbt", "BigQuery", "Looker", "Metabase", "Airflow", "pandas"],
    metric: { value: "Real-time", label: "live dashboards instead of 48-hour-old reports" },
    clientResult: "We build the semantic layer once, so every team is arguing about strategy — not about whose spreadsheet has the right number.",
    color: "#00d19e",
  },
  {
    id: "web-development",
    number: "03",
    category: "Digital Presence",
    title: "Web Development",
    headline: "Fast, modern sites — built to actually convert, not just look nice.",
    description:
      "We design and build production-grade websites and web apps — marketing sites, internal tools, customer portals — on a modern stack that's fast today and genuinely maintainable in a year, not just at launch.",
    whatWeDeliver: [
      "Custom design and build on Next.js, React, or your existing stack",
      "Performance budgets enforced in CI, not just checked once at launch",
      "CMS integration so your team can update content without a developer",
      "SEO fundamentals and analytics wired in from day one, not bolted on after",
      "Clean handover — source code, docs, and a site your own team can extend",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Node.js", "PostgreSQL"],
    metric: { value: "<2s", label: "target load time on every build, enforced by CI" },
    clientResult: "Every site ships with real performance budgets in the pipeline — speed is a gate that blocks a bad deploy, not an afterthought.",
    color: "#00c9c0",
  },
  {
    id: "rag-chatbots",
    number: "04",
    category: "Knowledge Systems",
    title: "AI Knowledge Assistants (RAG Chatbots)",
    headline: "Answers grounded in your own documents — cited, not improvised.",
    description:
      "We build retrieval-augmented chatbots that answer from your private knowledge — docs, wikis, support tickets, product manuals — and cite exactly where the answer came from, respecting whatever access permissions already exist.",
    whatWeDeliver: [
      "Retrieval pipelines built on your actual documents, not a generic wrapper",
      "Every answer cited back to its source passage, so it's checkable",
      "Access-permission-aware retrieval — it won't surface what a user can't see",
      "A clean fallback when there's no grounded answer, instead of a confident guess",
      "Deployed as a widget, Slack app, or internal tool — wherever your team works",
    ],
    stack: ["LangChain", "LlamaIndex", "Pinecone", "Weaviate", "Claude", "GPT-4", "Cohere"],
    metric: { value: "Cited", label: "every answer traceable back to its source document" },
    clientResult: "If the assistant can't find a grounded answer in your documents, it says so — it doesn't improvise one.",
    color: "#00bcd4",
  },
  {
    id: "voice-ai",
    number: "05",
    category: "Voice Systems",
    title: "Voice AI Agents",
    headline: "Phone agents that sound natural and know when to hand off.",
    description:
      "We build voice agents for inbound and outbound calls — appointment booking, support triage, outbound follow-up — with streaming transcription, natural turn-taking, and a clean handoff to a human the moment a caller actually needs one.",
    whatWeDeliver: [
      "Inbound call handling — booking, FAQs, and routing without hold music",
      "Outbound calling for reminders, follow-ups, and qualification",
      "Natural turn-taking with barge-in, so callers don't have to wait out a script",
      "Grounded answers pulled from your actual systems, not generic scripting",
      "Clean escalation to a human agent with full context, not a cold transfer",
    ],
    stack: ["Twilio", "Deepgram", "ElevenLabs", "Claude", "GPT-4", "WebRTC", "n8n"],
    metric: { value: "<500ms", label: "target response latency for natural turn-taking" },
    clientResult: "Built with a clean handoff to a human the moment a caller needs one — no dead-end call loops.",
    color: "#00a8cc",
  },
  {
    id: "ml",
    number: "06",
    category: "Predictive Systems",
    title: "ML Engineering & Predictive Analytics",
    headline: "Models that stay accurate in production, not just in the notebook.",
    description:
      "We take predictive models from prototype to production — demand forecasting, churn prediction, pricing, risk scoring — with monitoring and retraining built in from day one, so accuracy doesn't quietly decay the month after launch.",
    whatWeDeliver: [
      "End-to-end pipelines from raw data to a served, monitored model",
      "A benchmark every model has to beat before it ships, not just a demo",
      "Drift monitoring so degrading accuracy gets caught before it costs a decision",
      "Automated retraining pipelines instead of a model that quietly goes stale",
      "Clear documentation of what the model does and doesn't handle well",
    ],
    stack: ["Python", "PyTorch", "scikit-learn", "MLflow", "Airflow", "Docker", "AWS SageMaker"],
    metric: { value: "Eval-gated", label: "no model ships without a benchmark it has to beat" },
    clientResult: "Every model gets a monitored baseline in production, so drift gets caught before it costs you a real decision.",
    color: "#0098c9",
  },
  {
    id: "agentic-ai",
    number: "07",
    category: "Autonomous Systems",
    title: "Agentic AI & Automation",
    headline: "Systems that plan, use tools, and finish the job — safely.",
    description:
      "We build multi-agent systems that decompose a goal, call your existing tools through typed interfaces, and complete multi-step work end-to-end — with explicit scope limits, approval gates, and a full trace of every decision the agent made.",
    whatWeDeliver: [
      "Multi-agent architectures scoped to specific, bounded workflows",
      "Typed tool integrations into your actual systems, not open-ended API access",
      "Approval gates wherever an automated mistake would actually cost you",
      "A full decision trace for every run, so you can see exactly what happened",
      "Observability and alerting when an agent gets stuck or goes out of scope",
    ],
    stack: ["LangGraph", "Claude", "GPT-4", "Temporal", "Redis", "PostgreSQL", "n8n"],
    metric: { value: "Scoped", label: "every agent has explicit tool limits and approval gates" },
    clientResult: "Multi-step workflows run autonomously inside boundaries you set — not an open-ended agent holding your API keys.",
    color: "#7c5cff",
  },
  {
    id: "vision",
    number: "08",
    category: "Perception Systems",
    title: "Computer Vision",
    headline: "Vision models built for the camera you actually have, not a demo reel.",
    description:
      "We build and deploy computer vision systems — quality inspection, object detection, OCR — tested against your actual hardware and lighting conditions, not stock footage, with a clear path from prototype to something running reliably at the edge.",
    whatWeDeliver: [
      "Custom model training on your actual images, not a generic pretrained demo",
      "Edge deployment so inference runs where the camera is, not round-tripping to a server",
      "Load-tested against your real hardware, lighting, and camera angles",
      "A defined confidence threshold with human review for anything below it",
      "Monitoring so a drifting model gets flagged before it silently degrades",
    ],
    stack: ["PyTorch", "OpenCV", "YOLO", "TensorRT", "ONNX", "NVIDIA Jetson", "AWS Panorama"],
    metric: { value: "Edge-ready", label: "models built to run where the camera actually is" },
    clientResult: "Vision pipelines are built and load-tested against your actual camera hardware, not stock demo footage.",
    color: "#b000e5",
  },
  {
    id: "nlp",
    number: "09",
    category: "Language Systems",
    title: "NLP & LLM Systems",
    headline: "Custom language systems, engineered — not just a prompt in a wrapper.",
    description:
      "We build the language layer underneath your product — fine-tuning, evaluation harnesses, and the prompt/model architecture — designed so switching model providers is a config change, not a rebuild, as the underlying models keep shifting.",
    whatWeDeliver: [
      "Fine-tuning and prompt engineering benchmarked against a real eval suite",
      "A model-agnostic architecture — the prompt and eval layer live separately from any one provider",
      "Structured output pipelines that don't silently break on edge cases",
      "Cost and latency tuning so the system is affordable to actually run at scale",
      "Ongoing eval monitoring as underlying models get updated by their providers",
    ],
    stack: ["Claude", "GPT-4", "Llama", "Hugging Face", "LangSmith", "Ollama", "vLLM"],
    metric: { value: "Model-agnostic", label: "built to swap providers without a rewrite" },
    clientResult: "We architect the prompt and eval layer separately from the model call, so a provider price hike doesn't mean a rebuild.",
    color: "#e5b400",
  },
];

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Animated particle burst on hover ───────────────────────────────────── */
function ParticleBurst({ color, active }: { color: string; active: boolean }) {
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      delay: i * 20,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {active && particles.map((p, i) => (
        <div key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
          style={{
            background: color,
            animation: `burstOut 0.6s ease-out ${p.delay}ms forwards`,
            // @ts-ignore
            "--angle": `${p.angle}rad`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Service block ──────────────────────────────────────────────────────── */
function ServiceBlock({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id={service.id} className="border-b border-[#1e2b28] last:border-0 relative overflow-hidden">
      {/* Ambient background number */}
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[24rem] font-black leading-none pointer-events-none select-none opacity-[0.015]">
        {service.number}
      </div>

      <div
        ref={ref}
        className={`max-w-screen-xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-start relative
          transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {/* Content */}
        <div className={isEven ? "order-1" : "order-1 md:order-2"}>
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-[#3a5550]">{service.number}</span>
            <span className="w-8 h-px bg-[#2a3d38]" />
            <span className="text-xs tracking-[0.15em] uppercase text-[#3a5550]">{service.category}</span>
          </div>

          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-4">
            {service.title}
          </h2>
          <p className="text-lg font-medium mb-6" style={{ color: service.color }}>
            {service.headline}
          </p>
          <p className="text-[#5a7570] leading-relaxed mb-10 text-sm">
            {service.description}
          </p>

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">What we deliver</p>
            <ul className="space-y-3">
              {service.whatWeDeliver.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#8aada8] group">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 group-hover:scale-150"
                    style={{ background: service.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-3">Tech stack</p>
            <div className="flex flex-wrap gap-2">
              {service.stack.map(tech => (
                <span key={tech}
                  className="text-xs px-3 py-1 rounded-full border border-[#1e2b28] text-[#3a5550]
                    hover:text-[#00e5b4] hover:border-[#00e5b4]/30 hover:scale-105 transition-all duration-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/services/${service.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all duration-300"
              style={{ background: service.color, color: "#000" }}>
              Explore {service.title} →
            </Link>
            <Link href="/projects"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl
                transition-all duration-300 border overflow-hidden"
              style={{
                background: `${service.color}15`,
                borderColor: `${service.color}30`,
                color: service.color,
              }}>
              <ParticleBurst color={service.color} active={hovered} />
              <span className="relative z-10">See orderable projects →</span>
            </Link>
          </div>
        </div>

        {/* Metrics card */}
        <div className={isEven ? "order-2" : "order-2 md:order-1"}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="border border-[#1e2b28] rounded-2xl p-8 mb-5 relative overflow-hidden group hover:border-[#2a3d38] transition-all duration-500">
            <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
              style={{ background: `radial-gradient(ellipse at top right, ${service.color}08, transparent 60%)` }} />
            <div className="text-[clamp(2.75rem,5.5vw,5rem)] font-black tracking-tight leading-none mb-2 tabular-nums transition-transform duration-500 group-hover:scale-105"
              style={{ color: service.color, transformOrigin: "left" }}>
              {service.metric.value}
            </div>
            <p className="text-xs text-[#3a5550] tracking-widest uppercase">{service.metric.label}</p>
          </div>

          <div className="border border-[#1e2b28] rounded-2xl p-8 relative overflow-hidden group hover:border-[#2a3d38] transition-colors">
            <div className="absolute top-4 right-6 text-6xl font-serif text-[#1a2422] select-none pointer-events-none leading-none">"</div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: service.color }}>
              In practice
            </p>
            <p className="text-sm text-[#8aada8] leading-relaxed italic">
              "{service.clientResult}"
            </p>
          </div>

          <div className="mt-5 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: `${service.color}05`, border: `1px solid ${service.color}10` }}>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    background: service.color,
                    opacity: vis ? (Math.random() > 0.4 ? 0.15 + Math.random() * 0.4 : 0.05) : 0,
                    transitionDelay: `${i * 15}ms`,
                  }} />
              ))}
            </div>
            <p className="text-[10px] text-[#2a3d38] tracking-widest uppercase mt-4">
              Built production-first, from day one
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ServicesPage() {
  const [activeNav, setActiveNav] = useState("crm-automation");
  const [chars, setChars] = useState("");

  useEffect(() => {
    const title = "Nine disciplines.";
    let i = 0;
    const t = setInterval(() => { setChars(title.slice(0, ++i)); if (i >= title.length) clearInterval(t); }, 45);

    const onScroll = () => {
      SERVICES.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 200) setActiveNav(s.id);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes burstOut {
          from { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0); opacity: 1; }
          to   { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px); opacity: 0; }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(0,229,180,0.3); }
          50%       { text-shadow: 0 0 60px rgba(0,229,180,0.6); }
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 px-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_30%_50%,black,transparent)]" />

        <div className="max-w-screen-xl mx-auto w-full grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-[#00e5b4]" />
                <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">What We Build</span>
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-[clamp(2.6rem,5.5vw,5rem)] font-black tracking-tight leading-[0.95] mb-8"
                style={{ animation: "titleGlow 4s ease-in-out infinite" }}>
                {chars}<span className="inline-block w-1 bg-[#00e5b4] ml-1 animate-pulse" style={{ height: "0.85em", verticalAlign: "middle" }} /><br />
                <span className="text-[#00e5b4]">One unfair</span><br />
                edge.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[#5a7570] text-lg leading-relaxed mb-10 max-w-lg">
                From data science foundations to autonomous agentic systems — every capability here is engineered to the same bar: tested, documented, and built to hold up outside a demo, not just to look good in one.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200
                      ${activeNav === s.id
                        ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/05 scale-105"
                        : "border-[#1e2b28] text-[#3a5550] hover:border-[#00e5b4]/40 hover:text-[#00e5b4]"
                      }`}>
                    {s.title}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative h-[340px] sm:h-[420px] md:h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-80 h-80 rounded-full border border-[#00e5b4]/05 animate-pulse" />
                <div className="absolute w-96 h-96 rounded-full border border-[#00e5b4]/03" style={{ animation: "spin 20s linear infinite" }} />
                <div className="absolute w-[28rem] h-[28rem] rounded-full border border-dashed border-[#00e5b4]/03" style={{ animation: "spin 35s linear infinite reverse" }} />
              </div>
              <AIOrb className="w-full h-full" />
            </div>
            {[
              { label: "Models",   value: "Agnostic", pos: "top-8 left-0",     delay: "0s" },
              { label: "Codebase", value: "Yours",     pos: "top-1/2 right-0",  delay: "0.7s" },
              { label: "Access",   value: "Direct",    pos: "bottom-8 left-8",  delay: "1.4s" },
            ].map(chip => (
              <div key={chip.label}
                className={`absolute ${chip.pos} bg-[#0d0f0e] border border-[#1e2b28] rounded-xl px-3 py-2 backdrop-blur-sm pointer-events-none`}
                style={{ animation: "float 6s ease-in-out infinite", animationDelay: chip.delay }}>
                <div className="text-[10px] text-[#3a5550] mb-0.5">{chip.label}</div>
                <div className="text-sm font-black text-[#00e5b4]">{chip.value}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── STICKY NAV ──────────────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-40 bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28] overflow-x-auto px-8">
        <div className="max-w-screen-xl mx-auto flex items-center gap-0">
          {SERVICES.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className={`shrink-0 text-xs font-semibold px-4 py-4 border-b-2 transition-all duration-200
                ${activeNav === s.id ? "border-[#00e5b4] text-[#00e5b4]" : "border-transparent text-[#3a5550] hover:text-[#8aada8]"}`}>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {SERVICES.map((service, i) => (
        <ServiceBlock key={service.id} service={service} index={i} />
      ))}

      {/* ── CINEMATIC VISUAL: ENTERPRISE ARCHITECTURE ────────────────────── */}
      <section className="py-20 px-8 bg-[#0a0c0b]">
        <div className="max-w-screen-xl xl:max-w-[1600px] mx-auto">
          <div className="relative border border-[#1e2b28] bg-[#0d0f0e] p-3">
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00e5b4]/40" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00e5b4]/40" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00e5b4]/40" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00e5b4]/40" />
            <CinematicVideo
              src="/videos/enterprise-architecture.mp4"
              poster="/videos/enterprise-architecture-poster.jpg"
              label="Individual capabilities resolving into a single enterprise architecture"
            />
          </div>
        </div>
      </section>

      {/* ── PROCESS CALLOUT ─────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-t border-[#1e2b28] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,180,0.04),transparent_70%)] pointer-events-none animate-pulse" />
        <div className="max-w-screen-xl mx-auto text-center relative">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Ready to start?</p></Reveal>
          <Reveal delay={100}>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-8">
              Every engagement starts with<br />
              <span className="text-[#00e5b4]">a free 60-minute audit.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl mx-auto mb-10">
              We'll review your data infrastructure, identify the highest-leverage AI opportunities, and outline a realistic roadmap — no pitch, no deck.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link href="/contact"
              className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold
                px-10 py-4 rounded-xl text-base hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)]
                transition-all duration-300">
              Book Your Free Audit →
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
