# AESO Research Notes

Source review date: 2026-08-23.

## Source Boundary

AESO groups its public regulatory material under Rules, Standards and Tariff. The core source families are:

- ISO Rules
- REM ISO Rules
- Alberta Reliability Standards
- Compliance Monitoring
- Consolidated Authoritative Document Glossary
- Information Documents

AESO also publishes public technical and connection requirement material outside the Rules, Standards and Tariff section. Those records are included when AESO provides a public source page and public direct download URL.

## Authoritative Documents

AESO identifies Authoritative Documents as ISO Rules, Alberta Reliability Standards, and the ISO tariff. This registry tracks ISO Rules and Alberta Reliability Standards for AESO; AESO tariff records are out of scope for the current standards registry.

## Non-Authoritative Guidance

AESO Information Documents provide guidance related to Authoritative Documents. AESO states that Information Documents are not authoritative and do not contain requirements that AESO or market participants must comply with. In a conflict, the Authoritative Document governs.

For that reason, the registry classifies individual Information Documents as `information_document` records and does not classify them as authoritative standards.

## UI Category Tree

The app derives a tree-style category path from `primary_category` values instead of storing extra CSV columns. Publisher names are not repeated in category labels because publisher is already a separate filter. AESO records are grouped as:

- ISO Rules / Current ISO Rules / Part ...
- ISO Rules / REM ISO Rules / Part ...
- Alberta Reliability Standards / family
- Information Documents / ISO Rules and Alberta Reliability Standards
- Technical Guidance / Connection Requirements or Modelling
- Reference / Glossary

## Current Batch Added

The first AESO data batch tracks document-level and family-level records:

- AESO ISO Rules collection
- AESO REM ISO Rules collection
- AESO Alberta Reliability Standards collection
- AESO Consolidated Authoritative Document Glossary
- Current and no-current individual Alberta Reliability Standards listed by AESO
- Current individual ISO Rules listed by AESO
- Individually accessible REM ISO Rules listed by AESO
- Current individual Information Documents for ISO Rules and Alberta Reliability Standards listed by AESO
- AESO Connection Requirements for Inverter-Based Resources
- AESO Transformer Modelling Guide

## Direct Public Download URLs

The AESO CSV includes `source_download_url` values where an official public AESO PDF or direct download URL is available. These links are public publisher-hosted URLs only. Local downloader paths and private file locations are intentionally excluded from this public metadata project.

The AESO Connection Requirements for Inverter-Based Resources record uses the public AESO Reliability Requirements Roadmap page as its official source and the AESO-hosted PDF as its direct download URL.

The AESO Transformer Modelling Guide record uses the public AESO-hosted PDF URL directly because no current AESO landing page was found during source review. The PDF cover labels the document Confidential/Internal, so this public registry stores metadata and the publisher-hosted link only.

The AESO ISO Rule, REM ISO Rule, Information Document, and individual Alberta Reliability Standard rows can be refreshed from the official public AESO pages with `scripts/update_aeso_rule_catalog.mjs`.

The individual Alberta Reliability Standards pass intentionally includes AESO-listed entries that do not expose a "Download current" link. Those rows keep the official AESO detail URL and leave `source_download_url` empty so the app can filter ARS records with and without direct public PDF links.

The registry intentionally excludes general navigation records such as the AESO Rules and Standards portal and the Information Documents landing page. It also excludes ISO Rule 208.1 because AESO's public page states that the document was re-designated to Section 306.3 of the ISO rules; the active Section 306.3 row is tracked separately with its direct public PDF URL.

## Future AESO Collection Passes

The next AESO metadata passes should add:

- Future-effective REM ISO Rule sections that are in the approved REM package but not yet individually exposed by AESO
- Future-effective Alberta Reliability Standards from AESO Engage consultations
- Non-applicable ARS records as separate applicability records
- Alberta Utilities Commission approval decision links where available

## Official Source URLs

- https://www.aeso.ca/rules-standards-and-tariff/
- https://www.aeso.ca/rules-standards-and-tariff/iso-rules/
- https://www.aeso.ca/rules-standards-and-tariff/rem-iso-rules/
- https://www.aeso.ca/rules-standards-and-tariff/alberta-reliability-standards/
- https://www.aeso.ca/rules-standards-and-tariff/consolidated-authoritative-document-glossary/
- https://www.aeso.ca/rules-standards-and-tariff/information-documents/
- https://www.aeso.ca/future-of-electricity/reliability-requirements-roadmap/
- https://www.aeso.ca/grid/connecting-to-the-grid/connection-process-templates/
- https://www.aeso.ca/assets/linkfiles/4040.002-Rev02-Transformer-Modelling-Guide.pdf
