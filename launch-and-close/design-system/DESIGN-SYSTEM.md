# Design System

Extracted directly from the Framer project — these are the real values, not a description of them.
Machine-readable copies sit alongside this file (`colors.json`, `typography.json`, `design-tokens.css`).

## Colour

The palette is deliberately monochromatic. Blue is used as **light** (glows, gradients, borders),
never as flat paint. Depth comes from layered radial gradients, not shadows.

| Token | Value | Role |
|---|---|---|
| `Ink` | `rgb(5, 5, 5)` | Page base — every section sits on this |
| `Ink Raised` | `rgb(10, 12, 18)` | Slightly lifted surface |
| `Glass` | `rgba(255, 255, 255, 0.04)` | Default glass card fill (4% white) |
| `Glass Raised` | `rgba(255, 255, 255, 0.07)` | Hover / emphasis glass (7% white) |
| `Hairline` | `rgba(255, 255, 255, 0.09)` | Default 1px border |
| `Hairline Bright` | `rgba(255, 255, 255, 0.18)` | Emphasised border |
| `Blue` | `rgb(0, 87, 255)` | Primary accent |
| `Blue Electric` | `rgb(63, 169, 255)` | Live / active state, data highlights |
| `Blue Deep` | `rgb(0, 29, 255)` | Gradient end stop |
| `White` | `rgb(255, 255, 255)` | Primary text |
| `Grey` | `rgb(184, 188, 200)` | Body copy |
| `Grey Dim` | `rgb(113, 118, 138)` | Labels, captions, mono metadata |

### Gradients

| Name | Value | Used on |
|---|---|---|
| Primary | `linear-gradient(135deg, #007BFF 0%, #0038FF 55%, #001DFF 100%)` | Primary buttons, logo mark, avatar |
| Headline | `linear-gradient(96deg, #FFFFFF 0%, #7FC4FF 40%, #0057FF 100%)` | Gradient headline lines |
| Accent rule | `linear-gradient(90deg, rgba(63,169,255,0) 0%, #3FA9FF 100%)` | Eyebrow rules |

## Typography

Two families only. **Clash Grotesk** (variable, 200–700) carries display and UI;
**IBM Plex Mono** carries every label, metric caption and piece of metadata.

| Style | Family | Weight | Sizes (desktop / tablet / mobile) |
|---|---|---|---|
| `Display` | Clash Grotesk | 600 | default 92px / medium 62px / small 40px |
| `Display 2` | Clash Grotesk | 600 | default 68px / medium 48px / small 34px |
| `Heading` | Clash Grotesk | 600 | default 38px / medium 30px / small 25px |
| `Subheading` | Clash Grotesk | 500 | default 22px / medium 20px / small 18px |
| `Eyebrow` | IBM Plex Mono | 500 | default 11px |
| `Body` | Clash Grotesk | 400 | default 17px / medium 16px / small 15px |
| `Body Small` | Clash Grotesk | 400 | default 14px |
| `Metric` | Clash Grotesk | 600 | default 54px / medium 44px / small 36px |
| `Mono` | IBM Plex Mono | 400 | default 12px |
| `Nav Link` | Clash Grotesk | 500 | default 15px |
| `Button Label` | Clash Grotesk | 500 | default 15px |

Breakpoints: `default` ≥1200px · `medium` 810–1199px · `small` <810px.

## Components

| Component | Variants | Props |
|---|---|---|
| Button | Primary, Ghost | Title, Link, Icon |
| Submit Button | Default, Pending, Success, Error | Title |
| Navigation | Desktop, Tablet, Phone, Phone Open | — |

## Link styles

| Style | Default | Hover |
|---|---|---|
| Nav Link | `var(--token-eaf438de-96ab-46b6-815f-37a0f4bb95fe)` | `var(--token-a797b178-e000-4114-9165-3eb3b0202079)` |
| Footer Link | `var(--token-8d6b5b51-742e-49e8-8c12-c51be1fc9080)` | `var(--token-a797b178-e000-4114-9165-3eb3b0202079)` |
| Inline Link | `var(--token-fa615d05-0777-4a2f-848a-6a276d92e2dd)` | `var(--token-a797b178-e000-4114-9165-3eb3b0202079)` |

## Spacing & layout

- Content rail: **1200px** max width, centred; sections are full-bleed underneath it.
- Section rhythm: **150px** vertical padding desktop, 112px tablet, 80px mobile.
- Horizontal gutters: 40px desktop, 28px tablet, 20px mobile.
- Radii: 100px pills · 22px cards · 28px large panels · 12–16px chips and icon tiles.
