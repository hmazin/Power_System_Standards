# NERC Research Notes

Source review date: 2026-08-24.

## Source Boundary

NERC publishes public reliability standards material under its Reliability Standards page. This first pass covers:

- Reliability Standards collection
- Standards by family: BAL CIP COM EOP FAC INT IRO MOD NUC PER PRC TOP TPL VAR
- Current and future-enforcement individual reliability standard records exposed by the official family pages
- NERC glossary collection record
- NERC One Stop Shop workbook
- Combined VRF VSL Matrix workbook
- US Effective Date Status - Functional Applicability workbook

This pass does not add retired or inactive historical standards. Jurisdiction-specific adoption pages are also left for a later pass because Canadian provincial adoption is handled by separate authorities such as AESO or provincial regulators.

The registry uses NERC family names as filter categories. It does not emit family landing pages such as BAL CIP or PRC as standalone records because those pages are navigation aids rather than individual standards.

## Current Batch Added

The first NERC data batch is generated with `scripts/update_nerc_catalog.mjs`.

The script reads NERC's embedded public page model from:

- https://www.nerc.com/standards/reliability-standards
- Each official NERC reliability standards family page
- Each official NERC reliability standard detail page

The generated data includes individual standard number title family effective date page URL direct standard document URL when provided and concise original summary text. It also keeps the complete NERC Reliability Standards set because NERC provides a public complete-set PDF.

## Direct Public Download URLs

The NERC CSV includes `source_download_url` values where an official public NERC-hosted PDF or workbook is available for the exact record. Family records intentionally keep this field blank because each family contains multiple standards.

## Future NERC Collection Passes

The next NERC metadata passes should add or refine:

- Jurisdiction-specific adoption pages for the United States and Canadian provinces
- Inactive and retired standards as historical records
- Implementation plans audit worksheets compliance guidance and project pages as related support records
- NERC reliability standards under development
- Regional standards and variances that should be owned by WECC or other regional entities

## Official Source URLs

- https://www.nerc.com/standards/reliability-standards
- https://www.nerc.com/glossary-of-terms
