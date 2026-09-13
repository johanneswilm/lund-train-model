"use strict";
/*
 * Test suite for the Lund rail strategic sketch model (index.html).
 *
 * Run with:  node --test test_model.js      (or plain: node test_model.js)
 *
 * The model is a single <script> block inside index.html. We extract it and
 * evaluate it in Node with a seeded Math.random so the Monte Carlo parts are
 * deterministic. No DOM is needed: init() is guarded by a typeof check.
 */
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const MODEL_HTML = path.join(__dirname, "index.html");

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function reseed(seed) { Math.random = mulberry32(seed); }

let cachedModel = null;
function model() {
  if (cachedModel) return cachedModel;
  const html = fs.readFileSync(MODEL_HTML, "utf8");
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(match, "index.html must contain the model <script> block");
  cachedModel = new Function(match[1] + `
    ; return { computeAll, scanDemand, defaultState, PARAMS, PRESETS, PKGS, PKG_NAME, PKG_LABEL, pkgLabel, TYPES,
               flagsOf, demandMap, centralSpeeds, buildPairs, occOf, pairCapacity, capacityOf,
               buildPattern, runMC, verdictOf, travelInfo, capexOf, cba, selPkg,
               freightBreakEven, closureResilience, freightUnsolved, evaluatePkg, tornadoFor,
               B1_EXTRA_KM, capexIdsOf, freightDetour, NOISE_FR, frProfileW, frWbar, frDailySpawns,
               setState: (k, v) => { S[k] = v; }, getState: () => Object.assign({}, S) };`)();
  return cachedModel;
}

const scenario = (m, over) => Object.assign(m.defaultState(), over || {});
const P2026 = m => scenario(m);
const P2045 = m => scenario(m, { tphReg: 9.5, tphLD: 3.5, tphFr: 2.5, frDaily: 130 });

/* ------------------------------------------------------------------ */
test("model loads from index.html and defines every expansion package", () => {
  const m = model();
  assert.equal(m.PKGS.length, 12);
  assert.deepEqual([...m.PKGS].sort(), ["A", "AB", "ABC", "AC", "ADB", "ADC", "B", "BC", "C", "DB", "DC", "dn"]);
  for (const p of m.PKGS) assert.equal(typeof m.PKG_NAME[p], "string", `${p} needs a display name`);
});

test("parameter metadata is internally consistent", () => {
  const m = model();
  for (const p of m.PARAMS) {
    if (p.type === "check") assert.equal(typeof p.def, "boolean", p.id);
    else if (p.type === "select") assert.ok(p.opts.some(o => o[0] === p.def), `${p.id}: default must be an option`);
    else {
      assert.ok(p.min <= p.def && p.def <= p.max, `${p.id}: default ${p.def} outside [${p.min}, ${p.max}]`);
      assert.ok(p.min < p.max, p.id);
    }
  }
  const growth = m.PARAMS.find(p => p.id === "growthPct");
  assert.ok(growth && growth.min < 0, "negative demand growth must be selectable");
});

test("all 16 Alt A/B/C/D checkbox combinations map to a supported package", () => {
  const m = model();
  const expected = {
    "0000": "dn",
    "1000": "A",  "0100": "B",  "1100": "AB",
    "0010": "C",  "1010": "AC", "0110": "BC", "1110": "ABC",
    // D forces B (freight is banned from long tunnels), so the B bit is implied
    "0001": "DB", "1001": "ADB", "0101": "DB",  "1101": "ADB",
    "0011": "DC", "1011": "ADC", "0111": "DC",  "1111": "ADC"
  };
  const defaults = m.getState();
  try {
    for (let mask = 0; mask < 16; mask++) {
      const bits = [1, 2, 4, 8].map(bit => !!(mask & bit));
      const key = bits.map(b => b ? 1 : 0).join("");
      m.setState("altA", bits[0]);
      m.setState("altB", bits[1] || bits[3]); // UI keeps B on while D is on
      m.setState("altC", bits[2]);
      m.setState("altD", bits[3]);
      const sel = m.selPkg();
      assert.ok(m.PKGS.includes(sel), `combo ${key} -> "${sel}" is not a supported package`);
      assert.equal(sel, expected[key], `combo ${key}`);
      // the resolved package must carry exactly the checked alternatives (D additionally implies B)
      const f = m.flagsOf(sel);
      assert.deepEqual(
        { A: f.A, B: f.B, C: f.C, D: f.D },
        { A: bits[0], B: bits[1] || bits[3], C: bits[2], D: bits[3] },
        `combo ${key} -> ${sel} dropped or added an alternative`);
    }
  } finally {
    for (const k of Object.keys(defaults)) m.setState(k, defaults[k]);
  }
});

