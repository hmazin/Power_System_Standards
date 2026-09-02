"use client";

import Link from "next/link";
import {
  Database,
  ExternalLink,
  FileDown,
  FileSearch,
  ListFilter,
  RotateCcw,
  Search
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_PATH_DELIMITER,
  IEEE_ENGINEERING_CATEGORIES,
  formatCategoryPath,
  getCategoryKey,
  getCategoryPaths
} from "@/lib/category-taxonomy";
import type { StandardRecord } from "@/lib/standards";

type StandardsExplorerProps = {
  standards: StandardRecord[];
};

const ALL = "All";
const DIRECT_DOWNLOAD_AVAILABLE = "Direct download available";
const DIRECT_DOWNLOAD_MISSING = "Direct download missing";
const DIRECT_DOWNLOAD_FILTERS = [
  ALL,
  DIRECT_DOWNLOAD_AVAILABLE,
  DIRECT_DOWNLOAD_MISSING
];
const IEEE_CAPACITOR_STANDARD_NUMBERS = [
  "18",
  "824",
  "1036",
  "1726"
];
const IEEE_REACTIVE_COMPENSATION_STANDARD_NUMBERS = [
  "1031",
  "1052",
  "1303",
  "1585",
  "1623"
];
const IEEE_HEAT_TRACING_STANDARD_NUMBERS = [
  "515",
  "515.1",
  "62395-1",
  "62395-2",
  "60079-30-1",
  "60079-30-2",
  "844",
  "844.1",
  "844.2",
  "844.3",
  "844.4"
];
const IEEE_CABLE_STANDARD_NUMBERS = [
  "48",
  "82",
  "383",
  "386",
  "400",
  "400.1",
  "400.2",
  "400.3",
  "400.4",
  "400.5",
  "404",
  "525",
  "532",
  "575",
  "592",
  "634",
  "690",
  "835",
  "1142",
  "1186",
  "1202",
  "1210",
  "1234",
  "1235",
  "1242",
  "1406",
  "1407",
  "1493",
  "1511",
  "1511.1",
  "1511.2",
  "1617",
  "1637",
  "1682",
  "1717",
  "1718",
  "1816",
  "2780",
  "2789",
  "3150"
];
const IEEE_BATTERY_STANDARD_NUMBERS = [
  "450",
  "484",
  "485",
  "937",
  "946",
  "1013",
  "1106",
  "1115",
  "1184",
  "1187",
  "1188",
  "1189",
  "1375",
  "1491",
  "1561",
  "1562",
  "1578",
  "1635",
  "1657",
  "1660",
  "1661",
  "1679",
  "1679.1",
  "1679.2",
  "1679.3",
  "1881",
  "2405",
  "2686",
  "2962",
  "2993"
];
const IEEE_SUBSTATION_STANDARD_NUMBERS = [
  "525",
  "605",
  "693",
  "979",
  "980",
  "998",
  "1127",
  "1246",
  "1264",
  "1267",
  "1268",
  "1378",
  "1402",
  "1427",
  "1527",
  "1818",
  "C37.121",
  "C37.122",
  "C37.122.2",
  "C37.122.3",
  "C37.122.7",
  "C37.122.8",
  "C37.123"
];
const IEEE_POWER_QUALITY_STANDARD_NUMBERS = [
  "519",
  "1159",
  "1159.3",
  "1250",
  "1409",
  "1453",
  "1459",
  "1531",
  "1564",
  "1668",
  "2426",
  "2938"
];
const IEEE_GENERATOR_AND_EXCITATION_STANDARD_NUMBERS = [
  "C50.12",
  "C50.13",
  "387",
  "67",
  "115",
  "421.1",
  "421.2",
  "421.3",
  "421.4",
  "421.5",
  "421.6",
  "492",
  "810",
  "1095",
  "1129",
  "1248",
  "1553",
  "1665",
  "2420",
  "63332-387"
];
const IEEE_ELECTRIC_MOTOR_STANDARD_NUMBERS = [
  "252",
  "303",
  "334",
  "841",
  "841.1",
  "1068"
];
const IEEE_ROTATING_MACHINE_TESTING_STANDARD_NUMBERS = [
  "43",
  "56",
  "62.2",
  "95",
  "112",
  "117",
  "286",
  "433",
  "434",
  "522",
  "620",
  "1310",
  "1349",
  "1434",
  "1776",
  "1799",
  "1812",
  "2455",
  "2465"
];
const IEEE_OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS = [
  "430",
  "516",
  "524",
  "539",
  "644",
  "656",
  "738",
  "987",
  "1048",
  "1138",
  "1222",
  "1227",
  "1542",
  "1591.1",
  "1591.2",
  "1591.3",
  "1591.4",
  "1594",
  "1595",
  "1808",
  "1829",
  "1863",
  "1897",
  "1936.2",
  "1936.3",
  "2445",
  "2655",
  "2683",
  "2746",
  "2797",
  "2819",
  "2821",
  "2828",
  "2833",
  "2954",
  "3133",
  "3134",
  "3336"
];
const IEEE_TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS = [
  "16",
  "1474.1",
  "1474.2",
  "1474.3",
  "1474.4",
  "1627",
  "1628",
  "1629",
  "1630",
  "1653.1",
  "1653.2",
  "1653.3",
  "1653.4",
  "1653.5",
  "1653.6",
  "1791",
  "1833",
  "1896",
  "2720",
  "2753",
  "2839",
  "2853",
  "2950",
  "2956",
  "3143",
  "3175",
  "3351",
  "3352"
];

