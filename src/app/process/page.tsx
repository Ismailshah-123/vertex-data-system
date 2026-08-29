"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CinematicVideo from "@/components/media/CinematicVideo";

/* ─── Data — your own 6-stage flow (not copied, your framing) ────────────── */
const STAGES = [
  {
    n: "01",
    title: "Audit",
    subtitle: "We find out what's actually true first.",
    body: "Before any architecture gets proposed, we spend up to two weeks inside your data — auditing sources, quality, and the assumptions your team has been operating on. Most engagements change scope after this stage, because most assumptions turn out to be wrong.",
    deliverable: "A written audit: what your data can and can't support, and where the real leverage is.",
    duration: "1–2 weeks",
    color: "#00e5b4",
  },
  {
    n: "02",
    title: "Architect",
    subtitle: "The blueprint, before the build.",
    body: "We design the full system on paper — data flows, model boundaries, agent topology, security posture — and pressure-test it against your compliance and scale requirements before writing production code. This is the stage most agencies skip. It's the one that prevents rebuilds.",
    deliverable: "A reference architecture doc your engineering team can review, challenge, and sign off on.",
    duration: "1–3 weeks",
    color: "#00d19e",
  },
  {
    n: "03",
    title: "Build",
    subtitle: "Working software every week, not a reveal at the end.",
    body: "Short, eval-driven cycles. You see deployed increments weekly — not a black box that resurfaces after three months. Every model, pipeline, and agent ships with its evaluation harness attached from day one, so quality is measured continuously, not guessed at the end.",
    deliverable: "Weekly working deploys to a staging environment you have full access to.",
    duration: "4–16 weeks",
    color: "#00c49a",
  },
  {
    n: "04",
    title: "Harden",
    subtitle: "Production is a different bar than a demo.",
    body: "Before anything touches real users, it goes through adversarial testing, load testing, and a security review matched to your risk profile. We've seen too many 'working' systems break the first week in production because this stage got compressed. We don't compress it.",
    deliverable: "A pass/fail report against acceptance criteria agreed with you at kickoff.",
    duration: "1–3 weeks",
    color: "#00b48a",
  },
  {
    n: "05",
    title: "Deploy",
    subtitle: "Ship with a rollback plan, not just a launch plan.",
    body: "Canary rollouts, monitoring dashboards, and automated alerting go live alongside the system itself — not as an afterthought. If something degrades, you know within minutes, and we've already built the path back to the last known-good state.",
    deliverable: "A live production system plus the monitoring stack that watches it.",
    duration: "3–5 days",
    color: "#00a07a",
  },
  {
    n: "06",
    title: "Compound",
    subtitle: "The system should get better without you asking.",
    body: "Drift detection, automated retraining triggers, and quarterly architecture reviews keep the system improving after we've handed it fully to your team. This is the stage that separates a project from an asset.",
    deliverable: "A self-monitoring system and a documented handover your team owns outright.",
    duration: "Ongoing",
    color: "#008a68",
  },
];

