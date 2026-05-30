#!/usr/bin/env python3
# Generates a single self-contained HTML design-review artifact from panel_result.json
import json, html, re, statistics

D = json.load(open('panel_result.json'))
S = D['synthesis']
def esc(s): return html.escape(str(s), quote=False)

# ---------- helpers ----------
def norm_concept(name):
    n = name.lower()
    if 'warmest' in n: return 'Warmest Hosts'
    if 'aegean thread' in n: return 'Aegean Thread'
    if 'editorial' in n or 'whitespace' in n: return 'Quiet Editorial'
    return name

# scorecard aggregation
axes = ['guestExperience','visualCraft','feasibility','authenticity']
agg = {}
for j in D['judgments']:
    for e in j['evaluations']:
        k = norm_concept(e['concept'])
        agg.setdefault(k, {a: [] for a in axes})
        for a in axes:
            agg[k][a].append(e[a])
score_rows = {}
for k, v in agg.items():
    means = {a: statistics.mean(v[a]) for a in axes}
    means['overall'] = statistics.mean([statistics.mean(v[a]) for a in axes])
    score_rows[k] = means

# concept meta from concepts list
concept_meta = {}
for c in D['concepts']:
    concept_meta[norm_concept(c['directionName'])] = c

def hexes(palette, n=5):
    out = []
    for p in palette:
        m = re.search(r'#([0-9A-Fa-f]{6})', p)
        if not m: continue
        label = p.split('—',1)[-1] if '—' in p else p
        label = re.split(r'[—\-(]', p.split('#'+m.group(1),1)[-1], 1)
        # cleaner label: text after the hex, before first ( or —
        tail = p.split(m.group(0),1)[1]
        lab = re.split(r'[—\-(]', tail)
        lab = next((x.strip() for x in lab if x.strip()), '')
        out.append(('#'+m.group(1), lab))
        if len(out) >= n: break
    return out

CONCEPT_ORDER = ['Warmest Hosts','Aegean Thread','Quiet Editorial']
CONCEPT_VERDICT = {
 'Warmest Hosts': ('recommended','The unanimous pick'),
 'Aegean Thread': ('runner','Near-tie — the no-voice version'),
 'Quiet Editorial': ('later','Most beautiful — grow into it'),
}

def li_list(items, cls='plain'):
    return '\n'.join(f'<li>{esc(x)}</li>' for x in items)

# severity ordering
sev_rank = {'high':0,'medium':1,'low':2}
crit = sorted(S['prioritizedCritique'], key=lambda x: sev_rank.get(x['severity'],3))
sev_class = {'high':'blocking','medium':'suggest','low':'nit'}
sev_label = {'high':'High','medium':'Medium','low':'Low'}

def critique_bubbles():
    out=[]
    for i in crit:
        c = sev_class.get(i['severity'],'nit')
        out.append(f'''<div class="bubble {c}">
  <div class="anchor">{esc(i['area'])} <span class="sev sev-{i['severity']}">{sev_label[i['severity']]}</span></div>
  <p><b>{esc(i['finding'])}</b></p>
  <p class="fix"><span class="fixlabel">Fix</span>{esc(i['fix'])}</p>
</div>''')
    return '\n'.join(out)

def score_bar_svg(k):
    m = score_rows[k]
    rows = [('Guest experience', m['guestExperience']),
            ('Visual craft', m['visualCraft']),
            ('Feasibility', m['feasibility']),
            ('Authenticity', m['authenticity'])]
    W=300; bx=120; bw=150; rowh=22; h=len(rows)*rowh+8
    parts=[f'<svg viewBox="0 0 {W} {h}" width="100%" height="auto" role="img">']
    accent = {'Warmest Hosts':'#1F6FB2','Aegean Thread':'#2E6F95','Quiet Editorial':'#5C7CA3'}[k]
    for idx,(lab,val) in enumerate(rows):
        y=idx*rowh+6
        fillw=bw*val/10.0
        parts.append(f'<text x="0" y="{y+11}" font-family="ui-monospace,monospace" font-size="9.5" fill="#87867F">{lab}</text>')
        parts.append(f'<rect x="{bx}" y="{y+3}" width="{bw}" height="8" rx="4" fill="#F0EEE6"/>')
        parts.append(f'<rect x="{bx}" y="{y+3}" width="{fillw:.1f}" height="8" rx="4" fill="{accent}"/>')
        parts.append(f'<text x="{bx+bw+8}" y="{y+11}" font-family="ui-monospace,monospace" font-size="9.5" fill="#3D3D3A">{val:.1f}</text>')
    parts.append('</svg>')
    return ''.join(parts)

