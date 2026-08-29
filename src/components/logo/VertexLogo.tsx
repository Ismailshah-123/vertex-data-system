"use client";

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

   Usage:
     <VertexLogo size={28} />                      — icon only
     <VertexLogo size={28} withWordmark />          — icon + wordmark lockup
     <VertexLogo size={28} withWordmark animated /> — + subtle glow pulse
───────────────────────────────────────────────────────────────────────── */

interface Props {
  size?: number;
  withWordmark?: boolean;
  animated?: boolean;
  className?: string;
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
}: Props) {
  const src = withWordmark ? "/logo/vertex-lockup-green.png" : "/logo/vertex-icon-green.png";
  const ratio = withWordmark ? LOCKUP_RATIO : ICON_RATIO;

  return (
    <span
      aria-label="Vertex Data Systems"
      className={`inline-flex items-center ${animated ? "animate-[logoPulse_3s_ease-in-out_infinite]" : ""} ${className}`}
    >
      <img
        src={src}
        alt="Vertex Data Systems"
        height={size}
        style={{ height: size, width: size * ratio, objectFit: "contain" }}
        draggable={false}
      />
    </span>
  );
}