test("package labels spell out implied alternatives (B+C+D is shown as D+C+B)", () => {
  const m = model();
  const labelFlags = label => ({
    A: label.includes("A"), B: label.includes("B"), C: label.includes("C"), D: label.includes("D")
  });
  for (const pkg of m.PKGS) {
    const f = m.flagsOf(pkg), lab = labelFlags(m.pkgLabel(pkg));
    assert.ok(lab.A === f.A && lab.B === f.B && lab.C === f.C && lab.D === f.D,
      `${pkg}: label "${m.pkgLabel(pkg)}" must show ${JSON.stringify(f)}`);
  }
  assert.equal(m.pkgLabel("DC"), "D+C+B", "B+C+D must be labelled with all three alternatives");
  assert.equal(m.pkgLabel("ADC"), "A+D+C+B");
});

test("Alt D implies Alt B in flags, demand map and track pairs (no freight in tunnel)", () => {
  const m = model();
  const P = P2026(m);
  for (const pkg of ["DB", "DC", "ADB", "ADC"]) {
    const f = m.flagsOf(pkg);
    assert.equal(f.D, true, pkg);
    assert.equal(f.B, true, `${pkg}: D must imply B`);
    assert.equal(m.demandMap(pkg, P).fr, 0, `${pkg}: freight must leave the central corridor`);
    for (const pair of m.buildPairs(pkg, P)) {
      assert.ok(!pair.types.includes("fr"), `${pkg}: pair ${pair.id} must not carry freight`);
    }
    assert.ok(m.capexOf(pkg, P) >= P.capexD, `${pkg}: CAPEX must include the chord/tunnel`);
  }
});

test("each train type is counted exactly once across track pairs (no phantom demand)", () => {
  const m = model();
  const P = P2026(m);
  for (const pkg of m.PKGS) {
    const dem = m.demandMap(pkg, P);
    const counted = {};
    for (const pair of m.buildPairs(pkg, P)) {
      for (const t of pair.types) counted[t] = (counted[t] || 0) + (dem[t] || 0);
    }
    for (const t of ["reg", "ld", "fr", "ldC"]) {
      assert.ok(Math.abs((counted[t] || 0) - (dem[t] || 0)) < 1e-9,
        `${pkg}: ${t} counted ${counted[t] || 0} vs demand ${dem[t] || 0}`);
    }
  }
});

test("A+D routes LD underground and regional at grade; D+C gives regional the 250 km/h tunnel", () => {
  const m = model();
  const P = P2026(m);
  const typesOf = pkg => Object.fromEntries(m.buildPairs(pkg, P).map(pr => [pr.id, pr.types]));

  const adb = typesOf("ADB");
  assert.deepEqual(adb.tunnel, ["ld"], "A+D: LD belongs in the tunnel");
  assert.deepEqual(adb.surfPax, ["reg"], "A+D: regional stays on the surface pair");

  const adbSp = m.centralSpeeds(m.flagsOf("ADB"), P);
  assert.equal(adbSp.reg.south, P.curveSpeed, "A+D: regional is still curve-limited at grade");

  for (const pkg of ["DC", "ADC"]) {
    assert.deepEqual(typesOf(pkg).tunnel, ["reg"], `${pkg}: regional belongs in the tunnel`);
    assert.equal(m.centralSpeeds(m.flagsOf(pkg), P).reg.south, 250, `${pkg}: tunnel speed must apply to regional`);
  }
  assert.equal(m.centralSpeeds(m.flagsOf("DB"), P).reg.south, 250, "D alone: all pax ride the tunnel");
});

test("greedy timetable builds the rounded hourly demand and respects pair separation", () => {
  const m = model();
  const P = P2026(m);
  const trains = m.buildPattern("dn", P);
  const dem = m.demandMap("dn", P);
  assert.equal(trains.length, Math.round(dem.reg) + Math.round(dem.ld) + Math.round(dem.fr));
  for (let i = 1; i < trains.length; i++) {
    if (trains[i].pair === trains[i - 1].pair) {
      assert.ok(trains[i].start - trains[i - 1].start >= trains[i - 1].buffer - 1e-9,
        `trains on pair ${trains[i].pair} closer than their separation buffer`);
    }
  }
});

