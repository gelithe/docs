// Usage: node compute.js "2019-04-03" "04:16" "Europe/Berlin" 50.1109 8.6821
// Prints the full chart + HD + GK for a birth. Run `npm install` here first.
global.Astronomy = require('astronomy-engine');
const M = require('./chart.js');
const [,, date, time, tz, latS, lonS] = process.argv;
const [y,mo,d] = date.split('-').map(Number);
const [hh,mm] = time.split(':').map(Number);
const lat = +latS, lon = +lonS;

function localToUTC() {
  const base = Date.UTC(y,mo-1,d,hh,mm);
  let guess = base;
  const dtf = new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset'});
  for (let i=0;i<3;i++){
    const name = dtf.formatToParts(new Date(guess)).find(p=>p.type==='timeZoneName').value;
    const m2 = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    const off = m2 ? (m2[1]==='-'?-1:1)*(+m2[2]*60 + +(m2[3]||0)) : 0;
    const next = base - off*60000;
    if (next===guess) break; guess = next;
  }
  return new Date(guess);
}
const utc = localToUTC();
const c = M.computeChart(utc, lat, lon, true);
c.planets.forEach(p => console.log(`${p.name.padEnd(8)} ${M.fmtLon(p.lon)}  H${p.house||'-'}`));
if (c.angles) { console.log(`ASC      ${M.fmtLon(c.angles.asc)}`); console.log(`MC       ${M.fmtLon(c.angles.mc)}`); }
const design = Astronomy.SearchSunLongitude((c.planets[0].lon-88+360)%360, new Date(utc.getTime()-120*86400e3), 60);
const hd = M.computeHD(utc, design.date);
console.log(`HD: ${hd.type} · ${hd.authority} · ${hd.profile}`);
const gk = M.computeGK(hd);
console.log(`GK: LW ${gk.lifesWork} · Ev ${gk.evolution} · Ra ${gk.radiance} · Pu ${gk.purpose}`);
