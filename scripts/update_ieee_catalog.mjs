import fs from "node:fs";
import path from "node:path";

const IEEE_ROOT = "https://standards.ieee.org";
const SITEMAP_INDEX_URL = `${IEEE_ROOT}/wp-sitemap.xml`;
const DATA_PATH = path.join(process.cwd(), "data", "ieee_standards.csv");
const FETCH_TIMEOUT_MS = 30000;
const FETCH_ATTEMPTS = 4;
const PAGE_CONCURRENCY = 4;
const SUPPLEMENTAL_STANDARD_URLS = [
  "https://standards.ieee.org/ieee/C37.66/4937"
];

const CSV_HEADERS = [
  "standard_id",
  "designation",
  "title",
  "publisher",
  "record_type",
  "country_scope",
  "primary_category",
  "latest_known_edition",
  "applicability",
  "summary",
  "official_url",
  "source_download_url",
  "notes"
];

const SERIES = new Map([
  [
    "C57",
    {
      title: "Transformers, Regulators, and Reactors",
      primaryPrefix: "C57 transformers regulators and reactors",
      summaryTopic: "transformers, reactors, insulating liquids, bushings, and related transformer equipment"
    }
  ],
  [
    "C37",
    {
      title: "Switchgear and Protection Equipment",
      primaryPrefix: "C37 switchgear and protection equipment",
      summaryTopic: "switchgear, circuit breakers, relays, reclosers, and protection equipment"
    }
  ],
  [
    "C62",
    {
      title: "Surge Arresters and Surge Protective Devices",
      primaryPrefix: "C62 surge arresters and surge protective devices",
      summaryTopic: "surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection"
    }
  ],
  [
    "1547",
    {
      title: "DER Interconnection",
      primaryPrefix: "1547 DER interconnection",
      summaryTopic: "distributed energy resource interconnection, interoperability, conformance testing, and application guidance"
    }
  ],
  [
    "2030",
    {
      title: "Smart Grid, DERMS, and Microgrids",
      primaryPrefix: "2030 smart grid DERMS and microgrids",
      summaryTopic: "smart grid interoperability, microgrid controllers, DER management systems, and grid control automation"
    }
  ],
  [
    "2800",
    {
      title: "Inverter-Based Resource Interconnection",
      primaryPrefix: "2800 inverter-based resource interconnection",
      summaryTopic: "inverter-based resource interconnection, grid-forming capabilities, and bulk power system performance verification"
    }
  ],
  [
    "3000",
    {
      title: "Industrial and Commercial Power Systems",
      primaryPrefix: "3000 industrial and commercial power systems",
      summaryTopic: "industrial and commercial power systems design, analysis, grounding, protection, standby power, reliability, maintenance, operations, and safety"
    }
  ]
]);

const requestedSeries = process.argv.slice(2).map((value) => value.toUpperCase());
const isPartialRefresh = requestedSeries.length > 0;
const targetSeries = requestedSeries.length
  ? requestedSeries.filter((series) => SERIES.has(series))
  : [...SERIES.keys()];

