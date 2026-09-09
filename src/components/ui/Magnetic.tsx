"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   Magnetic

   Wraps a single CTA (button/link) and subtly pulls it toward the cursor
   while hovering nearby, springing back on leave. Applied selectively to
   primary CTAs rather than every clickable element on the site — the
   point is a considered detail on the handful of actions that matter
   most, not a site-wide gimmick.

   Displacement is capped (small fraction of the element's own size) so it
   nudges rather than chases the cursor across the screen. No-ops under
   prefers-reduced-motion — the wrapped child still renders and works
   exactly as a normal button, just without the motion.
───────────────────────────────────────────────────────────────────────── */

export default function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  if (reduceMotion) {
    return <div className="inline-block">{children}</div>;
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
