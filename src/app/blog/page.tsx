"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { POSTS } from "./posts";

const CATEGORIES = ["All", "Agentic AI", "LLM Engineering", "Data Architecture", "AI Security", "MLOps", "Computer Vision"];

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

function PostCard({ post, index, featured = false }: { post: typeof POSTS[0]; index: number; featured?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);

  if (featured) {
    return (
      <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Link href={`/blog/${post.slug}`}
          className={`block bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl overflow-hidden
            transition-all duration-500 ${hovered ? "-translate-y-1 border-[#2a3d38] shadow-[0_32px_80px_rgba(0,0,0,0.5)]" : ""}`}>
          {/* Featured header */}
          <div className="relative h-72 overflow-hidden"
            style={{ background: `linear-gradient(135deg, #001a14, #002e22)` }}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-50"}`}
              style={{ background: `radial-gradient(ellipse at 70% 40%, ${post.accentColor}12, transparent 60%)` }} />
            {/* Featured badge */}
            <div className="absolute top-5 left-5">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                style={{ background: `${post.accentColor}20`, border: `1px solid ${post.accentColor}40`, color: post.accentColor }}>
                Featured
              </span>
            </div>
            {/* Category */}
            <div className="absolute bottom-5 left-6">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">{post.category}</span>
              <div className="text-2xl font-black tracking-tight mt-1" style={{ color: post.accentColor }}>
                {post.readTime}
              </div>
            </div>
            {/* Decorative corner element */}
            <div className="absolute top-5 right-5 w-16 h-16">
              <div className="w-full h-full rounded-full border border-[#00e5b4]/10 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-[#00e5b4]/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full" style={{ background: `${post.accentColor}40` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h2 className={`text-2xl font-black tracking-tight leading-snug mb-4 transition-colors duration-300
              ${hovered ? "text-[#00e5b4]" : "text-white"}`}>
              {post.title}
            </h2>
            <p className="text-[#5a7570] text-sm leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: `${post.accentColor}15`, border: `1px solid ${post.accentColor}30`, color: post.accentColor }}>
                  {post.author.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{post.author.name}</div>
                  <div className="text-[10px] text-[#3a5550]">{post.date}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {post.tags.slice(0, 2).map(t => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-full border border-[#1e2b28] text-[#3a5550]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={`/blog/${post.slug}`}
        className={`block bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-6
          transition-all duration-400 ${hovered ? "-translate-y-1 border-[#2a3d38] shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : ""}`}>
        {/* Top bar */}
        <div className={`h-px w-full mb-6 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `linear-gradient(90deg, transparent, ${post.accentColor}, transparent)` }} />
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">{post.category}</span>
          <span className="text-[10px] text-[#2a3d38] shrink-0">{post.readTime}</span>
        </div>
        <h3 className={`font-bold text-base leading-snug mb-3 transition-colors duration-300
          ${hovered ? "text-[#00e5b4]" : "text-white"}`}>
          {post.title}
        </h3>
        <p className="text-xs text-[#5a7570] leading-relaxed mb-5">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-[#111]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ background: `${post.accentColor}15`, color: post.accentColor }}>
              {post.author.initials}
            </div>
            <span className="text-[10px] text-[#3a5550]">{post.author.name} · {post.date}</span>
          </div>
          <span className={`text-xs transition-all duration-300 ${hovered ? "text-[#00e5b4] translate-x-1" : "text-[#2a3d38]"}`}>→</span>
        </div>
      </Link>
    </div>
  );
}

export default function BlogPage() {
  const [filter, setFilter] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);
  const [chars, setChars] = useState("");
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 500));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const title = "Insights";
    let i = 0;
    const t = setInterval(() => { setChars(title.slice(0, ++i)); if (i >= title.length) clearInterval(t); }, 90);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured && (filter === "All" || p.category === filter));

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-8 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_20%_50%,black,transparent)]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,180,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00e5b4]" />
              <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Research & Thinking</span>
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(4rem,10vw,8rem)] font-black tracking-tight leading-[0.9] mb-8">
              {chars}
              <span className="inline-block w-1 bg-[#00e5b4] ml-2 animate-pulse" style={{ height: "0.85em", verticalAlign: "middle" }} />
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
              No thought leadership. No hot takes. Just hard-won experience from building AI systems in production, written by the team that built them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FEATURED POST */}
      <section className="px-8 pb-16">
        <div className="max-w-screen-xl mx-auto">
          <PostCard post={featured} index={0} featured />
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="px-8 pb-32">
        <div className="max-w-screen-xl mx-auto">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-12 pb-8 border-b border-[#1e2b28]">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-200
                  ${filter === c ? "border-[#00e5b4] text-[#00e5b4] bg-[#00e5b4]/05" : "border-[#1e2b28] text-[#3a5550] hover:border-[#2a3d38] hover:text-[#8aada8]"}`}>
                {c}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-8 border-t border-[#1e2b28] bg-[#0d0f0e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="max-w-xl mx-auto text-center relative">
          <Reveal>
            <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4">Stay Sharp</p>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
              New posts, when they're ready.<br />
              <span className="text-[#3a5550]">Not on a schedule.</span>
            </h2>
            <p className="text-[#5a7570] text-sm mb-8">Roughly once a month. No marketing. Unsubscribe anytime.</p>
            <div className="flex gap-3">
              <input type="email" placeholder="your@company.com"
                className="flex-1 bg-[#0a0c0b] border border-[#1e2b28] rounded-xl px-4 py-3.5 text-sm text-white
                  placeholder-[#2a3d38] focus:outline-none focus:border-[#00e5b4] transition-all duration-200" />
              <button className="bg-[#00e5b4] text-black font-bold px-6 py-3.5 rounded-xl text-sm
                hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.5)] transition-all duration-300 shrink-0">
                Subscribe →
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
