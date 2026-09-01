# Target Publisher Queue

Source review date: 2026-08-31.

## Started

- NERC - North American Electric Reliability Corporation: first official Reliability Standards ingestion added. Next pass should add jurisdiction-specific adoption pages and retired/historical records.
- WECC - Western Electricity Coordinating Council: first official regional standards, variances, criteria, and standards procedure ingestion added. Next pass should separate BC adoption records and link WECC records to related NERC standards.
- IEEE - Institute of Electrical and Electronics Engineers: C57, C37, C62, C63 electromagnetic compatibility/radio-noise measurements, C135 overhead line hardware, overhead transmission lines, transportation and traction power, communications/SCADA/IED cybersecurity, 1547, arc flash hazard analysis, 2030, 2800, 3000, reliability and availability, grounding and grounding connections, capacitors, reactive power compensation, heat tracing, cable systems/insulated conductors, substations, power quality/harmonics, nuclear power electrical equipment, electric generators/excitation systems, electric motors, and rotating-machine testing/diagnostics metadata ingestion started from official IEEE SA pages.

## Current Priority

1. IESO - Independent Electricity System Operator, empty CSV registered at `data/ieso_standards.csv`
2. OEB - Ontario Energy Board, empty CSV registered at `data/oeb_standards.csv`
3. ERCOT - Electric Reliability Council of Texas
4. CAISO - California ISO

## Later Targets

- FERC - Federal Energy Regulatory Commission
- PJM Interconnection
- MISO - Midcontinent Independent System Operator
- SPP - Southwest Power Pool
- ISO New England
- NYISO - New York ISO
- Alberta utilities: ATCO Electric FortisAlberta ENMAX EPCOR
- Other provincial utilities and regulators after the core reliability and market-rule sources are covered

## Selection Criteria

Prioritize sources that provide public metadata, official source pages, public direct files, and broad relevance to Canada and USA power-system work.
