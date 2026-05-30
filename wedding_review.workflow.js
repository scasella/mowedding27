export const meta = {
  name: 'wedding-site-design-panel',
  description: 'Expert panel critiques the Ghosh-Donnelly Zola wedding site and deliberates improved concepts',
  phases: [
    { title: 'Critique', detail: '6 diverse expert personas critique the built pages independently' },
    { title: 'Concepts', detail: '3 creative directors develop divergent improved directions' },
    { title: 'Deliberation', detail: '3-judge panel evaluates concepts and debates tradeoffs' },
    { title: 'Synthesis', detail: 'Creative director integrates everything into a final brief' },
  ],
}

// ---------------------------------------------------------------------------
// SHARED DOSSIER — a meticulous description compiled by a vision-capable
// reviewer who logged in and viewed every page, plus exact design tokens
// pulled from the live DOM. Agents cannot see the screenshots themselves, so
// treat this dossier as authoritative ground truth.
// ---------------------------------------------------------------------------
const DOSSIER = [
'SITE: Zola wedding website for Meghan Ghosh & Owen Donnelly.',
'WEDDING: June 18, 2027 (a Friday). Location shown: Whitehouse Station, NJ. The site is ~13 months from launch as reviewed, so there is time to build it out.',
'PLATFORM: Hosted on Zola. Couples can: change the design theme; adjust the theme color and choose from a limited set of fonts; add / remove / reorder pages and create custom pages; add text, photo, and gallery blocks; enable an RSVP page and a Schedule/Events page; curate the registry; choose hero/header images; and write all copy. They CANNOT write arbitrary HTML/CSS. Keep recommendations within these limits; clearly flag anything that would require switching themes or is a platform stretch.',
'',
'=== SITE-WIDE DESIGN SYSTEM ===',
'Background: pure white (#FFFFFF) on every page.',
'Display / heading typeface: Cormorant Garamond, weight 400, ALL-CAPS, letter-spacing ~2px, color sage-green #505956 (rgb 80,89,86). Couple wordmark renders ~40px. Used for the wordmark, page H1 titles, the date, and the OUR LOVE STORY heading.',
'Body / UI typeface: Circular (Zola default sans), ~16px, near-black #0E0E0E. Used for nav, paragraphs, buttons, countdown, registry text.',
'Decorative system: soft watercolor florals — a LARGE spray anchored in the bottom-right corner that persists on every page (blush-pink + cream + butter-yellow blooms with sage foliage), a matching spray top-left in the home names band, a tiny floral sprig used as a section divider, and a small floral motif above the footer. The illustration style is romantic English-cottage-garden.',
'This is a stock Zola floral theme, lightly customized (sage accent color). The watercolor-garden florals are generic to the template, not personal to the couple.',
'',
'=== HEADER / NAVIGATION (site-wide) ===',
'Centered wordmark "MEGHAN & OWEN" (Cormorant, sage, all-caps). Below it a centered single-row horizontal nav: Home | Schedule | Travel | Registry | Wedding Party | Gallery | FAQs. The active page label is underlined. White header, no border, lots of whitespace.',
'There is NO RSVP link anywhere in the nav. The date and location are not shown in the header (only on the home page after you scroll).',
'',
'=== PAGE: HOME (BUILT — in scope for critique) ===',
'Total height ~3200px. Top-to-bottom:',
'1) HERO: a full-bleed, edge-to-edge horizontal band of THREE side-by-side engagement photos (~850px tall, no gutters). Together they capture the proposal on a Greek-island clifftop in the Cyclades — the iconic blue-domed white Church of the Seven Martyrs at Kastro, Sifnos is visible in the sea behind them. Left panel: the bride reacting; center: the wider ocean/cliff proposal scene; right: the couple kissing. There is NO text, name, or date overlaid on the hero. The wordmark + nav sit on white above it.',
'2) NAMES BAND: white section with the top-left watercolor floral. Centered, stacked: "MEGHAN GHOSH" / "&" / "OWEN DONNELLY" (Cormorant, sage, all-caps, large). Below: "JUNE 18, 2027", then "Whitehouse Station, NJ", then a LIVE COUNTDOWN timer rendered in small sans ("383 days  14 hours  24 minutes  33 seconds").',
'3) OUR LOVE STORY: centered all-caps Cormorant heading; THREE centered paragraphs set in a narrow measure (~60-70 chars). They are genuinely well-written and specific. Verbatim copy follows between <STORY> tags.',
'<STORY>',
'Para 1: Meghan and Owen met shortly after graduating college thanks to a very lucky chain of events — their roommates at the time happened to be dating. In fact, Meghan did not really know her roommate before moving in and almost did not live with her at all, which makes the fact that they met feel like the ultimate butterfly effect. Owen was smitten from the start, and after a few months of friendship, he made it clear he wanted to be more than friends. One week into dating, Meghan told her friend Sophia, "I am going to marry him." Five years later, here we are.',
'Para 2: Anyone who knows Meghan and Owen knows they balance each other perfectly. Meghan is hilarious, organized, and unapologetically type A, while Owen is calm, go-with-the-flow, endlessly romantic, and just as funny. Together, they make life feel both exciting and easy — always laughing, always supporting each other, and always bringing out the best in one another.',
'Para 3: Owen pulled off the ultimate surprise proposal. While Meghan was staying on a Greek island with Sophia, her family, and Edie (Meghan roommate who introduced them), Owen secretly traveled for 36 hours to surprise her. With help from Meghan friends and Sophia mom — who spent the entire day helping Owen tour around the island and pull off the surprise — he appeared at sunset on their second-to-last night there. The proposal itself was unforgettable, but what made it even more special was how excited everyone was to help make it happen. It was the easiest yes of all time.',
'</STORY>',
'After the story: a small floral sprig divider, then TWO more proposal photos (rectangular, ~800px wide, centered, stacked) of the couple at the clifftop with the Sifnos church.',
'4) FOOTER: Zola logo + "For all the days along the way" + standard Zola links.',
'',
'=== PAGE: REGISTRY (BUILT — in scope for critique) ===',
'Total height ~5350px. Cormorant sage H1 "Registry", then a Zola registry toolbar (ZOLA logo, About Zola, phone, "Free shipping every day") and a filter row (All Categories / Price / All availability / All stores / Featured sort). Then a 4-column responsive grid of product cards (image on light-gray tile, title, price, dark "Buy on [Store]" button, "Requested: 1 - Still needs: 1").',
'~33 items. The first is flagged with a gold star "Our most wanted" (Le Creuset Signature Dutch Oven, $480). Inventory skews heavily to KITCHEN + HOME: cookware (Le Creuset, Lodge cast iron, Bialetti moka), dinnerware (Pillivuyt plates/bowls), glassware (Aspen highballs, pitcher), cutting boards, mixing bowls, small appliances (Cuisinart toaster oven & waffle maker, Ninja blender), storage sets, and even an O-Cedar spin mop. Stores: Williams-Sonoma (most), Crate & Barrel (many), West Elm (a duvet insert), Amazon (3), Chilewich (placemats). Price range roughly $13 to $480; most items sit $30-$150.',
'At the very bottom: a single small "Honeymoon Fund!" cash-fund tile ("Contribute what you wish" / "Contribute to gift" / "This is a Group Gift"). It has NO description of the honeymoon or destination. Then a Zola help banner.',
'NOTE: The registry grid itself is Zola templated UI with limited visual control; the couple controls curation, the most-wanted flag, the honeymoon fund, and item mix.',
'',
'=== PAGES UNDER CONSTRUCTION (OUT OF SCOPE FOR CRITIQUE) ===',
'These are intentionally unfinished placeholders. DO NOT critique them or their emptiness. You MAY propose forward-looking concepts for them later.',
'- Schedule: "We are still planning the weekend events and will update this section soon."',
'- Travel: "We are working on gathering some recommendations for our out-of-towner guests. Stay tuned!"',
'- Wedding Party: "Wedding party coming soon!"',
'- Gallery: "Visuals to come..."',
'- FAQs: "Hard at work on these... Talk soon."',
'',
'=== NEUTRAL OBSERVATIONS (do not treat as conclusions; weigh them yourself) ===',
'- Only 2 of 7 pages are built (Home, Registry); 5 are placeholders.',
'- No RSVP exists in the nav.',
'- A stylistic tension exists between the soft English-garden watercolor florals (generic template) and the couple\'s actual crisp Mediterranean / Cycladic blue-white-stone proposal photography.',
'- Sage-green Cormorant on white is elegant but check contrast/legibility; the countdown is small light sans.',
'- The hero shows the kiss immediately and has no names/date overlaid; guests must scroll to learn who/when/where.',
'- The Greek-island elopement-proposal is a strong, ownable story that currently lives only in photos + the love-story text, not in the site\'s visual system or page structure.',
].join('\n')

