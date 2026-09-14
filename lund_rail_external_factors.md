# EXTERNAL FACTORS — Lund rail model add-on
How much traffic the Klostergården–Lund C–Stångby section will ever carry is decided largely OUTSIDE
Lund. This document collects the main external factors, split into (A) supply-side constraints that
LIMIT possible trains and (B) demand-side modifiers that REDUCE the number of trains needed for a
given output. Compiled 2026-09-14. [E#] = source at the end. All are scenario toggles/parameters for
the model; none changes the alternatives A–D themselves.

## A. SUPPLY-SIDE CONSTRAINTS (cap on possible trains)

### A1. The Öresund fixed link itself — a capacity ladder, not a single number
- The bridge's raw maximum is ~15 passenger tph/direction, but mixed traffic cuts it to 12 pax + 2
  freight; the need to feed Kastrup airport domestic (Danish) trains cuts it further to 8 pax + 2
  freight — that is the practical ceiling today [E1].
- Today: 7 pax + 2 freight tph/direction run over the bridge; there is theoretical room for ~5 more
  passenger trains, BUT land-side conditions on both shores prevent expansion — and per Trafikverket's
  documents the binding limit right now is the SWEDISH BORDER CONTROL (ID checks for arrivals from
  Denmark), which constrains passenger frequencies [E3].
- RailSys timetable analysis: with 3 freight tph/direction, 10 passenger tph fit; with 4 freight,
  8 passenger; these are disturbance-sensitive maxima (UIC 406 ≈ 100% utilisation) [E2].
- Single-track operation scenarios (maintenance/incident): 2 freight + 4 Öresundståg tph [E2].
- Practical long-term ceiling ≈ 90 freight train slots/day (3/h avg); Trafikverket prognosis:
  ~50 freight trains/day 2030, ~63/day 2040, so the bridge is NOT the long-term binding constraint —
  the land corridors are [E2][E3].
- Freight over the bridge 2018: ~8,700 trains/yr (~24/day); mostly combi + wagonload to/from
  Gent, Hamburg, Ruhr, Cologne, N Italy; the HEAVIEST steel trains cannot use the bridge route at
  all (axle-load limits in Germany) and go by ferry from Trelleborg instead [E2][E3].

### A2. Danish-side chain: Kastrup → Copenhagen H
- Kastrup station rebuild → 4 tracks, ready ~2027 (adds capacity at the airport node) [E3].
- Copenhagen H is a hard bottleneck: max ~11 passenger trains/hour from the Øresund line in today's
  layout; it "can take today's traffic from Sweden but would struggle with increased traffic" [E1][E3].
- Sweco (2024, for Øresundsbro Konsortiet): 8 already-decided measures on BOTH shores (Kastrup
  expansion, Kalvebod bypass, CPH Syd platforms, Malmö C expansion, double track Malmö C–Övre
  Östervärn, Svågertorp loops, Malmö freight-yard lengthening) TRIPLE rail capacity over the sound by
  2035–2040 [E5].

### A3. Swedish-side chain south of Lund
- Malmö Citytunneln: 17 km, capacity ~450 trains/day, 16 hourly "channels" of which 6 are reserved
  for Pågatåg → only 10 for Öresund/LD traffic [E1][E9]. This cap binds BEFORE the new 4 tracks
  Klostergården–Lund do — the model should show flows capped upstream of Lund.
- Malmö C platform expansion (start 2027, done 2029) and Östervärn–Malmö C double track are in the
  Hässleholm–Lund program (already in model base case) [E10].
- Malmö freight yard is lengthening 4 tracks for 835 m trains (adaptation to continental train
  lengths) [E2].

### A4. North and west of Lund (where capacity problems migrate)
- Per Trafikverket: the LARGEST capacity constraint in southern Sweden is Södra stambanan — after
  the Lund four-tracking, the bottleneck shifts to Lund–Alvesta; with freight growth, Älmhult–
  Hässleholm saturates; passing loops Alvesta–Hässleholm are in the current plan; only beyond-2050
  measures make Öresund capacity the binding limit [E3].
- Västkustbanan still has single-track gaps (Helsingborg C–Maria double-tracking postponed as
  unprofitable; Kungsbacka–Göteborg; Varberg tunnel completed) — caps Gothenburg flows, incl.
  Oslo–Copenhagen trains that pass Lund [E3][E12].

### A5. Fehmarn Bält ramp (both constraint and demand driver)
- Rail opens 2029 but German feeder works ~2034 cap the initial benefit [E3].
- Danish prognosis: ~74 freight trains/day over Fehmarn by 2035 (both directions), ~90% continuing
  to Sweden/Norway; Danish side promises 2 freight channels/hour (only ~1/hour available over
  Jylland) → ~48 train slots/day in the Malmö–Hamburg corridor [E2][E3]. Model implication: the
  continental freight surge arrives late but is large; it lands on the same Lund corridor.

### A6. Fleet, signalling, staffing
- New-generation Öresundståg ("System 3"): single/combi/double-deck studied (Stadler bid: Dosto-like
  ~850 seats); decision POSTPONED — Region Skåne instead bought 10 used DSB trains (2024) to extend
  the X31K fleet's life; long-term capacity plan promised [E8]. Fleet capacity is therefore an open
  parameter, not a settled fact.
- Denmark's ERTMS transition + Sweden's ERTMS rollout require dual-system fleets during migration;
  border-crossing fleets (X31K replacement) are a procurement risk [E3].
- Driver availability and maintenance windows (possessions) shave practical capacity — include a
  generic "operations haircut" parameter (default 10–15%).

## B. DEMAND-SIDE MODIFIERS (same output, fewer trains)

### B1. Seats per train (the double-decker lever — with a catch)
- Today: 711 seats (240 m, 3 coupled units); planned new single-deck: ~810; double-deck: 990 seats
  at 250 m, 1,100 at 300 m → up to 13,200 seats/hour at 2 freight channels WITHOUT adding trains [E1].
- THE CATCH: the Kastrup tunnel/clearance profile constrains what can run through to Copenhagen —
  a double-deck Öresundståg may be confined to Swedish sections or require the metro to absorb
  short cross-sound trips. Model as: "double-deck ON → seats/train ×1.35–1.5, but bridge slots
  unchanged; incompatible with through CPH services unless tunnel gauge cleared (toggle)."
- Longer trains: platform extensions at Lund C/Malmö C (in program) enable longer sets.

### B2. Tonnes per freight train
- Continental train length 730 → 835–850 m (new brake tables June 2025): ~+15% tonnage per train;
  Malmö yard adapting [E2][E11]. Effect: required freight trains for a given tonnage fall ~13%.
- Speed: freight 100–120 km/h (was 80–100) raises path capacity on mixed lines [E11].

### B3. Öresundsmetron (the big one — moves regional demand off the railway)
- Status 2026: SOU 2026:17 "Öresundsförbindelser 2050" (Widman) delivered March 2026 → bilateral
  Swedish–Danish strategic investigation starting 2027; NATO/security redundancy argument prominent;
  Öresundsmetron included in the bilateral mandate; Copenhagen's metro plan (M5) already drafts a
  branch toward it; Malmö has preliminary stations in its comprehensive plan [E6][E7].
- Economics: ~72 bn SEK, 2025 CBA ≈ 1.23 SEK/SEK; opening ~2040 possible if decided in time [E7].
- Effect (AFRY): metro absorbs local cross-sound demand (~8,000 pax/h/dir), freeing bridge capacity
  for up to 4 freight tph + long-distance; without it, regional trains over the bridge must double
  by 2035 and seat capacity saturates by 2040 (~60,000 travellers/day) [E4].
- Model: "metro 2040 ON/OFF" toggle → reduces required regional bridge tph by X (default 30–50%),
  frees 1–2 freight slots; include as scenario, not base case.

### B4. HH-förbindelsen (Helsingborg–Helsingør fixed link)
- Not decided; in scenario studies it removes ~10% of bridge passengers and provides freight
  redundancy when the bridge is closed [E2]. Toggle OFF by default.

### B5. Land-side substitution on the shortest segment
- Malmö–Lund is ~20 min by road; regional bus + planned cycle highway compete for the shortest
  trips; hybrid work flattens peaks. Effect: slows peak-hour growth (already visible in post-2020
  data); model as demand-growth haircut toggle (default 0–10% off peak growth).

### B6. Policy-driven freight demand (a negative modifier — MORE trains needed)
- EU modal-shift targets and German/Danish rail-freight promotion push traffic onto the corridor
  beyond pure market growth; climate prognoses show even higher freight volumes than Trafikverket's
  base prognosis [E2]. Include "policy push" freight uplift scenario (+20–40%).

## C. HOW TO WIRE THIS INTO THE MODEL
1. Add an "External factors" panel with toggles/sliders:
   - Öresund slot cap: 8+2 (base) / 10+3 / 12+2 (post-Kastrup+CPH upgrades) [E1][E2]
   - Border-control friction: ON (today, limits pax expansion) / OFF
   - Metro 2040: OFF (base) / ON; HH link: OFF / ON
   - Fleet: seats/train 711 (today) / 810 (new single-deck) / 990–1100 (double-deck, gauge-cleared)
   - Freight train length 730 / 850 m; freight speed 90 / 110 km/h
   - Fehmarn ramp: 2034 slow / 2029 fast; Ostlänken ON (~2030s)
2. Enforce ordering: bridge slot cap and Citytunneln 10-channel cap bind BEFORE Lund's 4-track
   capacity — the Lund bottleneck only matters for flows that get through the caps.
3. Report "Lund relevance" per factor: the model should grey out/show as upstream-limited the Lund
   alternatives when external caps make their capacity gain moot (e.g., metro ON + double-deck ON
   may eliminate the need for Alt A's capacity even in 2045 — THAT is a headline finding to surface).

## SOURCES
- [E1] TRM/Trafikverket et al., "Resande och transporter över Öresund" (2014): capacity ladder 15→
  12+2→8+2; CPH 11 tph; Citytunneln 16 channels/6 Pågatåg; double-deck seat numbers; 13,200 seats/h max.
- [E2] Utveckling Skåne, "Nya Öresundsförbindelser – gränsöverskridande järnvägsgodstransporter"
  (2019): RailSys 3+10 / 4+8 tph; single-track 2+4; UIC 406 ≈100%; 2018 bridge freight 8,744/yr;
  prognosis 50 (2030) / 63 (2040) freight trains/day; Fehmarn 74/day 2035, 90% to SE/NO; HH −10%
  passengers; Malmö yard 835 m.
- [E3] Region Kalmar knowledge compilation of Trafikverket Fehmarn Bält documents (2025): 7+2 today,
  room for 5 more but land-side limits; border controls the current brake; Södra stambanan = biggest
  constraint; 2045: 8 reg + 2 LD + 1 freight; bridge ~90 slots/day; capacity shifts to Lund–Alvesta;
  Älmhult–Hässleholm saturates; Västkustbanan freight after full double track.
- [E4] Malmö stad / AFRY (2023): metro 8,000 pax/h/dir + 4 freight tph freed; 60,000 travellers/day
  2040; regional trains must double by 2035 without metro.
- [E5] Sweco, "Potential i befintlig Öresundsförbindelse" for Øresundsbro Konsortiet (2024-02-01):
  8 decided measures → 3× capacity by 2035–2040 (+200% Öresundståg travel, +300% freight); 4× by
  2050–2100 needs immersed freight tunnel Pepparholm–Kastrup (12–15 bn DKK), 4 tracks
  Kastrup–Kalvebod, and an OUTER FREIGHT TRACK OUTSIDE MALMÖ AND LUND (directly supports Alt B in
  our alternatives). Report: oresundsbron.com, "Studier och rapporter"
  (https://www.oresundsbron.com/sv/om-oresundsbron/statistik-och-rapporter/studier-och-rapporter);
  coverage: News Øresund 2024-03-07 (https://www.newsoresund.se/oresundsbron-kapacitet-2100/).
  Also cited by SOU 2026:17 "Öresundsförbindelser 2050", footnote 15.
- [E6] Regeringen.se 2026-03-02 / SOU 2026:17: bilateral investigation from 2027; capacity,
  redundancy, NATO/security framing.
- [E7] Riksdagen motion 2025/26:1045 (El-Haj): M5 alignment, Malmö stations in översiktsplan,
  ~2040 opening, ~72 bn SEK, CBA ~1.23.
- [E8] sv.wikipedia Öresundståg + Sydsvenskan 2023-05-27: System 3 study (single/combi/double;
  Stadler Dosto-like ~850 seats); Jan 2024 decision — 10 used DSB trains, System 3 postponed.
- [E9] Implenia project page: Citytunneln 17 km, 450 trains/day.
- [E10] Trafikverket Malmö C platforms: construction 2027–2029.
- [E11] Järnvägsnyheter/Transportnet (2025): new brake tables, 100–120 km/h freight, 850 m trains.
- [E12] Trafikverket/press: Helsingborg C–Maria double-tracking postponed (unprofitable);
  Varbergstunneln completed.
