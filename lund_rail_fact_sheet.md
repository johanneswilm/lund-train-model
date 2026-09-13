# Lund rail bottleneck — fact sheet for the interactive model

Compiled September 2026. Everything here is either a **cited fact** (source in §9) or a **flagged
assumption/parameter default** for the model to expose and let the user vary. All SEK figures are
nominal of their stated year unless noted.

## 1. The place

- Lund (pop. ~95,000; ~130,000 in the municipality) sits ~16.5 rail-km northeast of Malmö in Skåne,
  southern Sweden. Lund C is Sweden's 3rd busiest station: ~40,000 passengers/day [S4].
- Lund C is the junction of two main lines:
  - **Västkustbanan (West Coast Line):** Lund–Gunnesbo–Kävlinge–Landskrona–Helsingborg–…–Göt.eborg,
    max 200 km/h; the Lund–Kävlinge section is passenger-only (25‰ alignment). South of Lund it shares
    tracks with Södra stambanan down to Malmö.
  - **Södra stambanan (Southern Main Line):** Lund–Stångby–Eslöv–Höör–Hässleholm–Alvesta–…–Stockholm,
    ≤200 km/h passenger; carries the Malmö↔Stockholm freight flow.
- North of the station the lines diverge at a grade-separated junction: a dive-under (opened Sept 2004)
  takes southbound West Coast trains under Södra stambanan; the remaining crossing movements are at grade.
- **Godsstråket genom Skåne** (freight corridor Malmö–Kävlinge–Teckomatorp–Åstorp–Ängelholm) carries
  freight between Malmö and Gothenburg **around** the Västkustbanan's passenger-only section — but
  freight between Malmö and Stockholm **must pass through Lund C** on the 2-track section [S3].
- South of Lund: the **Fyrspåret** project (11 km of four tracks Malmö–Lund incl. new Klostergården
  station south of Lund, rebuilt Åkarp/Hjärup/Burlöv stations, 400 m tunnel under Åkarp) was fully
  opened in 2023 (last tracks in service Dec 2023). Design capacity on Malmö–Lund rose from ~460 to
  ~650 trains/day [S1][S2].
- **The remaining 2-track bottleneck** is **Klostergården – Lund C – Stångby, ~6 km** (measured on
  OSM, Sep 2026: 1.65 + 5.14 = 6.8 km). The short
  double-track Klostergården–Lund limits Södra stambanan capacity to ~20–22 trains/hour/direction
  (Trafikverket design figure, ERTMS assumptions) [S7].
- The **Armaturkurvan** is a sharp curve just south of Lund C. Freight cars derailed there in 1987.
  It is the one place where 4-tracking at grade requires significant building demolition [S4][S5][S6].
  (Speed limit at the curve: not found in public sources — model parameter, default 80 km/h, VERIFY.)
- Lund C has **6 platform tracks**; station area is being rebuilt (new Jernhusen station building,
  widened Mittelbron bridge, tram terminus, Brunnshög/ESS–MAX IV innovation district to the north) [S9][S10].

## 2. Traffic today and forecast

- Through central Lund today: **~400 passenger + ~60–70 freight trains/day**; Trafikverket expects
  traffic to roughly **double to ~700–800 trains/day** when the Fehmarn Bält fixed link opens
  (rail 2029; German-side feeder works delayed to ~2034) [S4][S8].
- Öresund bridge today: ~7 passenger + ~2 freight tph/direction; 2045 prognosis ~8 regional + 2
  long-distance + ~1 freight tph/direction; freight across the bridge 25–35 → ~50 trains/day by 2045 [S8].
- Train types: Öresundståg X31K (Copenhagen–Malmö–Lund–Helsingborg/Gothenburg; 200 km/h capable),
  Pågatåg X61 regional, SJ snabbtåg (X2000 tilting EMUs — refurbished 2020–2023 and still in
  service; new high-speed EMUs on order, hourly Stockholm–Copenhagen target), Snälltåget, night
  trains, Green Cargo/Hector/DB freight. Tilt stock softens the curve for its own passengers but
  does not lift the posted curve limit for freight or other traffic.
