# LUND RAIL MODEL — UPDATE FILE (delta only)
Apply this on top of the original fact sheet + prompt. Everything here is NEW since the first
handoff. Nothing about Alt A, Alt C, the base parameters, or the acceptance criteria 1–5 changes.

## 0. New policy fact (affects all alternatives' timeline)
- **April 2026:** Sweden's new national infrastructure plan (2026–2037, 1,171 bn SEK total) names
  four tracks through Lund municipality "the single most important measure" for Södra stambanan and
  has front-loaded funding to accelerate the WHOLE Hässleholm–Lund object. Implication for the model:
  keep the ~2040 completion as the base case but add a "late-2030s acceleration" scenario toggle;
  delay-related opportunity costs (demand surge after Fehmarn Bält 2029) weigh more heavily against
  slow-to-build options (Alt D).

## 1. NEW ALTERNATIVE — ALT D: tunnel through Lund (pre-studied 2020, rejected 2025/2026)
Concept: ~6 km tunnel tubes Klostergården–Stångby + underground 6-track Lund C (Sweden's largest
underground station). Freight handled in separate tubes or on the outer freight track (Alt B).

What it uniquely fixes (the case FOR): speed (straight 250 km/h alignment; the Armaturkurvan curve
disappears), capacity, AND the urban barrier in one move; freed surface corridor = developable land
("Lund+" ≈ +2 bn SEK net uplift; "Lundaskalan" lower); no demolitions at Armaturkurvan; trains keep
running during construction (no possessions) — include as a construction-disruption toggle.

Costs/rejection: 18–22 bn SEK (2020 pre-study). Trafikverket's 2026 verdict: 3–4× the at-grade
cost, higher (embodied/construction) emissions, much longer to build. Even the tunnel carries
heritage risk: settlement could affect the 13th-century Klosterkyrkan.

Overrun risk calibration (Swedish precedents → risk-premium parameter):
- Hallandsåstunneln: 1.25 bn (1991) → 10.8 bn final (~11×, 16–18 yr late, negative CBA).
- Citybanan Stockholm: 16.8 bn SEK / 6 km under inner city (2.8 M kr/m).
- Västlänken Göteborg: ~20 bn / 8 km.
- Citytunneln Malmö: 3.4 bn (1992 est.) → 9.5 bn (2001 prices) — same Skåne ground class as Lund.

