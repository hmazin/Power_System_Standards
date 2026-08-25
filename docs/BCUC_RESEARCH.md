# BCUC Research Notes

Source review date: 2026-08-25.

## Source Boundary

The British Columbia Utilities Commission is the British Columbia adoption authority for Mandatory Reliability Standards. The first BCUC data pass tracks active British Columbia reliability adoption/status records from the WECC Approved BC Standards table.

These records are not BC Hydro engineering standards. BC Hydro assesses reliability standards and files reports with BCUC, but the standards are generally established by NERC or WECC and adopted for application in British Columbia by BCUC.

## Current Batch Added

The first BCUC data batch is generated with `scripts/update_bcuc_catalog.mjs`.

The generated data includes:

- Active or no-inactive-date British Columbia Mandatory Reliability Standards records
- BC-specific implementation plan records
- BC-specific errata records
- Direct public WECC PDF download links for every included row

The batch intentionally excludes inactive historical rows from the WECC Approved BC Standards table and skips one source note row that begins with "superseded by" because it is not a usable standard record.

Current generated counts:

- BCUC records: 179
- Adopted reliability standard records: 144
- Implementation plan records: 34
- Errata records: 1
- Direct public downloads: 179

## UI Category Tree

The app derives cleaner BCUC filter categories from the source `primary_category` labels. Publisher names are not repeated in category labels because publisher is already a separate filter. BCUC records are grouped as:

- Mandatory Reliability Standards / family
- Mandatory Reliability Standards / Implementation Plans
- Mandatory Reliability Standards / Errata / family

## Future BCUC Collection Passes

The next BCUC metadata passes should add or refine:

- Relationship links from BCUC adoption records to the matching NERC or WECC base standards already in the registry
- BCUC order numbers and adoption decision URLs where available
- Inactive/historical BC adoption records only after the app has a clear historical/status filter
- BC Mandatory Reliability Standards Rules of Procedure, Registration Manual, Compliance Monitoring Program, and Penalty Guidelines as separate governance records

## Official Source URLs

- https://www.wecc.org/program-areas/standards
- https://www.bchydro.com/energy-in-bc/operations/transmission/transmission-system/reliability.html
- https://www.ordersdecisions.bcuc.com/bcuc/orders/en/item/234282/index.do?iframe=true
- https://www.bclaws.gov.bc.ca/civix/document/id/consol23/consol23/00_96473_01
