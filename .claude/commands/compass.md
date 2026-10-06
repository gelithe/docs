---
description: Load the Chart Compass context (compass.sagemodeai.com)
---

You are picking up **Chart Compass** — the personal astrological companion live
at `compass.sagemodeai.com`.

Read `cloudflare-app/README.md`, then `cloudflare-app/AUDIT-2026-10.md`, then orient yourself in the code:

```
cloudflare-app/
  index.html              app shell (versioned asset URLs — bump on every change)
  styles.css
  js/core.js              config, i18n, storage, proxy client, prompt builders,
                          Book memory, buildSystem (two cached system blocks)
  js/engine.js            wizard, astro/HD/Gene Keys engine, portrait prompts
  js/app.js               UI, conversation, book/journal/portrait rendering, boot
  js/timeline.js          Timeline tab: day-by-day transits, day readings, Focus
                          layer, Together overlay — all computed locally, no model
  functions/api/chat.js   Pages Function: server-side key, labelled access codes,
                          BYOK, streaming, per-task model routing, usage tally
  functions/api/usage.js  protected usage report (USAGE KV + ADMIN_KEY)
  sw.js                   service worker (bump CACHE with the asset version)
  AUDIT-2026-10.md        THE PLAN: findings, cost model, phases, status, open
                          questions. Read it after the README. Do one phase.
```

Things that are true and easy to get wrong:

- **Deploy = push to `main`.** Cloudflare Pages builds from `main`, root
  directory `cloudflare-app`. The feature branch does not deploy to production.
- **Bump the asset version on every change** — `?v=N` in `index.html` and
  `sw.js`, plus the `CACHE` constant — or devices keep the old files.
- Data lives only in the user's browser. No accounts, no database. The proxy
  stores nothing.
- Model routing is by tier (`chat` / `deep` / `summary`) mapped to Cloudflare
  env vars, with a fallback so a bad model ID cannot break production.
- The Portrait is a pair: **The Story** carries no glossary-needing vocabulary,
  **The Analysis** owns every mechanic. Keep that split.
- On prompts: fewer rules beat more. Prohibitions make the model write
  defensively. If a brief is growing longer, it is probably getting worse —
  replace a rule or sharpen the persona instead of adding one.

- **Keep the branch level with `main` by merging, never force-push.** Work on
  `claude/astrology-chart-analysis-obkvN`; deploy by mirroring `cloudflare-app/`
  and `.claude/` onto `main` (git worktree of `origin/main`, copy, commit, push).
- **`vercel-app/` is an older copy the owner still uses. Never touch it.**
- Keep context light: do ONE phase from the audit per session, delegate
  file-wide reads to a subagent, write results into the audit's status table,
  not into chat.

Summarise what you found in a few lines, name the phase you are about to do,
and confirm before changing anything.
