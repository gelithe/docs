// ─── OWNER CONFIGURATION ─────────────────────────────────────────────────────
// Option A (plain): paste your API key into SHARED_KEY. Anyone with the URL can
//   use your credits — only for genuinely private URLs.
// Option B (recommended): keep SHARED_KEY empty and use SHARED_KEY_ENC — your key
//   encrypted with a passcode. People you share the Compass with enter the short
//   passcode once; the key is decrypted in their browser and stored locally.
//   To generate the blob: open the Compass in your browser, open DevTools console,
//   run:  await ccEncryptKey('sk-ant-…your key…', 'your-passcode')
//   and paste the printed string below. Use a long passcode (a sentence is good)
//   and set a monthly spend cap on the key at console.anthropic.com.
const SHARED_KEY = '';
const SHARED_KEY_ENC = '';

// ─── PASSCODE CRYPTO (AES-GCM + PBKDF2, WebCrypto) ──────────────────────────
async function ccDeriveKey(pass, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function ccEncryptKey(apiKey, pass) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const k    = await ccDeriveKey(pass, salt);
  const ct   = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(apiKey)));
  const blob = btoa(String.fromCharCode(...salt, ...iv, ...ct));
  console.log('SHARED_KEY_ENC blob (paste into compass.html):\n' + blob);
  return blob;
}

async function ccDecryptKey(blob, pass) {
  const raw  = Uint8Array.from(atob(blob), c => c.charCodeAt(0));
  const k    = await ccDeriveKey(pass, raw.slice(0, 16));
  const pt   = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(16, 28) }, k, raw.slice(28));
  return new TextDecoder().decode(pt);
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const EMOJIS = ['✦','✧','★','☽','☀','♦','◆','✿','❀','⊕','◎','✴','❋','⊛','✵','✶','⊙','◇','✺','⊗','🌙','🌟','🪐','🌊','🌿','🦋','🔮','🌸','🪷','🌺'];

// ─── LANGUAGES / i18n ─────────────────────────────────────────────────────────
// `en` field = English name of the language (used to instruct the AI which
// language to converse in). `native` = label shown in the picker.
const LANGS = {
  en: { native: 'English',    en: 'English' },
  lt: { native: 'Lietuvių',   en: 'Lithuanian' },
  it: { native: 'Italiano',   en: 'Italian' },
  es: { native: 'Español',    en: 'Spanish' },
  fr: { native: 'Français',   en: 'French' },
  de: { native: 'Deutsch',    en: 'German' },
  pt: { native: 'Português',  en: 'Portuguese' },
  ru: { native: 'Русский',    en: 'Russian' }
};

