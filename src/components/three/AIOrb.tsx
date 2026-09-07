"use client";

import React, { useEffect, useRef, useState } from "react";
import { AIOrbEngine, isWebGLAvailable } from "./AIOrbEngine";

/* ─────────────────────────────────────────────────────────────────────────
   AIOrb — React wrapper for AIOrbEngine, mirroring the wrapper pattern
   used for the homepage hero (VertexIntelligentArchitecture) and the
   about/process network visual (VertexNetworkVisual): this component
   owns the DOM node and React lifecycle, the engine owns the WebGL scene.
───────────────────────────────────────────────────────────────────────── */

export default function AIOrb({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AIOrbEngine | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null); // null = not checked yet (SSR-safe)

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    if (!containerRef.current || webglSupported !== true) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      engineRef.current = new AIOrbEngine(containerRef.current, reducedMotion);
    } catch (err) {
      console.error("AIOrbEngine failed to initialize:", err);
      setWebglSupported(false);
      return;
    }

    const handleResize = () => engineRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [webglSupported]);

  if (webglSupported === false) {
    // Graceful fallback — a quiet static gradient rather than an empty
    // hole in the layout or a thrown error.
    return (
      <div
        className={`w-full h-full rounded-full ${className}`}
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,229,180,0.1), transparent 70%)" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ background: "transparent" }}
      aria-hidden="true"
    />
  );
}
