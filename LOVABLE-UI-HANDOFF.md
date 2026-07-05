Restyle my AI Hub exactly as specified below. Change only the look - no function, apps, or data change. Mobile must be flawless.

# Design Brief — "Paper Study" (AgentHub, mobile-first)

**Concept:** a writer's desk in app form. Cream paper surfaces, near-black ink text, one burnt-sienna accent used sparingly — like a red editor's pen. Quiet, warm, and effortlessly readable on a phone in any light.

## Theme tokens — final values

**Light (primary theme):**
```css
--bg:      #FAF6EF;   /* warm cream page */
--surface: #FFFDF8;   /* card: brighter paper */
--txt:     #241F1A;   /* soft ink, not pure black */
--mut:     #6E6257;   /* faded pencil */
--accent:  #C2410C;   /* burnt sienna — links, active nav, primary buttons */
--soft:    #F6E7DA;   /* accent wash — chips, active backgrounds, highlights */
--line:    #E8DFD2;   /* hairline borders */
--navbg:   rgba(250,246,239,.94);  /* frosted nav, add backdrop-filter: blur(12px) */
--shadow:  0 1px 2px rgba(60,42,24,.07), 0 8px 24px rgba(60,42,24,.10);
```

**Dark (lamplight, not cold):**
```css
--bg:      #17130F;
--surface: #201A14;
--txt:     #EDE5D8;
--mut:     #A29682;
--accent:  #E8804D;   /* sienna warmed up for dark contrast */
--soft:    #3A2417;
--line:    #322A20;
--navbg:   rgba(23,19,15,.94);  /* frosted, blur(12px) */
--shadow:  0 1px 2px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.5);
```

## Typography
- **Titles:** Fraunces (Google Fonts), weight 600, `soft` optical axis if available. Card titles 24px/1.25, section headers 19px, page title 28px.
- **Body & UI:** Inter, weight 400 (500 for buttons/labels). Body 17px/1.6, metadata and timestamps 13.5px in `--mut`.
- Never below 13px anywhere. Line length on desktop capped at ~68ch.

## Shape, spacing, density
- **Radius:** 10px cards and buttons, 8px inputs and chips, full pill only for small count badges.
- **Spacing:** roomy, reading-first. 24px card padding, 16px screen side-gutters, 14px between cards, 32px between sections. 8px base grid.
- **Touch:** every tappable element ≥ 44px tall; primary buttons 52px; bottom nav items ≥ 48px with label under icon.
- **Borders over shadows for hierarchy:** cards get `1px solid var(--line)` plus the soft `--shadow`; no heavy elevation stacking.

## Background & texture
- Flat `--bg` — no gradients, no imagery. The cream color *is* the texture.
- Optional: a single 1px `--line` rule under the page title, like a ruled margin.

## Motion
- Gentle and paper-like: 200ms ease-out for all transitions. New cards fade in and settle upward 6px. Tap feedback: background tint to `--soft` (no scale-jumps). View changes: simple 200ms cross-fade. Respect `prefers-reduced-motion`.

## Mobile rules (≤760px — the priority)
- Single column, full-width cards, thumb-reachable primary actions in the lower half of the screen.
- Sticky nav on `--navbg` with blur; content scrolls under it.
- No horizontal scrolling anywhere; long titles wrap, never truncate mid-word.
- Test at 375px width and 16px base zoom; both themes must pass WCAG AA for body text (these values do).

Change only styling - theme tokens, stylesheet, fonts, spacing, and layout look. Do not add, remove, rename, or re-wire any app, view, button, or data source. Function stays identical. It must be flawless and fully usable on a phone (<=760px) - mobile is the priority.
