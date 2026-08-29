# VertexData Systems — Complete Dependency Manifest
# ====================================================
# Every library, framework, and package this project needs.
# Run the commands in ORDER from your project root.


# ══════════════════════════════════════════════════════════
# 1. CORE FRAMEWORK (required — the site won't run without these)
# ══════════════════════════════════════════════════════════

npm install next@latest react@latest react-dom@latest

  next          — App Router framework (pages, routing, layout, loading, not-found)
  react         — UI library
  react-dom     — DOM renderer for React


# ══════════════════════════════════════════════════════════
# 2. STYLING (required — every page uses Tailwind utility classes)
# ══════════════════════════════════════════════════════════

npm install tailwindcss autoprefixer postcss

  tailwindcss   — utility-first CSS (colors, spacing, animations defined
                  in tailwind.config.ts)
  autoprefixer  — adds vendor prefixes automatically
  postcss       — CSS transform pipeline Tailwind runs through


# ══════════════════════════════════════════════════════════
# 3. 3D / WEBGL (required for services page AIOrb + DataGlobe + clients page)
# ══════════════════════════════════════════════════════════

npm install three @types/three

  three         — WebGL 3D engine powering AIOrb.tsx (services hero)
                  and DataGlobe.tsx (rotating office-locations globe,
                  now live on /clients)
  @types/three  — TypeScript type definitions for the above

  NOTE: Both components ALSO auto-load Three.js from a CDN as a
  fallback if this package isn't installed, so the site still works
  without this step — it's just faster and type-safe with it.


# ══════════════════════════════════════════════════════════
# 3B. EMAIL (required for the contact form to actually send email)
# ══════════════════════════════════════════════════════════

npm install resend

  resend        — powers src/app/api/contact/route.ts, which sends
                  a real email every time someone submits the contact
                  form. Free tier covers 3,000 emails/month.

  You ALSO need a .env.local file in your project root:
    RESEND_API_KEY=re_your_key_here
    CONTACT_EMAIL=hello@vertexdata.systems

  Get your key free at https://resend.com — see README_INSTALL.md
  for the full 5-step setup. Without this, form submissions are
  logged to your terminal instead of emailed, so nothing is lost,
  but you won't actually receive leads until this is configured.


# ══════════════════════════════════════════════════════════
# 4. TYPESCRIPT (required — every file in this project is .tsx/.ts)
# ══════════════════════════════════════════════════════════

npm install -D typescript @types/react @types/react-dom @types/node

  typescript         — the TypeScript compiler itself
  @types/react       — type definitions for React
  @types/react-dom   — type definitions for React DOM
  @types/node        — type definitions for Node.js APIs


# ══════════════════════════════════════════════════════════
# 5. FONTS (required — layout.tsx imports Inter from next/font/google)
# ══════════════════════════════════════════════════════════

# No separate install needed — next/font/google is built into Next.js.
# It downloads and self-hosts the Inter font automatically at build time.


# ══════════════════════════════════════════════════════════
# ONE COMMAND TO INSTALL EVERYTHING ABOVE AT ONCE
# ══════════════════════════════════════════════════════════

npm install next@latest react@latest react-dom@latest tailwindcss autoprefixer postcss three @types/three resend && npm install -D typescript @types/react @types/react-dom @types/node


# ══════════════════════════════════════════════════════════
# RUNNING THE PROJECT (after all installs above are done)
# ══════════════════════════════════════════════════════════

npm run dev
# → opens on http://localhost:3000

npm run build
# → production build, catches type errors before deploy

npm run start
# → runs the production build locally


# ══════════════════════════════════════════════════════════
# OPTIONAL — DEPLOY TO VERCEL (fastest path to a live URL)
# ══════════════════════════════════════════════════════════

npm install -g vercel
vercel
# → follow the prompts, get a live URL in under 2 minutes


# ══════════════════════════════════════════════════════════
# VERSION NOTES
# ══════════════════════════════════════════════════════════

This project was built against:
  Next.js        14.x (App Router)
  React          18.x
  Tailwind CSS   3.x
  TypeScript     5.x
  Three.js       r128 (matches the CDN fallback version used in
                  AIOrb.tsx and DataGlobe.tsx — if you install a newer
                  npm version of three, some Three.js r142+ APIs like
                  THREE.CapsuleGeometry are NOT used in this codebase,
                  so no compatibility issues are expected)

If `npm install` reports peer dependency conflicts, add --legacy-peer-deps
to the command, e.g.:
  npm install three @types/three --legacy-peer-deps
