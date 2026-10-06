# Re-audit of AUDIT-2026-10.md against the current code

Checked at HEAD `8e8d2b5` on `claude/charming-cannon-uopyre` (Phase 1 = `7efe183`; `8e8d2b5` added the `doc` tier and bumped assets to v18; working tree clean). "Old" line numbers refer to `3b27a25`, the code the audit was written against. Paths are relative to `cloudflare-app/`. Verdicts: CONFIRMED / OVERSTATED / WRONG / ALREADY DONE in Phase 1 / CANNOT VERIFY HEADLESS.

Line shifts since the audit: `js/core.js` +23 from old line 301 on (memory functions grew), `js/engine.js` +17 from old 273 on, `js/app.js` +11 from old 361, +32 from old 443, +49 from old 643; `functions/api/chat.js` +26 from old 55, +28 from old 148 (plus +2 after `8e8d2b5`). `styles.css`, `js/timeline.js`, `usage.js`, `_headers` unchanged.

## §2 P0 bugs

| # | Claim | Verdict | Evidence (current code) | Note |
|---|---|---|---|---|
| 1a | `send()` pushes the user message then sends `S.messages.slice(-24)` (app.js:310, 364) | CONFIRMED (old code) | old app.js:310 `S.messages.push({ role: 'user', content: text })`, old app.js:364 `messages: S.messages.slice(-24)` | Line refs were correct for `3b27a25`. |
| 1b | At the 13th message the slice starts with an assistant turn | CONFIRMED (arithmetic) | With strict user/assistant alternation, the 13th user message makes `S.messages.length` 25; `slice(-24)` begins at index 1 = assistant. | Only holds if every earlier send succeeded: a failed send leaves a user turn without a reply (app.js:344-355 catches, no assistant push, no pop), which shifts parity so the window opens on a user turn. Not "every conversation". |
| 1c | ...the API rejects it | CANNOT VERIFY HEADLESS / OVERSTATED as "sessions die" | The bundled API reference lists it as an error: claude-api `shared/error-codes.md:198` "First message is `assistant` \| 400 \| First message must be `user`". Owner reports 13+ message chats worked. | Code cannot settle this; both the reference and the owner's observation are recorded. Either the API tolerated it in practice or 1b's parity shift applied. |
| 1d | the "safety net" retries on the default model and fails identically | WRONG for the deployed config | old chat.js:162 `if (!upstream.ok && wantModel !== MODEL_DEFAULT)`; §10.3 says `MODEL_*` are unset, so `wantModel === MODEL_DEFAULT` and no retry ever ran. | Retry existed only when a `MODEL_*` variable was set. |
| 1e | Fix: trim in blocks starting at a user message | ALREADY DONE in Phase 1 | app.js:365-370 `historyWindow(msgs, max = 24, step = 8)` ... `while (start > 0 && start < msgs.length && msgs[start].role !== 'user') start++`; app.js:375 `messages: historyWindow(S.messages)` | Test "historyWindow: never opens with an assistant turn" passes. Harmless even if the API was tolerant. |
| 2 | Portraits do not stream: `generateDoc(prompt, onChunk)` never given `onChunk` (engine.js:274, 277; app.js:680) | CONFIRMED (old) / ALREADY DONE in Phase 1 | old engine.js:274 `generateDoc(buildDeepAnalysisPrompt(profile))`, old app.js:680 `generateDoc(prompt)`. Now engine.js:281 `generateDoc(prompt, partial => docProgress(kind, partial, true), ctl.signal)`, app.js:733 `generateDoc(prompt, partial => docProgress(kind, partial, true))`, app.js:695-699 renders `S.partialDoc[kind]`. | Old overlay showed only dots (old engine.js:264-266), so "waits in silence" was accurate. |
| 3 | Backup exports the access code (app.js:454-516) while the privacy note says keys are excluded | CONFIRMED (old) / ALREADY DONE in Phase 1; wording OVERSTATED | old app.js:459 `if (k && k.startsWith('cc_') && !k.endsWith('_key'))` included `cc_access`. Old privacy note (old index.html:40) said "Your key is never included in backups" (key, not code). Now app.js:492 `&& k !== 'cc_access'`, index.html:40 "Your key and your access code are never included in backups." | The old note did not claim the code was excluded; the export of a credential was still real. |
| 4a | `clearSessions` and `deleteProfile` leave `cc_<id>_memory` | CONFIRMED (old) / ALREADY DONE in Phase 1 | old app.js (clearSessions) only `saveSessions(id, [])`; old core.js:117 `['sessions','journal','key']`. Now app.js:447 `localStorage.removeItem(ns(id, 'memory'))`, core.js:117 `['sessions','journal','key','memory']`. | For `deleteProfile` the leftover was an orphan key, not a stale digest (nothing reads it after the profile is gone). |
| 4b | with zero sessions the digest is never rebuilt but still injected | CONFIRMED (old) | old core.js:325 `if (sessions.length < 2) return;` and core.js:294-300 `buildBookContext` injects any stored digest. | Now moot: memory removed on clear. |
| 4c | No UI to see or reset it | CONFIRMED (old) / ALREADY DONE in Phase 1 | app.js:571-585 "✦ What the Compass remembers" chapter with `onclick="forgetMemory()"`; app.js:451-456 `forgetMemory`. | Memory chapter renders only when `sessions.length > 0` (app.js:569 early return). |
| 5 | No way to delete a profile; `deleteProfile` (core.js:114) has no caller | CONFIRMED (old) / ALREADY DONE in Phase 1 | `git grep deleteProfile 3b27a25` finds only the definition. Now index.html:109 `onclick="removeProfile()"`, app.js:458-468 `removeProfile` → `deleteProfile(id)`. | |
| 6 | Retry on any upstream failure (chat.js:162) doubles pressure on 429/529 | OVERSTATED / ALREADY DONE in Phase 1 | old chat.js:162 retried any `!ok` but only when `wantModel !== MODEL_DEFAULT` (never, with `MODEL_*` unset). Now chat.js:71-75 `isModelRejected` (404, or 400 mentioning "model"), chat.js:191-205 retry only for effort/model rejection. | Test "429 / 529 are NOT retried" passes. |

