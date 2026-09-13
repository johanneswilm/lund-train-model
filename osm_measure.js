// Build rail graph from Overpass "out geom" JSON, measure key distances around Lund.
// No dependencies. Usage: node osm_measure.js [file.json]
const fs = require("fs");
const file = process.argv[2] || "osm/lund_corridor.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const R = 6371000, D2R = Math.PI / 180;
const hav = (a, b) => {
  const dLat = (b.lat - a.lat) * D2R, dLon = (b.lon - a.lon) * D2R;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * D2R) * Math.cos(b.lat * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

// ---- graph ----
const adj = new Map(); // nodeId -> [{to, w}]
const geo = new Map(); // nodeId -> {lat,lon}
const seenEdge = new Set();
function addEdge(a, b, w) {
  const k = a < b ? a + "|" + b : b + "|" + a;
  if (seenEdge.has(k)) return;
  seenEdge.add(k);
  if (!adj.has(a)) adj.set(a, []);
  if (!adj.has(b)) adj.set(b, []);
  adj.get(a).push({ to: b, w });
  adj.get(b).push({ to: a, w });
}
let ways = 0;
for (const el of data.elements) {
  if (el.type !== "way" || !el.geometry) continue;
  ways++;
  const g = el.geometry;
  for (let i = 0; i < g.length - 1; i++) {
    // geometry nodes from out geom have no stable id -> key by rounded coords
    const a = "n" + g[i].lat.toFixed(6) + "," + g[i].lon.toFixed(6);
    const b = "n" + g[i + 1].lat.toFixed(6) + "," + g[i + 1].lon.toFixed(6);
    geo.set(a, { lat: g[i].lat, lon: g[i].lon });
    geo.set(b, { lat: g[i + 1].lat, lon: g[i + 1].lon });
    addEdge(a, b, hav(g[i], g[i + 1]));
  }
}
console.error(`ways=${ways} nodes=${geo.size} edges=${seenEdge.size}`);

// ---- stations ----
const stations = [];
for (const el of data.elements) {
  if (el.type === "node" && el.tags && (el.tags.railway === "station" || el.tags.railway === "halt")) {
    stations.push({ name: el.tags.name || "?", lat: el.lat, lon: el.lon });
  }
}
function nearestNode(lat, lon) {
  let best = null, bd = 1e9;
  for (const [id, g] of geo) {
    const d = hav({ lat, lon }, g);
    if (d < bd) { bd = d; best = id; }
  }
  return { id: best, dist: bd };
}
const findSt = q => stations.filter(s => s.name.toLowerCase().includes(q));
function stNode(q) {
  const cands = findSt(q);
  if (!cands.length) return null;
  // pick the matching station closest to any rail node (station node may sit off the rails)
  let best = null;
  for (const s of cands) {
    const n = nearestNode(s.lat, s.lon);
    if (!best || n.dist < best.n.dist) best = { s, n };
  }
  return best;
}

// ---- Dijkstra with binary heap ----
class Heap {
  constructor() { this.a = []; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a; const top = a[0]; const last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; }
}
function dijkstra(src) {
  const dist = new Map([[src, 0]]), prev = new Map(), done = new Set();
  const heap = new Heap(); heap.push([0, src]);
  while (true) {
    const top = heap.pop();
    if (!top) break;
    const [d, u] = top;
    if (done.has(u)) continue;
    done.add(u);
    const au = adj.get(u);
    if (!au) continue;
    for (const { to, w } of au) {
      const nd = d + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd); prev.set(to, u);
        heap.push([nd, to]);
      }
    }
  }
  return { dist, prev };
}
function pathTo(prev, dst) {
  const p = []; let c = dst;
  while (c) { p.unshift(c); c = prev.get(c); }
  return p;
}