const I18N = {
  en: { sub:'Personal Astrological Guide', new:'+ New', modeLbl:'Mode', yourChart:'Your Chart', editChart:'Edit chart', edit:'Edit', sessions:'Sessions', clear:'Clear', backup:'Backup', exp:'Export', imp:'Restore', access:'Access code', update:'Update', language:'Language', privacy:'Privacy', view:'View', reflect:'Reflect', question:'Question', doubt:'Doubt', celebrate:'Celebrate', transit:'Transits', milestone:'Milestone', together:'Together', compass:'Compass', timeline:'Timeline', journal:'Journal', book:'The Book', portrait:'Portrait', welcomeH:'What brings you here today', welcomeP:'Choose a mode, pick a prompt, or just start typing.', say:'Say anything…' },
  lt: { sub:'Asmeninis astrologijos vadovas', new:'+ Nauja', modeLbl:'Režimas', yourChart:'Jūsų kortelė', editChart:'Redaguoti', edit:'Keisti', sessions:'Sesijos', clear:'Išvalyti', reflect:'Apmąstyti', question:'Klausimas', doubt:'Abejonė', celebrate:'Švęsti', transit:'Tranzitai', milestone:'Etapas', together:'Kartu', compass:'Kompasas', timeline:'Laiko juosta', journal:'Dienoraštis', book:'Knyga', portrait:'Portretas', welcomeH:'Kas tave čia atvedė šiandien', welcomeP:'Pasirinkite režimą, pasiūlymą arba tiesiog pradėkite rašyti.', say:'Sakykite bet ką…' },
  it: { sub:'Guida astrologica personale', new:'+ Nuovo', modeLbl:'Modalità', yourChart:'Il tuo tema', editChart:'Modifica', edit:'Modifica', sessions:'Sessioni', clear:'Cancella', reflect:'Riflettere', question:'Domanda', doubt:'Dubbio', celebrate:'Celebrare', transit:'Transiti', milestone:'Traguardo', together:'Insieme', compass:'Bussola', timeline:'Cronologia', journal:'Diario', book:'Il Libro', portrait:'Ritratto', welcomeH:'Cosa ti porta qui oggi', welcomeP:'Scegli una modalità, un suggerimento o inizia a scrivere.', say:'Dì qualsiasi cosa…' },
  es: { sub:'Guía astrológica personal', new:'+ Nuevo', modeLbl:'Modo', yourChart:'Tu carta', editChart:'Editar', edit:'Editar', sessions:'Sesiones', clear:'Borrar', reflect:'Reflexionar', question:'Pregunta', doubt:'Duda', celebrate:'Celebrar', transit:'Tránsitos', milestone:'Hito', together:'Juntos', compass:'Brújula', timeline:'Cronología', journal:'Diario', book:'El Libro', portrait:'Retrato', welcomeH:'¿Qué te trae por aquí hoy', welcomeP:'Elige un modo, una sugerencia o empieza a escribir.', say:'Di lo que quieras…' },
  fr: { sub:'Guide astrologique personnel', new:'+ Nouveau', modeLbl:'Mode', yourChart:'Votre thème', editChart:'Modifier', edit:'Modifier', sessions:'Sessions', clear:'Effacer', reflect:'Réfléchir', question:'Question', doubt:'Doute', celebrate:'Célébrer', transit:'Transits', milestone:'Étape', together:'Ensemble', compass:'Boussole', timeline:'Chronologie', journal:'Journal', book:'Le Livre', portrait:'Portrait', welcomeH:"Qu'est-ce qui t'amène ici aujourd'hui", welcomeP:'Choisis un mode, une suggestion, ou commence à écrire.', say:'Dis ce que tu veux…' },
  de: { sub:'Persönlicher astrologischer Begleiter', new:'+ Neu', modeLbl:'Modus', yourChart:'Dein Chart', editChart:'Bearbeiten', edit:'Ändern', sessions:'Sitzungen', clear:'Löschen', reflect:'Nachdenken', question:'Frage', doubt:'Zweifel', celebrate:'Feiern', transit:'Transite', milestone:'Meilenstein', together:'Zusammen', compass:'Kompass', timeline:'Zeitleiste', journal:'Tagebuch', book:'Das Buch', portrait:'Porträt', welcomeH:'Was führt dich heute hierher', welcomeP:'Wähle einen Modus, einen Vorschlag oder fang einfach an zu schreiben.', say:'Sag irgendetwas…' },
  pt: { sub:'Guia astrológico pessoal', new:'+ Novo', modeLbl:'Modo', yourChart:'O seu mapa', editChart:'Editar', edit:'Editar', sessions:'Sessões', clear:'Limpar', reflect:'Refletir', question:'Pergunta', doubt:'Dúvida', celebrate:'Celebrar', transit:'Trânsitos', milestone:'Marco', together:'Juntos', compass:'Bússola', timeline:'Linha do tempo', journal:'Diário', book:'O Livro', portrait:'Retrato', welcomeH:'O que te traz aqui hoje', welcomeP:'Escolha um modo, uma sugestão ou comece a escrever.', say:'Diga qualquer coisa…' },
  ru: { sub:'Личный астрологический гид', new:'+ Новый', modeLbl:'Режим', yourChart:'Ваша карта', editChart:'Изменить', edit:'Правка', sessions:'Сессии', clear:'Очистить', reflect:'Размышлять', question:'Вопрос', doubt:'Сомнение', celebrate:'Праздновать', transit:'Транзиты', milestone:'Веха', together:'Вместе', compass:'Компас', timeline:'Хронология', journal:'Дневник', book:'Книга', portrait:'Портрет', welcomeH:'Что привело вас сюда сегодня', welcomeP:'Выберите режим, подсказку или просто начните писать.', say:'Напишите что угодно…' }
};

function t(key) { return (I18N[S.lang] && I18N[S.lang][key]) || I18N.en[key] || key; }

