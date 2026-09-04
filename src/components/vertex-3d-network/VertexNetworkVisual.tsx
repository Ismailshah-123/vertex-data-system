"use client";

import React, { useEffect, useRef, useState } from "react";
import { VertexNetworkSystem, isWebGLAvailable, type DeviceTier, type VertexNetworkMode } from "./Vertex3DNetwork";

/* ─────────────────────────────────────────────────────────────────────────
   VertexNetworkVisual

   React wrapper around VertexNetworkSystem. One engine, five modes —
   pass `mode="about"` or `mode="process"` (or services/ai/data, for
   future pages) to get that page's visual metaphor from the same
   particle/network system rather than shipping a separate engine per
   page.
───────────────────────────────────────────────────────────────────────── */

function getDeviceTier(width: number): DeviceTier {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export const VertexNetworkVisual: React.FC<{ mode: VertexNetworkMode; className?: string }> = ({ mode, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<VertexNetworkSystem | null>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceTier>("desktop");
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setDeviceType(getDeviceTier(window.innerWidth));
    setWebglSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => setDeviceType(getDeviceTier(window.innerWidth)), 200);
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
      systemRef.current = new VertexNetworkSystem(containerRef.current, deviceType, reducedMotion, mode);
    } catch (err) {
      console.error("VertexNetworkSystem failed to initialize:", err);
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
    // Rebuilds on device-tier change (particle count/line budget differ per
    // tier); mode changes are handled via setMode() below without a rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType, webglSupported]);

  // Switch mode without tearing down and rebuilding the whole scene.
  useEffect(() => {
    systemRef.current?.setMode(mode);
  }, [mode]);

  if (webglSupported === false) {
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
