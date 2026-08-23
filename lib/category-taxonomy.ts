import type { StandardRecord } from "@/lib/standards";

export const CATEGORY_PATH_DELIMITER = " > ";

export function getCategoryPath(standard: StandardRecord): string[] {
  if (standard.publisher === "AESO") {
    return getAesoCategoryPath(standard);
  }

  return [
    standard.publisher || "Unknown Publisher",
    standard.primary_category || "Uncategorized"
  ];
}

export function getCategoryKey(path: string[]) {
  return path.join(CATEGORY_PATH_DELIMITER);
}

export function formatCategoryPath(path: string[]) {
  return path.join(" / ");
}

function getAesoCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "AESO authoritative and guidance documents") {
    return ["AESO", "Collections", "Rules and Standards Portal"];
  }

  if (category === "AESO market and system rules") {
    return ["AESO", "ISO Rules", "Current ISO Rules", "Complete Set"];
  }

  if (category === "AESO restructured energy market rules") {
    return ["AESO", "ISO Rules", "REM ISO Rules", "Complete Set"];
  }

  if (category === "Alberta reliability standards") {
    return ["AESO", "Alberta Reliability Standards", "Complete Set"];
  }

  if (category === "AESO guidance documents") {
    return ["AESO", "Information Documents", "Collection"];
  }

  if (
    category ===
    "AESO information document - ISO Rules and Alberta Reliability Standards"
  ) {
    return [
      "AESO",
      "Information Documents",
      "ISO Rules and Alberta Reliability Standards"
    ];
  }

  if (category === "AESO authoritative document glossary") {
    return ["AESO", "Reference", "Glossary"];
  }

  if (category === "AESO connection requirements") {
    return ["AESO", "Technical Guidance", "Connection Requirements"];
  }

  if (category === "AESO modelling guidance") {
    return ["AESO", "Technical Guidance", "Modelling"];
  }

  if (category.startsWith("AESO ISO rule - ")) {
    return [
      "AESO",
      "ISO Rules",
      "Current ISO Rules",
      category.replace("AESO ISO rule - ", "")
    ];
  }

  if (category.startsWith("AESO REM ISO rule - ")) {
    return [
      "AESO",
      "ISO Rules",
      "REM ISO Rules",
      category.replace("AESO REM ISO rule - ", "")
    ];
  }

  if (category.startsWith("Alberta reliability standard - ")) {
    return [
      "AESO",
      "Alberta Reliability Standards",
      category.replace("Alberta reliability standard - ", "")
    ];
  }

  return ["AESO", "Other AESO Records", category || "Uncategorized"];
}