const STARTERS = {
  reflect:    ['What has been pulling at me lately', 'I keep coming back to', 'Something feels stuck around', 'I have been noticing a pattern'],
  question:   ['What does my chart say about my path?', 'Why do I keep attracting the same dynamic?', 'What is my North Node calling me to?', 'What does my Rising hide?'],
  doubt:      ['I am questioning whether', 'I feel like I have been going in circles around', 'I do not know if I am doing the right thing with', 'What if I am wrong about'],
  celebrate:  ['Something good happened', 'I finally did the thing I was afraid of', 'I got the result I worked for', 'I surprised myself today'],
  transit:    ['What is happening astrologically for me right now?', 'What major transits should I know about?', 'Is this a good time for a big change?', 'What is the energy of this period?'],
  milestone:  ['I want to mark this moment', 'Something big just shifted', 'I am at a threshold I can feel', 'This chapter is closing or opening'],
  together:   ['How do our charts interact?', 'What is this relationship here to teach us?', 'Where do we trigger each other, and why?', 'What pattern are we carrying together?']
};

const PLACEHOLDERS = {
  reflect:    'What is alive in you right now?',
  question:   'What are you curious about in your chart?',
  doubt:      'What are you wrestling with?',
  celebrate:  'What happened? Tell me.',
  transit:    'Ask about current planetary weather',
  milestone:  'Describe this moment to remember',
  together:   'Ask about the people in your constellation…'
};

// ─── PROFILE MANAGEMENT ──────────────────────────────────────────────────────
function getProfiles()            { return JSON.parse(localStorage.getItem('cc_profiles') || '[]'); }
function saveProfiles(ps)         { localStorage.setItem('cc_profiles', JSON.stringify(ps)); }
function getActiveId()            { return localStorage.getItem('cc_active'); }
function setActiveId(id)          { localStorage.setItem('cc_active', id); }

function getActiveProfile() {
  const id = getActiveId();
  return getProfiles().find(p => p.id === id) || null;
}

function createProfile(data) {
  const id = 'p' + Date.now().toString(36);
  const profile = { id, ...data, createdAt: new Date().toISOString() };
  const ps = getProfiles();
  ps.push(profile);
  saveProfiles(ps);
  return profile;
}

function updateProfile(id, data) {
  const ps = getProfiles();
  const idx = ps.findIndex(p => p.id === id);
  if (idx >= 0) { ps[idx] = { ...ps[idx], ...data }; saveProfiles(ps); }
}

function deleteProfile(id) {
  const ps = getProfiles().filter(p => p.id !== id);
  saveProfiles(ps);
  ['sessions','journal','key','memory'].forEach(k => localStorage.removeItem(`cc_${id}_${k}`));
  if (getActiveId() === id) setActiveId(ps[0]?.id || '');
}

// ─── NAMESPACED STORAGE ───────────────────────────────────────────────────────
function ns(id, k)          { return `cc_${id}_${k}`; }
function getSessions(id)    { return JSON.parse(localStorage.getItem(ns(id,'sessions')) || '[]'); }
function saveSessions(id,v) { localStorage.setItem(ns(id,'sessions'), JSON.stringify(v)); }
function getJournal(id)     { return JSON.parse(localStorage.getItem(ns(id,'journal'))  || '[]'); }
function saveJournal(id,v)  { localStorage.setItem(ns(id,'journal'),  JSON.stringify(v)); }
function getMemory(id)      { return JSON.parse(localStorage.getItem(ns(id,'memory'))   || 'null'); }
function saveMemory(id,v)   { localStorage.setItem(ns(id,'memory'),   JSON.stringify(v)); }
// Language directive for generated documents (portraits) — they carry no system
// prompt, so the language must be stated in the prompt itself or they default to English.
function docLangInstruction() {
  if (!S.lang || S.lang === 'en') return '';
  const langName = LANGS[S.lang] ? LANGS[S.lang].en : 'English';
  return `\n\nIMPORTANT: Write this entire document in ${langName} — the title, every heading, and all body text, natural and fluent. Do not write any part in English.`;
}
// This build routes model calls through the same-origin proxy (/api/chat),
// which holds the API key server-side. Access is gated by a per-person code;
// a user may still bring their own key (stored locally, sent to the proxy).
const PROXY_ENDPOINT = '/api/chat';
function getAccessCode()    { return localStorage.getItem('cc_access') || ''; }
function setAccessCode(c)   { if (c) localStorage.setItem('cc_access', c); }
function getPersonalKey(id) { return localStorage.getItem(ns(id || getActiveId(), 'key')) || ''; }
// getKey stays truthy when the app is usable (own key OR an access code present)
function getKey(id)         { return getPersonalKey(id) || getAccessCode() || ''; }

