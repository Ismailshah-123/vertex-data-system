"use client";

import React, { useEffect, useRef, useState } from "react";
import { VertexSystem, isWebGLAvailable, type DeviceTier } from "./Vertex3DCore";

/* ─────────────────────────────────────────────────────────────────────────
   VertexIntelligentArchitecture

   High-performance React wrapper for the Vertex 3D particle system.
   Handles initialization, responsive tier detection, resize events, and
   memory cleanup.

   Differences from the originally-provided version:
     - deviceType is no longer a prop you hard-code — it's detected from
       viewport width and kept in sync on resize (debounced), with an
       explicit "tablet" tier in between mobile and desktop rather than
       just the two.
     - Checks prefers-reduced-motion and passes it through to the engine,
       which renders a single static frame instead of animating.
     - Checks WebGL availability before attempting to construct the
       scene. If it's unavailable (old browser, disabled GPU, some
       locked-down corporate environments), renders a subtle static
       fallback instead of throwing and breaking the page.
───────────────────────────────────────────────────────────────────────── */

function getDeviceTier(width: number): DeviceTier {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export const VertexIntelligentArchitecture: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<VertexSystem | null>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceTier>("desktop");
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null); // null = not checked yet (SSR-safe)

  // Resolve device tier and WebGL support on mount, client-side only.
  useEffect(() => {
    setDeviceType(getDeviceTier(window.innerWidth));
    setWebglSupported(isWebGLAvailable());
  }, []);

  // Keep device tier in sync with the viewport, debounced so a window
  // drag-resize doesn't rebuild the scene dozens of times a second.
  useEffect(() => {
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setDeviceType(getDeviceTier(window.innerWidth));
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || webglSupported !== true) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      systemRef.current = new VertexSystem(containerRef.current, deviceType, reducedMotion);
    } catch (err) {
      // isWebGLAvailable() already gates this in the common case, but a
      // context can still fail to acquire for other reasons (driver
      // issues, exhausted contexts) — fail soft rather than crash.
      console.error("VertexSystem failed to initialize:", err);
      setWebglSupported(false);
      return;
    }

    const handleResize = () => systemRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      systemRef.current?.destroy();
      systemRef.current = null;
    };
  }, [deviceType, webglSupported]);

  if (webglSupported === false) {
    // Graceful fallback — a quiet static gradient rather than an empty
    // hole in the layout or a thrown error.
    return (
      <div
        className={`w-full h-full rounded-2xl ${className}`}
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,229,180,0.08), transparent 70%)" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-transparent overflow-hidden ${className}`}
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
};