const CONSTRAINTS = [
'GROUND RULES (all phases):',
'1) CRITIQUE ONLY the built pages (Home, Registry) and the site-wide system (header/nav, typography, color, decorative florals, information architecture, mobile/accessibility implications). DO NOT critique the five under-construction placeholder pages or the fact that they are empty — that is off-limits per the client.',
'2) Be realistic about Zola limits (see dossier). Prefer recommendations achievable via theme/color/font settings, page structure, content, photo choices, and copy. Flag anything needing a theme switch or that Zola cannot do.',
'3) This is a real couple (the requester\'s sister-in-law and her fiance). Be warm, specific, and constructive — celebrate what genuinely works, and make suggestions they could actually act on. No generic filler; cite concrete elements from the dossier.',
'4) You cannot see the screenshots, but the dossier was written by a vision-capable reviewer and includes exact design tokens. Critique confidently from it.',
].join('\n')

// ---------------------------------------------------------------------------
const CRITIQUE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    persona: { type: 'string' },
    overallImpression: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    issues: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      title: { type: 'string' }, area: { type: 'string' },
      severity: { type: 'string', enum: ['high','medium','low'] },
      why: { type: 'string' }, fix: { type: 'string' } },
      required: ['title','area','severity','why','fix'] } },
    conceptSeeds: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      title: { type: 'string' }, idea: { type: 'string' } }, required: ['title','idea'] } },
    singleHighestPriority: { type: 'string' },
  },
  required: ['persona','overallImpression','strengths','issues','conceptSeeds','singleHighestPriority'],
}