const PRINCIPLES = [
  { icon: "◎", title: "Truth before architecture", body: "We refuse to design a system on top of data we haven't personally verified." },
  { icon: "⬡", title: "Weekly proof, not milestone theater", body: "If you haven't seen working software in two weeks, something is wrong — and we'll tell you." },
  { icon: "◈", title: "Evaluation is not optional", body: "Every model ships with the harness that proves it works — not a demo that happened to work once." },
  { icon: "↗", title: "Transfer, don't trap", body: "Every system is built so your team can run it without us. Dependency is not our business model." },
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

/* ─── Stage block — alternating, cinematic, with a live progress spine ──── */
function StageBlock({ stage, index, total }: { stage: typeof STAGES[0]; index: number; total: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div id={`stage-${stage.n}`} className="relative border-b border-[#1e2b28] last:border-0">
      {/* Ghost number background */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[16rem] font-black leading-none pointer-events-none select-none opacity-[0.02]">
        {stage.n}
      </div>

      <div ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`max-w-screen-xl mx-auto px-8 py-20 grid md:grid-cols-[100px_1fr_1fr] gap-8 items-start relative
          transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

        {/* Progress spine node */}
        <div className="hidden md:flex flex-col items-center">
          <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all duration-500
            ${hovered ? "scale-110" : ""}`}
            style={{
              borderColor: stage.color,
              color: stage.color,
              background: hovered ? `${stage.color}12` : "transparent",
              boxShadow: hovered ? `0 0 30px ${stage.color}30` : "none",
            }}>
            {stage.n}
          </div>
          {index < total - 1 && <div className="w-px flex-1 mt-4 bg-[#1e2b28] min-h-[80px]" />}
        </div>

        {/* Content */}
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-3">
            Stage {stage.n} of {total} · {stage.duration}
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">{stage.title}</h2>
          <p className="text-sm font-medium mb-6" style={{ color: stage.color }}>{stage.subtitle}</p>
          <p className="text-[#8aada8] leading-relaxed text-sm">{stage.body}</p>
        </div>

        {/* Deliverable card */}
        <div>
          <div className="border border-[#1e2b28] rounded-2xl p-7 relative overflow-hidden group hover:border-[#2a3d38] transition-colors">
            <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
              style={{ background: `radial-gradient(ellipse at top right, ${stage.color}08, transparent 60%)` }} />
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: stage.color }}>What you get</p>
            <p className="text-sm text-[#8aada8] leading-relaxed">{stage.deliverable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ProcessPage() {
  const [activeStage, setActiveStage] = useState("01");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 500));
      }
      STAGES.forEach(s => {
        const el = document.getElementById(`stage-${s.n}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < 300 && rect.bottom > 300) setActiveStage(s.n);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_50%,black,transparent)]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,180,0.05),transparent_70%)] pointer-events-none animate-pulse" />

        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">How We Actually Work</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6.5vw,6rem)] font-black tracking-tight leading-[0.95] mb-8">
              Six stages.<br /><span className="text-[#00e5b4]">Zero surprises.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              Every engagement moves through the same six stages — not because we're rigid, but because skipping any one of them is exactly how AI projects fail in production.
            </p>
          </Reveal>

          {/* Quick nav */}
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-2 mt-10">
              {STAGES.map(s => (
                <a key={s.n} href={`#stage-${s.n}`}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200
                    ${activeStage === s.n
                      ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/05"
                      : "border-[#1e2b28] text-[#3a5550] hover:border-[#00e5b4]/40 hover:text-[#00e5b4]"}`}>
                  {s.n} · {s.title}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CINEMATIC VISUAL ──────────────────────────────────────────── */}
      <section className="px-8 pb-20">
        <div className="max-w-screen-xl mx-auto">
          <CinematicVideo
            src="/videos/process-page.mp4"
            poster="/videos/process-page-poster.jpg"
            label="Independent modules organizing into one coordinated system"
          />
        </div>
      </section>

      {/* ── STICKY PROGRESS NAV ─────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-40 bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28] overflow-x-auto px-8">
        <div className="max-w-screen-xl mx-auto flex items-center gap-0">
          {STAGES.map(s => (
            <a key={s.n} href={`#stage-${s.n}`}
              className={`shrink-0 text-xs font-semibold px-5 py-4 border-b-2 transition-all duration-200
                ${activeStage === s.n ? "border-[#00e5b4] text-[#00e5b4]" : "border-transparent text-[#3a5550] hover:text-[#8aada8]"}`}>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* ── STAGES ────────────────────────────────────────────────────── */}
      {STAGES.map((stage, i) => (
        <StageBlock key={stage.n} stage={stage} index={i} total={STAGES.length} />
      ))}

      {/* ── PRINCIPLES ────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Why We Don't Compress Any Stage</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black tracking-tight leading-none mb-16">
              Four rules that<br /><span className="text-[#3a5550]">never get negotiated.</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-px bg-[#1e2b28]">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="bg-[#0d0f0e] p-8 h-full group hover:bg-[#0a0c0b] transition-colors">
                  <div className="text-3xl text-[#00e5b4] mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">{p.icon}</div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-[#00e5b4] transition-colors duration-300">{p.title}</h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 text-center">
        <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Ready for Stage 01?</p></Reveal>
        <Reveal delay={100}>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-10">
            The audit is free.<br /><span className="text-[#00e5b4]">The clarity is priceless.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Start With the Audit →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