- Freight speeds: traditionally 80–100 km/h; from June 2025 new brake tables allow 100–120 km/h and
  850 m trains off the continent (730 m before) [S11]. Faster freight ≈ more paths/hour on mixed lines
  (KTH study: on a mixed line, raising freight speed 100→160 km/h roughly triples feasible freight
  paths/hour) [S12].

## 3. Projects and decisions (status Sept 2026)

- **April 2026 national plan (2026–2037, 1,171 bn SEK):** front-loads the whole Hässleholm–Lund
  object; four tracks through Lund municipality is named "the single most important measure" for
  Södra stambanan capacity [S23]. Note: Trafikverket's own 2026 timetable still pointed to traffic
  on the new tracks around 2043–2048 — the model's base case stays ~2040 with a 2037 acceleration
  toggle.
- **Government decision Oct 2023:** two new tracks **Klostergården–Hässleholm**, designed for
  **250 km/h mixed traffic** (max 10‰ so freight can run), program cost frame **28 bn SEK (2021
  prices)**, target ~2040 (ambition to pull to late 2030s) [S7][S13].
- Split: **"Lund, fyra spår"** = Stångby–Klostergården (4 tracks through Lund; railway plan can start
  directly, along existing alignment); **"Hässleholm–Lund, två nya spår"** = Stångby–Tormestorp
  (~35 km; corridor alternatives studied: mean costs 20–41 bn SEK depending on alternative) [S7].
- A **tunnel under Lund** was pre-studied (2020): 18–22 bn SEK incl. Sweden's largest underground
  station (6 tracks); ruled out by Trafikverket — would push program cost from ~30 to ~40 bn and delay
  it; at-grade through Lund for pax+freight: 5–7 bn; at-grade + **outer freight track: +3–4 bn** [S5][S6].
- Trafikverket region chief (2025): new tracks will follow the existing corridor, "no other
  alternatives"; tunnel excluded [S6]. Local group FörNyaLund campaigns for outer freight track +
  passenger tunnel instead [S4].
- Supporting measures in the same program: Malmö yard grade separation, extra platforms at Malmö C
  (start pulled forward to 2027, done 2029), double track Östervärn–Malmö C, passing loops Slätthult,
  Rättelöv, Hässleholm track 21, meeting tracks on Godsstråket [S7][S13].
- Contingency if the main decision slips: complete 4 tracks Klostergården→Lund C only, incl. platform
  extensions at Lund C [S7].
- Travel-time stakes: Stockholm–Copenhagen is to gain ~30–40 min from Ostlängen + new Hässleholm–Lund
  tracks; but the curve/2-track section through Lund caps what materializes unless 4-tracked or bypassed [S8][S13].

## 4. The three alternatives to model

**ALT A — 4 tracks through the centre (Trafikverket plan).** Two new tracks at grade alongside the
existing pair Klostergården–Lund C–Stångby; station platforms extended; demolitions at Armaturkurvan.
Pros: maximum central capacity, all trains keep serving Lund C, enables Lund Södra-style local
stop (already Klostergården). Cons: land take/noise in the core, cultural-environment conflicts,
curve remains (speed unchanged), construction disruption. Cost anchor: 5–7 bn SEK (Lund section, 2020).