## §2 Cost table

| # | Claim | Verdict | Evidence | Note |
|---|---|---|---|---|
| 1 | Digest re-reads every session, every message (40 sessions × all msgs × 400 chars) once per new session | CONFIRMED (mechanism, old) / ALREADY DONE in Phase 1; token figure CANNOT VERIFY | old core.js:302-304 `sessions.slice(0, 40)`, `(s.messages \|\| []).map(... .slice(0, 400))`; old core.js:327 `if (mem && mem.count === sessions.length) return;` → ran once per new session. Now core.js:305 `sessions.slice(0, 12)`, :307 `.slice(0, 12)`, :308 `.slice(0, 250)`, :312-314 previous digest folded in, :344 `fresh = sessions.filter(s => !seen.has(...) && String(s.id) !== String(S.sessionId))`. | "≈25-40k tokens" and "more than a whole conversation" are estimates, not checkable. See Phase 1 bug B2: only the newest 12 `fresh` sessions are sent but all are marked digested. |
| 2 | Cache TTL is 5 min; 9-13k-token prefix rewritten at 1.25× after every pause | CONFIRMED (old TTL) / ALREADY DONE in Phase 1; prefix size and "70-80%" CANNOT VERIFY | old core.js:412/424 `cache_control: { type: 'ephemeral' }` (5-min default). Now core.js:439 `cache_control: { type: 'ephemeral', ttl: '1h' }`. History marker stays 5-min (chat.js:118). | Reference: 1h writes cost 2× base (5-min 1.25×); 1h-before-5-min ordering is allowed (`shared/prompt-caching.md:144,172,176`). Break-even is ≥3 reads per write; saving depends on pause pattern, not verifiable here. |
| 3 | One-shot calls get `cache_control` (chat.js:83-91), pay 25% write premium, never read | CONFIRMED (old) / ALREADY DONE in Phase 1 | old chat.js:83-91 marked the last user turn unconditionally. Now chat.js:114 `if (messages.length === 1 && !system) return messages;`. | Sonnet 4.6 minimum cacheable prefix is 1024 tokens, so portrait/digest prompts were long enough to be written. Test "cache marker: none on a one-shot" passes. |
| 4 | Together routes every follow-up to `deep` (app.js:367) | CONFIRMED (old) / ALREADY DONE in Phase 1 (plus `doc` tier in `8e8d2b5`) | old app.js:367 `tier: S.mode === 'together' ? 'deep' : 'chat'`. Now app.js:379 `tier: 'chat'`; engine.js:437 `tier: 'doc'`; chat.js:52 `if (tier === 'doc') return env.MODEL_DOC \|\| env.MODEL_DEEP \|\| MODEL_DEFAULT;`; chat.js:62 `doc: 'high'`. | §9 status text still says portraits use `deep` and asset v17; both stale after `8e8d2b5`. |
| 5 | Full Story in every chat prompt; Analysis in Question/Transits; 65% of cold write | CONFIRMED (mechanism); percentages CANNOT VERIFY | core.js:272 `if (withAnalysis && profile.analysis?.trim())`, core.js:273 `if (profile.notes?.trim())` (always), core.js:364 `{ analysis: mode === 'question' \|\| mode === 'transit' }`. | Not done (Phase 5 item). |
| 6a | "Skip for now" doesn't cancel the two portrait calls | CONFIRMED (old) / ALREADY DONE in Phase 1; upstream cancellation CANNOT VERIFY HEADLESS | old engine.js:269 `onclick="hideWizard()"`. Now engine.js:278-279 `const ctl = new AbortController(); WZ.portraitAbort = ctl;`, engine.js:301-304 `cancelPortraits`, core.js:188 `signal`, chat.js:248 `cancel() { reader.cancel() }`. | Whether Cloudflare propagates a client disconnect to `cancel()` on the live platform is not testable here; the mocked test passes. |
| 6b | a `together` toggle mid-session rebuilds the stable block → full cache miss | CONFIRMED (old) / ALREADY DONE in Phase 1 | old core.js:390 `${ctx}${constellation}` inside `stable`. Now core.js:416 `${ctx}` only, core.js:445 `${transits}${upcoming}${focusDay}${constellation}` in the dynamic block. | Toggling still refreshes the dynamic block (core.js:440 `dynKey` includes `S.together`), which invalidates the history cache after it; only the stable block survives, as intended. |
| — | Per-turn baseline ($0.01 warm / $0.04 cold / $0.25 portrait pair / $1-2 per tester) | CANNOT VERIFY HEADLESS | No usage logging in code (chat.js:231-239 discards `usage` events). | |

