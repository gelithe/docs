// ─── WIZARD ───────────────────────────────────────────────────────────────────
let WZ = { step: 1, totalSteps: 4, data: {}, editingId: null };

function showWizard(editingId) {
  WZ.editingId = editingId || null;
  WZ.data = {};

  // If editing, pre-populate
  if (editingId) {
    const p = getProfiles().find(p => p.id === editingId);
    if (p) WZ.data = { ...p };
  }

  // The access code unlocks the whole app, not one profile. Once it's set, adding
  // another person (a new profile) shouldn't ask for it again — skip the Access step.
  WZ.totalSteps = (!editingId && getAccessCode()) ? 3 : 4;
  WZ.step = 1;
  document.getElementById('wizardOverlay').style.display = 'flex';
  renderWizardStep();
}

function hideWizard() {
  document.getElementById('wizardOverlay').style.display = 'none';
}

function renderWizardStep() {
  const c = document.getElementById('wizardContainer');
  c.innerHTML = '';
  const panel = document.createElement('div');
  panel.className = 'wizard-panel';

  const dots = Array.from({length: WZ.totalSteps}, (_, i) => {
    const cls = i + 1 < WZ.step ? 'wdot done' : i + 1 === WZ.step ? 'wdot active' : 'wdot';
    return `<div class="${cls}"></div>`;
  }).join('');

  let inner = `<div class="wizard-dots">${dots}</div>`;

  if (WZ.step === 1) {
    // Name + emoji
    inner += `
      <div class="wizard-glyph">${WZ.data.emoji || '✦'}</div>
      <h2>${WZ.editingId ? 'Update Your Profile' : 'Welcome to Chart Compass'}</h2>
      <p class="wizard-sub">Your personal astrological guide — wise, specific, and always yours.</p>
      <div class="w-field">
        <label class="w-label">Your name</label>
        <input class="w-input" id="wName" placeholder="What should I call you?" value="${esc(WZ.data.name || '')}">
      </div>
      <div class="w-field">
        <label class="w-label">Pick an avatar</label>
        <div class="emoji-grid">${EMOJIS.map(e => `<div class="emoji-opt${WZ.data.emoji === e ? ' selected' : ''}" onclick="pickEmoji('${e}',this)">${e}</div>`).join('')}</div>
      </div>
      <div class="wizard-nav">
        ${WZ.editingId ? `<button class="btn-back" onclick="hideWizard()">Cancel</button>` : ''}
        <button class="btn-next" onclick="wNext1()">Continue →</button>
      </div>`;
  } else if (WZ.step === 2) {
    inner += `
      <div class="wizard-glyph">☽</div>
      <h2>Your Birth Data</h2>
      <p class="wizard-sub">Used to personalise your astrological context. Time and place help — but just the date is a start.</p>
      <div class="w-field">
        <label class="w-label">Date of birth</label>
        <input class="w-input" type="date" id="wDate" value="${WZ.data.birthDate || ''}">
      </div>
      <div class="w-row">
        <div class="w-field">
          <label class="w-label">Time of birth <span class="w-optional">(optional)</span></label>
          <input class="w-input" type="time" id="wTime" value="${WZ.data.birthTime || ''}">
        </div>
        <div class="w-field place-field">
          <label class="w-label">Place of birth</label>
          <input class="w-input" id="wPlace" placeholder="City, Country" autocomplete="off"
            value="${esc(WZ.data.birthPlace || '')}" oninput="onPlaceInput(this)">
          <div id="placeSuggestions" class="place-suggestions" style="display:none;"></div>
        </div>
      </div>
      <div class="w-field">
        <label class="w-label">Full name at birth <span class="w-optional">(optional — unlocks numerology)</span></label>
        <input class="w-input" id="wFullName" placeholder="As on your birth certificate" value="${esc(WZ.data.fullName || '')}">
      </div>
      <div class="wizard-nav">
        <button class="btn-back" onclick="WZ.step=1;renderWizardStep()">← Back</button>
        <button class="btn-next" onclick="wNext2()">Continue →</button>
      </div>`;
  } else if (WZ.step === 3) {
    inner += `
      <div class="wizard-glyph">◎</div>
      <h2>Your Chart</h2>
      <p class="wizard-sub">Everything below is calculated automatically from your birth data — natal chart, Human Design, and Gene Keys. Review, edit, or replace anything.</p>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;">
        <div id="calcStatus" style="font-size:0.75rem;color:var(--gold-dim);line-height:1.5;flex:1;"></div>
        <button class="btn-sm" style="flex-shrink:0;" onclick="autoCalcAll(true)">↻ Recalculate</button>
      </div>
      <div class="w-field">
        <label class="w-label">Natal chart</label>
        <textarea class="w-textarea" id="wChart" placeholder="Calculating… or paste your own from AstroSeek / Astro.com" style="min-height:120px;font-family:monospace;font-size:0.78rem;">${esc(WZ.data.chartText || '')}</textarea>
      </div>
      <div class="w-field">
        <label class="w-label">Human Design</label>
        <textarea class="w-textarea" id="wHumanDesign" placeholder="Calculating… or paste your own from jovianarchive.com" style="min-height:76px;font-family:monospace;font-size:0.78rem;">${esc(WZ.data.humanDesign || '')}</textarea>
      </div>
      <div class="w-field">
        <label class="w-label">Gene Keys</label>
        <textarea class="w-textarea" id="wGeneKeys" placeholder="Calculating… or paste your own from genekeys.com" style="min-height:76px;font-family:monospace;font-size:0.78rem;">${esc(WZ.data.geneKeys || '')}</textarea>
      </div>
      <div class="w-field">
        <label class="w-label">Personal deep notes <span class="w-optional">(optional)</span></label>
        <p style="font-size:0.82em;color:var(--text-muted);margin:-4px 0 8px;">Paste a psychological analysis, journal entries, or any personal context you want the AI to hold permanently.</p>
        <textarea class="w-textarea" id="wNotes" placeholder="Paste a deep analysis, personal notes, or anything the AI should always know about you…" style="min-height:80px;">${esc(WZ.data.notes || '')}</textarea>
      </div>
      <div class="wizard-nav">
        <button class="btn-back" onclick="WZ.step=2;renderWizardStep()">← Back</button>
        <button class="btn-next" onclick="wNext3()">${WZ.totalSteps === 3 ? (WZ.editingId ? 'Save Changes ✓' : 'Begin →') : 'Continue →'}</button>
      </div>`;
  } else if (WZ.step === 4) {
    const unlocked = !!getAccessCode();
    const existingPersonal = WZ.editingId ? (localStorage.getItem(ns(WZ.editingId,'key')) || '') : '';
    inner += `
      <div class="wizard-glyph">⊕</div>
      <h2>Access</h2>
      <p class="wizard-sub">Enter the access code you were given — it unlocks the Compass on this device. Or bring your own API key to use your own credits.</p>
      <div class="w-field">
        <label class="w-label">Access code${unlocked ? ' <span class="w-optional">(already unlocked on this device)</span>' : ''}</label>
        <input class="w-input" type="password" id="wCode" placeholder="${unlocked ? '•••••• (leave blank to keep)' : 'Your access code…'}" autocomplete="off">
        <p class="key-hint">Ask whoever shared Chart Compass with you. <span style="color:var(--gold-dim);cursor:pointer;text-decoration:underline;" onclick="showPrivacy()">How your key &amp; data are handled</span></p>
      </div>
      <div class="w-field">
        <label class="w-label">Or your own API key <span class="w-optional">(optional)</span></label>
        <input class="w-input" type="password" id="wKey" placeholder="sk-ant-… or sk-…" autocomplete="off" value="${esc(existingPersonal)}">
        <p class="key-hint">Claude (<strong>console.anthropic.com</strong>) or OpenAI (<strong>sk-</strong>). Used for your account only; your key takes priority.</p>
      </div>
      <div class="wizard-nav">
        <button class="btn-back" onclick="WZ.step=3;renderWizardStep()">← Back</button>
        <button class="btn-next" onclick="wFinish()">${WZ.editingId ? 'Save Changes ✓' : 'Begin →'}</button>
      </div>`;
  }

  panel.innerHTML = inner;
  c.appendChild(panel);
  if (WZ.step === 3) setTimeout(() => autoCalcAll(false), 60);
}

