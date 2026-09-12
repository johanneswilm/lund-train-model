# PROMPT — give this verbatim to the coding-focused AI

Build a single-file, browser-based interactive simulation (HTML + vanilla JS or React via CDN, no
backend, no build step; everything client-side; save as lund_rail_model.html) that answers the question:

    UNDER WHAT CIRCUMSTANCES DOES IT MAKE SENSE TO EXPAND THE RAILWAY THROUGH LUND, SWEDEN
    FROM 2 TO 4 TRACKS — COMPARED WITH (B) A NEW OUTER FREIGHT TRACK AROUND THE CITY, OR
    (C) A LONG-DISTANCE/HIGH-SPEED STATION OUTSIDE THE CITY CENTRE (SHINKANSEN-STYLE)?

## Context (verified facts; also in the attached fact sheet)
- Lund C, Sweden's 3rd busiest station (~40,000 pax/day, 6 platform tracks), is the junction of
  Västkustbanan (→Helsingborg→Gothenburg, 200 km/h) and Södra stambanan (→Hässleholm→Stockholm).
  South of Lund: 4 tracks to Malmö since Dec 2023 (design capacity 460→650 trains/day, station
  Klostergården). The remaining 2-track bottleneck is Klostergården–Lund C–Stångby (~6 km), with a
  sharp curve ("Armaturkurvan", assume 80 km/h, editable) just south of the station.
- Traffic: ~400 passenger + 60–70 freight trains/day today, forecast ~700–800/day after the Fehmarn
  Bält link (2029). Freight Malmö↔Stockholm must pass Lund C; freight Malmö↔Gothenburg uses the
  separate Godsstråket corridor (Kävlinge–Teckomatorp–Åstorp–Ängelholm).
- Design capacity of the 2-track section ~20–22 tph/direction, but practical mixed-traffic capacity
  is far lower (speed heterogeneity 200 km/h pax vs 90–120 km/h freight, Lund C dwells, junction
  conflicts at the flat crossing north of the station — one movement grade-separated since 2004).
- Government decision Oct 2023: two new tracks Klostergården–Hässleholm for 250 km/h mixed traffic,
  program frame 28 bn SEK (2021), target ~2040. Cost anchors (2020 pre-study): at-grade 4 tracks
  through Lund 5–7 bn; +outer freight track +3–4 bn; tunnel 18–22 bn (rejected). Alt C (250 km/h
  western bypass + outer station "Lund Västra") has no official estimate: default 10–15 bn, editable.
- KEY MODELLING NUANCE the UI must make explicit: because all trains already slow at the curve,
  4-tracking is a CAPACITY/ROBUSTNESS measure, not a speed measure. Speed requires realignment or
  Alt C. Show this trade-off directly.

## Model structure
1. **Topology** — a schematic canvas (SVG or canvas) of: Malmö C (south), 4-track section,
   Klostergården, 2-track curving section (Armaturkurvan), Lund C (6 platform tracks), the junction
   north of Lund C, and the two branches (Västkustbanan NW, Södra stambanan NE incl. Stångby, Eslöv),
   plus the Godsstråket freight corridor. Animate trains moving on it (play/pause, 1 s = 1 min
   default, adjustable).
2. **Traffic generator** — slider/table inputs for trains per hour per direction by type:
   regional, long-distance, freight; plus daily totals. Preset scenarios: 2026, 2035 (Fehmarn open),
   2045 (from fact sheet §6). Dwell times at Lund C per type (default 2.0 min regional, 1.5 LD,
   0 freight-through). Freight day-profile (concentrated at night, editable).
3. **Capacity engine** — per alternative, per direction: compute timetableable peak capacity using
   occupation time per train type = section length / effective speed + dwell + separation buffer;
   mixed-traffic heterogeneity penalty; junction conflict penalty at Lund C throat. Show
   utilization % and a "timetable feasibility" verdict (feasible / fragile / infeasible) with the
   binding constraint identified (curve speed, junction, dwell, headway).
4. **Timetable + delay simulation** — build a repeating hourly timetable (greedy slot assignment,
   fast trains first, freight in gaps), then run Monte Carlo with exponential primary delays
   (mean 0.5–2 min/train, editable); resolve conflicts first-come-first-served; output mean and
   95th-percentile secondary delay per type, and punctuality (≤5 min) — for each alternative.
5. **Speed/travel-time module** — effective speed per segment per alternative (2-track curve 80;
   4-track at grade 80 still at the curve — show this!; Alt C bypass 250 with outer stop;
   freight on Alt B chord at 100–120). Output door-to-door effect: Lund↔Stockholm, Lund↔Copenhagen,
   and centre↔outer-station penalty for Alt C (feeder 5 min + wait, Shinkansen-style).
