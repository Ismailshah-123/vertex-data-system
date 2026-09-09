"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES } from "../data";
import Magnetic from "@/components/ui/Magnetic";

/* ─────────────────────────────────────────────────────────────────────────
   /case-studies/[slug] — full detail view of one real, independent
   project. Portfolio-style, not the order-form pattern used by
   /projects/[slug] — these are things already built, not packages you
   can commission, so there's no pricing sidebar or request form here.
───────────────────────────────────────────────────────────────────────── */

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

export default function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const caseStudy = CASE_STUDIES.find((cs) => cs.id === slug);
  if (!caseStudy) notFound();
  const ac = caseStudy.color;

  const others = CASE_STUDIES.filter((cs) => cs.id !== slug);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ background: `${ac}08` }} />

        <div className="max-w-screen-xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#3a5550] mb-8">
            <Link href="/" className="hover:text-[#00e5b4] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-[#00e5b4] transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-[#5a7570]">{caseStudy.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full border" style={{ color: ac, borderColor: `${ac}44` }}>
              {caseStudy.status}
            </span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">{caseStudy.category}</span>
          </div>

          <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight leading-[1.0] mb-4 max-w-3xl">{caseStudy.title}</h1>
          <p className="text-lg font-medium max-w-2xl" style={{ color: ac }}>{caseStudy.outcome}</p>
        </div>
      </section>

      {/* ── DETAIL ────────────────────────────────────────────────────── */}
      <section className="py-8 px-8">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16">
          <Reveal>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">The problem</p>
            <p className="text-[#8aada8] leading-relaxed text-lg">{caseStudy.problem}</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">The approach</p>
            <p className="text-[#8aada8] leading-relaxed text-lg">{caseStudy.approach}</p>
          </Reveal>
        </div>

        <div className="max-w-screen-xl mx-auto mt-16">
          <Reveal delay={120}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">Key features</p>
            <div className="flex flex-wrap gap-2 mb-16">
              {caseStudy.features.map((f) => (
                <span key={f} className="text-sm px-4 py-2 rounded-full bg-[#0d0f0e] border border-[#1e2b28] text-[#8aada8]">{f}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="border border-[#1e2b28] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-2">What this demonstrates</p>
                <p className="text-base" style={{ color: ac }}>{caseStudy.outcome}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {caseStudy.stack.map((s) => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full border border-[#1e2b28] text-[#5a7570]">{s}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-8 text-center border-t border-[#1e2b28] mt-8">
        <Reveal>
          <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-black tracking-tight leading-none mb-8">
            Want something built like this,<br />for your actual problem?
          </h2>
          <Magnetic>
            <Link href="/#contact"
              className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
                hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
              Book a discovery call →
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* ── MORE CASE STUDIES ─────────────────────────────────────────── */}
      <section className="pb-24 px-8">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-6">More case studies</p>
          <div className="grid md:grid-cols-3 gap-5">
            {others.map((cs) => (
              <Link key={cs.id} href={`/case-studies/${cs.id}`}
                className="block border border-[#1e2b28] hover:border-[#2a3d38] rounded-2xl p-6 transition-colors duration-300">
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: cs.color }}>{cs.category}</span>
                <h3 className="text-lg font-bold tracking-tight mt-2">{cs.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
