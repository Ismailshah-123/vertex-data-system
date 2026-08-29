"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitch, setGlitch] = useState(false);
  const [chars, setChars]   = useState("404");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let gi: ReturnType<typeof setInterval> | undefined;
    let si: ReturnType<typeof setInterval> | undefined;

    if (!prefersReducedMotion) {
      // Glitch loop
      gi = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 300);
      }, 3000);

      // Scramble "404" occasionally
      const letters = "0123456789ABCDEF!@#$%";
      si = setInterval(() => {
        let i = 0;
        const t = setInterval(() => {
          setChars(Array.from("404").map((c, j) => j <= i ? c : letters[Math.floor(Math.random()*letters.length)]).join(""));
          i++;
          if (i >= 3) { clearInterval(t); setChars("404"); }
        }, 60);
      }, 5000);
    }

    // Particle canvas — skipped entirely under reduced motion
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return () => { if (gi) clearInterval(gi); if (si) clearInterval(si); };
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => { if (gi) clearInterval(gi); if (si) clearInterval(si); };

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas!.width = window.innerWidth; H = canvas!.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Fragmented particles that drift apart
    type P = { x:number;y:number;vx:number;vy:number;alpha:number;size:number;color:string };
    const particles: P[] = [];
    const colors = ["rgba(0,229,180,", "rgba(240,245,243,", "rgba(0,180,138,"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: W/2 + (Math.random()-0.5)*400,
        y: H/2 + (Math.random()-0.5)*300,
        vx: (Math.random()-0.5)*0.8,
        vy: (Math.random()-0.5)*0.8,
        alpha: Math.random()*0.4+0.1,
        size: Math.random()*2+0.5,
        color: colors[Math.floor(Math.random()*colors.length)],
      });
    }

    let raf = 0;
    const draw = () => {
      ctx!.fillStyle = "rgba(10,12,11,0.15)";
      ctx!.fillRect(0,0,W,H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>W) p.vx*=-1;
        if (p.y<0||p.y>H) p.vy*=-1;
        ctx!.beginPath();
        ctx!.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx!.fillStyle = p.color + p.alpha + ")";
        ctx!.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (gi) clearInterval(gi); if (si) clearInterval(si);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="bg-[#0a0c0b] min-h-screen flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      <style>{`
        @keyframes rgbSplit {
          0%  { text-shadow: -6px 0 #00e5b4, 6px 0 #f0f5f3; clip-path: polygon(0 20%,100% 20%,100% 35%,0 35%); transform: translate(-4px,0); }
          25% { text-shadow: 6px 0 #00e5b4, -6px 0 #f0f5f3; clip-path: polygon(0 65%,100% 65%,100% 75%,0 75%); transform: translate(4px,0); }
          50% { text-shadow: -3px 0 #00e5b4, 3px 0 #f0f5f3; clip-path: polygon(0 45%,100% 45%,100% 55%,0 55%); transform: translate(-2px,0); }
          75% { text-shadow: 3px 0 #00e5b4, -3px 0 #f0f5f3; clip-path: polygon(0 80%,100% 80%,100% 90%,0 90%); transform: translate(2px,0); }
          100%{ text-shadow: 0 0 40px rgba(0,229,180,0.6); clip-path: none; transform: translate(0,0); }
        }
        .glitch-active { animation: rgbSplit 0.3s steps(1) forwards; }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />

      {/* Corner brackets */}
      <div className="fixed top-8 left-8 w-10 h-10 border-l-2 border-t-2 border-[#00e5b4]/40" />
      <div className="fixed top-8 right-8 w-10 h-10 border-r-2 border-t-2 border-[#00e5b4]/40" />
      <div className="fixed bottom-8 left-8 w-10 h-10 border-l-2 border-b-2 border-[#00e5b4]/40" />
      <div className="fixed bottom-8 right-8 w-10 h-10 border-r-2 border-b-2 border-[#00e5b4]/40" />

      {/* Scan line */}
      <div className="fixed inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00e5b4]/20 to-transparent pointer-events-none"
        style={{ animation: "scanDown 4s linear infinite", top: 0 }} />

      <div className="relative z-10 max-w-2xl">
        {/* Big 404 */}
        <div className={`text-[clamp(8rem,20vw,18rem)] font-black tracking-tight leading-none mb-4 select-none
          ${glitch ? "glitch-active" : "text-[#00e5b4]"}`}
          style={glitch ? {} : { textShadow: "0 0 80px rgba(0,229,180,0.4), 0 0 160px rgba(0,229,180,0.2)" }}>
          {chars}
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 justify-center mb-8">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1e2b28]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#3a5550]">Page not found</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1e2b28]" />
        </div>

        <p className="text-[#5a7570] text-lg leading-relaxed mb-12">
          The page you're looking for doesn't exist — or was moved. The AI is as confused as you are.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link href="/"
            className="bg-[#00e5b4] text-black font-bold px-8 py-4 rounded-xl text-base
              hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)] transition-all duration-300">
            ← Go Home
          </Link>
          <Link href="/projects"
            className="border border-[#2a3d38] text-white font-semibold px-8 py-4 rounded-xl text-base
              hover:border-[#00e5b4] hover:text-[#00e5b4] transition-all duration-300">
            See Our Work
          </Link>
        </div>

        {/* Quick links */}
        <div className="border border-[#1e2b28] rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-5">Were you looking for?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Services",     href: "/services" },
              { label: "Projects",     href: "/projects" },
              { label: "About Us",     href: "/about" },
              { label: "Blog",         href: "/blog" },
              { label: "Careers",      href: "/careers" },
              { label: "Contact",      href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className="text-sm text-[#5a7570] hover:text-[#00e5b4] transition-colors duration-200 flex items-center gap-2 group/link">
                <span className="w-0 h-px bg-[#00e5b4] group-hover/link:w-3 transition-all duration-200" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes scanDown{from{transform:translateY(-100vh)}to{transform:translateY(100vh)}}`}</style>
    </main>
  );
}