def concept_cards():
    out=[]
    for k in CONCEPT_ORDER:
        c = concept_meta[k]
        vclass, vlabel = CONCEPT_VERDICT[k]
        chips = ''.join(f'<span class="chip"><span class="sw" style="background:{hx}"></span>{esc(lab)[:16]}</span>' for hx,lab in hexes(c['palette'],5))
        moms = ''.join(f'<li>{esc(m)}</li>' for m in c['signatureMoments'][:3])
        big = esc(c['bigIdea'])
        if len(big) > 360: big = big[:360].rsplit(' ',1)[0] + '…'
        out.append(f'''<div class="option concept v-{vclass}">
  <div class="tradeoff">{esc(vlabel)} · avg {score_rows[k]['overall']:.2f}</div>
  <h3>{esc(c['directionName'])}</h3>
  <p class="tag">{esc(c['tagline'])}</p>
  <p class="big">{big}</p>
  <div class="palette">{chips}</div>
  <div class="scorebar">{score_bar_svg(k)}</div>
  <div class="moms-label">Signature moves</div>
  <ul class="moms">{moms}</ul>
  <p class="feas"><span class="fixlabel">Feasible on Zola?</span>{esc(c['feasibilityOnZola'][:200])}{'…' if len(c['feasibilityOnZola'])>200 else ''}</p>
</div>''')
    return '\n'.join(out)

# homepage stacks
CURRENT_STACK = [
 ('Header','Wordmark “MEGHAN & OWEN” + 7-item nav, in sage','keep'),
 ('Hero','Full-bleed 3-photo band — opens on the kiss, no names/date','change'),
 ('Names band','MEGHAN GHOSH & OWEN DONNELLY · JUNE 18, 2027 · NJ · live countdown','change'),
 ('Our Love Story','3 paragraphs · floral sprig · two repeat clifftop photos','change'),
 ('Footer','Zola default','keep'),
]
NEW_STACK = [
 ('Header','Wordmark recolored to Aegean blue + a small voiced tagline','change'),
 ('Hero','One wide establishing shot (or a triptych that builds), shorter','change'),
 ('Welcome · Facts · RSVP','NEW — “Friday, June 18, 2027 · Whitehouse Station, NJ” + a warm welcome line + the page’s one primary CTA','new'),
 ('The Easiest Yes','The same great story, polished, with an “easiest yes” pull-quote','change'),
 ('One fresh photo','A detail or island landscape — not a repeat of the hero','change'),
 ('Exit ramp (optional)','RSVP · Plan your trip · See the registry','new'),
 ('Footer','Zola default, one voiced line above it','keep'),
]
def stack_html(stack):
    rows=[]
    for title,desc,kind in stack:
        rows.append(f'<div class="blk blk-{kind}"><div class="blk-t">{esc(title)}</div><div class="blk-d">{esc(desc)}</div></div>')
    return '\n'.join(rows)