**ALT B — outer freight track (cargo bypass), two variants.** Both divert Malmö↔Stockholm freight
off Lund C. **B1 incremental:** upgrade/double-track the already-existing freight route Lommabanan
(Malmö–Kävlinge) + Kävlinge–Teckomatorp + Rååbanan Eslöv–Teckomatorp via Marieholm (14.9 km) +
Eslöv–Stångby; both Kävlinge–Teckomatorp and Rååbanan meeting tracks are on Trafikverket's long-term
priority list [S21]. It never touches Lund C, but the detour vs via Lund C is **≈ +38.8 km**
(60.4 km vs 21.6 km, OSM Sep 2026) — note the update draft's "+10–12 km" belongs to B2. Cost
2–5 bn (assumption). **B2 new-build chord:** straighter double track Kävlinge → Stångby passing
north-west of Lund, **≈ +10 km**, 100–120 km/h; cost anchors: +3–4 bn add-on (2020 Sweco/Trafikverket
pre-study [S5]) vs 10–15 bn standalone (Lund Liberalerna Sept 2026 [S22]) — the model exposes both.
Pros: removes ~60–70 (→120+) freight trains/day incl. dangerous goods from the centre; big
noise/safety gains; pairs well with Alt A or D; frees central capacity. Cons: freight takes the
detour hit (≈ +6–10 min trains on B2, ≈ +25–30 min on B1), does nothing for passenger speed, new
line in open landscape (B2). History: proposed by local parties since 2019 [S18]; Lund municipality
2020 pre-study priced it and noted most central negative effects disappear if freight leaves the
core [S19]; FörNyaLund's 10,000-signature referendum drive 2025–26 [S20]; never formally studied by
Trafikverket; the 2017 state–municipality agreement and Oct-2023 mandate both specify at-grade along
the existing corridor.

**ALT C — LD/HSR bypass + outer station (Shinkansen-style).** New 250 km/h double track from the
Klostergården area to Stångby, bypassing Armaturkurvan and Lund C to the west, with an outer station
("Lund Västra"); long-distance/HSR trains stop only there; regional trains keep Lund C on the classic
2 tracks; tram/bus people-mover link (~5 min). Japanese analogues: Shin-Yokohama, Shin-Kobe,
Shin-Osaka (HSR stations outside the classic core, metro-connected); extreme case Shin-Hakodate-Hokuto.
Swedish precedent: Båstad's station was relocated out of the centre on the rebuilt Västkustbanan.
Pros: solves the speed problem (curve eliminated for through trains), no demolitions in the core,
frees central capacity. Cons: LD passengers get a peripheral station (cf. Japan: works with a fast
feeder), does not by itself add central peak capacity, cost model assumption ~10–15 bn SEK.

**ALT D — tunnel through Lund (pre-studied 2020, rejected 2025/2026).** ~6 km of tunnel tubes
Klostergården–Stångby with an **underground 6-track station** at Lund C — Sweden's largest underground
station — plus separate freight tunnels or the outer freight track for freight. Fixes speed (straight
250 km/h alignment, curve eliminated), capacity, AND the urban barrier in one move; the freed surface
corridor can be redeveloped ("Lund+" ≈ +2 bn SEK net land value; "Lundaskalan" less). BUT: 18–22 bn SEK
(2020); Trafikverket's 2026 verdict: 3–4× the at-grade cost, higher (embodied/construction) emissions,
much longer to build; construction method proposed was not previously used in Sweden; higher
technical/environmental/economic risk; settlement risk could affect the 13th-century Klosterkyrkan;
freight restrictions in long tunnels (Swedish practice: Malmö Citytunneln bans freight and diesel
altogether; dangerous-goods limits under EU/TSI) mean the tunnel alone does NOT remove freight from
the equation — pair with Alt B; underground stations add vertical-circulation time, ventilation,
pumping, fire/evacuation requirements (TSI SRT), and rolling-stock requirements (emergency-brake
override — the Malmö tunnel required a 2 bn SEK new Pågatåg fleet); flood resilience (Malmö Citytunneln
came 15 cm from flooding in storm Sven 2013) — a tunnel closure blocks the whole corridor with no
diversion; O&M costs permanently higher; conflicts with the new surface station Jernhusen is currently
building. Swedish tunnel cost-overrun precedents argue for a risk premium: Hallandsås 1.25→10.8 bn
(~9–11×, 16–18 yr late, negative CBA), Citybanan 16.8 bn/6 km (2.8 M kr/m), Västlänken ~20 bn/8 km,
Citytunneln Malmö ~8.5–9.5 bn (1992 estimate was 3.4 bn). Upside vs at-grade: no demolitions at
Armaturkurvan, no surface noise, trains keep running during construction (less possession disruption),
permanent land release.

