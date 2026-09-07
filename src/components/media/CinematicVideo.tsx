"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   CinematicVideo

   Background-style ambient video card. Handles the stuff that's easy to
   get wrong with embedded video:
     - Doesn't even mount the <video> element (let alone start the network
       request) until it's about to scroll into view — IntersectionObserver,
       not "autoplay everything on page load".
     - Respects prefers-reduced-motion — shows the static poster frame
       instead of playing, no JS media query polling required.
     - Fixed aspect-ratio container + object-cover, so the source's native
       1280×720 proportions are never stretched regardless of how wide the
       container ends up being at a given breakpoint.
     - No visible browser control chrome — muted/autoPlay/loop/playsInline,
       poster shown until the first frame is ready.
───────────────────────────────────────────────────────────────────────── */

interface Props {
  src: string;
  poster: string;
  label: string;       // accessible label — these videos have no audio track/captions to describe them otherwise
  className?: string;
  aspectClass?: string; // default "aspect-video" (16:9, width-driven). Pass "aspect-auto" when the parent already sets an explicit height and should drive sizing instead.
}

export default function CinematicVideo({ src, poster, label, className = "", aspectClass = "aspect-video" }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setShouldLoad(true); // mount <video> and let the browser start fetching
          io.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading a little before it's actually on screen
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[#1e2b28]
        bg-[#0d0f0e] transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"} ${className}`}
    >
      {/* Poster — always rendered underneath; the only thing shown at all for reduced-motion users */}
      <img src={poster} alt={label} className="absolute inset-0 w-full h-full object-cover" />

      {shouldLoad && !reducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        />
      )}

      {/* Subtle bottom gradient — keeps any caption/label legible without a heavy overlay on the whole frame */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}
