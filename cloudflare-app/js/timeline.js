// ─── TIMELINE (day-by-day transits to the natal chart) ───────────────────────
// Everything is computed in the browser from the profile's birth data with the
// same engine as the natal chart: planets, houses, aspects, stations, ingresses,
// lunations, Human Design channel completions and the numerology personal month.

const TL_BODIES = ['Sun','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const TL_SLOW = new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto']);
const TL_GLYPH = { Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♃', Saturn:'♄',
  Uranus:'♅', Neptune:'♆', Pluto:'♇', 'N.Node':'☊', ASC:'AC', MC:'MC' };
const TL_ASPECTS = [
  { name: 'conjunction', angle: 0,   sym: '☌', w: 1.0 },
  { name: 'opposition',  angle: 180, sym: '☍', w: 0.9 },
  { name: 'square',      angle: 90,  sym: '□', w: 0.8 },
  { name: 'trine',       angle: 120, sym: '△', w: 0.6 },
  { name: 'sextile',     angle: 60,  sym: '⚹', w: 0.4 }
];
const TL_ORB = b => TL_SLOW.has(b) ? 3 : 2;               // display window
const TL_WEIGHT = { Sun:1, Mercury:1, Venus:1, Mars:2, Jupiter:3, Saturn:4, Uranus:4, Neptune:4, Pluto:5 };
const TL_KEY_POINTS = new Set(['Sun','Moon','ASC','MC']);

const TL = { start: null, days: 30, data: null, profileId: null, open: {} };

function tlSign(lon) { return AE_SIGNS[Math.floor((((lon % 360) + 360) % 360) / 30)]; }
function tlDeg(lon) { const d = ((lon % 30) + 30) % 30; return `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2,'0')}'`; }
function tlSep(a, b) { return Math.abs(((a - b + 540) % 360) - 180); }
function tlIso(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function tlNoon(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0); }
function tlAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12, 0, 0); }

function tlReduce(n) { while (n > 9) n = String(n).split('').reduce((a, c) => a + +c, 0); return n; }
function tlPersonalYear(birthDate, year) {
  const [, m, d] = birthDate.split('-').map(Number);
  return tlReduce(m + d + String(year).split('').reduce((a, c) => a + +c, 0));
}

// Natal chart + natal HD gates for a profile
function tlNatal(profile) {
  const hasTime = !!profile.birthTime;
  const utc = localToUTC(profile.birthDate, profile.birthTime, profile.tz, profile.lon);
  const chart = computeChart(utc, profile.lat, profile.lon, hasTime && profile.lat != null);
  const points = chart.planets.filter(p => p.name !== 'N.Node').map(p => ({ name: p.name, lon: p.lon, house: p.house }));
  if (chart.angles) {
    points.push({ name: 'ASC', lon: chart.angles.asc, house: 1 });
    points.push({ name: 'MC',  lon: chart.angles.mc,  house: 10 });
  }
  let gates = new Set();
  try {
    const design = Astronomy.SearchSunLongitude((chart.planets[0].lon - 88 + 360) % 360,
                     new Date(utc.getTime() - 120 * 86400e3), 60);
    if (design) {
      const hd = computeHD(utc, design.date);
      gates = new Set([...hd.pers, ...hd.des].map(a => a.gate));
    }
  } catch {}
  return { points, cusps: chart.angles ? chart.angles.cusps : null, gates };
}

function tlSky(date) {
  const out = {};
  for (const b of ['Sun','Moon',...TL_BODIES.slice(1)]) out[b] = eclLonOf(b, date);
  return out;
}

// New / full moons, eclipses not flagged separately
function tlLunations(from, to) {
  const res = [];
  for (const [target, kind] of [[0, 'New Moon'], [180, 'Full Moon']]) {
    let t = from;
    for (let i = 0; i < 6; i++) {
      const hit = Astronomy.SearchMoonPhase(target, t, (to - t) / 86400e3 + 1);
      if (!hit || hit.date > to) break;
      res.push({ date: hit.date, kind, lon: eclLonOf('Moon', hit.date) });
      t = new Date(hit.date.getTime() + 86400e3);
    }
  }
  return res;
}

