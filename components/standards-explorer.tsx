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
import type { StandardRecord } from "@/lib/standards";

type StandardsExplorerProps = {
  standards: StandardRecord[];
};

const ALL = "All";

export function StandardsExplorer({ standards }: StandardsExplorerProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(ALL);
  const [publisher, setPublisher] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [downloadOnly, setDownloadOnly] = useState(false);

  const filters = useMemo(
    () => ({
      countries: makeOptions(standards.map((standard) => standard.country_scope)),
      publishers: makeOptions(standards.map((standard) => standard.publisher)),
      categories: makeOptions(standards.map((standard) => standard.primary_category))
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
        standard.country_scope,
        standard.latest_known_edition,
        standard.applicability,
        standard.summary,
        standard.notes
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!search || searchable.includes(search)) &&
        (country === ALL || standard.country_scope === country) &&
        (publisher === ALL || standard.publisher === publisher) &&
        (category === ALL || standard.primary_category === category) &&
        (!downloadOnly || Boolean(standard.source_download_url?.trim()))
      );
    });
  }, [category, country, downloadOnly, publisher, query, standards]);

  const publisherCount = new Set(standards.map((standard) => standard.publisher)).size;
  const categoryCount = new Set(standards.map((standard) => standard.primary_category)).size;

  function resetFilters() {
    setQuery("");
    setCountry(ALL);
    setPublisher(ALL);
    setCategory(ALL);
    setDownloadOnly(false);
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
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={downloadOnly}
              onChange={(event) => setDownloadOnly(event.target.checked)}
            />
            <span>
              <FileDown aria-hidden="true" size={16} />
              Direct PDF available
            </span>
          </label>

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

            {filteredStandards.map((standard) => (
              <article className="standard-row" key={standard.standard_id} role="row">
                <div className="designation-cell" role="cell">
                  <Link href={`/standards/${encodeURIComponent(standard.standard_id)}`}>
                    {standard.designation}
                  </Link>
                  <span>{standard.primary_category}</span>
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
                      aria-label={`${standard.designation} direct public PDF`}
                      title="Direct public PDF"
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
            ))}
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
  return [ALL, ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))];
}

function FilterSelect({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
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
