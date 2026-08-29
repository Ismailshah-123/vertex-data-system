"use client";

import { useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   SpotlightCard
   A card with a radial gradient that follows the cursor — the classic
   "spotlight" hover effect. Use anywhere you want a premium hover feel:
   service cards, pricing cards, team cards, etc.

   Usage:
     <SpotlightCard className="p-8">
       <h3>Title</h3>
       <p>Body text</p>
     </SpotlightCard>
───────────────────────────────────────────────────────────────────────── */

interface Props {
  children:  React.ReactNode;
  className?: string;
  spotlightColor?: string;   // rgba or hex — defaults to teal
  borderColor?: string;
  as?: "div" | "a";
  href?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "0,229,180",
  borderColor    = "#1e2b28",
  as = "div",
  href,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos]     = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPos({ x, y });
  };

  const Comp = as === "a" ? "a" : "div";

  return (
    <Comp
      // @ts-ignore -- href only applies when as="a"
      href={as === "a" ? href : undefined}
      ref={ref as any}
      onMouseMove={handleMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border bg-[#0d0f0e] transition-colors duration-300 group ${className}`}
      style={{ borderColor }}
    >
      {/* Spotlight glow layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${pos.x}% ${pos.y}%, rgba(${spotlightColor},0.08), transparent 60%)`,
        }}
      />
      {/* Border glow ring (subtle) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(300px circle at ${pos.x}% ${pos.y}%, rgba(${spotlightColor},0.25), transparent 40%)`,
          WebkitMaskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Comp>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Variant: SpotlightBorder
   Same spotlight effect but ONLY on the border (no fill glow).
   Useful for cards where you don't want to dim/brighten inner content.
───────────────────────────────────────────────────────────────────────── */
export function SpotlightBorder({
  children,
  className = "",
  spotlightColor = "0,229,180",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl p-px overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(250px circle at ${pos.x}% ${pos.y}%, rgba(${spotlightColor},${opacity * 0.5}), #1e2b28)`,
        transition: "background 0.15s ease",
      }}
    >
      <div className="rounded-2xl bg-[#0d0f0e] h-full w-full">{children}</div>
    </div>
  );
}