## §2 Mobile

Checkable in code: font sizes, media queries, attributes, selectors, timers. Not checkable: iOS zoom-on-focus, keyboard/`offsetTop` behaviour, safe-area gaps, "sometimes visible".

| Claim | Verdict | Evidence | Note |
|---|---|---|---|
| Input font is 14px (styles.css:527) | CONFIRMED | styles.css:527 `textarea.input-box { ... font-size: 0.875rem; ...}`; no `font-size` on `html` (styles.css:48) so 0.875rem = 14px. | iOS zoom consequence: CANNOT VERIFY HEADLESS. |
| Same on wizard inputs, journal textarea, timeline date/select | CONFIRMED | styles.css:172-179 `.w-input, .w-select, .w-textarea { ... font-size: 0.875rem`; styles.css:543 `.j-textarea { ... font-size: 0.875rem`; styles.css:679 `.tl-ctl input, .tl-ctl select { ... font-size: 0.8rem` (12.8px); engine.js:103,107,111 inline `font-size:0.78rem`. | |
| `visualViewport.offsetTop` is ignored (app.js:755-770) | CONFIRMED; moved to app.js:820-833 | app.js:821 `const h = (window.visualViewport && window.visualViewport.height) \|\| window.innerHeight;` sets only `--app-h`; no `offsetTop` anywhere in js/. | |
| `html,body{overflow:hidden}`; fixed `.app` | CONFIRMED | styles.css:48 `html, body { height: 100%; overflow: hidden; }`; styles.css:631 `.app { ... position: fixed; top: 0; left: 0; ...}` inside `@media (max-width: 680px)` (626). | Header sliding off: CANNOT VERIFY HEADLESS. |
| Focus handling is two blind timers (350 ms / 300 ms) | CONFIRMED | app.js:835 `setTimeout(setAppHeight, 350)`, app.js:838 `setTimeout(scrollBottom, 300)`. | |
| No `enterkeyhint`; Enter sends; no newline possible on iOS | CONFIRMED (code) | index.html:142-143 textarea has no `enterkeyhint`/`autocapitalize`; app.js:293 `if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }`. | Shift availability on the iOS keyboard: CANNOT VERIFY HEADLESS. |

Nine fixes — current state (none implemented; all checkable):

