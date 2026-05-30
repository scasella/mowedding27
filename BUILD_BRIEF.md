# BUILD BRIEF — Meghan & Owen wedding website (rebuild from the design review)

You are building a **brand-new, standalone static website** for a real wedding, implementing the
recommendations in `megowen-wedding-design-review.html` (open it; the full panel data is in
`panel_result.json`). This is NOT the Zola site — you are free of Zola's limits, so you can build the
ambitious version the review could only gesture at. Ship a real, polished, navigable site.

---

## THE COUPLE & THE FACTS (use real content — never lorem ipsum)

- **Couple:** Meghan Ghosh & Owen Donnelly
- **Date:** **Friday, June 18, 2027** (always render the weekday — it's load-bearing for guest travel)
- **Location:** Whitehouse Station, NJ (Hunterdon County — rural; nearest major airport ≈ Newark/EWR)
- **The hook:** Owen flew **36 hours in secret** to a **Cycladic Greek island (Sifnos)** and proposed at
  **sunset** on a clifftop, with the blue-domed **Church of the Seven Martyrs** in the Aegean behind them —
  an entire island in on the surprise. She said *"the easiest yes of all time."*

### The love story (their real copy — include it, lightly polished per the review)
Original, then apply the review's polish: fix possessives, use contractions, name Edie early, split the
long first sentence, retitle the section **"The Easiest Yes."** Protect the gold lines verbatim:
*"I'm going to marry him. Five years later, here we are."* and *"It was the easiest yes of all time."*

> Meghan and Owen met shortly after graduating college thanks to a very lucky chain of events — their
> roommates at the time happened to be dating. Meghan barely knew her roommate, Edie, before moving in
> and almost didn't live with her at all — which makes the whole thing feel like the ultimate butterfly
> effect. Owen was smitten from the start, and after a few months of friendship he made it clear he
> wanted to be more than friends. One week into dating, Meghan told her friend Sophia, *"I'm going to
> marry him."* Five years later, here we are.
>
> Anyone who knows them knows they balance each other perfectly. Meghan is hilarious, organized, and
> unapologetically type A; Owen is calm, go-with-the-flow, endlessly romantic, and just as funny.
> Together they make life feel both exciting and easy.
>
> Owen pulled off the ultimate surprise. While Meghan was on a Greek island with Sophia, her family, and
> Edie — the roommate who started this whole chain of events — Owen secretly traveled 36 hours to
> surprise her. With help from her friends and Sophia's mom (who spent the entire day touring Owen around
> the island to pull it off), he appeared at sunset on their second-to-last night. The proposal was
> unforgettable, but what made it even better was how many people conspired to make it happen.
> *It was the easiest yes of all time.*

### Registry (for the Registry page — representative real items)
~33 items, mostly kitchen/home. Lead with the beautiful objects; tuck purely utilitarian things lower.
Examples: Le Creuset Signature Dutch Oven ($480, the "most wanted" anchor), Pillivuyt porcelain plates &
bowls, Lodge cast-iron skillet, Bialetti moka pot, Cole & Mason salt/pepper mills, Aspen glassware, acacia
cutting boards, Cuisinart waffle maker, Ninja blender. Stores: Williams-Sonoma, Crate & Barrel, West Elm,
Amazon. Price range ~$13–$480. Plus a **Honeymoon Fund** — see below.

---

## NON-NEGOTIABLE IMPROVEMENTS FROM THE REVIEW (every site must implement these)

