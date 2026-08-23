import fs from "node:fs";
import path from "node:path";

export type StandardRecord = {
  standard_id: string;
  designation: string;
  title: string;
  publisher: string;
  record_type: string;
  country_scope: string;
  primary_category: string;
  latest_known_edition: string;
  status: string;
  mandatory_status: string;
  summary: string;
  official_url: string;
  source_download_url?: string;
  date_verified: string;
  verification_status: string;
  notes: string;
};

const DATA_DIR = path.join(process.cwd(), "data");

export function getStandards(): StandardRecord[] {
  return fs
    .readdirSync(DATA_DIR)
    .filter((fileName) => fileName.endsWith(".csv"))
    .sort((a, b) => a.localeCompare(b))
    .flatMap((fileName) => {
      const csv = fs.readFileSync(path.join(DATA_DIR, fileName), "utf8");
      return parseCsv(csv);
    });
}

export function getStandardById(standardId: string): StandardRecord | undefined {
  return getStandards().find((standard) => standard.standard_id === standardId);
}

function parseCsv(csv: string): StandardRecord[] {
  const lines = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]) as Array<keyof StandardRecord>;

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {} as StandardRecord);
  });
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
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