Note the user's intuition, confirmed by sources: **because every train already slows at the curve, the
case for 4 tracks is a capacity/robustness case, not a speed case.** Speed requires realignment or
Alt C; capacity requires Alt A or B.

## 5. When does expanding to 4 tracks make sense? (decision rules the model should test)

1. **Capacity rule:** when peak-hour demand (all types, both directions) exceeds the timetableable
   capacity of the 2-track mixed section. Use practical (not theoretical) capacity: heterogeneous
   speeds + Lund C dwells + junction conflicts ⇒ assume practical ≈ 55–65% of the 20–22 tph/direction
   design figure unless segregated. Rule of thumb: 4-track when peak demand > ~12–14 tph/dir mixed.
2. **Segregation rule:** when the required service pattern mixes ≥2 LD tph + ≥4 regional tph +
   ≥1–2 freight tph in the peak and timetable robustness (recovery margins) collapses on 2 tracks.
3. **Growth rule:** when committed demand growth (Fehmarn Bält 2029, hourly Stockholm–Copenhagen,
   freight 60–70 → 120–140/day) pushes daily trains through the section past ~700/day.
4. **Robustness rule:** when average delay minutes from conflicts exceed ~1–2 min/train and punctuality
   target (95% ≤ 5 min) fails in simulation.
5. **Safety/externality rule:** when the value of removing freight (dangerous goods, noise, barriers)
   from the centre is material — then Alt B (possibly with A) dominates.
6. **Counter-rules (when 4 tracks do NOT make sense):** peak demand < ~10 tph/dir and freight can be
   windowed/bypassed; if the objective is travel time, fix alignment/Alt C instead; if demolition costs
   and cultural values in the core are too high, Alt B+C can beat A on benefit-cost ratio.

7. **Tunnel rule:** the tunnel (Alt D) wins only when central land-value capture + externality values
   + travel-time gains are high enough to carry a 2–4× CAPEX premium plus an overrun risk premium
   (calibrate on Hallandsås/Citybanan), AND freight is simultaneously solved (Alt D+B). Under current
   Swedish CBA practice Trafikverket judged it never crosses BCR 1.0 — the model should let users test
   under what (extreme) assumptions it would.

## 6. Model parameters (defaults)

**Infrastructure**
| Parameter | Default | Basis |
|---|---|---|
| Section length Klostergården–Lund C | 1.65 km | measured (OSM Sep 2026, `osm/measured.json`; supersedes the earlier 2.5 km map estimate) |
| Section length Lund C–Stångby | 5.14 km | measured (OSM Sep 2026; supersedes the earlier 5.0 km map estimate) |
| Tracks today | 2 | fact |
| Design capacity, 2-track section | 20–22 tph/dir | [S7] |
| Curve speed (Armaturkurvan) | 80 km/h | ASSUMPTION — verify (alignment measured: R ≈ 334 m ⇒ 80 km/h plausible, >~90 km/h not) |
| Line speed Södra stambanan | 200 km/h pax / 90–120 freight | [S11] |
| New-pair speed (Alt A north of Stångby) | 250 km/h | [S13] |
| Lund C dwell time (pax) | 1.5–2.5 min (type-dependent) | assumption |
| Minimum headway (mixed, 2 tracks) | 3–4 min | assumption |
| Minimum headway (segregated, 4 tracks) | 2–3 min | assumption |
| ERTMS level | L2 baseline | fact (national rollout) |
| Tunnel freight policy | freight banned / DG-restricted → needs Alt B or separate freight tubes | fact (Citytunneln precedent) [S16] |
| Tunnel closure probability (flood/fire/technical) | e.g. 0.5–2% of days, corridor blocked | ASSUMPTION |

