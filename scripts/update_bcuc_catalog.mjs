import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const WECC_ROOT = "https://www.wecc.org";
const WECC_STANDARDS_URL = `${WECC_ROOT}/program-areas/standards`;
const dataPath = path.join(process.cwd(), "data", "bcuc_standards.csv");

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

const familyDescriptions = new Map([
  ["BAL", "Resource and Demand Balancing"],
  ["CIP", "Critical Infrastructure Protection"],
  ["COM", "Communications"],
  ["EOP", "Emergency Preparedness and Operations"],
  ["FAC", "Facilities Design Connections and Maintenance"],
  ["INT", "Interchange Scheduling and Coordination"],
  ["IRO", "Interconnection Reliability Operations and Coordination"],
  ["MOD", "Modeling Data and Analysis"],
  ["NUC", "Nuclear"],
  ["PER", "Personnel Performance Training and Qualifications"],
  ["PRC", "Protection and Control"],
  ["TOP", "Transmission Operations"],
  ["TPL", "Transmission Planning"],
  ["VAR", "Voltage and Reactive"]
]);
const relatedTitleByDesignation = loadRelatedTitleMap();

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const pages = await fetchApprovedBcPages();
  const sourceRows = uniqueBy(
    pages.flatMap((html) => parseApprovedBcRows(html)),
    (row) => row.officialUrl
  );

  const candidateRows = sourceRows.filter((row) => shouldIncludeSourceRow(row));
  const detailRows = await mapWithConcurrency(candidateRows, 8, async (sourceRow) => {
    const detail = await fetchDocumentDetail(sourceRow.officialUrl);
    return { sourceRow, detail };
  });
  const rows = detailRows
    .filter(({ detail }) => detail.source_download_url)
    .map(({ sourceRow, detail }) => toStandardRow(sourceRow, detail))
    .sort((a, b) => {
      const categoryCompare = a.primary_category.localeCompare(b.primary_category);
      if (categoryCompare) {
        return categoryCompare;
      }

      const designationCompare = a.designation.localeCompare(b.designation);
      if (designationCompare) {
        return designationCompare;
      }

      return a.standard_id.localeCompare(b.standard_id);
    });

  fs.writeFileSync(dataPath, toCsv(rows), "utf8");

  console.log(`bcuc_records=${rows.length}`);
  console.log(`source_active_rows=${candidateRows.length}`);
  console.log(
    `direct_downloads=${rows.filter((row) => row.source_download_url).length}`
  );
  console.log(
    `skipped_missing_downloads=${detailRows.filter(({ detail }) => !detail.source_download_url).length}`
  );
  console.log(
    `record_types=${[...new Set(rows.map((row) => row.record_type))]
      .sort()
      .map(
        (type) => `${type}:${rows.filter((row) => row.record_type === type).length}`
      )
      .join(",")}`
  );
}

function parseApprovedBcRows(pageHtml) {
  const start = pageHtml.indexOf("Approved BC Standards");
  const end = pageHtml.indexOf("Approved MX Standards", start);

  if (start < 0 || end < 0) {
    throw new Error("Could not find the WECC Approved BC Standards section");
  }

  const sectionHtml = pageHtml.slice(start, end);
  return [...sectionHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) => parseTableRow(match[1]))
    .filter(Boolean);
}

function parseTableRow(rowHtml) {
  const cells = extractCells(rowHtml);
  if (cells.length < 4) {
    return null;
  }

  const [fileTypeCell, titleCell, effectiveDateCell, inactiveDateCell] = cells;
  const titleLink = titleCell.match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

  if (!titleLink) {
    return null;
  }

  const title = stripHtml(titleLink[2]);
  const designation = extractDesignation(title);

  return {
    fileType: stripHtml(fileTypeCell),
    title,
    designation,
    titleWithoutDesignation: cleanTitle(stripDesignation(title, designation)),
    effectiveDate: stripHtml(effectiveDateCell),
    inactiveDate: stripHtml(inactiveDateCell),
    officialUrl: absolutize(decodeHtml(titleLink[1]))
  };
}