const CONCEPT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    directionName: { type: 'string' }, tagline: { type: 'string' }, bigIdea: { type: 'string' },
    visualLanguage: { type: 'string' }, palette: { type: 'array', items: { type: 'string' } },
    typography: { type: 'string' }, homepage: { type: 'string' }, navAndIA: { type: 'string' },
    signatureMoments: { type: 'array', items: { type: 'string' } },
    pageConcepts: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      page: { type: 'string' }, concept: { type: 'string' } }, required: ['page','concept'] } },
    copyVoice: { type: 'string' }, feasibilityOnZola: { type: 'string' }, risks: { type: 'string' },
  },
  required: ['directionName','tagline','bigIdea','visualLanguage','palette','typography','homepage','navAndIA','signatureMoments','pageConcepts','copyVoice','feasibilityOnZola','risks'],
}

const JUDGMENT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    judge: { type: 'string' },
    evaluations: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      concept: { type: 'string' },
      guestExperience: { type: 'number' }, visualCraft: { type: 'number' },
      feasibility: { type: 'number' }, authenticity: { type: 'number' }, comment: { type: 'string' } },
      required: ['concept','guestExperience','visualCraft','feasibility','authenticity','comment'] } },
    tensions: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      tension: { type: 'string' }, position: { type: 'string' } }, required: ['tension','position'] } },
    recommendation: { type: 'string' },
  },
  required: ['judge','evaluations','tensions','recommendation'],
}