function computeTimeline(profile, start, days) {
  const natal = tlNatal(profile);
  const d0 = tlNoon(start);
  const skies = [];
  for (let i = -1; i <= days; i++) skies.push(tlSky(tlAddDays(d0, i)));   // one day before and after for motion
  const lunas = tlLunations(tlAddDays(d0, -1), tlAddDays(d0, days));
  const house = lon => natal.cusps ? houseOf(lon, natal.cusps) : null;

  const out = [];
  for (let i = 0; i < days; i++) {
    const date = tlAddDays(d0, i);
    const prev = skies[i], cur = skies[i + 1], next = skies[i + 2];
    const day = { date, iso: tlIso(date), sky: [], aspects: [], events: [], hd: [], score: 0 };

    // Positions, retrogrades, stations, ingresses
    for (const b of ['Sun','Moon',...TL_BODIES.slice(1)]) {
      const lon = cur[b];
      const mv  = ((next[b] - lon + 540) % 360) - 180;
      const mvp = ((lon - prev[b] + 540) % 360) - 180;
      day.sky.push({ body: b, lon, sign: tlSign(lon), deg: tlDeg(lon), house: house(lon), retro: b !== 'Sun' && b !== 'Moon' && mv < 0 });
      if (b !== 'Sun' && b !== 'Moon' && (mv < 0) !== (mvp < 0)) {
        day.events.push({ kind: 'station', text: `${b} stations ${mv < 0 ? 'retrograde' : 'direct'} at ${tlDeg(lon)} ${tlSign(lon)}${house(lon) ? ` (House ${house(lon)})` : ''}`, w: TL_SLOW.has(b) ? 4 : 3 });
      }
      if (b !== 'Moon' && tlSign(prev[b]) !== tlSign(lon)) {
        day.events.push({ kind: 'ingress', text: `${b} enters ${tlSign(lon)}${house(lon) ? ` (House ${house(lon)})` : ''}`, w: TL_SLOW.has(b) ? 3 : 1 });
      }
    }

    // Aspects to natal points
    for (const b of TL_BODIES) {
      const lon = cur[b], lonN = next[b], lonP = prev[b];
      const speed = Math.abs(((lonN - lon + 540) % 360) - 180);
      for (const n of natal.points) {
        const sep = tlSep(lon, n.lon);
        for (const a of TL_ASPECTS) {
          const orb = Math.abs(sep - a.angle);
          if (orb > TL_ORB(b)) continue;
          const orbN = Math.abs(tlSep(lonN, n.lon) - a.angle);
          const orbP = Math.abs(tlSep(lonP, n.lon) - a.angle);
          // Exact = the closest day of this pass, and close enough to count
          const exact = orb <= orbP && orb < orbN && orb <= Math.max(0.6 * speed, 0.25);
          const applying = orbN < orb;
          const key = TL_KEY_POINTS.has(n.name) ? 2 : 1;
          const strength = TL_WEIGHT[b] * a.w * key * (1 - orb / (TL_ORB(b) + 0.5));
          day.aspects.push({ t: b, n: n.name, asp: a.name, sym: a.sym, orb, exact, applying,
                             th: house(lon), nh: n.house, strength, background: TL_SLOW.has(b) && orb > 1 && !exact });
          // Heat favours what changes day to day: exact hits and events, not standing slow aspects
          day.score += exact ? strength * 3 + TL_WEIGHT[b] : (TL_SLOW.has(b) ? strength * 0.1 : strength * 0.3);
        }
      }
    }
    day.aspects.sort((x, y) => (y.exact - x.exact) || (y.strength - x.strength));

    // Lunations falling on this calendar day
    for (const l of lunas) {
      if (tlIso(l.date) === day.iso) {
        day.events.push({ kind: 'lunation', text: `${l.kind} at ${tlDeg(l.lon)} ${tlSign(l.lon)}${house(l.lon) ? ` (House ${house(l.lon)})` : ''}`, w: 3 });
      }
    }
    day.events.forEach(e => day.score += e.w);

    // Human Design: transit gates completing a channel with natal gates
    if (natal.gates.size) {
      const seen = new Set();
      const bodies = [...TL_BODIES, 'Earth'];
      for (const b of bodies) {
        const lon = b === 'Earth' ? (cur.Sun + 180) % 360 : cur[b];
        const { gate, line } = gateLine(lon);
        if (natal.gates.has(gate)) continue;
        for (const [a, c] of HD_CHANNELS) {
          const other = a === gate ? c : c === gate ? a : null;
          if (other == null || !natal.gates.has(other)) continue;
          const k = `${b}-${a}-${c}`;
          if (seen.has(k)) continue;
          seen.add(k);
          day.hd.push({ body: b, gate, line, channel: `${Math.min(a,c)}-${Math.max(a,c)}`, name: HD_CHANNEL_NAMES[`${Math.min(a,c)}-${Math.max(a,c)}`] || '' });
        }
      }
    }

    // Numerology
    const py = tlPersonalYear(profile.birthDate, date.getFullYear());
    day.py = py;
    day.pm = tlReduce(py + date.getMonth() + 1);
    out.push(day);
  }
  const max = Math.max(...out.map(d => d.score)), min = Math.min(...out.map(d => d.score));
  out.forEach(d => d.heat = max > min ? (d.score - min) / (max - min) : 0.5);
  return out;
}

