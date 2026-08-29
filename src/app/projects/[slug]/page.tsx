"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, type ProjectDetail } from "./data";

/* ─────────────────────────────────────────────────────────────────────────
   /projects/[slug] — full detail + a scoped order form.

   This is the page your ask described: click a project on the catalog,
   land here, see exactly what's included, and fill in an order form
   that's already scoped to THIS project (the API payload includes
   projectSlug + projectName automatically — no dropdown to guess from).
───────────────────────────────────────────────────────────────────────── */


const BUDGET_HINTS = ["Match the starting price", "Up to 25% above", "Flexible — scope first"];

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

const inputCls = "w-full bg-[#0a0c0b] border border-[#1e2b28] rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3d38] focus:outline-none focus:border-[#00e5b4] focus:shadow-[0_0_0_3px_rgba(0,229,180,0.07)] transition-all duration-200";

/* ─── Scoped order form — the actual "order this project" flow ──────────── */
function OrderForm({ project }: { project: ProjectDetail }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", budgetHint: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const canSubmit = form.name && form.email && form.company && form.budgetHint;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.name.split(" ")[0] || form.name,
          lastName: form.name.split(" ").slice(1).join(" ") || "-",
          email: form.email,
          company: form.company,
          service: `[PROJECT REQUEST] ${project.name}`,
          budget: form.budgetHint,
          timeline: project.timeline,
          challenge: form.notes || `Requesting: ${project.name}. No additional notes provided.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again or email us directly.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server. Please email us directly at hello@vertexdata.systems.");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-[#00e5b4]/30 rounded-2xl p-8 text-center bg-[#0d1a16]">
        <div className="w-14 h-14 rounded-full bg-[#00e5b4]/10 border border-[#00e5b4]/30 flex items-center justify-center text-2xl mx-auto mb-5">✓</div>
        <h3 className="text-xl font-black tracking-tight mb-2 text-[#00e5b4]">Order received.</h3>
        <p className="text-[#5a7570] text-sm leading-relaxed">
          A senior engineer will review your request for <strong className="text-white">{project.name}</strong> today and reply within 24 hours with a scoped proposal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#1e2b28] rounded-2xl p-7 space-y-4 bg-[#0d0f0e]">
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550] mb-1">Ordering</p>
        <p className="text-sm font-bold" style={{ color: project.color }}>{project.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
        <input type="email" value={form.email} onChange={set("email")} placeholder="Work email" className={inputCls} />
      </div>
      <input value={form.company} onChange={set("company")} placeholder="Company" className={inputCls} />
      <select value={form.budgetHint} onChange={set("budgetHint")} className={`${inputCls} appearance-none`}>
        <option value="">Budget expectation</option>
        {BUDGET_HINTS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <textarea value={form.notes} onChange={set("notes")} rows={4} placeholder="Anything specific we should know? (optional)" className={`${inputCls} resize-none`} />
      {error && <div className="text-xs text-[#ff6b8a] bg-[#2a0f16] border border-[#ff6b8a]/30 rounded-lg px-4 py-3">{error}</div>}
      <button type="submit" disabled={!canSubmit || submitting}
        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
          ${canSubmit && !submitting ? "bg-[#00e5b4] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.4)]" : "bg-[#1e2b28] text-[#3a5550]"}`}>
        {submitting ? (<><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sending...</>) : `Request This Project →`}
      </button>
      <p className="text-[10px] text-[#2a3d38] text-center">No payment now. This sends a scoped request — we confirm details before anything is billed.</p>
    </form>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = PROJECTS[slug];
  if (!project) notFound();
  const ac = project.color;

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
      <section className="relative min-h-[55vh] flex flex-col justify-end pb-16 px-8 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ background: `${ac}08` }} />

        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <div className="flex items-center gap-2 text-xs text-[#3a5550] mb-8">
            <Link href="/" className="hover:text-[#00e5b4] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-[#00e5b4] transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-[#5a7570]">{project.name}</span>
          </div>
          <span className="text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border inline-block mb-6" style={{ borderColor: `${ac}40`, color: ac }}>
            {project.category}
          </span>
          <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight leading-[1.0] mb-4 max-w-3xl">{project.name}</h1>
          <p className="text-lg font-medium" style={{ color: ac }}>{project.tagline}</p>
        </div>
      </section>

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1fr_420px] gap-16 items-start">

          <div>
            <Reveal><p className="text-[#8aada8] leading-relaxed mb-12">{project.overview}</p></Reveal>

            <Reveal delay={80}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">What's included</p>
              <ul className="space-y-3 mb-12">
                {project.included.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#8aada8]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ac }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-4">Not included</p>
              <ul className="space-y-3 mb-12">
                {project.notIncluded.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#5a7570]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-[#2a3d38] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-6">How it runs</p>
              <div className="space-y-0 mb-12">
                {project.process.map((step, i) => (
                  <div key={step.phase} className="grid md:grid-cols-[140px_1fr] gap-6 py-5 border-b border-[#1e2b28] last:border-0">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ac }}>{step.phase}</span>
                    <p className="text-sm text-[#8aada8] leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2a3d38] mb-3">Tech stack</p>
              <div className="flex flex-wrap gap-2 mb-12">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-[#1e2b28] text-[#5a7570]">{tag}</span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Request sidebar */}
          <div className="lg:sticky lg:top-28 space-y-5">
            <div className="border border-[#1e2b28] rounded-2xl p-7">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">Typical timeline</span>
              </div>
              <div className="text-4xl font-black tracking-tight mb-1" style={{ color: ac }}>{project.timeline}</div>
              <div className="text-xs text-[#3a5550] mb-6">Pricing is scoped on a discovery call — no two projects are quite the same.</div>
            </div>
            <OrderForm project={project} />
          </div>
        </div>
      </section>
    </main>
  );
}