// Validate a code/key against the proxy without spending a model call.
// Returns 'ok' | 'invalid' | 'unknown' (unknown = couldn't reach server).
async function validateAccess(code, key) {
  try {
    const res = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ validateOnly: true, accessCode: code || undefined, userKey: key || undefined })
    });
    if (res.ok) return 'ok';
    if (res.status === 401) return 'invalid';
    return 'unknown';
  } catch { return 'unknown'; }
}

// Change the access code any time, with validation.
async function updateAccessCode() {
  const cur = getAccessCode();
  const val = prompt('Your access code (unlocks the shared key). Leave blank if you use your own API key.', cur);
  if (val === null) return;
  const code = val.trim();
  if (!code) {
    if (!getPersonalKey()) { alert('You need an access code or your own API key to reach the model.'); return; }
    localStorage.removeItem('cc_access');
    alert('Access code cleared. Using your own API key.');
    return;
  }
  const verdict = await validateAccess(code, '');
  if (verdict === 'invalid') { alert('That access code was not accepted. Please check it and try again.'); return; }
  localStorage.setItem('cc_access', code);
  alert(verdict === 'ok' ? 'Access code updated ✓' : 'Saved — could not verify right now, but it will be used.');
}

async function llmComplete({ system, messages, max_tokens, model, tier, provider, onChunk, signal }) {
  const res = await fetch(PROXY_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider, model, tier, max_tokens, system, messages,
      accessCode: getAccessCode() || undefined,
      userKey: getPersonalKey() || undefined
    }),
    signal   // optional AbortSignal: cancelling closes the stream and stops the model
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  // Anthropic path streams text/plain; OpenAI path returns JSON { text }
  const ctype = res.headers.get('content-type') || '';
  if (res.body && ctype.includes('text/plain')) {
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += dec.decode(value, { stream: true });
      if (onChunk) onChunk(text);
    }
    return text;
  }
  const data = await res.json().catch(() => ({}));
  return data.text || '';
}
function saveKey(id,k)      { localStorage.setItem(ns(id,'key'), k); }

// A reply may end with a note from the proxy (refusal, length cut, interrupted),
// introduced by an invisible mark. Show it; never save or replay it.
const NOTE_MARK = '\u2063';
function splitReply(text) {
  const i = (text || '').indexOf(NOTE_MARK);
  return i < 0 ? { content: text || '', note: '' } : { content: text.slice(0, i), note: text.slice(i + 1) };
}

// ─── MIGRATE OLD DATA ─────────────────────────────────────────────────────────
function migrateOldData(profileId) {
  const oldSessions = localStorage.getItem('cc_sessions');
  const oldJournal  = localStorage.getItem('cc_journal');
  const oldKey      = localStorage.getItem('cc_key');
  if (oldSessions) { localStorage.setItem(ns(profileId,'sessions'), oldSessions); localStorage.removeItem('cc_sessions'); }
  if (oldJournal)  { localStorage.setItem(ns(profileId,'journal'),  oldJournal);  localStorage.removeItem('cc_journal');  }
  if (oldKey)      { localStorage.setItem(ns(profileId,'key'),      oldKey);      localStorage.removeItem('cc_key');      }
}

// ─── NUMEROLOGY ──────────────────────────────────────────────────────────────
function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + +c, 0);
  }
  return n;
}

function calcLifePath(dateStr) {
  return reduceNum(dateStr.replace(/-/g,'').split('').reduce((a,c) => a + +c, 0));
}

function calcExpression(name) {
  const t = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
  const vals = name.toLowerCase().replace(/[^a-z]/g,'').split('').map(c => t[c]||0);
  return vals.length ? reduceNum(vals.reduce((a,b)=>a+b,0)) : null;
}