6. **Cost-benefit module** — CAPEX sliders (defaults from fact sheet), 3.5% discount, 40-year
   horizon; benefits = passenger time savings × VoT (business/commute/leisure defaults 550/230/140
   SEK/h) + reliability value + freight operating cost/time + externalities toggles (noise, safety/
   dangerous goods in centre, CO2, barrier effects; Alt A enables decking/land value, default +2 bn
   optional). Output NPV, BCR, cost per saved delay-minute, and a ranking of A/B/C/A+B/A+C.
7. **Sensitivity** — one-at-a-time tornado chart on: peak tph, freight share, curve speed, CAPEX
   ±50%, demand growth, VoT. Identify break-even thresholds, e.g. "Alt A pays off when peak demand
   exceeds X tph/dir" — this is the headline answer to the user's question; present it as an
   explicit dashboard card.
8. **Comparison view** — side-by-side table + radar/parallel-coordinates chart of the alternatives
   on: peak capacity, robustness (p95 secondary delay), travel time, land take/demolitions, noise
   in centre, freight through centre, CO2, NPV, BCR.

## Alternatives (user-togglable; also allow combinations A+B and A+C)
- **A — 4 tracks at grade** through Klostergården–Lund C–Stångby (platforms extended; demolitions
  at the curve; curve speed unchanged). Segregation: user chooses pairing (fast/slow or pax/freight).
- **B — outer freight track**: chord Teckomatorp/Kävlinge→Stångby (~+10 km for Stockholm-bound
  freight); removes freight from Lund C; user sets chord length/speed/cost.
- **C — LD/HSR bypass + outer station "Lund Västra"**: 250 km/h double track west of the centre,
  LD/HSR stops only at the outer station, regional keeps Lund C; feeder 5 min. Optionally also allow
  "no-stop bypass" (LD trains skip Lund entirely — show the catchment loss).
- **D — tunnel (reference/rejected option, keep for completeness):** ~6 km tunnel tubes with an
  underground 6-track Lund C (Sweden's largest); fixes speed + capacity + barrier simultaneously and
  frees surface land for development (+0.5–2 bn land-value toggle); BUT default CAPEX 18–22 bn with a
  user-set overrun risk premium (calibrate: Hallandsås 1.25→10.8 bn, ~11×; Citybanan 16.8 bn/6 km),
  build time +5–10 yr (misses the Fehmarn-driven demand surge), higher embodied CO2, permanently
  higher O&M, freight restrictions in the tunnel (DG/freight banned by default per Swedish practice —
  freight must use Alt B or separate tubes: enforce D⇒B coupling in the model), station access penalty
  (+1–2 min vertical circulation), flood/fire closure days with NO corridor diversion (add a closure
  resilience KPI), settlement/heritage risk parameter (Klosterkyrkan). Less surface disruption during
  construction (trains keep running) — include as a construction-disruption toggle.
- **Do nothing** baseline.

## UX requirements
- Left panel: scenario presets + all parameter sliders (grouped: Traffic, Infrastructure, Costs,
  CBA). Every non-obvious default gets an info tooltip citing "fact" vs "assumption".
- Main area: animated schematic + KPI cards (utilization, p95 delay, punctuality, effective speed,
  NPV, BCR) + charts (delay distribution, capacity vs demand curve with the alternatives overlaid,
  tornado).
- A headline "ANSWER" card that states, for the current settings, which alternative wins and the
  threshold at which the ranking flips.
- Units: km, km/h, tph, min, SEK (bn). Language: English. Clean, minimal design; state clearly in
  an "About/Assumptions" panel that this is a strategic sketch model, not an engineering simulation,
   and list which parameters need verification from Trafikverket sources.
- Performance: Monte Carlo 200+ runs must complete in <3 s; no external API calls.

## Acceptance criteria
1. With 2026 defaults, 2 tracks must be feasible but fragile (utilization 60–80%, punctuality
   borderline) — matching reality.
2. With 2045 defaults, 2 tracks must be clearly infeasible; Alt A or A+B feasible; Alt C alone must
   NOT fix central capacity (only speed) — this asymmetry must be visible.
3. Raising the curve-speed parameter must NOT increase 2-track capacity much (longer sections help
   little on headway-bound track) — guards against the classic "slow anyway" misconception in both
   directions.
4. The dashboard must surface a numeric break-even: peak tph/dir at which each alternative's BCR
   crosses 1.0.
5. Everything in the About panel + tooltips; all inputs editable; state saved to localStorage.