**Traffic scenarios (trains per hour per direction, peak)**
| Type | 2026 | 2035 (Fehmarn open) | 2045 |
|---|---|---|---|
| Regional (Öresundståg + Pågatåg) | 6 | 8 | 9–10 |
| Long-distance (SJ/Snälltåget/night) | 2 | 3 | 3–4 |
| Freight (peak hour) | 1–2 | 2 | 2–3 |
| Freight (per day, both dirs) | 60–70 | 90–100 | 120–140 |
| Total/day (all types) | ~470 | ~600 | ~750–800 |

**Costs (SEK, expose as ranges)**
| Item | Value | Basis |
|---|---|---|
| Alt A, Lund section | 5–7 bn | [S5] (2020) |
| Alt B1 (upgrade existing Lommabanan/Kävlinge–Teckomatorp/Rååbanan) | 2–5 bn | ASSUMPTION |
| Alt B2 (new chord Kävlinge–Stångby, ~10 km) | +3–4 bn add-on (2020) / 10–15 bn standalone (2026) | [S5][S22] (both exposed) |
| Alt C (250 km/h chord ~12–15 km + outer station) | 10–15 bn | ASSUMPTION — calibrate vs [S7] new-build alts (20–41 bn for ~35 km incl. systems) |
| Tunnel under Lund (reference) | 18–22 bn (2020) / +10 bn vs program frame | [S5][S6] |
| Program frame Hässleholm–Lund | 28 bn (2021) | [S13] |
| Alt D tunnel (Lund section, 2020) | 18–22 bn | [S5] |
| Alt D risk premium (overrun probability × magnitude, calibrate Hallandsås/Citybanan) | +20–100% | [S14][S15] |
| Alt D land-value uplift ("Lund+") | +0.5–2 bn | [S5] |
| Alt D O&M uplift vs at-grade | +0.1–0.3 bn/yr | ASSUMPTION (cf. Citytunneln +5 Mkr/yr stations+tunnel, 1994 SEK) |

**CBA parameters (Swedish ASEK-compatible, adjustable)**
- Value of time: business ~550 SEK/h, commute ~230, leisure ~140; freight train-hour ~6,000 SEK.
- Punctuality value: ~1–2 SEK per expected delay-minute per passenger; reliability premium for freight.
- Discount rate 3.5% (Swedish official), horizon 40–60 years, demand growth scenarios ±.
- Externalities: noise, barrier effects, accident risk (dangerous goods through centre), CO2,
  old-building/heritage disturbance in the centre (demolitions at Armaturkurvan, setting impacts —
  charged to at-grade 4-tracking, not the tunnel; ASEK does not monetise it, model default
  0.1 bn/yr swing, adjustable).

## 7. Open questions / uncertainties the model must surface
- Exact speed limit at Armaturkurvan (curvature is measured: R ≈ 334 m; the posted limit still
  needs the Trafikverket linebook / Banverket "BIS" value).
- Exact current timetable paths at Lund C throat (punctuality data: Trafikverket "TIS"/"Först"?
  — use TRV open data or LÖT demand model for calibration).
- Fehmarn Bält traffic ramp-up (2029 vs German 2034), Öresundståg fleet (X31K replacement),
  Swedish HSR policy (Götalandsbanan/Europabanan status dormant).
- Demolition/compensation costs at Armaturkurvan; land-value uplift if tracks are decked over
  (2020 pre-study: "Lund+" development could net ~2 bn SEK).

