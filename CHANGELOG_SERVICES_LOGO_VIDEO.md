# Services catalog rewrite + font, logo, and video integration

## Services catalog — matches your real business now

Old catalog (10 generic services: data science, data engineering, MLOps,
security, etc.) replaced with 9 services matching what you and Mujtaba
actually sell, CRM Automation leading as the flagship:

1. CRM Automation & Lead Generation (flagship — cold calling + lead gen)
2. Data Analytics & BI
3. Web Development (new — didn't exist before)
4. AI Knowledge Assistants / RAG Chatbots (new, distinct from general NLP)
5. Voice AI Agents (new)
6. ML Engineering & Predictive Analytics
7. Agentic AI & Automation
8. Computer Vision
9. NLP & LLM Systems

Updated everywhere this catalog is referenced, so nothing drifts out of
sync: `services/page.tsx` (full detail blocks), `services/[slug]/page.tsx`
(individual pages), Navbar mega-menu, homepage's 6 capability cards,
Footer service links. Also fixed the mega-menu grid (was 5 columns for
10 items leaving a gap; now 3 columns for 9 — exact fit) and the same for
the underlying `[slug]` page.

**Also fixed:** every one of the old 10 services had a fabricated "client
result" quote — specific claims like "a FTSE 250 retailer," "a Spotify-
scale streaming platform," with invented metrics. Same category of issue
as the About page fix. Rewrote all 9 as honest capability/methodology
statements (how the system works) instead of fabricated past outcomes,
and changed the surrounding labels from "Client result" / "Proven at
enterprise scale" to "In practice" / "Built production-first, from day
one."

## Font — replaced Inter (the "every AI tool" font)

Now a two-font pairing: **Archivo** for all headings (h1/h2/h3, applied
automatically site-wide via a CSS rule, not by editing every component),
**Manrope** for body text. Verified Archivo actually supports weight 900
before committing to it — this design leans hard on `font-black`
everywhere, and my first choice (Space Grotesk) tops out at 700, which
would have quietly weakened every headline on the site.

## Logo — real brand asset, not a CSS recreation

The provided file was a full brand presentation sheet (icon + wordmark +
color swatches + construction grid, all in one JPEG with text labels) —
not a usable web asset directly. Cropped out the two actually-usable
pieces (horizontal icon+wordmark lockup, standalone icon) and wired them
into `VertexLogo.tsx`, replacing the old hand-drawn teal SVG. Also
generated a proper favicon and apple-touch-icon from the icon crop, and
removed metadata that was pointing at a `/favicon/` folder that never
existed in this project (pre-existing dead reference).

**Flagging, not deciding for you:** the new logo's palette is blue/cyan.
Every other element on the site — every button, hover state, and accent
— is teal (`#00e5b4`), used hundreds of times across the codebase. I
placed the logo exactly as provided (per your brand doc's explicit
instruction not to alter its colors), but the logo and the site's own
accent color don't currently match. Recoloring the whole site to the new
blue palette is a real, large undertaking — tell me if you want that as
its own task, or if you're fine with the logo mark and the UI accent
being different colors (which plenty of real brands do intentionally).

**Known limitation:** the source is a JPEG with no transparency, so the
crops carry a solid near-black background rather than true alpha. It
reads fine against this site's dark theme but won't sit flush on
anything lighter. Get a transparent PNG/SVG export from whoever made the
brand sheet if you need that later.

## Video — 2 of 3 placed on the homepage, 1 staged for /process

Checked actual technical specs on all three (1280×720, 24fps, 8s, h264,
~2MB each) and pulled real frames to see the content, since I can't
play video directly.

- **system-flow.mp4** → between Capabilities and the AI Solutions banner.
  Visual: chaotic data fragments settling into a connected structure —
  fits the "one platform, every capability" message right after it.
- **intelligence-network.mp4** → between Process and Industries. Visual:
  signals converging into a symmetric network hub.
- **enterprise-architecture.mp4** → NOT placed on the homepage. It has
  literal text labels baked into the footage ("AI," "API," "Models") —
  overlaying page headlines on top of that would collide with the
  video's own text. Copied into `public/videos/` and ready to go, but
  it's a better fit for the dedicated `/process` page (which you also
  asked to make "fully informative") than for the homepage.

**Important finding — none of the three loop seamlessly.** All three
have a clear progression (chaotic/sparse opening → settled, composed
ending), so the first frame and last frame don't match. I checked this
by extracting stills, not by guessing. This means:
- I used the *settled, final* frame as the poster image for each, not
  the first frame — the first frame of system-flow is mid-motion-blur,
  which would have looked like a broken image to anyone with
  `prefers-reduced-motion` enabled, since the poster is the only thing
  they ever see.
- With `loop` enabled, the video will still visibly "jump" back to the
  chaotic opening every 8 seconds during actual playback. This is
  inherent to the source files — I don't have video-editing tools to
  smooth that transition, only ffmpeg for trimming/frame extraction. If
  you want a genuinely seamless loop, that likely needs the original
  video source re-exported with a proper loop point, or I can look at
  trimming the chaotic opening off entirely if you're fine with the clip
  starting mid-motion instead of at frame 0.

**Technical implementation:** built a reusable `CinematicVideo` component
— doesn't mount the `<video>` element until it's about to scroll into
view (IntersectionObserver), respects `prefers-reduced-motion` by
showing the poster instead of playing, fixed `aspect-video` container
with `object-cover` so the 16:9 source is never stretched at any
breakpoint, no visible browser control chrome.

## On the "DStarix Techno" document

One of the two master-task docs was written as if I have DStarix's
actual codebase and should be improving *their* site. I don't have
DStarix's code — only yours. Treated it as a template where the company
name wasn't swapped, and applied its actual substance (video-integration
methodology, alignment philosophy) to VertexData's real site. Flagging
this so you know I caught it rather than silently built something
against the wrong brand.

## Files changed this session

`services/page.tsx`, `services/[slug]/page.tsx`, `Navbar.tsx`,
`Footer.tsx`, `page.tsx`, `layout.tsx`, `globals.css`,
`VertexLogo.tsx` (rewritten), new: `CinematicVideo.tsx`,
`app/icon.png`, `app/apple-icon.png`, plus `public/logo/` and
`public/videos/` asset folders.
