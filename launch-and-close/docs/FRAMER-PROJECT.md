# Framer Project Notes

- **Live site:** https://adaptable-broccoli-987319.framer.app
- **Editable project:** https://framer.com/projects/Launch-and-Close--CjptpFFJ7tsNAUNTzVc1-apQbk
- **Fonts:** Clash Grotesk (Fontshare) · IBM Plex Mono (Google Fonts)

The Framer project is the **only editable source**. Everything in this archive is either a
build output (`site/`) or documentation of what the project contains.

---

## Why there is no source code in this archive

Framer does not export a published site as an editable HTML/CSS/JS project. There is no
"eject to code" for a design-built site. What `site/` contains is the **published build**:
minified React modules, Framer's runtime, and a 185KB inline stylesheet Framer generated.
It runs, but it is not a codebase you would maintain by hand.

If you need a genuinely maintainable codebase, the site has to be rebuilt in a framework —
`design-system/design-tokens.css`, `content/cms/*.json` and `docs/SITE-STRUCTURE.md` are
written to make that a mechanical job rather than a redesign.

---

## Known limitations, carried forward

### 1. Two CMS collections are not wired to the page
`process-stages` and `capabilities` exist in the CMS with full content, but the Process and
Capabilities sections are hand-authored rather than CMS-driven.

**Why:** Framer's API accepts per-item icon values on a CMS collection and reports success,
but the values never persist — every row falls back to the field's initial value. A repeater
therefore cannot give each item its own icon. Since the brief required each service to have a
distinct visual identity, those two sections were built as explicit cards.

**Consequence:** editing those two collections will not change the page. Either delete them,
or convert the sections to repeaters and accept one shared icon across all items.

The other three collections (`funnel-stages`, `comparison-rows`, `dossier-points`) **are** live
and editing them updates the site.

### 2. Component variants do not switch per breakpoint inside a layout template
Setting a component instance's variant on a layout-template breakpoint stores correctly but
does not apply in the published output. This shipped a broken mobile nav on the first publish.

**Workaround in place:** the layout template holds three navigation instances — one locked to
each variant — toggled with `visible` per breakpoint. If you add breakpoints, replicate this
pattern rather than setting the variant property.

### 3. No Privacy Policy or Terms pages
Those footer links were removed rather than publishing unreviewed legal text under a real
business name. Add both pages, then restore the links in the footer legal bar.

### 4. The dossier card contains invented data
Labelled "Sample" on the page. Replace with a redacted real briefing. See `content/COPY-DECK.md`.

### 5. "Made in Framer" badge
Bottom-right of the live site. Removed by upgrading the Framer project's plan.

---

## Editing checklist

| Task | Where |
|---|---|
| Funnel numbers, comparison rows, dossier checklist | Framer CMS |
| Process stages, capabilities | Directly on the canvas (not CMS) |
| Colours, type scale | Framer style panel — mirrored in `design-system/` |
| Navigation, footer | Layout template "Site Shell" |
| Buttons | "Button" component — Primary and Ghost variants |
| Form submission | The form posts through Framer; configure the destination in Framer's form settings |

## Form destination

The contact form is a native Framer form with pending / success / error states wired up.
**Confirm where submissions are delivered** in the Framer editor before driving traffic to it —
an unconfigured form will accept input and discard it.
