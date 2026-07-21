// ─── APP INIT ────────────────────────────────────────────────────────────────
function init() {
  applyTheme(localStorage.getItem('cc_theme') || 'light');
  applyLang();

  const profiles = getProfiles();
  const activeId = getActiveId();

  if (!profiles.length) {
    // Fresh install — show wizard
    showApp();
    showWizard(null);
  } else {
    // Load active profile (or first profile)
    const id = (activeId && profiles.find(p => p.id === activeId)) ? activeId : profiles[0].id;
    setActiveId(id);
    loadProfile(id);
    showApp();
  }

  document.getElementById('dateBadge').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function showApp() {
  document.getElementById('app').style.display = 'grid';
}

function loadProfile(id) {
  setActiveId(id);
  const profile = getProfiles().find(p => p.id === id);
  if (!profile) return;

  // Update header
  document.getElementById('profileAvatar').textContent = profile.emoji || '✦';
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('hSub').textContent =
    [profile.birthDate ? new Date(profile.birthDate + 'T12:00').toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'}) : null,
     profile.birthPlace].filter(Boolean).join(' · ') || t('sub');

  // Update welcome message
  const wh = document.getElementById('welcomeH');
  if (wh) wh.textContent = `${t('welcomeH')}, ${profile.name}?`;

  // Update sidebar chart data
  updateSidebarChart(profile);

  // Reset conversation state for this profile
  S.messages = [];
  S.sessionId = String(Date.now());
  S.mode = 'reflect';
  S.together = new Set();

  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === 'reflect');
  });

  document.getElementById('convo').innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-orb">✦</div>
      <h3 id="welcomeH">${esc(t('welcomeH'))}, ${esc(profile.name)}?</h3>
      <p>${esc(t('welcomeP'))}</p>
    </div>`;

  renderStarters();
  renderTogetherRow();
  renderJournal();
  renderBook();
  renderPortrait();
}

function updateSidebarChart(profile) {
  const label = document.getElementById('sbChartLabel');
  const data  = document.getElementById('sbChartData');
  label.textContent = profile.birthDate
    ? `${profile.name} · ${profile.birthPlace || profile.birthDate}`
    : 'Your Chart';

  if (!profile.chartText?.trim()) {
    data.innerHTML = `<div style="color:var(--text-muted);font-size:0.7rem;font-style:italic;line-height:1.5;">
      No chart data added yet.<br>
      <span style="cursor:pointer;color:var(--gold-dim);text-decoration:underline;" onclick="editProfile()">Add chart →</span>
    </div>`;
    return;
  }

  // Try to extract key lines from pasted chart text
  const lines = profile.chartText.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 2)
    .slice(0, 14);

  data.innerHTML = lines.map(l =>
    `<div class="prow" style="font-size:0.7rem;color:var(--text-muted);">${esc(l)}</div>`
  ).join('') || `<div style="color:var(--text-muted);font-size:0.7rem;">Chart data saved.</div>`;
}

// ─── PROFILE DROPDOWN ─────────────────────────────────────────────────────────
function toggleProfileDropdown() {
  const dd = document.getElementById('profileDropdown');
  if (dd.style.display === 'none') {
    renderProfileDropdown();
    dd.style.display = 'block';
    setTimeout(() => document.addEventListener('click', closeDropdown), 10);
  } else {
    dd.style.display = 'none';
  }
}

function closeDropdown(e) {
  const dd = document.getElementById('profileDropdown');
  if (!dd.contains(e.target) && !document.getElementById('profilePill').contains(e.target)) {
    dd.style.display = 'none';
    document.removeEventListener('click', closeDropdown);
  }
}

function renderProfileDropdown() {
  const profiles = getProfiles();
  const activeId = getActiveId();
  const dd = document.getElementById('profileDropdown');
  dd.innerHTML = profiles.map(p => `
    <div class="pd-item ${p.id === activeId ? 'active' : ''}" onclick="switchProfile('${p.id}')">
      <span class="pd-emoji">${p.emoji || '✦'}</span>
      <span>${esc(p.name)}</span>
      ${p.id === activeId ? '<span class="pd-check">✓</span>' : ''}
    </div>`).join('') +
    `<div class="pd-item pd-add" onclick="addNewProfile()">
      <span class="pd-emoji">+</span>
      <span>Add new profile</span>
    </div>`;
}

function switchProfile(id) {
  document.getElementById('profileDropdown').style.display = 'none';
  loadProfile(id);
}

function addNewProfile() {
  document.getElementById('profileDropdown').style.display = 'none';
  showWizard(null);
}

function editProfile() {
  const id = getActiveId();
  closeSidebar();
  if (id) showWizard(id);
}

// ─── STATE ────────────────────────────────────────────────────────────────────
let S = {
  mode: 'reflect',
  messages: [],
  sessionId: String(Date.now()),
  jType: 'milestone',
  together: new Set(),
  portraitView: 'story',
  generating: {},
  lang: localStorage.getItem('cc_lang') || 'en'
};

// ─── LANGUAGE ─────────────────────────────────────────────────────────────────
function setLang(code) {
  S.lang = LANGS[code] ? code : 'en';
  localStorage.setItem('cc_lang', S.lang);
  applyLang();
}

function applyLang() {
  document.documentElement.lang = S.lang;
  const opts = Object.keys(LANGS).map(c => `<option value="${c}">${LANGS[c].native}</option>`).join('');
  ['langSelect', 'langSelectSidebar'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    if (!sel.options.length) sel.innerHTML = opts;
    sel.value = S.lang;
  });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sbLangLbl', t('language'));
  set('sbPrivacyLbl', t('privacy'));
  set('sbPrivacyBtn', t('view'));
  set('newBtn', t('new'));
  set('sbModeLabel', t('modeLbl'));
  set('sbEditChartLbl', t('editChart'));
  set('sbEditBtn', t('edit'));
  set('sbSessionsLbl', t('sessions'));
  set('sbAccessLbl', t('access'));
  set('sbAccessBtn', t('update'));
  set('sbBackupLbl', t('backup'));
  set('sbExportBtn', t('exp'));
  set('sbImportBtn', t('imp'));
  set('sbClearBtn', t('clear'));

  document.querySelectorAll('.mode-btn .mode-label').forEach(el => {
    const m = el.parentElement.dataset.mode;
    el.textContent = t(m);
  });
  document.querySelectorAll('.tab').forEach(el => {
    el.textContent = t(el.dataset.tab);
  });

  // header sub falls back to translated guide label when no birth data is shown
  const prof = getActiveProfile();
  const hs = document.getElementById('hSub');
  if (hs) hs.textContent = prof
    ? ([prof.birthDate ? new Date(prof.birthDate + 'T12:00').toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'}) : null, prof.birthPlace].filter(Boolean).join(' · ') || t('sub'))
    : t('sub');
  renderStarters();
  renderTogetherRow();
  renderPortrait();
  const wp = document.querySelector('#welcome p'); if (wp) wp.textContent = t('welcomeP');
  const wh = document.getElementById('welcomeH');
  if (wh) wh.textContent = t('welcomeH') + (prof ? ', ' + prof.name : '') + '?';
  const ib = document.getElementById('inputBox');
  if (ib) ib.placeholder = t('say');
}

// ─── MODE ─────────────────────────────────────────────────────────────────────
function setMode(btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  S.mode = btn.dataset.mode;
  renderStarters();
  renderTogetherRow();
  document.getElementById('inputBox').placeholder = PLACEHOLDERS[S.mode] || t('say');
  closeSidebar();
}

function renderTogetherRow() {
  const row = document.getElementById('togetherRow');
  if (!row) return;
  if (S.mode !== 'together') { row.style.display = 'none'; return; }
  const others = getProfiles().filter(p => p.id !== getActiveId());
  if (!others.length) {
    row.innerHTML = `<span style="font-size:0.74rem;color:var(--text-muted);">Add another profile (▾ profile menu → Add new profile) to explore relationships together.</span>`;
  } else {
    row.innerHTML = `<span style="font-size:0.7rem;color:var(--gold-dim);letter-spacing:0.06em;text-transform:uppercase;">With:</span>` +
      others.map(p => `<div class="starter${S.together.has(p.id) ? ' tg-on' : ''}" onclick="toggleTogether('${p.id}')">${p.emoji || '✦'} ${esc(p.name)}</div>`).join('');
  }
  row.style.display = 'flex';
}

function toggleTogether(id) {
  S.together.has(id) ? S.together.delete(id) : S.together.add(id);
  renderTogetherRow();
}

function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('open'); }
function closeSidebar()  { document.querySelector('.sidebar').classList.remove('open'); }

function showPrivacy() { closeSidebar(); document.getElementById('privacyOverlay').style.display = 'flex'; }
function hidePrivacy() { document.getElementById('privacyOverlay').style.display = 'none'; }

function renderStarters() {
  const items = STARTERS[S.mode] || STARTERS.reflect;
  document.getElementById('starters').innerHTML = items.map(s =>
    `<div class="starter" onclick="useStarter(this)">${esc(s)}</div>`
  ).join('');
}

function useStarter(el) {
  const box = document.getElementById('inputBox');
  box.value = el.textContent;
  autoGrow(box);
  box.focus();
}

// ─── CONVERSATION ─────────────────────────────────────────────────────────────
function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }
function autoGrow(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 130) + 'px'; }

async function send() {
  const box = document.getElementById('inputBox');
  const text = box.value.trim();
  const profile = getActiveProfile();
  if (!text || !profile) return;

  if (!getKey(profile.id)) {
    alert('Access not set up yet. Open Edit profile and enter your access code (or your own API key).');
    return;
  }

  const w = document.getElementById('welcome');
  if (w) w.remove();

  S.messages.push({ role: 'user', content: text });
  appendMsg({ role: 'user', content: text });
  box.value = ''; box.style.height = 'auto';

  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  let typingEl = addTyping();
  let bubbleEl = null;

  // Live-stream tokens into an assistant bubble as they arrive
  const onChunk = (partial) => {
    if (!bubbleEl) {
      if (typingEl) { typingEl.remove(); typingEl = null; }
      bubbleEl = document.createElement('div');
      bubbleEl.className = 'msg assistant';
      bubbleEl.innerHTML = '<div class="bubble"></div><div class="msg-meta">✦ Compass</div>';
      document.getElementById('convo').appendChild(bubbleEl);
    }
    bubbleEl.querySelector('.bubble').innerHTML = fmtText(partial);
    scrollBottom();
  };

  try {
    const reply = await callAPI(profile, onChunk);
    if (typingEl) { typingEl.remove(); typingEl = null; }
    S.messages.push({ role: 'assistant', content: reply });
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (bubbleEl) {
      bubbleEl.querySelector('.bubble').innerHTML = fmtText(reply);
      bubbleEl.querySelector('.msg-meta').textContent = `✦ Compass · ${time}`;
    } else {
      appendMsg({ role: 'assistant', content: reply });
    }
    saveSessionData(profile.id);
  } catch (err) {
    if (typingEl) typingEl.remove();
    if (bubbleEl) bubbleEl.remove();
    const e = document.createElement('div');
    e.className = 'err-msg';
    if (/access code/i.test(err.message || '')) {
      e.textContent = 'Your access code was rejected. Update it in the sidebar → Access code → Update.';
    } else {
      e.textContent = 'Error: ' + (err.message || 'Could not reach the API. Check your connection and try again.');
    }
    document.getElementById('convo').appendChild(e);
  }

  btn.disabled = false;
  scrollBottom();
}

async function callAPI(profile, onChunk) {
  return llmComplete({
    system: buildSystem(S.mode, profile),
    messages: S.messages.slice(-24),
    max_tokens: 1500,
    onChunk
  });
}

function appendMsg(msg) {
  const convo = document.getElementById('convo');
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const profile = getActiveProfile();
  const div = document.createElement('div');
  div.className = 'msg ' + msg.role;
  div.innerHTML =
    `<div class="bubble">${fmtText(msg.content)}</div>` +
    `<div class="msg-meta">${msg.role === 'user' ? (profile?.name || 'You') : '✦ Compass'} · ${time}</div>`;
  convo.appendChild(div);
  scrollBottom();
}

function addTyping() {
  const convo = document.getElementById('convo');
  const el = document.createElement('div');
  el.className = 'typing';
  el.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  convo.appendChild(el);
  scrollBottom();
  return el;
}

function scrollBottom() { const c = document.getElementById('convo'); c.scrollTop = c.scrollHeight; }

function fmtText(raw) {
  return raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

// ─── SESSIONS / THE BOOK ─────────────────────────────────────────────────────
function saveSessionData(profileId) {
  if (S.messages.length < 2) return;
  const all = getSessions(profileId);
  const firstUser = S.messages.find(m => m.role === 'user')?.content || 'Session';
  const title = firstUser.length > 65 ? firstUser.slice(0, 62) + '…' : firstUser;
  const session = { id: S.sessionId, date: new Date().toISOString(), mode: S.mode, title, messages: [...S.messages] };
  const idx = all.findIndex(s => s.id === S.sessionId);
  if (idx >= 0) all[idx] = session; else all.unshift(session);
  saveSessions(profileId, all.slice(0, 120));
  renderBook();
  // Refresh the distilled memory in the background (gated: at most once per new session)
  maybeUpdateMemory(profileId);
}

function newSession() {
  S.messages = []; S.sessionId = String(Date.now());
  const profile = getActiveProfile();
  document.getElementById('convo').innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-orb">✦</div>
      <h3 id="welcomeH">${esc(t('welcomeH'))}${profile ? ', ' + esc(profile.name) : ''}?</h3>
      <p>${esc(t('welcomeP'))}</p>
    </div>`;
}

