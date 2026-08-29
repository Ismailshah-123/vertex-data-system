"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const INDUSTRIES = [
  {
    id: "financial-services", name: "Financial Services",
    desc: "Risk scoring, fraud detection, and advisory copilots built to satisfy the regulator, not just the demo.",
    helps: ["Real-time fraud detection", "Regulatory reporting automation", "Client advisory copilots", "Risk model governance"],
    color: "#00e5b4",
  },
  {
    id: "healthcare", name: "Healthcare & Life Sciences",
    desc: "Clinical documentation and research acceleration, built HIPAA-aligned from the first line of code.",
    helps: ["Clinical documentation NLP", "Research acceleration", "Appointment & intake handling", "HIPAA-aligned architecture"],
    color: "#00b48a",
  },
  {
    id: "manufacturing", name: "Manufacturing",
    desc: "Vision-based quality inspection and predictive maintenance that catches failure before the line stops.",
    helps: ["Computer vision QA", "Predictive maintenance", "Supplier knowledge search", "Quality report drafting"],
    color: "#00c49a",
  },
  {
    id: "retail-ecommerce", name: "Retail & E-commerce",
    desc: "Inventory forecasting, personalisation engines, and merchandising intelligence that moves before the season does.",
    helps: ["Demand forecasting", "Personalization engines", "Catalogue & content generation", "Order & returns assistants"],
    color: "#00d19e",
  },
  {
    id: "legal-compliance", name: "Legal & Compliance",
    desc: "Contract intelligence and policy research grounded in your own matter set, with citations you can actually verify.",
    helps: ["Contract review support", "Policy & compliance Q&A", "Clause extraction", "Due-diligence document drafting"],
    color: "#9b5de5",
  },
  {
    id: "logistics", name: "Logistics & Supply Chain",
    desc: "Routing optimisation, demand forecasting, and exception handling that operates in real time, not batch.",
    helps: ["Shipping document automation", "Real-time exception handling", "Invoice reconciliation", "Status query assistants"],
    color: "#00a07a",
  },
  {
    id: "saas-tech", name: "Technology & SaaS",
    desc: "Ship AI features fast on platforms built for scale — from your first agent to your millionth API call.",
    helps: ["Embedded in-product AI", "Documentation search", "Support deflection", "Internal tooling agents"],
    color: "#008a68",
  },
  {
    id: "education", name: "Education & Training",
    desc: "Course content assistance and admissions support that scales with enrollment, not headcount.",
    helps: ["Course content assistants", "Learner Q&A support", "Admissions document processing", "Assessment staffing support"],
    color: "#00e5c4",
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

/* ─── Industry card ──────────────────────────────────────────────────────── */
function IndustryCard({ ind, index }: { ind: typeof INDUSTRIES[0]; index: number }) {
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
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={`group bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-8 h-full transition-all duration-400
        ${hovered ? "-translate-y-1 border-[#2a3d38] shadow-[0_24px_70px_rgba(0,0,0,0.4)]" : ""}`}>
        <div className={`h-px w-full mb-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `linear-gradient(90deg, transparent, ${ind.color}, transparent)` }} />
        <h3 className={`text-xl font-black tracking-tight mb-3 transition-colors duration-300 ${hovered ? "text-[#00e5b4]" : "text-white"}`}>
          {ind.name}
        </h3>
        <p className="text-sm text-[#5a7570] leading-relaxed mb-6">{ind.desc}</p>
        <p className="text-[9px] tracking-[0.18em] uppercase text-[#3a5550] mb-3">Where We Help</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {ind.helps.map(h => (
            <div key={h} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ind.color }} />
              <span className="text-xs text-[#8aada8] leading-snug">{h}</span>
            </div>
          ))}
        </div>
        <Link href={`/services`} className="inline-flex items-center gap-1.5 text-xs font-semibold mt-6 transition-all duration-200 group/link"
          style={{ color: ind.color }}>
          Explore {ind.name} <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ClientsPage() {
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

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_65%_70%_at_30%_50%,black,transparent)]" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Who We Build For</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6.5vw,6rem)] font-black tracking-tight leading-[0.95] mb-8">
              Built for the sectors<br /><span className="text-[#00e5b4]">with the most at stake.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              We're early-stage, so this page won't show you client logos or growth charts — it'll show you exactly where our domain expertise applies, so you can judge the fit for yourself.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── GLOBAL DELIVERY ───────────────────────────────────────────── */}
      <section className="py-28 px-8 border-b border-[#1e2b28] relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">How We Work</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black tracking-tight leading-none mb-6">
              Remote-first.<br /><span className="text-[#3a5550]">One standard of delivery.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] text-sm leading-relaxed">
              No office to visit yet — what you get instead is direct access to whoever's actually building your system, wherever you're based. Same evaluation rigor and weekly cadence regardless of timezone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── INDUSTRIES ────────────────────────────────────────────────── */}
      <section className="py-28 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Industries We Serve</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black tracking-tight leading-none mb-4">
              Deep expertise where<br /><span className="text-[#3a5550]">it matters most.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] text-sm max-w-lg mb-16 leading-relaxed">
              We bring domain context and compliance know-how to the sectors with the most to gain from AI — not a generic playbook stretched across everyone.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {INDUSTRIES.map((ind, i) => <IndustryCard key={ind.id} ind={ind} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-8 text-center">
        <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Not a sales call</p></Reveal>
        <Reveal delay={100}>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-6">
            Talk to an engineer,<br /><span className="text-[#00e5b4]">not a salesperson.</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-[#5a7570] max-w-md mx-auto mb-10">The person on the call will be the person who scopes your project — not someone reading from a script.</p>
        </Reveal>
        <Reveal delay={200}>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Book a Discovery Call →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