/* ------------------------------------------------------------------ */
test("every package computes finite KPIs at 2026 demand", () => {
  const m = model();
  reseed(1);
  const out = m.computeAll(P2026(m), 40);
  for (const pkg of m.PKGS) {
    const o = out[pkg];
    assert.ok(Number.isFinite(o.caps.capCentral) && o.caps.capCentral > 0, `${pkg}: capCentral`);
    assert.ok(Number.isFinite(o.caps.utilCentral) && o.caps.utilCentral >= 0, `${pkg}: utilCentral`);
    assert.ok(Number.isFinite(o.punct) && o.punct >= 0 && o.punct <= 1, `${pkg}: punctuality`);
    assert.ok(Number.isFinite(o.cba.npv), `${pkg}: NPV`);
    assert.ok(!Number.isNaN(o.cba.bcr), `${pkg}: BCR`);
    for (const t of m.TYPES) assert.ok(Number.isFinite(o[t].p95), `${pkg}.${t}.p95`);
    assert.ok(Number.isFinite(o.trav.ldDoor) && Number.isFinite(o.trav.ldSpeed), `${pkg}: travel module`);
  }
});

test("2026 defaults: do-nothing is feasible-but-fragile (utilisation 60-80%)", () => {
  const m = model();
  reseed(7);
  const out = m.computeAll(P2026(m), 80);
  const dn = out.dn;
  assert.ok(dn.caps.utilCentral >= 0.55 && dn.caps.utilCentral < 0.85,
    `do-nothing utilisation ${(dn.caps.utilCentral * 100).toFixed(0)}% outside the 55-85% fragile band`);
  assert.equal(m.verdictOf(dn.caps.utilCentral, dn.punct).v, "FRAGILE");
});

test("2045: 2 tracks infeasible; A and A+B feasible; C alone adds no central capacity", () => {
  const m = model();
  reseed(11);
  const P = P2045(m);
  const out = m.computeAll(P, 80);

  assert.ok(out.dn.caps.utilCentral >= 1.0, `2045 do-nothing util ${out.dn.caps.utilCentral}`);
  assert.equal(m.verdictOf(out.dn.caps.utilCentral, out.dn.punct).v, "INFEASIBLE");
  for (const pkg of ["A", "AB"]) {
    assert.notEqual(m.verdictOf(out[pkg].caps.utilCentral, out[pkg].punct).v, "INFEASIBLE", pkg);
  }

  const capDn = m.capacityOf("dn", P).capCentral;
  const capC = m.capacityOf("C", P).capCentral;
  const capA = m.capacityOf("A", P).capCentral;
  assert.ok(Math.abs(capC - capDn) / capDn < 0.10,
    `C central capacity ${capC.toFixed(1)} must stay near the 2-track level ${capDn.toFixed(1)}`);
  assert.ok(capA > 1.5 * capDn, `A must roughly double central capacity (${capA.toFixed(1)} vs ${capDn.toFixed(1)})`);
});

test("A buys capacity while C buys speed (the model's headline asymmetry)", () => {
  const m = model();
  reseed(13);
  const out = m.computeAll(P2026(m), 60);
  assert.ok(out.A.caps.capCentral > 1.5 * out.dn.caps.capCentral, "Alt A must add central capacity");
  assert.ok(out.C.caps.capCentral < 1.1 * out.dn.caps.capCentral, "Alt C must not add central capacity");
  assert.ok(out.C.trav.ldSpeed > out.dn.trav.ldSpeed + 40, "Alt C must raise corridor speed");
  assert.ok(Math.abs(out.A.trav.ldSpeed - out.dn.trav.ldSpeed) < 15, "Alt A must not raise corridor speed");
});

test("central utilisation tracks the busiest track pair, not summed pair capacity", () => {
  const m = model();
  const P = scenario(m, m.PRESETS["2075"]);
  for (const pkg of m.PKGS) {
    const f = m.flagsOf(pkg), sp = m.centralSpeeds(f, P), dem = m.demandMap(pkg, P);
    let worst = 0;
    for (const pr of m.buildPairs(pkg, P)) {
      if (pr.id === "bypass") continue;
      worst = Math.max(worst, m.pairCapacity(pr, dem, sp, P).util);
    }
    const util = m.capacityOf(pkg, P).utilCentral;
    assert.ok(Math.abs(util - worst) < 1e-9, `${pkg}: utilCentral ${util} vs busiest central pair ${worst}`);
  }
});