| Fix | State | Evidence |
|---|---|---|
| 1. 16px inputs in media query; remove three inline 0.78rem (engine.js:103,107,111); no `maximum-scale=1` | Not done; inline sizes still at engine.js:103,107,111; viewport has no `maximum-scale` | `grep 16px styles.css` matches only paddings/gaps; index.html:5 `content="width=device-width, initial-scale=1.0, viewport-fit=cover"`. |
| 2. `--app-top` / `top: var(--app-top)` | Not done | No `--app-top` in styles.css or js/. |
| 3. `enterkeyhint="send" autocapitalize="sentences"` | Not done | index.html:142-143. |
| 4. `overscroll-behavior: none`; `contain` on scrollers | Not done | Neither string in styles.css. |
| 5. `.sb-scrim` with outside-tap close | Not done | No `sb-scrim` in index.html/styles.css; sidebar closes only via `closeSidebar()` calls (app.js:169,250,275,462). |
| 6. Tap targets ≥ 40px | Not done; all listed controls are under 40px | styles.css:433-434 `.btn-sm { padding: 6px 13px; ... font-size: 0.75rem` (≈28px tall); :520 `.starter { padding: 5px 12px; ... font-size: 0.74rem` (≈31px); :541 `.chip { padding: 4px 12px; ... font-size: 0.71rem` (≈24px); :597 `.pt-tab { padding: 5px 14px; ... font-size: 0.75rem` (≈31px); :471 `.sb-row button { ... padding: 2px 8px; ... font-size: 0.66rem` (≈19px); :402-403 `.btn-icon { width: 34px; height: 34px`. Timeline bars styles.css:683 `.tl-bar { flex: 1; min-width: 3px`, :730 `.tl-tone { ... min-width: 3px`; strips :682/:729 have no `overflow-x`. Heights are computed estimates. |
| 7. Tabs as a 5-column grid | Not done | styles.css:657-658 `.tabs { overflow-x: auto; ...} .tab { white-space: nowrap; flex-shrink: 0; }` with `.tab { padding: 11px 20px` (477): five tabs scroll horizontally. Whether "Portrait" is off-screen at 375px: plausible from the padding, not measured. |
| 8. Portrait padding 16px; transcript 0.85rem | Not done | styles.css:584 `.portrait-wrap { ... padding: 28px 32px` with no mobile override; :578 `.ch-msg { font-size: 0.78rem`. |
| 9. Muted text contrast | Not done; current values fail 4.5:1 on most surfaces | styles.css:19 `--text-muted: #8a7860` → 4.25:1 on `#ffffff`, 3.75:1 on `#f5f0e8`, 3.45:1 on `#ede7db`; styles.css:42 `--text-muted: #6a6a90` → 3.37:1 on `#16163a`, 3.87:1 on `#07071a`. Proposed `#6f5e46` → 6.24/5.50/5.07; `#8f8fb3` → 5.58/6.40 (WCAG formula, computed). |

## §2 Features — gaps and dead code

