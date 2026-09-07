import { ImageResponse } from "next/og";

/* ─────────────────────────────────────────────────────────────────────────
   opengraph-image.tsx
   
   Next.js convention: dropping this file in src/app/ makes it auto-serve
   at /opengraph-image whenever anyone shares a link to your site on
   LinkedIn, Slack, Twitter/X, WhatsApp, iMessage, etc. No static PNG to
   create or keep in sync — this generates the image on-demand from JSX,
   using your actual brand colors and the real VertexData mark.

   This fixes a genuine gap: layout.tsx's metadata referenced
   "/images/og-image.png", which never existed as a file. Every link
   share was previously showing a broken image. This is the fix.

   Per-page override: any route can get its own custom preview by adding
   an opengraph-image.tsx inside that route's folder (e.g.
   src/app/services/opengraph-image.tsx) — Next.js prefers the more
   specific one automatically. The root one below is the site-wide
   default and covers every page that doesn't have its own.
───────────────────────────────────────────────────────────────────────── */

export const runtime = "edge";
export const alt = "VertexData Systems — Enterprise AI & Data Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0c0b",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,180,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,180,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            display: "flex",
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,229,180,0.16) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 48, left: 48, width: 40, height: 40, borderLeft: "2px solid rgba(0,229,180,0.5)", borderTop: "2px solid rgba(0,229,180,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", top: 48, right: 48, width: 40, height: 40, borderRight: "2px solid rgba(0,229,180,0.5)", borderTop: "2px solid rgba(0,229,180,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 48, left: 48, width: 40, height: 40, borderLeft: "2px solid rgba(0,229,180,0.5)", borderBottom: "2px solid rgba(0,229,180,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 48, right: 48, width: 40, height: 40, borderRight: "2px solid rgba(0,229,180,0.5)", borderBottom: "2px solid rgba(0,229,180,0.5)", display: "flex" }} />

        {/* Logo mark — three converging vertices, matches VertexLogo.tsx */}
        <div style={{ display: "flex", marginBottom: 36 }}>
          <svg width="88" height="88" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4 L44 40 L4 40 Z"
              fill="rgba(0,229,180,0.12)"
              stroke="#00e5b4"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M12 40 L24 16 L36 40" stroke="#00e5b4" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="24" cy="16" r="3.6" fill="#00e5b4" />
            <circle cx="12" cy="40" r="2" fill="#00e5b4" fillOpacity="0.7" />
            <circle cx="36" cy="40" r="2" fill="#00e5b4" fillOpacity="0.7" />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#ffffff" }}>VertexData</span>
          <span style={{ color: "#00e5b4" }}>.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#8aada8",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.4,
          }}
        >
          Enterprise AI & Data Intelligence
        </div>

        {/* Bottom label strip */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5b4", display: "flex" }} />
          <div style={{ fontSize: 16, color: "#3a5550", letterSpacing: "0.15em", textTransform: "uppercase", display: "flex" }}>
            Data Science · ML Engineering · Agentic AI
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
