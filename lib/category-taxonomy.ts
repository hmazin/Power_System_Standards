import type { StandardRecord } from "@/lib/standards";

export const CATEGORY_PATH_DELIMITER = " > ";

export function getCategoryPath(standard: StandardRecord): string[] {
  if (standard.publisher === "AESO") {
    return getAesoCategoryPath(standard);
  }

  if (standard.publisher === "North American Electric Reliability Corporation") {
    return getNercCategoryPath(standard);
  }

  return [standard.primary_category || "Uncategorized"];
}

export function getCategoryKey(path: string[]) {
  return path.join(CATEGORY_PATH_DELIMITER);
}

export function formatCategoryPath(path: string[]) {
  return path.join(" / ");
}

function getAesoCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "AESO market and system rules") {
    return ["ISO Rules", "Current ISO Rules", "Complete Set"];
  }

  if (category === "AESO restructured energy market rules") {
    return ["ISO Rules", "REM ISO Rules", "Complete Set"];
  }

  if (category === "Alberta reliability standards") {
    return ["Alberta Reliability Standards", "Complete Set"];
  }

  if (
    category ===
    "AESO information document - ISO Rules and Alberta Reliability Standards"
  ) {
    return [
      "Information Documents",
      "ISO Rules and Alberta Reliability Standards"
    ];
  }

  if (category === "AESO authoritative document glossary") {
    return ["Reference", "Glossary"];
  }

  if (category === "AESO connection requirements") {
    return ["Technical Guidance", "Connection Requirements"];
  }

  if (category === "AESO modelling guidance") {
    return ["Technical Guidance", "Modelling"];
  }

  if (category.startsWith("AESO ISO rule - ")) {
    return [
      "ISO Rules",
      "Current ISO Rules",
      category.replace("AESO ISO rule - ", "")
    ];
  }

  if (category.startsWith("AESO REM ISO rule - ")) {
    return [
      "ISO Rules",
      "REM ISO Rules",
      category.replace("AESO REM ISO rule - ", "")
    ];
  }

  if (category.startsWith("Alberta reliability standard - ")) {
    return [
      "Alberta Reliability Standards",
      category.replace("Alberta reliability standard - ", "")
    ];
  }

  return ["Other AESO Records", category || "Uncategorized"];
}

function getNercCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "Bulk electric system reliability") {
    return ["Reliability Standards", "Complete Set"];
  }

  if (category === "Bulk electric system reliability definitions") {
    return ["Reference", "Definitions"];
  }

  if (category === "Bulk electric system reliability reference") {
    return ["Reference", "Implementation and Compliance Links"];
  }

  if (category === "Bulk electric system reliability applicability") {
    return ["Reference", "US Effective Date Status"];
  }

  if (category === "Bulk electric system reliability compliance") {
    return ["Reference", "VRF and VSL"];
  }

  if (category.startsWith("NERC ")) {
    return ["Reliability Standards", category.replace("NERC ", "")];
  }

  return ["Other NERC Records", category || "Uncategorized"];
}
