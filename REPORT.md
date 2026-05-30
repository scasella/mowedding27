# Concept C — "Quiet Editorial: the Aegean, set in whitespace"

A complete, standalone static wedding site for **Meghan Ghosh & Owen Donnelly**
(Friday, June 18, 2027 · Whitehouse Station, NJ). Built from the design review as
the panel's highest visual-craft direction. Entry point: **`index.html`**.

---

## What I built

Eight fully-designed, navigable pages sharing one header/footer, one stylesheet, and
one small progressive-enhancement script. No build step — it runs by opening
`index.html`.

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Single full-bleed establishing-shot hero -> facts ribbon -> Welcome/Facts/RSVP -> "The Easiest Yes" story with pull-quote -> one fresh image -> exit-ramp |
| Schedule | `schedule.html` | Editorial timeline (Thu arrival -> welcome drinks -> ceremony -> cocktails -> dinner & dancing -> send-off -> Sat breakfast) + dress code |
| Travel | `travel.html` | Newark/EWR + drive times, alt airports, "rent a car," arrival guidance, hotel-block rows with booking links, things-to-do |
| Registry | `registry.html` | "Send Us Back to the Aegean" fund **up top** -> beautiful objects first -> utilitarian items lower -> store links |
| Wedding Party | `wedding-party.html` | Warm bios paying off the story's cast (Sophia, Edie, the co-conspirators) |
| Gallery | `gallery.html` | Two-act "Greece -> Home" arc as an art-directed asymmetric grid |
| FAQs | `faqs.html` | Grouped, high-frequency-first; the home of the rationed two-voice asides |
| RSVP | `rsvp.html` | Real form (name, email, attending, party size, meal, song, note) + pre-open dated promise + JS success state |

Supporting files: `assets/css/site.css` (the whole design system), `assets/js/site.js`
(sticky-header hairline, mobile nav, scroll-reveal, RSVP handler -- all reduced-motion aware).

---

## The concept interpretation

The brief's mandate was *subtract, don't add*: magazine-grade minimalism where the
white space **is** the design and typography + imagery carry the polish. I treated the
whole site as a single quiet travel-magazine feature about one couple.

- **One typographic system, used with discipline.** Cormorant Garamond (display:
  wordmark, names, headings, the date, pull-quotes) against Inter (body/UI). Two
  typefaces, period.
- **Whitespace as material.** Generous section rhythm (clamp 76-164px), a controlled
  ~60-64ch measure on prose, hairline rules instead of boxes, almost no ornament.
- **Cardless, image-led composition.** No card-grid soup, no glassy gradients, no
  drop-shadow overload, no center-everything. Sections, columns, media blocks, and
  full-bleed plates do the work. The single decorative flourish is a recurring
  Cormorant ampersand mark (footer, gallery act-divider).
- **The Aegean accent is the organizing move.** `#1E5F8C` is the wordmark, the
  ampersand, every heading accent, every link, the active nav, the RSVP pill, the
  pull-quote -- "the color of the words is the color of the place he proposed."
- **Hand-built in-palette SVG art.** Since the real photos aren't in hand, every image
  slot is a bespoke duotone Cycladic/NJ scene in the concept palette (blue-domed
  church, sea horizons, whitewashed houses, a country road, figures at the cliff),
  each with a bracketed caption marking the real photo that belongs there.

### Motion (restrained, purposeful, reduced-motion-safe)
1. A quiet staggered fade/rise on the hero (eyebrow -> names -> facts).
2. A slow ~30s "settle" scale on the hero art.
3. Scroll-reveal (IntersectionObserver) that fades sections up as they enter.

All three collapse to instant/visible under `prefers-reduced-motion: reduce`.

---

## How it maps to the review's non-negotiable fixes

1. **Add RSVP** -- Real `rsvp.html` form (all requested fields) + rightmost nav slot
   (an outline pill) + a primary CTA in the Home Welcome block. Pre-open copy verbatim:
   "RSVPs open early 2027 -- for now, hold Friday, June 18."
