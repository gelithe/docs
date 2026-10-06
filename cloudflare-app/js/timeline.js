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

const TL = { start: null, days: 30, data: null, open: {}, why: {}, detail: false, with: new Set(), together: null };

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
        day.events.push({ kind: 'station', body: b, sub: mv < 0 ? 'retrograde' : 'direct', house: house(lon), text: `${b} stations ${mv < 0 ? 'retrograde' : 'direct'} at ${tlDeg(lon)} ${tlSign(lon)}${house(lon) ? ` (House ${house(lon)})` : ''}`, w: TL_SLOW.has(b) ? 4 : 3 });
      }
      if (b !== 'Moon' && tlSign(prev[b]) !== tlSign(lon)) {
        day.events.push({ kind: 'ingress', body: b, sub: tlSign(lon), house: house(lon), text: `${b} enters ${tlSign(lon)}${house(lon) ? ` (House ${house(lon)})` : ''}`, w: TL_SLOW.has(b) ? 3 : 1 });
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
        day.events.push({ kind: 'lunation', sub: l.kind, house: house(l.lon), text: `${l.kind} at ${tlDeg(l.lon)} ${tlSign(l.lon)}${house(l.lon) ? ` (House ${house(l.lon)})` : ''}`, w: 3 });
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
  out.natal = natal;
  out.skies = skies;
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

// ─── BUILT-IN READINGS (no model call) ───────────────────────────────────────
const TL_TP = { Sun:'attention and vitality', Mercury:'thinking, talks and messages', Venus:'connection, pleasure and value',
  Mars:'drive and heat', Jupiter:'growth and opportunity', Saturn:'structure, limits and commitment',
  Uranus:'change and surprise', Neptune:'sensitivity, inspiration and some haze', Pluto:'deep pressure and transformation' };
const TL_NP = { Sun:'your core identity', Moon:'your emotions and home life', Mercury:'your mind and communication',
  Venus:'your relationships and values', Mars:'your drive and assertiveness', Jupiter:'your growth and optimism',
  Saturn:'your responsibilities', Uranus:'your need for freedom', Neptune:'your ideals', Pluto:'your sense of power',
  ASC:'how you show up', MC:'your career and public direction' };
const TL_AV = { conjunction:'merges with and intensifies', opposition:'faces off with, bringing awareness through others, around',
  square:'presses on, asking for action around', trine:'flows easily into', sextile:'opens a door for, with a small step needed, around' };
const TL_HOUSE = { 1:'self and presence', 2:'money and resources', 3:'communication, siblings and neighbours', 4:'home and family',
  5:'children, play and creativity', 6:'work routines and health', 7:'your partner and close partnerships', 8:'shared resources and intimacy',
  9:'learning, travel and teaching', 10:'career and reputation', 11:'friends, networks and future plans', 12:'rest, retreat and inner work' };
// Houses that carry personal life; a transit falling here also names that area in the day's plain summary
const TL_LIFE_HOUSES = { 3:'siblings and neighbours', 4:'home and family', 5:'children and play', 7:'your partner', 11:'friends' };

function tlReadAspect(a) {
  const where = a.th ? `, working through ${TL_HOUSE[a.th]}` : '';
  return `${a.t} brings ${TL_TP[a.t]} that ${TL_AV[a.asp]} ${TL_NP[a.n] || a.n}${where}.`;
}
function tlReadEvent(e) {
  const h = e.house ? TL_HOUSE[e.house] : null;
  if (e.kind === 'station') return e.sub === 'retrograde'
    ? `${e.body} turns retrograde${h ? ` in your house of ${h}` : ''}: a stretch for review, not new launches, in this area.`
    : `${e.body} turns direct${h ? ` in your house of ${h}` : ''}: what was on hold can move forward again.`;
  if (e.kind === 'lunation') return e.sub === 'New Moon'
    ? `New Moon${h ? ` in your house of ${h}` : ''}: a natural starting point, good for setting an intention.`
    : `Full Moon${h ? ` in your house of ${h}` : ''}: things come to a head or become visible; good for completing.`;
  if (e.kind === 'ingress' && TL_SLOW.has(e.body)) return `${e.body} enters ${e.sub}${h ? `, your house of ${h}` : ''}: a longer chapter begins here.`;
  return null;
}
function tlReadings(day) {
  const out = [];
  day.events.forEach(e => { const r = tlReadEvent(e); if (r) out.push(r); });
  const exact = day.aspects.filter(a => a.exact).slice(0, 3);
  const pool = exact.length ? exact : day.aspects.filter(a => !a.background).slice(0, 1);
  pool.forEach(a => out.push((a.exact ? 'Peak today: ' : '') + tlReadAspect(a)));
  return out.slice(0, 4);
}

// ─── TOGETHER (several charts on one timeline) ───────────────────────────────
const TL_SOFT_CONJ = new Set(['Sun','Venus','Jupiter']);
const TL_HARD_CONJ = new Set(['Mars','Saturn','Pluto']);
function tlTone(body, asp) {
  if (asp === 'trine' || asp === 'sextile') return 1;
  if (asp === 'square' || asp === 'opposition') return -1;
  return TL_SOFT_CONJ.has(body) ? 1 : TL_HARD_CONJ.has(body) ? -1 : 0;   // conjunctions
}

// Aspects between two natal charts (static)
function tlSynastry(a, b) {
  const links = [];
  for (const p of a.points) for (const q of b.points) {
    const sep = tlSep(p.lon, q.lon);
    for (const asp of TL_ASPECTS) {
      const orb = Math.abs(sep - asp.angle);
      if (orb <= 3) links.push({ p: p.name, q: q.name, pl: p.lon, ql: q.lon, asp: asp.name, orb,
        tone: asp.name === 'trine' || asp.name === 'sextile' ? 1 : asp.name === 'square' || asp.name === 'opposition' ? -1 : 0 });
    }
  }
  return links.sort((x, y) => x.orb - y.orb);
}

// Human Design channels that exist only when the charts are together
function tlCompositeChannels(people) {
  const union = new Set(people.flatMap(p => [...p.natal.gates]));
  return HD_CHANNELS.filter(([a, b]) => union.has(a) && union.has(b) && !people.some(p => p.natal.gates.has(a) && p.natal.gates.has(b)))
    .map(([a, b]) => ({ channel: `${a}-${b}`, name: HD_CHANNEL_NAMES[`${a}-${b}`] || '',
      who: people.filter(p => p.natal.gates.has(a) || p.natal.gates.has(b)).map(p => p.name) }));
}

function computeTogether(people) {
  const pairs = [];
  for (let i = 0; i < people.length; i++) for (let j = i + 1; j < people.length; j++)
    pairs.push({ A: people[i], B: people[j], links: tlSynastry(people[i].natal, people[j].natal) });
  const composite = tlCompositeChannels(people);
  const days = people[0].tl.map((_, i) => {
    const sky = people[0].tl.skies[i + 1];
    const shared = [], relinks = [];
    let pos = 0, neg = 0;
    for (const b of TL_BODIES) {
      const hits = [];
      people.forEach(p => {
        // Slow planets sit near the same points for weeks, so they only count on their closest days
        const lim = TL_SLOW.has(b) ? 0.3 : 1.2;
        p.tl[i].aspects.filter(a => a.t === b && (a.exact || a.orb <= lim)).forEach(a => hits.push({ who: p.name, ...a }));
      });
      const whoSet = new Set(hits.map(h => h.who));
      if (whoSet.size >= 2) {
        shared.push({ body: b, hits });
        hits.forEach(h => { const t = tlTone(b, h.asp), w = TL_WEIGHT[b] * (h.exact ? 2 : 1); if (t > 0) pos += w; if (t < 0) neg += w; });
      }
      // Transit touching both ends of an existing link between two charts
      for (const pr of pairs) for (const L of pr.links.slice(0, 40)) {
        const lim = TL_SLOW.has(b) ? 0.3 : 1;
        const hitP = TL_ASPECTS.find(x => Math.abs(tlSep(sky[b], L.pl) - x.angle) <= lim);
        const hitQ = TL_ASPECTS.find(x => Math.abs(tlSep(sky[b], L.ql) - x.angle) <= lim);
        if (hitP && hitQ) {
          relinks.push({ body: b, A: pr.A.name, B: pr.B.name, link: L, tp: hitP.name, tq: hitQ.name });
          const t = L.tone + tlTone(b, hitP.name) + tlTone(b, hitQ.name), w = TL_WEIGHT[b];
          if (t > 0) pos += w; if (t < 0) neg += w;
        }
      }
    }
    let tone = 'quiet';
    if (pos + neg >= 2) tone = pos && neg && Math.min(pos, neg) / Math.max(pos, neg) > 0.4 ? 'mixed' : pos > neg ? 'harmony' : 'friction';
    return { shared, relinks: relinks.slice(0, 6), tone, pos, neg };
  });
  return { pairs, composite, days };
}

function tlTogetherDayText(i) {
  const T = TL.together, day = T.days[i], date = TL.data[i].date;
  const when = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const lines = [`FOCUS DAY (together): ${when} — overall tone: ${day.tone}`];
  T.people.forEach(p => {
    const d = p.tl[i];
    const top = d.aspects.filter(a => !a.background).slice(0, 6).map(a => '    ' + tlAspectText(a));
    lines.push(`${p.name}:` + (d.events.length ? `\n    Events: ${d.events.map(e => e.text).join('; ')}` : '') + (top.length ? '\n' + top.join('\n') : '\n    (no close aspects)'));
  });
  if (day.shared.length) lines.push('Shared activations (one transit touching several charts): ' +
    day.shared.map(s => `${s.body} → ` + s.hits.map(h => `${h.who}'s ${h.n} (${h.asp}, ${h.orb.toFixed(1)}°)`).join(', ')).join('; '));
  if (day.relinks.length) lines.push('Links between the charts reactivated today: ' +
    day.relinks.map(r => `${r.body} touches ${r.A}'s ${r.link.p} ${r.link.asp} ${r.B}'s ${r.link.q}`).join('; '));
  if (T.composite.length) lines.push('Human Design channels formed only together: ' + T.composite.map(c => `${c.channel} ${c.name}`).join(', '));
  return lines.join('\n');
}


// ─── FOCUS (plain daily instruction) ─────────────────────────────────────────
const TL_POINT_AREA = { Sun:'identity and visibility', Moon:'home and family', Mercury:'ideas and communication',
  Venus:'relationships and money', Mars:'drive and initiative', Jupiter:'growth and opportunities', Saturn:'structure and commitments',
  Uranus:'change and freedom', Neptune:'inspiration and ideals', Pluto:'power and depth', ASC:'visibility', MC:'career and reputation' };
const TL_MODE = { act:'Act', speak:'Speak', build:'Build', review:'Review', decide:'Decide', rest:'Rest', close:'Close', play:'Play' };
const TL_MODE_LINE = {
  act:    a => `Good day to move on ${a}.`,
  speak:  a => `Good day to talk, write or reach out about ${a}.`,
  build:  a => `Quiet, steady work on ${a}.`,
  review: a => `Revise and reconnect around ${a}. Don't launch.`,
  decide: a => `Good day to commit on ${a}, after one night's sleep.`,
  close:  a => `Finish and mark what is ending around ${a}.`,
  rest:   a => `Lower the pace. Give ${a} some space.`,
  play:   a => `Make room for fun: ${a}. No outcome needed.`
};
const TL_BASE_MODE = { Sun:'act', Mercury:'speak', Venus:'speak', Mars:'act', Jupiter:'act', Saturn:'build', Uranus:'act', Neptune:'rest', Pluto:'build' };
const TL_CENTER_PLAIN = { Head:'questions and inspiration', Ajna:'clear thinking', Throat:'speaking and acting', G:'direction', Heart:'willpower',
  Spleen:'instinct', 'Solar Plexus':'emotions', Sacral:'energy', Root:'drive' };

function tlDefinedCenters(gates) {
  const out = new Set();
  for (const [a, b] of HD_CHANNELS) if (gates.has(a) && gates.has(b)) { out.add(centerOfGate(a)); out.add(centerOfGate(b)); }
  return out;
}

function tlFocus(d) {
  const retro = new Set(d.sky.filter(s => s.retro).map(s => s.body));
  const cands = [];
  d.events.forEach(e => {
    if (e.kind === 'station') cands.push({ score: TL_SLOW.has(e.body) ? 6 : 5, mode: e.sub === 'retrograde' ? 'review' : 'act',
      area: e.house ? TL_HOUSE[e.house] : (TL_POINT_AREA[e.body] || 'this area') });
    if (e.kind === 'lunation') cands.push({ score: 4, mode: e.sub === 'New Moon' ? (e.house === 5 ? 'play' : 'speak') : 'close', area: e.house ? TL_HOUSE[e.house] : 'what has been building' });
  });
  d.aspects.filter(a => a.exact).forEach(a => {
    const hard = tlTone(a.t, a.asp) < 0;
    let mode = TL_BASE_MODE[a.t];
    if (!hard && (a.t === 'Saturn' || (a.t === 'Mercury' && a.n === 'Saturn') || (a.t === 'Sun' && a.n === 'Mercury'))) mode = 'decide';
    if (hard && a.t === 'Saturn') mode = 'build';
    // Easy contacts from the pleasure planets to the house of children and play, or to natal Venus/Jupiter
    if (!hard && ['Sun','Venus','Jupiter','Moon'].includes(a.t) && (a.nh === 5 || a.th === 5 || ['Venus','Jupiter'].includes(a.n))) mode = 'play';
    cands.push({ score: TL_WEIGHT[a.t] * (TL_KEY_POINTS.has(a.n) ? 2 : 1) * (hard ? 1.1 : 1), mode, hard, planet: a.t,
      area: TL_POINT_AREA[a.n] || a.n });
  });
  cands.sort((x, y) => y.score - x.score);
  let top = cands[0] || { mode: d.heat < 0.25 ? 'rest' : 'build', area: 'what is already in motion' };
  let mode = top.mode;
  const notes = [];
  if (retro.has('Mercury')) { notes.push('Mercury retrograde: revise, don\'t sign.'); if (mode === 'decide') mode = 'review'; }
  if (retro.has('Venus')) notes.push('Venus retrograde: rethink prices and partner terms.');
  let line = TL_MODE_LINE[mode](top.area);
  if (top.hard) line += top.planet === 'Mars' ? ' Expect friction; pace yourself.' : ' Expect some pressure; go slowly.';

  // Plain "easy for / pressure on": net weight per life area from close contacts, two of each at most
  const net = {};
  d.aspects.filter(a => !a.background && (a.exact || a.orb <= 0.7)).forEach(a => {
    const t = tlTone(a.t, a.asp);
    if (!t) return;
    const w = t * TL_WEIGHT[a.t] * (a.exact ? 2 : 1);
    const areas = new Set([TL_POINT_AREA[a.n] || a.n]);
    if (a.nh && TL_LIFE_HOUSES[a.nh]) areas.add(TL_LIFE_HOUSES[a.nh]);
    if (a.th && TL_LIFE_HOUSES[a.th]) areas.add(TL_LIFE_HOUSES[a.th]);
    areas.forEach(x => net[x] = (net[x] || 0) + w);
  });
  const ranked = Object.entries(net).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
  const easy = ranked.filter(([, v]) => v > 0).slice(0, 2).map(([k]) => k);
  const pressure = ranked.filter(([, v]) => v < 0).slice(0, 2).map(([k]) => k);

  // Open Human Design centres switched on by today's sky
  let centers = [];
  const natal = TL.data?.natal;
  if (natal?.gates?.size) {
    const tg = new Set(d.sky.map(s => gateLine(s.lon).gate));
    const sun = d.sky.find(s => s.body === 'Sun');
    if (sun) tg.add(gateLine((sun.lon + 180) % 360).gate);
    const union = new Set([...natal.gates, ...tg]);
    const base = tlDefinedCenters(natal.gates);
    centers = [...tlDefinedCenters(union)].filter(c => !base.has(c));
  }
  return { mode, area: top.area, line, easy, pressure, notes, centers };
}
const TL_TONE_PLAIN = { harmony: 'Easy day for the connection', friction: 'Pressure on the connection', mixed: 'Easy and tense at once', quiet: 'Quiet for the connection' };

// ─── UI ──────────────────────────────────────────────────────────────────────
function tlLevel(h) { return h > 0.75 ? 4 : h > 0.5 ? 3 : h > 0.28 ? 2 : 1; }
const TL_TONE_LABEL = { harmony: 'Harmony', friction: 'Friction', mixed: 'Mixed', quiet: 'Quiet' };

function renderTimeline(force) {
  const pane = document.getElementById('timelineContent');
  const ctrl = document.getElementById('timelineControls');
  if (!pane || !ctrl) return;
  const profile = getActiveProfile();
  if (!TL.start) TL.start = new Date();
  if (!TL.with) TL.with = new Set();
  const others = getProfiles().filter(p => p.id !== profile?.id && p.birthDate);
  [...TL.with].forEach(id => { if (!others.some(o => o.id === id)) TL.with.delete(id); });

  ctrl.innerHTML = `
    <label class="tl-ctl">From <input type="date" id="tlStart" value="${tlIso(TL.start)}" onchange="tlSetStart(this.value)"></label>
    <label class="tl-ctl">Range
      <select id="tlDays" onchange="tlSetDays(this.value)">
        ${[7, 14, 30, 60, 90].map(n => `<option value="${n}" ${n === TL.days ? 'selected' : ''}>${n} days</option>`).join('')}
      </select>
    </label>
    <button class="btn-sm" onclick="tlSetStart('${tlIso(new Date())}')">Today</button>
    <div class="tl-view" role="group" aria-label="View">
      <button class="starter${TL.detail ? '' : ' tg-on'}" onclick="tlSetDetail(false)">Simple</button>
      <button class="starter${TL.detail ? ' tg-on' : ''}" onclick="tlSetDetail(true)">Detailed</button>
    </div>
    ${others.length ? `<div class="tl-with"><span class="tl-ctl">Together with</span>${others.map(o =>
      `<button class="starter${TL.with.has(o.id) ? ' tg-on' : ''}" onclick="tlToggleWith('${o.id}')">${o.emoji || '✦'} ${esc(o.name)}</button>`).join('')}</div>` : ''}`;

  if (!profile?.birthDate) {
    pane.innerHTML = `<p class="tl-empty">Add your birth date (and ideally time and place) in Edit chart to see your timeline.</p>`;
    return;
  }
  if (typeof Astronomy === 'undefined') {
    pane.innerHTML = `<p class="tl-empty">The calculation engine could not load. Check your connection and reopen this tab.</p>`;
    return;
  }
  const withIds = [...TL.with].sort();
  const cacheKey = `${profile.id}|${tlIso(TL.start)}|${TL.days}|${profile.birthDate}|${profile.birthTime}|${profile.lat}|${withIds.join(',')}`;
  if (force || !TL.data || TL.cacheKey !== cacheKey) {
    try {
      TL.data = computeTimeline(profile, TL.start, TL.days);
      TL.together = null;
      if (withIds.length) {
        const people = [{ name: profile.name, natal: TL.data.natal, tl: TL.data }];
        for (const id of withIds) {
          const o = others.find(x => x.id === id);
          const tl = computeTimeline(o, TL.start, TL.days);
          people.push({ name: o.name, natal: tl.natal, tl });
        }
        TL.together = { people, ...computeTogether(people) };
      }
      TL.cacheKey = cacheKey;
    } catch (e) { pane.innerHTML = `<p class="tl-empty">Could not calculate the timeline.</p>`; return; }
  }
  const noHouses = !profile.birthTime || profile.lat == null;
  const fmtShort = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  let strip;
  if (TL.together) {
    const T = TL.together;
    const row = (p) => `<div class="tl-row"><span class="tl-row-name">${esc(p.name)}</span><div class="tl-strip small">` +
      p.tl.map((d, i) => `<button class="tl-bar lvl${tlLevel(d.heat)}" style="height:${Math.round(6 + d.heat * 22)}px" title="${esc(p.name)} · ${fmtShort(d.date)}" onclick="tlJump(${i})"></button>`).join('') + `</div></div>`;
    strip = `<div class="tl-rows">${T.people.map(row).join('')}
      <div class="tl-row"><span class="tl-row-name">Together</span><div class="tl-tones">` +
      T.days.map((d, i) => `<button class="tl-tone t-${d.tone}" title="${fmtShort(TL.data[i].date)} · ${TL_TONE_LABEL[d.tone]}" onclick="tlJump(${i})"></button>`).join('') +
      `</div></div></div>
      <div class="tl-strip-legend"><span>${fmtShort(TL.data[0].date)}</span><span class="tl-key"><i class="t-harmony"></i>Easy <i class="t-friction"></i>Pressure <i class="t-mixed"></i>Both <i class="t-quiet"></i>Quiet</span><span>${fmtShort(TL.data[TL.data.length - 1].date)}</span></div>
      ${tlTogetherHeader(T)}`;
  } else {
    strip = `<div class="tl-strip" role="list" aria-label="Intensity by day">` + TL.data.map((d, i) =>
      `<button class="tl-bar lvl${tlLevel(d.heat)}" role="listitem" title="${fmtShort(d.date)}" style="height:${Math.round(18 + d.heat * 42)}px" onclick="tlJump(${i})"></button>`).join('') +
      `</div><div class="tl-strip-legend"><span>${fmtShort(TL.data[0].date)}</span><span>Taller = more activity (exact aspects, stations, lunations)</span><span>${fmtShort(TL.data[TL.data.length - 1].date)}</span></div>`;
  }

  const cards = TL.data.map((d, i) => tlCard(d, i)).join('');
  pane.innerHTML = strip + (noHouses ? `<p class="tl-note">No birth time or place saved, so houses and Ascendant/MC aspects are not shown.</p>` : '') + cards;
}

function tlTogetherHeader(T) {
  const pairs = T.pairs.map(pr => {
    const top = pr.links.filter(l => l.orb <= 2).slice(0, 6);
    return `<div class="tl-syn"><b>${esc(pr.A.name)} × ${esc(pr.B.name)}</b> ` + (top.length
      ? top.map(l => `<span class="tl-link ${l.tone > 0 ? 't-harmony' : l.tone < 0 ? 't-friction' : 't-mixed'}">${pr.A.name}'s ${l.p} ${l.asp} ${pr.B.name}'s ${l.q} (${l.orb.toFixed(1)}°)</span>`).join('')
      : '<span class="tl-link">no tight links</span>') + `</div>`;
  }).join('');
  const comp = T.composite.length
    ? `<div class="tl-hd">HD channels formed only together · ${T.composite.map(c => `${c.channel} ${c.name}`).join(' · ')}</div>` : '';
  return `<div class="tl-card tl-together-head"><div class="tl-date" style="margin-bottom:6px;">How your charts connect</div>${pairs}${comp}</div>`;
}

function tlCard(d, i) {
  const label = d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const isToday = d.iso === tlIso(new Date());
  const main = d.aspects.filter(a => !a.background);
  const bg = d.aspects.filter(a => a.background);
  const open = TL.open[d.iso];
  const tday = TL.together?.days[i];

  const events = d.events.length
    ? `<div class="tl-events">${d.events.map(e => `<span class="tl-ev tl-ev-${e.kind}">${esc(e.text)}</span>`).join('')}</div>` : '';
  const readings = tlReadings(d);
  const readHtml = readings.length ? `<div class="tl-read">${readings.map(r => `<p>${esc(r)}</p>`).join('')}</div>` : '';

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

  let together = '';
  if (tday) {
    const sh = tday.shared.map(s => `<div class="tl-tg-row">${TL_GLYPH[s.body]} ${s.body} touches ${s.hits.map(h => `${esc(h.who)}'s ${h.n} <em>(${h.asp}${h.exact ? ', exact' : ''})</em>`).join(' and ')}</div>`).join('');
    const rl = tday.relinks.map(r => `<div class="tl-tg-row">${TL_GLYPH[r.body]} ${r.body} lights up ${esc(r.A)}'s ${r.link.p} ${r.link.asp} ${esc(r.B)}'s ${r.link.q}</div>`).join('');
    together = `<div class="tl-tg"><span class="tl-tone-badge t-${tday.tone}">${TL_TONE_LABEL[tday.tone]}</span>${sh || rl ? sh + rl : '<div class="tl-tg-row tl-quiet">No transit touches both charts closely today.</div>'}</div>`;
  }

  const sky = `
    <div class="tl-sky ${open ? 'open' : ''}">
      ${d.sky.map(s => `<div class="tl-sky-row"><span class="tl-g">${TL_GLYPH[s.body]}</span><span>${s.body}</span><span>${s.deg} ${s.sign}${s.retro ? ' ℞' : ''}</span><span>${s.house ? 'H' + s.house : ''}</span></div>`).join('')}
    </div>`;

  const f = tlFocus(d);
  const showWhy = TL.detail || TL.why[d.iso];
  const chips = [
    ...f.easy.map(a => `<span class="tl-chip easy">Easy for ${esc(a)}</span>`),
    ...f.pressure.map(a => `<span class="tl-chip press">Pressure on ${esc(a)}</span>`)
  ].join('');
  const centersHtml = f.centers.length
    ? `<div class="tl-centers">Open centres switched on: ${f.centers.map(c => `<b>${c}</b> (${TL_CENTER_PLAIN[c]})`).join(', ')}</div>` : '';
  const tgSimple = tday ? `<div class="tl-tg-simple t-${tday.tone}">${TL_TONE_PLAIN[tday.tone]}</div>` : '';

  return `
    <div class="tl-card${isToday ? ' today' : ''}" id="tl-day-${i}">
      <div class="tl-head">
        <span class="tl-dot lvl${tlLevel(d.heat)}"></span>
        <span class="tl-date">${label}${isToday ? ' · today' : ''}</span>
        <span class="tl-num" title="Personal Year · Personal Month">PY ${d.py} · PM ${d.pm}</span>
      </div>
      <div class="tl-focus">
        <span class="tl-mode m-${f.mode}">${TL_MODE[f.mode]}</span>
        <div class="tl-focus-txt"><div class="tl-focus-area">${esc(f.area.charAt(0).toUpperCase() + f.area.slice(1))}</div><p>${esc(f.line)}</p></div>
      </div>
      ${chips ? `<div class="tl-chips">${chips}</div>` : ''}
      ${f.notes.length ? `<div class="tl-notes">${f.notes.map(esc).join(' ')}</div>` : ''}
      ${centersHtml}
      ${tgSimple}
      <div class="tl-why ${showWhy ? 'open' : ''}">
        ${events}
        ${readHtml}
        ${together}
        <div class="tl-asps">${aspects}</div>
        ${bgHtml}
        ${hd}
        ${sky}
      </div>
      <div class="tl-actions">
        ${TL.detail ? '' : `<button class="btn-sm" onclick="tlToggleWhy('${d.iso}')">${showWhy ? 'Hide why' : 'Why?'}</button>`}
        ${showWhy ? `<button class="btn-sm" onclick="tlToggleSky('${d.iso}')">${open ? 'Hide sky' : 'Show sky'}</button>` : ''}
        <button class="btn-sm tl-ask" onclick="tlAsk(${i})">✦ ${TL.together ? 'Ask about this day together' : 'Ask about this day'}</button>
      </div>
    </div>`;
}

function tlSetStart(v) { const [y, m, d] = v.split('-').map(Number); if (!y) return; TL.start = new Date(y, m - 1, d, 12); renderTimeline(); }
function tlSetDays(v) { TL.days = +v || 30; renderTimeline(); }
function tlToggleSky(iso) { TL.open[iso] = !TL.open[iso]; renderTimeline(); }
function tlToggleWhy(iso) { TL.why[iso] = !TL.why[iso]; renderTimeline(); }
function tlSetDetail(v) { TL.detail = !!v; renderTimeline(); }
function tlToggleWith(id) { TL.with.has(id) ? TL.with.delete(id) : TL.with.add(id); renderTimeline(); }
function tlJump(i) { const el = document.getElementById('tl-day-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function tlAsk(i) {
  const d = TL.data?.[i];
  if (!d) return;
  const together = !!TL.together;
  S.focusDay = { iso: d.iso, text: together ? tlTogetherDayText(i) : tlDayText(d) };
  const mode = together ? 'together' : 'transit';
  if (together) S.together = new Set(TL.with);
  const btn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (btn) setMode(btn);
  switchTab('compass', document.querySelector('.tab[data-tab="compass"]'));
  const when = d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const box = document.getElementById('inputBox');
  box.value = together ? `What does ${when} hold for us?` : `What does ${when} hold for me?`;
  send();
}
