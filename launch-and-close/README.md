# Launch & Close — Website Archive

Premium B2B pipeline agency site: targeted ads → human BANT qualification → booked
meetings → pre-call dossier.

- **Live:** https://adaptable-broccoli-987319.framer.app
- **Editable source:** https://framer.com/projects/Launch-and-Close--CjptpFFJ7tsNAUNTzVc1-apQbk

---

## Read this first

**Framer cannot export a site as editable source code.** There is no "eject to code" for a
design-built Framer site, so this archive cannot contain a hand-maintainable codebase.

What it contains instead:

1. **`site/`** — the real published build, mirrored and rewritten to run offline. It renders
   the complete site including the animated shader background. It is minified build output,
   not source you would edit.
2. **Everything needed to rebuild it properly** — design tokens as CSS custom properties,
   all content as JSON/CSV, and section-by-section structural and motion documentation.

The Framer project remains the only place to *edit* the site.

---

## Structure

```
launch-and-close/
├── README.md                     ← you are here
│
├── site/                         Working offline copy of the published site
│   ├── index.html                Open via a local server (see below)
│   └── assets/
│       ├── js/     (7)           Framer runtime, React, Motion, page bundle
│       ├── fonts/  (15)          Clash Grotesk + IBM Plex Mono, self-hosted
│       ├── img/    (3)
│       └── misc/   (2)
│
├── design-system/
│   ├── DESIGN-SYSTEM.md          Palette, type scale, components, spacing
│   ├── design-tokens.css         Ready-to-use CSS custom properties
│   ├── colors.json               12 colour tokens
│   ├── typography.json           11 text styles with responsive sizes
│   └── link-styles.json
│
├── content/
│   ├── COPY-DECK.md              Every word on the site, in order
│   └── cms/                      5 collections as .json and .csv
│       ├── funnel-stages.*       (5)   ← live on the site
│       ├── comparison-rows.*     (6)   ← live on the site
│       ├── dossier-points.*      (5)   ← live on the site
│       ├── process-stages.*      (5)   ← content only, see FRAMER-PROJECT.md
│       └── capabilities.*        (6)   ← content only, see FRAMER-PROJECT.md
│
├── tools/
│   └── mirror-site.mjs       Regenerate site/ after you republish (node 18+)
│
├── docs/
│   ├── SITE-STRUCTURE.md         Section-by-section breakdown + responsive rules
│   ├── MOTION.md                 Full animation inventory
│   └── FRAMER-PROJECT.md         Project links, limitations, editing checklist
│
└── screenshots/
    ├── desktop/  tablet/  mobile/
```

---

## Running the offline copy

The page uses ES modules, so it needs to be served over HTTP — opening `index.html`
directly with `file://` will not work.

```bash
cd site && python -m http.server 8000
```

Then open http://localhost:8000. Verified working offline: all 8 sections render, both
custom fonts load locally, the shader canvas initialises, and there are no console errors
or failed requests.

The Framer editor bootstrap and the analytics beacon were stripped, so the archive does not
phone home.

---

## Rebuilding this in code

If you want a maintainable codebase, the pieces are here:

1. Import `design-system/design-tokens.css` — colours, gradients, type scale, radii, layout rail.
2. Load Clash Grotesk and IBM Plex Mono (already self-hosted in `site/assets/fonts/`).
3. Follow `docs/SITE-STRUCTURE.md` for layout and responsive behaviour.
4. Follow `docs/MOTION.md` for the animation spec — it maps cleanly onto Framer Motion.
5. Feed sections from `content/cms/*.json`.

---

## Before this goes to a client

- [ ] Confirm where the contact form delivers submissions (Framer form settings)
- [ ] Replace the invented sample dossier data
- [ ] Add Privacy Policy and Terms pages, then restore the footer links
- [ ] Tap the mobile menu on a real device — the one interaction not verifiable programmatically
- [ ] Remove the "Made in Framer" badge (plan upgrade)
- [ ] Point a custom domain at the site
