import type { StandardRecord } from "@/lib/standards";

export const CATEGORY_PATH_DELIMITER = " > ";

export function getCategoryPath(standard: StandardRecord): string[] {
  if (standard.publisher === "AESO") {
    return getAesoCategoryPath(standard);
  }

  if (standard.publisher === "North American Electric Reliability Corporation") {
    return getNercCategoryPath(standard);
  }

  if (standard.publisher === "AUC") {
    return getAucCategoryPath(standard);
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

function getAucCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (standard.record_type === "historical_rule") {
    return ["Rules", "Historical / Not in Effect"];
  }

  if (
    [
      "AUC hearing and practice rules",
      "AUC intervener costs",
      "AUC decision review",
      "AUC negotiated settlements"
    ].includes(category)
  ) {
    return ["Rules", "Proceedings and Participation"];
  }

  if (
    [
      "AUC facility applications",
      "AUC noise control",
      "AUC municipal franchise agreements"
    ].includes(category)
  ) {
    return ["Rules", "Facility Applications and Operations"];
  }

  if (
    ["AUC micro-generation", "AUC wind and solar monitoring"].includes(category)
  ) {
    return ["Rules", "Distributed Energy and Generation"];
  }

  if (
    [
      "AUC service quality and reliability",
      "AUC service quality reporting"
    ].includes(category)
  ) {
    return ["Rules", "Service Quality and Reliability"];
  }

  if (
    [
      "AUC retail billing code",
      "AUC retail market information exchange",
      "AUC settlement system code",
      "AUC natural gas settlement code"
    ].includes(category)
  ) {
    return ["Rules", "Retail and Settlement Codes"];
  }

  if (
    [
      "AUC financial and operational reporting",
      "AUC regulatory accounting",
      "AUC financing and reporting exemptions"
    ].includes(category)
  ) {
    return ["Rules", "Financial and Operational Reporting"];
  }

  if (
    [
      "AUC water utility rate applications",
      "AUC utility rates costs",
      "AUC payment interest",
      "AUC administration fees",
      "AUC UCA administration fee"
    ].includes(category)
  ) {
    return ["Rules", "Rates Fees and Cost Recovery"];
  }

  if (
    [
      "AUC regulatory audits",
      "AUC administrative penalties",
      "AUC contravention proceeding costs",
      "AUC rule penalties"
    ].includes(category)
  ) {
    return ["Rules", "Compliance and Enforcement"];
  }

  if (
    [
      "AUC ISO rule process",
      "AUC ISO rule penalties",
      "AUC reliability standards penalties"
    ].includes(category)
  ) {
    return ["Rules", "ISO and Reliability Standards Oversight"];
  }

  return ["Other AUC Records", category.replace(/^AUC\s+/, "") || "Uncategorized"];
}
