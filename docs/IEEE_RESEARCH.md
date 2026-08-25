# IEEE Standards Research

Source review date: 2026-08-25.

## Scope

This pass targets IEEE power-system standards that are especially relevant to utility engineering in Canada and the United States:

- C57 series - transformers, reactors, insulating liquids, bushings, and related transformer equipment
- C37 series - switchgear, circuit breakers, relays, reclosers, and protection equipment
- C62 series - surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection

The current dataset is built from public IEEE SA metadata pages discovered through the official IEEE standards sitemap. Rows are kept only when the IEEE SA page reports `Active Standard`.

## Source Method

Primary source:

- IEEE standards sitemap index: `https://standards.ieee.org/wp-sitemap.xml`
- IEEE standard detail pages under `https://standards.ieee.org/ieee/...`

The refresh script is `scripts/update_ieee_catalog.mjs`. By default it rebuilds all three current target series:

```text
node scripts/update_ieee_catalog.mjs
```

Specific series can be refreshed during research:

```text
node scripts/update_ieee_catalog.mjs C57
node scripts/update_ieee_catalog.mjs C37
node scripts/update_ieee_catalog.mjs C62
```

## Public File Links

Most IEEE standards are not distributed as public PDF files from the IEEE SA metadata pages. For that reason, `source_download_url` is normally blank for IEEE rows. The registry should add a direct download only when IEEE publishes a public direct file for that exact standard or public companion item.

## Next Review Ideas

- Compare the sitemap-derived active list against IEEE Xplore search results for C57, C37, and C62.
- Add relationship fields later for amendments, corrigenda, and superseded editions.
- Add topical tags for transformers, protection, switchgear, surge protection, DER, substations, testing, insulation, and maintenance when the data model is expanded.
