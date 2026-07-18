// ─── Chart Compass · Cloudflare Pages Function proxy ─────────────────────────
// Keeps the API key server-side, gates access with per-person codes, supports
// bring-your-own-key, and STREAMS the model response. Cloudflare limits CPU
// time (not the time spent waiting on the model), so long documents complete
// without the timeout that constrained the Vercel build.
//
// Environment variables (Cloudflare Pages → Settings → Environment variables):
//   ANTHROPIC_API_KEY   your Anthropic key (used when a caller passes a valid code)
//   ACCESS_CODES        comma-separated codes, e.g. "anna-7x2k,dad-m9p4,me-0000"
//                       (if unset/empty, the proxy runs OPEN — dev only)
//   OPENAI_API_KEY      optional; enables provider:"openai" and OpenAI BYOK

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_URL    = 'https://api.openai.com/v1/chat/completions';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const codes = env => (env.ACCESS_CODES || '').split(',').map(s => s.trim()).filter(Boolean);

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { provider = 'anthropic', model, max_tokens, system, messages, accessCode, userKey, validateOnly } = body || {};

  // Resolve the key. BYOK wins; otherwise the access code must match one on the server.
  let key = null, useProvider = provider;
  const byok = typeof userKey === 'string' && userKey.trim();
  if (byok) {
    key = userKey.trim();
    useProvider = key.startsWith('sk-ant-') ? 'anthropic' : 'openai';
  } else {
    const allowed = codes(env);
    if (allowed.length && !allowed.includes(String(accessCode || '').trim())) {
      return json({ error: 'Invalid or missing access code.' }, 401);
    }
    key = useProvider === 'openai' ? env.OPENAI_API_KEY : env.ANTHROPIC_API_KEY;
  }

  // Cheap auth check used to validate a code the moment it's entered.
  if (validateOnly) {
    if (!byok && !key) return json({ error: 'Server is missing the API key.' }, 500);
    return json({ ok: true }, 200);
  }

  if (!Array.isArray(messages) || messages.length === 0) return json({ error: 'messages array required' }, 400);
  if (!key) return json({ error: `Server is missing the ${useProvider} key.` }, 500);

  // ── OpenAI: non-streaming JSON (client falls back to { text }) ──
  if (useProvider === 'openai') {
    const msgs = system ? [{ role: 'system', content: system }, ...messages] : messages;
    const r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: model || 'gpt-4o', max_tokens: max_tokens || 1500, messages: msgs })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: data?.error?.message || `OpenAI HTTP ${r.status}` }, r.status);
    return json({ text: data.choices?.[0]?.message?.content || '' }, 200);
  }

  // ── Anthropic: stream tokens as plain text ──
  const payload = { model: model || 'claude-sonnet-4-6', max_tokens: max_tokens || 1500, messages, stream: true };
  if (system) payload.system = system;

  const upstream = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(payload)
  });
  if (!upstream.ok || !upstream.body) {
    const e = await upstream.json().catch(() => ({}));
    return json({ error: e?.error?.message || `Anthropic HTTP ${upstream.status}` }, upstream.status || 502);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const dec = new TextDecoder();
      const enc = new TextEncoder();
      let buf = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop();
          for (const line of lines) {
            const l = line.trim();
            if (!l.startsWith('data:')) continue;
            const d = l.slice(5).trim();
            if (!d || d === '[DONE]') continue;
            try {
              const ev = JSON.parse(d);
              if (ev.type === 'content_block_delta' && ev.delta && typeof ev.delta.text === 'string') {
                controller.enqueue(enc.encode(ev.delta.text));
              }
            } catch { /* ignore keep-alives / partial frames */ }
          }
        }
      } catch { /* upstream dropped */ }
      controller.close();
    }
  });

  return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-cache' } });
}