# page roadmap
def roadmap_cards():
    out=[]
    for p in S['pageRoadmap']:
        built = 'built' in p['page'].lower()
        tag = '<span class="badge success">BUILT</span>' if built else '<span class="badge info">BUILD-OUT</span>'
        name = re.sub(r'\s*\((built|build-out opportunity)\)','',p['page'], flags=re.I)
        pr = p['priority']
        out.append(f'''<div class="card road">
  <div class="road-head"><h3>{esc(name)}</h3>{tag}<span class="risk-tag {('high' if pr=='high' else 'med' if pr=='medium' else 'low')}">{esc(pr)}</span></div>
  <p>{esc(p['recommendation'])}</p>
</div>''')
    return '\n'.join(out)

# honeymoon fund draft — pull from copyNotes
fund_draft = next((c for c in S['copyNotes'] if 'Aegean' in c and ('Help send' in c or 'blue-domed' in c)), '')
fund_quote = ''
m = re.search(r"['\"“](We got engaged.*?)['\"”]", fund_draft)
if m: fund_quote = m.group(1)

def persona_panels():
    out=[]
    for c in D['critiques']:
        nm = c['persona']
        name = nm.split(',')[0]
        title = nm.split(',',1)[1].strip() if ',' in nm else ''
        imp = c['overallImpression']
        if len(imp) > 600: imp = imp[:600].rsplit(' ',1)[0] + '…'
        out.append(f'''<details>
  <summary>{esc(name)} — <span class="ptitle">{esc(title)}</span></summary>
  <p>{esc(imp)}</p>
  <p class="prio"><span class="fixlabel">Their #1 priority</span>{esc(c['singleHighestPriority'])}</p>
</details>''')
    return '\n'.join(out)

# exec summary paragraphs
exec_paras = ''.join(f'<p>{esc(p)}</p>' for p in S['executiveSummary'].split('\n') if p.strip())
rec = S['recommendedDirection']
alts = S['alternativeDirections']

