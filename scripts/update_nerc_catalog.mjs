import fs from "node:fs";
import path from "node:path";

const NERC_ROOT = "https://www.nerc.com";
const RELIABILITY_STANDARDS_URL = `${NERC_ROOT}/standards/reliability-standards`;
const repoRoot = process.cwd();
const dataPath = path.join(repoRoot, "data", "nerc_standards.csv");

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
  "notes",
];

const familyDescriptions = new Map([
  ["BAL", "Resource and Demand Balancing"],
  ["CIP", "Critical Infrastructure Protection"],
  ["COM", "Communications"],
  ["EOP", "Emergency Preparedness and Operations"],
  ["FAC", "Facilities Design, Connections, and Maintenance"],
  ["INT", "Interchange Scheduling and Coordination"],
  ["IRO", "Interconnection Reliability Operations and Coordination"],
  ["MOD", "Modeling, Data, and Analysis"],
  ["NUC", "Nuclear"],
  ["PER", "Personnel Performance, Training, and Qualifications"],
  ["PRC", "Protection and Control"],
  ["TOP", "Transmission Operations"],
  ["TPL", "Transmission Planning"],
  ["VAR", "Voltage and Reactive"],
]);

const collectionRows = [
  {
    standard_id: "NERC-RELIABILITY-STANDARDS",
    designation: "NERC Reliability Standards",
    title: "Reliability Standards",
    publisher: "North American Electric Reliability Corporation",
    record_type: "standard_family",
    country_scope: "North America",
    primary_category: "Bulk electric system reliability",
    latest_known_edition: "current",
    applicability:
      "Enforceable after approval or adoption by the applicable regulatory authority",
    summary:
      "NERC reliability standards for planning and operating the North American bulk power system across resource balancing cyber security communications emergency operations facilities operations planning protection transmission and voltage control families.",
    official_url: RELIABILITY_STANDARDS_URL,
    source_download_url: `${NERC_ROOT}/globalassets/standards/reliability-standards/rscompleteset.pdf`,
    notes:
      "Collection record; individual standards are listed separately in this file.",
  },
  {
    standard_id: "NERC-GLOSSARY",
    designation: "NERC Glossary",
    title: "Glossary of Terms Used in NERC Reliability Standards",
    publisher: "North American Electric Reliability Corporation",
    record_type: "glossary",
    country_scope: "North America",
    primary_category: "Bulk electric system reliability definitions",
    latest_known_edition: "current",
    applicability:
      "Definitions used in NERC reliability standards and related reliability documents",
    summary:
      "NERC glossary record for defined terms used by reliability standards and related bulk power system reliability documents.",
    official_url: `${NERC_ROOT}/glossary-of-terms`,
    source_download_url: "",
    notes:
      "NERC reliability standards page links to the glossary page; direct file URL was not extracted in this pass.",
  },
  {
    standard_id: "NERC-ONE-STOP-SHOP",
    designation: "NERC One Stop Shop",
    title: "One Stop Shop",
    publisher: "North American Electric Reliability Corporation",
    record_type: "index_workbook",
    country_scope: "North America",
    primary_category: "Bulk electric system reliability reference",
    latest_known_edition: "2026-08-22",
    applicability:
      "Reference workbook for standards implementation plans project pages audit worksheets FERC orders and compliance guidance",
    summary:
      "NERC reference workbook that centralizes links to reliability standards implementation plans project pages audit worksheets FERC orders and compliance guidance.",
    official_url: RELIABILITY_STANDARDS_URL,
    source_download_url: `${NERC_ROOT}/globalassets/align-reports/one-stop-shop.xlsx`,
    notes: "NERC reliability standards page listed this resource as modified August 22 2026.",
  },
  {
    standard_id: "NERC-US-EFFECTIVE-DATE-STATUS",
    designation: "NERC US Effective Date Status",
    title: "US Effective Date Status - Functional Applicability",
    publisher: "North American Electric Reliability Corporation",
    record_type: "index_workbook",
    country_scope: "United States",
    primary_category: "Bulk electric system reliability applicability",
    latest_known_edition: "2026-08-22",
    applicability:
      "Reference workbook for United States reliability standard effective dates and functional applicability",
    summary:
      "NERC workbook for United States reliability standard effective-date status and functional applicability metadata.",
    official_url: RELIABILITY_STANDARDS_URL,
    source_download_url: `${NERC_ROOT}/globalassets/align-reports/us-effective-date-status---functional-applicability.xlsx`,
    notes: "NERC reliability standards page listed this resource as modified August 22 2026.",
  },
  {
    standard_id: "NERC-VRF-VSL-MATRIX",
    designation: "NERC VRF VSL Matrix",
    title: "Combined VRF VSL Matrix",
    publisher: "North American Electric Reliability Corporation",
    record_type: "index_workbook",
    country_scope: "North America",
    primary_category: "Bulk electric system reliability compliance",
    latest_known_edition: "2026-08-22",
    applicability:
      "Reference workbook for violation risk factors and violation severity levels",
    summary:
      "NERC workbook combining violation risk factor and violation severity level information for reliability standards.",
    official_url: RELIABILITY_STANDARDS_URL,
    source_download_url: `${NERC_ROOT}/globalassets/align-reports/combined-vrf-vsl-matrix.xlsx`,
    notes: "NERC reliability standards page listed this resource as modified August 22 2026.",
  },
];

