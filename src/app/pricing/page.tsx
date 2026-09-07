"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SpotlightCard from "@/components/ui/SpotlightCard";

const PLANS = [
  {
    tier: "Starter", price: "£12K", period: "/mo", minTerm: "3-month minimum",
    desc: "Targeted AI projects for teams beginning their transformation.",
    features: ["1 dedicated ML engineer", "2 active workstreams", "Weekly strategy sessions", "Data audit & AI roadmap", "Model deployment support", "Slack access, 9-5 GMT"],
    notIncluded: ["24/7 support", "Custom model training", "Dedicated PM"],
    featured: false,
  },
  {
    tier: "Scale", price: "£38K", period: "/mo", minTerm: "6-month minimum",
    desc: "Full-team engagement for enterprises building serious AI competitive moats.",
    features: ["5 specialist engineers", "Unlimited workstreams", "24/7 Slack + dedicated PM", "Custom model training", "MLOps & monitoring infra", "Quarterly board reports", "SLA guarantees (99.9%)"],
    notIncluded: ["Embedded on-site team"],
    featured: true,
  },
  {
    tier: "Enterprise", price: "Custom", period: "", minTerm: "12-month typical",
    desc: "Embedded team partnerships for organizations building proprietary AI at scale.",
    features: ["10–30 embedded engineers", "On-site & hybrid options", "IP ownership & transfer", "Custom security architecture", "C-suite advisory access", "Dedicated R&D allocation", "Custom SLA & compliance"],
    notIncluded: [],
    featured: false,
  },
];

const ADDONS = [
  { name: "AI Security Audit",           price: "£8,000",  desc: "Full red-team assessment of an existing LLM or ML deployment. 2-week turnaround." },
  { name: "Data Infrastructure Audit",   price: "£6,500",  desc: "Complete review of your data stack with a prioritised remediation roadmap." },
  { name: "Model Performance Review",    price: "£4,500",  desc: "Independent evaluation of an existing model's production performance and drift." },
  { name: "Team Training Workshop",      price: "£3,000",  desc: "2-day hands-on workshop for your team — RAG, MLOps, or agentic AI fundamentals." },
];

const COMPARISON = [
  { feature: "Dedicated engineers",      starter: "1",          scale: "5",            enterprise: "10-30"       },
  { feature: "Active workstreams",       starter: "2",          scale: "Unlimited",    enterprise: "Unlimited"   },
  { feature: "Response time",            starter: "24 hrs",     scale: "4 hrs",        enterprise: "1 hr"        },
  { feature: "Dedicated PM",             starter: "—",          scale: "✓",            enterprise: "✓"           },
  { feature: "On-site availability",     starter: "—",          scale: "Quarterly",    enterprise: "Full-time"   },
  { feature: "Custom model training",    starter: "—",          scale: "✓",            enterprise: "✓"           },
  { feature: "SLA guarantee",            starter: "—",          scale: "99.9%",        enterprise: "Custom"      },
  { feature: "IP transfer",              starter: "✓",          scale: "✓",            enterprise: "✓"           },
  { feature: "Board-level reporting",    starter: "—",          scale: "Quarterly",    enterprise: "Monthly"     },
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

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
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
      <section className="relative min-h-[60vh] flex flex-col justify-center px-8 pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black,transparent)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,180,0.05),transparent_70%)] pointer-events-none animate-pulse" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 justify-center mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Investment</span>
              <span className="w-8 h-px bg-[#00e5b4]" />
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black tracking-tight leading-[0.95] mb-6">
              Transparent pricing.<br /><span className="text-[#00e5b4]">Zero surprises.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl mx-auto leading-relaxed">
              No hidden fees, no scope creep billing. Every engagement starts with a free audit so you know exactly what you're paying for before you commit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PLANS */}
      <section className="px-8 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-[#1e2b28] rounded-2xl overflow-hidden">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.tier} delay={i * 100}>
                <SpotlightCard
                  spotlightColor={plan.featured ? "0,229,180" : "255,255,255"}
                  className={`relative p-10 h-full flex flex-col transition-all duration-300 group
                  ${plan.featured ? "bg-[#0d1a16] border-[#00e5b4]/20" : "bg-[#0d0f0e] hover:bg-[#0a0c0b]"}`}>
                  {plan.featured && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00e5b4] to-transparent" />}
                  {plan.featured && (
                    <span className="absolute top-6 right-6 text-[10px] font-bold tracking-widest uppercase bg-[#00e5b4]/10 border border-[#00e5b4]/30 text-[#00e5b4] px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="text-xs text-[#3a5550] tracking-widest uppercase mb-4">{plan.tier}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-[#3a5550]">{plan.period}</span>
                  </div>
                  <div className="text-xs text-[#2a3d38] mb-6">{plan.minTerm}</div>
                  <p className="text-sm text-[#5a7570] mb-8 leading-relaxed">{plan.desc}</p>
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-[#8aada8]">
                        <span className="text-[#00e5b4] font-bold shrink-0">✓</span>{f}
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-[#3a5550]">
                        <span className="font-bold shrink-0">—</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact"
                    className={`w-full text-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300
                      ${plan.featured
                        ? "bg-[#00e5b4] text-black hover:bg-white hover:shadow-[0_0_40px_rgba(0,229,180,0.4)]"
                        : "border border-[#2a3d38] text-white hover:border-[#00e5b4] hover:text-[#00e5b4]"}`}>
                    {plan.tier === "Enterprise" ? "Talk to Sales" : "Get Started"}
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="px-8 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><h2 className="text-2xl font-black tracking-tight mb-10">Compare plans in detail</h2></Reveal>
          <Reveal delay={100}>
            <div className="border border-[#1e2b28] rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#1e2b28] bg-[#0d0f0e]">
                    <th className="text-left p-4 text-[#3a5550] font-medium text-xs uppercase tracking-wider">Feature</th>
                    <th className="text-center p-4 text-[#5a7570] font-bold">Starter</th>
                    <th className="text-center p-4 text-[#00e5b4] font-bold">Scale</th>
                    <th className="text-center p-4 text-[#5a7570] font-bold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-[#0a0c0b]" : "bg-[#0d0f0e]"}>
                      <td className="p-4 text-[#8aada8]">{row.feature}</td>
                      <td className="p-4 text-center text-[#5a7570]">{row.starter}</td>
                      <td className="p-4 text-center text-[#00e5b4] font-semibold">{row.scale}</td>
                      <td className="p-4 text-center text-[#5a7570]">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="px-8 pb-24">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><h2 className="text-2xl font-black tracking-tight mb-2">Standalone engagements</h2></Reveal>
          <Reveal delay={80}><p className="text-[#5a7570] text-sm mb-10 max-w-lg">Not ready for a full retainer? These fixed-scope projects deliver value in weeks, not months.</p></Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {ADDONS.map((a, i) => (
              <Reveal key={a.name} delay={i * 60}>
                <div className="border border-[#1e2b28] rounded-2xl p-6 hover:border-[#2a3d38] transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-base group-hover:text-[#00e5b4] transition-colors">{a.name}</h3>
                    <span className="text-lg font-black text-[#00e5b4] shrink-0 ml-4">{a.price}</span>
                  </div>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 border-t border-[#1e2b28] bg-[#0d0f0e] text-center">
        <Reveal>
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Not sure which fits?</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tight leading-none mb-10">
            Start with a free 60-minute audit.
          </h2>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold px-10 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            Book Your Audit →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
