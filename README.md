# Lund rail bottleneck — strategic sketch model

> ## UNOFFICIAL — NOT CHECKED BY PROFESSIONALS
>
> This is a **personal, AI-assisted sketch model**, not an official product. It is **not** affiliated
> with, commissioned by or reviewed by Trafikverket, Region Skåne, Lunds kommun, any political party
> or any consultancy. **No professional engineer, economist or planner has checked the code, the
> data or the results.**
>
> Capacity, delay, cost and cost–benefit figures are order-of-magnitude illustrations from simplified
> formulas, public sources and explicitly flagged assumptions. **Do not use this model, its numbers
> or its screenshots for decisions, planning, procurement, advocacy or public claims.** For anything
> that matters, use Trafikverket's own documents and a qualified consultant.

**Live demo (GitHub Pages):** https://johanneswilm.github.io/lund-train-model/

An interactive single-page model of the rail bottleneck through Lund, Sweden
(Klostergården–Lund C–Stångby, ≈6.8 km, on the Malmö–Stockholm main line), built to explore the
trade-offs between four (combinations of) measures:

| | Measure | What it does |
|---|---|---|
| **A** | 4 tracks at grade | Capacity; adds ~50–100% central pair capacity, no speed change |
| **B** | Outer freight track | Moves freight (and dangerous goods) out of the centre. **B1** upgrades the existing western route (Lommabanan + Kävlinge–Teckomatorp + Rååbanan via Marieholm + Eslöv–Stångby); **B2** builds a new chord Kävlinge→Stångby north-west of Lund |
| **C** | LD/HSR bypass + outer station "Lund Västra" | Speed; regional keeps Lund C |
| **D** | Tunnel under the city | Speed + capacity + removes the barrier in one move; reference option — expensive, slow, and its closure blocks the corridor with no diversion |

Everything is editable: demand, line speeds, headways, occupation factors, dwell times, CAPEX, risk
premia, ASEK-style values. Every non-obvious default has a **FACT vs ASSUMPTION** tooltip, and the
in-app **"About / assumptions"** panel lists what should be cross-checked with Trafikverket
(linebook/BIS values, timetable data, costs, forecasts).

## What this is not

- Not an engineering simulation, not a timetable study, not a CBA report.
- Not a Trafikverket or municipal document. The formal project ("Lund, fyra spår") is four tracks
  through Lund along the existing corridor; local parties have campaigned for an outer freight
  track and a tunnel, which this sketch explores alongside.
- Not validated. The capacity/delay/CBA engines are deliberately simple and transparent; the
  Monte Carlo delay simulation is illustrative only.
- Not current on money: most cost anchors are in 2020 prices (as noted in tooltips).

## What *is* measured

Geometry is measured, not invented: section lengths, the Kävlinge→Stångby chord and the
Armaturkurvan curve radius come from OpenStreetMap rail data (Sep 2026) and were cross-checked
against a scale-calibrated Google Maps screenshot (200 m scale bar = 76 px ⇒ 2.63 m/px). The
minimum curve radius is ≈335–355 m just south of Lund C (`osm/measured.json`, `osm_measure.js`).
Everything else — capacity factors, delay distributions, costs for Alt C, externality values — is a
transparent assumption you can change in the UI.

## Running it

No build step, no dependencies, no external requests. Open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8000   # then open http://localhost:8000/
```

Tests (Node 18+, uses the built-in test runner):

```sh
node --test test_model.js
```

The suite extracts the model script from `index.html` and checks all 16 alternative combinations,
capacity semantics (busiest-pair utilisation, C-not-capacity, B variants, tunnel checks), CBA
behaviour (negative growth, break-even, closure resilience), and the schematic/animation geometry.

## Repository layout

| Path | Purpose |
|---|---|
| `index.html` | The entire model (UI, SVG schematic/animation, engine, tests target) |
| `test_model.js` | Node test suite (29 tests) |
| `lund_rail_fact_sheet.md` | Fact sheet with sourced facts and open questions (§9: sources S1–S23) |
| `lund_rail_update_delta.md` | Later research delta that was verified and folded into the model |
| `lund_rail_schematic.png` | Reference rendering of the schematic |
| `osm/` | OSM extracts and measured distances/radii (`measured.json`) |
| `osm_measure.js` | Script that derived the measurements from the OSM extracts |
| `prompt_for_coding_ai.md` | Original brief + addenda for the model (historical) |

## Sources & AI disclosure

Public sources are listed in `lund_rail_fact_sheet.md` §9. The model, its tests and this README were
produced with AI assistance (Kilo/Claude) and then checked where possible against public data; they
have **not** been reviewed by a domain professional. If you spot an error, please open an issue.

## Licence

No licence is granted; this is a personal project published for transparency and discussion. No
warranty of any kind. Do not reuse the outputs as if they were professional analysis.
