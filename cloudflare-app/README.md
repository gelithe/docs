# Chart Compass — Cloudflare Pages deployment

The streaming, no-timeout version. Model calls go through `/api/chat`, a
Cloudflare Pages Function that keeps the API key server-side, gates access with
per-person codes, and **streams** the response. Because Cloudflare limits CPU
time (not the time spent waiting on the model), long documents generate at full
length — no 60s wall like the Vercel build.

## What's here

```
cloudflare-app/
  index.html, styles.css     the app shell (asset version ?v=N — bump on every change)
  js/core.js                 config, i18n, storage, proxy client, prompt builders, Book memory
  js/engine.js               wizard, astro / Human Design / Gene Keys engine, portrait prompts
  js/app.js                  UI, conversation, Book, journal, portrait rendering
  js/timeline.js             Timeline tab (computed locally, no model)
  functions/api/usage.js     usage report at /api/usage?key=ADMIN_KEY (needs the USAGE KV binding)
  AUDIT-2026-10.md           the plan: findings, phases, status
  functions/api/chat.js      Pages Function proxy (Claude streamed, OpenAI JSON)
  _headers                   cache rules (fresh shell + service worker on deploy)
  manifest.webmanifest, sw.js, icon-*  PWA assets
```

## One-time setup (Cloudflare dashboard)

1. Add `sagemodeai.com` to Cloudflare (Add a Site) and switch its nameservers to
   the two Cloudflare gives you. DNS then resolves through Cloudflare.
2. **Workers & Pages → Create → Pages → Connect to Git** → pick `gelithe/docs`.
3. Build settings:
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: *(empty)*
   - **Build output directory**: `cloudflare-app`
   - **Root directory**: `cloudflare-app`  *(so Functions resolve at
     `cloudflare-app/functions/…`)*
4. **Settings → Environment variables** (Production):
   - `ANTHROPIC_API_KEY` — your Claude key (`sk-ant-…`); set a spend cap.
   - `ACCESS_CODES` — comma-separated per-person codes, e.g.
     `anna-7x2k,dad-m9p4,me-0000`. Remove one to revoke that person.
     **Empty = OPEN, dev only.**
   - `OPENAI_API_KEY` — optional; enables OpenAI.
5. **Deploy.** Test the `*.pages.dev` URL first (wizard should load; an access
   code should be accepted and a chat should stream in).
6. **Custom domains → Set up a domain →** `compass.sagemodeai.com`. Since the
   zone is now on Cloudflare, it wires up automatically.

## Keeping model costs down

Charts, Human Design, Gene Keys, the Timeline and its built-in day readings are
all computed in the browser and cost nothing. Only conversations, portraits and
the memory digest call the model.

- **Prompt caching is built in.** The chart, portrait and rules go in a cached
  system block, and the changing part (date, sky, journal, mode) is held steady
  for the length of a conversation, so each follow-up message reads everything
  before it from cache at a fraction of the normal input price.
- **The Analysis document is sent only in Question and Transits modes.**
- **Pick cheaper models per task** in Settings → Variables and secrets:
  - `MODEL_SUMMARY` — a Haiku model (memory digest; quality barely matters)
  - `MODEL_CHAT` — try a Haiku model; switch back to Sonnet if replies feel thin
  - `MODEL_DOC` — the two portrait documents; an Opus model earns its price here
  - `MODEL_DEEP` — deeper conversation work; also the fallback when `MODEL_DOC` is unset
  Effort is set per tier by the proxy (low for chat and the digest, high for
  documents). A caller with an access code cannot choose the model or exceed the
  tier's length ceiling; a caller's own key (BYOK) can.
  Use the model IDs listed at docs.claude.com (Models overview). A bad value
  falls back to the default, so nothing breaks.

## Notes

- Streaming: the browser shows Claude's reply as it's written, and long Portrait
  documents (The Story / The Analysis) generate at full length again.
- BYOK: a user can paste their own `sk-ant-…` or `sk-…` key; it takes priority
  and never touches your key.
- The proxy stores nothing; all astrology math still runs in the browser.
- To rotate the shared key: change `ANTHROPIC_API_KEY` and redeploy.
- This folder is independent — the GitHub Pages and Vercel versions keep working
  unchanged.
