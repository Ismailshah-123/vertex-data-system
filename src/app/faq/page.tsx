"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FAQ_GROUPS = [
  {
    category: "Getting Started",
    items: [
      { q: "How does the engagement process actually work?", a: "It starts with a free discovery call — no pitch deck, no sales script. We review what you're trying to solve and give you an honest assessment of whether AI is actually the right tool for it. If it is, you get a written proposal with scope, timeline, and pricing scoped to that specific project." },
      { q: "What's the minimum project size you take on?", a: "We don't have a hard minimum yet — we're early-stage, and a well-scoped smaller project is often the right way to start working together before committing to something bigger. Tell us what you need on a call and we'll be straight with you about whether it's a good fit." },
      { q: "Do you work with startups or only enterprises?", a: "We're a startup ourselves — founder-led, early-stage. That means we're genuinely well-suited to other startups and small teams who want direct access to whoever's building their system, not a bench of account managers. We can take on larger scope too; we'll tell you honestly if something's outside what we can currently deliver." },
      { q: "How quickly can you start?", a: "Usually within 1-2 weeks of an agreed scope, since it's a small, focused team without a long queue of competing engagements." },
    ],
  },
  {
    category: "Technical & Delivery",
    items: [
      { q: "Do you build with our existing tech stack or bring your own?", a: "We work with your existing stack wherever sensible — we're stack-agnostic by design. If your team runs Snowflake, we build in Snowflake. If you're on AWS, we don't force GCP. We only recommend a stack change when there's a genuine capability gap." },
      { q: "Who owns the code and models you build?", a: "You do — entirely. Every system we build transfers full IP ownership to you at project completion, source code included. We also provide documentation so your team can maintain and extend it without ongoing dependency on us." },
      { q: "What happens after the project ends? Do you provide support?", a: "Optional ongoing support is available if you want it — monitoring, retraining, incremental improvements — priced separately and never mandatory. Plenty of clients take full ownership at handover and never look back." },
      { q: "How do you handle data security and compliance?", a: "We're happy to work within your VPC/private cloud with no data leaving your infrastructure, and we sign NDAs before any project starts. For regulated industries we'll have an honest conversation about what we can support today versus what needs a formal compliance partner alongside us — we won't claim certifications we don't have." },
      { q: "Can you work with our in-house data/ML team rather than replacing them?", a: "Yes — this is actually the model we prefer. Working alongside your existing team, transferring knowledge as we go, so your team's capability grows instead of creating a dependency on outside contractors." },
    ],
  },
  {
    category: "Pricing & Contracts",
    items: [
      { q: "Is pricing fixed-scope or time and materials?", a: "Both, depending on the project. Well-defined builds (a specific model, a specific pipeline) are usually fixed-price. Exploratory or evolving engagements are billed monthly. We'll recommend the right structure once we understand the actual scope." },
      { q: "Why isn't pricing listed on the website?", a: "Because a number without context is either misleadingly low or scares off a project that would've been worth it. We'd rather understand what you actually need on a call and give you a real number, not a generic tier that doesn't match your situation." },
      { q: "Can we cancel or pause an engagement?", a: "Yes. Fixed-scope projects are billed in milestones, so you're never locked into paying for undelivered work. Terms for ongoing engagements are agreed upfront before anything starts." },
      { q: "Do you offer equity or revenue-share arrangements?", a: "We're open to discussing it for the right strategic fit — bring it up on the call." },
    ],
  },
  {
    category: "Results & Evidence",
    items: [
      { q: "Do you have client references we can talk to?", a: "Not yet, honestly — we're a new company without paying clients so far. What we can show you is real independent engineering work: production-style systems we've actually built, with their actual status clearly labeled. See our case studies page." },
      { q: "What if the project doesn't deliver the agreed results?", a: "Every fixed-scope engagement will have acceptance criteria agreed upfront, before any work starts. If we don't hit them, we keep working until we do, or you don't pay the final milestone. That's the commitment, in writing, on every project we take on." },
      { q: "How do you measure success?", a: "We define success metrics with you before any code is written — tied to what actually matters to your business (time saved, leads booked, errors caught) rather than a technical metric that sounds impressive but doesn't move anything for you." },
    ],
  },
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

function FAQItem({ q, a, accentColor }: { q: string; a: string; accentColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1e2b28] last:border-0">
      <button onClick={() => setOpen(v => !v)}
        className="w-full text-left py-6 flex items-start justify-between gap-6 group">
        <span className={`text-base font-semibold transition-colors duration-300 ${open ? "text-[#00e5b4]" : "text-white group-hover:text-[#8aada8]"}`}>
          {q}
        </span>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300
          ${open ? "border-[#00e5b4] text-[#00e5b4] rotate-45" : "border-[#2a3d38] text-[#3a5550]"}`}>
          <span className="text-base leading-none">+</span>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ${open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"}`}>
        <p className="text-sm text-[#5a7570] leading-relaxed max-w-2xl">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
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
      {/* HERO */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Questions & Answers</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black tracking-tight leading-[0.95] mb-6">
              Straight answers.<br /><span className="text-[#00e5b4]">No sales spin.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              Everything prospective clients ask before signing — answered honestly, including the parts that don't flatter us, like the fact that we're new.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className="px-8 pb-32">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-[220px_1fr] gap-16">
          {/* Sticky category nav */}
          <div className="hidden md:block">
            <div className="sticky top-28 space-y-1">
              {FAQ_GROUPS.map(g => (
                <a key={g.category} href={`#${g.category.replace(/\s/g, "-")}`}
                  className="block text-sm py-2.5 px-3 rounded-lg text-[#5a7570] hover:text-[#00e5b4] hover:bg-[#0d0f0e] transition-all duration-200">
                  {g.category}
                </a>
              ))}
              <div className="mt-8 pt-8 border-t border-[#1e2b28]">
                <p className="text-xs text-[#3a5550] mb-4">Still have questions?</p>
                <Link href="/contact" className="text-sm font-semibold text-[#00e5b4] hover:underline">
                  Talk to us directly →
                </Link>
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="space-y-16">
            {FAQ_GROUPS.map((group, gi) => (
              <div key={group.category} id={group.category.replace(/\s/g, "-")}>
                <Reveal>
                  <h2 className="text-2xl font-black tracking-tight mb-2">{group.category}</h2>
                  <div className="w-12 h-0.5 bg-[#00e5b4] mb-8" />
                </Reveal>
                <div>
                  {group.items.map((item, i) => (
                    <Reveal key={item.q} delay={i * 40}>
                      <FAQItem q={item.q} a={item.a} accentColor="#00e5b4" />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 border-t border-[#1e2b28] bg-[#0d0f0e] text-center">
        <Reveal>
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Didn't find your answer?</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-10">
            Ask us directly.
          </h2>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Get in Touch →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
