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
import { useMemo, useState } from "react";
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
  const [category, setCategory] = useState(ALL);
  const [directDownload, setDirectDownload] = useState(ALL);

  const filters = useMemo(
    () => ({
      countries: makeOptions(standards.map((standard) => standard.country_scope)),
      publishers: makeOptions(standards.map((standard) => standard.publisher)),
      categories: makeCategoryOptions(standards),
      directDownloads: makeOptions(DIRECT_DOWNLOAD_FILTERS)
    }),
    [standards]
  );

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
        matchesCategory(standard, category) &&
        (directDownload === ALL ||
          (directDownload === DIRECT_DOWNLOAD_AVAILABLE && hasDirectDownload) ||
          (directDownload === DIRECT_DOWNLOAD_MISSING && !hasDirectDownload))
      );
    });
  }, [category, country, directDownload, publisher, query, standards]);

  const publisherCount = new Set(standards.map((standard) => standard.publisher)).size;
  const categoryCount = new Set(
    standards.map((standard) => getCategoryKey(getCategoryPath(standard)))
  ).size;

  function resetFilters() {
    setQuery("");
    setCountry(ALL);
    setPublisher(ALL);
    setCategory(ALL);
    setDirectDownload(ALL);
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

          <FilterSelect label="Country Scope" value={country} values={filters.countries} onChange={setCountry} />
          <FilterSelect label="Publisher" value={publisher} values={filters.publishers} onChange={setPublisher} />
          <FilterSelect label="Category" value={category} values={filters.categories} onChange={setCategory} />
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
                      onClick={() => setPublisher(standard.publisher)}
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
    ...Array.from(new Set(values))
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }))
  ];
}

function makeCategoryOptions(standards: StandardRecord[]) {
  const nodes = new Map<string, string[]>();

  standards.forEach((standard) => {
    const path = getCategoryPath(standard);

    for (let depth = 1; depth <= path.length; depth += 1) {
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
        label: formatCategoryPath(path)
      }))
  ];
}

function matchesCategory(standard: StandardRecord, selectedCategory: string) {
  if (selectedCategory === ALL) {
    return true;
  }

  const categoryKey = getCategoryKey(getCategoryPath(standard));
  return (
    categoryKey === selectedCategory ||
    categoryKey.startsWith(`${selectedCategory}${CATEGORY_PATH_DELIMITER}`)
  );
}

function FilterSelect({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
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