2. **Surface who/when/where above the fold** -- The hero is intentionally shorter than
   full-screen, and a dark **facts ribbon** ("Friday, June 18, 2027 / Whitehouse
   Station, New Jersey / Evening, into the night") sits immediately beneath it, visible
   on the first mobile screen. The weekday is always rendered.
3. **Retire sage, adopt Aegean blue** -- `#1E5F8C` primary throughout; sage appears
   nowhere. Deep harbor navy `#103A52` is the AA fallback for small labels/kickers.
4. **"Send Us Back to the Aegean" fund** -- Pulled to the **top** of the Registry as a
   split media/copy block with a church-dome image slot and the suggested voiced copy.
5. **Hero that builds** -- A single wide establishing shot (cleanest, most mobile-safe
   per the review's own recommendation). The proposal becomes a payoff in the Gallery.
6. **Photography is the brand thread** -- Full-bleed plates and image slots on every
   page; zero florals. In-palette SVG placeholders stand in until real photos arrive.
7. **Voice as a system** -- The (Meghan:)/(Owen:) two-voice aside is rationed hard:
   only on FAQs/Schedule tone, never on the date, masthead, or RSVP button. Gold lines
   protected verbatim. Story polished per section 08 (possessives, contractions, Edie
   named early, retitled "The Easiest Yes").
8. **Accessibility** -- Semantic landmarks, skip link, labeled fields + fieldset/legend,
   visible on-brand focus rings, alt/aria-label on every SVG, aria-current nav,
   aria-live form success, reduced-motion honored. **AA contrast verified (computed):**
   Aegean on white 6.84:1, harbor on white 12.0:1, body ink 19.3:1, secondary 6.8:1,
   caption ink-45 5.05:1; terracotta is decorative-only with a darkened text variant
   (5.12:1). No blue-on-navy text anywhere.

---

## Key design decisions

- **Single-image hero, mobile-first.** Desktop: a full-bleed cinematic plate. Mobile: a
  clean vertical stack (full scene -> dark names plate -> facts), SVG right-anchored
  (xMaxYMid slice) so the church + figures survive a portrait crop.
- **A real grid, not soup.** Gallery = 12-col asymmetric (wide->tight per act); Registry
  & Wedding Party = auto-fill object/portrait grids; Travel = row-based stay blocks; all
  collapse sensibly at <=780px.
- **Hairlines over boxes** for exit-ramp, fact lists, timeline, FAQ, and stays.
- **Engineering note:** an early version animated a CSS transform:scale on an inner SVG
  <g>, which leaked intrinsic size into Chrome's layout viewport (horizontal overflow).
  Fixed by moving the animation onto the SVG element inside an overflow:hidden container
  and setting svg{overflow:hidden} globally -- now zero horizontal overflow.

---

## Validation (headless Chrome, per the brief)

Screenshotted and Read every key page at desktop 1440w and mobile (Chrome's headless
layout floors at ~500px, so mobile validated at 500w; 414w canvas also checked),
iterating ~3 rounds:

- Round 1 caught the SVG-transform layout-overflow bug and a broken mobile hero stack ->
  rewrote the hero CSS into an unambiguous mobile vertical stack + fixed SVG overflow.
- Round 2 computed all palette contrast ratios -> hardened ink-45 and added a darker
  terracotta-ink so every text use clears AA-normal.
- Round 3 verified the full home flow, RSVP (desktop + mobile), Registry, Schedule,
  Travel, Wedding Party, Gallery, FAQs, the mobile-menu open state, and a clean JS console.

Screenshots taken (desktop 1440 + mobile): Home, RSVP, Registry, Schedule, Travel,
Wedding Party, Gallery, FAQs, hero close-up (2x DPI), and mobile-menu open state.

**Entry point:** index.html