// fallback coordinates for places outside the bbox (no station node in extract)
const FALLBACK = {
  malmo: [55.6091, 13.0007], lund: [55.7061, 13.1867], kloster: [55.6858, 13.1839],
  stangby: [55.7684, 13.2340], eslov: [55.8393, 13.3034], tecko: [55.8836, 13.1160],
  astorp: [56.0469, 12.9443], kavlinge: [55.7920, 13.1140], gunnesbo: [55.7198, 13.1576],
  hasselholm: [56.1594, 13.7661], helsingborg: [56.0440, 12.6946], hor: [55.9376, 13.5428],
  angelholm: [56.2455, 12.8649], landskrona: [55.8708, 12.8301],
  stockholm: [59.3302, 18.0582], alvesta: [56.8992, 14.5560], copenhagen: [55.6721, 12.5653]
};
const pts = {};
for (const [key, q] of [["malmo", "malmö central"], ["lund", "lund central"], ["kloster", "klostergården"],
  ["stangby", "stångby"], ["eslov", "eslöv"], ["tecko", "teckomatorp"], ["astorp", "åstorp"],
  ["kavlinge", "kävlinge"], ["gunnesbo", "gunnesbo"], ["hasselholm", "hässleholm"], ["helsingborg", "helsingborg"],
  ["hor", "höör"], ["angelholm", "ängelholm"], ["landskrona", "landskrona"], ["stockholm", "stockholm"], ["alvesta", "alvesta"]]) {
  let r = stNode(q);
  if (!r && FALLBACK[key]) { const n = nearestNode(FALLBACK[key][0], FALLBACK[key][1]); r = { s: { name: key + " (fallback coord)" }, n }; }
  pts[key] = r ? { name: r.s.name, id: r.n.id, lat: r.s.lat ?? FALLBACK[key]?.[0], lon: r.s.lon ?? FALLBACK[key]?.[1], gap: r.n.dist } : null;
  console.error(key, r ? `${r.s.name} (node gap ${r.n.dist.toFixed(0)}m)` : "NOT FOUND");
}
const km = m => (m / 1000);
function route(a, b) {
  if (!pts[a] || !pts[b]) return null;
  const { dist, prev } = dijkstra(pts[a].id);
  const d = dist.get(pts[b].id);
  if (d === undefined) return null;
  return { km: km(d), path: pathTo(prev, pts[b].id), gapA: pts[a].gap, gapB: pts[b].gap };
}
const line = (a, b) => hav({ lat: pts[a].lat, lon: pts[a].lon }, { lat: pts[b].lat, lon: pts[b].lon });

const out = {};
// A route is only trustworthy if both endpoints snapped close to the rail graph. A large snap
// means the extract does not reach the destination and Dijkstra stopped at the extract boundary —
// record null instead of a silently truncated distance.
const MAX_SNAP_M = 1000;
function put(label, r) {
  const gap = r ? Math.max(r.gapA ?? Infinity, r.gapB ?? Infinity) : Infinity;
  const ok = r != null && gap <= MAX_SNAP_M;
  if (r && !ok) console.error(`WARNING ${label}: station snap ${gap.toFixed(0)} m > ${MAX_SNAP_M} m — destination outside the extract, recording null`);
  out[label] = ok ? +r.km.toFixed(2) : null;
  console.log(`${label}: ${ok ? r.km.toFixed(2) + " km" : "n/a"}`);
}

put("Kloster->LundC", route("kloster", "lund"));
put("LundC->Stangby", route("lund", "stangby"));
put("Malmo->LundC", route("malmo", "lund"));
put("Malmo->Kloster", route("malmo", "kloster"));
put("LundC->Eslov", route("lund", "eslov"));
put("LundC->Hassleholm", route("lund", "hasselholm"));
put("LundC->Helsingborg", route("lund", "helsingborg"));
put("LundC->Alvesta", route("lund", "alvesta"));
put("LundC->Stockholm", route("lund", "stockholm"));
put("Malmo->Teckomatorp(via Kavlinge)", route("malmo", "tecko"));
put("Malmo->Kavlinge", route("malmo", "kavlinge"));
put("Kavlinge->LundC", route("kavlinge", "lund"));
console.log(`Kavlinge->Stangby straight-line: ${km(line("kavlinge", "stangby")).toFixed(2)} km`);
out["KavlingeStangbyStraight"] = +km(line("kavlinge", "stangby")).toFixed(2);
put("Teckomatorp->LundC", route("tecko", "lund"));
// Alt B1 legs (existing freight route Malmö–Kävlinge–Teckomatorp–Eslöv–Stångby) so the
// +38.8 km detour vs via Lund C is fully reproducible from this file
put("Kavlinge->Teckomatorp", route("kavlinge", "tecko"));
put("Teckomatorp->Eslov", route("tecko", "eslov"));
put("Eslov->Stangby", route("eslov", "stangby"));
put("Malmo->Stangby(via Lund)", route("malmo", "stangby"));
const chordStraight = line("tecko", "stangby");
console.log(`Teckomatorp->Stangby straight-line: ${km(chordStraight).toFixed(2)} km`);
out["TeckoStangbyStraight"] = +km(chordStraight).toFixed(2);
const bypStraight = line("kloster", "stangby");
console.log(`Klostergården->Stangby straight-line: ${km(bypStraight).toFixed(2)} km`);
out["KlostergårdenStangbyStraight"] = +km(bypStraight).toFixed(2);