const familyRows = [...familyDescriptions.entries()].map(([family, description]) => ({
  standard_id: `NERC-${family}`,
  designation: `NERC ${family}`,
  title: description,
  publisher: "North American Electric Reliability Corporation",
  record_type: "standard_family",
  country_scope: "North America",
  primary_category: `NERC ${description}`,
  latest_known_edition: "current",
  applicability:
    "Enforceable after approval or adoption by the applicable regulatory authority",
  summary: `NERC ${family} reliability standards family for ${description.toLowerCase()} requirements.`,
  official_url: `${RELIABILITY_STANDARDS_URL}/${family.toLowerCase()}`,
  source_download_url: "",
  notes: "Family record generated from the official NERC Reliability Standards page.",
}));

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const familyPages = await getFamilyPages();
  const indexRecords = [];

  for (const family of familyPages) {
    const categoryModel = await getModel(absolutize(family.url));
    for (const standard of categoryModel.pageModel.allStandards ?? []) {
      indexRecords.push({
        family: family.title.split(" ")[0],
        familyTitle: family.title,
        ...standard,
        url: absolutize(standard.url),
      });
    }
  }

  const rows = [];
  for (const standard of dedupeBy(indexRecords, (item) => item.number)) {
    const detailModel = await getModel(standard.url);
    rows.push(toStandardRow(standard, detailModel.pageModel));
  }

  const allRows = [...collectionRows, ...familyRows, ...rows].sort((a, b) =>
    a.standard_id.localeCompare(b.standard_id)
  );

  fs.writeFileSync(dataPath, toCsv(allRows), "utf8");
  console.log(
    `wrote ${allRows.length} NERC records; standards=${rows.length}; direct_downloads=${
      allRows.filter((row) => row.source_download_url).length
    }`
  );
}

async function getFamilyPages() {
  const model = await getModel(RELIABILITY_STANDARDS_URL);
  return model.pageModel.standardsFamilies ?? [];
}

async function getModel(url) {
  const html = await fetchText(url);
  const marker = "window._model = ";
  const start = html.indexOf(marker);
  if (start < 0) {
    throw new Error(`No NERC model found at ${url}`);
  }

  return JSON.parse(extractJsonObject(html, start + marker.length));
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${url}`);
  }
  return response.text();
}

function extractJsonObject(text, startIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  throw new Error("Could not find JSON object boundary");
}

function toStandardRow(indexRecord, detail) {
  const familyDescription =
    familyDescriptions.get(indexRecord.family) ?? indexRecord.familyTitle;
  const effectiveDate =
    isoDate(detail.effectiveDateDisplay) ??
    isoDate(indexRecord.effectiveDateDisplay) ??
    "current";
  const standardDocumentUrl = detail.standardDocument?.url
    ? absolutize(detail.standardDocument.url)
    : "";
  const notes = [
    `NERC page label: ${detail.status ?? indexRecord.status}.`,
    detail.standardDocument?.modifiedDate
      ? `Standard document modified ${detail.standardDocument.modifiedDate}.`
      : "",
    detail.publicNotes ? `Public notes: ${stripHtml(detail.publicNotes)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    standard_id: `NERC-${slugify(detail.name ?? indexRecord.number)}`,
    designation: detail.name ?? indexRecord.number,
    title: detail.title ?? indexRecord.title,
    publisher: "North American Electric Reliability Corporation",
    record_type: "standard",
    country_scope: "North America",
    primary_category: `NERC ${familyDescription}`,
    latest_known_edition: effectiveDate,
    applicability:
      "Enforceable after approval or adoption by the applicable regulatory authority",
    summary: `NERC reliability standard in the ${indexRecord.family} family addressing ${(detail.title ?? indexRecord.title).toLowerCase()}.`,
    official_url: detail.url ? absolutize(detail.url) : indexRecord.url,
    source_download_url: standardDocumentUrl,
    notes,
  };
}

function absolutize(url) {
  if (!url) {
    return "";
  }
  return url.startsWith("http") ? url : new URL(url, NERC_ROOT).toString();
}

function stripHtml(html) {
  return (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isoDate(value) {
  const match = (value ?? "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return "";
  }
  return `${match[3]}-${match[1]}-${match[2]}`;
}

function slugify(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dedupeBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function toCsv(rows) {
  return [
    CSV_HEADERS.join(","),
    ...rows.map((row) => CSV_HEADERS.map((header) => csvEscape(row[header] ?? "")).join(",")),
  ].join("\n") + "\n";
}

function csvEscape(value) {
  const text = String(value)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, "\"");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}