| Claim | Verdict | Evidence | Note |
|---|---|---|---|
| No feedback channel of any kind | CONFIRMED | `grep -i "feedback\|mailto"` over index.html, js/, functions/: no matches. | |
| Timeline is 100% English | CONFIRMED | timeline.js has no `t(` calls; hardcoded strings at 222-235 (`TL_TP`...`TL_HOUSE`), 355-364 (`TL_MODE_LINE`), 447-459 (controls "From", "Range", "Today", "Simple", "Detailed"). | |
| Sidebar rows Backup/Access code/Language/Privacy are English in every language | CONFIRMED | core.js:57-63: every non-`en` table lacks the keys `backup, exp, imp, access, update, language, privacy, view` (script-checked); core.js:66 `t()` falls back to `I18N.en`. The new Profile/Delete row (index.html:109) is not in `applyLang` at all (app.js:202-216). | Sessions/Clear are translated. |
| dates always `en-US` | CONFIRMED | `toLocaleDateString('en-US'` ×8 app.js, ×3 core.js, ×2 engine.js, ×5 timeline.js. | |
| Dead code: `SHARED_KEY` + `ccEncryptKey` family (core.js:1-36) refer to a filename that no longer exists | CONFIRMED | core.js:11-12 `const SHARED_KEY = ''; const SHARED_KEY_ENC = '';`, core.js:27 `'SHARED_KEY_ENC blob (paste into compass.html)'`; no other file references these names. | Still present. |
| unused `deleteProfile` | ALREADY DONE in Phase 1 | app.js:464 `deleteProfile(id);` | |
| profile→text block duplicated verbatim in engine.js:290-305 and 351-366 | CONFIRMED; now engine.js:307-322 and 368-383 | Both begin `const parts = [\`Name: ${profile.name}\`];` and end with the Gene Keys push. | |
| numerology lines computed four times | CONFIRMED | core.js:258-268 (`buildNatalContext`), engine.js:311-319, engine.js:372-380, app.js:102-111. | |
| two aspect tables with different orbs | CONFIRMED | engine.js:577-583 `ASPECTS` (orb 3/2/3/3/3), timeline.js:10-17 `TL_ASPECTS` + `TL_ORB = b => TL_SLOW.has(b) ? 3 : 2`. | |
| welcome HTML three times | CONFIRMED | index.html:132-136, app.js:60-65, app.js:435-440. | |
| `downloadDoc` duplicates `ccDownload` | CONFIRMED | app.js:753-764 re-creates the Blob/anchor that app.js:477-484 `ccDownload` already does. | |
| orphan CSS | CONFIRMED (examples) | styles.css:219-232 `.chart-hint`, :465 `.pname`, :466 `.ppos`, :588 `.portrait-tagline`, `.w-select` (172) — none referenced in index.html or js/ (script-checked; dynamic classes like `badge-${type}`, `m-${mode}`, `tl-ev-${kind}` are used). | |
| OpenAI path reachable only via `sk-…` BYOK; server-side `OPENAI_API_KEY` unreachable | CONFIRMED | chat.js:133 `useProvider = key.startsWith('sk-ant-') ? 'anthropic' : 'openai'`; chat.js:141 needs `provider: 'openai'` in the body, but no client caller passes `provider` (core.js:179-187 forwards it; app.js:373-381, engine.js:437, core.js:349 never set it) → default `'anthropic'` (chat.js:126). | |
| default model `gpt-4o` is stale; no streaming | CONFIRMED (code) | chat.js:169 `model: model \|\| env.MODEL_OPENAI \|\| 'gpt-4o'`; chat.js:163-174 non-streaming `r.json()`. | "Stale" is a judgement about OpenAI's catalogue; not checkable here. |
| Offline: astronomy CDN library not cached | CONFIRMED | sw.js:37 `if (url.origin !== self.location.origin) return;`; index.html:197 loads `cdn.jsdelivr.net/npm/astronomy-engine@2`. | Google Fonts (index.html:20) likewise uncached. |
| README lists only `index.html`; omits `js/`, `usage.js`, `USAGE`, `ADMIN_KEY`, labelled codes | OVERSTATED on "only"; omissions CONFIRMED | README.md:11-17 lists `index.html`, `functions/api/chat.js`, `_headers`, PWA assets — no `js/`, no `usage.js`; no `USAGE`/`ADMIN_KEY` anywhere; README.md:33-34 `anna-7x2k,dad-m9p4,me-0000` (no labels). README.md:56 still says `MODEL_DEEP` is "portraits and Together" (stale after `8e8d2b5`). | |
| Privacy note: `github.com/gelithe/docs` is plain text | CONFIRMED | index.html:41 `<code>github.com/gelithe/docs</code>`. | |

## §3 Sharing / budgets — what exists today

| Claim | Verdict | Evidence | Note |
|---|---|---|---|
| Testers use the owner's key through an access code; BYOK optional | CONFIRMED | chat.js:130-142: `byok` → user key; else `codes(env)` match → `env.ANTHROPIC_API_KEY`. | |
| No per-code budget is enforced by the proxy | CONFIRMED (gap) | chat.js:89-104 `recordUsage` only counts; no read of the tally before `callAnthropic` (chat.js:191-192). | |
| Key `usage:${label}` holds a monthly count | CONFIRMED | chat.js:92 `` const key = `usage:${label}` ``, chat.js:98 `monthCount`. | BYOK is recorded as label `own-key` (chat.js:156), so a "skip for BYOK" rule would need that label. |
| The stream loop already parses every SSE event; usage is not kept | CONFIRMED | chat.js:224-240 parses every `data:` line; `message_start`/`message_delta.usage` are ignored (only `stop_reason` read at 233). | |
| Per-tier caps: tiers are recorded, no caps | CONFIRMED | chat.js:100 `tiers: {...}`; no cap logic. `tier` is client-supplied (chat.js:126), so a cap keyed on it would be bypassable (see Missed A). | |
| `llmComplete` does not surface an error `code`; `validateOnly` returns no budget | CONFIRMED (gap) | core.js:190-193 `throw new Error(data.error \|\| ...)`; chat.js:145-148 returns `{ ok: true }`. | |
| KV is eventually consistent | CANNOT VERIFY HEADLESS | Platform property, not in code. | `recordUsage` is read-modify-write (chat.js:94-102); two parallel portrait calls (engine.js:287-290) race it. |
| `/api/usage` report exists, keyed by `ADMIN_KEY` | CONFIRMED | usage.js:19-24 checks `env.ADMIN_KEY`, usage.js:29 `env.USAGE.list({ prefix: 'usage:' })`. | |

