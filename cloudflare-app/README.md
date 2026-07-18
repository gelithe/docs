# Chart Compass — Cloudflare Pages deployment

The streaming, no-timeout version. Model calls go through `/api/chat`, a
Cloudflare Pages Function that keeps the API key server-side, gates access with
per-person codes, and **streams** the response. Because Cloudflare limits CPU
time (not the time spent waiting on the model), long documents generate at full
length — no 60s wall like the Vercel build.

## What's here

```
cloudflare-app/
  index.html                 the app (streams replies; docs restored to full length)
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

## Notes

- Streaming: the browser shows Claude's reply as it's written, and long Portrait
  documents (The Story / The Analysis) generate at full length again.
- BYOK: a user can paste their own `sk-ant-…` or `sk-…` key; it takes priority
  and never touches your key.
- The proxy stores nothing; all astrology math still runs in the browser.
- To rotate the shared key: change `ANTHROPIC_API_KEY` and redeploy.
- This folder is independent — the GitHub Pages and Vercel versions keep working
  unchanged.
