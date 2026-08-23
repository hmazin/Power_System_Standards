import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AESO_ROOT = "https://www.aeso.ca";
const ISO_RULES_URL = `${AESO_ROOT}/rules-standards-and-tariff/iso-rules/`;
const REM_RULES_URL = `${AESO_ROOT}/rules-standards-and-tariff/rem-iso-rules/`;
const INFORMATION_DOCUMENTS_URL = `${AESO_ROOT}/rules-standards-and-tariff/information-documents/`;

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
    !row.standard_id.startsWith("AESO-INFO-DOC-")
);

const isoHtml = await readHtml("--iso-html", ISO_RULES_URL);
const remHtml = await readHtml("--rem-html", REM_RULES_URL);
const informationDocumentsHtml = await readHtml(
  "--information-documents-html",
  INFORMATION_DOCUMENTS_URL
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

const generatedRules = [...isoRules, ...remRules];
const informationDocuments = parseInformationDocumentRows(informationDocumentsHtml);
const insertAfterIndex = rowsWithoutGeneratedRules.findIndex(
  (row) => row.standard_id === "AESO-INFORMATION-DOCUMENTS"
);
const nextRows = [...rowsWithoutGeneratedRules];
nextRows.splice(insertAfterIndex + 1, 0, ...informationDocuments, ...generatedRules);

fs.writeFileSync(dataPath, stringifyCsv(nextRows), "utf8");

console.log(`information_documents=${informationDocuments.length}`);
console.log(`iso_rules=${isoRules.length}`);
console.log(`rem_iso_rules=${remRules.length}`);
console.log(
  `direct_downloads=${[...informationDocuments, ...generatedRules].filter((row) => row.source_download_url).length}`
);
console.log(
  `missing_downloads=${generatedRules
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
