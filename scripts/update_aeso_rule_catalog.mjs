import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AESO_ROOT = "https://www.aeso.ca";
const ISO_RULES_URL = `${AESO_ROOT}/rules-standards-and-tariff/iso-rules/`;
const REM_RULES_URL = `${AESO_ROOT}/rules-standards-and-tariff/rem-iso-rules/`;
const INFORMATION_DOCUMENTS_URL = `${AESO_ROOT}/rules-standards-and-tariff/information-documents/`;
const ALBERTA_RELIABILITY_STANDARDS_URL = `${AESO_ROOT}/rules-standards-and-tariff/alberta-reliability-standards/`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dataPath = path.join(repoRoot, "data", "aeso_standards.csv");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...value] = arg.split("=");
    return [key, value.join("=")];
  })
);

const headers = [
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

const existingRows = parseCsv(fs.readFileSync(dataPath, "utf8"));
const rowsWithoutGeneratedRules = existingRows.filter(
  (row) =>
    !row.standard_id.startsWith("AESO-ISO-RULE-") &&
    !row.standard_id.startsWith("AESO-REM-ISO-RULE-") &&
    !row.standard_id.startsWith("AESO-INFO-DOC-") &&
    !row.standard_id.startsWith("AESO-ARS-")
);

const isoHtml = await readHtml("--iso-html", ISO_RULES_URL);
const remHtml = await readHtml("--rem-html", REM_RULES_URL);
const informationDocumentsHtml = await readHtml(
  "--information-documents-html",
  INFORMATION_DOCUMENTS_URL
);
const albertaReliabilityStandardsHtml = await readHtml(
  "--alberta-reliability-standards-html",
  ALBERTA_RELIABILITY_STANDARDS_URL
);

const isoRules = parseRuleRows({
  html: isoHtml,
  startMarker: "Individual ISO Rules",
  endMarker: "Retired Rules",
  idPrefix: "AESO-ISO-RULE",
  designationPrefix: "ISO Rule",
  categoryPrefix: "AESO ISO rule",
  applicability: "Binding ISO rule in Alberta when applicable",
  notes: "Extracted from official AESO ISO Rules page current individual rules list.",
  noDownloadNotes:
    "Extracted from official AESO ISO Rules page current individual rules list; no current PDF link was exposed for this row."
});

const remRules = parseRuleRows({
  html: remHtml,
  startMarker: "Individual REM ISO Rules",
  endMarker: "Table of Concordance",
  idPrefix: "AESO-REM-ISO-RULE",
  designationPrefix: "REM ISO Rule",
  categoryPrefix: "AESO REM ISO rule",
  applicability: "REM ISO rule effective immediately upon approval where applicable",
  notes: "Extracted from official AESO REM ISO Rules page current individual rules list.",
  noDownloadNotes:
    "Extracted from official AESO REM ISO Rules page current individual rules list; no current PDF link was exposed for this row."
});

const excludedGeneratedRuleIds = new Set([
  // AESO keeps this legacy URL, but its page says it was re-designated to ISO Rule 306.3.
  "AESO-ISO-RULE-208-1"
]);

const generatedRules = [...isoRules, ...remRules].filter(
  (row) => !excludedGeneratedRuleIds.has(row.standard_id)
);
const informationDocuments = parseInformationDocumentRows(informationDocumentsHtml);
const albertaReliabilityStandards = parseAlbertaReliabilityStandardRows(
  albertaReliabilityStandardsHtml
);
const nextRows = [...rowsWithoutGeneratedRules];
const arsInsertAfterIndex = nextRows.findIndex((row) => row.standard_id === "AESO-ARS");
if (arsInsertAfterIndex === -1) {
  throw new Error("Could not find AESO-ARS insertion anchor");
}
nextRows.splice(arsInsertAfterIndex + 1, 0, ...albertaReliabilityStandards);

const insertAfterIndex = nextRows.findIndex(
  (row) => row.standard_id === "AESO-CADG"
);
if (insertAfterIndex === -1) {
  throw new Error("Could not find AESO-CADG insertion anchor");
}
nextRows.splice(insertAfterIndex + 1, 0, ...informationDocuments, ...generatedRules);

fs.writeFileSync(dataPath, stringifyCsv(nextRows), "utf8");

console.log(`information_documents=${informationDocuments.length}`);
console.log(`alberta_reliability_standards=${albertaReliabilityStandards.length}`);
console.log(
  `alberta_reliability_standards_direct_downloads=${albertaReliabilityStandards.length}`
);
console.log(`iso_rules=${isoRules.length}`);
console.log(`rem_iso_rules=${remRules.length}`);
console.log(
  `direct_downloads=${[
    ...albertaReliabilityStandards,
    ...informationDocuments,
    ...generatedRules
  ].filter((row) => row.source_download_url).length}`
);
console.log(
  `missing_downloads=${[...albertaReliabilityStandards, ...generatedRules]
    .filter((row) => !row.source_download_url)
    .map((row) => row.designation)
    .join("; ")}`
);
console.log(`total_rows=${nextRows.length}`);

async function readHtml(argName, url) {
  const localPath = args.get(argName);
  if (localPath) {
    return fs.readFileSync(localPath, "utf8");
  }
  return fetchText(url);
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

function parseRuleRows({
  html,
  startMarker,
  endMarker,
  idPrefix,
  designationPrefix,
  categoryPrefix,
  applicability,
  notes,
  noDownloadNotes
}) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error(`Could not find ${startMarker} section`);
  }

  const segment = html.slice(start, end);
  const liPattern =
    /<li\b[^>]*>\s*<a href="([^"]+)" class="title">([\s\S]*?)<\/a>([\s\S]*?)<\/li>/g;
  const rows = [];

  for (const match of segment.matchAll(liPattern)) {
    const context = segment.slice(0, match.index);
    const rawTitle = decodeHtml(stripTags(match[2]));
    const trailingHtml = match[3];
    const downloadMatch = trailingHtml.match(
      /<a href="([^"]+)" class="download[^"]*"><span class="command">Download<\/span>\s*current<\/a>/
    );

    const part = lastMatch(
      context,
      /(?:Part\s+\d+\s+-\s+[^<\r\n]+|Section\s+9\s+Transmission)/g
    );
    const division = lastMatch(
      context,
      /(?:Division\s+\d+\s+-\s+[^<\r\n]+|Section\s+9(?=\s*<|\s*$))/g
    );
    const parsed = parseRuleTitle(rawTitle, designationPrefix);
    const downloadUrl = absolutize(downloadMatch?.[1] ?? "");

    rows.push({
      standard_id: `${idPrefix}-${parsed.idSuffix}`,
      designation: parsed.designation,
      title: parsed.title,
      publisher: "AESO",
      record_type: "rule",
      country_scope: "Canada - Alberta",
      primary_category: `${categoryPrefix} - ${cleanContext(part)}`,
      latest_known_edition: editionFromDownload(downloadUrl),
      applicability,
      summary: `${parsed.designation} ${parsed.title} under ${cleanContext(division)} in ${cleanContext(part)}.`,
      official_url: absolutize(match[1]),
      source_download_url: downloadUrl,
      notes: downloadUrl ? notes : noDownloadNotes
    });
  }

  return rows;
}

