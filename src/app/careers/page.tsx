"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ROLES = [
  {
    id: "senior-ml-engineer",
    title: "Senior ML Engineer",
    team: "Machine Learning",
    type: "Full-time",
    location: "Remote",
    level: "Senior (5+ yrs)",
    accentColor: "#00e5b4",
    description: "Own the end-to-end lifecycle of production ML systems — from feature engineering through training infrastructure to real-time serving and monitoring. The kind of role that exists once there's enough production surface area to need a dedicated owner.",
    requirements: [
      "5+ years building ML systems that are live in production",
      "Deep knowledge of PyTorch and the modern MLOps stack (MLflow, Ray, Kubeflow)",
      "Experience designing feature stores and real-time inference pipelines",
      "Track record shipping models to millions of users or billions of records",
      "Strong Python. Comfortable in SQL. Not afraid of Terraform.",
    ],
    niceToHave: ["Experience with large-scale distributed training", "Published research at NeurIPS/ICML/ICLR", "Kubernetes at scale"],
  },
  {
    id: "llm-engineer",
    title: "LLM / NLP Engineer",
    team: "Language AI",
    type: "Full-time",
    location: "Remote",
    level: "Mid–Senior (3+ yrs)",
    accentColor: "#00c49a",
    description: "Build production RAG systems, fine-tune open-source LLMs, and design evaluation frameworks that go beyond vibes. You care about factual accuracy, latency, and cost — not just demo quality.",
    requirements: [
      "3+ years in NLP with at least 1 year working with large language models",
      "Hands-on experience building RAG systems in production (not just tutorials)",
      "Familiarity with LlamaIndex, LangChain, or LangGraph",
      "Experience with embedding models and vector databases (Pinecone, Weaviate, Chroma)",
      "Strong understanding of evaluation methodologies for generative AI",
    ],
    niceToHave: ["Experience fine-tuning LLMs with LoRA/QLoRA", "Open-source contributions (Hugging Face, etc.)", "Knowledge of RLHF/DPO"],
  },
  {
    id: "data-engineer",
    title: "Senior Data Engineer",
    team: "Data & Analytics",
    type: "Full-time",
    location: "Remote",
    level: "Senior (4+ yrs)",
    accentColor: "#00b48a",
    description: "Design and build the data infrastructure production AI systems run on — streaming pipelines, warehouse architecture, semantic layers. You care that the numbers are right before you make them fast.",
    requirements: [
      "4+ years building data pipelines and warehouse infrastructure",
      "Production experience with dbt, BigQuery/Snowflake/Databricks, and Airflow",
      "Strong understanding of data modelling and semantic layers",
      "Experience with streaming data using Kafka or Kinesis",
      "You've debugged a pipeline at 2am and lived to tell the story",
    ],
    niceToHave: ["Experience with real-time feature pipelines for ML", "Fivetran or Airbyte connector development", "dbt package authorship"],
  },
  {
    id: "ai-security-engineer",
    title: "AI Security Engineer",
    team: "AI Security",
    type: "Full-time",
    location: "Remote",
    level: "Senior (4+ yrs)",
    accentColor: "#9b00e5",
    description: "Red-team LLM deployments, harden production AI systems, and build the security evaluation frameworks regulated-industry AI deployments actually need.",
    requirements: [
      "4+ years in information security or application security",
      "Deep familiarity with OWASP LLM Top 10 and AI-specific threat models",
      "Experience performing red-team exercises on LLM deployments",
      "Understanding of adversarial ML and model robustness",
      "Security clearance or ability to obtain one (preferred)",
    ],
    niceToHave: ["Prior work at a government agency or defence contractor", "CVE credits or responsible disclosure history", "Published AI security research"],
  },
  {
    id: "computer-vision-engineer",
    title: "Computer Vision Engineer",
    team: "Perception AI",
    type: "Full-time",
    location: "Remote",
    level: "Mid–Senior (3+ yrs)",
    accentColor: "#00a07a",
    description: "Build real-time vision systems deployed at the edge for industrial and commercial use cases. 60fps inference on NVIDIA Jetson, integration with SCADA systems, and active learning loops.",
    requirements: [
      "3+ years building CV systems beyond academic projects",
      "Production experience with YOLO variants and TensorRT optimisation",
      "Edge deployment experience (NVIDIA Jetson, Coral, or equivalent)",
      "Strong understanding of data augmentation and synthetic data generation",
      "Experience integrating CV systems with industrial control systems is a bonus",
    ],
    niceToHave: ["Experience with 3D vision / point clouds", "SAM or foundation model adaptation experience", "C++ for inference optimisation"],
  },
];

