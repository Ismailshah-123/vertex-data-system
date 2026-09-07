# Production polish pass — 3D responsiveness, SEO audit, performance, QA
# + new case-studies transformation animation

Scope: homepage hero composition, all four 3D/WebGL systems on the site,
the site-wide ambient canvas, a full SEO metadata audit, and a new
page-specific 3D system built for `/case-studies` from a provided asset.

---

## 1. What changed

### Homepage hero (`src/app/page.tsx`, `vertex-3d-hero/`)
- Widened the hero's container ceiling (`max-w-screen-xl` → adds
  `xl:max-w-[1600px]`) and rebalanced the two-column grid from
  `1.15fr/0.85fr` to `1fr/1fr` at `md`+. The old ratio, combined with the
  container being capped at 1280px on *every* screen ≥1280px, meant
  1280/1366/1440/1536/1920 all rendered identically, and — a real
  regression — the animation column was actually narrower at small
  tablet widths (272px at 768px) than on large phones (up to 520px),
  before growing again through the tablet/laptop range. The new ratio is
  monotonic at every width: ~320px (768px) → ~448px (1024px) → ~576px
  (1280px) → ~656px (1440px) → ~704px (1536px) → ~768px (1920px, capped).
- Replaced the rigid `aspect-square max-w-[520px]` stage with
  `aspect-square lg:aspect-[4/3] max-w-[520px] md:max-w-[820px]` — square
  through tablet (unchanged there), shifting to a 4:3 landscape stage
  from 1024px up so desktop gets a shorter, wider, more deliberately
  composed frame instead of a scaled-up mobile square.
- **Mobile (<768px) is untouched** — same `aspect-square max-w-[520px]`
  it already had.
- Camera (`Vertex3DCore.ts`): the V-shape's own geometry is very shallow
  in Z (±0.4 units), so the old 75°-FOV/z=8 desktop camera — wide and
  close — read as a flat decal facing the camera rather than a 3D object.
  Narrowed the desktop FOV to 52° and moved the camera back to z=13 (same
  on-screen V size, less wide-angle stretch at the edges), and raised it
  to `cameraY: 2.2` so it looks down onto the structure instead of
  straight at it. Tablet got a milder version (FOV 62°, z=10.5, y=1.2).
  **Mobile keeps its exact original camera (FOV 75°, z=12, y=2).** Added
  a very restrained vertical drift (±0.12 units) on top of the existing
  horizontal parallax, gated to non-mobile only. The V-shape formula,
  timeline, and colors are byte-for-byte unchanged — only camera framing
  moved.

### Case-studies page — new 3D transformation animation
- Built `src/components/vertex-3d-transformation/` (`VertexTransformationCore.ts`
  + `VertexTransformationVisual.tsx`), porting the provided
  "FRAGMENTED → ANALYZE → RECONSTRUCT → INTEGRATE → OPTIMIZE → SYSTEM"
  particle engine into this codebase's established engine/wrapper pattern
  (WebGL detection, reduced-motion static frame, tab-visibility +
  IntersectionObserver pausing, full disposal).
- Wired it into `case-studies/page.tsx`'s hero as an absolute full-bleed
  backdrop at `opacity-60`, with the same grid-overlay/glow treatment
  already used on About/Process, so it matches the established visual
  language instead of introducing a new one.
- **Recolored from the placeholder palette to this site's actual brand
  colors** (see §5 — same substitution already made once before for the
  other two engines, applied here for the same reason).
- **Added device-tier scaling** (1200/700/380 particles for
  desktop/tablet/mobile), preserving the original's foreground/background
  node ratios and the background dust grid's aspect at every tier rather
  than just getting sparser.
- Dropped two things that were confirmed dead/risky rather than reproduced
  as-is: a `scrollProgress` value that was computed on every scroll event
  but never read anywhere in the render loop, and a
  `window.setVertexTransformationPhase` global scrubber hook (a mutable-
  global anti-pattern in React — the same issue already flagged and
  removed from the network engine previously). Neither affects the
  default animation anyone actually sees.

### Services page orb (`src/components/three/AIOrb.tsx`)
Rebuilt rather than left alone — this one had real bugs, not just missing
polish:
- It loaded a **second, separate copy of Three.js from a CDN** at runtime
  (r128) instead of the `three` npm package already bundled for the other
  three systems — an entire extra library on the wire, version-mismatched
  from everything else. Now imports the same npm package.
- **Confirmed memory leak**: none of its geometries or materials (core,
  wireframe shell, 3 rings, 28 orbiting nodes, their connection lines, or
  the 600-point field) were ever disposed — only the renderer was. Full
  disposal added.
