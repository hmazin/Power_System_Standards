# AESO Research Notes

Source review date: 2026-08-23.

## Source Boundary

AESO groups its public regulatory material under Rules, Standards and Tariff. The core source families are:

- ISO Rules
- REM ISO Rules
- Alberta Reliability Standards
- ISO Tariff
- Compliance Monitoring
- Consolidated Authoritative Document Glossary
- Information Documents

AESO also publishes public technical and connection requirement material outside the Rules, Standards and Tariff section. Those records are included when AESO provides a public source page and public direct download URL.

## Authoritative Documents

AESO identifies Authoritative Documents as ISO Rules, Alberta Reliability Standards, and the ISO tariff. These are the primary records to track as binding Alberta power-system requirements.

## Non-Authoritative Guidance

AESO Information Documents provide guidance related to Authoritative Documents. AESO states that Information Documents are not authoritative and do not contain requirements that AESO or market participants must comply with. In a conflict, the Authoritative Document governs.

For that reason, the registry includes a collection-level record for AESO Information Documents but does not classify individual Information Documents as standards.

## Current Batch Added

The first AESO data batch adds:

- AESO Rules, Standards and Tariff portal
- AESO ISO Rules collection
- AESO REM ISO Rules collection
- AESO Alberta Reliability Standards collection
- AESO ISO Tariff collection
- AESO Consolidated Authoritative Document Glossary
- AESO Information Documents collection
- Current individual Alberta Reliability Standards listed by AESO
- Current individual ISO Rules listed by AESO
- Individually accessible REM ISO Rules listed by AESO
- AESO Connection Requirements for Inverter-Based Resources
- AESO Transformer Modelling Guide

## Direct Public Download URLs

The AESO CSV includes `source_download_url` values where an official public AESO PDF or direct download URL is available. These links are public publisher-hosted URLs only. Local downloader paths and private file locations are intentionally excluded from this public metadata project.

The AESO Connection Requirements for Inverter-Based Resources record uses the public AESO Reliability Requirements Roadmap page as its official source and the AESO-hosted PDF as its direct download URL.

The AESO Transformer Modelling Guide record uses the public AESO-hosted PDF URL directly because no current AESO landing page was found during source review. The PDF cover labels the document Confidential/Internal, so this public registry stores metadata and the publisher-hosted link only.

The AESO rule rows can be refreshed from the official public ISO Rules and REM ISO Rules pages with `scripts/update_aeso_rule_catalog.mjs`.

## Future AESO Collection Passes

The next AESO metadata passes should add:

- Individual ISO Tariff rates, riders, terms and appendices
- Future-effective REM ISO Rule sections that are in the approved REM package but not yet individually exposed by AESO
- Future-effective Alberta Reliability Standards from AESO Engage consultations
- Retired and non-applicable ARS records as separate historical applicability records
- Alberta Utilities Commission approval decision links where available

## Official Source URLs

- https://www.aeso.ca/rules-standards-and-tariff/
- https://www.aeso.ca/rules-standards-and-tariff/iso-rules/
- https://www.aeso.ca/rules-standards-and-tariff/rem-iso-rules/
- https://www.aeso.ca/rules-standards-and-tariff/alberta-reliability-standards/
- https://www.aeso.ca/rules-standards-and-tariff/tariff/
- https://www.aeso.ca/rules-standards-and-tariff/consolidated-authoritative-document-glossary/
- https://www.aeso.ca/rules-standards-and-tariff/information-documents/
- https://www.aeso.ca/future-of-electricity/reliability-requirements-roadmap/
- https://www.aeso.ca/grid/connecting-to-the-grid/connection-process-templates/
- https://www.aeso.ca/assets/linkfiles/4040.002-Rev02-Transformer-Modelling-Guide.pdf
