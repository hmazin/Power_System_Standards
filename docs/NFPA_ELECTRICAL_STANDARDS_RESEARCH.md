# NFPA Electrical Standards Research Notes

Review date: 2026-09-02.

This repository tracks public metadata only. It must not store private Drive links, licensed PDFs, file checksums, or personal library inventory details.

## Scope used for this pass

This pass identifies NFPA publications whose primary subject is one of the following:

- Electrical installation, safety, maintenance, or inspection
- Electrical equipment evaluation
- Hazardous classified locations for electrical installations
- Alarm, detection, warning, security, or signaling systems
- Lightning protection
- Emergency, standby, fuel-cell, or stored-energy power systems
- Electric generating plants and HVDC converter stations

General fire, building, fuel gas, mechanical, or life-safety codes are not included merely because they contain some electrical requirements. Jurisdiction-specific or language-specific variants such as `NFPA 70-CA` or `NFPA 70E-ES` should be tracked separately if the app later adds jurisdiction or translation records.

## Current data file

The NFPA electrical catalog is stored in:

```text
data/nfpa_electrical_standards.csv
```

The file includes current public metadata for these records:

| Designation | Latest known edition | Inclusion reason |
| --- | --- | --- |
| NFPA 70 | 2026 | National Electrical Code |
| NFPA 70B | 2026 | Electrical equipment maintenance |
| NFPA 70E | 2027 | Workplace electrical safety |
| NFPA 72 | 2025 | Fire alarm and signaling systems |
| NFPA 73 | 2026 | Electrical inspections for existing dwellings |
| NFPA 75 | 2024 | Fire protection for IT/electronic equipment spaces |
| NFPA 76 | 2024 | Fire protection for telecommunications facilities |
| NFPA 77 | 2024 | Static electricity |
| NFPA 78 | R2028 | Electrical inspections guide |
| NFPA 79 | 2024 | Industrial machinery electrical standard |
| NFPA 110 | 2025 | Emergency and standby power |
| NFPA 111 | 2025 | Stored electrical energy emergency and standby power |
| NFPA 496 | 2027 | Purged and pressurized electrical equipment enclosures |
| NFPA 497 | 2027 | Hazardous classified locations for electrical installations |
| NFPA 499 | 2027 | Combustible dust hazardous classified locations |
| NFPA 715 | 2026 | Fuel gas detection and warning equipment |
| NFPA 720 | 2015 | Legacy carbon monoxide detection and warning equipment |
| NFPA 731 | 2026 | Premises security systems |
| NFPA 780 | 2026 | Lightning protection systems |
| NFPA 790 | R2024 | Third-party field evaluation body competency |
| NFPA 791 | R2024 | Unlabeled electrical equipment evaluation |
| NFPA 850 | 2026 | Electric generating plants and HVDC converter stations |
| NFPA 851 | 2010 | Historical hydroelectric generating plant fire protection |
| NFPA 853 | 2025 | Stationary fuel cell power systems |
| NFPA 855 | 2026 | Stationary energy storage systems |
| NFPA 1078 | R2028 | Electrical inspector professional qualifications |

## Source notes

Latest-known edition metadata was checked against public NFPA LiNK/publication listings and NFPA standard-development pages where available. Some records use reaffirmation-style notation such as `R2024` or `R2028`; keep that notation when it appears in NFPA's public listing rather than forcing it into a normal edition year.

The next improvement should be a scripted NFPA refresh process, similar to the existing IEEE/NERC refresh scripts, so this file can be refreshed from public source pages instead of maintained manually.
