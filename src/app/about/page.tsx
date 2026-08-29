"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  linkedin: string;
  twitter: string;
  color: string;
  accentColor: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const TEAM: TeamMember[] = [
  {
    initials: "IS",
    name: "Ismail Shah",
    role: "Founder",
    bio: "Builds production AI systems end to end — a multi-tenant voice AI platform with real Stripe billing and a 35-test suite behind it, a 9-agent job-search automation system, an AI interview platform running live voice conversations over WebRTC. BS in Artificial Intelligence. Currently building VertexData alongside hands-on SAP Business One implementation work.",
    skills: ["Multi-Agent Systems", "RAG", "Voice AI", "FastAPI & PostgreSQL"],
    linkedin: "https://linkedin.com/in/ismailshah-57b425327", twitter: "#",
    color: "from-[#001a14] to-[#003326]",
    accentColor: "#00e5b4",
  },
];

const THESIS = [
  {
    tag: "The gap",
    title: "Most AI vendors oversell or undersell",
    body: "Big agencies promise the moon and hand execution off to a junior team you never talk to. Freelancers disappear after the demo. There's real room for someone who ships production systems and sticks around to keep them running.",
  },
  {
    tag: "The timing",
    title: "Model quality isn't the hard part anymore",
    body: "Foundation models are good enough for most real business use cases today. The actual gap is evaluation, deployment, and making a system reliable enough that a business can trust it with real decisions.",
  },
  {
    tag: "The commitment",
    title: "Early clients get outsized attention",
    body: "Starting now means direct access to whoever's actually building your system, and a genuine stake in getting your specific problem right — not one client among hundreds.",
  },
];

const VALUES = [
  {
    icon: "◎",
    title: "Outcomes over outputs",
    body: "We measure success in revenue impact, cost saved, and decisions improved — not model accuracy scores or lines of code shipped.",
  },
  {
    icon: "⬡",
    title: "Deep before broad",
    body: "We go impossibly deep on fewer problems rather than skimming the surface of many. Mastery compounds; breadth doesn't.",
  },
  {
    icon: "↗",
    title: "Build to transfer",
    body: "Every system we build is designed to be owned, understood, and improved by your team. We create internal capability, not dependency.",
  },
  {
    icon: "◈",
    title: "Radical transparency",
    body: "Weekly written updates with real numbers, honest blockers, and frank risk assessments. No decks that paper over problems.",
  },
];

