# Deploy & CMS setup — mowedding27.com

This site is an **Eleventy** static build with a **Decap CMS** editing layer.
Meghan & Owen edit content through forms at `/admin`, logging in with **email +
password** (via DecapBridge — no GitHub account needed for them). Their changes
commit to GitHub behind the scenes; Netlify rebuilds and publishes automatically.
This file is the one-time setup runbook (for Stephen). The couple never touch any
of this — see `EDITING.md`.

```
content/*.json ──edit in /admin (email+password)──▶ DecapBridge ──▶ GitHub commit
                                                                        │
                                            Netlify build (npm run build) ◀┘
                                                     └──▶ live ~1–2 min later
```

## How it's structured

| Path | What it is |
|---|---|
| `src/*.njk` | The 8 page templates (Nunjucks). Layout/header/footer live once in `src/_includes/`. |
| `content/*.json` | The editable content (what the CMS writes). |
| `assets/ photos/ florals/ robots.txt` | Copied verbatim into the build (passthrough). |
| `admin/` | Decap CMS (`index.html` loader + `config.yml`). |
| `.eleventy.js` | Build config — input `src/`, output `_site/`, markdown filters. |
| `netlify.toml` | Build command, publish dir, Node version, headers. |
| `_site/` | Build output (git-ignored; Netlify regenerates it). |

## Local development

```bash
npm install
npm run serve     # live preview at http://localhost:8080 (rebuilds on edits)
npm run build     # one-off build into _site/
```

(The `/admin` editor only works once the repo is on GitHub and DecapBridge is wired
up — see Phase 1. Locally you can still preview the site itself.)

---

## One-time setup

Phases 0–1 are safe and never touch the live domain. The live site is only affected
at Phase 2.

### Phase 0 — Push to GitHub (private)

```bash
cd /Users/scasella/Downloads/megowen-wedding
gh auth status || gh auth login
gh repo create mowedding27 --private --source=. --remote=origin --push
```

`node_modules/` and `_site/` are git-ignored. The sibling `megowen-wedding-deploy*/`
and `megowen-wedding-archive/` folders are outside the repo and won't be pushed.
Keep the repo **private** (guest details / registry stay off the public web).

### Phase 1 — Auth: DecapBridge (email + password for the couple)

The couple log in with email/password; DecapBridge commits to the repo on their
behalf, so they never need a GitHub account.

1. Go to **https://decapbridge.com** and create an account (free tier: 3 sites, 10
   collaborators each — plenty).
2. **Add a site**: choose **GitHub** as the git provider, select the `mowedding27`
   repo, and provide the access token / install the GitHub App it asks for (this is
   what lets DecapBridge commit). Set the CMS login URL to `https://mowedding27.com/admin/`.
3. Choose an auth type: **Classic** (email + password login form) and/or **PKCE**
   (adds "Login with Google / Microsoft"). Either is fine; Classic gives the password
   box you asked for.
4. DecapBridge generates a `backend:` block. **Paste it over the placeholder** at the
   top of `admin/config.yml` (it fills in your real site id). It looks like:
   ```yaml
   backend:
     name: git-gateway
     repo: <your-gh-user>/mowedding27
     branch: main
     identity_url: https://auth.decapbridge.com/sites/<your-site-id>
     gateway_url: https://gateway.decapbridge.com
   ```
   Commit and push. (The `admin/index.html` loader is already set up for Decap — no change needed.)

**Fallbacks** (only if you ever leave DecapBridge): Netlify Identity + Git Gateway is
the built-in email/password alternative (free under 5 users, still works in 2026, but
Git Gateway is the more neglected corner of the ecosystem); or a single shared GitHub
login the two of them use. Decap's config is unchanged either way.

### Phase 2 — Connect Netlify (zero-downtime cutover)

The site is currently live on the existing Netlify site **`funny-belekoy-0d59fd`**
(domain + Let's Encrypt cert + www→apex redirect all attached to it). We change only
its *deploy source*, not the domain.

1. Netlify → site **`funny-belekoy-0d59fd`** → **Site configuration → Build & deploy →
   Continuous deployment → Link repository** → authorize GitHub → pick `mowedding27`, branch `main`.
2. It reads `netlify.toml` (build `npm run build`, publish `_site`, Node 20). Confirm.
3. **Prove it green off-domain first:** open a PR (or check the linked-repo Deploy Preview)
   and verify the `deploy-preview-*.netlify.app` URL renders before publishing to production.
4. Trigger the production deploy (merge to `main`). On success Netlify atomically swaps
   the published deploy to the git build. The domain/cert never detach.

**Rollback:** a *failed* build leaves the last good deploy live (no-op). A *bad but
successful* deploy rolls back in one click: Deploys → pick the previous deploy → "Publish
deploy". Ultimate insurance: the pre-migration `megowen-wedding-deploy.zip` can be
drag-dropped to restore exact prior bytes. Keep it ~a week.

### Phase 3 — Invite the couple (no GitHub needed)

- In the **DecapBridge dashboard → Manage collaborators**, enter Meghan's and Owen's
  email addresses and send invites.
- They get an email, click the link, and **set a password** (or pick Google/Microsoft).
- That's it — they log in at `https://mowedding27.com/admin/` with that email + password.
- Send them `EDITING.md`.

---

## Verify (after cutover)

```bash
curl -sI https://mowedding27.com | grep -E 'HTTP/|server:'        # 200, server: Netlify
curl -s  https://mowedding27.com/robots.txt                        # must be: User-agent: * / Disallow: /
curl -sI https://www.mowedding27.com | grep -i location            # 301 -> apex
for p in / /schedule.html /travel.html /faqs.html /registry.html /gallery.html /wedding-party.html /rsvp.html /assets/css/site.css; do
  printf "%s -> " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://mowedding27.com$p"; done
```
Then open `https://mowedding27.com/admin`, log in with your DecapBridge email/password,
edit a schedule event, Publish, and confirm it goes live after the rebuild (~1–2 min).

## Notes & gotchas

- **URLs stay flat** (`/schedule.html`, etc.) so every existing link/bookmark/QR keeps working — no redirects needed.
- **No-index is preserved**: `robots.txt` (`Disallow: /`) ships in the build, plus an `X-Robots-Tag` header in `netlify.toml`. Flip both when/if the site should be findable.
- **Decap is pinned** to `3.12.2` in `admin/index.html` — don't float to `@latest`.
- **New photo uploads**: the CMS image widget may store a leading-slash path (e.g. `/photos/x.jpg`). That resolves fine on the deployed site. The seeded photos use relative paths (`photos/x.jpg`); both work.
- **Calendar a check ~May 2027** that DecapBridge login still works, ahead of the editing crunch before the June 18, 2027 wedding.
- **RSVP form is still a non-functional preview** (out of scope for this pass). When you want real RSVPs, Netlify Forms is now available since the site is git-deployed.
