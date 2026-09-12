const fs = require("fs");
const html = fs.readFileSync("lund_rail_model.html", "utf8");
const code = html.match(/<script>([\s\S]*)<\/script>/)[1];
const api = new Function(code + "; return {computeAll, scanDemand, defaultState, PARAMS, verdictOf, capacityOf, PKGS};")();
const { computeAll, defaultState, verdictOf, PKGS } = api;

const PRE = { "2026": { tphReg: 6, tphLD: 2, tphFr: 1.5, frDaily: 65 }, "2045": { tphReg: 9.5, tphLD: 3.5, tphFr: 2.5, frDaily: 130 } };

for (const [name, pre] of Object.entries(PRE)) {
  const P = Object.assign(defaultState(), pre);
  const out = computeAll(P);
  console.log(`\n=== ${name} === (peak ${P.tphReg + P.tphLD + P.tphFr} tph/dir)`);
  for (const pkg of PKGS) {
    const o = out[pkg];
    const vd = verdictOf(o.caps.utilCentral, o.punct);
    console.log(`${pkg.padEnd(3)} cap=${o.caps.capCentral.toFixed(1).padStart(5)} utilC=${(o.caps.utilCentral * 100).toFixed(0).padStart(4)}% punct=${(o.punct * 100).toFixed(1).padStart(5)}% p95(reg/ld/fr)=${o.reg.p95.toFixed(1)}/${o.ld.p95.toFixed(1)}/${o.fr.p95.toFixed(1)} ${vd.v.padEnd(11)} | BCR=${isFinite(o.cba.bcr) ? o.cba.bcr.toFixed(2) : "inf"} NPV=${(o.cba.npv / 1e9).toFixed(1)}bn spd=${o.trav.ldSpeed.toFixed(0)}km/h`);
  }
  const Pfast = Object.assign({}, P, { curveSpeed: 140 });
  const cap80 = api.capacityOf("dn", P).cap, cap140 = api.capacityOf("dn", Pfast).cap;
  console.log(`curve test: dn cap 80=${cap80.toFixed(1)} 140=${cap140.toFixed(1)} (${(100 * (cap140 - cap80) / cap80).toFixed(1)}% — must be small)`);
}
// break-even at 2026-ish settings: scan
const P = defaultState();
const t0 = Date.now();
const scan = api.scanDemand(P, 0.1);
console.log(`\nscan (2026 base): ${Date.now() - t0} ms`);
for (const p of PKGS) console.log(`  break-even ${p}: ${scan.be[p] ? scan.be[p].toFixed(1) + " tph/dir" : "not within 0.2–3.0× demand"}`);
console.log("  flips:", scan.flips.map(f => `${f.tph.toFixed(1)}tph→${f.pkg}`).join(" | "));