## §5 Feedback — what exists

| Claim | Verdict | Evidence |
|---|---|---|
| No way to send feedback inside the app | CONFIRMED | No feedback/mailto strings (see §2). Sidebar rows are index.html:102-115 only. |
| No `/api/feedback` | CONFIRMED | `functions/api/` contains `chat.js`, `usage.js` only. |
| The label would come from the existing `codes(env)` | CONFIRMED | chat.js:27-37 `codes`, chat.js:137 `matched`. |
| `/api/usage` lists only usage rows today | CONFIRMED | usage.js:29 `prefix: 'usage:'`; HTML table at usage.js:71-73 has no feedback section. |

## §6 Prompt map — current line numbers

| Prompt | Audit said | Now | Verdict / note |
|---|---|---|---|
| Conversation persona + rules (`buildSystem`) | core.js:337-427 | core.js:360-451 (+23) | CONFIRMED location. "Two cached blocks": only the first block carries `cache_control` (core.js:439); the second is cached implicitly because the history marker sits later (chat.js:118). "12-item YOUR APPROACH list": WRONG, there are 13 `—` items (core.js:419-431, old 393-405 also 13). |
| quoted phrases at 399 and 403 | core.js:399, 403 | core.js:425 (`"according to my memory"`), 429 (`"once in a lifetime"`); also 428 (`"now,"`) | CONFIRMED, +26. |
| Mode lines | core.js:344-351 | core.js:367-375 | CONFIRMED, +23. |
| Focus-day instruction | core.js:368-369 | core.js:391-393 | CONFIRMED, +23. |
| Journal / Book / memory context | core.js:276-314 | core.js:277-358 (`buildJournalContext` 277-288, `buildBookContext` 294-300, `buildMemoryPrompt` 304-322, `digestedIds` 326-330, `maybeUpdateMemory` 336-358) | CONFIRMED, range grew. |
| The Story (`buildDeepAnalysisPrompt`) | engine.js:289-348 | engine.js:306-365 | CONFIRMED, +17. |
| The Analysis (`buildTechAnalysisPrompt`) | engine.js:350-413 | engine.js:367-430 | CONFIRMED, +17. |
| Language instruction | core.js:131-135 | core.js:131-135 (`docLangInstruction`, documents only) | CONFIRMED but incomplete: the conversation language line is core.js:403-406 (`langLine`). |
| Timeline readings (local, no model) | timeline.js:187-259 | timeline.js:222-259 are the reading tables/functions; 187-200 (`tlDayText`) is text for the model, not local readings; the Focus-layer wording is at 351-364 (`TL_MODE_LINE` etc.), 430 (`TL_TONE_PLAIN`), 375-429 (`tlFocus`) | OVERSTATED as a single range; wording lives in three places. |

## §7 "Done when" — Phases 2-5 (and Phase 1 for reference)

| Phase | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | 13+ message chat works; portrait streams; digest cost drops; tests in `/tmp` pass | Implemented in code; live behaviour CANNOT VERIFY HEADLESS; tests pass | app.js:365-370; app.js:695-699; core.js:304-358; `node phase1.test.mjs` → "14 tests passed" (§9 says 13). §9 text is stale on two points: asset version is 18 (index.html:21, sw.js:4) and portraits use tier `doc` (engine.js:437) since `8e8d2b5`. |
| 2 | A capped code gets a clear message | Not done | No cap logic in chat.js; core.js:190-193 surfaces only `error`. |
| 2 | feedback appears on `/api/usage` | Not done | No `/api/feedback`; usage.js:29 lists `usage:` only. |
| 2 (scope) | profile delete; privacy link; README refresh; `doc` tier + per-tier effort | profile delete ALREADY DONE (app.js:458-468); `doc` tier + effort ALREADY DONE (chat.js:52, 62); privacy link not done (index.html:41); README not refreshed (README.md:11-17, 56). | |
| 3 | Typing reliable in three focus cases; tabs visible; no rubber-band | CANNOT VERIFY HEADLESS; none of the nine fixes is in the code (table above) | styles.css:626-670 media query unchanged since `3b27a25`. |
| 4 | An exported `.ics` opens in Apple/Google | Not done; opening CANNOT VERIFY HEADLESS | `grep -i "\.ics\|text/calendar"` over index.html, js/, functions/: none. |
| 5 | (no criterion) Timeline/sidebar i18n; dead-code removal; prompt hygiene; offline CDN caching; essence | Not done | timeline.js (no `t(`), core.js:1-36 (`SHARED_KEY`), core.js:425/429 (quoted phrases), sw.js:37, core.js:273 (full Story always sent). |

