# New logo (green, matching site theme) + new videos

## Logo — replaces the blue one, resolves the color-mismatch flag

The 2 new images you sent weren't quite a matched pair — they're
different geometric treatments of the V mark (image 1: flat, bold,
simple layering; image 2: detailed faceted/gem-cut style with the
wordmark already attached, in a vertical stacked layout). Handled it
like this:

- **Favicon / tiny sizes**: image 1's icon — simpler and bolder, holds
  up better at 16–32px than the faceted version's thin detail lines.
- **Navbar / footer lockup**: image 2's icon + wordmark, but
  *recomposited horizontally* — the source was a vertical/stacked
  layout (icon above text), which doesn't fit a wide, short navbar
  strip well. Cropped the icon and wordmark separately from the same
  source file (so their backgrounds match exactly, no seam) and
  composited them side by side using `sharp`. This is real pixels from
  your actual provided assets, just rearranged — not a redrawn logo.

This new logo is emerald green, much closer to the site's own
`#00e5b4` teal accent than the previous blue/cyan version — the color-
mismatch I flagged earlier is now resolved. Also updated the logo's
glow-pulse animation color to match (was set to blue to suit the old
logo).

Removed the old blue logo files entirely (`vertex-lockup.png`,
`vertex-icon.png`) — replaced, not kept as unused alternates.

## Homepage video — swapped, not added

Replaced `system-flow.mp4` with your new logo-assembly video, same
position (between Capabilities and the AI Solutions banner). Reasoning:
both videos covered similar ground (chaos resolving into a connected
structure), but the new one lands on an actual brand payoff — the
Vertex mark itself forming from scattered particles — instead of
staying abstract. Strictly more valuable in the same slot, so this was
a genuine improvement, not just "newest wins."

`intelligence-network.mp4` is untouched, still in its slot between
Process and Industries — kept for visual variety since it's a different
composition than the new one.

`system-flow.mp4` itself wasn't deleted — still sitting in
`public/videos/` if you want to reuse it somewhere else later (a
specific service page, maybe), just not referenced by any page right
now.

## Process page video — staged, not built into a page yet

Copied `process-page.mp4` in and generated its poster. You now have
*two* candidate videos staged for the `/process` page whenever I build
it: this new one (scattered modules organizing into a connected system
— thematically a very literal match for a "how we work" page) and the
earlier `enterprise-architecture.mp4`. My plan is to use this new one
as the primary when I get to that page, since it fits the actual
concept more directly, and hold the other in reserve.

## Both new videos, technical notes (same method as before — real frame
extraction, not guessing)

Both show the same pattern as the first three: a clear
scattered/chaotic opening resolving into a fully-composed final frame,
so neither loops seamlessly, and I used the last frame (not first) as
the poster for the same reason as before — the first frame of the logo
video is a scatter of disconnected specks, which would've looked broken
as a static poster for anyone with reduced-motion enabled.

## Files changed

`VertexLogo.tsx`, `globals.css` (glow color), `page.tsx` (video
section swap), `src/app/icon.png` + `apple-icon.png` (regenerated),
plus new files in `public/logo/` and `public/videos/`.
