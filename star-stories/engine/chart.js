// ─── ASTRO ENGINE (uses astronomy-engine global `Astronomy`) ──────────────────
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const D2R = Math.PI/180, R2D = 180/Math.PI;

function fmtLon(l) {
  l = ((l % 360) + 360) % 360;
  const s = Math.floor(l / 30), d = l % 30;
  return `${SIGNS[s]} ${String(Math.floor(d)).padStart(2,'0')}°${String(Math.floor((d%1)*60)).padStart(2,'0')}'`;
}

function meanNode(dateUTC) {
  const jd = dateUTC.getTime()/86400000 + 2440587.5;
  const T = (jd - 2451545.0)/36525.0;
  let o = 125.0445479 - 1934.1362891*T + 0.0020754*T*T + T*T*T/467441;
  return ((o % 360) + 360) % 360;
}

function eclLon(body, date) {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

function obliquity(dateUTC) {
  const jd = dateUTC.getTime()/86400000 + 2440587.5;
  const T = (jd - 2451545.0)/36525.0;
  return 23.4392911 - 0.0130042*T;
}

function anglesAndCusps(dateUTC, lat, lon) {
  const eps = obliquity(dateUTC);
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
  return { asc, mc, cusps, polar: Math.abs(lat) > 66 };
}

function houseOf(lon, cusps) {
  for (let h = 0; h < 12; h++) {
    const a = cusps[h], b = cusps[(h+1)%12];
    const span = ((b - a) + 360) % 360, off = ((lon - a) + 360) % 360;
    if (off < span) return h + 1;
  }
  return 1;
}

const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];

function computeChart(dateUTC, lat, lon, hasTime) {
  const planets = PLANETS.map(p => ({ name: p, lon: eclLon(p, dateUTC) }));
  planets.push({ name: 'N.Node', lon: meanNode(dateUTC) });
  let angles = null;
  if (hasTime && lat != null) {
    angles = anglesAndCusps(dateUTC, lat, lon);
    planets.forEach(p => p.house = houseOf(p.lon, angles.cusps));
  }
  return { planets, angles };
}

// ─── HUMAN DESIGN / GENE KEYS ────────────────────────────────────────────────
const GATE_WHEEL = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];

function gateLine(lon) {
  const off = ((lon - 302) % 360 + 360) % 360;
  const idx = Math.floor(off / 5.625);
  const line = Math.floor((off % 5.625) / 0.9375) + 1;
  return { gate: GATE_WHEEL[idx], line };
}

const HD_CHANNELS = [[1,8],[2,14],[3,60],[4,63],[5,15],[6,59],[7,31],[9,52],[10,20],[10,34],[10,57],[11,56],[12,22],[13,33],[16,48],[17,62],[18,58],[19,49],[20,34],[20,57],[21,45],[23,43],[24,61],[25,51],[26,44],[27,50],[28,38],[29,46],[30,41],[32,54],[34,57],[35,36],[37,40],[39,55],[42,53],[47,64]];

const HD_CENTERS = {
  Head:   [64,61,63],
  Ajna:   [47,24,4,17,43,11],
  Throat: [62,23,56,35,12,45,33,8,31,20,16],
  G:      [1,13,25,46,2,15,10,7],
  Heart:  [26,51,21,40],
  Sacral: [34,5,14,29,59,9,3,42,27],
  Spleen: [48,57,44,50,32,28,18],
  SolarPlexus: [36,22,37,6,49,55,30],
  Root:   [58,38,54,53,60,52,19,39,41]
};
const MOTORS = ['Sacral','SolarPlexus','Heart','Root'];

function centerOfGate(g) {
  for (const [c, gates] of Object.entries(HD_CENTERS)) if (gates.includes(g)) return c;
  return null;
}

function computeHD(birthUTC, designUTC) {
  function activations(date) {
    const sun = eclLon('Sun', date);
    const list = [
      { body: 'Sun', lon: sun }, { body: 'Earth', lon: (sun+180)%360 },
      { body: 'Moon', lon: eclLon('Moon', date) },
      { body: 'N.Node', lon: meanNode(date) }, { body: 'S.Node', lon: (meanNode(date)+180)%360 },
    ];
    for (const p of ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'])
      list.push({ body: p, lon: eclLon(p, date) });
    list.forEach(a => Object.assign(a, gateLine(a.lon)));
    return list;
  }
  const pers = activations(birthUTC), des = activations(designUTC);
  const gates = new Set([...pers, ...des].map(a => a.gate));

  const channels = HD_CHANNELS.filter(([a,b]) => gates.has(a) && gates.has(b));
  const defined = new Set();
  const edges = [];
  channels.forEach(([a,b]) => {
    const ca = centerOfGate(a), cb = centerOfGate(b);
    defined.add(ca); defined.add(cb);
    edges.push([ca, cb]);
  });

  // motor→throat connectivity through defined centers
  function connected(from, to) {
    const seen = new Set([from]); const q = [from];
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
  const motorToThroat = MOTORS.some(m => defined.has(m) && connected(m, 'Throat'));

  let type;
  if (!defined.size) type = 'Reflector';
  else if (defined.has('Sacral')) type = motorToThroat ? 'Manifesting Generator' : 'Generator';
  else if (motorToThroat) type = 'Manifestor';
  else type = 'Projector';

  let authority;
  if (type === 'Reflector') authority = 'Lunar (wait a moon cycle)';
  else if (defined.has('SolarPlexus')) authority = 'Emotional';
  else if (defined.has('Sacral')) authority = 'Sacral';
  else if (defined.has('Spleen')) authority = 'Splenic';
  else if (defined.has('Heart')) authority = 'Ego';
  else if (defined.has('G')) authority = 'Self-Projected';
  else authority = 'Mental / Environmental';

  const profile = `${pers[0].line}/${des[0].line}`;
  return { type, authority, profile, defined: [...defined], channels, pers, des };
}

function computeGK(hd) {
  const pSun = hd.pers.find(a => a.body==='Sun'), pEarth = hd.pers.find(a => a.body==='Earth');
  const dSun = hd.des.find(a => a.body==='Sun'),  dEarth = hd.des.find(a => a.body==='Earth');
  return {
    lifesWork: `${pSun.gate}.${pSun.line}`, evolution: `${pEarth.gate}.${pEarth.line}`,
    radiance: `${dSun.gate}.${dSun.line}`,  purpose: `${dEarth.gate}.${dEarth.line}`
  };
}

module.exports = { computeChart, computeHD, computeGK, fmtLon, gateLine, meanNode, eclLon };
