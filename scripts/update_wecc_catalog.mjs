import fs from "node:fs";
import path from "node:path";

const WECC_ROOT = "https://www.wecc.org";
const STANDARDS_URL = `${WECC_ROOT}/program-areas/standards`;
const dataPath = path.join(process.cwd(), "data", "wecc_standards.csv");

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
  ["COM", "Communications"],
  ["FAC", "Facilities Design, Connections, and Maintenance"],
  ["INT", "Interchange Scheduling and Coordination"],
  ["IRO", "Interconnection Reliability Operations and Coordination"],
  ["PRC", "Protection and Control"],
  ["TPL", "Transmission Planning"],
  ["VAR", "Voltage and Reactive"],
]);

const sections = [
  {
    heading: "Approved Regional Standards, Variances, and Interpretations",
    sourceLabel: "Approved Regional Standards, Variances, and Interpretations",
    defaultRecordType: "regional_standard",
  },
  {
    heading: "Approved Regional Criteria",
    sourceLabel: "Approved Regional Criteria",
    defaultRecordType: "regional_criterion",
  },
  {
    heading: "Policies And Procedures",
    sourceLabel: "Policies And Procedures",
    defaultRecordType: "procedure",
    includeTitles: new Set([
      "Table Revision Process Effective 01-01-2025",
      "WECC Reliability Standards Development Procedures - FERC Approved 09-13-2021",
    ]),
  },
];

const supersededBy = new Map([
  ["BAL-004-WECC-3", "BAL-004-WECC-4"],
  ["FAC-501-WECC-2", "FAC-501-WECC-4"],
  ["IRO-002-6", "IRO-002-7"],
  ["PRC-006-3", "PRC-006-5"],
]);

const specialRecords = new Map([
  [
    "Table Revision Process with Attachment A, Major WECC Transfer Paths in the BES",
    {
      designation: "WECC Table Revision Process - Attachment A",
      title: "Major WECC Transfer Paths in the BES",
      idSlug: "TABLE-REVISION-PROCESS-ATTACHMENT-A",
      record_type: "standards_support_document",
      primary_category: "WECC regional standards support",
      summary:
        "WECC support document for the table revision process and Attachment A major transfer paths in the Bulk Electric System.",
    },
  ],
  [
    "Attachment A Reporting Form",
    {
      designation: "Attachment A Reporting Form",
      title: "Regional Criteria Attachment A Reporting Form",
      idSlug: "ATTACHMENT-A-REPORTING-FORM",
      record_type: "criteria_support_document",
      primary_category: "WECC regional criterion support",
      summary:
        "WECC reporting form associated with regional criteria support documentation.",
    },
  ],
  [
    "INT Consolidated Criterion WECC-0153",
    {
      designation: "WECC-0153",
      title: "INT Consolidated Criterion",
      idSlug: "0153",
      family: "INT",
    },
  ],
  [
    "FAC-011-2 System Operating Limits Methodology for the Operations Horizion",
    {
      title: "System Operating Limits Methodology for the Operations Horizon",
    },
  ],
  [
    "FAC-501-WECC-4 Transmission Maintenance",
    {
      latest_known_edition: "2025-01-01",
    },
  ],
  [
    "IRO-002-6 RC - Monitoring and Analysis - RV Effective January 1, 2020",
    {
      title: "Reliability Coordination - Monitoring and Analysis - Regional Variance",
    },
  ],
  [
    "IRO-002-7 Reliability Coordination - Monitoring and Analysis - RV Effective January 1, 2020",
    {
      title: "Reliability Coordination - Monitoring and Analysis - Regional Variance",
    },
  ],
  [
    "PRC-006-3 Automatic Underfrequency Load Shedding WECC Variance",
    {
      title: "Automatic Underfrequency Load Shedding WECC Regional Variance",
    },
  ],
  [
    "PRC-006-5 WECC RV - Effective 7/1/2021",
    {
      title: "Automatic Underfrequency Load Shedding WECC Regional Variance",
    },
  ],
  [
    "PRC-006-WECC-3.1 Underfrequency Load Shedding",
    {
      latest_known_edition: "2019-06-18",
    },
  ],
  [
    "Table Revision Process Effective 01-01-2025",
    {
      designation: "WECC Table Revision Process",
      title: "Table Revision Process",
      idSlug: "TABLE-REVISION-PROCESS",
      latest_known_edition: "2025-01-01",
      record_type: "procedure",
      primary_category: "WECC standards procedure",
      summary:
        "WECC procedure for revising standards-related tables, effective January 1 2025.",
    },
  ],
  [
    "WECC Reliability Standards Development Procedures - FERC Approved 09-13-2021",
    {
      designation: "WECC Reliability Standards Development Procedures",
      title: "Reliability Standards Development Procedures",
      idSlug: "RELIABILITY-STANDARDS-DEVELOPMENT-PROCEDURES",
      latest_known_edition: "2021-09-13",
      record_type: "procedure",
      primary_category: "WECC standards procedure",
      summary:
        "WECC procedures for developing regional reliability standards and related standards documents.",
    },
  ],
]);

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const html = await fetchText(STANDARDS_URL);
  const sourceRows = sections.flatMap((section) =>
    parseSectionRows(html, section).map((row) => ({ ...row, section }))
  );

  const rows = [];
  for (const sourceRow of sourceRows) {
    const detail = await fetchDocumentDetail(sourceRow.official_url);
    rows.push(toStandardRow(sourceRow, detail));
  }

  const sortedRows = rows.sort((a, b) => a.standard_id.localeCompare(b.standard_id));
  fs.writeFileSync(dataPath, toCsv(sortedRows), "utf8");

  console.log(`wecc_records=${sortedRows.length}`);
  console.log(
    `direct_downloads=${sortedRows.filter((row) => row.source_download_url).length}`
  );
  console.log(
    `record_types=${[...new Set(sortedRows.map((row) => row.record_type))]
      .sort()
      .map(
        (type) =>
          `${type}:${sortedRows.filter((row) => row.record_type === type).length}`
      )
      .join(",")}`
  );
}