function pickEmoji(e, el) {
  WZ.data.emoji = e;
  document.querySelectorAll('.emoji-opt').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  document.querySelector('.wizard-glyph').textContent = e;
}

function wNext1() {
  const name = document.getElementById('wName').value.trim();
  if (!name) { alert('Please enter your name.'); return; }
  WZ.data.name  = name;
  WZ.data.emoji = WZ.data.emoji || '✦';
  WZ.step = 2;
  renderWizardStep();
}

function wNext2() {
  const date     = document.getElementById('wDate').value;
  const time     = document.getElementById('wTime').value;
  const place    = document.getElementById('wPlace').value.trim();
  const fullName = document.getElementById('wFullName').value.trim();
  if (!date) { alert('Please enter your birth date.'); return; }
  WZ.data.birthDate  = date;
  WZ.data.birthTime  = time;
  WZ.data.birthPlace = place;
  WZ.data.fullName   = fullName;
  WZ.step = 3;
  renderWizardStep();
}

function wNext3() {
  WZ.data.chartText   = document.getElementById('wChart').value;
  WZ.data.humanDesign = document.getElementById('wHumanDesign').value;
  WZ.data.geneKeys    = document.getElementById('wGeneKeys').value;
  WZ.data.notes       = document.getElementById('wNotes').value;
  if (WZ.totalSteps === 3) { wFinish(); return; }
  WZ.step = 4;
  renderWizardStep();
}

