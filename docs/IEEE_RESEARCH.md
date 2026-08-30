# IEEE Standards Research

Source review date: 2026-08-30.

## Scope

This pass targets IEEE power-system standards that are especially relevant to utility engineering in Canada and the United States:

- C57 series - transformers, reactors, insulating liquids, bushings, and related transformer equipment
- C37 series - switchgear, circuit breakers, relays, reclosers, and protection equipment
- C62 series - surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection
- C95 family - human exposure limits, electromagnetic field measurement and computation, RF safety programs, and hazard communication
- C135 family - overhead line hardware, pole-line hardware, fasteners, fittings, and related line-construction hardware
- Overhead transmission lines family - overhead transmission line design, conductors, line ratings, structures, insulation, field effects, grounding, construction, inspection, maintenance, and overhead utility fiber
- 1547 series - distributed energy resource interconnection and conformance testing
- 1584 family - arc-flash hazard calculations, study scoping, deliverables, and data collection
- 2030 series - smart grid interoperability, DERMS, microgrids, energy storage, and EV charging integration
- Batteries and DC systems family - stationary batteries, battery energy storage technologies, battery monitoring, chargers, ventilation, safety, and related DC power systems
- 2800 series - inverter-based resource interconnection with transmission and bulk power systems
- 3000 series - industrial and commercial power systems design, analysis, grounding, protection, reliability, maintenance, operations, and safety
- 80/81/837 grounding family - AC substation grounding safety, grounding-system measurements, and permanent substation grounding connections
- 18/824/1036 capacitor and reactive compensation family - shunt power capacitors, series capacitor banks, and shunt capacitor application
- Cable systems and insulated conductors family - power cable systems, insulated conductors, joints, terminations, accessories, field testing, installation, fire performance, and condition assessment
- Substations family - electric power substation design, construction, operation, safety, environmental compatibility, fire protection, physical security, oil containment, bus design, seismic design, HVDC converter stations, auxiliary systems, and lightning shielding
- Power quality and harmonics family - power quality monitoring, harmonics, harmonic filters, voltage quality, flicker, voltage sags, ride-through testing, nonsinusoidal power measurement, and transient overvoltage measurement
- Electric machinery and rotating machines family - generators, motors, synchronous machines, induction machines, excitation systems, rotating-machine testing, insulation diagnostics, commissioning, and repair

The current dataset is built from public IEEE SA metadata pages discovered through the official IEEE standards sitemap. It tracks the latest public standards metadata for the app, not the user's local Google Drive PDF archive. Rows are kept when the IEEE SA page reports `Active Standard`, plus the narrow latest-published reference exceptions documented below.
IEEE 80-2013 and IEEE 835-1994 are included as narrow reference exceptions because they are foundational grounding and cable ampacity references, while the IEEE SA pages currently list them as `Inactive-Reserved Standard`.
IEEE 525-2025 is retained in the cable systems family as its primary category, but the webapp also surfaces it through the `IEEE Substations` family filter because its scope is substation cable systems. IEEE 1119-1988 is not included in the active public dataset because IEEE SA lists it as `Inactive-Withdrawn Standard`.
IEEE 1409-2012 and IEEE 1564-2014 are included as power-quality reference exceptions because the IEEE SA pages currently list the published standards as `Inactive-Reserved Standard` while active PARs exist for replacement work.
Electric-machinery reference exceptions include IEEE 43-2013, IEEE 67-2005, IEEE 95-2002, IEEE C50.13-2014, IEEE 810-2015, IEEE 1068-2015, IEEE 1095-2012, IEEE 1129-2014, IEEE 117-2015, IEEE 1310-2012, IEEE 1434-2014, IEEE 1776-2008, IEEE 421.2-2014, IEEE 421.4-2014, IEEE 434-2006, and IEEE 492-1999 where the IEEE SA pages currently list the published standards as `Inactive-Reserved Standard` while active PARs, active companion standards, or current engineering practice keep the topics useful.
The Overhead Transmission Lines family excludes the IEEE C135 hardware series because C135 remains its own IEEE family in this registry.
Superseded and inactive-withdrawn standards that exist only in the local Drive archive are intentionally excluded from the GitHub dataset unless a future data-model change adds historical-edition support.

Current record counts:

- C57: 92
- C37: 106
- C62: 32
- C95: 6
- C135: 3
- Overhead Transmission Lines: 42
- 1547: 6
- 1584: 3
- 2030: 17
- Batteries and DC systems: 24
- 2800: 2
- 3000: 21
- 80/81/837 grounding: 3
- 18/824/1036 capacitors and reactive compensation: 3
- Cable systems and insulated conductors: 34
- Substations: 16
- Power quality and harmonics: 12
- Electric machinery and rotating machines: 45

## Source Method

Primary source:

- IEEE standards sitemap index: `https://standards.ieee.org/wp-sitemap.xml`
- IEEE standard detail pages under `https://standards.ieee.org/ieee/...`

The refresh script is `scripts/update_ieee_catalog.mjs`. By default it rebuilds all current target families and series:

```text
node scripts/update_ieee_catalog.mjs
```

Specific families or series can be refreshed during research:

```text
node scripts/update_ieee_catalog.mjs C57
node scripts/update_ieee_catalog.mjs C37
node scripts/update_ieee_catalog.mjs C62
node scripts/update_ieee_catalog.mjs C95
node scripts/update_ieee_catalog.mjs C135
node scripts/update_ieee_catalog.mjs OVERHEAD_TRANSMISSION_LINES
node scripts/update_ieee_catalog.mjs 1547
node scripts/update_ieee_catalog.mjs 1584
node scripts/update_ieee_catalog.mjs 2030
node scripts/update_ieee_catalog.mjs BATTERIES
node scripts/update_ieee_catalog.mjs 2800
node scripts/update_ieee_catalog.mjs 3000
node scripts/update_ieee_catalog.mjs GROUNDING
node scripts/update_ieee_catalog.mjs CAPACITORS
node scripts/update_ieee_catalog.mjs CABLES
node scripts/update_ieee_catalog.mjs SUBSTATIONS
node scripts/update_ieee_catalog.mjs POWER_QUALITY
node scripts/update_ieee_catalog.mjs ROTATING_MACHINES
```

## Public File Links

Most IEEE standards are not distributed as public PDF files from the IEEE SA metadata pages. For that reason, `source_download_url` is normally blank for IEEE rows. The registry should add a direct download only when IEEE publishes a public direct file for that exact standard or public companion item.

## Next Review Ideas

- Compare the sitemap-derived active list against IEEE Xplore search results for the current IEEE target families.
- Add relationship fields later for amendments, corrigenda, and superseded editions.
- Add topical tags for transformers, protection, switchgear, surge protection, DER, substations, testing, insulation, and maintenance when the data model is expanded.