function shouldIncludeSourceRow(row) {
  if (row.inactiveDate) {
    return false;
  }

  if (/^\(superseded by/i.test(row.title)) {
    return false;
  }

  if (row.fileType !== "PDF") {
    return false;
  }

  return Boolean(row.designation);
}

function toStandardRow(sourceRow, detail) {
  const title = displayTitleFor(sourceRow);
  const standardId = [
    "BCUC",
    idSuffixFromDesignation(sourceRow.designation),
    documentIdFromUrl(sourceRow.officialUrl)
  ]
    .filter(Boolean)
    .join("-");
  const recordType = recordTypeFor(sourceRow);
  const category = categoryFor(sourceRow, recordType);

  return {
    standard_id: standardId,
    designation: sourceRow.designation,
    title,
    publisher: "BCUC",
    record_type: recordType,
    country_scope: "Canada - British Columbia",
    primary_category: category,
    latest_known_edition: sourceRow.effectiveDate || "effective date in source document",
    applicability:
      "Adopted or listed for application in British Columbia where applicable under the BCUC Mandatory Reliability Standards program",
    summary: summaryFor(sourceRow, recordType, title),
    official_url: sourceRow.officialUrl,
    source_download_url: detail.source_download_url,
    notes: [
      "Extracted from WECC Approved BC Standards table.",
      sourceRow.effectiveDate ? `WECC source effective date: ${sourceRow.effectiveDate}.` : "",
      "WECC hosts the public table for BC reliability adoption/status records; BCUC is the British Columbia adoption authority.",
      "The underlying standard-making body is generally NERC or WECC."
    ]
      .filter(Boolean)
      .join(" ")
  };
}

function recordTypeFor(sourceRow) {
  if (/implementation plan/i.test(sourceRow.title)) {
    return "implementation_plan";
  }

  if (/errata/i.test(sourceRow.title)) {
    return "errata";
  }

  return "adopted_reliability_standard";
}

function categoryFor(sourceRow, recordType) {
  if (recordType === "implementation_plan") {
    return "BCUC mandatory reliability standards implementation";
  }

  const family = sourceRow.designation.split("-")[0];
  return `BCUC mandatory reliability standard - ${familyDescriptions.get(family) ?? "Other"}`;
}

function summaryFor(sourceRow, recordType, title) {
  if (recordType === "implementation_plan") {
    return `BCUC Mandatory Reliability Standards implementation document: ${title}.`;
  }

  if (recordType === "errata") {
    return `BCUC British Columbia reliability standard errata record for ${sourceRow.designation}: ${title}.`;
  }

  return `BCUC British Columbia reliability standard adoption/status record for ${sourceRow.designation}: ${title}.`;
}

async function fetchApprovedBcPages() {
  const firstPage = await fetchText(WECC_STANDARDS_URL);
  const pageNumbers = [
    0,
    ...[
      ...firstPage
        .slice(firstPage.indexOf("Approved BC Standards"))
        .matchAll(/\?page=(\d+)%2C0%2C0%2C0%2C0/g)
    ].map((match) => Number(match[1]))
  ];
  const maxPageNumber = Math.max(...pageNumbers);
  const pageUrls = Array.from({ length: maxPageNumber + 1 }, (_, pageNumber) =>
    pageNumber === 0
      ? WECC_STANDARDS_URL
      : `${WECC_STANDARDS_URL}?page=${pageNumber}%2C0%2C0%2C0%2C0`
  );

  const remainingPages = await Promise.all(pageUrls.slice(1).map((url) => fetchText(url)));
  return [firstPage, ...remainingPages];
}

async function fetchDocumentDetail(url) {
  const html = await fetchText(url);
  const anchors = parseAnchors(html);
  const download = anchors.find((anchor) =>
    /^Download\s+PDF\s+Document$/i.test(anchor.text)
  );

  return {
    source_download_url: download ? absolutize(download.href) : ""
  };
}

function parseAnchors(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map(
    (match) => ({
      href: decodeHtml(match[1]),
      text: stripHtml(match[2])
    })
  );
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const itemIndex = index;
      index += 1;
      results[itemIndex] = await mapper(items[itemIndex], itemIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}

function extractCells(rowHtml) {
  return [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(
    (match) => match[1]
  );
}

function extractDesignation(title) {
  if (/^Applicable CIP Standards Implementation Plan/i.test(title)) {
    return "Applicable CIP Standards Implementation Plan";
  }

  const cleanedTitle = title
    .replace(/^\([^)]*\)\s*/, "")
    .replace(/\s*\{.*?\}\s*$/g, "")
    .replace(/^([A-Z]{3}-\d+)\s*-\s*(\d+)/, "$1-$2")
    .trim();
  const patterns = [
    /^(TPL-001-PLAN)/i,
    /^(CIP-PLAN)/i,
    /^(CIP-SUPP-\d+[A-Z]?)/i,
    /^([A-Z]{3}-STD-\d+[A-Z]?(?:-\d+)?)/i,
    /^([A-Z]{3}-\d+-WECC(?:-[A-Z]+)?-\d+(?:\.\d+)?[A-Z]?)/i,
    /^([A-Z]{3}-\d+-NPCC-\d+)/i,
    /^([A-Z]{3}-\d+-SERC-\d+)/i,
    /^([A-Z]{3}-\d+(?:-\d+)?(?:\.\d+)?[a-z]?(?:\([ivx]+\))?)/i
  ];

  for (const pattern of patterns) {
    const match = cleanedTitle.match(pattern);
    if (match) {
      return match[1].replace(/_BC$/i, "").trim();
    }
  }

  return "";
}

function stripDesignation(title, designation) {
  if (!designation) {
    return title;
  }

  if (designation === "Applicable CIP Standards Implementation Plan") {
    return title;
  }

  const flexibleDesignation = escapeRegExp(designation).replace(/-/g, "\\s*-\\s*");
  return title
    .replace(/^\([^)]*\)\s*/, "")
    .replace(new RegExp(`^${flexibleDesignation}\\s*(?:_?BC|BC)?\\s*-?\\s*`, "i"), "")
    .replace(/\s*\{.*?\}\s*$/g, "")
    .trim();
}

function cleanTitle(title) {
  return title
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/^BC\s*-?\s*/i, "")
    .replace(/^_?BC\s*-?\s*/i, "")
    .replace(/^-\s*/, "")
    .replace(/\s+-\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function displayTitleFor(sourceRow) {
  const title = cleanTitle(sourceRow.titleWithoutDesignation);
  const relatedTitle = relatedTitleByDesignation.get(
    normalizeDesignation(sourceRow.designation)
  );

  if (/^(with\s+)?BC-Specific Implementation Plan$/i.test(title)) {
    return relatedTitle
      ? `${relatedTitle} with BC-Specific Implementation Plan`
      : "BC-Specific Implementation Plan";
  }

  if (/^_?errata$/i.test(title)) {
    return relatedTitle ? `${relatedTitle} errata` : "Errata";
  }

  if (isWeakTitle(title, sourceRow.designation)) {
    return relatedTitle || cleanTitle(sourceRow.title);
  }

  return title;
}

function isWeakTitle(title, designation) {
  if (!title) {
    return true;
  }

  const normalizedTitle = normalizeDesignation(title.replace(/_BC$/i, ""));
  return (
    normalizedTitle === normalizeDesignation(designation) ||
    normalizedTitle === `${normalizeDesignation(designation)} BC` ||
    normalizedTitle.startsWith(`${normalizeDesignation(designation)} EFFECTIVE DATE`) ||
    normalizedTitle.startsWith(`${normalizeDesignation(designation)} {EFFECTIVE DATE`)
  );
}

function idSuffixFromDesignation(designation) {
  return designation
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function documentIdFromUrl(url) {
  return url.match(/\/wecc-document\/(\d+)/)?.[1] ?? "";
}

function loadRelatedTitleMap() {
  const map = new Map();
  for (const fileName of ["nerc_standards.csv", "wecc_standards.csv"]) {
    const filePath = path.join(process.cwd(), "data", fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    for (const row of parseCsv(fs.readFileSync(filePath, "utf8"))) {
      if (row.designation && row.title) {
        map.set(normalizeDesignation(row.designation), row.title);
      }
    }
  }

  for (const [designation, title] of [
    [
      "CIP-010-3",
      "Cyber Security - Configuration Change Management and Vulnerability Assessments"
    ],
    ["MOD-033-2", "Steady-State and Dynamic System Model Validation"],
    ["PRC-002-4", "Disturbance Monitoring and Reporting Requirements"],
    ["PRC-023-2", "Transmission Relay Loadability"],
    ["PRC-023-6", "Transmission Relay Loadability"]
  ]) {
    map.set(normalizeDesignation(designation), title);
  }

  return map;
}

function normalizeDesignation(value) {
  return value.toUpperCase().replace(/\s+/g, " ").trim();
}

function absolutize(href) {
  if (!href) {
    return "";
  }

  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return `${WECC_ROOT}${href}`;
}

function uniqueBy(rows, keyFn) {
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

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          resolve(fetchText(new URL(response.headers.location, url).toString()));
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`GET ${url} failed with ${response.statusCode}`));
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve(body);
        });
      })
      .on("error", reject);
  });
}

function toCsv(rows) {
  return [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      CSV_HEADERS.map((header) => csvCell(row[header] ?? "")).join(",")
    )
  ].join("\n") + "\n";
}

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""])
    );
  });
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
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }

  return value;
}

function stripHtml(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " "));
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;|&dash;|&#8211;|&#x2013;/g, "-")
    .replace(/&mdash;|&#8212;|&#x2014;/g, "-")
    .replace(/&rsquo;|&#8217;|&#x2019;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, "\"")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
