"use client";

import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────
   VertexLogo

   Uses the official provided brand asset (cropped and composited from
   the provided brand images) — not a CSS/SVG recreation. Two source
   images:
     - vertex-lockup-green.png  — icon + "VERTEX / DATA SYSTEMS" wordmark,
       composited horizontally from the provided assets (source lockup
       was a vertical/stacked layout, recomposed for navbar use)
     - vertex-icon-green.png    — standalone icon only, for compact contexts

   Known limitation: source files are JPEG brand exports (no
   transparency), so these crops carry a solid near-black background
   rather than true alpha. Reads fine against this site's dark theme.

   Renders via next/image rather than a raw <img> — the source files are
   full-resolution brand exports (the icon alone is 1000x850, ~590KB) but
   this component is almost always rendered at 20-40px, so letting Next
   downsample to the actual render size and serve WebP/AVIF is a real
   payload difference, not a micro-optimization, given this renders on
   every single page via Navbar/Footer/ScrollProgress.

   Usage:
     <VertexLogo size={28} />                      — icon only
     <VertexLogo size={28} withWordmark />          — icon + wordmark lockup
     <VertexLogo size={28} withWordmark animated /> — + subtle glow pulse
     <VertexLogo size={28} priority />              — preload (use once,
                                                        for the navbar's
                                                        above-the-fold copy)
───────────────────────────────────────────────────────────────────────── */

interface Props {
  size?: number;
  withWordmark?: boolean;
  animated?: boolean;
  className?: string;
  priority?: boolean;
}

// Source aspect ratios (from the actual files) — used so height-only
// sizing never distorts the image.
const LOCKUP_RATIO = 1238 / 320; // width / height
const ICON_RATIO   = 1000 / 850;

export default function VertexLogo({
  size = 32,
  withWordmark = false,
  animated = false,
  className = "",
  priority = false,
}: Props) {
  const src = withWordmark ? "/logo/vertex-lockup-green.png" : "/logo/vertex-icon-green.png";
  const ratio = withWordmark ? LOCKUP_RATIO : ICON_RATIO;
  const height = size;
  const width = Math.round(size * ratio);

  return (
    <span
      aria-label="Vertex Data Systems"
      className={`inline-flex items-center ${animated ? "animate-[logoPulse_3s_ease-in-out_infinite]" : ""} ${className}`}
    >
      <Image
        src={src}
        alt="Vertex Data Systems"
        width={width}
        height={height}
        priority={priority}
        draggable={false}
        style={{ height, width, objectFit: "contain" }}
      />
    </span>
  );
}