const SYNTHESIS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    executiveSummary: { type: 'string' },
    whatsWorking: { type: 'array', items: { type: 'string' } },
    prioritizedCritique: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      area: { type: 'string' }, finding: { type: 'string' },
      severity: { type: 'string', enum: ['high','medium','low'] }, fix: { type: 'string' } },
      required: ['area','finding','severity','fix'] } },
    recommendedDirection: { type: 'object', additionalProperties: false, properties: {
      name: { type: 'string' }, why: { type: 'string' }, summary: { type: 'string' } },
      required: ['name','why','summary'] },
    alternativeDirections: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      name: { type: 'string' }, whenToChoose: { type: 'string' } }, required: ['name','whenToChoose'] } },
    homepageRedesign: { type: 'string' },
    navAndIA: { type: 'string' },
    pageRoadmap: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      page: { type: 'string' }, recommendation: { type: 'string' }, priority: { type: 'string' } },
      required: ['page','recommendation','priority'] } },
    copyNotes: { type: 'array', items: { type: 'string' } },
    quickWins: { type: 'array', items: { type: 'string' } },
    biggerMoves: { type: 'array', items: { type: 'string' } },
    closingNote: { type: 'string' },
  },
  required: ['executiveSummary','whatsWorking','prioritizedCritique','recommendedDirection','alternativeDirections','homepageRedesign','navAndIA','pageRoadmap','copyNotes','quickWins','biggerMoves','closingNote'],
}

// ---------------------------------------------------------------------------
const PERSONAS = [
  { short: 'artdir', name: 'Saanvi Rao', title: 'Editorial Art Director — brand identity, typography & color',
    lens: 'Judge the visual system as a designer: the Cormorant/Circular type pairing, all-caps + 2px tracking, the sage-green-on-white palette and its contrast, the generic watercolor florals vs. the couple\'s real story, hierarchy, rhythm, whitespace, and overall taste/cohesion. Is this a coherent, intentional identity or a default template?' },
  { short: 'ux', name: 'Marcus Webb', title: 'UX & Information Architecture Lead — nav, flows, mobile, accessibility',
    lens: 'Judge findability and structure: the 7-item nav, label clarity, what a guest can/cannot accomplish, the missing RSVP, where date/location/venue live, mobile reflow of the 3-image hero and registry grid, tap targets, color-contrast and legibility (sage text, tiny countdown), and content-first ordering.' },
  { short: 'planner', name: 'Eleanor Hartley', title: 'Luxury Wedding Planner — guest experience & etiquette',
    lens: 'Judge it as a guest and as an etiquette expert: does a guest instantly grasp who/when/where, dress code, lodging, logistics? Is hospitality conveyed? What essential info is absent on the BUILT pages? What would reduce the couple\'s inbound questions? (Do not critique the unfinished pages themselves.)' },
  { short: 'product', name: 'Devin Carter', title: 'Product / Conversion Designer — jobs-to-be-done, CTAs, registry, RSVP',
    lens: 'Judge it as a product: what are the guest\'s primary jobs, and does the site drive them? Evaluate the countdown\'s value, absence of any primary CTA, the registry curation/mix/price-spread/most-wanted/honeymoon-fund framing, and the missing RSVP funnel. What converts attention into action?' },
  { short: 'story', name: 'Julia Fontaine', title: 'Brand Storyteller — voice, narrative & microcopy',
    lens: 'Judge the writing and emotional arc: the Our Love Story copy (quality, length, structure, reveal), the wordmark, microcopy, the honeymoon-fund blurb, and whether the couple\'s distinct personalities (her type-A wit, his calm romance) come through. Where can voice be added without clutter?' },
  { short: 'photo', name: 'Theo Nakamura', title: 'Photography & Visual Art Director — imagery & Mediterranean aesthetic',
    lens: 'Judge the image program: the 3-panel hero crop and sequencing (it reveals the kiss immediately, no title overlay), repetition of the same proposal set, the untapped Cycladic blue-white-stone palette, image treatment, and how photography could carry the brand. How should the gallery and hero be art-directed?' },
]

