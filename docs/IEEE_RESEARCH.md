# IEEE Standards Research

Source review date: 2026-09-01.

## Scope

This pass targets IEEE power-system standards that are especially relevant to utility engineering in Canada and the United States:

- C57 series - transformers, reactors, insulating liquids, bushings, and related transformer equipment
- C37 series - switchgear, circuit breakers, relays, reclosers, and protection equipment
- C62 series - surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection
- C63 family - electromagnetic compatibility, radio-noise emissions measurements, EMI instrumentation, antenna calibration, test-site validation, RF immunity, ESD, wireless coexistence, and compliance testing
- C95 family - human exposure limits, electromagnetic field measurement and computation, RF safety programs, and hazard communication
- C135 family - overhead line hardware, pole-line hardware, fasteners, fittings, and related line-construction hardware
- Electrical safety codes family - National Electrical Safety Code requirements for electric supply stations, overhead and underground supply and communications lines, and related utility work rules
- Overhead transmission lines family - overhead transmission line design, conductors, line ratings, structures, insulation, field effects, grounding, construction, inspection, maintenance, and overhead utility fiber
- Transportation and traction power family - rail transit traction power, overhead contact systems, rail vehicle electrical equipment, communications-based train control, rail potential, stray-current mitigation, high-speed rail, and maglev vehicle systems
- Communications, SCADA, and IED cybersecurity family - power-system communications, SCADA protocols, substation network communication, DNP3 profiles, secure SCADA serial links, IED cybersecurity, communications facility protection, and electric-supply/telecommunications coordination
- 1547 series - distributed energy resource interconnection and conformance testing
- Arc flash hazard analysis family - IEEE 1584 arc-flash hazard calculations, study scoping, deliverables, and data collection
- 2030 series - smart grid interoperability, DERMS, microgrids, energy storage, and EV charging integration
- Batteries and DC systems family - stationary batteries, battery energy storage technologies, battery monitoring, chargers, ventilation, safety, and related DC power systems
- 2800 series - inverter-based resource interconnection with transmission and bulk power systems
- 3000 series - industrial and commercial power systems design, analysis, grounding, protection, standby power, maintenance, operations, and safety
- Reliability and availability family - power-system reliability planning, reliable industrial and commercial power systems, reliability indices, outage reporting, generating-unit availability and productivity, reliability data analysis, and HVDC converter station reliability
- Grounding and grounding connections family - AC substation grounding safety, grounding-system measurements, permanent substation grounding connections, and neutral grounding in electrical utility systems
- Capacitors family - shunt power capacitors, series capacitor banks, fixed-series capacitor banks, and shunt capacitor application
- Reactive power compensation family - static var compensators, STATCOM systems, electronic voltage fluctuation compensation devices, and related reactive power compensation equipment
- Heat tracing family - electrical resistance trace heating, explosive-atmosphere trace heating, skin effect trace heating, and impedance heating for pipelines, vessels, equipment, structures, and commercial applications
- Cable systems and insulated conductors family - power cable systems, insulated conductors, joints, terminations, accessories, field testing, installation, fire performance, and condition assessment
- Substations family - electric power substation design, construction, operation, safety, environmental compatibility, fire protection, physical security, oil containment, bus design, seismic design, HVDC converter stations, auxiliary systems, and lightning shielding
- Power quality and harmonics family - power quality monitoring, harmonics, harmonic filters, voltage quality, flicker, voltage sags, ride-through testing, nonsinusoidal power measurement, and transient overvoltage measurement
- Nuclear power electrical equipment family - Class 1E equipment, safety systems, nuclear facility electrical power systems, nuclear cables and splices, standby power supplies, safety-related motors, switchgear, relays, and controls
- Electric generators and excitation systems family - synchronous generators, hydro generators, turbine generators, generator-motors, excitation systems, standby generator units, generator monitoring, generator rewind, and hydroelectric commissioning
- Electric motors and motor applications family - induction motors, severe-duty process-industry motors, nuclear safety-related motors, motor auxiliary devices, and AC motor repair and rewinding
- Rotating machine testing, insulation, and diagnostics family - shared rotating-machine testing, insulation maintenance, insulation diagnostics, thermal evaluation, partial discharge measurement, permanent magnet machine testing, and DC electric machine maintenance

## Engineering Category Taxonomy

The app presents IEEE records through the finalized numbered engineering
taxonomy used by the organized library:

1. Power System Planning, Design, Studies, and Ratings
2. Power System Reliability, Availability, and Resilience
3. Power Generation and Nuclear Plant Electrical Systems
4. DER and Grid Interconnection
5. Batteries, Energy Storage, and DC Systems
6. Power Electronics, HVDC, and FACTS
7. Electric Machinery and Excitation Systems
8. Transformers, Regulators, and Reactors
9. Substations
10. Switchgear, Protection, and Relaying
11. Transmission and Distribution Lines
12. Cable Systems and Insulated Conductors
13. Grounding and Bonding
14. Insulation, Surge Protection, and High-Voltage Testing
15. Capacitors and Reactive Power Compensation
16. Power Quality
17. Power System Instrumentation, Measurement, and Metering
18. Communications, SCADA, IEDs, and Cybersecurity
19. Electrical Safety Codes and Work Practices
20. Industrial, Commercial, and Special Applications
21. Transportation and Traction Power
22. Electrical Documentation and Symbols
23. EMC, EMI, and EMF Safety
24. Software and Systems Engineering

IEEE records are not duplicated when they span disciplines. The source
`primary_category` remains the canonical family classification, while the app
derives one canonical engineering path and any justified secondary paths. This
supports cases such as IEEE 525 in both Cable Systems and Substations, IEEE 80
in both Grounding and Substations, IEEE C57.13 in both Transformers and Power
System Instrumentation, and IEEE 1584 in both Power System Studies and
Electrical Safety.

The current dataset is built from public IEEE SA metadata pages discovered through the official IEEE standards sitemap. It tracks the latest public standards metadata for the app, not the user's local Google Drive PDF archive. Rows are kept when the IEEE SA page reports `Active Standard`, plus the narrow latest-published reference exceptions documented below.
IEEE 80-2013 and IEEE 835-1994 are included as narrow reference exceptions because they are foundational grounding and cable ampacity references, while the IEEE SA pages currently list them as `Inactive-Reserved Standard`.
IEEE 525-2025 is retained in the cable systems family as its primary category, but the webapp also surfaces it through the `IEEE Substations` family filter because its scope is substation cable systems. IEEE 1119-1988 is not included in the active public dataset because IEEE SA lists it as `Inactive-Withdrawn Standard`.
IEEE 1409-2012 and IEEE 1564-2014 are included as power-quality reference exceptions because the IEEE SA pages currently list the published standards as `Inactive-Reserved Standard` while active PARs exist for replacement work.
Machine-family reference exceptions include IEEE 43-2013, IEEE 67-2005, IEEE 95-2002, IEEE C50.13-2014, IEEE 810-2015, IEEE 1068-2015, IEEE 1095-2012, IEEE 1129-2014, IEEE 117-2015, IEEE 1310-2012, IEEE 1434-2014, IEEE 1776-2008, IEEE 421.2-2014, IEEE 421.4-2014, IEEE 434-2006, and IEEE 492-1999 where the IEEE SA pages currently list the published standards as `Inactive-Reserved Standard` while active PARs, active companion standards, or current engineering practice keep the topics useful.
Communications/SCADA/IED cybersecurity reference exceptions include latest-published but inactive records for the IEEE 487 dot-series, IEEE 643, IEEE 999, IEEE 1379, IEEE 1613.1, IEEE 1646, IEEE 1815, and IEEE 1815.1 families. Older superseded Drive PDFs remain archive-only unless they are the latest known public IEEE SA metadata record for that family or subfamily.
IEEE 211-2018 is included in Communications, SCADA, IEDs, and Cybersecurity as the current active radio-wave propagation terminology standard. The archived IEEE 211-1997 PDF is superseded and remains Drive-only.
The Overhead Transmission Lines family excludes the IEEE C135 hardware series because C135 remains its own IEEE family in this registry.
The local Drive Heat Tracing archive currently includes IEEE 515-2004 and IEEE 515.1-2005 PDFs, but those editions are superseded; Git tracks the current IEEE SA Heat Tracing metadata instead.
The local Drive Transportation and Traction Power archive currently includes older or inactive editions such as IEEE 1629-2013 and IEEE 1653.1-2016; Git tracks the current active IEEE SA metadata for this family instead, including IEEE 1653.1-2026.
The Nuclear Power Electrical Equipment family collects current nuclear/Class 1E standards that would otherwise be split across switchgear, cables, motors, generators, heat tracing, and related equipment families. Lead-acid battery standards remain in Batteries and DC systems even when they are used in nuclear Class 1E applications.
The Reliability and Availability family collects cross-cutting power-system reliability records, including IEEE 493 Gold Book reliable industrial and commercial power systems, IEEE 3006 reliability recommended practices, IEEE 1366 distribution reliability indices, IEEE 762 generating-unit reliability/availability/productivity definitions, IEEE 859 transmission outage reporting terms, and IEEE 1240 HVDC converter-station reliability. IEEE 493-2007 and IEEE 1240-2000 are included as latest-published reference exceptions because IEEE SA lists them as inactive-reserved while active P493 and P1240 replacement work exists.
The local Drive C2 archive currently includes older IEEE C2-2007 PDFs; Git tracks the current IEEE C2-2023 metadata record from IEEE SA.
Superseded and inactive-withdrawn standards that exist only in the local Drive archive are intentionally excluded from the GitHub dataset unless a future data-model change adds historical-edition support.

