"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   CustomCursor

   A small solid dot tracks the pointer exactly; a larger ring trails
   behind it with spring-like easing (same position += (target - position)
   * factor lerp used for camera parallax in the 3D engines elsewhere in
   this codebase, applied here to 2D cursor position instead).

   States:
     - default: thin emerald ring, solid dot
     - hovering anything the browser already renders as a pointer cursor
       (links, buttons, anything with cursor:pointer) — ring expands and
       fills, dot hides. Detected via getComputedStyle rather than a fixed
       selector list, so it stays correct as pages change without needing
       a matching update here.
     - mouse down — both compress slightly for tactile click feedback.

   Desktop only: gated on the (hover: hover) and (pointer: fine) media
   query, so touch/tablet devices never mount this and keep their normal
   native behavior untouched. Also skipped entirely for
   prefers-reduced-motion — the sensible reduced-motion answer for a
   motion-driven decorative follower is to leave the native cursor alone
   rather than offer a "static" version of something whose whole purpose
   is following movement.
───────────────────────────────────────────────────────────────────────── */

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fineHover && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX  = mouseX, ringY = mouseY;
    let hovering = false;
    let pressed  = false;
    let visible  = false;
    let rafId: number | null = null;

    const setHoverState = (isHovering: boolean) => {
      if (isHovering === hovering) return;
      hovering = isHovering;
      ring.style.width  = hovering ? "56px" : "34px";
      ring.style.height = hovering ? "56px" : "34px";
      ring.style.borderColor   = hovering ? "transparent" : "rgba(0,229,180,0.55)";
      ring.style.backgroundColor = hovering ? "rgba(0,229,180,0.14)" : "transparent";
      dot.style.opacity = hovering ? "0" : "1";
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }

      const target = e.target as Element | null;
      if (target) {
        const isPointer = window.getComputedStyle(target).cursor === "pointer";
        setHoverState(isPointer);
      }
    };

    const onMouseDown = () => {
      pressed = true;
      dot.style.transform  = "translate(-50%, -50%) scale(0.7)";
      ring.style.transform = "translate(-50%, -50%) scale(0.85)";
    };
    const onMouseUp = () => {
      pressed = false;
      dot.style.transform  = "translate(-50%, -50%) scale(1)";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
    };
    const onMouseLeave = () => {
      visible = false;
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      // Dot tracks exactly; ring eases toward it for the trailing feel.
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;

      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (document.visibilityState === "visible" && rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#00e5b4] pointer-events-none z-[9999] opacity-0"
        style={{ transform: "translate(-50%, -50%)", transition: "opacity 0.2s ease, transform 0.15s ease" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full border pointer-events-none z-[9999] opacity-0"
        style={{
          borderColor: "rgba(0,229,180,0.55)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background-color 0.25s ease, opacity 0.2s ease, transform 0.15s ease",
        }}
      />
    </>
  );
}
