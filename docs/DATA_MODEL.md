# Data Model

This project should model standards as public metadata records, then connect those records to editions, topics, assets, jurisdictions, adoption status, and source evidence.

## Core Concepts

## Standard

A standard is the stable identity of a publication or family.

Examples:

- `CSA C22.1`
- `NFPA 70`
- `IEEE 1547`
- `UL 1741`
- `NERC Reliability Standards`

Suggested fields:

- `id`
- `designation`
- `title`
- `publisher_id`
- `record_type`
- `country_scope`
- `primary_category`
- `status`
- `summary`
- `official_url`
- `created_at`
- `updated_at`

## Edition

An edition is a version of a standard.

Examples:

- `CSA C22.1:24`
- `NFPA 70-2026`
- `IEEE 1547-2018`

Suggested fields:

- `id`
- `standard_id`
- `edition_label`
- `publication_year`
- `published_date`
- `status`
- `supersedes_edition_id`
- `official_url`
- `date_verified`

## Publisher

The organization that publishes or maintains the standard.

Examples:

- CSA Group
- NFPA
- IEEE
- NERC
- UL Standards and Engagement
- NEMA

Suggested fields:

- `id`
- `name`
- `website_url`
- `country`
- `notes`

## Jurisdiction

A legal or regulatory territory where adoption or applicability may differ.

Examples:

- Canada
- Ontario
- British Columbia
- United States
- Washington
- Texas

Suggested fields:

- `id`
- `name`
- `country`
- `jurisdiction_type`
- `parent_jurisdiction_id`
- `authority_notes`

## Adoption

Tracks whether a standard or edition is adopted, referenced, mandatory, voluntary, or not applicable in a jurisdiction.

Suggested fields:

- `id`
- `standard_id`
- `edition_id`
- `jurisdiction_id`
- `adoption_status`
- `effective_date`
- `end_date`
- `authority_name`
- `authority_url`
- `amendment_notes`
- `date_verified`

Suggested `adoption_status` values:

- `model_code`
- `adopted`
- `adopted_with_amendments`
- `referenced`
- `mandatory`
- `voluntary`
- `not_adopted`
- `unknown`

## Topic

Subject-matter tags.

Examples:

- Electrical installation
- Substations
- Grounding
- Protection and control
- DER interconnection
- Solar PV
- BESS
- EV charging
- Arc flash
- Cybersecurity

## Asset Type

Power-system assets or project contexts.

Examples:

- Building electrical system
- Utility substation
- Transmission line
- Distribution feeder
- DER facility
- Battery energy storage system
- EV charging site
- Industrial facility
- Control center

## Source

Evidence used to verify a record.

Suggested fields:

- `id`
- `standard_id`
- `edition_id`
- `source_type`
- `source_title`
- `source_url`
- `publisher_or_authority`
- `date_accessed`
- `notes`

Suggested `source_type` values:

- `publisher`
- `regulator`
- `standards_store`
- `authority_having_jurisdiction`
- `industry_association`
- `supporting_reference`

## Relationship

Connects standards to related standards.

Examples:

- `UL 1741` supports equipment certification related to `IEEE 1547`
- `CSA Z462` is related to workplace electrical safety and harmonized with Canadian electrical code context
- `NFPA 70E` is related to workplace electrical safety and NEC installation context

Suggested fields:

- `id`
- `source_standard_id`
- `target_standard_id`
- `relationship_type`
- `notes`

Suggested `relationship_type` values:

- `references`
- `is_referenced_by`
- `harmonized_with`
- `certification_for`
- `testing_for`
- `adoption_of`
- `supersedes`
- `related`

## Public Metadata Boundary

The database may include factual metadata and original summaries. It must not include copyrighted standard content beyond short titles, designations, and factual bibliographic details.