Current record counts:

- C57: 92
- C37: 102
- C62: 28
- C63: 21
- C95: 6
- C135: 3
- Electrical safety codes: 1
- Overhead Transmission Lines: 42
- Transportation and traction power: 24
- Communications, SCADA, and IED cybersecurity: 27
- 1547: 6
- 1584: 3
- 2030: 17
- Batteries and DC systems: 24
- 2800: 2
- 3000: 17
- Reliability and availability: 9
- Grounding and grounding connections: 7
- Capacitors: 3
- Reactive power compensation: 2
- Heat tracing: 8
- Cable systems and insulated conductors: 30
- Substations: 16
- Power quality and harmonics: 12
- Nuclear power electrical equipment: 11
- Electric generators and excitation systems: 17
- Electric motors and motor applications: 5
- Rotating machine testing, insulation, and diagnostics: 20

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
node scripts/update_ieee_catalog.mjs C63
node scripts/update_ieee_catalog.mjs C95
node scripts/update_ieee_catalog.mjs C135
node scripts/update_ieee_catalog.mjs C2
node scripts/update_ieee_catalog.mjs OVERHEAD_TRANSMISSION_LINES
node scripts/update_ieee_catalog.mjs TRANSPORTATION_TRACTION_POWER
node scripts/update_ieee_catalog.mjs COMMUNICATIONS_SCADA_CYBERSECURITY
node scripts/update_ieee_catalog.mjs 1547
node scripts/update_ieee_catalog.mjs 1584
node scripts/update_ieee_catalog.mjs 2030
node scripts/update_ieee_catalog.mjs BATTERIES
node scripts/update_ieee_catalog.mjs 2800
node scripts/update_ieee_catalog.mjs 3000
node scripts/update_ieee_catalog.mjs RELIABILITY
node scripts/update_ieee_catalog.mjs GROUNDING
node scripts/update_ieee_catalog.mjs CAPACITORS
node scripts/update_ieee_catalog.mjs REACTIVE_COMPENSATION
node scripts/update_ieee_catalog.mjs HEAT_TRACING
node scripts/update_ieee_catalog.mjs CABLES
node scripts/update_ieee_catalog.mjs SUBSTATIONS
node scripts/update_ieee_catalog.mjs POWER_QUALITY
node scripts/update_ieee_catalog.mjs NUCLEAR_POWER_ELECTRICAL_EQUIPMENT
node scripts/update_ieee_catalog.mjs GENERATORS_AND_EXCITATION
node scripts/update_ieee_catalog.mjs ELECTRIC_MOTORS
node scripts/update_ieee_catalog.mjs ROTATING_MACHINE_TESTING
```

The legacy `ROTATING_MACHINES` argument expands to the three split machine families for convenience.

## Public File Links

Most IEEE standards are not distributed as public PDF files from the IEEE SA metadata pages. For that reason, `source_download_url` is normally blank for IEEE rows. The registry should add a direct download only when IEEE publishes a public direct file for that exact standard or public companion item.

## Next Review Ideas

- Compare the sitemap-derived active list against IEEE Xplore search results for the current IEEE target families.
- Add relationship fields later for amendments, corrigenda, and superseded editions.
- Add topical tags for transformers, protection, switchgear, surge protection, DER, substations, testing, insulation, and maintenance when the data model is expanded.