test("adding Alt C to a package never reduces central feasibility", () => {
  const m = model();
  const P = scenario(m, m.PRESETS["2075"]);
  for (const [without, withC] of [["dn", "C"], ["B", "BC"], ["A", "AC"], ["AB", "ABC"], ["DB", "DC"], ["ADB", "ADC"]]) {
    const u0 = m.capacityOf(without, P).utilCentral;
    const u1 = m.capacityOf(withC, P).utilCentral;
    assert.ok(u1 <= u0 + 1e-9, `${withC} utilisation ${u1.toFixed(3)} must not exceed ${without} ${u0.toFixed(3)}`);
  }
  reseed(21);
  const out = m.computeAll(P, 60);
  const rank = { FEASIBLE: 0, FRAGILE: 1, INFEASIBLE: 2 };
  const v = pkg => m.verdictOf(out[pkg].caps.utilCentral, out[pkg].punct).v;
  assert.ok(rank[v("ADC")] <= rank[v("ADB")], `ADC (${v("ADC")}) must not rank worse than ADB (${v("ADB")}) at 2075`);
});

/* --- Alt B variants: B1 existing route vs B2 new chord (acceptance 6) --- */
test("Alt B variants: B1 uses the measured +38.8 km existing-route detour, B2 the chord", () => {
  const m = model();
  assert.ok(Math.abs(m.B1_EXTRA_KM - 38.8) < 0.2,
    "B1 must use the OSM-measured +38.8 km (the update draft's +10–12 km was the B2 figure)");
  const base = scenario(m, { altB: true, chordLen: 10, chordSpeed: 110, bMeetPen: 2 });
  reseed(31);
  const b2 = m.computeAll(Object.assign({}, base, { bVariant: "b2" }), 40).B.trav.frDoor;
  reseed(31);
  const b1 = m.computeAll(Object.assign({}, base, { bVariant: "b1" }), 40).B.trav.frDoor;
  const expectedGap = (m.B1_EXTRA_KM - 10) / 110 * 60 + 2; // extra km at chord speed + meet penalty
  assert.ok(Math.abs((b2 - b1) - expectedGap) < 0.05,
    `B1 must be ≈${expectedGap.toFixed(1)} min slower per freight train than B2 (got ${(b2 - b1).toFixed(1)})`);
  assert.ok(b1 < b2, "B1 detour penalty must be larger than B2");
});

test("Södra stambanan and the Alt B freight path both run through Stångby", () => {
  const html = fs.readFileSync(MODEL_HTML, "utf8");
  const pathOf = id => {
    const m = html.match(new RegExp(`id="${id}"[^>]*d="([^"]+)"`));
    assert.ok(m, `${id} path must exist`);
    return m[1];
  };
  const sharedTail = "C 677 308, 720 285, 763 259";
  for (const id of ["rPaxSth", "rFrSth", "rFrChord", "rFrB1", "rLdBypass", "rTunnel"]) {
    const d = pathOf(id);
    assert.ok(d.includes("630 335"), `${id} must run through Stångby (630,335)`);
    assert.ok(d.includes(sharedTail), `${id} must share the Stångby→Eslöv alignment`);
  }
  assert.ok(/d="M 508 456 C 570 410, 583 362, 630 335 C 677 308, 720 285, 763 259"/.test(html),
    "the drawn Södra stambanan must pass through Stångby");
  const chord = pathOf("rFrChord");
  assert.ok(/322\s+346/.test(chord), "Alt B freight must pass Kävlinge (322,346)");
  assert.ok(!/656\s+388/.test(chord), "the old north-loop endpoint must be gone");
  assert.ok(chord.includes("C 350 255, 470 215, 630 335"),
    "static and animated chord must share the same Kävlinge→Stångby arc");
  const b1 = pathOf("rFrB1");
  assert.ok(/258\s+300/.test(b1) && /700\s+300/.test(b1),
    "the B1 route must run Kävlinge→Teckomatorp→Marieholm→Eslöv before joining at Stångby");
  assert.ok(/id="gB1Path"/.test(html), "the B1 Rååbanan segment must be drawn on the schematic");
  assert.ok(!/id="gMeets"/.test(html), "no meet-point label layer (labels/symbols not wanted)");
});

test("freight break-even is defined for B/D packages, in trains/day, and rises with volume", () => {
  const m = model();
  reseed(37);
  const P = scenario(m, { altB: true });
  assert.equal(m.freightBreakEven(P, "dn"), null, "do-nothing has no break-even");
  assert.equal(m.freightBreakEven(P, "A"), null, "Alt A has no freight break-even");
  const be = m.freightBreakEven(P, "B");
  assert.ok(be && Number.isFinite(be.trainsPerDay), "B must break even within 0–3× freight volume");
  assert.ok(be.trainsPerDay > 0 && be.trainsPerDay <= 3 * P.frDaily,
    `break-even ${be.trainsPerDay} must lie in (0, ${3 * P.frDaily}]`);
  const low = m.evaluatePkg(scenario(m, { altB: true, frDaily: 20, tphFr: 0.5 }), "B", 40).cba.bcr;
  const high = m.evaluatePkg(scenario(m, { altB: true, frDaily: P.frDaily * 2, tphFr: 3 }), "B", 40).cba.bcr;
  assert.ok(high > low, `BCR must rise with freight volume (${low.toFixed(2)} -> ${high.toFixed(2)})`);
});