function clearSessions() {
  const id = getActiveId();
  if (!id || !confirm('Clear all conversations for this profile?')) return;
  saveSessions(id, []);
  renderBook();
}

// ─── BACKUP / RESTORE ─────────────────────────────────────────────────────────
function ccStamp() {
  // avoid locale-dependent slashes in filenames
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function ccDownload(filename, text, type) {
  const blob = new Blob([text], { type: type || 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportAll() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    // include everything except stored API keys (kept out of backups for safety)
    if (k && k.startsWith('cc_') && !k.endsWith('_key')) data[k] = localStorage.getItem(k);
  }
  const payload = { app: 'chart-compass', version: 1, exported: new Date().toISOString(), data };
  ccDownload(`chart-compass-backup-${ccStamp()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  const n = getProfiles().length;
  alert(`Backup saved — ${n} profile${n!==1?'s':''}, with all conversations, journals and portraits.\n\nKeep this file safe: it restores everything on a new device or browser. (Your API key is not included — you re-enter it once after restoring.)`);
}

function importAll() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try {
        const parsed = JSON.parse(reader.result);
        data = parsed.data || parsed;
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('bad');
        if (!Object.keys(data).some(k => k.startsWith('cc_'))) throw new Error('bad');
      } catch {
        alert('That file could not be read as a Chart Compass backup.');
        return;
      }
      const merge = confirm('Restore this backup?\n\nOK — MERGE with what you have now (adds/updates, keeps current data). Recommended.\n\nCancel — REPLACE everything (wipes current profiles, chats and journals first).');
      if (!merge) {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('cc_') && !k.endsWith('_key')) toRemove.push(k);
        }
        toRemove.forEach(k => localStorage.removeItem(k));
      }
      Object.entries(data).forEach(([k, v]) => {
        if (merge && (k.endsWith('_sessions') || k.endsWith('_journal'))) {
          const byId = new Map();
          [...JSON.parse(localStorage.getItem(k) || '[]'), ...JSON.parse(v || '[]')]
            .forEach(item => byId.set(String(item.id), item));
          localStorage.setItem(k, JSON.stringify([...byId.values()]));
        } else if (merge && k === 'cc_profiles') {
          const byId = new Map();
          [...JSON.parse(localStorage.getItem(k) || '[]'), ...JSON.parse(v || '[]')]
            .forEach(p => byId.set(p.id, { ...byId.get(p.id), ...p }));
          localStorage.setItem(k, JSON.stringify([...byId.values()]));
        } else {
          localStorage.setItem(k, v);
        }
      });
      alert('Backup restored. The app will reload now.');
      location.reload();
    };
    reader.readAsText(file);
  };
  input.click();
}

function downloadSession(id) {
  const pid = getActiveId();
  if (!pid) return;
  const s = getSessions(pid).find(x => x.id === id);
  if (!s) return;
  const p = getActiveProfile();
  const when = new Date(s.date).toLocaleString();
  const md = `# ${s.title}\n\n*${when} · ${s.mode}${p ? ' · ' + p.name : ''}*\n\n---\n\n` +
    s.messages.map(m => `**${m.role === 'user' ? (p?.name || 'You') : 'Compass'}**\n\n${m.content}`).join('\n\n---\n\n') + '\n';
  const slug = (s.title || 'session').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  ccDownload(`chat-${slug || 'session'}.md`, md, 'text/markdown');
}

function renderBook() {
  const id = getActiveId();
  if (!id) return;
  const sessions = getSessions(id);
  const container = document.getElementById('bookChapters');
  if (!sessions.length) { container.innerHTML = '<p class="book-empty">Your conversations will appear here as chapters.</p>'; return; }
  container.innerHTML = sessions.map((s, i) => {
    const date = new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const exchanges = Math.ceil(s.messages.length / 2);
    const msgsHtml = s.messages.map(m =>
      `<div class="ch-msg ${m.role}"><strong>${m.role === 'user' ? 'You' : 'Compass'}</strong>${esc(m.content)}</div>`
    ).join('');
    return `
      <div class="chapter">
        <div class="chapter-head" onclick="toggleChapter(${i})">
          <div>
            <div class="chapter-title">${esc(s.title)}</div>
            <div class="chapter-meta">${date} · ${exchanges} exchange${exchanges !== 1 ? 's' : ''} · ${s.mode}</div>
          </div>
          <span class="chapter-arrow" id="arr-${i}">▸</span>
        </div>
        <div class="chapter-body" id="ch-${i}">
          <div style="display:flex;gap:6px;margin:4px 0 12px;flex-wrap:wrap;">
            <button class="btn-sm" style="color:var(--gold);border-color:var(--border-active);" onclick="resumeSession('${s.id}')">↩ Continue this conversation</button>
            <button class="btn-sm" onclick="downloadSession('${s.id}')">⬇ Save as file</button>
          </div>
          ${msgsHtml}
        </div>
      </div>`;
  }).join('');
}

function resumeSession(id) {
  const pid = getActiveId();
  if (!pid) return;
  const s = getSessions(pid).find(x => x.id === id);
  if (!s) return;
  S.messages = [...s.messages];
  S.sessionId = s.id;
  S.mode = s.mode || 'reflect';
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === S.mode));
  renderStarters();
  document.getElementById('inputBox').placeholder = PLACEHOLDERS[S.mode] || 'Say anything…';
  const convo = document.getElementById('convo');
  convo.innerHTML = '';
  s.messages.forEach(m => appendMsg(m));
  switchTab('compass', document.querySelector('.tab'));
}

function toggleChapter(i) {
  const body = document.getElementById('ch-' + i);
  const arr  = document.getElementById('arr-' + i);
  const open = body.classList.toggle('open');
  arr.textContent = open ? '▾' : '▸';
}

// ─── JOURNAL ─────────────────────────────────────────────────────────────────
function pickType(btn) {
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  S.jType = btn.dataset.type;
}

function saveEntry() {
  const id = getActiveId();
  const text = document.getElementById('jText').value.trim();
  if (!text || !id) return;
  const all = getJournal(id);
  all.unshift({ id: Date.now(), date: new Date().toISOString(), type: S.jType, content: text });
  saveJournal(id, all.slice(0, 500));
  document.getElementById('jText').value = '';
  renderJournal();
}

function renderJournal() {
  const id = getActiveId();
  const container = document.getElementById('jEntries');
  if (!id) return;
  const all = getJournal(id);
  if (!all.length) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.8rem;padding:14px 0;">No entries yet. Start writing.</p>'; return; }
  container.innerHTML = all.map(e => {
    const date = new Date(e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `
      <div class="j-entry">
        <div class="j-entry-top">
          <span class="j-type-badge badge-${e.type}">${e.type.toUpperCase()}</span>
          <span class="j-date">${date}</span>
        </div>
        <div class="j-text">${esc(e.content)}</div>
      </div>`;
  }).join('');
}

// ─── PORTRAIT (two documents: The Story · The Analysis) ─────────────────────
function renderPortrait() {
  const toolbar = document.getElementById('portraitToolbar');
  const container = document.getElementById('portraitContent');
  if (!toolbar || !container) return;
  const profile = getActiveProfile();
  const kind = S.portraitView || 'story';
  const text = kind === 'story' ? profile?.notes : profile?.analysis;
  const busy = S.generating?.[kind];

  toolbar.innerHTML = `
    <div class="pt-switch">
      <div class="pt-tab ${kind==='story'?'active':''}" onclick="S.portraitView='story';renderPortrait()">☾ The Story</div>
      <div class="pt-tab ${kind==='analysis'?'active':''}" onclick="S.portraitView='analysis';renderPortrait()">◎ The Analysis</div>
    </div>
    <div class="pt-actions">
      <button class="btn-sm" ${busy?'disabled':''} onclick="regenerateDoc('${kind}')">${busy ? '✦ Writing…' : '↻ Regenerate'}</button>
      <button class="btn-sm" ${text?.trim() ? '' : 'disabled'} onclick="downloadDoc('${kind}')">⬇ Download</button>
    </div>`;

  if (busy) {
    container.innerHTML = `
      <div class="portrait-empty">
        <div style="display:flex;gap:5px;"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <p>${kind === 'story' ? 'Writing your story — blind spots, paradoxes, the deep weave…' : 'Writing your technical analysis — placements, mechanics, reference…'}</p>
        <p>Usually one to two minutes. You can keep using the Compass.</p>
      </div>`;
    return;
  }
  if (!text?.trim()) {
    container.innerHTML = `
      <div class="portrait-empty">
        <div style="font-size:2rem;opacity:0.3;color:var(--gold);">${kind === 'story' ? '☾' : '◎'}</div>
        <p>${kind === 'story'
          ? 'The Story — a poetic deep portrait: what you don’t know you don’t know, and the paradoxes to embody.'
          : 'The Analysis — the technical companion: placements, Human Design mechanics, Gene Keys map, reference tables.'}</p>
        <button class="btn-sm" style="color:var(--gold);border-color:var(--border-active);" onclick="regenerateDoc('${kind}')">✦ Generate now</button>
      </div>`;
    return;
  }
  container.innerHTML = fmtPortrait(text);
}

async function regenerateDoc(kind) {
  const profile = getActiveProfile();
  if (!profile) return;
  const key = getKey(profile.id);
  if (!key) { alert('No API key available — add one via Edit profile.'); return; }
  const existing = kind === 'story' ? profile.notes : profile.analysis;
  if (existing?.trim() && !confirm('Rewrite this document from your current chart data? The existing version will be replaced — download it first if you want to keep it.')) return;
  S.generating = S.generating || {};
  S.generating[kind] = true;
  renderPortrait();
  try {
    const prompt = kind === 'story' ? buildDeepAnalysisPrompt(profile) : buildTechAnalysisPrompt(profile);
    const text = await generateDoc(prompt);
    if (text) updateProfile(profile.id, kind === 'story' ? { notes: text } : { analysis: text });
    else alert('Generation did not complete — the model may have been slow or busy. Please try again in a moment. If it keeps failing, check your access code (sidebar → Access code → Update).');
  } catch {}
  S.generating[kind] = false;
  renderPortrait();
}

function downloadDoc(kind) {
  const p = getActiveProfile();
  if (!p) return;
  const text = kind === 'story' ? p.notes : p.analysis;
  if (!text?.trim()) return;
  const blob = new Blob([text], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(p.name || 'profile').toLowerCase().replace(/\s+/g,'-')}-${kind}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function fmtPortrait(raw) {
  function inline(s) {
    return s
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>');
  }
  const out = [];
  let pre = false;
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (t.startsWith('```')) { out.push(pre ? '</pre>' : '<pre class="portrait-pre">'); pre = !pre; continue; }
    if (pre) { out.push(esc(line) + '\n'); continue; }
    if (!t) continue;
    if (t === '---') { out.push('<hr class="portrait-hr">'); continue; }
    if (t.startsWith('### ')) { out.push(`<h3 class="portrait-h3">${inline(t.slice(4))}</h3>`); continue; }
    if (t.startsWith('## '))  { out.push(`<h2 class="portrait-h2">${inline(t.slice(3))}</h2>`); continue; }
    if (t.startsWith('# '))   { out.push(`<p class="portrait-h1">${inline(t.slice(2))}</p>`); continue; }
    if (t.startsWith('- ') || t.startsWith('• ')) { out.push(`<p class="portrait-p" style="padding-left:1em;">• ${inline(t.slice(2))}</p>`); continue; }
    out.push(`<p class="portrait-p">${inline(t)}</p>`);
  }
  if (pre) out.push('</pre>');
  return out.join('');
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function switchTab(id, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-' + id).classList.add('active');
  if (id === 'book') renderBook();
  if (id === 'portrait') renderPortrait();
}

// ─── THEME ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('cc_theme', theme);
}

function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ─── MOBILE VIEWPORT ──────────────────────────────────────────────────────────
// Size the app to the *visual* viewport so the layout shrinks when the on-screen
// keyboard opens (keeping the text box visible) and respects browser chrome.
function setAppHeight() {
  const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.documentElement.style.setProperty('--app-h', h + 'px');
  // iOS shoves the page upward when the keyboard opens; pin it back so the
  // fixed layout stays aligned with what's actually visible.
  if (window.scrollY) window.scrollTo(0, 0);
}
setAppHeight();
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setAppHeight);
  window.visualViewport.addEventListener('scroll', setAppHeight);
}
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 200));
// Late second pass: iOS PWA keyboards sometimes settle after the resize event
document.addEventListener('focusin', () => { setTimeout(setAppHeight, 350); });
// When the input is focused, make sure the latest messages stay in view above the keyboard
document.addEventListener('focusin', (e) => {
  if (e.target && e.target.id === 'inputBox') setTimeout(scrollBottom, 300);
});

// ─── BOOT ─────────────────────────────────────────────────────────────────────
applyTheme(localStorage.getItem('cc_theme') || 'light');
init();

// Register service worker for installable / offline PWA (no-op if unsupported)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
