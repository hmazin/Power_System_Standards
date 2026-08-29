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

  if (standard.publisher === "BCUC") {
    return getBcucCategoryPath(standard);
  }

  if (standard.publisher === "WECC") {
    return getWeccCategoryPath(standard);
  }

  if (standard.publisher === "BC Hydro") {
    return getBcHydroCategoryPath(standard);
  }

  if (standard.publisher === "IEEE") {
    return getIeeeCategoryPath(standard);
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

function getBcucCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "BCUC mandatory reliability standards implementation") {
    return ["Mandatory Reliability Standards", "Implementation Plans"];
  }

  if (category.startsWith("BCUC mandatory reliability standard - ")) {
    const family = category.replace("BCUC mandatory reliability standard - ", "");

    if (standard.record_type === "errata") {
      return ["Mandatory Reliability Standards", "Errata", family];
    }

    return ["Mandatory Reliability Standards", family];
  }

  return ["Other BCUC Records", category.replace(/^BCUC\s+/, "") || "Uncategorized"];
}

function getWeccCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "WECC regional reliability standard - Historical or superseded") {
    return ["Regional Reliability Standards", "Historical / Superseded"];
  }

  if (category === "WECC regional standards support") {
    return ["Regional Reliability Standards", "Support Documents"];
  }

  if (category.startsWith("WECC regional reliability standard - ")) {
    return [
      "Regional Reliability Standards",
      "Standards",
      category.replace("WECC regional reliability standard - ", "")
    ];
  }

  if (category.startsWith("WECC regional reliability variance - ")) {
    return [
      "Regional Reliability Standards",
      "Regional Variances",
      category.replace("WECC regional reliability variance - ", "")
    ];
  }

  if (category.startsWith("WECC regional criterion - ")) {
    return [
      "Regional Criteria",
      category.replace("WECC regional criterion - ", "")
    ];
  }

  if (category === "WECC regional criterion support") {
    return ["Regional Criteria", "Support Documents"];
  }

  if (category === "WECC standards procedure") {
    return ["Standards Procedures"];
  }

  return ["Other WECC Records", category.replace(/^WECC\s+/, "") || "Uncategorized"];
}

function getBcHydroCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;
  const recordType = standard.record_type;

  if (recordType === "information_bulletin") {
    return [
      "Distribution Standards and Guides",
      "Bulletins and Support",
      "Information Bulletins"
    ];
  }

  if (category === "BC Hydro distribution technical standards") {
    return ["Distribution Standards and Guides", "Overview"];
  }

  if (category === "BC Hydro overhead distribution standards") {
    return ["Distribution Standards and Guides", "Overhead Distribution (ES43)"];
  }

  if (category === "BC Hydro underground electrical standards") {
    return [
      "Distribution Standards and Guides",
      "Underground Electrical Distribution (ES53)"
    ];
  }

  if (category === "BC Hydro underground civil standards") {
    return [
      "Distribution Standards and Guides",
      "Underground Civil Distribution (ES54)"
    ];
  }

  if (
    category === "BC Hydro power quality standards" ||
    category === "BC Hydro customer equipment standards"
  ) {
    return [
      "Distribution Standards and Guides",
      "Power Quality and Customer Equipment (ES55)"
    ];
  }

  if (category === "BC Hydro primary service requirements") {
    return [
      "Distribution Standards and Guides",
      "Customer Service Requirements",
      "Primary Service"
    ];
  }

  if (category === "BC Hydro secondary service requirements") {
    return [
      "Distribution Standards and Guides",
      "Customer Service Requirements",
      "Secondary Service"
    ];
  }

  if (category === "BC Hydro revenue metering requirements") {
    return [
      "Distribution Standards and Guides",
      "Metering",
      "Revenue Metering"
    ];
  }

  if (category === "BC Hydro metering requirements") {
    return [
      "Distribution Standards and Guides",
      "Metering",
      "Accepted Metering Equipment"
    ];
  }

  if (category === "BC Hydro distribution technical publications") {
    return ["Distribution Standards and Guides", "Technical Publications"];
  }

  if (category === "BC Hydro class of work specifications") {
    return ["Distribution Standards and Guides", "Construction Work Specifications"];
  }

  if (category === "BC Hydro distribution generator interconnection") {
    if (["form", "agreement", "fact_sheet"].includes(recordType)) {
      return [
        "Interconnections",
        "Distribution Generator",
        "Forms Agreements and Support"
      ];
    }

    if (["amendment", "guidance"].includes(recordType)) {
      return [
        "Interconnections",
        "Distribution Generator",
        "Guidance and Amendments"
      ];
    }

    return [
      "Interconnections",
      "Distribution Generator",
      "Technical Requirements"
    ];
  }

  if (category === "BC Hydro closed transition transfer interconnection") {
    if (recordType === "standard") {
      return [
        "Interconnections",
        "Closed Transition Transfer",
        "Technical Requirements"
      ];
    }

    return ["Interconnections", "Closed Transition Transfer", "Forms and Support"];
  }

  if (category === "BC Hydro transmission generator interconnection") {
    if (["standard", "procedure"].includes(recordType)) {
      return [
        "Interconnections",
        "Transmission Generator",
        "Requirements and Procedures"
      ];
    }

    return ["Interconnections", "Transmission Generator", "Forms and Support"];
  }

  if (category === "BC Hydro transmission facility interconnection") {
    return ["Interconnections", "Transmission Facility", "Requirements"];
  }

  if (category === "BC Hydro transmission planning") {
    if (recordType === "methodology") {
      return ["Transmission", "Planning and Studies", "Methodologies"];
    }

    if (recordType === "procedure") {
      return ["Transmission", "Planning and Studies", "Planning Procedures"];
    }

    if (recordType === "form") {
      return ["Transmission", "Planning and Studies", "Forms"];
    }

    return ["Transmission", "Planning and Studies", "Guides and References"];
  }

  if (category === "BC Hydro system operating orders") {
    return ["Transmission", "System Operating Orders"];
  }

  if (category === "BC Hydro transmission tariff") {
    if (recordType === "tariff_attachment") {
      return ["Tariffs and Regulatory", "Open Access Transmission Tariff", "Attachments"];
    }

    if (recordType === "tariff_schedule") {
      return ["Tariffs and Regulatory", "Open Access Transmission Tariff", "Schedules"];
    }

    if (recordType === "tariff_supplement") {
      return ["Tariffs and Regulatory", "Open Access Transmission Tariff", "Supplements"];
    }

    if (recordType === "tariff_terms") {
      return [
        "Tariffs and Regulatory",
        "Open Access Transmission Tariff",
        "Terms and Conditions"
      ];
    }

    return ["Tariffs and Regulatory", "Open Access Transmission Tariff", "Core Tariff"];
  }

  if (category === "BC Hydro electric tariff") {
    if (recordType === "tariff_supplement") {
      return ["Tariffs and Regulatory", "Electric Tariff", "Supplements"];
    }

    return ["Tariffs and Regulatory", "Electric Tariff", "Core Tariff"];
  }

  return [
    "Other BC Hydro Records",
    category.replace(/^BC Hydro\s+/, "") || "Uncategorized"
  ];
}

function getIeeeCategoryPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category.startsWith("C57 transformers regulators and reactors - ")) {
    return [
      "Transformers Regulators and Reactors",
      "C57 Series",
      category.replace("C57 transformers regulators and reactors - ", "")
    ];
  }

  if (category.startsWith("C37 switchgear and protection equipment - ")) {
    return [
      "Switchgear and Protection Equipment",
      "C37 Series",
      category.replace("C37 switchgear and protection equipment - ", "")
    ];
  }

  if (category.startsWith("C62 surge arresters and surge protective devices - ")) {
    return [
      "Surge Arresters and Surge Protective Devices",
      "C62 Series",
      category.replace("C62 surge arresters and surge protective devices - ", "")
    ];
  }

  if (category.startsWith("1547 DER interconnection - ")) {
    return [
      "DER Interconnection",
      "1547 Series",
      category.replace("1547 DER interconnection - ", "")
    ];
  }

  if (category.startsWith("1584 arc-flash hazard - ")) {
    return [
      "Arc-Flash Hazard",
      "1584 Series",
      category.replace("1584 arc-flash hazard - ", "")
    ];
  }

  if (category.startsWith("2030 smart grid DERMS and microgrids - ")) {
    return [
      "Smart Grid DERMS and Microgrids",
      "2030 Series",
      category.replace("2030 smart grid DERMS and microgrids - ", "")
    ];
  }

  if (category.startsWith("2800 inverter-based resource interconnection - ")) {
    return [
      "Inverter-Based Resource Interconnection",
      "2800 Series",
      category.replace("2800 inverter-based resource interconnection - ", "")
    ];
  }

  if (category.startsWith("3000 industrial and commercial power systems - ")) {
    return [
      "Industrial and Commercial Power Systems",
      "3000 Series",
      category.replace("3000 industrial and commercial power systems - ", "")
    ];
  }

  if (category.startsWith("80/81/837 grounding and grounding connections - ")) {
    return [
      "Grounding and Grounding Connections",
      "IEEE 80/81/837",
      category.replace("80/81/837 grounding and grounding connections - ", "")
    ];
  }

  if (category.startsWith("18/824/1036 capacitors and reactive compensation - ")) {
    return [
      "Capacitors and Reactive Compensation",
      "IEEE 18/824/1036",
      category.replace("18/824/1036 capacitors and reactive compensation - ", "")
    ];
  }

  if (category.startsWith("cable systems and insulated conductors - ")) {
    return [
      "Cable Systems and Insulated Conductors",
      "IEEE Cable Systems",
      category.replace("cable systems and insulated conductors - ", "")
    ];
  }

  return ["Other IEEE Records", category.replace(/^IEEE\s+/, "") || "Uncategorized"];
}