Operational implications the model must encode:
- Freight does NOT disappear: Swedish tunnel practice bans it (Malmö Citytunneln: "freight trains
  and diesel trains may not use the section except in exceptional cases") → enforce D⇒B coupling;
  DG-restrictions per EU/TSI.
- Fleet/station requirements: emergency-brake override on rolling stock (Malmö needed a ~2 bn SEK
  new Pågatåg fleet), TSI SRT fire/evacuation, ventilation, pumping; +1–2 min passenger station
  access; permanently higher O&M.
- Resilience inversion: a flooded/burning tunnel blocks the whole corridor with NO diversion
  (Malmö's tunnel was 15 cm from flooding in storm Sven 2013) → add a closure-resilience KPI:
  closure probability (default 0.5–2% of days, assumption) × corridor-wide delay consequence.
- Stranded-investment conflict: Jernhusen is currently building a new SURFACE station at Lund C.

When it wins (decision rule 7): only when land-value capture + VoT + externality values carry a 2–4×
CAPEX premium PLUS a Hallandsås-calibrated overrun distribution, AND freight is solved in parallel
(D+B, the FörNyaLund package). Under ordinary Swedish CBA it never crosses BCR 1.0 — the model's job
is to state the frontier.

## 2. UPDATED ALTERNATIVE — ALT B: now two variants + documented history
Key discovery: most of the bypass already exists. Rååbanan Eslöv–Teckomatorp (15 km via Marieholm)
is freight-only single track; with Lommabanan (Malmö–Kävlinge) and Söderåsbanan it forms a
continuous freight route Malmö→Kävlinge→Teckomatorp→Eslöv→Stångby that never touches Lund C.
Detour vs via Lund C ≈ +10–12 km (~+6–10 min at 90–120 km/h).

- **B1 incremental:** upgrade/double-track Rååbanan Eslöv–Teckomatorp + meeting tracks
  Kävlinge–Teckomatorp. Both are ALREADY on Trafikverket's long-term priority list. Cost default
  2–5 bn (assumption, existing-corridor upgrade).
- **B2 new chord:** straighter new double track Teckomatorp/Kävlinge→Stångby west of Lund (~10–12 km).

Conflicting cost anchors — expose BOTH as scenarios:
- 2020 Sweco/Trafikverket pre-study: outer track = +3–4 bn ON TOP OF at-grade 4-tracking.
- Lund Liberals (Sept 2026): outer freight track for long trains = 10–15 bn SEK standalone.

History/status (for a "history" info toggle in the UI):
- 2017: state–municipality agreement fixed four tracks AT GRADE Högevall–Lund C–Stångby (politically
  foreclosed alternatives).
- July 2019: majority of Lund's parties want outer freight track + tunnel.
- 2020: Lund municipality's Sweco pre-study prices it (+3–4 bn); notes central negative effects
  largely disappear if freight leaves the core.
- 2023–2026: FörNyaLund campaigns for "outer godsspår + tunnel", collecting 10,000 signatures for a
  local referendum (aimed at the Sept 2026 election); seminar Jan 2026.
- Status: never received a formal Trafikverket localization study; Trafikverket maintains the new
  tracks follow the existing corridor. Structurally disadvantaged: benefits accrue mostly to Lund
  while 4-tracking serves the whole Malmö–Stockholm corridor; freight takes the detour hit.

Decision rule 8: Alt B pays off when externality/safety value of removing freight from the centre +
passenger capacity freed exceed freight's detour cost + CAPEX. Strongest as D+B or as cheap B1;
weakest when continental through-freight dominates (high value of minutes).

## 3. New model parameters (defaults; all editable, tooltip "fact" vs "assumption")
| Parameter | Default | Type |
|---|---|---|
| Alt D CAPEX | 18–22 bn (2020) | fact [S14] |
| Alt D overrun risk premium | +20–100% (P10/P50/P90 distribution, calibrate Hallandsås/Citybanan) | fact-calibrated |
| Alt D land-value uplift | 0.5–2 bn ("Lund+") | fact [S14] |
| Alt D O&M uplift vs at-grade | +0.1–0.3 bn/yr | assumption |
| Alt D build time | at-grade +5–10 yr | fact-ish [S17] |
| Tunnel station access penalty | +1–2 min vertical circulation | assumption |
| Tunnel closure probability | 0.5–2% of days, corridor blocked, no diversion | assumption |
| Tunnel freight policy | freight/DG banned by default → D requires B | fact (Citytunneln) [S16] |
| Alt B1 cost (Rååbanan upgrade + meeting tracks) | 2–5 bn | assumption |
| Alt B2 cost | +3–4 bn as add-on (2020) / 10–15 bn standalone (2026) | fact [S5][S22] |
| Alt B detour | +10–12 km, +6–10 min/train | fact (map) + calc |
| Rååbanan today | single track, freight-only, loop at Marieholm | fact [S21] |

## 4. PROMPT ADDENDUM (verbatim patches to apply)
ALTERNATIVES — replace the Alt B bullet with: "B — outer freight track, two variants: B1 incremental
(upgrade/double-track existing Rååbanan Eslöv–Teckomatorp 15 km via Marieholm + meeting tracks
Kävlinge–Teckomatorp, both on Trafikverket's long-term list); B2 new-build chord Teckomatorp/
Kävlinge→Stångby west of Lund. Both divert Malmö↔Stockholm freight off Lund C (+10–12 km detour);
cost anchors +3–4 bn add-on (2020) vs 10–15 bn standalone (Liberals 2026) — expose both; B1/B2
selectable with different per-km costs. History toggle: proposed by local parties since 2019,
FörNyaLund referendum drive 2026, never formally studied by Trafikverket; 2017 agreement and Oct-2023
mandate both specify at-grade along the existing corridor."
And ADD: "D — tunnel (reference/rejected option): ~6 km tubes + underground 6-track Lund C (Sweden's
largest); fixes speed+capacity+barrier simultaneously, frees land (+0.5–2 bn toggle); BUT CAPEX
18–22 bn with user-set overrun premium (Hallandsås 1.25→10.8 bn ~11×; Citybanan 16.8 bn/6 km),
build +5–10 yr (misses Fehmarn surge), higher embodied CO2, higher O&M, freight banned by default
(enforce D⇒B), +1–2 min station access, closure days with no diversion (closure-resilience KPI),
settlement/heritage risk (Klosterkyrkan); less construction disruption (trains keep running)."

ACCEPTANCE CRITERIA — ADD:
"6. Outer-track-specific: compute the freight detour penalty explicitly (+10–12 km ≈ +6–10 min,
incl. single-track Rååbanan constraints in B1) vs centre externality gains; show B's break-even in
freight trains/day; B1 vs B2 must appear in the tornado."
"7. Tunnel-specific: with defaults Alt D must lose on BCR vs Alt A, but the tornado must state the
land-value + VoT + overrun-probability frontier where it wins; selecting D without B must flag
'freight unsolved'; a tunnel-closure day must show corridor-wide delay (no diversion) vs at-grade's
lower-consequence failures."
Also add a scenario toggle: "late-2030s acceleration (April 2026 national plan front-loading)".

SCHEMATIC: add a dashed grey "tube pair" layer along the existing corridor Klostergården–Lund C–
Stångby with a dashed underground-station box at Lund C; Alt B chord label updated to mention B1
(existing Rååbanan via Marieholm) vs B2 (new chord). (Reference rendering: lund_rail_schematic.png,
current version.)

## 5. NEW SOURCES
- [S14] Hallandsåstunneln: 1.25 bn (1991) → 10.8 bn final, ~11× budget, 16–18 yr late (Aftonbladet/SVT/Wikipedia).
- [S15] Citybanan: 16.8 bn SEK, 6 km, 2.8 M kr/m (SVT/Trafikverket); Västlänken ~20 bn/8 km; Citytunneln Malmö 8.5–9.5 bn (2001) vs 3.4 bn (1992 est.).
- [S16] Citytunneln Malmö: freight/diesel ban except exceptional cases; emergency-brake override; storm Sven 2013 flood near-miss (sv.wikipedia Citytunneln).
- [S17] Sveriges Radio 2026-08-21: Trafikverket — tunnel "3–4 gånger dyrare, större utsläpp, betydligt längre tid"; Sydsvenskan 2025-10-15: tunnel "dyrare och sämre", Klosterkyrkan (1300-talet) could be affected.
- [S18] Sydsvenskan 2019-07-21: Lund parties want outer freight track + tunnel.
- [S19] Lund municipality press release 2020-03-16 (Sweco pre-study): yttre godsbana removes most negative central effects; +3–4 bn pricing.
- [S20] FörNyaLund (fornyalund.se, 2025–2026): outer godsspår + tunnel campaign, 10,000-signature referendum drive, Jan 2026 seminar; notes 2017 state–municipality agreement.
- [S21] Wikipedia 'Järnväg i Skåne' + jarnvag.net Rååbanan guide: Lommabanan/Söderåsbanan freight routing; Rååbanan Eslöv–Teckomatorp 15 km via Marieholm; long-term meeting-track priorities Helsingborg–Eslöv (Rååbanan) and Kävlinge–Teckomatorp.
- [S22] Lunds Liberalerna 2026-09-04: outer freight track for long trains ≈ 10–15 bn SEK.
- [S23] Regeringen.se 2026-04: National plan 2026–2037 front-loads Hässleholm–Lund; four tracks through Lund municipality = most important measure for Södra stambanan.
