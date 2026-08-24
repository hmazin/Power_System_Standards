# AUC Research Notes

Source review date: 2026-08-24.

## Source Boundary

The Alberta Utilities Commission publishes public regulatory resources including:

- AUC rules
- Standard codes
- Settlement System Code Rules
- Acts and regulations
- Forms templates and reference documents

This first registry pass treats AUC-authored rules and named rule-code artifacts as database records. Provincial acts and regulations linked by AUC are source context for now because those documents are not authored by AUC.

## Current Batch Added

The first AUC data batch adds:

- AUC Rule 001 through AUC Rule 035 records

The AUC rules home page lists Rules 008 014 020 030 and 034 as no longer in effect. Those rule numbers are still included as historical metadata records so searches do not look like accidental gaps.

Rule 018 is also included as a historical rule. The AUC rules home page says Rule 018 was rescinded on April 1 2025 and only applies to proceedings registered before April 1 2025.

## UI Category Tree

The app derives cleaner AUC filter categories from the source `primary_category` labels. Publisher names are not repeated in category labels because publisher is already a separate filter. AUC records are grouped as:

- Rules / Proceedings and Participation
- Rules / Facility Applications and Operations
- Rules / Distributed Energy and Generation
- Rules / Service Quality and Reliability
- Rules / Retail and Settlement Codes
- Rules / Financial and Operational Reporting
- Rules / Rates Fees and Cost Recovery
- Rules / Compliance and Enforcement
- Rules / ISO and Reliability Standards Oversight
- Rules / Historical / Not in Effect

## Direct Public Download URLs

The AUC CSV includes `source_download_url` values where an official public AUC-hosted PDF is available for the exact rule record. Current rule records use the direct PDF linked from the individual AUC rule page. Historical rule records use public AUC-hosted PDF URLs where confirmed.

The registry intentionally excludes general AUC navigation records such as the AUC rules home page and the standard-codes landing page. The standard-codes page points users back to Rule 004, so the useful record is AUC Rule 004 rather than a separate blank collection record.

## Future AUC Collection Passes

The next AUC metadata passes should add or refine:

- Rule-specific forms templates and reporting spreadsheets where they are useful standalone records
- AUC Bulletins tied to rule changes where they help explain current applicability
- Acts and regulations as separate Government of Alberta records if the project scope expands to legal source instruments
- A repeatable scraper for AUC rule page refreshes

## Official Source URLs

- https://www.auc.ab.ca/rules/rules-home/
- https://www.auc.ab.ca/industry-reference/
- https://www.auc.ab.ca/standard-codes
- https://www.auc.ab.ca/acts-and-regulations/
