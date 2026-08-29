# Contact page — plus a bigger fabrication find along the way

## Contact page itself

Good news first: **the contact form backend is already properly built.**
Real Resend integration, server-side validation, graceful console-log
fallback when no API key is set yet so nothing's lost during dev. The
"integrate the contact form" step you mentioned earlier is mostly just
"sign up for Resend and add the API key" — not a build task. See
`src/app/api/contact/route.ts` for the 6-step setup comment already
written into the file.

Two real fixes on the page itself:
- **Service dropdown was still the old 6-service list** — didn't include
  CRM Automation at all (your flagship), or Web Development, RAG
  Chatbots, Voice AI. Someone filling out the form couldn't select your
  main service. Fixed to match the real 9-service catalog.
- **Fabricated London HQ address** ("1 Canada Square, Canary Wharf")
  plus claimed Manchester/Singapore offices — same category of issue as
  the About page. Replaced with "Remote-first, worldwide."

## The bigger find: this went a lot further than Contact

That address wasn't isolated — pulling the thread found a genuinely
elaborate fake global-offices narrative spanning three pages:

- **`careers/page.tsx`** — every job listing had a location field
  implying real offices ("London / Manchester / Remote", etc.), and the
  benefits list said "Fully remote-friendly — we have offices in London,
  Manchester, Singapore" (self-contradictory even in its own sentence).
  Fixed all 5 listings to "Remote," fixed the benefit line.
- **`clients/page.tsx`** — this was the big one. A whole section titled
  "Six offices. One standard of delivery." with an interactive 3D globe
  (`DataGlobe.tsx`) plotting 6 real geographic coordinates — London
  (flagged as HQ), Manchester, Singapore, New York, Stuttgart, Sydney —
  with connecting arcs drawn from the fake HQ to each fake satellite
  office. Replaced the section with an honest "Remote-first" statement
  consistent with the About page. The globe component is now unused
  anywhere in the codebase, so I deleted it rather than leave fabricated
  coordinate data sitting dead in the project.

**Left alone, flagged for you:** the careers page's benefits list still
has specific claims I have no way to verify or invent responsibly —
salary range (£80K–£150K), Bupa private healthcare, £3,000 learning
budget, quarterly off-sites. These aren't the same severity as claiming
a fake physical office or fake team credentials (they read as intended
policy, not as a checkable historical fact), but worth reviewing once
you actually know what you're offering.

**Also found, not yet fixed:** `case-studies/[slug]/page.tsx` also
references these same fabricated locations. Case Studies is next on the
page list — likely needs the same full honest treatment I gave Services'
"client result" fabrications, so leaving it for that dedicated pass
rather than a partial fix now.

## Files changed

`contact/page.tsx`, `careers/page.tsx`, `clients/page.tsx`. Deleted:
`components/three/DataGlobe.tsx` (orphaned after the fix, referenced
only fabricated data, wasn't used anywhere else).
