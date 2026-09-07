# Motion Inventory

Every animation on the site, what it does and why it exists. Motion is scroll-driven and
directional wherever possible, so it encodes meaning rather than decorating.

## Continuous / ambient

| Element | Motion | Detail |
|---|---|---|
| Hero background | `liquid-gradient` shader | Blue-only palette, speed 0.09, grain dither. **Reacts to the cursor** (push 0.6, radius 0.9, stretch 0.3, persistence 0.85) |
| Hero glow orbs | Mirror loop + parallax | Left orb 9s, right 11s, drifting on opposite axes at 128% / 84% scroll speed |
| Live dots | Mirror loop | Pill dot, console dot, comparison header dot, dossier chip dot — 1.0–1.1s opacity + scale pulse |
| Capability band | Ticker | Velocity 34, slows to 30% on hover, edge-faded with an alpha mask |
| Dossier scan line | Loop | Gradient hairline sweeping 430px every 3.4s with a 1.4s rest |
| Contact floats | Mirror loop | Three glass shapes, 9s / 11s / 13s, each with rotation drift |
| Section glows | Parallax | Background glows at 108–118% scroll speed so they lag the content |

All looping effects use `pauseOffscreen` so nothing animates outside the viewport.

## Entrance

| Element | Trigger | Motion |
|---|---|---|
| Hero headline lines 1–2 | On mount | Character-by-character reveal, 40px rise, 13px blur, staggered 0.08s / 0.26s |
| Hero headline line 3 | On mount | Block reveal — gradient fills cannot combine with character reveals |
| Hero pill / sub / CTAs / trust | On mount | Sequenced 0.7s → 1.1s, CTAs stagger 0.09s |
| Section eyebrows | In view | 14px rise |
| Section headlines | In view | 30px rise, spring 0.9s |
| Funnel beams | In view | 26px rise + 0.96 scale, staggered 0.11s down the funnel |
| Conversion chips | In view | 8px rise, interleaved with the beams |
| Metric / stage / capability cards | In view | 30–42px rise + slight scale, staggered by column or index |
| Comparison table | In view | 40px rise as one unit |
| Dossier + contact cards | In view | 46–50px rise + scale, spring 1s |

## Interaction

| Element | Motion |
|---|---|
| Primary button | Lift 3px, scale 1.02, glow expands to 52px blue spread; press scales to 0.97 |
| Ghost button | Lift 3px, glass brightens, deep shadow |
| Funnel beams | Scale 1.012 and glow intensifies on hover |
| All cards | Lift 6–7px, glass brightens, accent-coloured shadow blooms |
| Nav / footer links | Colour transition to white, 0.25s |
| Mobile drawer | Variant switch between Phone and Phone Open, spring 0.3s |
| Form submit | Default → Pending → Success / Error variants |
| Text selection | Blue highlight with white text |

## Performance notes

- Only transform, opacity, filter and background-colour are animated — no layout thrash.
- One shader on the page (Framer's limit and a deliberate performance ceiling).
- Springs are used for entrances and interactions; tweens for ambient loops.
- On mobile the contact floats are hidden and the hero orbs are scaled down.

## Caveat

Motion was configured and the static output verified at every breakpoint, but scroll and
hover behaviour can only be judged live. The one interaction that could not be
verified programmatically is the **mobile drawer tap** — Framer's tap gesture ignores
synthetic events. Confirm it on a real device.
