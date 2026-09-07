# Homepage Alignment Pass

## Scope
This pass intentionally focuses on the homepage layout foundation rather than completing unfinished pages.

## Changes
- Added a shared `.site-container` layout primitive with a consistent 1280px content boundary and responsive gutters.
- Moved homepage section gutters into the shared container instead of repeating `px-8` on individual full-width sections.
- Standardized homepage, navbar, and footer content boundaries.
- Added `min-width: 0` safeguards to major grid containers to prevent flex/grid children from forcing horizontal overflow.
- Preserved existing content, colors, components, routes, animations, and page structure.
- Did not redesign or complete the individual service/detail pages.

## Next phase
After visual approval of the homepage, use its container, spacing, typography, card, button, and responsive patterns as the foundation for the service pages.