CSS = """
:root{--ivory:#FAF9F5;--paper:#FFFFFF;--slate:#141413;--g100:#F0EEE6;--g200:#E6E3DA;--g300:#D1CFC5;--g500:#87867F;--g700:#3D3D3A;
--clay:#D97757;--clay-d:#B85C3E;--oat:#E3DACC;--olive:#788C5D;--rust:#B04A3F;--amber:#C78E3F;--steel:#5C7CA3;
--aegean:#1F6FB2;--sage:#505956;
--serif:ui-serif,Georgia,"Times New Roman",Times,serif;--sans:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--mono:ui-monospace,"SF Mono",Menlo,Monaco,Consolas,monospace;}
*{box-sizing:border-box;}html{scroll-behavior:smooth;}
body{margin:0;background:var(--ivory);color:var(--slate);font-family:var(--sans);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;}
.wrap{max-width:920px;margin:0 auto;padding:0 32px 120px;}
header.masthead{padding:64px 0 36px;border-bottom:1.5px solid var(--g300);margin-bottom:36px;}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--g500);margin-bottom:18px;display:flex;align-items:center;gap:12px;}
.eyebrow::before{content:"";width:24px;height:1.5px;background:var(--clay);}
h1{font-family:var(--serif);font-weight:500;font-size:clamp(36px,5.2vw,54px);line-height:1.06;letter-spacing:-.018em;margin:0 0 8px;max-width:22ch;}
h1 em{font-style:italic;color:var(--clay);}
h2{font-family:var(--serif);font-weight:500;font-size:clamp(23px,2.6vw,29px);line-height:1.16;letter-spacing:-.012em;margin:56px 0 6px;}
h2 .num{font-family:var(--mono);font-size:13px;color:var(--clay);letter-spacing:.08em;vertical-align:middle;margin-right:10px;}
h3{font-family:var(--serif);font-weight:500;font-size:18px;letter-spacing:-.005em;margin:0 0 6px;}
.lead{font-size:17.5px;color:var(--g700);line-height:1.55;margin:18px 0 0;max-width:62ch;}
.sub{font-size:15px;color:var(--g500);max-width:64ch;margin:4px 0 0;}
p{color:var(--g700);margin:12px 0;}
a{color:var(--clay);text-decoration-color:var(--oat);text-underline-offset:3px;}
a:hover{text-decoration-color:var(--clay);}
code{font-family:var(--mono);font-size:.9em;background:var(--g100);color:var(--slate);padding:1.5px 5px;border-radius:4px;}
.prompt-box{background:var(--g100);border-radius:10px;padding:16px 18px;margin:0 0 30px;}
.prompt-box .label{display:block;font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--g500);margin-bottom:6px;}
.prompt-box p{margin:0;color:var(--g700);font-style:italic;}
.callout{background:var(--paper);border:1.5px solid var(--g300);border-left:3px solid var(--clay);border-radius:10px;padding:18px 20px;margin:24px 0;}
.callout.success{border-left-color:var(--olive);}
.callout .callout-label{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--g500);margin-bottom:8px;}
.callout p{margin:0 0 10px;color:var(--g700);}.callout p:last-child{margin-bottom:0;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:28px 0 8px;}
.stat{background:var(--paper);border:1.5px solid var(--g300);border-radius:12px;padding:16px 18px;}
.stat .n{font-family:var(--serif);font-size:30px;line-height:1;color:var(--slate);}
.stat .l{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--g500);margin-top:8px;}
.row-list{display:flex;flex-direction:column;border:1.5px solid var(--g300);border-radius:12px;background:var(--paper);overflow:hidden;}
.row{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:16px;padding:13px 18px;border-bottom:1px solid var(--g100);font-size:14.5px;}
.row:last-child{border-bottom:none;}
.row .pg{font-family:var(--serif);font-size:16px;}
.row .meta{font-family:var(--mono);font-size:11.5px;color:var(--g500);max-width:46ch;text-align:right;}
.badge{display:inline-flex;align-items:center;height:22px;padding:0 10px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.03em;border-radius:999px;white-space:nowrap;}
.badge.success{background:rgba(120,140,93,.16);color:var(--olive);}
.badge.info{background:rgba(92,124,163,.16);color:var(--steel);}
.badge.neutral{background:var(--g100);color:var(--g700);}
.risk-tag{display:inline-block;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:6px;}
.risk-tag.high{background:rgba(176,74,63,.16);color:var(--rust);}
.risk-tag.med{background:rgba(199,142,63,.18);color:var(--amber);}
.risk-tag.low{background:rgba(120,140,93,.16);color:var(--olive);}
.swatches{display:flex;flex-wrap:wrap;gap:18px;margin:18px 0;}
.swgroup{flex:1;min-width:200px;}
.swgroup .gl{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--g500);margin-bottom:8px;}
.swrow{display:flex;gap:8px;flex-wrap:wrap;}
.swatch{width:46px;height:46px;border-radius:8px;border:1.5px solid rgba(20,20,19,.12);position:relative;}
.swatch .hx{position:absolute;bottom:-16px;left:0;font-family:var(--mono);font-size:8.5px;color:var(--g500);white-space:nowrap;}
.swatch-wrap{margin-bottom:20px;}
.typespec{background:var(--paper);border:1.5px solid var(--g300);border-radius:12px;padding:20px 22px;margin:18px 0;}
.typespec .big{font-family:var(--serif);font-size:30px;letter-spacing:.18em;color:var(--sage);text-transform:uppercase;margin:0;}
.typespec .meta{font-family:var(--mono);font-size:11px;color:var(--g500);margin-top:8px;}
.typespec .body{font-size:14px;color:var(--g700);margin-top:14px;border-top:1px solid var(--g100);padding-top:12px;}
ul.checks{list-style:none;padding:0;margin:16px 0;}
ul.checks li{position:relative;padding:9px 0 9px 30px;border-bottom:1px solid var(--g100);font-size:14.5px;color:var(--g700);}
ul.checks li:last-child{border-bottom:none;}
ul.checks li::before{content:"✓";position:absolute;left:4px;top:9px;color:var(--olive);font-weight:600;}
ul.moves{list-style:none;padding:0;margin:16px 0;}
ul.moves li{position:relative;padding:9px 0 9px 26px;border-bottom:1px solid var(--g100);font-size:14.5px;color:var(--g700);}
ul.moves li:last-child{border-bottom:none;}
ul.moves li::before{content:"▸";position:absolute;left:4px;top:9px;color:var(--clay);}
ul.plain{margin:14px 0;padding-left:20px;}ul.plain li{margin:7px 0;color:var(--g700);font-size:14.5px;}
.bubble{background:var(--paper);border:1.5px solid var(--g300);border-left-width:4px;border-radius:10px;padding:14px 16px;margin:12px 0;}
.bubble.blocking{border-left-color:var(--rust);}
.bubble.suggest{border-left-color:var(--amber);}
.bubble.nit{border-left-color:var(--steel);}
.bubble .anchor{font-family:var(--mono);font-size:11px;color:var(--g500);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:flex;align-items:center;gap:10px;}
.sev{font-weight:600;}.sev-high{color:var(--rust);}.sev-medium{color:var(--amber);}.sev-low{color:var(--olive);}
.bubble p{margin:0 0 8px;font-size:14.5px;color:var(--g700);}
.bubble p:last-child{margin-bottom:0;}
.bubble .fix{font-size:13.5px;}
.fixlabel,.moms-label{font-family:var(--mono);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--slate);margin-right:8px;}
.compare{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px;margin:22px 0;}
.option{background:var(--paper);border:1.5px solid var(--g300);border-radius:12px;padding:20px;}
.option.v-recommended{border-color:var(--aegean);border-width:2px;box-shadow:0 8px 26px rgba(31,111,178,.10);}
.option .tradeoff{font-family:var(--mono);font-size:10.5px;color:var(--clay);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;}
.option.v-recommended .tradeoff{color:var(--aegean);}
.option h3{margin:0 0 4px;}
.option .tag{font-style:italic;color:var(--g500);font-size:13px;margin:0 0 10px;}
.option .big{font-size:13px;color:var(--g700);margin:0 0 12px;}
.chip{display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9.5px;color:var(--g700);margin:0 6px 6px 0;}
.chip .sw{width:12px;height:12px;border-radius:3px;border:1px solid rgba(20,20,19,.15);display:inline-block;}
.scorebar{margin:10px 0 12px;}
.moms{margin:6px 0 12px;padding-left:18px;}.moms li{font-size:12.5px;color:var(--g700);margin:5px 0;}
.feas{font-size:12px;color:var(--g700);border-top:1px solid var(--g100);padding-top:10px;margin:0;}
.stacks{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:22px 0;}
.stackcol .sl{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--g500);margin-bottom:10px;}
.blk{border:1.5px solid var(--g300);border-radius:9px;padding:10px 12px;margin-bottom:8px;background:var(--paper);}
.blk-t{font-family:var(--serif);font-size:14.5px;color:var(--slate);}
.blk-d{font-size:12px;color:var(--g500);margin-top:2px;}
.blk-change{border-left:3px solid var(--amber);}
.blk-new{border-left:3px solid var(--aegean);background:rgba(31,111,178,.05);}
.blk-keep{opacity:.7;}
.navline{font-family:var(--mono);font-size:12.5px;background:var(--slate);color:#E6E3DA;border-radius:8px;padding:12px 14px;margin:10px 0;overflow-x:auto;}
.navline .add{color:#A8B991;font-weight:600;}
.navline .lbl{color:#87867F;}
.pullquote{font-family:var(--serif);font-style:italic;font-size:19px;line-height:1.4;color:var(--aegean);border-left:3px solid var(--aegean);padding:6px 0 6px 20px;margin:20px 0;}
.road{margin:12px 0;}
.road-head{display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;}
.road-head h3{margin:0;flex:0 0 auto;}
.road p{font-size:13.5px;}
details{border:1.5px solid var(--g300);border-radius:10px;padding:13px 16px;background:var(--paper);margin:10px 0;}
details summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;font-family:var(--serif);font-size:16px;color:var(--slate);}
details summary::-webkit-details-marker{display:none;}
details summary::before{content:"▸";color:var(--clay);font-size:11px;transition:transform .15s ease;display:inline-block;}
details[open] summary::before{transform:rotate(90deg);}
details .ptitle{font-family:var(--sans);font-style:normal;font-size:12.5px;color:var(--g500);}
details>*:not(summary){margin-top:10px;}
details .prio{font-size:13px;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
footer.page-footer{margin-top:80px;padding-top:24px;border-top:1.5px solid var(--g300);font-family:var(--mono);font-size:11px;color:var(--g500);text-transform:uppercase;letter-spacing:.08em;}
@media(max-width:880px){.wrap{padding:0 20px 80px;}.stats{grid-template-columns:1fr 1fr;}.stacks{grid-template-columns:1fr;}.two{grid-template-columns:1fr;}.row{grid-template-columns:1fr auto;}.row .meta{display:none;}}
"""