async function wFinish() {
  const keyEl = document.getElementById('wKey');
  const enteredKey = keyEl ? keyEl.value.trim() : '';
  const codeEl = document.getElementById('wCode');
  const code = codeEl ? codeEl.value.trim() : '';
  const existingPersonal = WZ.editingId ? (localStorage.getItem(ns(WZ.editingId,'key')) || '') : '';

  // Optional own key (BYOK): Claude (sk-ant-) or OpenAI (sk-)
  if (enteredKey && !/^sk-/.test(enteredKey)) {
    alert('An API key should start with sk-ant- (Claude) or sk- (OpenAI) — check it, or leave it empty to use your access code.');
    return;
  }
  // Must have a way in: an access code, a personal key, or already set up on this device
  if (!code && !enteredKey && !existingPersonal && !getAccessCode()) {
    alert('Enter your access code (or your own API key) to open Chart Compass.');
    return;
  }

  // Validate the access code the moment it's entered (unless a personal key is
  // driving things — those verify on first real call). Blocks only on a definite
  // rejection, so a transient network hiccup won't trap the user.
  const enteredKeyFinal = enteredKey;
  // Only validate a FRESHLY entered access code (a stored one was already checked
  // when it was first entered — no need to re-check on every new profile).
  if (code) {
    const nextBtn = document.querySelector('.wizard-nav .btn-next');
    const label = nextBtn ? nextBtn.textContent : '';
    if (nextBtn) { nextBtn.textContent = 'Checking…'; nextBtn.disabled = true; }
    const verdict = await validateAccess(code, '');
    if (nextBtn) { nextBtn.textContent = label; nextBtn.disabled = false; }
    if (verdict === 'invalid') {
      alert('That access code was not accepted. Please check it and try again.');
      return;
    }
    setAccessCode(code);
  }

  const payload = {
    name: WZ.data.name, emoji: WZ.data.emoji,
    birthDate: WZ.data.birthDate, birthTime: WZ.data.birthTime,
    birthPlace: WZ.data.birthPlace, fullName: WZ.data.fullName,
    lat: WZ.data.lat, lon: WZ.data.lon, tz: WZ.data.tz,
    chartText: WZ.data.chartText, humanDesign: WZ.data.humanDesign,
    geneKeys: WZ.data.geneKeys, notes: WZ.data.notes
  };
  if (WZ.editingId) {
    updateProfile(WZ.editingId, payload);
    if (enteredKeyFinal) saveKey(WZ.editingId, enteredKeyFinal);
    hideWizard();
    loadProfile(WZ.editingId);
  } else {
    const profile = createProfile(payload);
    if (enteredKeyFinal) saveKey(profile.id, enteredKeyFinal);
    if (getProfiles().length === 1) migrateOldData(profile.id);
    setActiveId(profile.id);
    showApp();
    loadProfile(profile.id);

    // Auto-generate deep analysis if chart data provided and no notes already written
    if (profile.chartText?.trim() && !profile.notes?.trim()) {
      showGeneratingOverlay(profile);
    } else {
      hideWizard();
    }
  }
}

function showGeneratingOverlay(profile, key) {
  const c = document.getElementById('wizardContainer');
  c.innerHTML = `
    <div class="wizard-panel" style="text-align:center;">
      <div class="wizard-glyph">✦</div>
      <h2>Mapping ${esc(profile.name)}'s Chart</h2>
      <p class="wizard-sub">Writing your personal deep portrait — weaving your chart, Human Design and Gene Keys into one story. Usually one to two minutes; the Compass is ready to use while you wait.</p>
      <div style="display:flex;gap:5px;justify-content:center;margin:20px 0;">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);line-height:1.6;">Two documents are being written: The Story (blind spots &amp; paradoxes) and The Analysis (technical reference). Find them in the Portrait tab.</p>
      <div class="wizard-nav" style="justify-content:center;margin-top:20px;">
        <button class="btn-back" onclick="hideWizard()">Skip for now</button>
      </div>
    </div>`;

  Promise.all([
    generateDoc(buildDeepAnalysisPrompt(profile))
      .then(t => { if (t) { updateProfile(profile.id, { notes: t }); return true; } return false; })
      .catch(() => false),
    generateDoc(buildTechAnalysisPrompt(profile))
      .then(t => { if (t) { updateProfile(profile.id, { analysis: t }); return true; } return false; })
      .catch(() => false)
  ]).then(([story, analysis]) => {
    hideWizard();
    renderPortrait();
    if (!story && !analysis) {
      alert('Your Portrait documents did not finish generating (the model may have been slow or busy). Open the Portrait tab and tap Generate to try again — your chart and the Compass are ready to use now.');
    }
  });
}

