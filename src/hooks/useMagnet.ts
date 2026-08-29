"use client";
import { useRef } from "react";

export default function useMagnet(strength = 14) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / r.width;
    const dy = (e.clientY - r.top  - r.height / 2) / r.height;
    el.style.transform = `translate(${dx * strength}px, ${dy * (strength * 0.65)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return { ref, onMove, onLeave };
}