function parseSectionRows(html, section) {
  const headingIndex = html.indexOf(section.heading);
  if (headingIndex < 0) {
    throw new Error(`Could not find WECC section: ${section.heading}`);
  }

  const tbodyStart = html.indexOf("<tbody>", headingIndex);
  const tbodyEnd = html.indexOf("</tbody>", tbodyStart);
  if (tbodyStart < 0 || tbodyEnd < 0) {
    throw new Error(`Could not find table body for WECC section: ${section.heading}`);
  }

  const tbody = html.slice(tbodyStart, tbodyEnd);
  return [...tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) => parseTableRow(match[1], section))
    .filter(Boolean);
}

function parseTableRow(rowHtml, section) {
  const titleCell = extractCell(rowHtml, "title");
  const titleLink = titleCell.match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  if (!titleLink) {
    return null;
  }

  const title = stripHtml(titleLink[2]);
  if (section.includeTitles && !section.includeTitles.has(title)) {
    return null;
  }

  const fileType = stripHtml(extractCell(rowHtml, "file-type"));
  const modifiedDate =
    extractCell(rowHtml, "changed").match(/<time\b[^>]*>([^<]+)<\/time>/i)?.[1] ??
    "";

  return {
    fileType,
    sourceTitle: title,
    modifiedDate,
    official_url: absolutize(decodeHtml(titleLink[1])),
  };
}

async function fetchDocumentDetail(url) {
  const html = await fetchText(url);
  const anchors = parseAnchors(html);
  const download = anchors.find((anchor) =>
    /^Download\s+(PDF|Excel|Word)\s+Document$/i.test(anchor.text)
  );
  const text = stripHtml(html);

  return {
    source_download_url: download ? absolutize(download.href) : "",
    categorizationPolicy: extractTextField(text, "Categorization Policy"),
    status: extractTextField(text, "WECC Status"),
    documentType: extractTextField(text, "Document type"),
  };
}

