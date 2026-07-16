// ─── Chart Compass · serverless model proxy (Vercel) ─────────────────────────
// Keeps the API key server-side, gates access with per-person codes, and lets a
// user bring their own key. Provider-abstracted so OpenAI etc. can be added.
//
// Environment variables (set in the Vercel dashboard → Project → Settings → Env):
//   ANTHROPIC_API_KEY   your Anthropic key (used when a caller passes a valid code)
//   ACCESS_CODES        comma-separated codes, e.g. "anna-7x2k,dad-m9p4,me-0000"
//                       (if unset/empty, the proxy runs OPEN — dev only)
//   OPENAI_API_KEY      optional; enables provider:"openai"
//
// Request body (POST JSON):
//   { provider?, model?, max_tokens?, system?, messages, accessCode?, userKey? }
// Response: { text }  |  { error }

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_URL    = 'https://api.openai.com/v1/chat/completions';

function codes() {
  return (process.env.ACCESS_CODES || '').split(',').map(s => s.trim()).filter(Boolean);
}

async function callAnthropic(key, { model, max_tokens, system, messages }) {
  const body = { model: model || 'claude-sonnet-4-6', max_tokens: max_tokens || 1500, messages };
  if (system) body.system = system;
  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `Anthropic HTTP ${r.status}`);
  return data.content?.[0]?.text || '';
}

async function callOpenAI(key, { model, max_tokens, system, messages }) {
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: model || 'gpt-4o', max_tokens: max_tokens || 1500, messages: msgs })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `OpenAI HTTP ${r.status}`);
  return data.choices?.[0]?.message?.content || '';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { provider = 'anthropic', model, max_tokens, system, messages, accessCode, userKey } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Decide which key to use. BYOK (the caller's own key) always wins.
  // Otherwise the access code must match one configured on the server.
  let key = null, useProvider = provider;
  const byok = typeof userKey === 'string' && userKey.trim();

  if (byok) {
    key = userKey.trim();
    useProvider = key.startsWith('sk-ant-') ? 'anthropic' : 'openai';
  } else {
    const allowed = codes();
    if (allowed.length && !allowed.includes(String(accessCode || '').trim())) {
      return res.status(401).json({ error: 'Invalid or missing access code.' });
    }
    key = useProvider === 'openai' ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;
  }
  if (!key) return res.status(500).json({ error: `Server is missing the ${useProvider} key.` });

  try {
    const text = useProvider === 'openai'
      ? await callOpenAI(key, { model, max_tokens, system, messages })
      : await callAnthropic(key, { model, max_tokens, system, messages });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: e.message || 'Failed to reach the model provider.' });
  }
}