## 9. Sources
- [S1] Trafikverket, Fyrspåret Malmö–Lund project pages / inauguration 2023.
- [S2] News coverage of final track switch (Oct/Dec 2023), capacity 460→650 trains/day.
- [S3] jarnvag.net, Västkustbanan history (Lommabanan/Söderåsbanan names, freight routing, Båstad).
- [S4] FörNyaLund / Sydsvenskan 2025–2026: 400 pax + 70 freight trains/day, doubling forecast, curve & demolition conflict.
- [S5] Järnvägsnyheter 2020-04-14: tunnel pre-study — tunnel 18–22 bn; at-grade 5–7 bn; +outer freight 3–4 bn.
- [S6] Sydsvenskan 2026: tunnel ruled out (~30→40 bn), Trafikverket "no other alternatives".
- [S7] Region Kalmar knowledge compilation of Trafikverket Hässleholm–Lund documents: 20–22 tph limit, alternative costs 20/22/33/36 bn, measures list.
- [S8] Øresundståg capacity documents (via.tt.se) + Hallandstrafiken: Öresund flows today/2045, Stockholm–Copenhagen times.
- [S9] Trafikverket Lund C accessibility project (tracks 1–6).
- [S10] Lunds kommun "Lund C" urban development page.
- [S11] Järnvägsnyheter/Transportnet: new brake tables June 2025, 100–120 km/h freight, 850 m trains.
- [S12] KTH Rail Logistics thesis: freight speed 100→160 km/h ≈ triples paths/hour on mixed lines.
- [S13] Trafikverket "Hässleholm–Lund, två nya spår": 250 km/h, mixed, 28 bn frame, ~2040; Malmö C platforms 2027–2029.

- [S14] Hallandsåstunneln: 1.25 bn (1991) → 10.8 bn final, ~11× budget, 16–18 yr late (Aftonbladet/SVT/Wikipedia).
- [S15] Citybanan Stockholm: 16.8 bn SEK, 6 km, 2007–2017; Västlänken ~20 bn/8 km (SVT/Trafikverket list); Citytunneln Malmö 8.5–9.5 bn (2001 prices) vs 3.4 bn 1992 estimate (Wikipedia/GP).
- [S16] Citytunneln Malmö technical requirements: freight/diesel banned except exceptional cases; emergency-brake override required; storm Sven 2013 flood near-miss (sv.wikipedia Citytunneln).
- [S17] Sveriges Radio 2026-08-21: Trafikverket — tunnel "3–4 gånger dyrare, större utsläpp, betydligt längre tid"; Sydsvenskan 2025-10-15: tunnel "dyrare och sämre", Klosterkyrkan (1300s) could be affected.
- [S18] Sydsvenskan 2019-07-21: Lund parties want outer freight track + tunnel.
- [S19] Lund municipality press release 2020-03-16 (Sweco pre-study): yttre godsbana removes most negative central effects; +3–4 bn pricing.
- [S20] FörNyaLund (fornyalund.se, 2025–2026): outer godsspår + tunnel campaign; 10,000-signature referendum drive (flyer verified, deadline 1 Feb 2026); notes the 2017 state–municipality agreement. (Jan 2026 seminar not independently verified.)
- [S21] Wikipedia "Järnväg i Skåne" + jarnvag.net Rååbanan guide: Lommabanan/Söderåsbanan freight routing; Rååbanan Eslöv–Teckomatorp 15 km via Marieholm (OSM measured 14.9 km); long-term meeting-track priorities Kävlinge–Teckomatorp and the Rååbanan. (Route continuity + detour verified on OSM, see osm/measured.json.)
- [S22] Lunds Liberalerna 2026-09-04 (lund.liberalerna.se): outer freight track for long trains estimated at a further 10–15 bn SEK (in a tunnel+outer-track context). Verified.
- [S23] Regeringen.se 2026-04-26 + Trafikverket 2026-08-21: national plan 2026–2037, 1,171 bn SEK, front-loads Hässleholm–Lund; four tracks through Lund = "den allra viktigaste åtgärden" for Södra stambanan. Verified. (Trafikverket's earlier 2026 timetable mentioned 2043–2048 for the new tracks — model keeps ~2040 base + 2037 acceleration toggle.)