HTML = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meghan &amp; Owen — Wedding Website Design Review</title>
<style>{CSS}</style>
</head>
<body>
<div class="wrap">

<header class="masthead">
  <div class="eyebrow">Wedding website · independent design review</div>
  <h1>Meghan &amp; Owen, your site has its <em>personality turned down</em></h1>
  <p class="lead">{esc(rec['summary'][:0]) or ''}A panel of design, UX, hospitality, and storytelling experts reviewed your Zola site, then deliberated how to make it unmistakably <em>yours</em>. The story is already written, the type is already elegant, the photos are already extraordinary — this is about closing one gap.</p>
  <p class="sub">Scope: the two pages that are built — <b>Home</b> and <b>Registry</b> — plus the site-wide system (type, color, navigation). The five “coming soon” pages were left alone by design.</p>
</header>

<div class="prompt-box">
  <span class="label">The brief</span>
  <p>“Thoroughly analyze my sister-in-law and fiancé’s wedding website. Use a team of expert personas to critique what’s there — layout, style — without commenting on pages clearly marked under construction. Have them brainstorm and deliberate improved concepts.”</p>
</div>

<div class="stats">
  <div class="stat"><div class="n">7</div><div class="l">pages reviewed</div></div>
  <div class="stat"><div class="n">2 / 5</div><div class="l">built / under construction</div></div>
  <div class="stat"><div class="n">13</div><div class="l">Opus 4.8 experts</div></div>
  <div class="stat"><div class="n">8.75</div><div class="l">winning concept score</div></div>
