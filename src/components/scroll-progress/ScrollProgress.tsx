"use client";

import { useEffect, useRef, useState } from "react";
import VertexLogo from "@/components/logo/VertexLogo";

/* ─────────────────────────────────────────────────────────────────────────
   ScrollProgress

   Small, fixed circular ring (bottom-right) tracking how far down the
   page the reader has scrolled. Click or Enter/Space scrolls back to top.

   - Hidden until the reader has scrolled past the very top (keeps the
     hero and other first-viewport content completely clean).
   - Hidden entirely on pages too short to meaningfully scroll.
   - Updates via a single requestAnimationFrame per scroll/resize burst,
     not a measurement per event — cheap even on long pages.
   - Respects prefers-reduced-motion by dropping the smoothing transition
     and using an instant jump-to-top instead of smooth scroll. The ring
     itself isn't decorative motion — it reflects real scroll position —
     so it isn't disabled outright, only the animated easing is.
───────────────────────────────────────────────────────────────────────── */

const SIZE = 40;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0); // 0–1
  const [visible, setVisible] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setCanScroll(max > 200);
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      setVisible(window.scrollY > 80);
      rafRef.current = null;
    };

    const schedule = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!canScroll) return null;

  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotionRef.current ? "auto" : "smooth" })}
      aria-label={`Scroll progress: ${Math.round(progress * 100)} percent. Activate to return to top.`}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full
        bg-[#0d0f0e]/80 backdrop-blur-sm border border-[#1e2b28] hover:border-[#00e5b4]/40
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5b4]/60"
      style={{
        width: SIZE,
        height: SIZE,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: reducedMotionRef.current
          ? "border-color 150ms ease"
          : "opacity 300ms ease, border-color 200ms ease",
      }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#1e2b28" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#00e5b4"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: reducedMotionRef.current ? "none" : "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <VertexLogo size={14} />
    </button>
  );
}