const CULTURE = [
  {
    icon: "◎",
    title: "Depth over breadth",
    body: "Vertex will only take on the engagements it can go impossibly deep on — never a roster stretched thin. The same principle applies to hiring: five world-class engineers beats fifty average ones, and that's the bar for anyone who joins.",
  },
  {
    icon: "↗",
    title: "Ship to production",
    body: "We don't do POCs that die in a demo. Everything we build is designed to run in production on day one. If you've never had a model go live at scale, this will change that.",
  },
  {
    icon: "◈",
    title: "Write like you think",
    body: "Internal comms are written, not spoken. Weekly updates in writing. Design docs before meetings. We hire people who think clearly and write clearly.",
  },
  {
    icon: "⬡",
    title: "Ownership without permission",
    body: "If you see something broken, fix it. If you have a better idea, propose it. We have no middle management layer between an engineer and the decision that matters.",
  },
];

const BENEFITS = [
  "Competitive pay, benchmarked against the market once there's a comp band to set — not invented in advance",
  "Real equity — meaningful ownership, not a token grant",
  "Fully remote — work from wherever you do your best work",
  "An equipment budget, no fighting over spec",
  "Direct input into how this gets built — no management layer to go through",
  "Straight answers about what's actually funded versus aspirational",
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

function RoleCard({ role, index }: { role: typeof ROLES[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className={`border border-[#1e2b28] rounded-2xl overflow-hidden transition-all duration-400
        ${open ? "border-[#2a3d38]" : "hover:border-[#2a3d38]"}`}>
        {/* Header */}
        <button onClick={() => setOpen(v => !v)}
          className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-6 group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full border"
                style={{ borderColor: `${role.accentColor}40`, color: role.accentColor, background: `${role.accentColor}08` }}>
                {role.team}
              </span>
              <span className="text-[10px] text-[#3a5550]">{role.type}</span>
              <span className="text-[10px] text-[#2a3d38]">·</span>
              <span className="text-[10px] text-[#3a5550]">{role.location}</span>
              <span className="text-[10px] text-[#2a3d38]">·</span>
              <span className="text-[10px] text-[#3a5550]">{role.level}</span>
            </div>
            <h3 className={`text-xl font-black tracking-tight transition-colors duration-300
              ${open ? "text-[#00e5b4]" : "text-white group-hover:text-[#00e5b4]"}`}>
              {role.title}
            </h3>
          </div>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all duration-300
            ${open ? "border-[#00e5b4] text-[#00e5b4] rotate-45" : "border-[#2a3d38] text-[#3a5550]"}`}>
            <span className="text-lg leading-none">+</span>
          </div>
        </button>

        {/* Expanded */}
        {open && (
          <div className="px-6 md:px-8 pb-8 border-t border-[#1e2b28]">
            <p className="text-[#5a7570] text-sm leading-relaxed mt-6 mb-8">{role.description}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#2a3d38] mb-4">What we need</p>
                <ul className="space-y-3">
                  {role.requirements.map(r => (
                    <li key={r} className="flex items-start gap-3 text-sm text-[#8aada8]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: role.accentColor }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#2a3d38] mb-4">Nice to have</p>
                <ul className="space-y-3">
                  {role.niceToHave.map(r => (
                    <li key={r} className="flex items-start gap-3 text-sm text-[#5a7570]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-[#2a3d38] shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href={`mailto:hiring@vertexdata.systems?subject=Application: ${role.title}`}
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300"
                    style={{ background: `${role.accentColor}15`, border: `1px solid ${role.accentColor}30`, color: role.accentColor }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = role.accentColor; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${role.accentColor}15`; (e.currentTarget as HTMLElement).style.color = role.accentColor; }}>
                    Reach out about this role →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CareersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 600));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-8 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_80%_at_30%_50%,black,transparent)]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,180,0.04),transparent_70%)] pointer-events-none animate-pulse" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Future Team</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-black tracking-tight leading-[0.95] mb-8">
              Build AI that<br />
              <span className="text-[#00e5b4]">actually ships.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed mb-12">
              We're early-stage and founder-led — whoever joins now shapes how this gets built, not just executes someone else's roadmap. We work on hard problems, go deep, and care more about outcomes than process.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex items-center gap-8 flex-wrap">
              {[["Early", "Stage"], ["Founder-led", "Team"], ["Direct", "Impact"], ["Open", "Equity conversation"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-[#00e5b4] tracking-tight">{v}</div>
                  <div className="text-[10px] text-[#3a5550] uppercase tracking-widest">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CULTURE */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-y border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">How We Work</p></Reveal>
          <Reveal delay={80}><h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-20">
            No politics.<br /><span className="text-[#3a5550]">No managers. Just work.</span>
          </h2></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1e2b28]">
            {CULTURE.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="bg-[#0d0f0e] p-8 h-full group hover:bg-[#0a0c0b] transition-colors">
                  <div className="text-2xl text-[#00e5b4] mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">{c.icon}</div>
                  <h3 className="font-bold text-base mb-3 group-hover:text-[#00e5b4] transition-colors duration-300">{c.title}</h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="py-24 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Roles Ahead</p></Reveal>
          <Reveal delay={80}><h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-4">
            Where I'll be hiring first.
          </h2></Reveal>
          <Reveal delay={140}><p className="text-[#5a7570] text-sm max-w-lg mb-16">
            These aren't live requisitions yet — they're the roles Vertex will need first as real engagements come in. If one matches what you do and you'd like to be part of that early conversation, reach out directly. I read every message myself.
          </p></Reveal>
          <div className="space-y-4">
            {ROLES.map((role, i) => <RoleCard key={role.id} role={role} index={i} />)}
          </div>

          {/* No role fits */}
          <Reveal delay={200}>
            <div className="mt-8 border border-dashed border-[#2a3d38] rounded-2xl p-8 text-center group hover:border-[#00e5b4]/30 transition-colors">
              <h3 className="font-bold text-base mb-2 group-hover:text-[#00e5b4] transition-colors">Don't see your role?</h3>
              <p className="text-sm text-[#3a5550] mb-5 max-w-sm mx-auto">
                We hire exceptional people regardless of current openings. If you're world-class at something we need, we want to hear from you.
              </p>
              <a href="mailto:hiring@vertexdata.systems?subject=Speculative Application"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00e5b4] border border-[#00e5b4]/30 px-6 py-2.5 rounded-lg hover:bg-[#00e5b4] hover:text-black transition-all duration-300">
                Send a speculative application →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Compensation & Benefits</p></Reveal>
            <Reveal delay={80}><h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-6">
              Fair pay.<br /><span className="text-[#3a5550]">No empty perks.</span>
            </h2></Reveal>
            <Reveal delay={140}><p className="text-[#5a7570] text-sm leading-relaxed">
              There's no benchmarked comp band yet — that gets built honestly once there's revenue behind it, not invented in advance for a careers page. Here's what I can actually commit to.
            </p></Reveal>
          </div>
          <div>
            <div className="grid gap-3">
              {BENEFITS.map((b, i) => (
                <Reveal key={b} delay={i * 40}>
                  <div className="flex items-start gap-3 py-3 border-b border-[#111] last:border-0 group">
                    <span className="text-[#00e5b4] mt-0.5 text-sm shrink-0">✓</span>
                    <span className="text-sm text-[#8aada8] group-hover:text-white transition-colors duration-200">{b}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