- **Confirmed listener leak**: the cleanup function meant to remove the
  `mousemove`/`resize` listeners was `return`-ed from inside the
  `loadThree().then(...)` callback, which does nothing — a function
  returned from a Promise callback isn't a React effect cleanup, it's
  just discarded. Every mount/unmount cycle leaked both listeners
  permanently. Fixed by moving them into the one cleanup path that
  actually runs.
- Added WebGL detection with a graceful fallback, reduced-motion support,
  and tab-visibility + IntersectionObserver pausing, matching the other
  three systems. Split into `AIOrbEngine.ts` + `AIOrb.tsx` to match this
  codebase's established engine/wrapper convention.
- Visual output (geometry, colors, counts, animation formulas) is
  unchanged — this was an internals-only rebuild.

### About/Process network visual (`vertex-3d-network/Vertex3DNetwork.ts`)
- Added IntersectionObserver-based pausing alongside the existing
  tab-visibility pause — it already had everything else (WebGL check,
  reduced motion, disposal).

### Site-wide ambient canvas (`src/components/particles/ParticleCanvas.tsx`)
This one's on every page via the root layout, and was the one visual
system on the site with none of the accessibility/performance handling
the others have:
- Added `aria-hidden="true"` (purely decorative, was previously
  unmarked).
- Added `prefers-reduced-motion` handling — draws one static frame
  instead of animating indefinitely.
- Added tab-visibility pausing — the animation loop now actually stops
  while the tab is hidden instead of running forever in the background.

---

## 2–4. Animation sizing (homepage hero)

| Breakpoint | Column width (actual, computed) | Stage aspect |
|---|---|---|
| Mobile (<768px) | up to 520px (unchanged) | 1:1 (unchanged) |
| Tablet (768–1023px) | ~320px → ~448px | 1:1 (unchanged ratio, more room) |
| Desktop (1024–1279px) | ~448px → ~576px | 4:3 |
| Desktop (1280–1439px) | ~576px → ~656px | 4:3 |
| Desktop (≥1440px) | ~656px → ~768px (capped at 1920px+) | 4:3 |

These are real computed values from the actual grid math (container
max-width, gap, column fractions), not aspirational targets — see §1 for
why they land below a naive "52–60vw" reading: the container width was
deliberately capped so the text column never drops below ~576px at any
desktop size, which was the binding constraint.

---

## 5. SEO issues found and fixed

- **Brand name inconsistency** — 15 files said "VertexData Systems", 11
  said "Vertex Data Systems", plus a few bare "VertexData" mentions on
  the case-studies page and one stray reference to an unrelated company
  name ("DStarix") in a code comment. Standardized every SEO-facing and
  visible occurrence on **"Vertex Data Systems"**. Left technical
  identifiers alone (folder name, `package.json`'s `vertex-data-systems`
  slug, component names like `VertexIntelligentArchitecture`).
- **Broken OG image reference** — `/images/og-image.png` was referenced
  in metadata but didn't exist anywhere in `public/`. Cropped the
  existing `vertex-logo-assembly-poster.jpg` (a real, on-brand video
  poster frame already in the repo) to a proper 1200×630 and saved it to
  the referenced path, rather than inventing a new asset.
- **Homepage had no canonical tag** — every other page sets its own
  `alternates.canonical` in a per-route `layout.tsx`, but the homepage is
  a client component (`page.tsx`, `"use client"`) and can't export
  metadata itself, and the root layout never set a default. Added
  `alternates: { canonical: "/" }` to the root layout — it only affects
  the homepage, since every other route's own `layout.tsx` already
  overrides it with a more specific URL.
- **Unconfirmed Twitter/X handle** — root metadata claimed
  `creator: "@vertexdata"` while the JSON-LD block two lines below it
  already documents that no verified social profile exists yet (`sameAs`
  is intentionally omitted for exactly that reason). Removed the handle
  rather than leave the contradiction.
- **Sitemap/robots/structured data** — audited and found already
  correct: cross-checked every service slug, project slug, and blog post
  against the actual data files and found zero drift; `robots.ts` blocks
  only `/api/`; `Service`/`BlogPosting`/`FAQPage`/`Organization` JSON-LD
  were all already in place and valid. No changes made here.
- **Not changed**: several project detail pages' meta descriptions
  (`overview` field, reused as the page `description`) run 229–301
  characters, well past the ~155–160 that search results typically show
  in full. I didn't truncate these — they're real, accurate, unique
  content, and cutting them requires an editorial judgment call about
  which clause to keep that felt outside a technical SEO pass. Flagging
  for your call in §9.

---

## 6. Performance improvements

- All four 3D systems (hero, network, orb, new transformation engine)
  now pause their render loop — not just a clock/timer — when the tab is
  hidden **and** when scrolled off-screen (IntersectionObserver). The
  network engine and the new engine are also both device-tier scaled;
  the hero and orb already were / now are respectively.
- Removed a second, separately-loaded copy of Three.js (the orb's old
  CDN script) from every page that renders `/services`.
