# Data Guidelines

This folder contains public metadata about electrical and power-system standards.

The app reads compatible CSV files in this folder. Keep each CSV on the same schema as `standards_seed.csv`.

## What Is Allowed

Allowed data includes:

- Standard designation
- Standard title
- Publisher
- Latest known edition
- Status
- Public summary written in our own words
- Official source URL
- Jurisdiction applicability notes
- Topic and asset tags
- Verification date

## What Is Not Allowed

Do not add:

- Full text from standards
- Paid PDF files
- Private Drive links
- Large copied excerpts
- Tables, figures, annexes, clauses, or rule text from copyrighted standards

Short titles and factual metadata are fine. Applicability notes should be written in original language and should link back to official sources.

## Record Status Values

Use these values in the `verification_status` field:

- `verified` - checked against an official or authoritative source
- `candidate` - plausible record, not fully verified
- `needs_review` - record exists but needs editorial or source review
- `retired` - known retired or superseded standard

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