function toStandardRow(sourceRow, detail) {
  const special = specialRecords.get(sourceRow.sourceTitle) ?? {};
  const parsed = splitDesignationAndTitle(sourceRow.sourceTitle);
  const designation = special.designation ?? parsed.designation;
  const title = special.title ?? parsed.title;
  const family = special.family ?? getFamily(designation, sourceRow.sourceTitle);
  const familyDescription = familyDescriptions.get(family) ?? family;
  const effectiveDate =
    special.latest_known_edition ||
    parseEffectiveDate(sourceRow.sourceTitle) ||
    sourceRow.modifiedDate;
  const recordType =
    special.record_type ??
    getRecordType(sourceRow.section.defaultRecordType, designation, sourceRow.sourceTitle);
  const primaryCategory =
    special.primary_category ?? getPrimaryCategory(recordType, familyDescription);
  const summary =
    special.summary ??
    getSummary(recordType, designation, title, family, familyDescription);
  const notes = [
    `Extracted from WECC Standards page section: ${sourceRow.section.sourceLabel}.`,
    sourceRow.modifiedDate ? `WECC source listed modified date ${sourceRow.modifiedDate}.` : "",
    detail.status ? `WECC document status: ${detail.status}.` : "",
    detail.categorizationPolicy
      ? `WECC categorization policy: ${detail.categorizationPolicy}.`
      : "",
    supersededBy.has(designation)
      ? `Classified as historical because WECC also lists ${supersededBy.get(
          designation
        )} with a later effective date.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    standard_id: `WECC-${special.idSlug ?? slugify(designation)}`,
    designation,
    title,
    publisher: "WECC",
    record_type: recordType,
    country_scope: "Western Interconnection",
    primary_category: primaryCategory,
    latest_known_edition: effectiveDate,
    applicability: getApplicability(recordType),
    summary,
    official_url: sourceRow.official_url,
    source_download_url: detail.source_download_url,
    notes,
  };
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${url}`);
  }
  return response.text();
}

function extractCell(rowHtml, fieldClass) {
  return (
    rowHtml.match(
      new RegExp(
        `<td[^>]*views-field-${escapeRegExp(fieldClass)}[^>]*>([\\s\\S]*?)<\\/td>`,
        "i"
      )
    )?.[1] ?? ""
  );
}

function parseAnchors(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map(
    (match) => ({
      href: decodeHtml(match[1]),
      text: stripHtml(match[2]),
    })
  );
}

function splitDesignationAndTitle(sourceTitle) {
  const cleanTitle = sourceTitle
    .replace(/\s*-\s*Effective\s+.+$/i, "")
    .replace(/\s+Effective\s+(\d{1,2}\/\d{1,2}\/\d{4}|[A-Za-z]+ \d{1,2}, \d{4}).*$/i, "")
    .replace(/\s*\{Effective date:[^}]+\}/i, "")
    .trim();

  const criterionMatch = cleanTitle.match(/^(.+?)\s+(WECC-\d+)$/);
  if (criterionMatch) {
    return {
      designation: criterionMatch[2],
      title: criterionMatch[1],
    };
  }

  const standardMatch = cleanTitle.match(
    /^([A-Z]{3}-\d{3}(?:-[A-Z]+)?(?:-[A-Z]{3})?(?:-\d+(?:\.\d+)?[A-Za-z]?)?)\s+(.+)$/
  );
  if (standardMatch) {
    return {
      designation: standardMatch[1],
      title: standardMatch[2].replace(/\s+-\s+$/g, "").trim(),
    };
  }

  return {
    designation: cleanTitle,
    title: cleanTitle,
  };
}

