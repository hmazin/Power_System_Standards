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
  formatCategoryPath,
  getCategoryKey,
  getCategoryPath
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
          familySeries === ALL || getStandardFamilySeries(standard) === familySeries
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
        formatCategoryPath(getCategoryPath(standard)),
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
        (familySeries === ALL ||
          getStandardFamilySeries(standard) === familySeries) &&
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
    standards.map((standard) => getCategoryKey(getCategoryPath(standard)))
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
              const categoryLabel = formatCategoryPath(getCategoryPath(standard));

              return (
                <article className="standard-row" key={standard.standard_id} role="row">
                  <div className="designation-cell" role="cell">
                    <Link href={`/standards/${encodeURIComponent(standard.standard_id)}`}>
                      {standard.designation}
                    </Link>
                    <span>{categoryLabel}</span>
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
    "IEEE 1547",
    "IEEE 2030",
    "IEEE 2800",
    "IEEE 3000",
    "IEEE 80/81/837"
  ];
  const values = Array.from(
    new Set(standards.map(getStandardFamilySeries).filter(Boolean))
  );

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
  return makeOptions(standards.map((standard) => getCategoryPath(standard)[0]));
}

function makeSubcategoryOptions(standards: StandardRecord[], selectedCategory: string) {
  const nodes = new Map<string, string[]>();

  if (selectedCategory === ALL) {
    return [{ value: ALL, label: ALL }];
  }

  standards.forEach((standard) => {
    const path = getCategoryPath(standard);

    if (path[0] !== selectedCategory) {
      return;
    }

    for (let depth = 2; depth <= path.length; depth += 1) {
      const nodePath = path.slice(0, depth);
      nodes.set(getCategoryKey(nodePath), nodePath);
    }
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
  const path = getCategoryPath(standard);

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
}

function hasOption(options: FilterOption[], value: string) {
  return options.some((option) => option.value === value);
}

function getStandardFamilySeries(standard: StandardRecord) {
  if (standard.publisher === "IEEE") {
    const designation = standard.designation.replace(
      /^(?:ANSI\/IEEE|IEEE\/ANSI|IEEE\/IEC|IEC\/IEEE|IEEE)\s+(?:Std\s+)?/i,
      ""
    );
    const cSeriesMatch = designation.match(/^C(57|37|62)\b/i);

    if (cSeriesMatch) {
      return `IEEE C${cSeriesMatch[1]}`;
    }

    if (/^1547(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 1547";
    }

    if (/^2030(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 2030";
    }

    if (/^2800(?:[a-z]|\.\d+|-|$)/i.test(designation)) {
      return "IEEE 2800";
    }

    if (/^300[0-7](?:\.\d+|-|$)/i.test(designation)) {
      return "IEEE 3000";
    }

    if (/^(?:80|81|837)(?:\.\d+|-|$)/i.test(designation)) {
      return "IEEE 80/81/837";
    }
  }

  return "";
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