1. **Add RSVP** — a real RSVP page + a primary nav slot (rightmost) + a primary CTA on the home page.
   Pre-open state in their voice: *"RSVPs open early 2027 — for now, hold Friday, June 18."* Build a real
   form (name, attending yes/no, # of guests, meal choice, song request, note) even if non-functional.
2. **Surface who/when/where above the fold** on Home — names, **Friday, June 18, 2027**, Whitehouse Station NJ —
   so a guest never has to scroll a tall wordless hero to learn the basics.
3. **Retire sage `#505956`; adopt an Aegean blue** eyedropped from the church dome as the primary accent.
   The color of the words should be the color of the place he proposed. (Improves contrast on white, too.)
4. **Honeymoon fund → "Send Us Back to the Aegean"** — pull it UP near the top of the registry, give it a
   voiced description and a Mediterranean image slot. Suggested copy: *"We got engaged at sunset on a
   clifftop in the Cyclades — and we're not done with the Greek islands yet. Help send us back to the
   Aegean as a married couple (yes, we'll find that little blue-domed church again)."*
5. **Hero that builds** — don't open on the climax with no context. Either a single wide establishing shot
   OR a sequence that builds to the kiss; shorter than full-screen so facts clear the fold. Test on mobile.
6. **Photography is the brand thread**, not florals. Drop the generic watercolor florals entirely.
7. **Voice as a system** (esp. the recommended concept) — let their voice into microcopy; on practical
   pages a sparing recurring **(Meghan:) / (Owen:)** two-voice aside (she crisp, he warm). Ration it hard:
   never on the date, the masthead, or the RSVP button. Charm in service of clarity.
8. **Accessibility** — semantic HTML, AA contrast, visible focus states, alt text, labeled form fields,
   `prefers-reduced-motion` respected. Reserve thin all-caps Cormorant for large display only.

---

## PAGES TO BUILD (full, consistent, navigable — shared header/footer)

Where real logistics are unknown (exact venue name, hotel blocks, schedule times), use clearly-plausible
**sample content in the couple's voice**, designed so they can swap in real details. Build the design and
structure of every page fully — no "coming soon" placeholders.

- **Home** — re-stacked "host then swoon": wordmark + nav → hero that builds → Welcome+Facts+RSVP block →
  "The Easiest Yes" story (with a large pull-quote) → one fresh non-redundant image → warm exit-ramp links.
- **Schedule** — an elegant timeline (welcome drinks → ceremony → reception → Saturday send-off) with
  times, venue, and a dress-code note; "come make a weekend of it."
- **Travel** — Newark/EWR + drive time, hotel-block cards with (placeholder) booking links, "rent a car,"
  Thursday/Friday arrival guidance, a short "things to do nearby" list.
- **Registry** — lead with the beautiful objects, "Send Us Back to the Aegean" fund up top, voiced intro;
  link out to the stores.
- **Wedding Party** — warm bios that pay off the story's cast (Sophia & her co-conspirator mom; Edie, the
  roommate who started it all and was there for the proposal), one voiced line each.
- **Gallery** — a deliberate two-act arc, "Greece → Home" (Cycladic proposal world, then everyday/NJ),
  as an art-directed grid (image slots).
- **FAQs** — grouped, leading with the highest-frequency questions (the Friday timing, dress code, kids,
  plus-ones, parking, getting there, "where exactly is Whitehouse Station"); the best home for two-voice asides.
- **RSVP** — the real form described above; pre-open dated promise.

---

## IMAGERY (you do NOT have the real photos — do this instead)
Do not fetch external images. Build tasteful, **in-palette image placeholders**: duotone/gradient blocks in
the concept palette, optionally with subtle inline-SVG Cycladic line art (a blue-domed church silhouette, a
sea horizon, a sun, simple olive sprigs), each with a small caption marking what real photo belongs there
(e.g., *"[Proposal — Sifnos clifftop at sunset]"*). Make photo slots obvious and beautiful so the couple
can drop real images straight in. Lovely hand-built SVG hero art is encouraged.

---

## THE THREE CONCEPT DIRECTIONS (you will be assigned ONE)

Full detail is in `panel_result.json` → `concepts[]` and in the review HTML §04. Summary:

### A — "The Warmest Hosts, set in the Aegean"  ★ panel's recommended winner (8.75)
Warm, hosted, funny, three steps ahead of every guest's question — the same hosts who got an island to
conspire. Aegean-accented but the people are the brand. **Palette:** Aegean Cobalt `#1F6FB2` (primary),
Ink `#0E0E0E`, Whitewash `#FFFFFF`, Warm Stone/Cream `#F4EFE6`, Sunset Gold `#E4B45E` (tiny doses).
**Signature:** the (Meghan:)/(Owen:) two-voice asides; a warm Welcome+Facts+RSVP block; "Send Us Back to
the Aegean"; "The Easiest Yes" story. Voice-forward, hospitable, but always clear.

### B — "The Aegean Thread"  (near-tie, 8.67)
Make the place the brand; the sea is the literal through-line from hero → story → honeymoon fund → every
page. The eyedropped cobalt accent is the organizing move. **Palette:** Aegean Blue `#2E6F95` (primary),
Deep Sea `#1B4965`, Whitewashed `#FFFFFF`, Warm Stone `#E8E0D4`, Olive `#6E7651`, Sunset Ochre `#C98A3C`.
Same site as A minus the two-voice device — let the place and color do the talking.

### C — "Quiet Editorial — the Aegean, set in whitespace"  (highest visual craft)
Timeless, photography-forward, magazine-grade minimalism. Near-zero ornament, full-bleed imagery,
generous negative space, single-image hero, typographic restraint. **Palette:** Gallery White `#FFFFFF`,
Aegean dome blue `#1E5F8C` (primary), Near-black `#0E0E0E`, Deep harbor navy `#103A52` (small-text
fallback), Warm whitewashed stone `#EDE7DD`, Sunset terracotta `#C9742E` (micro-accent only).

**All three** keep the praised type system: **Cormorant Garamond** for display (wordmark, H1s, names,
date, section titles) + a clean, refined sans for body/UI. Use web fonts (Google Fonts is fine here — this
is a real site, not Zola). Provide robust fallbacks.

---

## TECH & QUALITY BAR
- **Standalone static site.** Plain HTML/CSS/JS, multi-page with a shared stylesheet. It must run by simply
  opening `index.html` in a browser. No build step required. Google Fonts via `<link>` is allowed.
- **Frontend craft:** strong type scale, generous spacing, controlled measure (~60–70ch), image-led
  composition, a real grid, purposeful tasteful motion (subtle scroll-reveal / hover; honor
  `prefers-reduced-motion`). Distinctive and editorial — **avoid AI-slop** (no generic card-grid soup, no
  purple/glassy gradients, no emoji clutter, no center-everything). Use the assigned palette with discipline.
- **Use expert frontend skills if available** (e.g. `frontend-design`, `high-end-visual-design`) and any
  other helpful resources. Apply max effort; iterate until it's genuinely beautiful.
- **Responsive:** mobile-first; verify at ~390–414px and ~1440px.

## VALIDATE IN CHROME (headless — isolated per worktree, no shared-tab conflicts)
Render each page to PNG and inspect it with the Read tool; iterate at least 2–3 rounds until polished.
```
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1440,3000 --screenshot=/tmp/check_desktop.png "file:///ABS/PATH/index.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=414,2600 --screenshot=/tmp/check_mobile.png  "file:///ABS/PATH/index.html"
```
Then `Read` the PNGs, critique your own work honestly (hierarchy, spacing, color, mobile reflow, the
above-the-fold facts, the RSVP CTA), and fix. Repeat for the key pages, not just Home.

## DELIVERABLE
A complete site in your assigned worktree directory with `index.html` as the entry point, all pages linked
and styled, real content, working in-page navigation, validated screenshots. End with a short report:
what you built, the concept interpretation, key design decisions, and how it maps to the review's fixes.
