# WECC Research Notes

Source review date: 2026-08-24.

## Source Boundary

WECC publishes public standards material under its Standards page. This first pass covers WECC-owned records from:

- Approved Regional Standards, Variances, and Interpretations
- Approved Regional Criteria
- Selected Policies And Procedures that govern WECC standards development or table revision

This pass intentionally excludes the NERC Standards and AESO Standards outbound links because those are covered by their own publishers in this registry. It also excludes the BC Standards and MX Standards lists on the WECC page because those are jurisdiction-specific adoption records and should be handled in later adoption-status passes.

## Current Batch Added

The first WECC data batch is generated with `scripts/update_wecc_catalog.mjs`.

The generated data includes:

- WECC regional reliability standards
- WECC regional variances
- WECC regional criteria
- WECC criteria and standards support documents
- WECC standards development and table revision procedures

Older WECC-listed versions that have a newer WECC-listed version are included as `historical_regional_standard` records rather than current standards.

## UI Category Tree

The app derives cleaner WECC filter categories from the source `primary_category` labels. Publisher names are not repeated in category labels because publisher is already a separate filter. WECC records are grouped as:

- Regional Reliability Standards / Standards / family
- Regional Reliability Standards / Regional Variances / family
- Regional Reliability Standards / Historical / Superseded
- Regional Reliability Standards / Support Documents
- Regional Criteria / family
- Regional Criteria / Support Documents
- Standards Procedures

## Direct Public Download URLs

The WECC CSV includes `source_download_url` values where WECC exposes an official public PDF, Excel workbook, or document download URL for the exact record.

## Future WECC Collection Passes

The next WECC metadata passes should add or refine:

- British Columbia adoption records from the WECC Approved BC Standards section, likely as BC jurisdiction records rather than WECC-owned standards
- Relationship links between WECC regional standards and the related NERC records already in the registry
- WECC standards under development and recently completed standards projects
- WECC compliance and registration guidance only where documents are useful standalone public records

## Official Source URLs

- https://www.wecc.org/program-areas/standards
- https://www.wecc.org/about/about-wecc