</div>
<p class="sub">Method: 6 expert critics worked independently → 3 creative directors developed divergent directions → a 3-judge panel scored and debated them → one lead synthesized the verdict.</p>

<div class="callout">
  <div class="callout-label">The one-paragraph version</div>
  {exec_paras}
</div>

<h2><span class="num">01</span>What we actually looked at</h2>
<p>You have two finished pages and five intentional placeholders. Per the brief, the placeholders are off-limits for critique — but they reappear later as <em>opportunities</em>, not criticism.</p>
<div class="row-list">
  <div class="row"><span class="pg">Home</span><span class="meta">Photo-band hero · names · Fri Jun 18 2027 · countdown · love story</span><span class="badge success">BUILT · IN SCOPE</span></div>
  <div class="row"><span class="pg">Registry</span><span class="meta">~33 items + honeymoon fund · Williams-Sonoma, Crate &amp; Barrel, Amazon</span><span class="badge success">BUILT · IN SCOPE</span></div>
  <div class="row"><span class="pg">Schedule</span><span class="meta">“still planning the weekend’s events”</span><span class="badge neutral">UNDER CONSTRUCTION</span></div>
  <div class="row"><span class="pg">Travel</span><span class="meta">“gathering recommendations… stay tuned”</span><span class="badge neutral">UNDER CONSTRUCTION</span></div>
  <div class="row"><span class="pg">Wedding Party</span><span class="meta">“coming soon!”</span><span class="badge neutral">UNDER CONSTRUCTION</span></div>
  <div class="row"><span class="pg">Gallery</span><span class="meta">“visuals to come…”</span><span class="badge neutral">UNDER CONSTRUCTION</span></div>
  <div class="row"><span class="pg">FAQs</span><span class="meta">“hard at work on these… talk soon”</span><span class="badge neutral">UNDER CONSTRUCTION</span></div>
