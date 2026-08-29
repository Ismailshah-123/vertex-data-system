/* ─────────────────────────────────────────────────────────────────────────
   loading.tsx
   Shown briefly by Next.js while a route segment is still streaming in
   (e.g. the first visit to a not-yet-cached page). Client-side navigation
   between already-visited pages does not trigger this.

   Kept intentionally light: a thin top progress bar, no blocking overlay,
   no simulated multi-second delay. The page underneath is still visible.
───────────────────────────────────────────────────────────────────────── */

export default function Loading() {
  return (
    <div className="fixed top-0 inset-x-0 z-[9000] h-[2px] bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full w-1/3 bg-[#00e5b4] animate-[loadingBar_1.1s_ease-in-out_infinite]" />
      <style>{`
        @keyframes loadingBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
