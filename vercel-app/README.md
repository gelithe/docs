# Chart Compass — Vercel deployment

A secured, installable version of Chart Compass. The browser never holds the API
key: every model call goes through `/api/chat`, which keeps the key server-side,
checks a per-person access code, and can use a caller's own key instead.

The GitHub Pages version is untouched and keeps working independently.

## What's here

```
vercel-app/
  index.html              the app (served at /, routes model calls through /api/chat)
  api/chat.js             serverless proxy (Claude by default, OpenAI-ready)
  manifest.webmanifest    PWA manifest
  sw.js                   service worker (installable / offline shell)
  icon-*.png, icon.svg    app icons
  vercel.json             routing + headers
  package.json            Node 18+
```

## One-time setup (Vercel dashboard)

1. **New Project** → import the `gelithe/docs` repo.
2. **Root Directory** → set to **`vercel-app`** (this isolates it from the docs site).
   Framework preset: **Other**. No build command needed.
   - **Production Branch** (Project → Settings → Git): set to
     `claude/astrology-chart-analysis-obkvN` (where this folder lives), or merge
     that branch into `main` first and deploy from `main`.
3. **Environment Variables** (Project → Settings → Environment Variables):
   - `ANTHROPIC_API_KEY` — your Claude key (`sk-ant-…`). Set a monthly spend cap
     on this key at console.anthropic.com.
   - `ACCESS_CODES` — comma-separated per-person codes, e.g.
     `anna-7x2k,dad-m9p4,me-0000`. Give each person their own; remove one to
     revoke that person. **If left empty the proxy is OPEN — only for local dev.**
   - `OPENAI_API_KEY` — *(optional)* enables `provider:"openai"` and OpenAI BYOK.
4. **Deploy.**
5. **Domain** (Project → Settings → Domains): add `compass.sagemodeai.com`.
   Since `sagemodeai.com` is already on Vercel, DNS is configured automatically.

## How access works

- A person opens the app, and in setup step 4 enters their **access code** once
  (stored on their device). All their usage runs on your key.
- Anyone who prefers to **use their own credits** can paste their own key
  (`sk-ant-…` for Claude or `sk-…` for OpenAI) — it takes priority and their
  usage never touches your key.
- No account, no database. Revoke someone by deleting their code from
  `ACCESS_CODES` and redeploying.

## Notes

- All astrology math (ephemeris, Human Design, Gene Keys) still runs in the
  browser; the proxy only relays the chat message and stores nothing.
- To rotate the shared key: change `ANTHROPIC_API_KEY` and redeploy — no app change.
- PWA files are path-relative, so installing to a home screen works out of the box
  on the custom domain.
