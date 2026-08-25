# WECC Approved BC Standards Audit

Source review date: 2026-08-25.

## Source Checked

- https://www.wecc.org/program-areas/standards
- Section: Approved BC Standards

## Comparison Result

The WECC Approved BC Standards section is a British Columbia reliability standard adoption/status table. It is not part of the BC Hydro engineering, tariff, interconnection, or operating-order source set currently stored in `data/bc_hydro_standards.csv`.

Audit counts from `scripts/audit_wecc_bc_against_bchydro.mjs`:

- WECC Approved BC Standards rows: 386
- Rows with an extracted reliability designation: 377
- Current BC Hydro rows checked: 279
- Matches in BC Hydro by designation or normalized title: 0
- Active or no-inactive-date WECC BC rows: 180
- Active or no-inactive-date WECC BC rows missing from BC Hydro: 180

## Interpretation

The result does not indicate a gap in the BC Hydro standards collection. It indicates a separate missing collection: BC-specific mandatory reliability standard adoption/status records.

These records should not be stored as publisher `BC Hydro`. They are tracked separately as BCUC records in `data/bcuc_standards.csv`, with the WECC table as the public source. A later pass should add relationship links to NERC or WECC reliability-standard records where those generic records already exist.

## Recommended Database Treatment

- Add active/no-inactive-date BC adoption records first.
- Keep inactive historical BC adoption records out of the default dataset unless the app gains a clear historical/status filter.
- Store effective and inactive dates in metadata fields when the database schema is expanded beyond the current CSV columns.
- Keep direct public WECC document/PDF links where WECC exposes them.