## Extra 1 — Phase 1 diff review (`git diff 3b27a25 HEAD -- cloudflare-app`)

Cross-file references: every function the diff introduced resolves at runtime in the shared global scope. `docProgress` (app.js:743) and `renderPortrait` (app.js:675) are called from engine.js:281-285 only after user interaction, by which time all four scripts have run; `cancelPortraits` (engine.js:301), `forgetMemory` (app.js:451), `removeProfile` (app.js:458) exist for their `onclick`s. DOM ids referenced by the new code exist: `gen-story`/`gen-analysis` (engine.js:268, read at app.js:748), `ch-mem`/`arr-mem` (app.js:579-581, used by `toggleChapter('mem')` app.js:630-635), `sbProfileLbl`/`sbDeleteBtn` (index.html:109). `S` is a script-scoped `let` (app.js:174) reachable from core.js:344 at runtime, same pattern as before. No undefined `onclick` handlers (script-checked over index.html and js/). Nothing found that breaks at load or on the main paths. Logic issues:

| # | Severity | Where | Issue |
|---|---|---|---|
| B1 | Low | core.js:305 vs 352 | `buildMemoryPrompt` sends only `sessions.slice(0, 12)` of `fresh`, but `ids: [...seen, ...fresh.map(...)]` marks every fresh session as digested. With more than 12 undigested sessions (legacy migration via `digestedIds`, or many sessions ended while no key was set), the extras are never digested. |
| B2 | Low | chat.js:233-238 and app.js:335 | The stop notes ("— The reply reached its length limit." etc.) are streamed as reply text; the client stores the whole text as the assistant turn, so the note is replayed to the model as its own words in later turns (app.js:375), saved to the Book (app.js:423) and fed to the digest (core.js:308). |
| B3 | Low | chat.js:73 | `isModelRejected` treats any 400 whose message contains "model" as a bad model ID (e.g. a message like "... for this model"), causing one extra upstream call whenever a non-default `MODEL_*` is set. Only relevant once `MODEL_*` are configured. |
| B4 | Cosmetic | chat.js:64 | `/haiku\|-4-5\b\|-3-/` also skips `effort` for Opus 4.5, which accepts it (API reference: effort on Opus 4.5/4.6, Sonnet 4.6). Sonnet 4.6, the deployed default, does accept `output_config.effort`, so the `low` setting takes effect today. |
| B5 | Low | core.js:440, app.js:454 | `dynKey` does not include the digest, so after "Forget this" the frozen dynamic block of the open session still carries the old digest until a new session/mode/day. Same for a digest refreshed mid-session (intended for caching, but makes "Forget" lag). |
| B6 | Low | app.js:569 | The memory chapter renders only when `sessions.length > 0`; a restored backup that has `cc_<id>_memory` but no sessions (or sessions merged under other ids) keeps injecting an invisible digest (core.js:401). |
| B7 | Cosmetic | app.js:749 | The wizard word counter shows "done" for a document that was aborted or failed (`busy=false` in all three cases). |
| B8 | Doc | AUDIT-2026-10.md:227, README.md:56 | Status row says asset v17 and `deep` for portraits; `8e8d2b5` made it v18 and `doc`. README still routes portraits to `MODEL_DEEP`. |

Checked and fine: `historyWindow` on non-alternating histories (while loop at app.js:368 advances to the next user turn; `start < msgs.length` guard); abort path (engine.js:281-284 `.catch(() => false).finally(...)`, engine.js:292 skips the alert when aborted); `removeProfile` resets `S.together`/`TL.with` via `loadProfile` (app.js:52-54) and reloads into the wizard when no profile remains (app.js:467 → app.js:9-12); 1h stable block followed by a 5-min history marker is an allowed TTL order (API reference `shared/prompt-caching.md:176`).

## Extra 2 — Things the audit missed