function buildDeepAnalysisPrompt(profile) {
  const parts = [`Name: ${profile.name}`];
  if (profile.birthDate)       parts.push(`Birth date: ${profile.birthDate}`);
  if (profile.birthTime)       parts.push(`Birth time: ${profile.birthTime}`);
  if (profile.birthPlace)      parts.push(`Birth place: ${profile.birthPlace}`);
  if (profile.birthDate) {
    const nums = [`Life Path ${calcLifePath(profile.birthDate)}`];
    if (profile.fullName?.trim()) {
      const exp = calcExpression(profile.fullName), soul = calcSoulUrge(profile.fullName);
      if (exp)  nums.push(`Expression ${exp}`);
      if (soul) nums.push(`Soul Urge ${soul}`);
    }
    parts.push(`Numerology: ${nums.join(' · ')}`);
  }
  if (profile.chartText?.trim())   parts.push(`\nNatal chart placements:\n${profile.chartText.trim()}`);
  if (profile.humanDesign?.trim()) parts.push(`\nHuman Design:\n${profile.humanDesign.trim()}`);
  if (profile.geneKeys?.trim())    parts.push(`\nGene Keys hologenetic profile:\n${profile.geneKeys.trim()}`);

  return `You are writing a deep psychological portrait for one specific person — a document they will keep, reread for years, and recognize themselves in more each time. This is not a report. It is a mirror tilted at an unusual angle.

THE PERSON:
${parts.join('\n')}

STRUCTURE (markdown):

# A poetic title for this document — specific to this person, not generic

An opening passage of 150–250 words. Literary, intimate, quietly authoritative. Tell them what this document is and is not. Set a tone of respect for their depth.

## Part One: What You Don't Know You Don't Know

Seven sections, each with a short evocative title (### heading). Each names one invisible pattern — something that operates before conscious awareness and shapes decisions from the background. 200–260 words each. This is the crucial instruction: weave the systems together. Let an astrological placement, a Human Design mechanic, and a Gene Key shadow illuminate the SAME pattern from three different angles — when they converge on one truth, name the convergence explicitly. Where the person's type and authority (Human Design) explain HOW a pattern runs, and a Gene Key names WHAT its shadow feels like, and a house placement shows WHERE in life it plays out — braid them into one narrative, not three parallel summaries.

## Part Two: Paradoxes to Be Aware Of, Embrace, and Embody

Seven sections, each with a short evocative title (### heading). Each describes a genuine tension — two real needs that cannot be resolved in sequence, only held simultaneously — and how holding it consciously becomes a source of unusual power. 200–260 words each. Same weaving principle: cross-reference the systems where they speak to the same tension.

## How to Work with These

One short practice per major theme — one or two sentences each, concrete, repeatable, humble. Not affirmations: instructions.

Close with a final passage of 2–4 sentences that lands like the last page of a good book.

VOICE:
— Second person throughout. Psychologically precise, poetic but never vague. The register of a depth psychologist who also reads charts, bodygraphs, and gene keys fluently.
— Derive every insight from the actual data above. Never use generic sun-sign talk. If data is missing (no birth time, etc.), work gracefully with what exists.
— Avoid flattery. The document should feel slightly uncomfortable in the way true things are.
— Total length approximately 3500–4500 words. Be complete and land the ending; do not leave a section unfinished.`;
}

function buildTechAnalysisPrompt(profile) {
  const parts = [`Name: ${profile.name}`];
  if (profile.birthDate)  parts.push(`Birth date: ${profile.birthDate}`);
  if (profile.birthTime)  parts.push(`Birth time: ${profile.birthTime}`);
  if (profile.birthPlace) parts.push(`Birth place: ${profile.birthPlace}`);
  if (profile.birthDate) {
    const nums = [`Life Path ${calcLifePath(profile.birthDate)}`];
    if (profile.fullName?.trim()) {
      const exp = calcExpression(profile.fullName), soul = calcSoulUrge(profile.fullName);
      if (exp)  nums.push(`Expression ${exp}`);
      if (soul) nums.push(`Soul Urge ${soul}`);
    }
    parts.push(`Numerology: ${nums.join(' · ')}`);
  }
  if (profile.chartText?.trim())   parts.push(`\nNatal chart placements:\n${profile.chartText.trim()}`);
  if (profile.humanDesign?.trim()) parts.push(`\nHuman Design:\n${profile.humanDesign.trim()}`);
  if (profile.geneKeys?.trim())    parts.push(`\nGene Keys hologenetic profile:\n${profile.geneKeys.trim()}`);

  return `Write a precise, technical reference analysis for ${profile.name} — the analytical companion to a poetic portrait. This is the document they open when they want the mechanics, not the mythology.

THE PERSON:
${parts.join('\n')}

STRUCTURE (markdown — use # / ## / ### headings, plain paragraphs and simple "Label — value" lines; NO markdown tables):

# Chart Analysis: ${profile.name}

## Identity at a Glance
Rising, Sun, Moon, Midheaven — each on one line with sign, degree, house, and a one-clause meaning. Then a short paragraph naming the core structural tension of this chart.

## The Defining Configuration
The single most important structural feature (a stellium, a dominant house, an angular pattern). What it means practically.

## Placements
Each planet in turn: sign, house, and 2–4 sentences of precise interpretation. Technical register — behavioral, observable, useful.

## Human Design Mechanics
Type and strategy, authority (how to actually use it in decisions), profile, defined/open centers (what each open center absorbs), channels. Write it as an operating manual.

## Gene Keys Map
For each sphere given (Activation, Venus, Pearl sequences): the gate.line with its classic Shadow → Gift → Siddhi arc in one line each, and one sentence on what this sphere governs.

## Numerology
Life Path (and Expression / Soul Urge if given) — meaning in 2–3 sentences each.

## Elemental & Modal Balance
Count fire/earth/air/water and cardinal/fixed/mutable from the placements; state the practical implication of the dominant and missing qualities.

## Career & Public Life
Grounded in MC, 10th house, North Node, and HD type. Concrete fields and working styles.

## Relationships
Grounded in 7th house, Venus, Mars, and the Venus Sequence. Attachment style, needs, friction points.

## Themes to Come Back To
5 numbered questions this chart keeps asking across a lifetime.

## Quick Reference
A code block (\`\`\`) with one aligned line per placement: planet, sign+degree, house, keyword. Include HD type/authority/profile and the GK sequence gates as final lines.

VOICE: second person, analytical, compact, zero mysticism-for-its-own-sake. Every claim traceable to a specific data point above. If data is missing, say so and move on. Approximately 2000–2800 words.`;
}

