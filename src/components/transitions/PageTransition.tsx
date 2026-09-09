"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────
   PageTransition

   Wraps route content so navigating between pages fades/lifts instead of
   hard-cutting. Keyed on the pathname so AnimatePresence treats each route
   as a distinct element to exit/enter — framer-motion's useReducedMotion
   (not a custom check) collapses the animation to an instant, motionless
   swap for reduced-motion users, consistent with how every other animated
   piece on this site behaves.

   Deliberately restrained: a short fade with a small vertical drift, not a
   slide/scale/rotate combo — the goal is "one considered product" rather
   than a transition that calls attention to itself on every click.
───────────────────────────────────────────────────────────────────────── */

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    // No motion component, no AnimatePresence bookkeeping — just render.
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