test("freight-removal externalities scale with freight volume (zero freight ⇒ zero removal value)", () => {
  const m = model();
  const P = scenario(m, { altB: true });
  const noFr = m.evaluatePkg(scenario(m, { altB: true, frDaily: 0, tphFr: 0 }), "B", 30).cba.ext;
  const fullFr = m.evaluatePkg(scenario(m, { altB: true, frDaily: P.extRefFr }), "B", 30).cba.ext;
  assert.ok(Math.abs(noFr) < 1e6, `zero freight must earn zero externality (got ${noFr})`);
  assert.ok(fullFr > 0, "full reference volume must earn a positive externality");
});

/* --- Alt D: tunnel-specific checks (acceptance 7) --- */
test("2045 tunnel check: Alt D loses on BCR vs Alt A with defaults", () => {
  const m = model();
  reseed(53);
  const P = scenario(m, { tphReg: 9.5, tphLD: 3.5, tphFr: 2.5, frDaily: 130, altA: true, altB: true, altD: true });
  const out = m.computeAll(P, 60);
  assert.ok(out.DB.cba.bcr < out.A.cba.bcr, `tunnel BCR ${out.DB.cba.bcr.toFixed(2)} must lose to Alt A ${out.A.cba.bcr.toFixed(2)}`);
  assert.ok(out.DB.cba.npv < out.A.cba.npv, "tunnel NPV must lose to Alt A with defaults");
});

test("closure resilience: tunnel blocks the corridor, at-grade keeps a fallback", () => {
  const m = model();
  const P = scenario(m, { altD: true, altB: true });
  const db = m.closureResilience(P, "DB");
  assert.equal(db.corridorBlocked, true, "a tunnel closure has no corridor diversion");
  assert.ok(db.days > 0 && db.extraTrainHoursPerYear > 0, "closure days must carry a corridor-wide consequence");
  assert.equal(m.closureResilience(P, "A").corridorBlocked, false, "at-grade options keep a fallback");
  const b1 = m.closureResilience(scenario(m, { altB: true, bVariant: "b1" }), "B");
  const b2 = m.closureResilience(scenario(m, { altB: true, bVariant: "b2" }), "B");
  assert.ok(b1.extraMinPerTrain > b2.extraMinPerTrain, "B1 single-track failures cost more than B2");
});

test("freight-unsolved guard for Alt D without Alt B", () => {
  const m = model();
  assert.equal(m.freightUnsolved({ altD: true, altB: false }), true);
  assert.equal(m.freightUnsolved({ altD: true, altB: true }), false);
  assert.equal(m.freightUnsolved({ altD: false, altB: false }), false);
  for (const p of m.PKGS) {
    if (m.flagsOf(p).D) assert.equal(m.flagsOf(p).B, true, `${p}: D must imply B`);
  }
});

test("tornado includes the B1/B2 swing and the tunnel frontier parameters", () => {
  const m = model();
  reseed(43);
  const PB = scenario(m, { altB: true });
  const rowsB = m.tornadoFor(PB, "B").rows.map(r => r.label);
  assert.ok(rowsB.some(l => /B1/.test(l) && /B2/.test(l)), "B1 vs B2 must appear in the tornado");
  assert.ok(!rowsB.some(l => /Land value/.test(l)), "land value is a D-only sensitivity");
  const PD = scenario(m, { altD: true, altB: true });
  const rowsD = m.tornadoFor(PD, "DB").rows.map(r => r.label);
  assert.ok(rowsD.some(l => /Land value/.test(l)), "tunnel tornado must expose the land-value frontier");
  assert.ok(rowsD.some(l => /Overrun/.test(l)), "tunnel tornado must expose the overrun-probability frontier");
});

