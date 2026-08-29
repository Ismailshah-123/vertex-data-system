# About page — honest rewrite (founder-led, early-stage)

You confirmed: rewrite honestly rather than keep the fictional team.

## What was fabricated and removed

- **6-person team** with invented credentials at real companies:
  "Zara Al-Hassan" (ex-DeepMind, Oxford PhD), "Daniel Mercer" (ex-Palantir,
  ex-Two Sigma), "Priya Krishnan" (ex-Revolut, Cambridge), "Tom Szabo"
  (ex-GCHQ, claimed authorship of a real OWASP publication), "Lena Obi"
  (ex-Hugging Face, MIT CSAIL PhD), "Rafael Vargas" (ex-Spotify,
  Kubeflow maintainer).
- **Founding story**: "Founded in 2012 by a DeepMind engineer."
- **Scale stats**: 240+ clients across 18 countries, $2.1B in value
  unlocked, 98% retention since 2015, three global offices.
- **7-entry fabricated timeline** (2012 London founding → 2017 Singapore
  office → 2026 "240+ clients").

## What replaced it

- **Hero**: honest 2026 founding, reframed "early" as a direct-access
  advantage rather than a weakness.
- **Founder attribution**: placeholder `[Your Name]` — I don't have your
  real name for *this* company confirmed, so I used a clear placeholder
  rather than guess. Fill this in before launch (also in the Team
  section and every blog post byline — see below).
- **Stats band**: replaced scale numbers you haven't earned yet with
  honest differentiators in the same visual format — 1:1 direct access,
  100% source-code ownership, founding year, 0 account managers.
- **Team section**: "Meet the team" (6-person grid) → "Small by design —
  for now" (single founder card). Also fixed the grid itself — a
  3-column grid with only 1 card would've left 2 empty columns, so it's
  now a single centered card instead of forcing the old layout.
- **Timeline → "Why this, why now"**: the fabricated year-by-year
  corporate history doesn't make sense for a company that doesn't have
  one yet. Replaced with 3 honest points on why the company exists now
  (market gap, timing, what early clients get) — same visual weight,
  no invented history.
- **Metadata** (`about/layout.tsx`) — had the identical fabricated claims
  in the page title/description, which is what shows up in Google
  results and social shares. Fixed to match.

## Consistency fixes on other pages (not a full redesign of them)

The same fabricated team/company details had leaked into other pages —
leaving them would have directly contradicted the honest story just
built on `/about`. Fixed the specific contradictions only; these pages
still get their own full pass later, per the priority list:

- **`/blog`** — 6 posts were each attributed to a different fake team
  member. All 6 now attribute to the same founder placeholder.
- **`/careers`** — hero paragraph claimed "a team of 40 who've shipped
  ML at DeepMind, Palantir, Revolut, Spotify, and GCHQ" — directly
  contradicts "founder-led, early-stage." Rewrote to be honest. The
  stats strip also claimed specific numbers I don't actually know
  (team size, countries, salary, equity terms) — replaced with
  honest, non-numeric stage descriptors rather than inventing new
  specific figures I can't verify. `careers/layout.tsx` metadata had
  the same claim, fixed too.
- **`Avatar.tsx`** — one doc-comment example used the fake name (not
  rendered anywhere live, but cleaned up for consistency).

## What you need to fill in before launch

Search for `[Your Name]` across the project — it appears in:
`about/page.tsx` (founder card + quote attribution) and all 6 entries
in `blog/page.tsx`. Replace with your actual name, and swap the "F"
initials/avatar treatment if you want a real photo instead.
