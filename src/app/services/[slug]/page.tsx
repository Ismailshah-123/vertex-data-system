"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CinematicVideo from "@/components/media/CinematicVideo";
import { SERVICES, ORDER, type ServiceDetail } from "./data";

/* ─────────────────────────────────────────────────────────────────────────
   /services/[slug]
   
   Standalone page per service — matches DStarix's pattern where every
   service ("Voice AI", "AI Chatbots", etc.) has its own URL and full
   page, rather than living as a section on one long page.
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

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = SERVICES[slug];
  if (!service) notFound();
  const ac = service.color;

  const currentIdx = ORDER.indexOf(slug);
  const nextSlug = ORDER[(currentIdx + 1) % ORDER.length];
  const nextService = SERVICES[nextSlug];

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

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center pb-16 px-8 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ background: `${ac}08` }} />

        <div className="max-w-screen-xl mx-auto w-full grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div ref={heroRef}>
            <div className="flex items-center gap-2 text-xs text-[#3a5550] mb-8">
              <Link href="/" className="hover:text-[#00e5b4] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-[#00e5b4] transition-colors">Services</Link>
              <span>/</span>
              <span className="text-[#5a7570]">{service.title}</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs text-[#3a5550]">{service.number}</span>
              <span className="w-8 h-px" style={{ background: ac }} />
              <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: ac }}>{service.category}</span>
            </div>
            <h1 className="text-[clamp(2.4rem,5.5vw,5rem)] font-black tracking-tight leading-[1.0] mb-6 max-w-3xl">{service.title}</h1>
            <p className="text-lg font-medium max-w-2xl" style={{ color: ac }}>{service.headline}</p>
          </div>

          {/* Hero visual — real video once provided, themed CSS animation until then */}
          <div className="relative h-[260px] sm:h-[320px] lg:h-[400px]">
            {service.heroVideo && service.heroVideoPoster ? (
              <CinematicVideo
                src={service.heroVideo}
                poster={service.heroVideoPoster}
                label={`${service.title} in action`}
                className="h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-40 h-40 rounded-full border animate-pulse" style={{ borderColor: `${ac}33` }} />
                <div className="absolute w-56 h-56 rounded-full border" style={{ borderColor: `${ac}1a`, animation: "spin 20s linear infinite" }} />
                <div className="absolute w-72 h-72 rounded-full border border-dashed" style={{ borderColor: `${ac}14`, animation: "spin 35s linear infinite reverse" }} />
                <div className="absolute w-24 h-24 rounded-2xl" style={{ background: `radial-gradient(circle, ${ac}22, transparent 70%)`, animation: "logoPulse 3s ease-in-out infinite" }} />
                <span className="absolute font-mono text-[10px] tracking-widest uppercase" style={{ color: `${ac}66` }}>
                  {service.number}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1fr_360px] gap-16 items-start">

          <div>
            <Reveal><p className="text-[#8aada8] leading-relaxed mb-14 text-lg">{service.description}</p></Reveal>

            {/* Who We Help */}
            <Reveal delay={60}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-6">Who We Help</p>
              <div className="grid md:grid-cols-3 gap-4 mb-14">
                {service.whoWeHelp.map(w => (
                  <div key={w.title} className="border border-[#1e2b28] rounded-2xl p-5 hover:border-[#2a3d38] transition-colors">
                    <h3 className="text-sm font-bold text-white mb-2">{w.title}</h3>
                    <p className="text-xs text-[#5a7570] leading-relaxed">{w.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* What We Deliver */}
            <Reveal delay={100}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">What We Deliver</p>
              <ul className="space-y-3 mb-14">
                {service.whatWeDeliver.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#8aada8]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ac }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Tech Stack */}
            <Reveal delay={140}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2 mb-14">
                {service.stack.map(tech => (
                  <span key={tech} className="text-xs px-3 py-1 rounded-full border border-[#1e2b28] text-[#5a7570]
                    hover:border-[#00e5b4]/30 hover:text-[#00e5b4] transition-all duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 space-y-5">
            <div className="border border-[#1e2b28] rounded-2xl p-7">
              <div className="text-5xl font-black tracking-tight mb-2 tabular-nums" style={{ color: ac }}>{service.metric.value}</div>
              <p className="text-xs text-[#3a5550] tracking-widest uppercase">{service.metric.label}</p>
            </div>
            <div className="border border-[#1e2b28] rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute top-3 right-5 text-5xl font-serif text-[#1a2422] select-none pointer-events-none leading-none">"</div>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: ac }}>Client Result</p>
              <p className="text-sm text-[#8aada8] leading-relaxed italic">"{service.clientResult}"</p>
            </div>
            {service.relatedProject ? (
              <Link href={`/projects/${service.relatedProject.slug}`}
                className="block w-full text-center py-4 rounded-xl text-sm font-bold transition-all duration-300"
                style={{ background: `${ac}15`, border: `1px solid ${ac}30`, color: ac }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = ac; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${ac}15`; (e.currentTarget as HTMLElement).style.color = ac; }}>
                Order This Project →
              </Link>
            ) : (
              <Link href="/contact"
                className="block w-full text-center py-4 rounded-xl text-sm font-bold transition-all duration-300"
                style={{ background: `${ac}15`, border: `1px solid ${ac}30`, color: ac }}>
                Talk to Us About This →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── NEXT SERVICE ──────────────────────────────────────────────── */}
      <section className="py-16 px-8 border-t border-[#1e2b28] bg-[#0d0f0e]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-8">Next Service</p></Reveal>
          <Reveal delay={80}>
            <Link href={`/services/${nextSlug}`}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-y border-[#1e2b28] hover:border-[#2a3d38] transition-colors">
              <div>
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: nextService.color }}>{nextService.category}</span>
                <h3 className="text-2xl font-black tracking-tight leading-tight mt-2 group-hover:text-[#00e5b4] transition-colors duration-300">
                  {nextService.title}
                </h3>
              </div>
              <span className="text-3xl text-[#3a5550] group-hover:text-[#00e5b4] group-hover:translate-x-3 transition-all duration-300 shrink-0">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