</div>

<h3 style="margin-top:30px">The design system we decoded</h3>
<div class="typespec">
  <p class="big">Meghan &amp; Owen</p>
  <div class="meta">Cormorant Garamond · weight 400 · all-caps · ~2px tracking · sage #505956 — used for the wordmark, headings, the date, and section titles</div>
  <div class="body">Body &amp; navigation set in Circular (Zola’s default sans), near-black <code>#0E0E0E</code>, on a pure-white page. A persistent watercolor floral spray (blush / cream / butter, sage foliage) anchors every corner. The display type drew unanimous praise — it’s the floral-and-color layer that the panel flagged.</div>
</div>
<div class="swatches">
  <div class="swgroup"><div class="gl">What you customized — one accent</div><div class="swrow swatch-wrap"><div class="swatch" style="background:#505956"><span class="hx">#505956 sage</span></div></div></div>
  <div class="swgroup"><div class="gl">The template florals (warm)</div><div class="swrow swatch-wrap"><div class="swatch" style="background:#E7C9CE"><span class="hx">blush</span></div><div class="swatch" style="background:#F2E8D2"><span class="hx">cream</span></div><div class="swatch" style="background:#E6D29A"><span class="hx">butter</span></div><div class="swatch" style="background:#8C9A7C"><span class="hx">foliage</span></div></div></div>
  <div class="swgroup"><div class="gl">Your photos (cool · untapped)</div><div class="swrow swatch-wrap"><div class="swatch" style="background:#1F6FB2"><span class="hx">dome blue</span></div><div class="swatch" style="background:#1B4965"><span class="hx">deep sea</span></div><div class="swatch" style="background:#E8E0D4"><span class="hx">stone</span></div><div class="swatch" style="background:#FFFFFF"><span class="hx">whitewash</span></div></div></div>
</div>
<p class="sub">The crux in one image: the decoration is warm garden; the photography is cool Aegean. They sit on opposite sides of the color wheel — and the one color you chose (sage) sided with the borrowed flowers instead of the place he proposed.</p>

<h2><span class="num">02</span>What’s already working</h2>
<p>This is not a rescue job. Lead with the strengths — and protect them.</p>
<ul class="checks">
{li_list(S['whatsWorking'])}
</ul>

<h2><span class="num">03</span>The critique, by priority</h2>
<p>Every finding below is about the <b>built</b> pages and the site-wide system, and every fix is achievable inside Zola (theme color, page settings, photo order, curation, copy) unless explicitly flagged. Sorted highest-impact first.</p>
{critique_bubbles()}

<h2><span class="num">04</span>Three directions we explored</h2>
<p>The creative directors each developed a distinct holistic concept, then three judges scored them 1–10 on guest experience, visual craft, feasibility, and authenticity, and argued the tradeoffs. They converged hard.</p>
<div class="compare">
{concept_cards()}
</div>
<div class="callout success">
  <div class="callout-label">The verdict — {esc(rec['name'])}</div>
  <p><b>Why it won.</b> {esc(rec['why'])}</p>
  <p><b>In one breath.</b> {esc(rec['summary'])}</p>
</div>
<div class="two">
{''.join(f'<div class="card"><div class="card-eyebrow">Alternative</div><h3>{esc(a["name"])}</h3><p>{esc(a["whenToChoose"])}</p></div>' for a in alts)}
</div>

