// ─── Chart Compass · usage report ────────────────────────────────────────────
// Shows how much each access code has been used. Requires:
//   USAGE       a KV namespace binding (Cloudflare → Settings → Bindings)
//   ADMIN_KEY   a long random string you choose; without it this stays closed
//
// Open:  https://compass.sagemodeai.com/api/usage?key=YOUR_ADMIN_KEY
//        add &format=json for the raw numbers.
//
// It reports counts, not content: how many calls each label made, when it was
// last seen, and the split by tier. Nothing anyone wrote is stored or shown.

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj, null, 2), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const given = url.searchParams.get('key') || request.headers.get('x-admin-key') || '';

  if (!env.ADMIN_KEY) {
    return json({ error: 'Usage reporting is closed: set an ADMIN_KEY variable in Cloudflare first.' }, 503);
  }
  if (given !== env.ADMIN_KEY) {
    return json({ error: 'Not authorised.' }, 401);
  }
  if (!env.USAGE) {
    return json({ error: 'No USAGE KV namespace is bound. Counts are not being kept yet — the app itself is unaffected.' }, 503);
  }

  const list = await env.USAGE.list({ prefix: 'usage:' });
  const rows = [];
  for (const k of list.keys) {
    const rec = JSON.parse((await env.USAGE.get(k.name)) || '{}');
    rows.push({ label: k.name.replace(/^usage:/, ''), ...rec });
  }
  rows.sort((a, b) => (b.total || 0) - (a.total || 0));

  if (url.searchParams.get('format') === 'json') return json({ people: rows });

  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const when = t => {
    if (!t) return '—';
    const days = Math.floor((Date.now() - new Date(t)) / 86400000);
    return days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
  };
  const body = rows.length
    ? rows.map(r => `<tr>
        <td><b>${esc(r.label)}</b></td>
        <td>${r.total || 0}</td>
        <td>${r.monthCount || 0}</td>
        <td>${when(r.lastSeen)}</td>
        <td class="q">${esc(Object.entries(r.tiers || {}).map(([k, v]) => `${k} ${v}`).join(' · ') || '—')}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" class="q">Nothing recorded yet. Counts begin at the next message sent through the app.</td></tr>`;

  return new Response(`<!doctype html><meta charset="utf-8">
<title>Chart Compass · usage</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px;
         background: #f5f0e8; color: #2c2416; }
  @media (prefers-color-scheme: dark) { body { background: #0f0f28; color: #e8e3d8; } }
  h1 { font-weight: 500; font-size: 1.3rem; letter-spacing: .04em; }
  table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: .9rem; }
  th { text-align: left; font-weight: 500; opacity: .6; font-size: .75rem; text-transform: uppercase;
       letter-spacing: .06em; padding-bottom: 8px; }
  td { padding: 10px 8px 10px 0; border-top: 1px solid rgba(128,128,128,.25); }
  .q { opacity: .6; }
  p { font-size: .8rem; opacity: .65; line-height: 1.6; }
</style>
<h1>✦ Usage by access code</h1>
<table>
  <tr><th>Who</th><th>All time</th><th>This month</th><th>Last seen</th><th>By tier</th></tr>
  ${body}
</table>
<p>Counts only — how often each code was used, never anything written with it.
Conversations live on each person's own device and are not visible here or anywhere else.</p>`,
    { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}