async function generateDoc(prompt, onChunk) {
  // Full length restored: Cloudflare streams and limits CPU (not wait) time.
  try {
    return await llmComplete({ messages: [{ role: 'user', content: prompt }], max_tokens: 8000, onChunk });
  } catch { return null; }
}

// ─── PLACE AUTOCOMPLETE ──────────────────────────────────────────────────────
let _placeTimer = null;
let _placeSuggestions = [];

function onPlaceInput(input) {
  clearTimeout(_placeTimer);
  const q = input.value.trim();
  hidePlaceSuggestions();
  if (q.length < 2) return;
  _placeTimer = setTimeout(() => fetchPlaces(q), 360);
}

async function fetchPlaces(q) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1&featuretype=settlement&accept-language=en`;
    const res = await fetch(url);
    if (!res.ok) return;
    const raw = await res.json();
    const kept = new Set();
    _placeSuggestions = raw
      .map(r => {
        const city    = r.address?.city || r.address?.town || r.address?.village || r.address?.municipality || r.address?.county || r.name;
        const state   = r.address?.state || r.address?.county || '';
        const country = r.address?.country || '';
        const key = `${city}|${country}`;
        if (!city || kept.has(key)) return null;
        kept.add(key);
        return { city, state, country, lat: +r.lat, lon: +r.lon };
      })
      .filter(Boolean)
      .slice(0, 5);
    showPlaceSuggestions();
  } catch {}
}

function showPlaceSuggestions() {
  const el = document.getElementById('placeSuggestions');
  if (!el) return;
  if (!_placeSuggestions.length) { hidePlaceSuggestions(); return; }
  el.innerHTML = _placeSuggestions.map((p, i) => `
    <div class="ps-item" onmousedown="selectPlace(${i})">
      <div class="ps-city">${esc(p.city)}</div>
      <div class="ps-region">${esc([p.state, p.country].filter(Boolean).join(', '))}</div>
    </div>`).join('');
  el.style.display = 'block';
}

function hidePlaceSuggestions() {
  const el = document.getElementById('placeSuggestions');
  if (el) el.style.display = 'none';
}

function selectPlace(i) {
  const p = _placeSuggestions[i];
  if (!p) return;
  const input = document.getElementById('wPlace');
  if (input) input.value = [p.city, p.country].filter(Boolean).join(', ');
  WZ.data.lat = p.lat;
  WZ.data.lon = p.lon;
  WZ.data.tz  = null; // re-resolve for the new place
  hidePlaceSuggestions();
}

// ─── ASTRO ENGINE (natal chart · Human Design · Gene Keys) ──────────────────
const AE_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const D2R = Math.PI/180, R2D = 180/Math.PI;

function fmtLon(l) {
  l = ((l % 360) + 360) % 360;
  const s = Math.floor(l / 30), d = l % 30;
  return `${AE_SIGNS[s]} ${String(Math.floor(d)).padStart(2,'0')}°${String(Math.floor((d%1)*60)).padStart(2,'0')}'`;
}

function meanNode(dateUTC) {
  const jd = dateUTC.getTime()/86400000 + 2440587.5;
  const T = (jd - 2451545.0)/36525.0;
  const o = 125.0445479 - 1934.1362891*T + 0.0020754*T*T + T*T*T/467441;
  return ((o % 360) + 360) % 360;
}

function eclLonOf(body, date) {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

function obliquityAt(dateUTC) {
  const jd = dateUTC.getTime()/86400000 + 2440587.5;
  return 23.4392911 - 0.0130042*((jd - 2451545.0)/36525.0);
}

function anglesAndCusps(dateUTC, lat, lon) {
  const eps = obliquityAt(dateUTC);
  const ramc = ((Astronomy.SiderealTime(dateUTC)*15 + lon) % 360 + 360) % 360;
  const mc  = (Math.atan2(Math.sin(ramc*D2R), Math.cos(ramc*D2R)*Math.cos(eps*D2R))*R2D + 360) % 360;
  const asc = (Math.atan2(Math.cos(ramc*D2R),
               -(Math.sin(ramc*D2R)*Math.cos(eps*D2R) + Math.tan(lat*D2R)*Math.sin(eps*D2R)))*R2D + 360) % 360;

  function placidus(offset, frac) {
    let alpha = (ramc + offset) % 360, lam = 0;
    for (let i = 0; i < 30; i++) {
      lam = (Math.atan2(Math.sin(alpha*D2R), Math.cos(alpha*D2R)*Math.cos(eps*D2R))*R2D + 360) % 360;
      const delta = Math.asin(Math.sin(eps*D2R)*Math.sin(lam*D2R));
      const x = Math.max(-1, Math.min(1, Math.tan(lat*D2R)*Math.tan(delta)));
      alpha = (ramc + offset + frac*(Math.asin(x)*R2D)) % 360;
    }
    return lam;
  }

  const c11 = placidus(30, 1/3), c12 = placidus(60, 2/3);
  const c2 = placidus(120, 2/3), c3 = placidus(150, 1/3);
  const cusps = [asc, c2, c3, (mc+180)%360, (c11+180)%360, (c12+180)%360,
                 (asc+180)%360, (c2+180)%360, (c3+180)%360, mc, c11, c12];
  return { asc, mc, cusps };
}

function houseOf(lon, cusps) {
  for (let h = 0; h < 12; h++) {
    const a = cusps[h], b = cusps[(h+1)%12];
    if (((lon - a) + 360) % 360 < ((b - a) + 360) % 360) return h + 1;
  }
  return 1;
}

const AE_PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];