if (!targetSeries.length) {
  throw new Error(
    `No supported IEEE family or series requested. Supported values: ${[...SERIES.keys()].join(", ")}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const allUrls = await discoverIeeeStandardUrls();
  const candidateUrls = allUrls.filter((url) =>
    targetSeries.some((series) => seriesMatchesUrl(series, url))
  );

  let processedCount = 0;
  const pageRecords = await mapWithConcurrency(candidateUrls, PAGE_CONCURRENCY, async (url) => {
    try {
      return parseIeeePage(url, await fetchText(url));
    } finally {
      processedCount += 1;

      if (processedCount % 50 === 0 || processedCount === candidateUrls.length) {
        console.log(`processed_pages=${processedCount}/${candidateUrls.length}`);
      }
    }
  }
  );
  const failedRecords = pageRecords.filter((record) => record.error);
  const activeRows = pageRecords
    .filter((record) => !record.error)
    .filter((record) => record.status === "Active Standard")
    .filter((record) => record.designation)
    .filter((record) => editionFromDesignation(record.designation))
    .filter((record) => targetSeries.includes(seriesFromDesignation(record.designation)))
    .map(toStandardRow);

  const rows = mergeWithExistingRows(activeRows);

  fs.writeFileSync(DATA_PATH, toCsv(rows), "utf8");

  console.log(`candidate_urls=${candidateUrls.length}`);
  console.log(`active_records=${rows.length}`);
  console.log(
    `series_counts=${targetSeries
      .map(
        (series) =>
          `${series}:${rows.filter((row) => seriesFromDesignation(row.designation) === series).length}`
      )
      .join(",")}`
  );
  console.log(`failed_pages=${failedRecords.length}`);

  if (failedRecords.length) {
    console.log(
      `failed_urls=${failedRecords
        .slice(0, 10)
        .map((record) => record.url)
        .join(",")}`
    );
  }
}

function mergeWithExistingRows(refreshedRows) {
  const existingRows = isPartialRefresh
    ? readExistingRows().filter(
      (row) => !targetSeries.includes(seriesFromDesignation(row.designation))
    )
    : [];

  return dedupeBy([...existingRows, ...refreshedRows], (row) => row.standard_id)
    .sort((a, b) => {
      const seriesCompare =
        seriesSortIndex(seriesFromDesignation(a.designation)) -
        seriesSortIndex(seriesFromDesignation(b.designation));
      if (seriesCompare) {
        return seriesCompare;
      }

      return compareDesignation(a.designation, b.designation);
    });
}

function readExistingRows() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const csv = fs.readFileSync(DATA_PATH, "utf8").trim();

  if (!csv) {
    return [];
  }

  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);

    return CSV_HEADERS.reduce((row, header) => {
      const index = headers.indexOf(header);
      row[header] = index >= 0 ? values[index] ?? "" : "";
      return row;
    }, {});
  });
}

async function discoverIeeeStandardUrls() {
  const sitemapIndex = await fetchText(SITEMAP_INDEX_URL);
  const sitemapUrls = extractXmlLocs(sitemapIndex).filter((url) =>
    /\/ieee-sitemap\d*\.xml$/i.test(url)
  );
  const standardUrls = [];

  for (const sitemapUrl of sitemapUrls) {
    const sitemap = await fetchText(sitemapUrl);
    standardUrls.push(
      ...extractXmlLocs(sitemap).filter((url) => /\/ieee\/[A-Z0-9.]/i.test(url))
    );
  }

  return [
    ...new Set([
      ...standardUrls,
      ...SUPPLEMENTAL_STANDARD_URLS,
      ...extractExistingIeeeUrls()
    ])
  ];
}

function extractExistingIeeeUrls() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  return [
    ...fs
      .readFileSync(DATA_PATH, "utf8")
      .matchAll(/https:\/\/standards\.ieee\.org\/ieee\/[^,\r\n"]+/g)
  ].map((match) => match[0]);
}

function parseIeeePage(url, html) {
  const meta = parseMetaTags(html);
  const designation = cleanText(meta.designation);
  const title = cleanTitle(cleanText(meta.title));
  const status = cleanText(meta.Status);

  return {
    url,
    designation,
    title,
    status,
    standardCommittee: htmlField(html, "stnd-standard-committee"),
    boardApprovalDate: htmlField(html, "stnd-board-approval-date"),
    parApprovalDate: htmlField(html, "stnd-par-approval-date"),
    publishedDate: htmlField(html, "stnd-published-date"),
    standardRecordNumber: cleanText(meta.StdRecNo),
    society: cleanText(meta.Society),
    topic: cleanText(meta.topic),
    type: cleanText(meta.type)
  };
}

function toStandardRow(record) {
  const series = seriesFromDesignation(record.designation);
  const config = SERIES.get(series);
  const subcategory = subcategoryFor(series, record.title, record.designation);
  const edition = editionFromDesignation(record.designation) || record.publishedDate || "current";
  const notes = [
    `IEEE SA page status: ${record.status}.`,
    record.publishedDate ? `Published: ${record.publishedDate}.` : "",
    record.boardApprovalDate ? `Board approval: ${record.boardApprovalDate}.` : "",
    record.standardCommittee ? `Standard committee: ${record.standardCommittee}.` : "",
    record.standardRecordNumber ? `IEEE record number: ${record.standardRecordNumber}.` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return {
    standard_id: `IEEE-${slugify(standardNumberFromDesignation(record.designation))}`,
    designation: record.designation,
    title: record.title,
    publisher: "IEEE",
    record_type: recordTypeFor(record.title, record.designation),
    country_scope: "International / North America",
    primary_category: `${config.primaryPrefix} - ${subcategory}`,
    latest_known_edition: edition,
    applicability:
      "Consensus IEEE power and energy standard used where specified by law, code, authority having jurisdiction, utility requirement, project specification, or contract",
    summary: `IEEE ${series} family metadata record for ${config.summaryTopic}; this record points to the official IEEE SA page for ${record.designation}.`,
    official_url: record.url,
    source_download_url: "",
    notes
  };
}

function subcategoryFor(series, title, designation) {
  const haystack = `${designation} ${title}`.toLowerCase();

  if (series === "C57") {
    if (/terminology|definitions|nomenclature/.test(haystack)) {
      return "Terminology and Reference";
    }

    if (/test|measurement|calibration/.test(haystack)) {
      return "Test Codes and Methods";
    }

    if (/dry-type|dry type|cast-coil|ventilated/.test(haystack)) {
      return "Dry-Type Transformers";
    }

    if (/liquid-immersed|oil-immersed|mineral-oil|natural ester|insulating liquid|insulating oil/.test(haystack)) {
      return "Liquid-Immersed Transformers";
    }

    if (/distribution|pad-mounted|overhead|submersible|network|subway|vault/.test(haystack)) {
      return "Distribution Transformers";
    }

    if (/instrument transformer|current transformer|voltage transformer|metering/.test(haystack)) {
      return "Instrument Transformers";
    }

    if (/bushing|terminal|connection|enclosure|cabinet/.test(haystack)) {
      return "Bushings Accessories and Enclosures";
    }

    if (/loading|maintenance|monitor|diagnostic|dissolved gas|field testing|repair|failure/.test(haystack)) {
      return "Monitoring Diagnostics and Maintenance";
    }

    if (/insulation|thermal|temperature|dielectric|short-circuit|through-fault/.test(haystack)) {
      return "Insulation Thermal and Mechanical Performance";
    }

    if (/regulator|reactor|tap changer|tap-changer|rectifier|furnace|specialty/.test(haystack)) {
      return "Specialty Transformers Reactors and Regulators";
    }

    return "General Transformer Requirements";
  }

  if (series === "C37") {
    if (/terminology|definitions|ratings|symmetrical current|basis/.test(haystack)) {
      return "Definitions Ratings and Reference";
    }

    if (/circuit breaker|circuit-breaker|breaker/.test(haystack)) {
      return "Circuit Breakers";
    }

    if (/switchgear|switchboard|metal-clad|metal-enclosed/.test(haystack)) {
      return "Switchgear Assemblies";
    }

    if (/relay|relaying|protection|trip|control circuit/.test(haystack)) {
      return "Relays Protection and Control";
    }

    if (/recloser|sectionalizer|fuse|interrupter|cutout/.test(haystack)) {
      return "Reclosers Sectionalizers Fuses and Interrupters";
    }

    if (/test|testing|measurement|calibration|monitor|diagnostic/.test(haystack)) {
      return "Testing Monitoring and Diagnostics";
    }

    return "General Switchgear and Protection Requirements";
  }

  if (series === "C62") {
    if (/surge arrester|arrester/.test(haystack)) {
      return "Surge Arresters";
    }

    if (/surge protective device|spd|protective device/.test(haystack)) {
      return "Surge Protective Devices";
    }

    if (/insulation coordination|application guide|guide|selection|low-voltage|low voltage/.test(haystack)) {
      return "Application Guides and Insulation Coordination";
    }

    if (/test|testing|measurement|wave|transient|impulse/.test(haystack)) {
      return "Testing and Transient Measurement";
    }

    return "General Surge Protection Requirements";
  }

  if (series === "1547") {
    if (/energy storage|storage|battery/.test(haystack)) {
      return "Energy Storage DER";
    }

    if (/test|testing|conformance|verification|commissioning|certification/.test(haystack)) {
      return "Conformance Testing and Verification";
    }

    if (/application guide|guide|use of|background|implementation/.test(haystack)) {
      return "Application Guides";
    }

    if (/secondary network|area network|spot network|network distribution/.test(haystack)) {
      return "Secondary Networks";
    }

    if (/interconnection|interoperability|distributed energy resources|der/.test(haystack)) {
      return "Interconnection Requirements";
    }

    return "General DER Interconnection";
  }

  if (series === "2030") {
    if (/microgrid/.test(haystack)) {
      return "Microgrids and Controllers";
    }

    if (/derms|distributed energy resources management|aggregation/.test(haystack)) {
      return "DERMS and Aggregation";
    }

    if (/energy storage|storage system|ess/.test(haystack)) {
      return "Energy Storage Integration";
    }

    if (/control|automation/.test(haystack)) {
      return "Control and Automation";
    }

    if (/charging|electric vehicle|transportation|virtual power plant|vpp/.test(haystack)) {
      return "EV Charging and Virtual Power Plants";
    }

    if (/smart grid|interoperability|reference model|information technology|communications/.test(haystack)) {
      return "Smart Grid Interoperability";
    }

    return "General Smart Grid Integration";
  }

  if (series === "2800") {
    if (/test|testing|verification|conformity|assessment/.test(haystack)) {
      return "Test and Verification";
    }

    if (/grid forming|grid-forming|gfm/.test(haystack)) {
      return "Grid-Forming IBR";
    }

    if (/amendment|corrigendum/.test(haystack)) {
      return "Amendments and Corrections";
    }

    return "Transmission IBR Interconnection";
  }

  if (series === "3000") {
    const standardNumber = standardNumberFromDesignation(designation);

    if (/^3001(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Design";
    }

    if (/^3002(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Analysis";
    }

    if (/^3003(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Grounding";
    }

    if (/^3004(?:\.|-)/.test(standardNumber)) {
      return "Protection and Coordination";
    }

    if (/^3005(?:\.|-)/.test(standardNumber)) {
      return "Energy and Standby Power";
    }

    if (/^3006(?:\.|-)/.test(standardNumber)) {
      return "Reliability";
    }

    if (/^3007(?:\.|-)/.test(standardNumber)) {
      return "Maintenance Operations and Safety";
    }

    return "General Industrial and Commercial Power Systems";
  }

  return "General";
}

function recordTypeFor(title, designation) {
  const haystack = `${designation} ${title}`.toLowerCase();

  if (/corrigendum/.test(haystack)) {
    return "corrigendum";
  }

  if (/amendment/.test(haystack)) {
    return "amendment";
  }

  if (/recommended practice/.test(haystack)) {
    return "recommended_practice";
  }

  if (/guide/.test(haystack)) {
    return "guide";
  }

  return "standard";
}

function seriesMatchesUrl(series, url) {
  if (series === "3000") {
    return /\/ieee\/300[0-7](?:[./_-]|$)/i.test(url);
  }

  const suffix = series.startsWith("C") ? "[./_-]|$" : "[a-z]|[./_-]|$";
  return new RegExp(`/ieee/${series.replace("C", "[Cc]")}(?:${suffix})`, "i").test(url);
}

function seriesFromDesignation(designation) {
  const standardNumber = standardNumberFromDesignation(designation).toUpperCase();
  const cSeriesMatch = standardNumber.match(/^(C(?:37|57|62))\b/);

  if (cSeriesMatch) {
    return cSeriesMatch[1];
  }

  if (/^1547(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "1547";
  }

  if (/^2030(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "2030";
  }

  if (/^2800(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "2800";
  }

  if (/^300[0-7](?:\.\d+|-|$)/.test(standardNumber)) {
    return "3000";
  }

  return "";
}

function editionFromDesignation(designation) {
  return designation.match(/-(\d{4})(?:\b|$)/)?.[1] ?? "";
}

function compareDesignation(a, b) {
  return numericTokens(a).localeCompare(numericTokens(b), undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

function seriesSortIndex(series) {
  const index = [...SERIES.keys()].indexOf(series);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function numericTokens(value) {
  return standardNumberFromDesignation(value);
}

function standardNumberFromDesignation(value) {
  return value.replace(
    /^(?:ANSI\/IEEE|IEEE\/ANSI|IEEE\/IEC|IEC\/IEEE|IEEE)\s+(?:Std\s+)?/i,
    ""
  );
}

function parseMetaTags(html) {
  const meta = {};

  for (const match of html.matchAll(
    /<meta\s+name=["']([^"']+)["']\s+content=["']([\s\S]*?)["']\s*\/?>/gi
  )) {
    meta[match[1]] = decodeHtml(match[2]);
  }

  return meta;
}

function htmlField(html, id) {
  const match = html.match(
    new RegExp(`<dd\\b[^>]*id=["']${escapeRegExp(id)}["'][^>]*>([\\s\\S]*?)<\\/dd>`, "i")
  );

  return match ? stripHtml(match[1]) : "";
}

function extractXmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) =>
    decodeHtml(match[1]).trim()
  );
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const itemIndex = index;
      index += 1;

      try {
        results[itemIndex] = await mapper(items[itemIndex], itemIndex);
      } catch (error) {
        results[itemIndex] = {
          url: items[itemIndex],
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

async function fetchText(url, attempts = FETCH_ATTEMPTS) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "PowerSystemStandardsRegistry/0.1 metadata research"
        },
        redirect: "follow",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Fetch failed ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await wait(attempt * 500);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`GET ${url} failed: ${lastError?.message ?? lastError}`);
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cleanTitle(value) {
  return value.replace(/^IEEE SA\s+-\s+/i, "").trim();
}

function cleanText(value) {
  return stripHtml(value ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " "));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&trade;|&#8482;|&#x2122;/g, "")
    .replace(/&reg;|&#174;|&#x00AE;/g, "")
    .replace(/&ndash;|&dash;|&#8211;|&#x2013;/g, "-")
    .replace(/&mdash;|&#8212;|&#x2014;/g, "-")
    .replace(/&rsquo;|&#8217;|&#x2019;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, "\"")
    .replace(/&#039;|&apos;/g, "'")
    .trim();
}

function slugify(value) {
  return value
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dedupeBy(rows, keyFn) {
  const seen = new Set();
  const uniqueRows = [];

  for (const row of rows) {
    const key = keyFn(row);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueRows.push(row);
  }

  return uniqueRows;
}

function toCsv(rows) {
  return [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      CSV_HEADERS.map((header) => csvCell(row[header] ?? "")).join(",")
    )
  ].join("\n") + "\n";
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === "\"" && inQuotes && nextChar === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function csvCell(value) {
  const text = String(value)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\u2010|\u2011|\u2012|\u2013|\u2014/g, "-")
    .replace(/\u2122|\u00AE/g, "")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, "\"");

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  return text;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