const DIRECTIONS = [
  { short: 'aegean', seed: 'DIRECTION A — "The Aegean Thread": organize the entire site around their real Greek-island sunset proposal. Trade the generic English-garden watercolor florals for a restrained Cycladic visual language (whitewashed wall, Aegean blue, warm stone, olive, sun-bleached neutrals) drawn straight from their photos. Make the place and the story the brand.' },
  { short: 'editorial', seed: 'DIRECTION B — "Quiet Editorial": a timeless, photography-forward, magazine-grade minimalism. Maximum restraint — let the engagement photography breathe full-bleed, refined type, generous negative space, almost no ornament. Gallery-like and elegant; the design gets out of the way of the images and the facts.' },
  { short: 'hosts', seed: 'DIRECTION C — "The Warmest Hosts": hospitality-and-personality first. Keep romantic warmth but lead with the couple\'s voice and with making guests feel hosted and informed — strong storytelling, playful microcopy that captures her wit and his calm, and frictionless practical info. Charm + clarity over visual austerity.' },
]

const JUDGES = [
  { short: 'guest', name: 'Guest-Experience Advocate', priority: 'You weight GUEST EXPERIENCE and practicality most. A wedding site exists to inform and reassure guests. Reward clarity, hospitality, and reduced confusion; be skeptical of beauty that buries information.' },
  { short: 'craft', name: 'Design-Craft & Brand Advocate', priority: 'You weight VISUAL CRAFT and brand coherence most. Reward taste, distinctiveness, and an identity true to this couple; be skeptical of generic templates and of clutter added in the name of "helpfulness".' },
  { short: 'feasible', name: 'Feasibility & Authenticity Advocate', priority: 'You weight FEASIBILITY ON ZOLA and authenticity to this specific couple most. Reward ideas they can actually ship on Zola in an evening and that feel like THEM; be skeptical of anything needing custom code, big budgets, or a personality they have not shown.' },
]

// ---------------------------------------------------------------------------
function criticPrompt(p) {
  return [
    'You are ' + p.name + ', ' + p.title + '. You are on an expert panel reviewing a real couple\'s wedding website. Stay fully in character with the taste and rigor of a top practitioner in your field.',
    '', CONSTRAINTS, '', '=== DOSSIER ===', DOSSIER, '',
    '=== YOUR LENS ===', p.lens,
    '', 'Deliver a sharp, specific critique through your lens. Celebrate what truly works, then surface the issues that matter (severity-rated), each with a concrete, Zola-feasible fix. Add 1-3 concept seeds (bigger ideas for later). Name your single highest-priority change. Be candid but kind. Return ONLY the structured object.',
  ].join('\n')
}

function conceptPrompt(d, critiques) {
  return [
    'You are a senior creative director developing ONE bold, cohesive redesign direction for the Ghosh-Donnelly wedding website. Develop the assigned direction with conviction and craft — but freely fold in the strongest ideas from the panel critiques below.',
    '', CONSTRAINTS, '', '=== DOSSIER ===', DOSSIER, '',
    '=== YOUR ASSIGNED DIRECTION ===', d.seed,
    '', '=== PANEL CRITIQUES (six experts) ===', JSON.stringify(critiques),
    '', 'Develop the direction into a vivid, buildable concept: the big idea, visual language, a concrete palette (with hex codes where you can), typography approach (within Zola\'s font limits — name realistic choices), a homepage redesign, nav/IA (resolve the missing RSVP and where who/when/where lives), 3-5 signature moments, page-by-page concepts (INCLUDING forward-looking ideas for the currently-unfinished pages — Schedule, Travel, Wedding Party, Gallery, FAQs — framed as opportunities, not criticism), the copy voice, an honest feasibility-on-Zola note, and the risks/tradeoffs. Make it unmistakably THIS couple (Greek-island proposal, her type-A wit, his calm romance). Return ONLY the structured object.',
  ].join('\n')
}