function computeChart(dateUTC, lat, lon, withHouses) {
  const planets = AE_PLANETS.map(p => ({ name: p, lon: eclLonOf(p, dateUTC) }));
  planets.push({ name: 'N.Node', lon: meanNode(dateUTC) });
  let angles = null;
  if (withHouses && lat != null && Math.abs(lat) < 66) {
    angles = anglesAndCusps(dateUTC, lat, lon);
    planets.forEach(p => p.house = houseOf(p.lon, angles.cusps));
  }
  return { planets, angles };
}

// ─── LIVE TRANSITS (current sky + aspects to natal) ─────────────────────────
const ASPECTS = [
  { name: 'conjunction', angle: 0,   orb: 3 },
  { name: 'sextile',     angle: 60,  orb: 2 },
  { name: 'square',      angle: 90,  orb: 3 },
  { name: 'trine',       angle: 120, orb: 3 },
  { name: 'opposition',  angle: 180, orb: 3 }
];
const SLOW_BODIES = new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto','N.Node']);

function isRetro(body, date) {
  if (body === 'Sun' || body === 'Moon' || body === 'N.Node') return body === 'N.Node';
  const a = eclLonOf(body, date);
  const b = eclLonOf(body, new Date(date.getTime() + 86400000));
  return (((b - a + 540) % 360) - 180) < 0;
}

function computeTransits(nowUTC) {
  const list = AE_PLANETS.map(p => ({ name: p, lon: eclLonOf(p, nowUTC), retro: isRetro(p, nowUTC) }));
  list.push({ name: 'N.Node', lon: meanNode(nowUTC), retro: true });
  return list;
}

function transitAspects(transits, natalPlanets) {
  const hits = [];
  for (const t of transits) {
    if (t.name === 'Moon') continue; // too fast to be meaningful as a standing transit
    for (const n of natalPlanets) {
      const sep = Math.abs(((t.lon - n.lon + 540) % 360) - 180);
      for (const asp of ASPECTS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= asp.orb) hits.push({ t: t.name, n: n.name, asp: asp.name, orb: +orb.toFixed(1), retro: t.retro, slow: SLOW_BODIES.has(t.name) });
      }
    }
  }
  hits.sort((a, b) => (b.slow - a.slow) || (a.orb - b.orb));
  return hits;
}

function buildTransitContext(profile, full) {
  if (typeof Astronomy === 'undefined') return '';
  try {
    const now = new Date();
    const transits = computeTransits(now);
    const stamp = now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
    let out = `\nCURRENT TRANSITING SKY — live ephemeris, ${stamp} (${Intl.DateTimeFormat().resolvedOptions().timeZone}):\n` +
      transits.map(t => `${t.name.padEnd(8)} ${fmtLon(t.lon)}${t.retro ? ' ℞ retrograde' : ''}`).join('\n');

    if (profile.birthDate) {
      const utc = localToUTC(profile.birthDate, profile.birthTime, profile.tz, profile.lon);
      const natal = computeChart(utc, profile.lat, profile.lon, !!profile.birthTime && profile.lat != null);
      const hits = transitAspects(transits, natal.planets).filter(h => h.slow || h.orb <= 1).slice(0, full ? 18 : 9);
      if (hits.length) {
        out += `\n\nACTIVE TRANSITS TO NATAL CHART (transiting → natal; slowest & tightest first):\n` +
          hits.map(h => `Transiting ${h.t}${h.retro ? ' ℞' : ''} ${h.asp} natal ${h.n} (orb ${h.orb}°)`).join('\n');
      }
      if (natal.angles?.cusps) {
        const byHouse = transits.filter(t => SLOW_BODIES.has(t.name))
          .map(t => `Transiting ${t.name} in natal House ${houseOf(t.lon, natal.angles.cusps)}`);
        if (byHouse.length) out += `\n\nSLOW TRANSITS BY NATAL HOUSE:\n` + byHouse.join('\n');
      }
    }
    return out;
  } catch { return ''; }
}

// Human Design gate wheel: 64 gates × 5.625°, anchored at Gate 41 = 302° (2° Aquarius)
const GATE_WHEEL = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];