type FilterOption = {
  value: string;
  label: string;
};

export function StandardsExplorer({ standards }: StandardsExplorerProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(ALL);
  const [publisher, setPublisher] = useState(ALL);
  const [familySeries, setFamilySeries] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [subcategory, setSubcategory] = useState(ALL);
  const [directDownload, setDirectDownload] = useState(ALL);

  const baseOptionStandards = useMemo(
    () =>
      standards.filter(
        (standard) =>
          (country === ALL || standard.country_scope === country) &&
          (publisher === ALL || standard.publisher === publisher)
      ),
    [country, publisher, standards]
  );

  const optionStandards = useMemo(
    () =>
      baseOptionStandards.filter(
        (standard) =>
          matchesFamilySeries(standard, familySeries)
      ),
    [baseOptionStandards, familySeries]
  );

  const filters = useMemo(
    () => ({
      countries: makeOptions(standards.map((standard) => standard.country_scope)),
      publishers: makeOptions(standards.map((standard) => standard.publisher)),
      familySeries: makeFamilySeriesOptions(baseOptionStandards),
      categories: makeTopCategoryOptions(optionStandards),
      subcategories: makeSubcategoryOptions(optionStandards, category),
      directDownloads: makeOptions(DIRECT_DOWNLOAD_FILTERS)
    }),
    [baseOptionStandards, category, optionStandards, standards]
  );

  useEffect(() => {
    if (!hasOption(filters.familySeries, familySeries)) {
      setFamilySeries(ALL);
    }
  }, [familySeries, filters.familySeries]);

  useEffect(() => {
    if (!hasOption(filters.categories, category)) {
      setCategory(ALL);
      setSubcategory(ALL);
    }
  }, [category, filters.categories]);

  useEffect(() => {
    if (category === ALL && subcategory !== ALL) {
      setSubcategory(ALL);
      return;
    }

    if (!hasOption(filters.subcategories, subcategory)) {
      setSubcategory(ALL);
    }
  }, [category, filters.subcategories, subcategory]);

  const filteredStandards = useMemo(() => {
    const search = query.trim().toLowerCase();

    return standards.filter((standard) => {
      const searchable = [
        standard.standard_id,
        standard.designation,
        standard.title,
        standard.publisher,
        standard.primary_category,
        getCategoryPaths(standard).map(formatCategoryPath).join(" "),
        standard.country_scope,
        standard.latest_known_edition,
        standard.applicability,
        standard.summary,
        standard.notes
      ]
        .join(" ")
        .toLowerCase();
      const hasDirectDownload = Boolean(standard.source_download_url?.trim());

      return (
        (!search || searchable.includes(search)) &&
        (country === ALL || standard.country_scope === country) &&
        (publisher === ALL || standard.publisher === publisher) &&
        matchesFamilySeries(standard, familySeries) &&
        matchesCategory(standard, category, subcategory) &&
        (directDownload === ALL ||
          (directDownload === DIRECT_DOWNLOAD_AVAILABLE && hasDirectDownload) ||
          (directDownload === DIRECT_DOWNLOAD_MISSING && !hasDirectDownload))
      );
    });
  }, [
    category,
    country,
    directDownload,
    familySeries,
    publisher,
    query,
    standards,
    subcategory
  ]);

  const publisherCount = new Set(standards.map((standard) => standard.publisher)).size;
  const categoryCount = new Set(
    standards.flatMap((standard) =>
      getCategoryPaths(standard).map((path) => getCategoryKey(path))
    )
  ).size;

  function resetFilters() {
    setQuery("");
    setCountry(ALL);
    setPublisher(ALL);
    setFamilySeries(ALL);
    setCategory(ALL);
    setSubcategory(ALL);
    setDirectDownload(ALL);
  }

  function updateCountry(nextCountry: string) {
    setCountry(nextCountry);
    setCategory(ALL);
    setSubcategory(ALL);
  }

  function updatePublisher(nextPublisher: string) {
    setPublisher(nextPublisher);
    setCategory(ALL);
    setSubcategory(ALL);
  }

  function updateFamilySeries(nextFamilySeries: string) {
    setFamilySeries(nextFamilySeries);
    setCategory(ALL);
    setSubcategory(ALL);
  }

  function updateCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSubcategory(ALL);
  }

  return (
    <main className="app-shell">
      <header className="registry-header">
        <div className="identity-block">
          <div className="identity-mark" aria-hidden="true">
            <Database size={26} />
          </div>
          <div>
            <p className="eyebrow">Canada and USA</p>
            <h1>Power System Standards Registry</h1>
          </div>
        </div>
        <div className="header-meta">
          <StatCard label="Records" value={standards.length.toString()} />
          <StatCard label="Publishers" value={publisherCount.toString()} />
          <StatCard label="Categories" value={categoryCount.toString()} />
        </div>
      </header>

      <section className="workbench" aria-label="Standards registry">
        <aside className="filters-panel">
          <div className="panel-title">
            <ListFilter aria-hidden="true" size={18} />
            <h2>Filters</h2>
          </div>

          <FilterSelect label="Country Scope" value={country} values={filters.countries} onChange={updateCountry} />
          <FilterSelect label="Publisher" value={publisher} values={filters.publishers} onChange={updatePublisher} />
          <FilterSelect
            label="Family / Series"
            value={familySeries}
            values={filters.familySeries}
            onChange={updateFamilySeries}
          />
          <FilterSelect label="Category" value={category} values={filters.categories} onChange={updateCategory} />
          <FilterSelect
            disabled={category === ALL || filters.subcategories.length <= 1}
            label="Subcategory"
            value={subcategory}
            values={filters.subcategories}
            onChange={setSubcategory}
          />
          <FilterSelect
            label="Direct Download"
            value={directDownload}
            values={filters.directDownloads}
            onChange={setDirectDownload}
          />

          <button className="reset-button" type="button" onClick={resetFilters}>
            <RotateCcw aria-hidden="true" size={16} />
            Reset
          </button>

        </aside>

        <section className="results-panel">
          <div className="search-row">
            <label className="search-box">
              <Search aria-hidden="true" size={19} />
              <span className="sr-only">Search standards</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search designation, title, publisher, topic..."
              />
            </label>
            <div className="result-count">
              <FileSearch aria-hidden="true" size={18} />
              <span>{filteredStandards.length} shown</span>
            </div>
          </div>

          <div className="standards-table" role="table" aria-label="Standards metadata">
            <div className="table-header" role="row">
              <span role="columnheader">Designation</span>
              <span role="columnheader">Standard</span>
              <span role="columnheader">Publisher</span>
              <span role="columnheader">Edition</span>
              <span role="columnheader">Scope</span>
              <span role="columnheader">Links</span>
            </div>

            {filteredStandards.map((standard) => {
              const categoryPaths = getCategoryPaths(standard);
              const categoryLabel = formatCategoryPath(categoryPaths[0]);
              const additionalCategoryCount = categoryPaths.length - 1;

              return (
                <article className="standard-row" key={standard.standard_id} role="row">
                  <div className="designation-cell" role="cell">
                    <Link href={`/standards/${encodeURIComponent(standard.standard_id)}`}>
                      {standard.designation}
                    </Link>
                    <span>
                      {categoryLabel}
                      {additionalCategoryCount > 0
                        ? ` +${additionalCategoryCount} more`
                        : ""}
                    </span>
                  </div>
                  <div className="title-cell" role="cell">
                    <strong>{standard.title}</strong>
                    <p>{standard.summary}</p>
                  </div>
                  <div className="publisher-cell" role="cell">
                    <button
                      aria-label={`Filter by publisher ${standard.publisher}`}
                      aria-pressed={publisher === standard.publisher}
                      className="publisher-filter-button"
                      onClick={() => updatePublisher(standard.publisher)}
                      type="button"
                    >
                      {standard.publisher}
                    </button>
                  </div>
                  <span role="cell">{standard.latest_known_edition}</span>
                  <span role="cell">{standard.country_scope}</span>
                  <div className="action-cell" role="cell">
                    <Link className="row-action" href={`/standards/${encodeURIComponent(standard.standard_id)}`}>
                      Details
                    </Link>
                    {standard.source_download_url ? (
                      <a
                        className="download-icon"
                        href={standard.source_download_url}
                        rel="noreferrer"
                        target="_blank"
                        aria-label={`${standard.designation} direct public download`}
                        title="Direct public download"
                      >
                        <FileDown aria-hidden="true" size={17} />
                      </a>
                    ) : null}
                    <a
                      className="source-icon"
                      href={standard.official_url}
                      rel="noreferrer"
                      target="_blank"
                      aria-label={`${standard.designation} official source`}
                      title="Official source"
                    >
                      <ExternalLink aria-hidden="true" size={17} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredStandards.length === 0 ? (
            <div className="empty-state">
              <FileSearch aria-hidden="true" size={28} />
              <strong>No matching standards</strong>
              <span>Adjust the search or filters.</span>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function makeOptions(values: string[]) {
  return [
    { value: ALL, label: ALL },
    ...Array.from(new Set(values.filter(Boolean).filter((value) => value !== ALL)))
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }))
  ];
}

function makeFamilySeriesOptions(standards: StandardRecord[]) {
  const preferredOrder = [
    "IEEE C57",
    "IEEE C37",
    "IEEE C62",
    "IEEE C63",
    "IEEE C135",
    "IEEE Overhead Transmission Lines",
    "IEEE Transportation and Traction Power",
    "IEEE 1547",
    "IEEE 1584",
    "IEEE 2030",
    "IEEE Batteries and DC Systems",
    "IEEE 2800",
    "IEEE 3000",
    "IEEE Grounding",
    "IEEE Capacitors",
    "IEEE Reactive Power Compensation",
    "IEEE Electric Generators and Excitation Systems",
    "IEEE Electric Motors and Motor Applications",
    "IEEE Rotating Machine Testing",
    "IEEE Power Quality and Harmonics",
    "IEEE Cable Systems",
    "IEEE Substations"
  ];
  const valueSet = new Set(standards.map(getStandardFamilySeries).filter(Boolean));

  if (standards.some(isIeeeSubstationStandard)) {
    valueSet.add("IEEE Substations");
  }

  const values = Array.from(valueSet);

  return [
    { value: ALL, label: ALL },
    ...values
      .sort((a, b) => {
        const orderA = preferredOrder.indexOf(a);
        const orderB = preferredOrder.indexOf(b);

        if (orderA >= 0 || orderB >= 0) {
          return (orderA >= 0 ? orderA : Number.MAX_SAFE_INTEGER) -
            (orderB >= 0 ? orderB : Number.MAX_SAFE_INTEGER);
        }

        return a.localeCompare(b);
      })
      .map((value) => ({ value, label: value }))
  ];
}

function makeTopCategoryOptions(standards: StandardRecord[]) {
  return makeOptions(
    [
      ...IEEE_ENGINEERING_CATEGORIES,
      ...standards.flatMap((standard) =>
        getCategoryPaths(standard).map((path) => path[0])
      )
    ]
  );
}

function makeSubcategoryOptions(standards: StandardRecord[], selectedCategory: string) {
  const nodes = new Map<string, string[]>();

  if (selectedCategory === ALL) {
    return [{ value: ALL, label: ALL }];
  }

  standards.forEach((standard) => {
    getCategoryPaths(standard).forEach((path) => {
      if (path[0] !== selectedCategory) {
        return;
      }

      for (let depth = 2; depth <= path.length; depth += 1) {
        const nodePath = path.slice(0, depth);
        nodes.set(getCategoryKey(nodePath), nodePath);
      }
    });
  });

  return [
    { value: ALL, label: ALL },
    ...Array.from(nodes.entries())
      .sort(([, pathA], [, pathB]) =>
        formatCategoryPath(pathA).localeCompare(formatCategoryPath(pathB))
      )
      .map(([value, path]) => ({
        value,
        label: formatCategoryPath(path.slice(1))
      }))
  ];
}

function matchesCategory(
  standard: StandardRecord,
  selectedCategory: string,
  selectedSubcategory: string
) {
  return getCategoryPaths(standard).some((path) => {
    if (selectedCategory !== ALL && path[0] !== selectedCategory) {
      return false;
    }

    if (selectedSubcategory === ALL) {
      return true;
    }

    const categoryKey = getCategoryKey(path);
    return (
      categoryKey === selectedSubcategory ||
      categoryKey.startsWith(`${selectedSubcategory}${CATEGORY_PATH_DELIMITER}`)
    );
  });
}

function hasOption(options: FilterOption[], value: string) {
  return options.some((option) => option.value === value);
}

function matchesFamilySeries(standard: StandardRecord, selectedFamilySeries: string) {
  if (selectedFamilySeries === ALL) {
    return true;
  }

  if (selectedFamilySeries === "IEEE Substations") {
    return isIeeeSubstationStandard(standard);
  }

  return getStandardFamilySeries(standard) === selectedFamilySeries;
}

function getStandardFamilySeries(standard: StandardRecord) {
  if (standard.publisher === "IEEE") {
    const designation = standard.designation.replace(
      /^(?:IEEE\/ANSI\/USEMCSC|ANSI\/IEEE|IEEE\/ANSI|ANSI\/USEMCSC|IEEE\/IEC|IEC\/IEEE|IEEE\/CSA|CSA\/IEEE|IEEE\/NACE|NACE\/IEEE|IEEE\/AMPP|AMPP\/IEEE|IEEE|ANSI)\s+(?:Std\s+)?/i,
      ""
    );
    if (isIeeeGroundingStandard(designation)) {
      return "IEEE Grounding";
    }

    const cSeriesMatch = designation.match(/^C(57|37|62|63|135)\b/i);

    if (cSeriesMatch) {
      return `IEEE C${cSeriesMatch[1]}`;
    }

    if (/^1547(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 1547";
    }

    if (/^1584(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 1584";
    }

    if (/^2030(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 2030";
    }

    if (isIeeeBatteryStandard(designation)) {
      return "IEEE Batteries and DC Systems";
    }

    if (/^2800(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 2800";
    }

    if (/^300[0-7](?:\.\d+|-|$)/i.test(designation)) {
      return "IEEE 3000";
    }

    if (isIeeeOverheadTransmissionLineStandard(designation)) {
      return "IEEE Overhead Transmission Lines";
    }

    if (isIeeeTransportationTractionPowerStandard(designation)) {
      return "IEEE Transportation and Traction Power";
    }

    if (isIeeeGeneratorAndExcitationStandard(designation)) {
      return "IEEE Electric Generators and Excitation Systems";
    }

    if (isIeeeElectricMotorStandard(designation)) {
      return "IEEE Electric Motors and Motor Applications";
    }

    if (isIeeeRotatingMachineTestingStandard(designation)) {
      return "IEEE Rotating Machine Testing";
    }

    if (isIeeePowerQualityStandard(designation)) {
      return "IEEE Power Quality and Harmonics";
    }

    if (isIeeeCapacitorStandard(designation)) {
      return "IEEE Capacitors";
    }

    if (isIeeeReactiveCompensationStandard(designation)) {
      return "IEEE Reactive Power Compensation";
    }

    if (isIeeeHeatTracingStandard(designation)) {
      return "IEEE Heat Tracing";
    }

    if (isIeeeCableStandard(designation)) {
      return "IEEE Cable Systems";
    }
  }

  return "";
}

function isIeeeGroundingStandard(designation: string) {
  return /^(?:80|81|837)(?:\.\d+|-|$)/i.test(designation) ||
    /^C62\.92(?:\.|-|$)/i.test(designation);
}

function isIeeeCableStandard(designation: string) {
  return IEEE_CABLE_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeCapacitorStandard(designation: string) {
  return IEEE_CAPACITOR_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeReactiveCompensationStandard(designation: string) {
  return IEEE_REACTIVE_COMPENSATION_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeHeatTracingStandard(designation: string) {
  return IEEE_HEAT_TRACING_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeBatteryStandard(designation: string) {
  return IEEE_BATTERY_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeSubstationStandard(standard: StandardRecord) {
  if (standard.publisher !== "IEEE") {
    return false;
  }

  const designation = standard.designation.replace(
    /^(?:IEEE\/ANSI\/USEMCSC|ANSI\/IEEE|IEEE\/ANSI|ANSI\/USEMCSC|IEEE\/IEC|IEC\/IEEE|IEEE\/CSA|CSA\/IEEE|IEEE\/NACE|NACE\/IEEE|IEEE\/AMPP|AMPP\/IEEE|IEEE|ANSI)\s+(?:Std\s+)?/i,
    ""
  );

  return IEEE_SUBSTATION_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeePowerQualityStandard(designation: string) {
  return IEEE_POWER_QUALITY_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeTransportationTractionPowerStandard(designation: string) {
  return IEEE_TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeGeneratorAndExcitationStandard(designation: string) {
  return IEEE_GENERATOR_AND_EXCITATION_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeElectricMotorStandard(designation: string) {
  return IEEE_ELECTRIC_MOTOR_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeRotatingMachineTestingStandard(designation: string) {
  return IEEE_ROTATING_MACHINE_TESTING_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function isIeeeOverheadTransmissionLineStandard(designation: string) {
  return IEEE_OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS.some((standardNumber) =>
    new RegExp(
      `^${escapeRegExp(standardNumber)}(?:[a-z]|-|/|$)`,
      "i"
    ).test(designation)
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function FilterSelect({
  label,
  value,
  values,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  values: FilterOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-control">
      <span>{label}</span>
      <select
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
