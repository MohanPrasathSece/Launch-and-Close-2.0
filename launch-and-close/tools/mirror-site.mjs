// Regenerates ../site/ from the live Framer site.
// Usage:  cd tools && node mirror-site.mjs        (requires Node 18+)
// Downloads the published HTML, its JS modules and fonts, rewrites module
// specifiers to local paths, and strips the Framer edit bar + analytics beacon.

import fs from "node:fs/promises"
import path from "node:path"

const ORIGIN = "https://adaptable-broccoli-987319.framer.app"
const OUT = path.resolve("../site")

const seen = new Map()          // absolute url -> local relative path (from site root)
const queue = []

const localFor = (url) => {
  const u = new URL(url)
  const base = path.posix.basename(u.pathname)
  if (/\.mjs$/.test(base)) return `assets/js/${base}`
  if (/\.(woff2?|ttf|otf)$/.test(base)) return `assets/fonts/${base}`
  if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(base)) return `assets/img/${base}`
  if (u.hostname === "fonts.gstatic.com") return `assets/fonts/${base}`
  return `assets/misc/${base || "file"}`
}

const enqueue = (url) => {
  if (!/^https?:\/\//.test(url)) return null
  const clean = url.split("#")[0]
  if (seen.has(clean)) return seen.get(clean)
  // only mirror asset hosts we control/serve
  const host = new URL(clean).hostname
  if (!["framerusercontent.com", "fonts.gstatic.com"].includes(host)) return null
  // must point at an actual file, not a bare directory (e.g. preconnect stubs)
  if (!/\.[a-z0-9]{2,5}$/i.test(new URL(clean).pathname)) return null
  const local = localFor(clean)
  seen.set(clean, local)
  queue.push(clean)
  return local
}

const fetchBuf = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept": "*/*" } })
      if (!r.ok) throw new Error(`${r.status} ${url}`)
      return Buffer.from(await r.arrayBuffer())
    } catch (e) { if (i === 2) throw e; await new Promise(s => setTimeout(s, 400 * (i + 1))) }
  }
}

const ASSET_RE = /https:\/\/(?:framerusercontent\.com|fonts\.gstatic\.com)\/[^"'`)\s\\]+/g

// HTML: rewrite every asset reference.
const rewriteHtml = (text) =>
  text.replace(ASSET_RE, (m) => { const l = enqueue(m); return l ? "./" + l : m })

// JS: rewrite ONLY real module specifiers (import/export ... from "url", import("url")).
// Framer's runtime builds asset URLs with `new URL(...)`, which throws on a relative
// string, so every other absolute URL must be left exactly as-is.
const rewriteJs = (text, fromLocal) => {
  const up = "../".repeat(fromLocal.split("/").length - 1)
  const spec = /((?:\bfrom|\bimport)\s*\(?\s*)(["'])(https:\/\/framerusercontent\.com\/[^"']+\.mjs)\2/g
  let out = text.replace(spec, (_m, lead, q, url) => {
    const l = enqueue(url)
    return l ? `${lead}${q}${up}${l}${q}` : `${lead}${q}${url}${q}`
  })
  // Neutralise the Framer edit-bar bootstrap: it dynamically imports framer.com at runtime,
  // which would make the offline archive phone home. Swap it for a no-op component.
  out = out.replace(
    /await\s+import\(\s*[`"']https:\/\/framer\.com\/edit\/init\.mjs[`"']\s*\)/g,
    "{createEditorBar:()=>()=>null}",
  )
  return out
}

// ---------- 1. index.html ----------
let html = await (await fetch(ORIGIN)).text()

// strip Framer editor bootstrap + analytics beacon so the archive is self-contained and does not phone home
const before = html.length
html = html.replace(/<script[^>]*src="https:\/\/events\.framer\.com[^"]*"[^>]*>\s*<\/script>/g, "<!-- analytics beacon removed for offline archive -->")
html = html.replace(/<script[^>]*>[^<]*framer\.com\/edit\/init\.mjs[^<]*<\/script>/g, "<!-- framer editor bootstrap removed for offline archive -->")
html = html.replace(/https:\/\/framer\.com\/edit\/init\.mjs/g, "")
const stripped = before - html.length

html = rewriteHtml(html)

// ---------- 2. walk the asset graph ----------
let processed = 0
const failed = []
while (queue.length) {
  const url = queue.shift()
  const local = seen.get(url)
  const dest = path.join(OUT, local)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  try {
    const buf = await fetchBuf(url)
    if (/\.mjs$/.test(local)) {
      await fs.writeFile(dest, rewriteJs(buf.toString("utf8"), local), "utf8")
    } else {
      await fs.writeFile(dest, buf)
    }
    processed++
  } catch (e) {
    failed.push(`${url} -> ${e.message}`)
  }
}

await fs.mkdir(OUT, { recursive: true })
await fs.writeFile(path.join(OUT, "index.html"), html, "utf8")

const byKind = {}
for (const l of seen.values()) { const k = l.split("/")[1] ?? "root"; byKind[k] = (byKind[k] ?? 0) + 1 }
console.log(JSON.stringify({ assets: processed, byKind, strippedBytes: stripped, htmlBytes: html.length, failed }, null, 1))
