# Data Guidelines

This folder contains public metadata about electrical and power-system standards.

The app reads compatible CSV files in this folder. Keep the core columns from `standards_seed.csv`; source-specific optional columns such as `source_download_url` may be added when useful.

AESO rule records can be refreshed from the official public ISO Rules and REM ISO Rules pages with `scripts/update_aeso_rule_catalog.mjs`.

BC Hydro records can be refreshed from the official public source pages with `scripts/update_bc_hydro_catalog.ps1`.

AUC records are sourced from the official public AUC rules and regulatory reference pages.

NERC reliability standard records can be refreshed from the official public NERC Reliability Standards pages with `scripts/update_nerc_catalog.mjs`.

WECC regional standards, criteria, and standards procedure records can be refreshed from the official public WECC Standards page with `scripts/update_wecc_catalog.mjs`.

## What Is Allowed

Allowed data includes:

- Standard designation
- Standard title
- Publisher
- Latest known edition
- Applicability notes
- Public summary written in our own words
- Official source URL
- Official public direct download URL when available
- Topic and asset tags

## What Is Not Allowed

Do not add:

- Full text from standards
- Paid PDF files
- Private Drive links
- Local file system paths
- Large copied excerpts
- Tables, figures, annexes, clauses, or rule text from copyrighted standards

Short titles and factual metadata are fine. Applicability notes should be written in original language and should link back to official sources.

## Source Preference

Prefer sources in this order:

1. Official publisher page
2. Official regulator or authority having jurisdiction
3. Official standards development organization page
4. Authorized standards reseller page
5. Industry association page, only as supporting context

## Date Format

Use ISO dates:

```text
YYYY-MM-DD
```

Example:

```text
2026-08-23
```