| # | Area | Finding | Evidence |
|---|---|---|---|
| M1 | Security / cost | The proxy is a general-purpose Claude endpoint for anyone holding a code: `model`, `max_tokens`, `system`, `messages`, `tier` are taken from the request body verbatim, so a tester can run any model (Opus/Fable) at any length with any prompt on the owner's key, and any per-tier cap keyed on `tier` is bypassable by sending `tier: 'chat'`. | chat.js:126 destructures the body; chat.js:178 `const wantModel = model \|\| modelForTier(env, tier)`; chat.js:180-181 `max_tokens: max_tokens \|\| 1500`, `payload.system = system`. |
| M2 | Cost / correctness of the tally | `recordUsage` is a KV read-modify-write with no atomicity; the wizard fires two portrait requests in parallel, so one increment can be lost. Any budget built on this counter inherits the drift. No request-size or rate limit on `/api/chat`. | chat.js:94-102; engine.js:287-290 `Promise.all([write('story'...), write('analysis'...)])`. |
| M3 | Security (admin) | `ADMIN_KEY` is accepted in the query string and compared with `!==`; the key then sits in browser history and Cloudflare request logs. The service worker also stores the `/api/usage?key=…` navigation response in Cache Storage (network-first with `cache.put`), ignoring the function's `no-store`, and its header comment claims API calls are never intercepted while only non-GET requests are skipped. | usage.js:17 `url.searchParams.get('key')`, usage.js:22 `given !== env.ADMIN_KEY`, usage.js:77 `'cache-control': 'no-store'`; sw.js:3 comment, sw.js:35 `if (req.method !== 'GET') return;`, sw.js:40-45 navigate branch `caches.open(CACHE).then(c => c.put(req, copy))`. |
| M4 | XSS (self/backup) | Profile names are interpolated unescaped inside the synastry link spans, unlike every other render path. A crafted backup file (`importAll`, app.js:500-549) is the only non-self vector. | timeline.js:515 `` `${pr.A.name}'s ${l.p} ${l.asp} ${pr.B.name}'s ${l.q}` `` (the bold header on 514 uses `esc`). |
| M5 | i18n | The new Profile/Delete row has no `applyLang` wiring and no I18N keys; the root cause of the English sidebar rows is eight missing keys per language, not a Timeline-style omission. | index.html:109; app.js:202-216; core.js:57-63 (missing `backup, exp, imp, access, update, language, privacy, view`). |
| M6 | Prompt freshness | The dynamic block is frozen per session (`dynKey` = session, mode, focus day, lang, day, together), so journal entries written mid-session are not seen by the model until a new session. Deliberate for caching; the audit did not mention the trade-off. | core.js:433-448. |
| M7 | Output ceilings with thinking models | `max_tokens` 2000 (chat) and 1200 (digest) must also cover adaptive-thinking tokens on 5.5 models; a long think at effort `low` can still end in the "length limit" note instead of a reply. Not testable here. | app.js:376, core.js:349, engine.js:437; chat.js:80 `max_tokens` note. |
| M8 | OpenAI BYOK | The OpenAI branch sends `max_tokens` and ignores `tier`/streaming; newer OpenAI models reject `max_tokens` in favour of `max_completion_tokens`. CANNOT VERIFY HEADLESS, flagged because the audit called the path "stale" without saying where. | chat.js:169. |
| M9 | Headers | `_headers` sets only cache rules; no CSP / `X-Frame-Options` / `Referrer-Policy`. Inline `onclick` handlers throughout index.html would constrain a CSP. | _headers:1-8; index.html passim. |
| M10 | Test coverage note | `phase1.test.mjs` (scratchpad, not in the repo) imports `functions/api/chat.js` directly and runs core/engine/app in a `vm` sandbox; it exercises the proxy and the pure client helpers, not the DOM paths (`docProgress`, `renderBook` memory chapter, `removeProfile`). | phase1.test.mjs:7, 147-149. |

## Extra 3 — Mobile: what is checkable

Checkable and verified above: all font sizes (styles.css:179, 527, 543, 679; engine.js:103/107/111), `overflow: hidden` (styles.css:48), fixed `.app` in the ≤680px query (631), the two timers (app.js:835, 838), absence of `offsetTop` handling (app.js:820-826), absence of `enterkeyhint`/`autocapitalize` (index.html:142-143), absence of `maximum-scale` (index.html:5), tab overflow mode (styles.css:657-658), tap-target paddings/font sizes (433, 471, 520, 541, 597, 402), bar `min-width: 3px` (683, 730), portrait padding (584), transcript size (578), muted colours and their contrast ratios (19, 42). Not checkable headless: whether iOS zooms on focus, the visual-viewport offset during the keyboard animation, the safe-area gap with the keyboard up, whether "Portrait" is actually off-screen at a given device width, and whether Shift+Enter is reachable on the iOS keyboard.
