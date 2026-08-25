import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const WECC_ROOT = "https://www.wecc.org";
const WECC_STANDARDS_URL = `${WECC_ROOT}/program-areas/standards`;
const BC_HYDRO_DATA_PATH = path.join(process.cwd(), "data", "bc_hydro_standards.csv");

const bcHydroRows = parseCsv(fs.readFileSync(BC_HYDRO_DATA_PATH, "utf8"));
const bcHydroDesignations = new Set(
  bcHydroRows.map((row) => normalizeDesignation(row.designation))
);
const bcHydroTitles = new Set(bcHydroRows.map((row) => normalizeTitle(row.title)));

const htmlPages = await fetchApprovedBcPages();
const weccBcRows = uniqueBy(
  htmlPages.flatMap((html) => parseApprovedBcRows(html)),
  (row) => row.officialUrl
);

const comparisonRows = weccBcRows.map((row) => {
  const designationMatch = bcHydroDesignations.has(normalizeDesignation(row.designation));
  const titleMatch = bcHydroTitles.has(normalizeTitle(row.titleWithoutDesignation));

  return {
    ...row,
    matchedInBcHydro: designationMatch || titleMatch,
    matchType: designationMatch ? "designation" : titleMatch ? "title" : ""
  };
});

const missingRows = comparisonRows.filter((row) => !row.matchedInBcHydro);
const activeRows = comparisonRows.filter((row) => !row.inactiveDate);
const activeMissingRows = activeRows.filter((row) => !row.matchedInBcHydro);

console.log(`wecc_approved_bc_rows=${weccBcRows.length}`);
console.log(`wecc_approved_bc_with_designation=${weccBcRows.filter((row) => row.designation).length}`);
console.log(`bc_hydro_rows=${bcHydroRows.length}`);
console.log(`matched_in_bc_hydro=${comparisonRows.filter((row) => row.matchedInBcHydro).length}`);
console.log(`missing_from_bc_hydro=${missingRows.length}`);
console.log(`active_or_no_inactive_date=${activeRows.length}`);
console.log(`active_missing_from_bc_hydro=${activeMissingRows.length}`);
console.log("");

console.log("Missing active/no-inactive-date WECC Approved BC records:");
for (const row of activeMissingRows) {
  console.log(
    [
      row.designation || "(no designation)",
      row.effectiveDate,
      row.inactiveDate,
      row.title
    ].join("\t")
  );
}

console.log("");
console.log("Missing inactive WECC Approved BC records:");
for (const row of missingRows.filter((row) => row.inactiveDate)) {
  console.log(
    [
      row.designation || "(no designation)",
      row.effectiveDate,
      row.inactiveDate,
      row.title
    ].join("\t")
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
    titleWithoutDesignation: stripDesignation(title, designation),
    effectiveDate: stripHtml(effectiveDateCell),
    inactiveDate: stripHtml(inactiveDateCell),
    officialUrl: absolutize(decodeHtml(titleLink[1]))
  };
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

function extractCells(rowHtml) {
  return [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(
    (match) => match[1]
  );
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

function extractDesignation(title) {
  const cleanedTitle = title
    .replace(/^\([^)]*\)\s*/, "")
    .replace(/\s*\{.*?\}\s*$/g, "")
    .trim();

  const match = cleanedTitle.match(
    /^(Applicable CIP Standards Implementation Plan|TPL-001-PLAN|CIP-PLAN|CIP-SUPP-\d+[A-Z]?|PRC-006-WECC-\d+(?:\.\d+)?|[A-Z]{3}-\d+(?:-\d+)?(?:\.\d+)?[a-z]?|[A-Z]{3}-\d+-[A-Z]+(?:-\d+(?:\.\d+)?)?|[A-Z]{3}-\d+-[A-Z]+-\d+[A-Z]?|[A-Z]{3}-\d+-NPCC-\d+|[A-Z]{3}-\d+-SERC-\d+|[A-Z]{3}-\d+-WECC-\d+[A-Z]?|[A-Z]{3}-\d+-WECC-[A-Z]+-\d+)/
  );

  return match?.[1].replace(/_BC$/i, "").trim() ?? "";
}

function stripDesignation(title, designation) {
  if (!designation) {
    return title;
  }

  return title
    .replace(/^\([^)]*\)\s*/, "")
    .replace(new RegExp(`^${escapeRegExp(designation)}\\s*(?:BC|_BC)?\\s*-?\\s*`, "i"), "")
    .replace(/\s*\{.*?\}\s*$/g, "")
    .trim();
}

function normalizeDesignation(value) {
  return value.toUpperCase().replace(/\s+/g, " ").trim();
}

function normalizeTitle(value) {
  return value
    .toUpperCase()
    .replace(/\bBC\b/g, "")
    .replace(/\{.*?\}/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
