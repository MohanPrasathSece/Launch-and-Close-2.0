# Copy Deck

Every word on the site, in order. Copy was taken from the reference site
(`launch-and-close-redesign.vercel.app`) and cut by roughly half — the removed
information was converted into diagrams, counters and the pipeline visualisation
rather than deleted outright.

List-style content (funnel, process, capabilities, comparison, dossier) lives in
`content/cms/` as JSON and CSV.

---

## Navigation

| Element | Text | Target |
|---|---|---|
| Wordmark | Launch & Close | `/` |
| Link | How It Works | `#process` |
| Link | What You Get | `#capabilities` |
| Link | Why Us | `#why` |
| Link | Dossier | `#dossier` |
| Button | Book a Call | `#contact` |

Mobile drawer repeats the four links plus **Book a Strategy Call**.

---

## 1. Hero

- **Eyebrow:** B2B Pipeline, Fully Managed
- **Headline:** From targeted ads / to qualified / **meetings.**  *(third line carries the gradient)*
- **Sub:** We run the campaigns, qualify every lead by hand, book the meeting and hand you the briefing. You walk in ready to close.
- **Primary CTA:** Book a Strategy Call → `#contact`
- **Secondary CTA:** See How It Works → `#process`
- **Trust strip:** Human BANT on every lead · Your own GoHighLevel account · Dossier before every call
- **Console card:** `LIVE PIPELINE` / `Trailing 30 days`, then the five funnel stages

---

## 2. Capability band (marquee)

Facebook Ads · Instagram Ads · ICP Targeting · Human BANT Qualification ·
GoHighLevel CRM · Meeting Scheduling · Pre-Call Dossiers · Call Recordings

*(the set is duplicated in the DOM so the loop is seamless)*

---

## 3. The Funnel

- **Eyebrow:** The Funnel
- **Headline:** Only qualified meetings reach your calendar.
- **Sub:** Twelve thousand people see the campaign. Thirty-eight of them end up in your diary — every one scored by a human first.

Stages and conversion rates: `content/cms/funnel-stages.json`.
Conversion labels between beams: 3.9% qualify → 18.9% pass BANT → 41.3% book → 100% briefed.

---

## 4. Proof

- **Eyebrow:** Why It Works
- **Headline:** Proof, not promises.
- **Sub:** Four things that separate a real pipeline from a spreadsheet of leads.

| Metric | Qualifier | Body |
|---|---|---|
| Meetings | not clicks | We measure attended, qualified meetings. Never impressions or raw lead counts. |
| BANT | every time | Budget, Authority, Need and Timeline — assessed by humans on every single lead. |
| Zero | black boxes | Your own GoHighLevel account. Every lead, call and pipeline stage stays visible. |
| $8.2B | market by 2035 | Positioned at the premium end of a fast-growing B2B lead generation market. |

---

## 5. Process

- **Eyebrow:** The Process
- **Headline:** End-to-end, handled for you.
- **Sub:** Five stages. One system. Zero unqualified calls.

Five stages with tags: `content/cms/process-stages.json`.

---

## 6. Capabilities

- **Eyebrow:** What You Get
- **Headline:** The full-service stack.
- **Sub:** Everything your sales team needs so they can focus on one thing — closing.

Six capabilities: `content/cms/capabilities.json`.

---

## 7. Why Us

- **Eyebrow:** Why Launch & Close
- **Headline:** We don't measure clicks. We measure closes.
- **Sub:** Most agencies ship raw leads and call it done. You still have to qualify them, chase them and work out if they were ever worth your time.
- **Closing line:** Built for SMB and mid-market B2B teams that need consistent, high-quality pipeline without hiring an internal SDR function.

Comparison table: `content/cms/comparison-rows.json`.

---

## 8. Dossier

- **Eyebrow:** Sample Dossier
- **Headline:** Walk into every call already ahead.
- **Sub:** A structured briefing before every meeting — the exact context your team needs to skip discovery and start closing.

Checklist: `content/cms/dossier-points.json`.

### Sample document card — ILLUSTRATIVE DATA

> **This content is invented for demonstration and is labelled "Sample" on the page.**
> Replace it with a redacted real briefing before using the site for sales.

- Header: `Pre-Call Dossier` · chip `Sample`
- Prospect: **Operations Director** — Industrial manufacturing · 120 staff
- Budget: $40–60k / year · Authority: Signs with CFO · Timeline: Q3 rollout
- Pain points: Manual scheduling · No pipeline visibility
- Footer: 18-min qualification call attached in GoHighLevel

---

## 9. Contact

- **Eyebrow:** Get Started
- **Headline:** Ready to fill your calendar / **with deals worth closing?**
- **Sub:** Tell us where you sell and who you sell to. We will map the pipeline and show you exactly how the meetings get booked.
- **Panel heading:** Talk to a human.
- **Panel copy:** No pitch deck. A short call to understand your ICP, your offer and what a qualified meeting actually looks like for you.
- **Reassurance:** No obligation · 20-minute call · Pipeline map included
- **Email:** hello@launchandclose.com

**Form fields:** Name · Work email · Company · Website · "What are you selling, and to whom?"
**Submit:** Request a Strategy Call → states: Sending / Request Received / Please Try Again
**Fine print:** We reply within one business day.

---

## 10. Footer

- **Blurb:** Qualified, calendar-ready meetings with a full briefing attached. You just close.
- **Email:** hello@launchandclose.com
- **Navigate:** How It Works · What You Get · Why Us · Sample Dossier
- **Get Started:** Twenty minutes. We map the pipeline. → Book a Strategy Call
- **Oversized wordmark:** LAUNCH & CLOSE (fades top-to-bottom)
- **Legal bar:** © 2026 Launch & Close. All rights reserved. · hello@launchandclose.com · Back to top

> **No Privacy Policy or Terms page exists.** Those links were deliberately left out
> rather than shipping unreviewed legal text. See `docs/FRAMER-PROJECT.md`.
