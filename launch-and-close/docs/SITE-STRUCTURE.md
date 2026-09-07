# Site Structure

One page, nine sections plus footer, on a shared layout template.

```
Home  (/)
│
├── Layout template "Site Shell"
│   ├── Navigation        sticky, z-index 9
│   └── Footer            glow · 3 columns · giant wordmark · legal bar
│
└── Page sections                                   anchor        CMS
    1. Hero               shader + parallax + reveal  #hero        funnel-stages
    2. Capability band    marquee                     —            —
    3. The Funnel         narrowing beams             #funnel      (hand-authored)
    4. Proof              4 metric cards              #proof       —
    5. Process            sticky column + 5 stages    #process     (hand-authored)
    6. Capabilities       asymmetric 3-col grid       #capabilities (hand-authored)
    7. Why Us             illuminated comparison      #why         comparison-rows
    8. Dossier            checklist + document card   #dossier     dossier-points
    9. Contact            motion type + glass form    #contact     —
```

## Section detail

### 1. Hero
Layered back-to-front: `liquid-gradient` shader (cursor-reactive) → scrim → vignette →
two parallax glow orbs → content. Headline is three lines; the first two reveal
character-by-character with blur, the third carries a gradient and rises as a block
(Framer cannot combine a gradient fill with a character reveal on the same node).
Ends with a glass console card showing the live pipeline via a CMS repeater.

### 2. Capability band
A marquee (`ticker`) of eight service phrases, duplicated so the loop is seamless.
Edges fade via an alpha mask. Acts as the transition from hero into the funnel.

### 3. The Funnel — the signature visual
Five beams at 100% / 82% / 64% / 46% / 33% width, centred so the silhouette narrows.
Colour *intensifies* as the funnel narrows, so the final "Dossiers Delivered" beam is
the brightest object in the section — the payoff. Conversion chips sit between beams.
On mobile all beams go full width; the intensity ladder preserves the story.

### 4. Proof
Four glass cards in a 4-up grid (2-up tablet, stacked mobile). Icon pinned top,
metric and copy anchored to the bottom edge, accent glow bleeding from a corner.

### 5. Process
Two columns. The left column is `position: sticky` and holds the eyebrow, headline and
a numbered spine listing all five stages. The right column scrolls five stage cards past
it. Below 1200px the sticky column unsticks and stacks above the cards.

### 6. Capabilities
A 3-column grid with three cards spanning two columns, producing an alternating rhythm:
`[01 wide][02] · [03][04 wide] · [05][06 wide]`. Wide cards lay out horizontally with a
larger icon tile; narrow cards stack vertically. On tablet the grid drops to two columns
and card 06 narrows to one so it pairs with 05 instead of orphaning it.

### 7. Why Us
A single CMS repeater renders a three-column table. The third cell of every row — plus the
header — carries a blue fill, so stacking the rows produces one continuous illuminated
column. On mobile each row becomes a stacked trio: label, dim "typical", illuminated "ours".

### 8. Dossier
Split layout: CMS checklist on the left, a document mockup on the right with a looping
scan line. The card is clearly chipped **Sample** — its contents are illustrative.

### 9. Contact
Oversized two-line headline (character reveal + gradient), three floating glass shapes on
independent loops, then a two-panel card: reassurance panel on a blue tint, form on the right.

## Responsive

| Breakpoint | Range | Key changes |
|---|---|---|
| Desktop | ≥1200px | Full layout, 1200px rail, sticky process column |
| Tablet | 810–1199px | Grids 4→2 and 3→2, process unsticks, contact card stacks |
| Mobile | <810px | Nav → drawer, funnel beams full width, comparison rows stack, floats hidden |

Verified on the live site: no horizontal overflow at 376px or 1280px.
