# Roadmap

## Phase 0 - Public Metadata Foundation

Goal: make the project safe, clear, and ready for public GitHub hosting.

Tasks:

- Define the public-only scope
- Create the seed CSV
- Draft the logical data model
- Draft the PostgreSQL schema
- Establish data contribution rules

## Phase 1 - Seed the Registry

Goal: collect the first useful body of standards metadata.

Initial target: 50 to 100 records.

Priority groups:

- NERC reliability and CIP standards
- WECC regional reliability standards and criteria
- BCUC British Columbia Mandatory Reliability Standards adoption/status records
- Ontario IESO market rules manuals and grid requirements
- Ontario Energy Board electricity codes and filing requirements
- ERCOT protocols guides and market rules
- CAISO tariff business practice manuals and operating procedures
- CSA Canadian Electrical Code and key C22.2 product standards
- NFPA NEC, 70E, 70B, 855, and related electrical/fire standards
- IEEE power families including C57, C37, C62, 1547, 2030, 2800, and 3000, followed by grounding, power quality, substations, and safety families outside those series
- UL standards for DER, BESS, PV, EV charging, and equipment certification
- NEMA equipment standards
- Province and state adoption records for CEC and NEC

## Phase 2 - Searchable Public App

Goal: create a public browsing experience.

Features:

- Search by designation, title, publisher, topic, or asset
- Filter by country, jurisdiction, category, applicability, and asset type
- Standard detail page with source links
- Topic landing pages
- CSV/JSON export
- Clear copyright and metadata-only notice

## Phase 3 - Applicability Assistant

Goal: help users narrow the list of likely applicable standards.

Features:

- Questionnaire for country, province/state, asset type, voltage, lifecycle phase, and project type
- Candidate standards list
- Confidence and source trail
- Warnings that final applicability depends on AHJ, utility, contract, and professional judgment

## Phase 4 - Editorial Workflow

Goal: make it easier to maintain sourced records.

Features:

- Admin-only editor
- Source review date tracking
- Change history
- Review queue
- Source checks
- Import from CSV
- Export review reports

## Phase 5 - Advanced Data

Goal: support deeper public research without publishing copyrighted content.

Possible additions:

- Standard relationship graph
- Adoption timeline by jurisdiction
- Topic maps for DER, BESS, substations, and arc flash
- Public API
- Automated reminders to re-check standards nearing revision cycles