function judgePrompt(j, concepts, critiques) {
  return [
    'You are the "' + j.name + '" on a deliberation panel choosing a design direction for a real couple\'s wedding website. ' + j.priority,
    'Be opinionated and concrete. Disagree where you genuinely would. Score each concept 1-10 on four axes (guestExperience, visualCraft, feasibility, authenticity) and explain. Then surface the real tensions you see across the concepts and critiques (e.g., generic florals vs. Mediterranean story; minimalism vs. warmth/helpfulness; how far to depart from the Zola template) and stake out your position on each. End with your recommendation (a single direction, or a specific blend).',
    '', CONSTRAINTS, '', '=== DOSSIER ===', DOSSIER,
    '', '=== THE THREE CONCEPTS ===', JSON.stringify(concepts),
    '', '=== THE SIX CRITIQUES ===', JSON.stringify(critiques),
    '', 'Return ONLY the structured object.',
  ].join('\n')
}

function synthPrompt(critiques, concepts, judgments) {
  return [
    'You are the lead creative director writing the FINAL integrated brief for Meghan & Owen, synthesizing the full panel: six expert critiques, three developed concepts, and a three-judge deliberation. Produce a warm, decisive, immediately-actionable brief the couple could hand to themselves and start executing on Zola tonight.',
    '', CONSTRAINTS,
    'Additional: weave the panel\'s consensus AND note where judges disagreed (so the couple can decide). Recommend ONE primary direction and explain when each alternative would be the better pick. The page roadmap MAY include the currently-unfinished pages as build-out opportunities (forward-looking, never as criticism). Separate "quick wins" (minutes-to-an-hour, high impact) from "bigger moves" (a focused weekend). Keep every recommendation Zola-feasible and true to this couple.',
    '', '=== DOSSIER ===', DOSSIER,
    '', '=== SIX CRITIQUES ===', JSON.stringify(critiques),
    '', '=== THREE CONCEPTS ===', JSON.stringify(concepts),
    '', '=== THREE JUDGMENTS ===', JSON.stringify(judgments),
    '', 'Return ONLY the structured object.',
  ].join('\n')
}

// ---------------------------------------------------------------------------
log('Panel reviewing Meghan & Owen\'s wedding site — 6 critics, then 3 concept directions, then a 3-judge deliberation, then synthesis.')

phase('Critique')
const critiques = (await parallel(PERSONAS.map(p => () =>
  agent(criticPrompt(p), { label: 'critique:' + p.short, phase: 'Critique', schema: CRITIQUE_SCHEMA })
))).filter(Boolean)
log('Collected ' + critiques.length + ' expert critiques.')

phase('Concepts')
const concepts = (await parallel(DIRECTIONS.map(d => () =>
  agent(conceptPrompt(d, critiques), { label: 'concept:' + d.short, phase: 'Concepts', schema: CONCEPT_SCHEMA })
))).filter(Boolean)
log('Developed ' + concepts.length + ' divergent concept directions.')

phase('Deliberation')
const judgments = (await parallel(JUDGES.map(j => () =>
  agent(judgePrompt(j, concepts, critiques), { label: 'judge:' + j.short, phase: 'Deliberation', schema: JUDGMENT_SCHEMA })
))).filter(Boolean)
log('Panel deliberated: ' + judgments.length + ' judgments in.')

phase('Synthesis')
const synthesis = await agent(synthPrompt(critiques, concepts, judgments), { label: 'synthesis', phase: 'Synthesis', schema: SYNTHESIS_SCHEMA })
log('Final brief synthesized.')

return { critiques, concepts, judgments, synthesis }
