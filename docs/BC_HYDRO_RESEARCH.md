# BC Hydro Research Notes

Source review date: 2026-08-23.

## Source Boundary

BC Hydro publishes several public technical and tariff source areas that are relevant to power-system standards metadata:

- Distribution Technical Standards and Guides
- Distribution Generator Interconnections
- Transmission Generator Interconnections
- Open Access Transmission Tariff
- Electric Tariff
- System Operating Orders
- Transmission Capital Planning

The first data batch keeps the publisher as BC Hydro only where the public source is a BC Hydro standard requirement tariff procedure operating order guide or methodology. External reliability standards such as NERC TPL records should be linked as related records in a later pass rather than reclassified as BC Hydro standards.

## Current Coverage

The BC Hydro data set currently covers the public BC Hydro standards-related source pages listed below. The first pass added curated collection and major-document records. The complete source-page pass then used `scripts/update_bc_hydro_catalog.ps1` to extract and append the remaining public metadata records from those source pages.

- Collection records for distribution standards generator interconnections tariffs system operating orders and transmission planning
- Primary and secondary customer service requirements
- Revenue metering and accepted meter socket requirements
- ES43 overhead distribution standards
- ES53 underground electrical services
- ES54 underground civil standards
- ES55 power quality and customer equipment standards
- Class of Work Specifications
- Professional assurance forms and primary service statement forms
- BC Hydro distribution information bulletins listed from 2016 through 2026
- Distribution generator interconnection requirements
- Distribution generator interconnection application forms fact sheets study agreements and sample agreements
- Closed transition transfer application documents checklists sample drawings and requirements
- Closed transition transfer interconnection requirements
- Transmission generator interconnection and transmission facility requirements
- Transmission generator interconnection queue studies forms criteria and study process documents
- OATT SGIP and Attachment K records
- OATT terms conditions attachments schedules and tariff supplements
- Electric Tariff supplements listed on the BC Hydro Electric Tariff page
- Public transmission planning methodologies
- Public system operating orders

## Direct Public Download URLs

The BC Hydro CSV includes `source_download_url` values where an official public BC Hydro file URL is available for the exact record. Collection and standard-family landing page records intentionally keep this field blank when a single linked file would only represent one item inside the broader collection.

## Future BC Hydro Collection Passes

The next BC Hydro metadata passes should check whether any related BC Hydro pages outside the source boundary should also be treated as standards metadata:

- BC Hydro distribution planning and designated voltage area material
- Cross-links to BCUC approvals and adopted mandatory reliability standards
- Historical documents not currently linked from the public source pages
- Any private or internal BC Hydro standards are outside this public metadata project unless an official public source URL is available

## Official Source URLs

- https://app.bchydro.com/accounts-billing/electrical-connections/distribution-standards.html
- https://app.bchydro.com/accounts-billing/electrical-connections/distribution-generator-interconnections.html
- https://app.bchydro.com/accounts-billing/electrical-connections/transmission-generator-interconnections.html
- https://www.bchydro.com/toolbar/about/strategies-plans-regulatory/tariffs-terms-conditions/oatt.html
- https://www.bchydro.com/toolbar/about/strategies-plans-regulatory/tariffs-terms-conditions/electric-tariff.html
- https://www.bchydro.com/energy-in-bc/operations/transmission/transmission-system/system-operating-orders.html
- https://www.bchydro.com/energy-in-bc/operations/transmission/transmission-plan/transmission-capital-planning.html