test("national-plan acceleration opens at-grade options in 2037 but not the tunnel", () => {
  const m = model();
  reseed(47);
  const base = scenario(m, { altA: true, altB: true, altD: true });
  const outBase = m.computeAll(base, 30);
  const outAcc = m.computeAll(Object.assign({}, base, { accel2030s: true }), 30);
  assert.equal(outBase.A.cba.open, base.openYear, "base case keeps the ~2040 opening");
  assert.equal(outAcc.A.cba.open, 2037, "national-plan acceleration opens A/B/C in 2037");
  assert.equal(outAcc.DB.cba.open, base.openYear + base.dBuildDelay, "the tunnel still opens after its build delay");
});

test("raising the curve speed barely raises 2-track capacity (headway-bound, not curve-bound)", () => {
  const m = model();
  const cap80 = m.capacityOf("dn", scenario(m, { curveSpeed: 80 })).cap;
  const cap140 = m.capacityOf("dn", scenario(m, { curveSpeed: 140 })).cap;
  const gain = cap140 / cap80 - 1;
  assert.ok(gain >= 0, "capacity must not fall when the curve is eased");
  assert.ok(gain < 0.05, `80 -> 140 km/h moved capacity by ${(gain * 100).toFixed(1)}%; expected only a few %`);
});

test("timetable collapse (punctuality < 85%) is INFEASIBLE even at high utilisation", () => {
  const m = model();
  assert.equal(m.verdictOf(0.90, 0.50).v, "INFEASIBLE");
  assert.equal(m.verdictOf(1.05, 0.99).v, "INFEASIBLE");
  assert.equal(m.verdictOf(0.90, 0.98).v, "FRAGILE");
  assert.equal(m.verdictOf(0.60, 0.80).v, "INFEASIBLE");
  assert.equal(m.verdictOf(0.60, 0.98).v, "FRAGILE");
  assert.equal(m.verdictOf(0.30, 0.99).v, "FEASIBLE");
});

/* ------------------------------------------------------------------ */
test("negative demand growth is supported and scales NPV monotonically", () => {
  const m = model();
  reseed(3);
  const npvAt = g => m.computeAll(scenario(m, { altB: true, growthPct: g }), 60).B.cba.npv;
  const gMinus = npvAt(-1), gZero = npvAt(0), gPlus = npvAt(1);
  assert.ok(Number.isFinite(gMinus) && Number.isFinite(gZero) && Number.isFinite(gPlus), "negative growth must not produce NaN");
  assert.ok(gMinus < gZero, `declining demand must lower NPV for a positive-benefit package (${gMinus} < ${gZero})`);
  assert.ok(gZero < gPlus, `growing demand must raise NPV (${gZero} < ${gPlus})`);
});

test("zero and single-type demand are handled without NaN", () => {
  const m = model();
  reseed(5);
  const cases = [
    { tphReg: 0, tphLD: 0, tphFr: 0, frDaily: 0, frGbgDaily: 0 },
    { tphReg: 0, tphLD: 0, tphFr: 2, frDaily: 100, frGbgDaily: 0 },
    { tphReg: 8, tphLD: 0, tphFr: 0, frDaily: 0, frGbgDaily: 0 }
  ];
  for (const c of cases) {
    const out = m.computeAll(scenario(m, c), 20);
    for (const pkg of m.PKGS) {
      const o = out[pkg];
      assert.ok(Number.isFinite(o.caps.utilCentral), `${pkg} util for ${JSON.stringify(c)}`);
      assert.ok(!Number.isNaN(o.cba.bcr) && !Number.isNaN(o.cba.npv), `${pkg} CBA for ${JSON.stringify(c)}`);
    }
  }
});

test("measured curve radius implies a speed band consistent with the 80 km/h default", () => {
  const meas = JSON.parse(fs.readFileSync(path.join(__dirname, "osm", "measured.json"), "utf8"));
  const R = meas.curveMinRadiusM;
  assert.ok(R > 300 && R < 380, `measured curve radius ${R} m should stay in the expected 300-380 m band`);
  const vEq = Math.sqrt(160 * R / 11.8);       // equilibrium speed at 160 mm cant
  const vMax = Math.sqrt((160 + 100) * R / 11.8); // 160 mm cant + 100 mm deficiency
  assert.ok(Math.abs(vEq - meas.curveEqSpeed160mm) < 1, `stored equilibrium speed ${meas.curveEqSpeed160mm} must match h=11.8v²/R`);
  assert.ok(Math.abs(vMax - meas.curveMaxSpeedCantDef) < 1, `stored max speed ${meas.curveMaxSpeedCantDef} must match h=11.8v²/R`);
  const def = 80;
  assert.ok(def > vEq && def <= vMax, `80 km/h must sit between equilibrium-at-max-cant (${vEq.toFixed(0)}) and the cant-deficiency limit (${vMax.toFixed(0)})`);
  assert.ok(vMax < 95, "the curve cannot be a high-speed alignment");
});