const HD_CHANNEL_NAMES = {
  '1-8':'Inspiration','2-14':'The Beat','3-60':'Mutation','4-63':'Logic','5-15':'Rhythm','6-59':'Mating',
  '7-31':'The Alpha','9-52':'Concentration','10-20':'Awakening','10-34':'Exploration','10-57':'Perfected Form',
  '11-56':'Curiosity','12-22':'Openness','13-33':'The Prodigal','16-48':'The Wavelength','17-62':'Acceptance',
  '18-58':'Judgment','19-49':'Synthesis','20-34':'Charisma','20-57':'The Brainwave','21-45':'Money',
  '23-43':'Structuring','24-61':'Awareness','25-51':'Initiation','26-44':'Surrender','27-50':'Preservation',
  '28-38':'Struggle','29-46':'Discovery','30-41':'Recognition','32-54':'Transformation','34-57':'Power',
  '35-36':'Transitoriness','37-40':'Community','39-55':'Emoting','42-53':'Maturation','47-64':'Abstraction'
};

// ─── TEXT FOR THE MODEL ──────────────────────────────────────────────────────
function tlAspectText(a) {
  return `Transiting ${a.t}${a.th ? ` (House ${a.th})` : ''} ${a.asp} natal ${a.n}${a.nh ? ` (House ${a.nh})` : ''} — orb ${a.orb.toFixed(1)}°, ${a.exact ? 'EXACT today' : a.applying ? 'building' : 'fading'}`;
}

function tlDayText(day) {
  const when = day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const lines = [`FOCUS DAY: ${when}`];
  lines.push('Sky: ' + day.sky.map(s => `${s.body} ${s.deg} ${s.sign}${s.retro ? ' ℞' : ''}${s.house ? ' H' + s.house : ''}`).join(' · '));
  if (day.events.length) lines.push('Events: ' + day.events.map(e => e.text).join('; '));
  const main = day.aspects.filter(a => !a.background);
  const bg = day.aspects.filter(a => a.background);
  if (main.length) lines.push('Active aspects to the natal chart:\n' + main.map(a => '  ' + tlAspectText(a)).join('\n'));
  if (bg.length) lines.push('Background (slow, wider orb):\n' + bg.map(a => '  ' + tlAspectText(a)).join('\n'));
  if (day.hd.length) lines.push('Human Design — transits completing channels with natal gates: ' +
    day.hd.map(h => `${h.body} in Gate ${h.gate}.${h.line} → channel ${h.channel}${h.name ? ' ' + h.name : ''}`).join('; '));
  lines.push(`Numerology: Personal Year ${day.py}, Personal Month ${day.pm}`);
  return lines.join('\n');
}