/* ─── Reveal helper ──────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = {
    up:    "opacity-0 translate-y-10",
    left:  "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
    none:  "opacity-0",
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0 translate-y-0" : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Avatar card ────────────────────────────────────────────────────────── */
function AvatarCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative group bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl overflow-hidden
        transition-all duration-500
        ${hovered ? "border-[#00e5b4]/40 shadow-[0_24px_80px_rgba(0,229,180,0.1)] -translate-y-2" : ""}`}>

        {/* Top accent beam */}
        <div className={`absolute top-0 left-0 right-0 h-px transition-all duration-500
          ${hovered ? "bg-gradient-to-r from-transparent via-[#00e5b4] to-transparent opacity-100" : "opacity-0"}`} />

        {/* Avatar area */}
        <div className={`relative h-52 bg-gradient-to-br ${member.color} flex items-center justify-center overflow-hidden`}>
          {/* Animated grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Orbiting ring */}
          <div className={`absolute w-36 h-36 rounded-full border border-[${member.accentColor}]/20
            transition-all duration-700 ${hovered ? "scale-110 opacity-100" : "scale-95 opacity-40"}`}
            style={{ borderColor: `${member.accentColor}30` }} />
          <div className={`absolute w-28 h-28 rounded-full border border-dashed
            transition-all duration-1000 ${hovered ? "rotate-90 opacity-60" : "opacity-20"}`}
            style={{ borderColor: `${member.accentColor}50`, transitionTimingFunction: "linear" }} />

          {/* Initials */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center
              text-2xl font-black transition-all duration-500
              ${hovered ? "scale-110" : "scale-100"}`}
              style={{
                background: `linear-gradient(135deg, ${member.accentColor}15, ${member.accentColor}30)`,
                border: `1.5px solid ${member.accentColor}40`,
                color: member.accentColor,
                boxShadow: hovered ? `0 0 40px ${member.accentColor}30` : "none",
              }}>
              {member.initials}
            </div>
          </div>

          {/* Scan line effect */}
          {hovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00e5b4]/30 to-transparent"
                style={{ animation: "scanDown 1.5s ease-in-out infinite" }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className={`font-bold text-base text-white mb-0.5 transition-colors duration-300 ${hovered ? "text-[#00e5b4]" : ""}`}>
            {member.name}
          </h3>
          <p className="text-xs text-[#3a5550] mb-3 font-medium tracking-wide">{member.role}</p>

          {/* Bio — reveals on hover */}
          <div className={`overflow-hidden transition-all duration-500 ${hovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="text-xs text-[#5a7570] leading-relaxed mb-4">{member.bio}</p>
          </div>

          {/* Skill chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {member.skills.map(s => (
              <span key={s}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[#1e2b28] text-[#3a5550]
                  transition-all duration-200 hover:border-[#00e5b4]/40 hover:text-[#00e5b4]">
                {s}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 pt-3 border-t border-[#1e2b28]">
            <a href={member.linkedin}
              className="flex items-center gap-1.5 text-[10px] text-[#3a5550]
                hover:text-[#00e5b4] transition-colors tracking-wide">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <span className="text-[#1e2b28]">·</span>
            <a href={member.twitter}
              className="flex items-center gap-1.5 text-[10px] text-[#3a5550]
                hover:text-[#00e5b4] transition-colors tracking-wide">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        heroRef.current.style.opacity   = String(Math.max(0, 1 - window.scrollY / 600));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">
      <style>{`
        @keyframes scanDown {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center
        text-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
          bg-[radial-gradient(circle,rgba(0,229,180,0.05)_0%,transparent_70%)] pointer-events-none animate-pulse" />

        <div ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase font-semibold">Our Story</span>
              <span className="w-8 h-px bg-[#00e5b4]" />
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black tracking-tight leading-[0.95] mb-8">
              Obsessive about<br />
              <span className="text-[#00e5b4]">what data can do.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-2xl mx-auto leading-relaxed">
              Founded in 2026 on a simple belief: AI belongs in production, not papers. We're early — which means every engagement gets direct, hands-on attention instead of being routed through a bench of account managers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── MISSION STATEMENT ──────────────────────────────────────────── */}
      <section className="border-y border-[#1e2b28] bg-[#0d0f0e] py-24 px-8">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-tight leading-snug">
              "Most AI projects fail not because the models aren't good enough. They fail because the data is wrong,{" "}
              <span className="text-[#00e5b4]">the problem is mis-specified, or no one owns the outcome.</span>{" "}
              We fix all three."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001a14] to-[#003326]
                border border-[#00e5b4]/30 flex items-center justify-center text-xs font-black text-[#00e5b4]">
                IS
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ismail Shah</p>
                <p className="text-xs text-[#3a5550]">Founder</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="space-y-6">
              {[
                { n: "1:1",  label: "Direct access to whoever builds your system" },
                { n: "100%", label: "Source code and documentation, yours to keep" },
                { n: "2026", label: "Founded — early enough that you shape the roadmap" },
                { n: "0",    label: "Account managers between you and the actual work" },
              ].map(stat => (
                <div key={stat.n} className="flex items-baseline gap-4 border-b border-[#1e2b28] pb-5 last:border-0 last:pb-0">
                  <span className="text-3xl font-black text-[#00e5b4] tracking-tight tabular-nums w-24 shrink-0">{stat.n}</span>
                  <span className="text-sm text-[#5a7570]">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">How We Think</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-20">
              Principles, not<br /><span className="text-[#3a5550]">platitudes.</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-px bg-[#1e2b28]">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="bg-[#0a0c0b] p-10 group hover:bg-[#0d0f0e] transition-colors">
                  <div className="text-3xl text-[#00e5b4] mb-6 group-hover:scale-110 transition-transform duration-300 w-fit">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-[#00e5b4] transition-colors duration-300">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────── */}
      <section id="team" className="py-28 px-8 bg-[#0d0f0e]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">The People</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-4">
              Small by design — for now.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#5a7570] text-lg max-w-2xl mb-16 leading-relaxed">
              Right now, that means one founder, hands-on with every single engagement. No bench of juniors, no account managers between you and the work — just direct execution.
            </p>
          </Reveal>

          <div className="max-w-sm mx-auto">
            {TEAM.map((member, i) => (
              <AvatarCard key={member.name} member={member} index={i} />
            ))}
          </div>

          {/* Hiring CTA */}
          <Reveal delay={200}>
            <div className="mt-16 border border-dashed border-[#2a3d38] rounded-2xl p-10 text-center
              hover:border-[#00e5b4]/30 transition-colors duration-500 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">+</div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#00e5b4] transition-colors">You, maybe?</h3>
              <p className="text-sm text-[#3a5550] mb-6 max-w-sm mx-auto">
                We hire obsessives who care more about the problem than the title. Always open to exceptional ML engineers, data scientists, and AI researchers.
              </p>
              <Link href="/careers"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00e5b4]
                  border border-[#00e5b4]/30 px-6 py-2.5 rounded-lg hover:bg-[#00e5b4] hover:text-black
                  transition-all duration-300">
                See Open Roles →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY NOW ─────────────────────────────────────────────────────── */}
      <section className="py-28 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal><p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Why We Exist</p></Reveal>
          <Reveal delay={80}>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-none mb-20">
              Why this,<br /><span className="text-[#3a5550]">why now.</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-[#1e2b28]">
            {THESIS.map((item, i) => (
              <Reveal key={item.tag} delay={i * 80}>
                <div className="bg-[#0a0c0b] p-8 h-full group hover:bg-[#0d0f0e] transition-colors">
                  <p className="text-[#00e5b4] text-xs tracking-[0.15em] uppercase font-semibold mb-4">{item.tag}</p>
                  <h3 className="font-bold text-lg text-white mb-3 group-hover:text-[#00e5b4] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5a7570] leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 px-8 bg-[#0d0f0e] border-t border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto text-center">
          <Reveal>
            <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-6">Work With Us</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black tracking-tight leading-none mb-8">
              Let's build something<br />
              <span className="text-[#00e5b4]">that actually matters.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/#contact"
                className="bg-[#00e5b4] text-black font-bold px-8 py-4 rounded-xl text-base
                  hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
                Start a Conversation →
              </Link>
              <Link href="/projects"
                className="border border-[#2a3d38] text-white font-semibold px-8 py-4 rounded-xl text-base
                  hover:border-[#00e5b4] hover:text-[#00e5b4] transition-all duration-300">
                See Our Work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
