# Reference Files

This folder holds source/reference material used for future metadata reconciliation. These files are not loaded by the public application at runtime.

## IEEE_Standards.xls

User-supplied IEEE Xplore inventory workbook inspected on 2026-08-26.

The workbook appears to be an older IEEE Xplore metadata inventory rather than a current IEEE SA status source. It is useful for historical editions, OPAC links, publication numbers, ISBNs, and subject/category flags.

Observed IEEE family counts:

| Family | Rows in XLS | Distinct raw numbers | Exact published editions |
| --- | ---: | ---: | ---: |
| C57 | 405 | 238 | 144 |
| C37 | 596 | 360 | 181 |
| C62 | 134 | 79 | 51 |
| 1547 | 12 | 9 | 3 |
| 3000 | 5 | 3 | 1 |

Use this workbook as a reference for historical edition reconciliation and local Drive file naming. Do not import it wholesale into `data/ieee_standards.csv` without checking records against official IEEE SA pages.