- Fixed the confirmed memory leaks in the orb (undisposed geometries/
  materials) and the confirmed listener leak (the ineffective Promise-
  callback cleanup).
- The site-wide ambient canvas now actually stops its RAF loop when the
  tab is hidden instead of running indefinitely.

## 7. Accessibility improvements

- `aria-hidden="true"` is now consistent across all decorative visuals —
  four WebGL systems plus the ambient canvas — where it was previously
  missing only on the ambient canvas.
- `prefers-reduced-motion` is now respected by all five animated
  visuals (four WebGL + the ambient canvas); previously the ambient
  canvas was the one exception.
- None of the canvases capture keyboard focus or interrupt tab order —
  confirmed no `tabindex` or focus handling was added anywhere, and none
  existed before.

## 8. Build/test result

- `npx tsc --noEmit` — clean, zero errors, both before and after every
  change in this pass.
- ESLint — not configured in this project (no config file, no
  dependency), so this step doesn't apply here.
- `npm run build` — **succeeds**, all 45 routes generate correctly,
  including the new case-studies visual. One caveat on how I verified
  this: my sandbox's network allowlist doesn't include
  `fonts.googleapis.com`, so `next/font/google` can't fetch Archivo/
  Manrope at build time *in this environment specifically* — that's a
  sandbox restriction, not a code issue, and it'll resolve normally on
  Vercel or any environment with normal internet access. To actually
  exercise the rest of the build (routing, static generation, the new
  component, sitemap/robots generation) I temporarily swapped the two
  Google Font calls for inert stand-ins, ran a full build, confirmed all
  45 routes generated with no errors, then reverted `layout.tsx` back to
  the real `next/font/google` calls — verified byte-for-byte identical
  to the pre-swap version via `diff` before moving on. The fonts
  shouldn't be treated as untested; they're just untestable in this
  particular sandbox.

## 9. Remaining items for manual verification

- **Long meta descriptions** on 8 project detail pages (see §5) —
  left as-is; worth a look if you want tighter SERP snippets.
- **Visual QA at the exact breakpoints** (390/412/768/1024/1280/1366/
  1440/1536/1920) — I verified the CSS math and confirmed the build
  renders every route with no console errors, but I have no way to
  visually screenshot/eyeball the live rendered result in this
  environment, so the actual on-screen composition at each size is
  worth a real look before calling it done.
- **Core Web Vitals field data** (LCP/CLS/INP) — no way to measure real
  load performance without a deployed URL; the fixes in §6 should help,
  but I haven't measured before/after numbers.
- **AIOrb doesn't yet have device-tier particle scaling** the way the
  other three engines do (still a fixed 600 particles / 28 nodes
  regardless of device) — the CDN/leak/disposal fixes were the priority
  given the actual bugs found; tiering it further is a reasonable
  follow-up, not done here.

---

## 10. Follow-up pass — video sizing/framing consistency

After the initial pass, addressed the site's actual `<video>` elements
(`CinematicVideo` instances) — separate from the four WebGL/Three.js
systems covered above:

- **Found the pattern**: only the homepage's "System Flow" video
  (`01 // System Flow` section) had the architectural corner-bracket
  frame treatment. The other three `CinematicVideo` usages —
  `/services` ("Enterprise Architecture"), `/process`, and the
  per-service hero video slot on `/services/[slug]` — were bare,
  unframed video boxes. Added the same frame treatment to all three for
  visual consistency with the homepage.
- **Real dormant bug fixed**: the `/services/[slug]` hero video slot
  applies both `aspect-video` (from `CinematicVideo`'s own base classes)
  and a parent-forced `h-full` inside a fixed-height container
  simultaneously — two same-specificity utility classes fighting over
  the box's height, with the winner determined by Tailwind's internal
  stylesheet order rather than anything predictable in the markup. No
  service has `heroVideo` set yet, so this was never visibly broken, but
  it would have misbehaved unpredictably the moment footage was added.
  Fixed properly: `CinematicVideo` now accepts an `aspectClass` prop
  (defaults to `"aspect-video"`, unchanged for the three existing
  callers), and the `/services/[slug]` usage passes
  `aspectClass="aspect-auto"` to explicitly cede height control to its
  parent instead of fighting it.
- **Desktop sizing**: widened the container ceiling (`max-w-screen-xl`
  → adds `xl:max-w-[1600px]`) on the three video sections that had the
  same "identical from 1280px to 1920px" issue the hero had, for
  consistency with that fix.
- **Explicitly left alone**: the About/Process page's full-bleed
  `VertexNetworkVisual` WebGL background — confirmed out of scope and
  not touched.

Verified with a full `tsc --noEmit` pass and another complete production
build (all 45 routes) after these changes, same font-stub-and-revert
method as the initial pass (see §8) — reverted and diffed clean
afterward.
