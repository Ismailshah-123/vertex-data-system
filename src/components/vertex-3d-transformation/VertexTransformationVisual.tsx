"use client";

import React, { useEffect, useRef, useState } from "react";
import { VertexTransformationSystem, isWebGLAvailable, type DeviceTier } from "./VertexTransformationCore";

/* ─────────────────────────────────────────────────────────────────────────
   VertexTransformationVisual

   React wrapper for the case-studies page's 3D transformation engine.
   Same responsibilities as VertexIntelligentArchitecture (hero) and
   VertexNetworkVisual (about/process): this component owns the DOM node,
   device-tier detection, and React lifecycle; VertexTransformationCore
   owns the WebGL scene.
───────────────────────────────────────────────────────────────────────── */

function getDeviceTier(width: number): DeviceTier {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export const VertexTransformationVisual: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<VertexTransformationSystem | null>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceTier>("desktop");
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null); // null = not checked yet (SSR-safe)

  useEffect(() => {
    setDeviceType(getDeviceTier(window.innerWidth));
    setWebglSupported(isWebGLAvailable());
  }, []);

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
      systemRef.current = new VertexTransformationSystem(containerRef.current, deviceType, reducedMotion);
    } catch (err) {
      console.error("VertexTransformationSystem failed to initialize:", err);
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
        className={`w-full h-full ${className}`}
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(0,229,180,0.10), transparent 70%)" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-transparent overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
