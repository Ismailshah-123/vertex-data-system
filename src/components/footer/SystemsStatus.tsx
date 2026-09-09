"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   SystemsStatus

   A small, honest footer detail — a pulsing dot and a live UTC clock.
   Deliberately not a fabricated metric (no fake uptime %, no invented
   "systems monitored" count) — just two things that are true by
   construction: the dot is decorative, and the clock is real, current
   UTC time, ticking every second on the client only (rendered as static
   text on the server to avoid a hydration mismatch, then hands off to
   the live version once mounted).
───────────────────────────────────────────────────────────────────────── */

function formatUTC(d: Date) {
  return d.toISOString().slice(11, 19) + " UTC";
}

export default function SystemsStatus() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatUTC(new Date()));
    const id = setInterval(() => setTime(formatUTC(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-[#2a3d38] font-mono">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5b4] opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5b4]" />
      </span>
      <span>Systems Operational</span>
      {time && <span className="text-[#1e2b28]">·</span>}
      {time && <span suppressHydrationWarning>{time}</span>}
    </div>
  );
}
