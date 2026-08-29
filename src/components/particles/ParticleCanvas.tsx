"use client";

import { useEffect, useRef } from "react";

interface Props {
  count?:           number;
  opacity?:         number;
  connectDistance?: number;
  className?:       string;
}

export default function ParticleCanvas({
  count           = 120,
  opacity         = 0.65,
  connectDistance = 110,
  className       = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;
    let mx = -9999, my = -9999;

    const resize = () => {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x:number; y:number; vx:number; vy:number; size:number; alpha:number; pulse:number; pulseSpeed:number };
    const particles: P[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.018,
      });
    }

    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMouseMove);

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => {
        // Repel from mouse
        const dx = p.x - mx, dy = p.y - my;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) { p.vx += (dx / d) * 0.04; p.vy += (dy / d) * 0.04; }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const pm = 0.6 + 0.4 * Math.sin(p.pulse);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * pm, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0,229,180,${p.alpha * pm})`;
        ctx!.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < connectDistance) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(0,229,180,${0.07 * (1 - d / connectDistance)})`;
            ctx!.lineWidth   = 0.5;
            ctx!.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [count, connectDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    />
  );
}
