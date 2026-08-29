# Services pages — alignment pass

Scope: `src/app/services/page.tsx` (the long-scroll listing of all 10
services) and a read-through audit of `src/app/services/[slug]/page.tsx`
(the individual service detail template) + `src/app/services/layout.tsx`.
Only `page.tsx` needed changes — the `[slug]` template and layout were
already solid.

## Real bugs found and fixed (not style nitpicks)

1. **Floating hero stat chips were stacking on top of each other.** Each
   chip object defined a `pos` field (`"top-8 left-0"`, `"top-1/2
   right-0"`, `"bottom-8 left-8"`) meant to scatter "Agents deployed" /
   "Models in prod" / "Uptime SLA" around the 3D orb — but `chip.pos` was
   never actually inserted into the className. All 3 chips rendered
   `absolute` with no position values, meaning they collapsed onto the
   same spot instead of surrounding the orb. Fixed by applying the field
   that was already there.

2. **Floating chips' animation glitched on every scroll.** The float
   animation's delay was `Math.random() * 2`, computed inline during
   render. Since this component's `activeNav` state updates every time
   scrolling crosses into a different service section, the whole hero
   re-renders on each of those updates — recalculating a fresh random
   delay each time, which restarts the CSS float animation mid-flight.
   Over a 10-service scroll, that's up to 9 visible animation jumps.
   Replaced with fixed stagger values (0s / 0.7s / 1.4s) — same visual
   effect, no re-render-triggered restarts.

3. **Container padding inconsistency** — the hero section and the sticky
   secondary nav both put `px-8` on their inner `max-w-screen-xl` div
   instead of the outer container, same pattern I found and fixed on the
   homepage's Trust Strip. Standardized to match the site-wide
   convention (padding on the outer element).

4. **Metric numbers used a flat `text-[5rem]`** (80px) in a card that,
   at the `md` breakpoint specifically (768px, where the layout is
   exactly 2 columns and tightest), has roughly 256px of inner width —
   close enough to the space "99.9%" needs at that size that it's not a
   comfortable margin. Converted to `clamp(2.75rem, 5.5vw, 5rem)`,
   matching the scaling convention already used everywhere else on the
   site for large display numbers.

5. **Hero visual was a flat 500px tall on all screens below `md`** —
   unnecessarily tall on a 320–414px phone where it stacks below already
   substantial hero text. Scaled it down responsively
   (340px → 420px → 600px across phone/large-phone/desktop).

## One value I couldn't verify with confidence

The sticky secondary nav pins itself at `top-[64px]` (updated from
`60px`) to sit directly under the main navbar without gap or overlap.
I traced the navbar's scrolled-state height by hand (12px padding top
and bottom, plus a ~40px content row from the "Book a call" button) to
get ~64px, but I don't have a live browser here to confirm the exact
rendered pixel height — font metrics vary slightly by system. Worth a
quick look on your end; if there's a few pixels of gap or overlap,
nudge this one value.

## Not changed

- `[slug]/page.tsx` — already used the right container pattern
  throughout, no stray random values, no unused fields. Left alone.
- `layout.tsx` — metadata only, nothing to fix.
- No other routes touched.
