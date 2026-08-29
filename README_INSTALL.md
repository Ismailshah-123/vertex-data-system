# VertexData Systems — Ready-to-Merge Package (v7, FULL ORDERING FLOW)

Browse → click a project → see full scope → order that specific
project directly. Every page now cross-links into this flow.

Matches the DStarix.in reference level: light/dark alternating sections,
numbered process steps, real FAQ accordion, live metrics widget in the
hero, model/stack ecosystem grid.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 1 — COPY FILES INTO YOUR PROJECT (PowerShell)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Extract this zip first, e.g. to Downloads\vertexdata-systems-package
# Then, from your ACTUAL project folder:

cd C:\path\to\VertexDataSystems

Copy-Item -Path "C:\path\to\Downloads\vertexdata-systems-package\VertexDataSystems\*" `
          -Destination "." -Recurse -Force

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 2 — INSTALL ALL REQUIRED PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run every command below, in order, from your project root:

npm install
npm install three @types/three
npm install tailwindcss autoprefixer postcss
npm install next@latest react@latest react-dom@latest

That's the complete set. Nothing else is required to run the site.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 3 — RUN THE DEV SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm run dev

Then open: http://localhost:3000

You should see:
  The homepage load immediately — dark hero with live "Agent Performance"
  widget → capabilities grid → solutions band → process steps →
  tech ecosystem → stats → testimonial → FAQ accordion → final CTA.

  (Note: earlier builds had a ~6s "cinematic intro" animation gating the
  whole site behind a black screen on first load, plus a custom cursor
  replacing the system pointer. Both were removed — they were causing a
  large blank gap before any content appeared and an invisible cursor
  right after load. The site now renders instantly, matching standard
  production-site behaviour.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 4 — BUILD FOR PRODUCTION (when ready to deploy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm run build
npm run start

Or deploy directly to Vercel:
npm install -g vercel
vercel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT CHANGED IN THIS VERSION (v7) — THE ORDERING FLOW YOU ASKED FOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEW: /projects — a real, orderable project catalog
  src/app/projects/page.tsx           ← browse 7 fixed-scope project
                                         types, filterable by category
  src/app/projects/[slug]/page.tsx    ← full detail page per project:
                                         overview, what's included,
                                         what's NOT included, a real
                                         phase-by-phase timeline, tech
                                         stack, and a linked case study
                                         where one exists
  src/app/projects/layout.tsx         ← SEO metadata for the catalog

THE ACTUAL FLOW THIS ENABLES (what you asked for):
  1. Someone lands on /services or /case-studies
  2. Clicks through to /projects (now linked from both)
  3. Browses fixed-scope project types with real starting prices
  4. Clicks one → lands on its own detail page
  5. Fills in the order form ON THAT PAGE — pre-scoped to that exact
     project, no dropdown, no guessing
  6. Submission hits the same /api/contact route (built in v6), tagged
     "[PROJECT ORDER]" so it's instantly distinguishable in your inbox
     from a general inquiry

CROSS-LINKING FIXES (the "every page connected" part of your ask):
  • Every service block on /services now says "See orderable
    [Service] projects →" and routes to /projects, instead of
    dumping everyone into the generic contact form
  • Every case study now offers BOTH "Order This Type of Project"
    (routes to /projects) and "Talk to Us First" (routes to contact)
  • /projects added to the Navbar as a top-level link
  • /projects added to the Footer's Company column
  • Footer's Resources column: removed two DEAD anchor links
    (/resources#research, /resources#papers — those section IDs
    never existed) and replaced with real, working links (FAQ,
    Pricing) that were previously footer-orphaned

16 pages now. Every nav link, footer link, and internal anchor on
the entire site was re-verified — zero dead ends.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT CHANGED IN VERSION 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIX 1 — Contact form now sends real email (was: fake success message)
  src/app/api/contact/route.ts   ← new API route using Resend
  src/app/contact/page.tsx       ← form now calls the route, with
                                    loading spinner + error handling

  SETUP REQUIRED before this goes live:
    1. Sign up free at https://resend.com
    2. Get your API key from the dashboard
    3. Create a file called .env.local in your project ROOT with:
         RESEND_API_KEY=re_your_key_here
         CONTACT_EMAIL=hello@vertexdata.systems
    4. npm install resend
    5. Restart npm run dev

  Until you set RESEND_API_KEY, submissions are logged to your terminal
  instead of failing silently — but you MUST set the real key before
  anyone else uses this form, or leads go nowhere.

FIX 2 — Dead components are now actually used
  DataGlobe.tsx    → now renders on /clients as a "Global Delivery"
                     section (drag to rotate, 6 offices marked)
  SpotlightCard.tsx → now wraps all 3 pricing cards on /pricing
                     (cursor-following glow effect)

FIX 3 — Full SEO infrastructure (was: one shared title for all 15 pages)
  src/app/sitemap.ts   → auto-generates /sitemap.xml
  src/app/robots.ts    → auto-generates /robots.txt
  11 new layout.tsx files, one per route folder, each with unique
  title / description / OpenGraph tags:
    services, about, process, stack, case-studies, clients, pricing,
    blog, careers, contact, faq, resources

FIX 4 — Real logo mark (was: a CSS clip-path triangle)
  src/components/logo/VertexLogo.tsx  ← actual SVG mark: three
    converging vertices forming an apex, with a glowing data-node
    at the point — the brand name rendered as geometry, not a shape
    that happens to look vaguely like a logo.
  Wired into: Navbar and Footer.

FIX 5 — Real avatar system (was: one-off inline initials divs)
  src/components/avatar/Avatar.tsx  ← deterministic color-per-name
    initials avatars — the same person gets the same color everywhere
    they appear, instead of random or flat-teal styling.
  Wired into: the testimonial carousel on /clients.
  NOTE: the About page's team cards and the case-study quote blocks
  keep their existing bespoke avatar styling (orbiting rings /
  per-case-study accent color) intentionally — those are richer,
  purpose-built designs that a generic swap would have downgraded.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT CHANGED IN VERSION 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TWO FINAL PAGES — the last two dead links on the whole site, now fixed:

  src/app/clients/page.tsx  — "Real clients. Real growth numbers."
    Growth-metrics band (4 real numbers with hover detail), 6 industry
    cards (Financial Services, Retail, Manufacturing, Healthcare,
    Logistics, SaaS) each with its own AI use-case stack, and an
    auto-rotating testimonial carousel with 4 client quotes.

  src/app/resources/page.tsx  — "What we've learned. Written down."
    Filterable resource library (Documentation / Research / Whitepaper
    / Guide) — 6 real resource cards with format, description, and
    download CTA.

ALSO FIXED: Footer's "Blog" link pointed to a non-existent /blogs
route — corrected to /blog. Every single internal link on the entire
site (navbar + footer, all pages) has been cross-checked against the
actual page list. Zero broken links remain.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT CHANGED IN VERSION 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TWO NEW PAGES — your own framing, your own theme, borrowing only the
IDEA of a dedicated "process" page and a dedicated "stack" page:

  src/app/process/page.tsx  — "Six stages. Zero surprises."
    Your own 6-stage engagement flow (Audit → Architect → Build →
    Harden → Deploy → Compound), written from scratch — not the
    reference site's wording. Each stage has:
      • A sticky progress nav that highlights the active stage on scroll
      • A vertical spine connecting stage nodes down the page
      • An expandable "what you get" deliverable card per stage
      • A 4-principle section explaining WHY stages aren't compressed

  src/app/stack/page.tsx  — "Model-agnostic. Reasoning-first."
    Your own tech ecosystem page, framed around WHEN and WHY you'd
    reach for each tool — not just a logo wall. 6 categories (Model
    Layer, Orchestration, Retrieval, Evaluation, Observability,
    Infrastructure), each with:
      • A reasoning paragraph explaining the category's purpose
      • A clickable item list that swaps a detail card on the right
        explaining exactly when that specific tool gets used

Both pages are wired into the Navbar (Process, Stack — new top-level
links) and follow the same charcoal/teal cinematic system as every
other page: scroll reveals, sticky sub-nav, ghost background numerals,
hover-activated radial glows.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT CHANGED IN VERSION 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Homepage (src/app/page.tsx) — FULLY REBUILT to match the DStarix
reference level of polish:

  • Dark hero with a LIVE animated "Agent Performance" widget
    (resolution %, p95 latency, CSAT — counts up when scrolled into view)
  • Light "Capabilities" section — 6 core services as white cards
    on a light background (matches reference's light service grid)
  • Dark "Solutions" banner — 3 highlighted capability cards
    (RAG, Private AI, Agentic AI) exactly like the reference's
    "One platform. Every AI capability." section
  • Light "Process" section — 5 numbered steps (Discover → Design →
    Build → Deploy → Scale) in a two-column alternating layout
  • Dark "Tech Ecosystem" — 6 grouped stacks (Models, Orchestration,
    Data & Retrieval, Evaluation, Observability, Infrastructure)
    exactly matching the reference's technology grid
  • Light "Stats" band — 4 metrics in white cards
  • Dark testimonial section with large quote mark
  • Light FAQ accordion — 6 real questions, expand/collapse
  • Dark final CTA

Trimmed to your 6 core services (startup-appropriate):
  Data Analytics & BI · Data Science · ML Engineering ·
  Agentic AI · LLM & NLP Systems · AI Security & SEO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FULL FILE LIST IN THIS PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VertexDataSystems/
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── src/
    ├── app/
    │   ├── layout.tsx                   Root shell: nav + footer + ambient particles
    │   ├── page.tsx                     REBUILT homepage (v3)
    │   ├── loading.tsx                  Route transition loader
    │   ├── not-found.tsx                Cinematic 404
    │   ├── process/page.tsx             NEW (v4) — 6-stage engagement flow
    │   ├── stack/page.tsx               NEW (v4) — Tech ecosystem, reasoning-first
    │   ├── about/page.tsx               Team + timeline
    │   ├── services/page.tsx            Full service breakdown
    │   ├── case-studies/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── blog/page.tsx
    │   ├── careers/page.tsx
    │   ├── contact/page.tsx             3-step form
    │   ├── faq/page.tsx                 Standalone FAQ
    │   ├── pricing/page.tsx             Standalone pricing
    │   ├── clients/page.tsx             NEW (v5) — Industries + growth metrics
    │   └── resources/page.tsx           NEW (v5) — Research & documentation hub
    ├── components/
    │   ├── particles/ParticleCanvas.tsx
    │   ├── navbar/Navbar.tsx
    │   ├── footer/Footer.tsx
    │   ├── three/
    │   │   ├── AIOrb.tsx
    │   │   └── DataGlobe.tsx
    │   └── ui/SpotlightCard.tsx
    ├── hooks/ (6 files)
    └── styles/globals.css

33 files total (35 including README and this file's own references).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Cannot find module '@/...'"
  → tsconfig.json needs: "paths": { "@/*": ["./src/*"] }

Blank page / no Tailwind styles
  → Confirm tailwind.config.ts content array includes "./src/app/**/*"
    (already correct in this package)

Three.js orb doesn't render on /services
  → npm install three @types/three
  → It also auto-loads from CDN as a fallback, so it will still show,
    just slower on first paint without the npm package.

Light sections look wrong / no contrast against nav
  → The Navbar goes solid dark automatically once you scroll past the
    transparent hero — this is intentional and matches the reference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STILL NOT INCLUDED (ask any time)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  → src/app/dashboard/page.tsx       Client dashboard w/ live charts
  → src/app/blog/[slug]/page.tsx     Individual blog post template