// Compact list of what is coming, for timing questions in Transits mode
function buildUpcomingContext(profile, days) {
  try {
    if (!profile.birthDate || typeof Astronomy === 'undefined') return '';
    const tl = computeTimeline(profile, new Date(), days || 45);
    const rows = [];
    for (const d of tl) {
      const bits = [];
      d.events.forEach(e => bits.push(e.text));
      d.aspects.filter(a => a.exact).forEach(a => bits.push(`${a.t} ${a.asp} natal ${a.n} exact`));
      const newHd = d.hd.filter(h => !tl[tl.indexOf(d) - 1]?.hd.some(p => p.body === h.body && p.channel === h.channel));
      newHd.forEach(h => bits.push(`HD: ${h.body} completes channel ${h.channel}${h.name ? ' ' + h.name : ''}`));
      if (bits.length) rows.push(`${d.iso}: ${bits.join('; ')}`);
    }
    if (!rows.length) return '';
    return `\n\nUPCOMING TIMELINE — next ${days || 45} days, computed (exact aspects to the natal chart, stations, ingresses, lunations, HD channel completions):\n${rows.join('\n')}`;
  } catch { return ''; }
}

// ─── UI ──────────────────────────────────────────────────────────────────────
function renderTimeline(force) {
  const pane = document.getElementById('timelineContent');
  const ctrl = document.getElementById('timelineControls');
  if (!pane || !ctrl) return;
  const profile = getActiveProfile();
  if (!TL.start) TL.start = new Date();

  ctrl.innerHTML = `
    <label class="tl-ctl">From <input type="date" id="tlStart" value="${tlIso(TL.start)}" onchange="tlSetStart(this.value)"></label>
    <label class="tl-ctl">Range
      <select id="tlDays" onchange="tlSetDays(this.value)">
        ${[7, 14, 30, 60, 90].map(n => `<option value="${n}" ${n === TL.days ? 'selected' : ''}>${n} days</option>`).join('')}
      </select>
    </label>
    <button class="btn-sm" onclick="tlSetStart('${tlIso(new Date())}')">Today</button>`;

  if (!profile?.birthDate) {
    pane.innerHTML = `<p class="tl-empty">Add your birth date (and ideally time and place) in Edit chart to see your timeline.</p>`;
    return;
  }
  if (typeof Astronomy === 'undefined') {
    pane.innerHTML = `<p class="tl-empty">The calculation engine could not load. Check your connection and reopen this tab.</p>`;
    return;
  }
  const cacheKey = `${profile.id}|${tlIso(TL.start)}|${TL.days}|${profile.birthDate}|${profile.birthTime}|${profile.lat}`;
  if (force || !TL.data || TL.cacheKey !== cacheKey) {
    pane.innerHTML = `<p class="tl-empty">Calculating…</p>`;
    try { TL.data = computeTimeline(profile, TL.start, TL.days); TL.cacheKey = cacheKey; }
    catch (e) { pane.innerHTML = `<p class="tl-empty">Could not calculate the timeline.</p>`; return; }
  }
  const noHouses = !profile.birthTime || profile.lat == null;

  const strip = `<div class="tl-strip" role="list" aria-label="Intensity by day">` + TL.data.map((d, i) => {
    const lvl = d.heat > 0.75 ? 4 : d.heat > 0.5 ? 3 : d.heat > 0.28 ? 2 : 1;
    const label = d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `<button class="tl-bar lvl${lvl}" role="listitem" title="${label}" style="height:${Math.round(18 + d.heat * 42)}px" onclick="tlJump(${i})"></button>`;
  }).join('') + `</div>
    <div class="tl-strip-legend"><span>${TL.data[0].date.toLocaleDateString('en-US', { month:'short', day:'numeric' })}</span><span>Taller = more activity (exact aspects, stations, lunations)</span><span>${TL.data[TL.data.length-1].date.toLocaleDateString('en-US', { month:'short', day:'numeric' })}</span></div>`;

  const cards = TL.data.map((d, i) => tlCard(d, i)).join('');
  pane.innerHTML = strip + (noHouses ? `<p class="tl-note">No birth time or place saved, so houses and Ascendant/MC aspects are not shown.</p>` : '') + cards;
}

