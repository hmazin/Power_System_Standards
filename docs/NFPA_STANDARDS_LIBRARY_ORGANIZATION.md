# NFPA Standards Library Organization Procedure

Review date: 2026-09-02.

This procedure documents the recommended organization pattern for an NFPA standards library while keeping this repository public-safe. Do not store private Drive links, licensed PDFs, file checksums, or personal library inventory details in GitHub.

## Folder naming rule

Use one root-level folder per NFPA document number:

```text
NFPA [number] - [short subject description]
```

Examples:

```text
NFPA 10 - Portable Fire Extinguishers
NFPA 70 - National Electrical Code
NFPA 780 - Lightning Protection Systems
```

Do not use:

- Numeric sorting prefixes such as `0070 - NFPA 70`
- Administrative prefixes such as `01`, `02`, `03`
- Range folders such as `NFPA 1-99`
- Type-specific root folders such as `Codes`, `Standards`, or `Handbooks`

The root folder should identify the NFPA number and subject only. Editions and document types belong in the filenames inside that folder.

## File naming rule

Use the verified title page, cover, or document front matter before finalizing a filename:

```text
NFPA [number] - [edition year] - [document type][ - qualifier].pdf
```

Examples:

```text
NFPA 10 - 2018 - Standard.pdf
NFPA 70 - 2014 - Handbook.pdf
NFPA 58 - 2014 - Errata 1.pdf
NFPA 497 - 2012 - Recommended Practice.pdf
NFPA 78 - 2020 - Guide.pdf
```

Valid document-type labels include:

- Code
- Standard
- Handbook
- Guide
- Recommended Practice
- Errata
- Tentative Interim Amendment

Do not infer `Standard` from the NFPA number alone. Many NFPA publications are codes, handbooks, guides, recommended practices, errata, or amendments.

## Verification controls

Before treating a file as complete, confirm these fields from the PDF itself:

- NFPA number
- Edition year
- Document type
- Full title or clear subject
- Whether the file is a complete publication, handbook, errata, amendment, supplement, or duplicate copy

Use these status labels during review:

- `Verified` - title page or front matter confirms number, edition, and document type
- `Needs edition confirmation` - NFPA number is known, but edition year is not verified
- `Needs type confirmation` - edition may be known, but document type is not verified
- `Needs duplicate review` - same NFPA number and edition appear more than once
- `Needs identification` - number, edition, or subject cannot be confidently identified

## Folder-title catalog

Use concise subject labels so the root remains easy to scan:

| Folder name | Short subject label |
| --- | --- |
| NFPA 10 | Portable Fire Extinguishers |
| NFPA 11 | Low-, Medium-, and High-Expansion Foam |
| NFPA 12 | Carbon Dioxide Extinguishing Systems |
| NFPA 12A | Halon 1301 Fire Extinguishing Systems |
| NFPA 13 | Sprinkler Systems |
| NFPA 14 | Standpipe and Hose Systems |
| NFPA 16 | Foam-Water Sprinkler and Spray Systems |
| NFPA 20 | Stationary Fire Pumps |
| NFPA 24 | Private Fire Service Mains |
| NFPA 30 | Flammable and Combustible Liquids Code |
| NFPA 54 | National Fuel Gas Code |
| NFPA 58 | Liquefied Petroleum Gas Code |
| NFPA 59A | Liquefied Natural Gas Facilities |
| NFPA 68 | Explosion Protection by Deflagration Venting |
| NFPA 70 | National Electrical Code |
| NFPA 70E | Electrical Safety in the Workplace |
| NFPA 72 | Fire Alarm and Signaling Code |
| NFPA 75 | Information Technology Equipment Protection |
| NFPA 76 | Telecommunications Facilities Fire Protection |
| NFPA 78 | Electrical Inspections |
| NFPA 79 | Industrial Machinery Electrical Standard |
| NFPA 90A | Air-Conditioning and Ventilating Systems |
| NFPA 92 | Smoke Control Systems |
| NFPA 110 | Emergency and Standby Power Systems |
| NFPA 111 | Stored Electrical Energy Systems |
| NFPA 122 | Fire Prevention and Control in Metal/Nonmetal Mining |
| NFPA 130 | Fixed Guideway Transit and Passenger Rail Systems |
| NFPA 496 | Purged and Pressurized Enclosures |
| NFPA 497 | Flammable Liquids, Gases, Vapors and Classified Locations |
| NFPA 499 | Combustible Dusts and Classified Locations |
| NFPA 780 | Lightning Protection Systems |
| NFPA 820 | Wastewater Treatment and Collection Facilities |
| NFPA 850 | Electric Generating Plants and HVDC Stations |
| NFPA 851 | Hydroelectric Generating Plants |
| NFPA 2001 | Clean Agent Fire Extinguishing Systems |

## Next audit pass

The next pass should be a file-level audit, not another folder-structure pass. For each PDF, open the document and record only non-copyrighted metadata:

1. Confirm edition and document type from the PDF itself.
2. Rename files that are mislabeled.
3. Separate true duplicates from different document types, such as a standard and a handbook for the same NFPA number and edition.
4. Keep private Drive links and licensed file inventory outside this public repository.