// ---- curve radius along Klostergården -> Lund C ----
const r1 = route("kloster", "lund");
if (r1) {
  const path = r1.path.map(id => geo.get(id));
  // local metric coords
  const lat0 = path[0].lat * D2R, mPerLat = 111320, mPerLon = 111320 * Math.cos(lat0);
  const xy = path.map(p => [(p.lon - path[0].lon) * mPerLon, (p.lat - path[0].lat) * mPerLat]);
  // cumulative distance; resample every ~25 m
  const cum = [0];
  for (let i = 1; i < xy.length; i++) cum.push(cum[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
  const total = cum[cum.length - 1];
  const N = Math.max(20, Math.floor(total / 25));
  const sx = [], sy = [];
  let j = 0;
  for (let i = 0; i <= N; i++) {
    const d = (total * i) / N;
    while (j < cum.length - 2 && cum[j + 1] < d) j++;
    const t = (d - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
    sx.push(xy[j][0] + t * (xy[j + 1][0] - xy[j][0]));
    sy.push(xy[j][1] + t * (xy[j + 1][1] - xy[j][1]));
  }
  // circle radius through triples (i-k, i, i+k), report robust min over window k=4 (~100m)
  function radiusAt(i, k) {
    const a = [sx[i - k], sy[i - k]], b = [sx[i], sy[i]], c = [sx[i + k], sy[i + k]];
    const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    if (Math.abs(d) < 1e-9) return Infinity;
    const a2 = a[0] ** 2 + a[1] ** 2, b2 = b[0] ** 2 + b[1] ** 2, c2 = c[0] ** 2 + c[1] ** 2;
    const ux = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d;
    const uy = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d;
    return Math.hypot(ux - a[0], uy - a[1]);
  }
  const k = 4;
  let rMin = Infinity, atKm = 0;
  for (let i = k; i < sx.length - k; i++) {
    const r = radiusAt(i, k);
    if (r < rMin) { rMin = r; atKm = ((total * i) / N) / 1000; }
  }
  const rEff = Math.max(rMin, 1);
  // cant equilibrium: h[mm] = 11.8 v^2 / R  ->  v = sqrt(h*R/11.8)
  const vEq160 = Math.sqrt(160 * rEff / 11.8);       // equilibrium at the max cant usually applied (160 mm)
  const vMax = Math.sqrt((160 + 100) * rEff / 11.8); // 160 mm cant + 100 mm cant deficiency (~0.65 m/s^2)
  console.log(`Klostergården->LundC path: ${(total / 1000).toFixed(2)} km, min curve radius ≈ ${rEff.toFixed(0)} m at ${atKm.toFixed(1)} km from Klostergården`);
  console.log(`  speed band: ${vEq160.toFixed(0)} km/h at 160 mm equilibrium cant; ${vMax.toFixed(0)} km/h with 160+100 mm cant/cant deficiency`);
  out.curveMinRadiusM = +rEff.toFixed(0);
  out.curveAtKm = +atKm.toFixed(2);
  out.curveEqSpeed160mm = +vEq160.toFixed(0);
  out.curveMaxSpeedCantDef = +vMax.toFixed(0);
  out.klosterLundPathKm = +(total / 1000).toFixed(2);
}
fs.writeFileSync("osm/measured.json", JSON.stringify(out, null, 1));
console.log("written osm/measured.json");