test("break-even scan returns numeric thresholds and monotone ranking flips", () => {
  const m = model();
  reseed(9);
  const scan = m.scanDemand(P2026(m), 0.5);
  assert.ok(scan.grid.length > 1, "scan grid must be non-empty");
  const numeric = Object.values(scan.be).filter(v => v != null);
  assert.ok(numeric.length >= 1, "at least one package must break even within 0.2-3x demand");
  for (const v of numeric) assert.ok(Number.isFinite(v) && v >= 0, `bad break-even ${v}`);
  assert.ok(scan.flips.length >= 1, "ranking must flip somewhere in the scanned range");
  assert.ok(scan.flips.every(f => m.PKGS.includes(f.pkg)), "flip packages must be supported");
  for (let i = 1; i < scan.flips.length; i++) {
    assert.ok(scan.flips[i].tph > scan.flips[i - 1].tph, "flips must advance with demand");
  }
});


/* ------------------------------------------------------------------ */
test("measured.json: B1 legs reproduce the +38.8 km detour; unreachable routes are null", () => {
  const m = model();
  const meas = JSON.parse(fs.readFileSync(path.join(__dirname, "osm", "measured.json"), "utf8"));
  const b1 = meas["Malmo->Teckomatorp(via Kavlinge)"] + meas["Teckomatorp->Eslov"] + meas["Eslov->Stangby"];
  const via = meas["Malmo->LundC"] + meas["LundC->Stangby"];
  assert.ok(Math.abs(via - meas["Malmo->Stangby(via Lund)"]) < 0.2,
    `via-Lund total ${via} must match the direct measurement ${meas["Malmo->Stangby(via Lund)"]}`);
  assert.ok(Math.abs((b1 - via) - m.B1_EXTRA_KM) < 0.3,
    `B1 detour ${(b1 - via).toFixed(1)} km must equal B1_EXTRA_KM ${m.B1_EXTRA_KM}`);
  for (const k of ["LundC->Stockholm", "LundC->Alvesta", "LundC->Hassleholm", "LundC->Helsingborg"])
    assert.equal(meas[k], null, `${k} is beyond the corridor extract and must be null, not a truncated distance`);
});

test("empty track pairs contribute zero capacity (no phantom design capacity)", () => {
  const m = model();
  const P = P2026(m);
  const frPair = m.buildPairs("AB", P).find(pr => pr.id === "fr"); // freight is on the chord: pair empty
  const dem = m.demandMap("AB", P), sp = m.centralSpeeds(m.flagsOf("AB"), P);
  assert.equal(m.pairCapacity(frPair, dem, sp, P).cap, 0, "an empty pair must report 0 tph, not the design figure");
  assert.ok(m.capacityOf("AB", P).capCentral < m.capacityOf("A", P).capCentral,
    "A+B's summed central capacity must exclude the empty freight pair");
});

test("freight detour formula is shared by the travel module (and hence the answer card)", () => {
  const m = model();
  const P = scenario(m, { altB: true });
  const det = m.freightDetour(P);
  assert.ok(det.netMin > 0 && det.chordMin > det.viaMin, "the chord must cost net minutes vs via Lund C");
  reseed(61);
  const out = m.computeAll(P, 40);
  assert.ok(Math.abs(out.B.trav.frDoor - (out.dn.fr.mean - det.netMin)) < 1e-9,
    `frDoor ${out.B.trav.frDoor.toFixed(2)} must equal delay relief minus net detour ${det.netMin.toFixed(2)}`);
  const det1 = m.freightDetour(scenario(m, { bVariant: "b1" }));
  assert.ok(det1.extraKm === m.B1_EXTRA_KM && det1.netMin > det.netMin,
    "B1 must use the measured existing-route detour and be slower than B2");
});

test("noise externality: freight-driven share scales with freight volume, pax share does not", () => {
  const m = model();
  const zeroFr = { frDaily: 0, tphFr: 0 };
  const bExt = m.evaluatePkg(scenario(m, { altB: true, ...zeroFr }), "B", 30).cba.ext;
  assert.ok(Math.abs(bExt) < 1e6, "B's noise+safety benefit must vanish without freight");
  const cZero = m.evaluatePkg(scenario(m, { altC: true, ...zeroFr }), "C", 30).cba.ext;
  const cFull = m.evaluatePkg(scenario(m, { altC: true, frDaily: 130 }), "C", 30).cba.ext;
  assert.ok(cZero > 0 && Math.abs(cZero - cFull) < 1e6,
    `C's externality is pax-driven and must not depend on freight volume (${cZero} vs ${cFull})`);
  const dbZero = m.evaluatePkg(scenario(m, { altD: true, altB: true, ...zeroFr }), "DB", 30).cba.ext;
  const dbFull = m.evaluatePkg(scenario(m, { altD: true, altB: true, frDaily: 130 }), "DB", 30).cba.ext;
  assert.ok(dbZero > 0 && dbFull > dbZero, "the tunnel keeps its pax noise benefit but loses the freight share");
});