function parseInformationDocumentRows(html) {
  const startMarker =
    "Individual Information Documents for ISO Rules and Alberta Reliability Standards";
  const endMarker = "Information Documents for Tariff";
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error("Could not find AESO Information Documents table");
  }

  const segment = html.slice(start, end);
  const rowPattern = /<tr\b[^>]*>([\s\S]*?)<\/tr>/g;
  const rows = [];

  for (const rowMatch of segment.matchAll(rowPattern)) {
    const rowHtml = rowMatch[1];
    const cells = Array.from(
      rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g),
      (match) => match[1]
    );

    if (cells.length < 3) {
      continue;
    }

    const idMatch = cells[0].match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!idMatch) {
      continue;
    }

    const designation = decodeHtml(stripTags(idMatch[2]));
    if (!/^20\d{2}-/.test(designation)) {
      continue;
    }

    const title = decodeHtml(stripTags(cells[1]));
    const postingDate = decodeHtml(stripTags(cells[2]));

    rows.push({
      standard_id: `AESO-INFO-DOC-${designation.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
      designation,
      title,
      publisher: "AESO",
      record_type: "information_document",
      country_scope: "Canada - Alberta",
      primary_category:
        "AESO information document - ISO Rules and Alberta Reliability Standards",
      latest_known_edition: postingDate || editionFromDownload(idMatch[1]),
      applicability:
        "Not authoritative guidance; related AESO authoritative documents govern",
      summary: `AESO Information Document ${designation} provides non-authoritative guidance: ${title}.`,
      official_url: INFORMATION_DOCUMENTS_URL,
      source_download_url: absolutize(idMatch[1]),
      notes:
        "Extracted from official AESO Information Documents page current individual documents list. AESO states Information Documents are not authoritative and do not contain binding requirements."
    });
  }

  return rows;
}

function parseAlbertaReliabilityStandardRows(html) {
  const startMarker = "Individual Alberta Reliability Standards";
  const endMarker = "Non-Applicable Alberta reliability standards";
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error("Could not find AESO Individual Alberta Reliability Standards section");
  }

  const segment = html.slice(start, end);
  const liPattern =
    /<li\b[^>]*>\s*<a href="([^"]+)" class="title">([\s\S]*?)<\/a>([\s\S]*?)<\/li>/g;
  const rows = [];

  for (const match of segment.matchAll(liPattern)) {
    const rawTitle = decodeHtml(stripTags(match[2]));
    const trailingHtml = match[3];
    const downloadMatch = trailingHtml.match(
      /<a href="([^"]+)" class="download[^"]*"><span class="command">Download<\/span>\s*current<\/a>/
    );
    const downloadUrl = absolutize(downloadMatch?.[1] ?? "");

    if (!downloadUrl) {
      continue;
    }

    const designation = rawTitle.split(/\s+/)[0];
    const title = cleanArsTitle(designation, rawTitle);
    const isRetired = /\bRetired\b/i.test(rawTitle);

    rows.push({
      standard_id: `AESO-ARS-${idSuffixFromDesignation(designation)}`,
      designation,
      title,
      publisher: "AESO",
      record_type: arsRecordType(designation, isRetired),
      country_scope: "Canada - Alberta",
      primary_category: `Alberta reliability standard - ${arsCategory(designation)}`,
      latest_known_edition: editionFromArsTitle(rawTitle, downloadUrl),
      applicability: arsApplicability(isRetired),
      summary: `${isRetired ? "Historical AESO-listed" : "AESO-listed"} Alberta Reliability Standard ${designation}: ${title}.`,
      official_url: absolutize(match[1]),
      source_download_url: downloadUrl,
      notes:
        "Extracted from AESO Individual Alberta Reliability Standards page current downloadable list."
    });
  }

  return rows;
}

function cleanArsTitle(designation, rawTitle) {
  return rawTitle
    .slice(designation.length)
    .trim()
    .replace(/^-\s*/, "")
    .replace(/\s+-\s+Retired.*$/i, "")
    .replace(/\s+Retired\s+.*$/i, "")
    .trim();
}

function idSuffixFromDesignation(designation) {
  return designation
    .toUpperCase()
    .replace(/&/g, "-")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function arsRecordType(designation, isRetired) {
  if (isRetired) {
    return "historical_standard";
  }

  if (designation.endsWith("-PLAN")) {
    return "implementation_plan";
  }

  return "standard";
}

function arsApplicability(isRetired) {
  if (isRetired) {
    return "Historical retired Alberta reliability standard listed by AESO";
  }

  return "Binding reliability requirement in Alberta when applicable";
}

function editionFromArsTitle(rawTitle, downloadUrl) {
  if (downloadUrl) {
    return editionFromDownload(downloadUrl);
  }

  const retiredDate = rawTitle.match(
    /\bRetired\s+(\d{4}-\d{2}-\d{2}|[A-Z][a-z]+\s+\d{1,2},\s+\d{4})/i
  );

  if (retiredDate) {
    return `retired ${retiredDate[1]}`;
  }

  return "no current download listed";
}

function arsCategory(designation) {
  if (designation.startsWith("BAL-")) {
    return "Resource and Demand Balancing";
  }

  if (designation.startsWith("CIP-")) {
    return "Critical Infrastructure Protection";
  }

  if (designation.startsWith("COM-")) {
    return "Communications";
  }

  if (designation.startsWith("EOP-")) {
    return "Emergency Preparedness and Operations";
  }

  if (designation.startsWith("FAC-")) {
    return "Facilities Design Connections and Maintenance";
  }

  if (designation.startsWith("INT-")) {
    return "Interchange Scheduling and Coordination";
  }

  if (designation.startsWith("IRO-")) {
    return "Interconnection Reliability Operations and Coordination";
  }

  if (designation.startsWith("MOD-")) {
    return "Modeling Data and Analysis";
  }

  if (designation.startsWith("PER-")) {
    return "Personnel Performance Training and Qualifications";
  }

  if (designation.startsWith("PRC-")) {
    return "Protection and Control";
  }

  if (designation.startsWith("TOP-")) {
    return "Transmission Operations";
  }

  if (designation.startsWith("TPL-")) {
    return "Transmission Planning";
  }

  if (designation.startsWith("VAR-")) {
    return "Voltage and Reactive";
  }

  if (designation.startsWith("ADM-")) {
    return "Administrative";
  }

  return "Other";
}

function parseRuleTitle(rawTitle, designationPrefix) {
  if (rawTitle === "Section 9 Transmission") {
    return {
      idSuffix: "SECTION-9",
      designation: `${designationPrefix} Section 9`,
      title: "Transmission"
    };
  }

  const match = rawTitle.match(
    /^(Section\s+\d+(?:\.\d+)?|Division\s+\d+)\s+-\s+(.+)$/
  );

  if (!match) {
    throw new Error(`Could not parse rule title: ${rawTitle}`);
  }

  const label = match[1];
  const title = match[2];
  const idSuffix = label
    .replace(/^Section\s+/, "")
    .replace(/^Division\s+/, "DIVISION-")
    .replace(/\./g, "-")
    .replace(/\s+/g, "-")
    .toUpperCase();

  return {
    idSuffix,
    designation: `${designationPrefix} ${label.replace(/^Section\s+/, "").replace(/^Division\s+/, "Division ")}`,
    title
  };
}

function editionFromDownload(downloadUrl) {
  const match = downloadUrl.match(/(20\d{2})[-_](\d{2})[-_](\d{2})/);
  if (!match) {
    return "current";
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function lastMatch(text, pattern) {
  const matches = Array.from(text.matchAll(pattern), (match) =>
    decodeHtml(stripTags(match[0]))
  );
  return matches.at(-1) ?? "";
}

function cleanContext(value) {
  return value.replace(/\s*-\s*/g, " ").trim();
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, "");
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

function absolutize(href) {
  if (!href) {
    return "";
  }
  if (/^https?:\/\//.test(href)) {
    return href;
  }
  return `${AESO_ROOT}${href}`;
}

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const parsedHeaders = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      parsedHeaders.map((header, index) => [header, values[index] ?? ""])
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

function stringifyCsv(rows) {
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header] ?? "")).join(","))
  ].join("\n") + "\n";
}

function csvCell(value) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}