function gateLine(lon) {
  const off = ((lon - 302) % 360 + 360) % 360;
  return { gate: GATE_WHEEL[Math.floor(off / 5.625)], line: Math.floor((off % 5.625) / 0.9375) + 1 };
}

const HD_CHANNELS = [[1,8],[2,14],[3,60],[4,63],[5,15],[6,59],[7,31],[9,52],[10,20],[10,34],[10,57],[11,56],[12,22],[13,33],[16,48],[17,62],[18,58],[19,49],[20,34],[20,57],[21,45],[23,43],[24,61],[25,51],[26,44],[27,50],[28,38],[29,46],[30,41],[32,54],[34,57],[35,36],[37,40],[39,55],[42,53],[47,64]];

const HD_CENTERS = {
  'Head': [64,61,63], 'Ajna': [47,24,4,17,43,11],
  'Throat': [62,23,56,35,12,45,33,8,31,20,16], 'G': [1,13,25,46,2,15,10,7],
  'Heart': [26,51,21,40], 'Sacral': [34,5,14,29,59,9,3,42,27],
  'Spleen': [48,57,44,50,32,28,18], 'Solar Plexus': [36,22,37,6,49,55,30],
  'Root': [58,38,54,53,60,52,19,39,41]
};
const HD_MOTORS = ['Sacral','Solar Plexus','Heart','Root'];

function centerOfGate(g) {
  for (const c in HD_CENTERS) if (HD_CENTERS[c].includes(g)) return c;
  return null;
}

function hdActivations(date) {
  const sun = eclLonOf('Sun', date);
  const node = meanNode(date);
  const list = [
    { body: 'Sun', lon: sun }, { body: 'Earth', lon: (sun+180)%360 },
    { body: 'Moon', lon: eclLonOf('Moon', date) },
    { body: 'N.Node', lon: node }, { body: 'S.Node', lon: (node+180)%360 }
  ];
  for (const p of ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'])
    list.push({ body: p, lon: eclLonOf(p, date) });
  list.forEach(a => Object.assign(a, gateLine(a.lon)));
  return list;
}

function computeHD(birthUTC, designUTC) {
  const pers = hdActivations(birthUTC), des = hdActivations(designUTC);
  const gates = new Set([...pers, ...des].map(a => a.gate));

  const channels = HD_CHANNELS.filter(([a,b]) => gates.has(a) && gates.has(b));
  const defined = new Set(), edges = [];
  channels.forEach(([a,b]) => {
    const ca = centerOfGate(a), cb = centerOfGate(b);
    defined.add(ca); defined.add(cb);
    edges.push([ca, cb]);
  });

  function connected(from, to) {
    const seen = new Set([from]), q = [from];
    while (q.length) {
      const c = q.shift();
      if (c === to) return true;
      edges.forEach(([a,b]) => {
        if (a === c && !seen.has(b)) { seen.add(b); q.push(b); }
        if (b === c && !seen.has(a)) { seen.add(a); q.push(a); }
      });
    }
    return false;
  }
  const motorToThroat = HD_MOTORS.some(m => defined.has(m) && connected(m, 'Throat'));

  let type;
  if (!defined.size) type = 'Reflector';
  else if (defined.has('Sacral')) type = motorToThroat ? 'Manifesting Generator' : 'Generator';
  else if (motorToThroat) type = 'Manifestor';
  else type = 'Projector';

  let authority;
  if (type === 'Reflector') authority = 'Lunar (wait a full moon cycle)';
  else if (defined.has('Solar Plexus')) authority = 'Emotional';
  else if (defined.has('Sacral')) authority = 'Sacral';
  else if (defined.has('Spleen')) authority = 'Splenic';
  else if (defined.has('Heart')) authority = 'Ego';
  else if (defined.has('G')) authority = 'Self-Projected';
  else authority = 'Mental / Environmental';

  return { type, authority, profile: `${pers[0].line}/${des[0].line}`,
           defined: [...defined], channels, pers, des };
}

// ─── AUTO-CALC ORCHESTRATION ─────────────────────────────────────────────────
async function fetchTimezone(lat, lon) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`);
    if (!res.ok) return null;
    return (await res.json()).timezone || null;
  } catch { return null; }
}

async function geocodeBirthPlace() {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(WZ.data.birthPlace)}&format=json&limit=1&featuretype=settlement&accept-language=en`);
    const arr = await res.json();
    if (arr[0]) { WZ.data.lat = +arr[0].lat; WZ.data.lon = +arr[0].lon; }
  } catch {}
}

function localToUTC(dateStr, timeStr, tz, lonFallback) {
  const [y,mo,d] = dateStr.split('-').map(Number);
  const [hh,mm]  = (timeStr || '12:00').split(':').map(Number);
  const base = Date.UTC(y, mo-1, d, hh, mm);
  if (!tz) {
    const offMin = lonFallback != null ? Math.round(lonFallback/15)*60 : 0;
    return new Date(base - offMin*60000);
  }
  let guess = base;
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' });
  for (let i = 0; i < 3; i++) {
    const name = dtf.formatToParts(new Date(guess)).find(p => p.type === 'timeZoneName').value;
    const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    const offMin = m ? (m[1]==='-'?-1:1) * (+m[2]*60 + +(m[3]||0)) : 0;
    const next = base - offMin*60000;
    if (next === guess) break;
    guess = next;
  }
  return new Date(guess);
}