test("tunnel closure cost is monetised blocked train-hours and scales with closure days", () => {
  const m = model();
  const at = d => m.evaluatePkg(scenario(m, { altD: true, altB: true, dClosureDays: d }), "DB", 30).cba.closure;
  const c0 = at(0), c3 = at(3), c6 = at(6);
  assert.equal(c0, 0, "no closure days, no closure cost");
  assert.ok(c3 > 0, "closure days must cost blocked train-hours even when other benefits are small");
  assert.ok(Math.abs(c6 - 2 * c3) < 1e-9 * c3 + 1e-9, "closure cost must scale linearly with closure days");
});

test("regional rides the tunnel at 250 km/h with only a small net run-time saving", () => {
  const m = model();
  reseed(67);
  const out = m.computeAll(scenario(m, { altD: true, altB: true }), 30);
  assert.ok(out.DB.trav.regLineSaving !== 0, "D without A must credit regional tunnel run time");
  assert.ok(Math.abs(out.DB.trav.regLineSaving) < 1,
    `the saving is small — vertical circulation eats the short-corridor gain (got ${out.DB.trav.regLineSaving})`);
  const outADB = m.computeAll(scenario(m, { altA: true, altD: true, altB: true }), 30);
  assert.equal(outADB.ADB.trav.regLineSaving, 0, "A+D keeps regional at grade: no tunnel saving");
});

test("freight animation profile preserves the daily totals (and zero demand spawns nothing)", () => {
  const m = model();
  for (const conc of [0, 60, 100]) {
    assert.ok(Math.abs(m.frDailySpawns(17.5, conc) - 17.5) < 1e-9,
      "per-direction daily spawns must equal the input, whatever the night concentration");
    assert.equal(m.frDailySpawns(0, conc), 0, "zero freight must spawn zero trains");
  }
});


test("old-building disturbance weighs against at-grade 4-tracking, not the tunnel", () => {
  const m = model();
  const ext = (pkg, over) => m.evaluatePkg(scenario(m, over), pkg, 30).cba.ext;
  const aOn = ext("A", { altA: true }), aOff = ext("A", { altA: true, extHeritage: false });
  assert.ok(aOn < aOff, `Alt A must be penalised when heritage disturbance is on (${aOn} vs ${aOff})`);
  assert.ok(Math.abs(aOff - aOn - 0.1e9) < 1e6, "the penalty must equal the heritage value slider (0.1 bn/yr default)");
  const dbOn = ext("DB", { altD: true, altB: true }), dbOff = ext("DB", { altD: true, altB: true, extHeritage: false });
  assert.ok(Math.abs(dbOn - dbOff) < 1, "the tunnel must NOT be charged the old-building disturbance");
  for (const [withA, without] of [["AB", "B"], ["AC", "C"], ["ABC", "BC"], ["ADB", "DB"], ["ADC", "DC"]]) {
    const penalty = ext(without, {}) - ext(withA, {});
    assert.ok(penalty > 0, `adding at-grade 4-tracking to ${without} must incur the heritage penalty`);
  }
});

test("measured section lengths are fixed constants, not adjustable sliders", () => {
  const m = model();
  assert.ok(!m.PARAMS.some(p => p.id === "lenSouth" || p.id === "lenNorth"),
    "the OSM-measured section lengths must not be user-adjustable parameters");
  const d = m.defaultState();
  assert.ok(Math.abs(d.lenSouth - 1.65) < 1e-9 && Math.abs(d.lenNorth - 5.14) < 1e-9,
    "defaults must carry the OSM-measured lengths (Klostergården–Lund C 1.65, Lund C–Stångby 5.14)");
  const meas = JSON.parse(fs.readFileSync(path.join(__dirname, "osm", "measured.json"), "utf8"));
  assert.ok(Math.abs(meas["Kloster->LundC"] - d.lenSouth) < 0.05 && Math.abs(meas["LundC->Stangby"] - d.lenNorth) < 0.05,
    "the constants must match osm/measured.json");
});