function calcSoulUrge(name) {
  const t = {a:1,e:5,i:9,o:6,u:3};
  const vals = name.toLowerCase().replace(/[^a-z]/g,'').split('').filter(c=>t[c]).map(c=>t[c]);
  return vals.length ? reduceNum(vals.reduce((a,b)=>a+b,0)) : null;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
function buildNatalContext(profile, opts) {
  const withAnalysis = !opts || opts.analysis !== false;
  const lines = [`USER: ${profile.name}`];
  if (profile.birthDate)  lines.push(`BIRTH DATE: ${profile.birthDate}`);
  if (profile.birthTime)  lines.push(`BIRTH TIME: ${profile.birthTime}`);
  if (profile.birthPlace) lines.push(`BIRTH LOCATION: ${profile.birthPlace}`);
  if (profile.chartText?.trim()) lines.push(`\nNATAL CHART DATA (provided by user):\n${profile.chartText.trim()}`);
  else lines.push('\n(No chart data provided — work from birth date and any information shared in conversation)');

  // Numerology — auto-calculated
  if (profile.birthDate) {
    const lp = calcLifePath(profile.birthDate);
    const nums = [`Life Path: ${lp}`];
    if (profile.fullName?.trim()) {
      const exp  = calcExpression(profile.fullName);
      const soul = calcSoulUrge(profile.fullName);
      if (exp)  nums.push(`Expression: ${exp}`);
      if (soul) nums.push(`Soul Urge: ${soul}`);
    }
    lines.push(`\nNUMEROLOGY (auto-calculated from birth data):\n${nums.join('\n')}`);
  }

  if (profile.humanDesign?.trim()) lines.push(`\nHUMAN DESIGN (provided by user):\n${profile.humanDesign.trim()}`);
  if (profile.geneKeys?.trim())    lines.push(`\nGENE KEYS HOLOGENETIC PROFILE (provided by user):\n${profile.geneKeys.trim()}`);
  if (withAnalysis && profile.analysis?.trim()) lines.push(`\nTECHNICAL CHART ANALYSIS (reference document):\n${profile.analysis.trim()}`);
  if (profile.notes?.trim()) lines.push(`\nPERSONAL DEEP PORTRAIT (pre-written psychological portrait — treat as intimate background knowledge, not text to quote directly):\n${profile.notes.trim()}`);
  return lines.join('\n');
}

function buildJournalContext(profileId) {
  try {
    const entries = getJournal(profileId).slice(0, 10); // newest first
    if (!entries.length) return '';
    const lines = entries.map(e => {
      const d = new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const txt = (e.content || '').slice(0, 300);
      return `[${d} · ${e.type}] ${txt}${(e.content || '').length > 300 ? '…' : ''}`;
    });
    return `\n\nRECENT JOURNAL ENTRIES (written by them, newest first — private lived context):\n${lines.join('\n')}`;
  } catch { return ''; }
}

// ─── BOOK MEMORY (distilled long-term conversational memory) ──────────────────
// The Book holds every past session, but they don't fit in a prompt. Instead a
// compact digest — "what we've explored together" — is generated periodically
// and rides along like the journal, giving the companion continuity.
function buildBookContext(profileId) {
  try {
    const mem = getMemory(profileId);
    if (!mem?.digest?.trim()) return '';
    return `\n\nWHAT YOU'VE EXPLORED TOGETHER (a distilled memory of past conversations — background continuity, not a transcript):\n${mem.digest.trim()}`;
  } catch { return ''; }
}

// Incremental: the previous digest plus only the conversations since it was
// written. Each session is capped so a long chat cannot blow up the prompt.
function buildMemoryPrompt(profile, sessions, prevDigest) {
  const blocks = sessions.slice(0, 12).map(s => {
    const d = new Date(s.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const msgs = (s.messages || []).slice(0, 12);
    const convo = msgs.map(m => `${m.role === 'user' ? profile.name : 'Compass'}: ${(m.content || '').slice(0, 250)}`).join('\n');
    return `── ${d} · ${s.mode || 'reflect'} · "${s.title || ''}"\n${convo}`;
  }).join('\n\n');

  const task = prevDigest
    ? `Below is the companion's current MEMORY DIGEST about ${profile.name}, followed by the conversations that happened since it was written. Rewrite the digest so it folds the new conversations in — keep what still matters, let what has faded recede, notice what has grown.`
    : `Below are past conversations between ${profile.name} and their astrological companion (the "Compass"). Write a compact MEMORY DIGEST the companion can carry into future conversations so ${profile.name} feels continuously known.`;

  return `${task}

Capture: recurring themes and questions, emotional threads over time, insights that landed, intentions or decisions they voiced, and anything sensitive to hold with care. Write about ${profile.name} in the third person. Be a memory, not a transcript — no play-by-play, no quotes. 150–250 words, plain prose.
${prevDigest ? `\nCURRENT DIGEST:\n${prevDigest}\n` : ''}
NEW CONVERSATIONS:
${blocks}`;
}

// Which sessions the digest has already absorbed. Older digests only stored a
// count; they were built when the oldest `count` sessions were all there were.
function digestedIds(mem, sessions) {
  if (Array.isArray(mem?.ids)) return new Set(mem.ids);
  if (mem?.count) return new Set(sessions.slice(-mem.count).map(s => String(s.id)));
  return new Set();
}

// Regenerate the memory digest in the background when a conversation has been
// completed since the last run. The conversation still open is left for next
// time, so each session is read by the model once, in full, after it ends.
const _memGenerating = new Set();
async function maybeUpdateMemory(profileId) {
  try {
    if (_memGenerating.has(profileId)) return;
    const profile = getProfiles().find(p => p.id === profileId);
    if (!profile) return;
    const sessions = getSessions(profileId).filter(s => (s.messages || []).length >= 2);   // newest first
    const mem = getMemory(profileId);
    const seen = digestedIds(mem, sessions);
    const fresh = sessions.filter(s => !seen.has(String(s.id)) && String(s.id) !== String(S.sessionId));
    if (!fresh.length) return;                          // nothing new has ended
    if (!getKey(profileId)) return;                     // no way to call the model

    _memGenerating.add(profileId);
    const batch = fresh.slice(0, 12);   // what buildMemoryPrompt actually sends; the rest waits for the next run
    const digest = await llmComplete({ messages: [{ role: 'user', content: buildMemoryPrompt(profile, batch, mem?.digest) }], max_tokens: 1200, tier: 'summary' });
    if (digest?.trim()) saveMemory(profileId, {
      digest: digest.trim(),
      ids: [...seen, ...batch.map(s => String(s.id))].slice(-200),
      count: sessions.length,
      updatedAt: new Date().toISOString()
    });
  } catch { /* background best-effort */ }
  finally { _memGenerating.delete(profileId); }
}

function buildSystem(mode, profile) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  // The long technical Analysis document rides along only where it earns its
  // tokens (specific questions and timing); the Story portrait is always there.
  const ctx = buildNatalContext(profile, { analysis: mode === 'question' || mode === 'transit' });
  const name = profile.name;

  const modes = {
    reflect:   `${name} is in open reflection. Create space. Ask one good question. Mirror back with precision. Do not rush to meaning.`,
    question:  `${name} has a specific question. Be direct and concrete. Connect to actual placements. Give a clear perspective, not a hedge.`,
    doubt:     `${name} is wrestling with uncertainty. Do not rush to reassure. Sit with them first. Then point to specific chart strengths — not encouragement: precision.`,
    celebrate: `${name} has a win. Celebrate genuinely. Then help them understand what this win means for their chart's arc — what it activates, what chapter it opens.`,
    transit:   `${name} wants to understand current astrological weather. Today is ${today}. Interpret current transits for their specific natal chart. Prioritize slow-moving planets. Be honest about what you know vs. approximate.`,
    milestone: `${name} is marking an important moment. Help them locate this in their larger chart story. What chapter does it open or close?`,
    together:  `${name} is exploring relationships within their constellation — the other people whose charts are provided below. Hold every chart simultaneously. Look for interlocking patterns: mirrored placements, complementary gifts, composite tensions, family-system dynamics, where one person's defined center meets another's openness. Speak to ${name} directly, ground every observation in the actual data of the people involved, and be honest when the data is too thin to say something real.`
  };

  let constellation = '';
  if (mode === 'together' && S.together?.size) {
    const others = getProfiles().filter(p => S.together.has(p.id));
    constellation = others.map(o =>
      `\n\n─── CONSTELLATION: ${o.name} ───\n` + buildNatalContext({ ...o, notes: '', analysis: '' })
    ).join('');
    if (constellation) constellation = '\n\nOTHER PEOPLE IN THIS CONSTELLATION (their private notes are not shared — work from their charts):' + constellation;
  }

  // Live ephemeris — always available for grounding, full aspect list in transit mode
  const transits = buildTransitContext(profile, mode === 'transit');

  // Timeline: a day the user picked in the Timeline tab, and in Transits mode
  // the computed list of what is coming (so timing questions get real dates).
  const focusDay = S.focusDay?.text
    ? `\n\n${S.focusDay.text}\n(The user opened this day from their Timeline. Read it for them: the strongest influences first, houses involved, what to lean into and what to be careful with. Tendencies, not predictions.)`
    : '';
  const upcoming = (mode === 'transit' && typeof buildUpcomingContext === 'function') ? buildUpcomingContext(profile, 45) : '';

  // The active person's own journal — lived context. Deliberately NOT included
  // for constellation members: journals stay private to their owner.
  const journal = buildJournalContext(profile.id);

  // Distilled long-term memory of past conversations (private to this profile).
  const memory = buildBookContext(profile.id);

  const langName = LANGS[S.lang] ? LANGS[S.lang].en : 'English';
  const langLine = (S.lang && S.lang !== 'en')
    ? `\n\nIMPORTANT: Respond entirely in ${langName}. Every reply must be written in that language, naturally and fluently — matching the user even if they mix in another language.`
    : '';

  // Two system blocks for prompt caching: the first (identity, charts, portrait,
  // rules) is identical across messages and gets cached by the API at a fraction
  // of the input price; the second (date, sky, journal, memory, mode, and the
  // other people in a Together conversation) changes. Keeping the constellation
  // out of the first block means adding or removing a person mid-session does
  // not throw away the cached chart and portrait.
  const stable = `You are the personal astrological companion for ${name}. You hold intimate, precise knowledge of their natal chart — not as abstract symbols but as a living map of their psyche, potential, and path.

${ctx}

YOUR APPROACH:
— Be specific to this person's chart and what you know of their placements. Never give generic horoscope statements.
— Derive real insights from the placements provided. If chart data is limited, acknowledge it and work from what you have.
— Be wise but never preachy. Challenge gently and precisely when a blind spot seems active.
— Weave astrological insight into practical, embodied reality — not mystical abstraction.
— Reference the conversation history you are given. ${name} should feel truly remembered.
— If journal entries are provided, treat them as lived context from ${name}'s own hand: notice recurring themes, connect a current question to what they wrote when it resonates, and hold intentions they set. Weave gently — never recite the journal back as a list.
— If a distilled memory of past conversations is provided, let it give you continuity: remember what you've explored, pick up threads, notice growth. Draw on it naturally, as a companion who remembers — never announce "according to my memory".
— Length follows the question. Usually 2–4 paragraphs, tight and meaningful. When a question genuinely needs more — a full reading, several people's charts, timing across months — take the room and finish it properly.
— One question per response maximum. Make it count.
— A LIVE EPHEMERIS of the current sky is provided below — real computed positions and aspects to the natal chart. Use it for anything about "now," timing, or current energy. Never invent transit data beyond what is given; if something isn't listed, say so.
— If an UPCOMING TIMELINE or FOCUS DAY is given, use its dates exactly. Describe tendencies and timing, never fixed events. Retrogrades are review periods, not dangers. No fear language, no "once in a lifetime" framing.
— Match their energy. If they are light, be light. If they are in it, go deep.
— You are their most knowing mirror — the one who reads the map and asks the questions that matter.`;

  // Freeze the changing block for the length of a conversation (same mode, day,
  // language and focus), so the whole history before the newest message stays
  // cacheable. A new session, mode, focus day or calendar day refreshes it.
  // The stable block is cached for an hour: a reflective conversation pauses
  // for longer than the default five minutes, and rewriting this block after
  // every pause cost more than the longer cache does.
  const stableBlock = { type: 'text', text: stable, cache_control: { type: 'ephemeral', ttl: '1h' } };
  const dynKey = [S.sessionId, mode, S.focusDay?.iso || '', S.lang, today, [...(S.together || [])].sort().join(','), getMemory(profile.id)?.updatedAt || ''].join('|');
  if (S._dyn?.key === dynKey) return [stableBlock, { type: 'text', text: S._dyn.text }];

  const dynamic = `Today: ${today}
${journal}${memory}
${transits}${upcoming}${focusDay}${constellation}

CURRENT MODE: ${modes[mode] || modes.reflect}${langLine}`;
  S._dyn = { key: dynKey, text: dynamic };

  return [stableBlock, { type: 'text', text: dynamic }];
}