<h2><span class="num">05</span>The homepage, re-stacked</h2>
<p>The biggest layout move is sequence: let the page <em>host</em> before it swoons. Right now the wordless ~850px hero opens on the kiss, and a guest scrolls past it before learning who, when, or where. Re-order so the facts (and an RSVP) clear the fold, and the kiss becomes a payoff.</p>
<div class="stacks">
  <div class="stackcol"><div class="sl">Today</div>{stack_html(CURRENT_STACK)}</div>
  <div class="stackcol"><div class="sl">Recommended</div>{stack_html(NEW_STACK)}</div>
</div>
<p class="sub"><span class="risk-tag low" style="background:rgba(31,111,178,.12);color:#1F6FB2">blue</span> = new &nbsp; <span class="risk-tag med">amber</span> = changed &nbsp; faded = unchanged. The Design-Craft judge’s guardrail: pick <b>one</b> strong facts band — don’t stack four competing who/when/where surfaces.</p>

<h2><span class="num">06</span>Navigation &amp; the missing RSVP</h2>
<p>{esc(S['navAndIA'].split(chr(10))[0])}</p>
<div class="navline"><span class="lbl">today &nbsp;</span>Home | Schedule | Travel | Registry | Wedding Party | Gallery | FAQs</div>
<div class="navline"><span class="lbl">add &nbsp;&nbsp;&nbsp;</span>Home | Schedule | Travel | Registry | Wedding Party | Gallery | FAQs | <span class="add">RSVP</span></div>
<p class="sub">RSVP is the one action a wedding site exists to collect. You’re ~13 months out, so open it in a dated promise in your voice — <code>“RSVPs open early 2027 — for now, hold Friday, June 18.”</code> The slot existing now sets the expectation. Eight items is past the comfortable single-row limit, so confirm the mobile menu leads with Home and RSVP.</p>

<h2><span class="num">07</span>The plan</h2>
<div class="two">
<div>
  <h3>Quick wins — an evening</h3>
  <p class="sub">No theme switch, no code. High impact.</p>
  <ul class="checks">
  {li_list(S['quickWins'])}
  </ul>
</div>
<div>
  <h3>Bigger moves — a focused weekend</h3>
  <p class="sub">Sequence these over the 13-month runway.</p>
  <ul class="moves">
  {li_list(S['biggerMoves'])}
  </ul>
</div>
</div>

<h2><span class="num">08</span>Words: protect the gold, then let your voice leak</h2>
<p>Your love story is the best asset on the site — specific, funny, true. The fix isn’t to write more; it’s to let that same voice into the microcopy guests read first, and to fix a few small things in the most-read passage.</p>
{('<div class="pullquote">“'+esc(fund_quote)+'”</div><p class="sub">A drafted “Send Us Back to the Aegean” honeymoon-fund description — the highest-return ten minutes of copy on the whole site, and it plants the thread the design leans on.</p>') if fund_quote else ''}
<ul class="plain">
{li_list(S['copyNotes'])}
</ul>

<h2><span class="num">09</span>The rest of the site, when you’re ready</h2>
<p>Not a critique of the placeholders — a forward-looking map for when you build them, each framed to extend the same Aegean-and-voice thread.</p>
{roadmap_cards()}

<h2><span class="num">10</span>Where the experts disagreed — and the call</h2>
<div class="callout">
  <div class="callout-label">Honest map of consensus &amp; dissent</div>
  <p>{esc(S['closingNote'])}</p>
</div>

<h2><span class="num">11</span>Meet the panel</h2>
<p>Six independent critics, each through a different expert lens. Their full first impressions and top priorities:</p>
{persona_panels()}

<footer class="page-footer">
  Compiled 2026-05-30 · 13 Opus 4.8 agents · 6 critics → 3 directions → 3 judges → synthesis · scope: built pages + site-wide system only
</footer>

</div>
</body>
</html>
"""

open('megowen-wedding-design-review.html','w').write(HTML)
print("wrote megowen-wedding-design-review.html", len(HTML), "bytes")