function getRecordType(defaultRecordType, designation, sourceTitle) {
  if (supersededBy.has(designation)) {
    return "historical_regional_standard";
  }

  if (/variance|\bRV\b/i.test(sourceTitle)) {
    return "regional_variance";
  }

  return defaultRecordType;
}

function getPrimaryCategory(recordType, familyDescription) {
  if (recordType === "historical_regional_standard") {
    return "WECC regional reliability standard - Historical or superseded";
  }

  if (recordType === "regional_variance") {
    return `WECC regional reliability variance - ${familyDescription}`;
  }

  if (recordType === "regional_criterion") {
    return `WECC regional criterion - ${familyDescription}`;
  }

  if (recordType === "procedure") {
    return "WECC standards procedure";
  }

  return `WECC regional reliability standard - ${familyDescription}`;
}

function getSummary(recordType, designation, title, family, familyDescription) {
  if (recordType === "regional_criterion") {
    return `WECC regional criterion in the ${family} family addressing ${title.toLowerCase()} for the Western Interconnection.`;
  }

  if (recordType === "regional_variance") {
    return `WECC regional variance in the ${family} family related to ${title.toLowerCase()} for the Western Interconnection.`;
  }

  if (recordType === "historical_regional_standard") {
    return `Historical WECC regional reliability standard in the ${family} family addressing ${title.toLowerCase()}; a newer WECC-listed version is tracked separately.`;
  }

  return `WECC regional reliability standard in the ${family} family addressing ${title.toLowerCase()} for ${familyDescription.toLowerCase()} requirements.`;
}

function getApplicability(recordType) {
  if (recordType === "historical_regional_standard") {
    return "Historical WECC regional reliability requirement; newer version tracked separately where listed by WECC";
  }

  if (recordType === "regional_criterion" || recordType === "criteria_support_document") {
    return "WECC regional criteria or supporting material for the Western Interconnection where applicable";
  }

  if (recordType === "procedure" || recordType === "standards_support_document") {
    return "WECC standards procedure or supporting document";
  }

  return "WECC regional reliability requirement or variance for the Western Interconnection where approved by the applicable authority";
}

function getFamily(designation, sourceTitle) {
  return (
    designation.match(/^([A-Z]{3})/)?.[1] ??
    sourceTitle.match(/^([A-Z]{3})\b/)?.[1] ??
    "Reference"
  );
}

function parseEffectiveDate(value) {
  const text = value ?? "";
  const named = text.match(/Effective(?: date:)?\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/i);
  if (named) {
    return `${named[3]}-${monthNumber(named[1])}-${named[2].padStart(2, "0")}`;
  }

  const slash = text.match(/Effective(?: date:)?\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (slash) {
    return `${slash[3]}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`;
  }

  const dashed = text.match(/Effective(?: date:)?\s+(\d{2})-(\d{2})-(\d{4})/i);
  if (dashed) {
    return `${dashed[3]}-${dashed[1]}-${dashed[2]}`;
  }

  return "";
}

function monthNumber(monthName) {
  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ].indexOf(monthName.toLowerCase());

  if (month < 0) {
    throw new Error(`Unknown month: ${monthName}`);
  }

  return String(month + 1).padStart(2, "0");
}

function extractTextField(text, label) {
  const labels = [
    "File Type",
    "Categorization Policy",
    "Committee",
    "Owner Group",
    "WECC Status",
    "Related Standards Project",
    "Accordion location",
    "Document type",
  ];
  const nextLabels = labels.filter((item) => item !== label).map(escapeRegExp).join("|");
  const match = text.match(new RegExp(`${escapeRegExp(label)}\\s+(.+?)(?=\\s+(?:${nextLabels})\\s+|$)`, "i"));
  return match?.[1]?.trim() ?? "";
}

function absolutize(url) {
  if (!url) {
    return "";
  }
  return url.startsWith("http") ? url : new URL(url, WECC_ROOT).toString();
}

function stripHtml(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, "\"");
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

function slugify(value) {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
