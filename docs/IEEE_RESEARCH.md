# IEEE Standards Research

Source review date: 2026-08-30.

## Scope

This pass targets IEEE power-system standards that are especially relevant to utility engineering in Canada and the United States:

- C57 series - transformers, reactors, insulating liquids, bushings, and related transformer equipment
- C37 series - switchgear, circuit breakers, relays, reclosers, and protection equipment
- C62 series - surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection
- C95 family - human exposure limits, electromagnetic field measurement and computation, RF safety programs, and hazard communication
- C135 family - overhead line hardware, pole-line hardware, fasteners, fittings, and related line-construction hardware
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

The current dataset is built from public IEEE SA metadata pages discovered through the official IEEE standards sitemap. Rows are kept only when the IEEE SA page reports `Active Standard`.
IEEE 80-2013 and IEEE 835-1994 are included as narrow reference exceptions because they are foundational grounding and cable ampacity references, while the IEEE SA pages currently list them as `Inactive-Reserved Standard`.
IEEE 525-2025 is retained in the cable systems family as its primary category, but the webapp also surfaces it through the `IEEE Substations` family filter because its scope is substation cable systems. IEEE 1119-1988 is not included in the active public dataset because IEEE SA lists it as `Inactive-Withdrawn Standard`.

Current record counts:

- C57: 92
- C37: 106
- C62: 32
- C95: 6
- C135: 3
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
```

## Public File Links

Most IEEE standards are not distributed as public PDF files from the IEEE SA metadata pages. For that reason, `source_download_url` is normally blank for IEEE rows. The registry should add a direct download only when IEEE publishes a public direct file for that exact standard or public companion item.

## Next Review Ideas

- Compare the sitemap-derived active list against IEEE Xplore search results for the current IEEE target families.
- Add relationship fields later for amendments, corrigenda, and superseded editions.
- Add topical tags for transformers, protection, switchgear, surge protection, DER, substations, testing, insulation, and maintenance when the data model is expanded.
