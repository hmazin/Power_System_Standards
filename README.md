# Power Standards Metadata Registry

A public, metadata-only registry for electrical and power-system standards used in Canada and the United States.

This project is focused on identifying which standards exist, who publishes them, where they apply, how they relate to power-system assets, and where official source information can be found.

## Purpose

The goal is to build a searchable public reference for engineers, designers, asset owners, students, and reviewers who need to understand which electrical standards may apply to a power-system project.

The registry should answer questions like:

- Which standards are relevant to a substation, DER interconnection, BESS project, or electrical installation?
- Which standards are Canadian, U.S., North American, or international references?
- Is a standard a code, product standard, workplace safety standard, reliability standard, or engineering guide?
- Is it mandatory by jurisdiction, adopted by an authority having jurisdiction, or a voluntary/reference standard?
- Where is the official publisher page or regulatory source?

## Public-Safe Scope

This repository stores public metadata only:

- Standard designation and title
- Publisher
- Edition and status metadata
- Jurisdiction and applicability notes
- Topic and asset tags
- Official source links
- Verification dates
- Relationship notes between standards

This repository must not store:

- Full copyrighted standards text
- Licensed standard PDFs
- Tables, figures, clauses, or extracts copied from paid standards
- Private Google Drive links or personal document-library metadata

## Initial Geographic Scope

- Canada
- United States
- North American reliability standards where they apply across Canadian and U.S. jurisdictions

## Initial Standards Scope

The first version should prioritize:

- Canadian Electrical Code and provincial adoption metadata
- National Electrical Code and state adoption metadata
- Utility/public safety standards
- NERC reliability and cybersecurity standards
- Workplace electrical safety standards
- DER, solar, BESS, EV charging, and microgrid standards
- Substation, grounding, protection, and equipment standards
- UL, CSA, IEEE, NFPA, NEMA, ANSI, and related standards used in power systems

## Suggested Application Direction

For a public app, the recommended path is:

- Next.js frontend hosted on Vercel
- PostgreSQL database for structured metadata
- GitHub public repository for source, schema, and seed data
- Read-only public browsing/search
- Admin/editor workflow added later

For the earliest prototype, a CSV or JSON seed dataset is enough. The database schema in `database/schema.sql` can be used when the project moves to PostgreSQL.

## Data Files

- `data/standards_seed.csv` - starter metadata records
- `data/README.md` - data rules and contribution notes
- `docs/DATA_MODEL.md` - logical data model
- `docs/ROADMAP.md` - phased project roadmap
- `docs/NFPA_STANDARDS_LIBRARY_ORGANIZATION.md` - public-safe NFPA library organization procedure
- `database/schema.sql` - draft PostgreSQL schema

## Verification Rule

Every record should include an official or authoritative source URL and a `date_verified` value. If a record is not fully verified, mark it as `candidate` or `needs_review`.

## Project A Only

This repository is dedicated only to the public standards metadata application. Any private standards PDF library should remain a separate personal project.