function tlCard(d, i) {
  const label = d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const isToday = d.iso === tlIso(new Date());
  const main = d.aspects.filter(a => !a.background);
  const bg = d.aspects.filter(a => a.background);
  const lvl = d.heat > 0.75 ? 4 : d.heat > 0.5 ? 3 : d.heat > 0.28 ? 2 : 1;
  const open = TL.open[d.iso];

  const events = d.events.length
    ? `<div class="tl-events">${d.events.map(e => `<span class="tl-ev tl-ev-${e.kind}">${esc(e.text)}</span>`).join('')}</div>` : '';

  const aspRow = a => `
    <div class="tl-asp ${a.exact ? 'exact' : ''}">
      <span class="tl-g">${TL_GLYPH[a.t]}</span>
      <span class="tl-sym" title="${a.asp}">${a.sym}</span>
      <span class="tl-g">${TL_GLYPH[a.n] || esc(a.n)}</span>
      <span class="tl-asp-txt">${a.t}${a.th ? ` <em>H${a.th}</em>` : ''} ${a.asp} natal ${a.n}${a.nh ? ` <em>H${a.nh}</em>` : ''}</span>
      <span class="tl-orb">${a.exact ? '<b>exact</b>' : `${a.orb.toFixed(1)}° ${a.applying ? '↗' : '↘'}`}</span>
    </div>`;

  const aspects = main.length ? main.map(aspRow).join('') : `<div class="tl-quiet">No close aspects to your chart from the faster planets.</div>`;
  const bgHtml = bg.length ? `<div class="tl-bg">Background: ${bg.map(a => `${a.t} ${a.asp} ${a.n} (${a.orb.toFixed(1)}°)`).join(' · ')}</div>` : '';
  const hd = d.hd.length ? `<div class="tl-hd">HD · ${d.hd.map(h => `${h.body} ${h.gate}.${h.line} → ${h.channel}${h.name ? ' ' + h.name : ''}`).join(' · ')}</div>` : '';

  const sky = `
    <div class="tl-sky ${open ? 'open' : ''}">
      ${d.sky.map(s => `<div class="tl-sky-row"><span class="tl-g">${TL_GLYPH[s.body]}</span><span>${s.body}</span><span>${s.deg} ${s.sign}${s.retro ? ' ℞' : ''}</span><span>${s.house ? 'H' + s.house : ''}</span></div>`).join('')}
    </div>`;

  return `
    <div class="tl-card${isToday ? ' today' : ''}" id="tl-day-${i}">
      <div class="tl-head">
        <span class="tl-dot lvl${lvl}"></span>
        <span class="tl-date">${label}${isToday ? ' · today' : ''}</span>
        <span class="tl-num" title="Personal Year · Personal Month">PY ${d.py} · PM ${d.pm}</span>
      </div>
      ${events}
      <div class="tl-asps">${aspects}</div>
      ${bgHtml}
      ${hd}
      <div class="tl-actions">
        <button class="btn-sm" onclick="tlToggleSky('${d.iso}')">${open ? 'Hide sky' : 'Show sky'}</button>
        <button class="btn-sm tl-ask" onclick="tlAsk(${i})">✦ Ask about this day</button>
      </div>
      ${sky}
    </div>`;
}

function tlSetStart(v) { const [y, m, d] = v.split('-').map(Number); if (!y) return; TL.start = new Date(y, m - 1, d, 12); renderTimeline(); }
function tlSetDays(v) { TL.days = +v || 30; renderTimeline(); }
function tlToggleSky(iso) { TL.open[iso] = !TL.open[iso]; renderTimeline(); }
function tlJump(i) { const el = document.getElementById('tl-day-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function tlAsk(i) {
  const d = TL.data?.[i];
  if (!d) return;
  S.focusDay = { iso: d.iso, text: tlDayText(d) };
  // Switch to the conversation in Transits mode and send the question
  const tbtn = document.querySelector('.mode-btn[data-mode="transit"]');
  if (tbtn) setMode(tbtn);
  switchTab('compass', document.querySelector('.tab[data-tab="compass"]'));
  const when = d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const box = document.getElementById('inputBox');
  box.value = `What does ${when} hold for me?`;
  send();
}
