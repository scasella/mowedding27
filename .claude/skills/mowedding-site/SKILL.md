---
name: mowedding-site
description: >-
  Project playbook and gotchas for the mowedding27.com wedding site — an Eleventy (11ty)
  static site with a Decap CMS / DecapBridge editing layer, deployed via Netlify from GitHub.
  Use this whenever you touch this site's CSS (assets/css/site.css), Nunjucks templates
  (src/*.njk), content (content/*.json), or CMS preview templates (admin/preview.js) — and
  ESPECIALLY before verifying any visual or responsive change in the browser, because the
  obvious tools (window resize, headless screenshots) silently give wrong answers here. Also
  covers a CSS aspect-ratio/height-attribute trap, keeping the CMS preview in sync with the
  live templates, and the build/deploy loop. Check this before reaching for resize_window,
  headless Chrome, or editing preview.js on this project.
---

# Working on the mowedding27.com wedding site

Eleventy build + Decap CMS (email/password via DecapBridge) + Netlify auto-deploy. The
**setup and structure** are documented for humans in `DEPLOY.md` (one-time setup, file map,
deploy/rollback, verify commands) and `EDITING.md` (the couple's editing guide). Read those
for orientation. **This skill is the stuff those don't tell you** — the non-obvious traps
that cost real time.

Quick map:
- `assets/css/site.css` — all styling, one file
- `src/*.njk` + `src/_includes/` — page templates + the shared layout/header/footer
- `content/*.json` — editable content (what the CMS writes)
- `admin/preview.js` — hand-written CMS preview renderers that **mirror** the live templates
- `admin/config.yml` — Decap collections + DecapBridge auth
- build: `npm run build` → `_site/`; local preview: `npm run serve` (http://localhost:8080)

## Verifying visual / responsive changes — the tooling lies here

This is the big one. Several "obvious" ways to check a layout change silently give wrong
answers in this environment. Know them before you waste a dozen tool calls (we did):

- **`resize_window` (mcp__claude-in-chrome) does NOT resize the viewport.** It returns
  success, but `window.innerWidth` stays at the desktop width. You cannot test mobile
  breakpoints by resizing the MCP browser window.
- **Headless Chrome serves a STALE `site.css`.** A persistent shared Chrome process cache
  survives a fresh `--user-data-dir`, new ports, and cache-disable flags. Symptom: you edit a
  rule, rebuild, re-screenshot, and get a byte-identical image — two *different* CSS rules can
  render identically. Do not trust headless screenshots for CSS iteration on this machine.

**The reliable method: measure the real DOM in the interactive browser.** Open the page (live
or `localhost:8080`) in the MCP browser at its normal desktop width, inject the mobile rules
with `!important` plus a constrained `.shell`, and read computed values rather than eyeballing
a screenshot:

```js
// Simulate the ≤860px mobile layout at desktop width, then MEASURE.
var s = document.createElement('style');
s.textContent =
  '.shell{max-width:390px!important;padding-inline:24px!important}' +
  '.story-split{grid-template-columns:1fr!important}' +
  '.story-split__media{max-width:280px!important;justify-self:center!important}';
document.head.appendChild(s);
var el = document.querySelector('.story-split__media');
JSON.stringify({
  rect: el.getBoundingClientRect(),              // real position + size
  justifySelf: getComputedStyle(el).justifySelf, // did the rule actually win the cascade?
});
```

`getComputedStyle` + `getBoundingClientRect` are ground truth. They revealed a photo rendering
at 516×2000 (not 4:5) and confirmed a centered element had equal 31px gaps — both cases where
screenshots misled. **When something looks off, measure it; trust numbers over pixels.**

- **SPA navigation is flaky.** `scrollIntoView()` frequently resets to `scrollY 0`, and
  navigating entry→entry by URL hash (e.g. `…/entries/site` → `…/entries/home`) leaves a stale
  form + preview. Instead: `window.scrollTo(0, getBoundingClientRect().top + scrollY)` to
  reach a section, and open a CMS entry by **clicking it in the collection list**, not by
  hash-navigating between entries.
- **A full `/admin` reload logs the editor out.** The DecapBridge PKCE session does not
  survive a hard reload — it drops to the login screen. So don't full-reload `/admin` to pick
  up a new `preview.js`; push, wait for the Netlify deploy, and have the user re-log in (a
  fresh login fetches the new file). Within a session, move around by clicking (no reload).

## CSS trap: `aspect-ratio` on an `<img>` needs `height:auto`

The global reset is `img{max-width:100%;display:block}` — note there is **no `height:auto`**.
Images carry HTML `width`/`height` attributes (good for layout stability). But when an `<img>`
has both a width (e.g. `width:100%`) **and** an HTML `height` attribute, CSS `aspect-ratio` is
**ignored** — `aspect-ratio` only governs when one dimension is `auto` — so the image renders
at its full intrinsic height.

This is exactly why the "Our Story" photo rendered 516×2000 instead of a 4:5 crop. **Whenever
you rely on `aspect-ratio`/`object-fit` to crop an `<img>`, also set `height:auto`** — or fill
an aspect-ratio'd container with `position:absolute;inset:0;width:100%;height:100%` the way
`.person__media` and `.g-item img` already do. If a cropped photo suddenly shows its whole
height, this is the cause.

## CMS preview templates (`admin/preview.js`) drift from the live site

`admin/preview.js` renders each collection with hand-written `CMS.registerPreviewTemplate`
functions that **duplicate the live `src/*.njk` markup**. They are not generated — they mirror
the templates by hand, so they silently fall out of sync when you change a section.

- **Change a live section → update its renderer.** Example: when the pull-quote moved from a
  `.pullquote-block` inside the story section to a `.quote-film` video backdrop placed *after*
  the closing paragraph, the preview kept the old order and light styling until fixed by hand.
  After any structural template change, re-check the matching `render*`/template function.
- **Multi-file collections match templates by FILE name.** The `pages` collection holds two
  files, `site` and `home`; Decap matched the preview by file name, so they're registered by
  name (`registerPreviewTemplate("home", …)` and `("site", …)`) in addition to the collection.
  New multi-file collections need the same, or they fall back to an ugly default field dump.
- **The preview pane is narrow (<860px), so the site's mobile media queries apply inside it.**
  A change scoped to an id the preview's markup lacks (e.g. `#story`) won't show there; a
  change on a shared class will.
- **Images are placeholder boxes, not real `<img>`s** (the editor has no real photos), so
  img-only bugs like the `height:auto` trap above won't reproduce in the preview — verify
  those on the built site.
- **Run `node --check admin/preview.js` before every push.** A syntax error there breaks
  *every* preview pane, not just one.

## Build & deploy (full details in DEPLOY.md)

- `npm run build` → `_site/`; passthrough-copies the static dirs (`assets/` incl. `video/`,
  `photos/`, `florals/`, `admin/`) and `robots.txt`.
- Commit straight to **`main`** — the CMS commits there too, so `git pull --rebase origin main`
  before pushing to avoid clobbering an editor's change. End commit messages with the
  `Co-Authored-By: Claude …` trailer. Netlify auto-builds and publishes in ~1–2 min.
- **Confirm a deploy actually landed** (CSS/JS edits especially) by curling the live asset with
  a cache-buster, since the build is async:
  `curl -s "https://mowedding27.com/assets/css/site.css?cb=$(date +%s)" | grep -o '<your-rule>'`
- Leave intact: `robots.txt` `Disallow: /` (the site is intentionally no-indexed) and the
  pinned Decap version in `admin/index.html`. The 213 MB `engagement_video.mov` in the repo
  root is **gitignored on purpose** — never commit it; only the optimized `assets/video/*.mp4`
  ships.