function buildChartText(chart, hasTime) {
  const lines = [];
  chart.planets.forEach(p => lines.push(`${p.name.padEnd(8)} ${fmtLon(p.lon)}${p.house ? '  ·  House ' + p.house : ''}`));
  if (chart.angles) {
    lines.push(`ASC      ${fmtLon(chart.angles.asc)}`);
    lines.push(`MC       ${fmtLon(chart.angles.mc)}`);
    lines.push('');
    lines.push('(auto-calculated · Placidus houses · tropical zodiac)');
  } else {
    lines.push('');
    lines.push(hasTime
      ? '(auto-calculated · houses omitted — location missing or polar latitude)'
      : '(auto-calculated at 12:00 — no birth time: ASC/houses omitted, Moon approximate)');
  }
  return lines.join('\n');
}

function buildHDText(hd, hasTime) {
  const gl = a => `${a.body} ${a.gate}.${a.line}`;
  const lines = [
    `Type: ${hd.type}`,
    `Authority: ${hd.authority}`,
    `Profile: ${hd.profile}`,
    `Defined centers: ${hd.defined.join(', ') || 'none'}`,
    `Channels: ${hd.channels.map(c => c.join('-')).join(', ') || 'none'}`,
    `Personality: ${hd.pers.map(gl).join(' · ')}`,
    `Design: ${hd.des.map(gl).join(' · ')}`
  ];
  if (!hasTime) lines.push('(⚠ calculated without birth time — type/authority may be inaccurate)');
  return lines.join('\n');
}

function buildGKText(hd, hasTime) {
  const f = (arr, body) => { const a = arr.find(x => x.body === body); return `${a.gate}.${a.line}`; };
  const lines = [
    'ACTIVATION SEQUENCE',
    `Life's Work: ${f(hd.pers,'Sun')}`,
    `Evolution: ${f(hd.pers,'Earth')}`,
    `Radiance: ${f(hd.des,'Sun')}`,
    `Purpose: ${f(hd.des,'Earth')}`,
    '',
    'VENUS SEQUENCE',
    `Attraction: ${f(hd.des,'Moon')}`,
    `IQ: ${f(hd.pers,'Venus')}`,
    `EQ: ${f(hd.pers,'Mars')}`,
    `SQ: ${f(hd.des,'Venus')}`,
    `Core: ${f(hd.des,'Mars')}`,
    '',
    'PEARL SEQUENCE',
    `Vocation: ${f(hd.des,'Mars')}`,
    `Culture: ${f(hd.des,'Jupiter')}`,
    `Brand: ${f(hd.pers,'Sun')}`,
    `Pearl: ${f(hd.pers,'Jupiter')}`
  ];
  if (!hasTime) lines.push('', '(calculated without birth time — lines may shift)');
  return lines.join('\n');
}

async function autoCalcAll(force) {
  const st = document.getElementById('calcStatus');
  const chartEl = document.getElementById('wChart');
  const hdEl = document.getElementById('wHumanDesign');
  const gkEl = document.getElementById('wGeneKeys');
  if (!chartEl || !st) return;
  if (!WZ.data.birthDate) { st.textContent = 'Add your birth date in the previous step to calculate automatically.'; return; }
  if (!force && (chartEl.value.trim() || hdEl.value.trim() || gkEl.value.trim())) {
    st.textContent = '✓ Using the data below — tap Recalculate to compute fresh from birth data.';
    return;
  }
  if (typeof Astronomy === 'undefined') {
    st.textContent = 'Calculation engine could not load — you can paste your chart manually below.';
    return;
  }
  try {
    st.textContent = '☉ Calculating your chart…';
    if (WZ.data.lat == null && WZ.data.birthPlace) await geocodeBirthPlace();
    if (!WZ.data.tz && WZ.data.lat != null) WZ.data.tz = await fetchTimezone(WZ.data.lat, WZ.data.lon);

    const hasTime = !!WZ.data.birthTime;
    const utc = localToUTC(WZ.data.birthDate, WZ.data.birthTime, WZ.data.tz, WZ.data.lon);
    const chart = computeChart(utc, WZ.data.lat, WZ.data.lon, hasTime && WZ.data.lat != null);
    chartEl.value = buildChartText(chart, hasTime);

    const sunLon = chart.planets[0].lon;
    const design = Astronomy.SearchSunLongitude((sunLon - 88 + 360) % 360,
                     new Date(utc.getTime() - 120*86400e3), 60);
    if (design) {
      const hd = computeHD(utc, design.date);
      hdEl.value = buildHDText(hd, hasTime);
      gkEl.value = buildGKText(hd, hasTime);
    }
    st.textContent = '✓ Calculated automatically from your birth data — review or edit anything below.'
      + (hasTime ? '' : ' No birth time given, so houses and ASC are omitted.');
  } catch (e) {
    st.textContent = 'Auto-calculation failed — you can paste data manually below.';
  }
}

