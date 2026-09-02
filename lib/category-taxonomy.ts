import type { StandardRecord } from "@/lib/standards";

export const CATEGORY_PATH_DELIMITER = " > ";

export function getCategoryPath(standard: StandardRecord): string[] {
  return getCategoryPaths(standard)[0];
}

export function getCategoryPaths(standard: StandardRecord): string[][] {
  if (standard.publisher === "IEEE") {
    return getIeeeCategoryPaths(standard);
  }

  return [getSingleCategoryPath(standard)];
}

function getSingleCategoryPath(standard: StandardRecord): string[] {
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

export const IEEE_ENGINEERING_CATEGORIES = [
  "01 - Power System Planning, Design, Studies, and Ratings",
  "02 - Power System Reliability, Availability, and Resilience",
  "03 - Power Generation and Nuclear Plant Electrical Systems",
  "04 - DER and Grid Interconnection",
  "05 - Batteries, Energy Storage, and DC Systems",
  "06 - Power Electronics, HVDC, and FACTS",
  "07 - Electric Machinery and Excitation Systems",
  "08 - Transformers, Regulators, and Reactors",
  "09 - Substations",
  "10 - Switchgear, Protection, and Relaying",
  "11 - Transmission and Distribution Lines",
  "12 - Cable Systems and Insulated Conductors",
  "13 - Grounding and Bonding",
  "14 - Insulation, Surge Protection, and High-Voltage Testing",
  "15 - Capacitors and Reactive Power Compensation",
  "16 - Power Quality",
  "17 - Power System Instrumentation, Measurement, and Metering",
  "18 - Communications, SCADA, IEDs, and Cybersecurity",
  "19 - Electrical Safety Codes and Work Practices",
  "20 - Industrial, Commercial, and Special Applications",
  "21 - Transportation and Traction Power",
  "22 - Electrical Documentation and Symbols",
  "23 - EMC, EMI, and EMF Safety",
  "24 - Software and Systems Engineering"
] as const;

const IEEE_CATEGORY = {
  planning: IEEE_ENGINEERING_CATEGORIES[0],
  reliability: IEEE_ENGINEERING_CATEGORIES[1],
  generation: IEEE_ENGINEERING_CATEGORIES[2],
  interconnection: IEEE_ENGINEERING_CATEGORIES[3],
  batteries: IEEE_ENGINEERING_CATEGORIES[4],
  powerElectronics: IEEE_ENGINEERING_CATEGORIES[5],
  machinery: IEEE_ENGINEERING_CATEGORIES[6],
  transformers: IEEE_ENGINEERING_CATEGORIES[7],
  substations: IEEE_ENGINEERING_CATEGORIES[8],
  switchgear: IEEE_ENGINEERING_CATEGORIES[9],
  lines: IEEE_ENGINEERING_CATEGORIES[10],
  cables: IEEE_ENGINEERING_CATEGORIES[11],
  grounding: IEEE_ENGINEERING_CATEGORIES[12],
  insulation: IEEE_ENGINEERING_CATEGORIES[13],
  capacitors: IEEE_ENGINEERING_CATEGORIES[14],
  powerQuality: IEEE_ENGINEERING_CATEGORIES[15],
  instrumentation: IEEE_ENGINEERING_CATEGORIES[16],
  communications: IEEE_ENGINEERING_CATEGORIES[17],
  safety: IEEE_ENGINEERING_CATEGORIES[18],
  applications: IEEE_ENGINEERING_CATEGORIES[19],
  transportation: IEEE_ENGINEERING_CATEGORIES[20],
  documentation: IEEE_ENGINEERING_CATEGORIES[21],
  emc: IEEE_ENGINEERING_CATEGORIES[22],
  software: IEEE_ENGINEERING_CATEGORIES[23]
} as const;

const IEEE_SUBSTATION_CROSS_CATEGORY_NUMBERS = [
  "80",
  "525",
  "837",
  "C37.121",
  "C37.122",
  "C37.122.1",
  "C37.122.2",
  "C37.122.3",
  "C37.122.5",
  "C37.122.7",
  "C37.122.8",
  "C37.123"
];

const IEEE_POWER_ELECTRONICS_CROSS_CATEGORY_NUMBERS = [
  "857",
  "1031",
  "1052",
  "1124",
  "1158",
  "1204",
  "1240",
  "1303",
  "1378",
  "1409",
  "1534",
  "1585",
  "1623",
  "1676"
];

function getIeeeCategoryPaths(standard: StandardRecord): string[][] {
  const familyPath = getIeeeFamilyPath(standard);
  const designation = ieeeDesignationWithoutPublisher(standard.designation);
  const category = standard.primary_category;
  const categoryLower = category.toLowerCase();
  const categories = [getIeeePrimaryEngineeringCategory(category)];

  if (
    IEEE_SUBSTATION_CROSS_CATEGORY_NUMBERS.some((standardNumber) =>
      matchesIeeeStandardNumber(designation, standardNumber)
    )
  ) {
    categories.push(IEEE_CATEGORY.substations);
  }

  if (matchesIeeeStandardNumber(designation, "1246")) {
    categories.push(IEEE_CATEGORY.grounding);
  }

  if (
    categoryLower.includes("instrument transformers") ||
    ["C37.118", "1459", "644"].some((standardNumber) =>
      matchesIeeeStandardNumber(designation, standardNumber)
    ) ||
    (/^C(?:63|95)\b/i.test(designation) &&
      /measurement|instrumentation|computation/.test(categoryLower))
  ) {
    categories.push(IEEE_CATEGORY.instrumentation);
  }

  if (
    IEEE_POWER_ELECTRONICS_CROSS_CATEGORY_NUMBERS.some((standardNumber) =>
      matchesIeeeStandardNumber(designation, standardNumber)
    )
  ) {
    categories.push(IEEE_CATEGORY.powerElectronics);
  }

  if (category.startsWith("arc flash hazard analysis - ")) {
    categories.push(IEEE_CATEGORY.safety);
  }

  if (category.startsWith("3000 industrial and commercial power systems - ")) {
    categories.push(IEEE_CATEGORY.applications);
  }

  if (
    category.startsWith("1547 DER interconnection - Energy Storage") ||
    category.startsWith("2030 smart grid DERMS and microgrids - Energy Storage")
  ) {
    categories.push(IEEE_CATEGORY.batteries);
  }

  if (matchesIeeeStandardNumber(designation, "2030.100")) {
    categories.push(IEEE_CATEGORY.communications);
  }

  if (categoryLower.includes("class 1e motors")) {
    categories.push(IEEE_CATEGORY.machinery);
  }

  if (categoryLower.includes("nuclear cables")) {
    categories.push(IEEE_CATEGORY.cables);
  }

  if (categoryLower.includes("class 1e switchgear")) {
    categories.push(IEEE_CATEGORY.switchgear);
  }

  if (categoryLower.includes("nuclear standby power supplies")) {
    categories.push(IEEE_CATEGORY.machinery);
  }

  if (
    category.startsWith("C95 electromagnetic field human exposure safety - ") &&
    /symbols|hazard communication/.test(categoryLower)
  ) {
    categories.push(IEEE_CATEGORY.documentation);
  }

  return [...new Set(categories)].map((engineeringCategory) => [
    engineeringCategory,
    ...familyPath.slice(1)
  ]);
}

function getIeeePrimaryEngineeringCategory(category: string): string {
  if (
    category === "Utility safety code" ||
    category.startsWith("electrical safety codes - ")
  ) {
    return IEEE_CATEGORY.safety;
  }

  if (category.startsWith("C57 transformers regulators and reactors - ")) {
    return IEEE_CATEGORY.transformers;
  }

  if (category.startsWith("C37 switchgear and protection equipment - ")) {
    return IEEE_CATEGORY.switchgear;
  }

  if (category.startsWith("C62 surge arresters and surge protective devices - ")) {
    return IEEE_CATEGORY.insulation;
  }

  if (
    category.startsWith("C63 electromagnetic compatibility and radio-noise measurements - ") ||
    category.startsWith("C95 electromagnetic field human exposure safety - ")
  ) {
    return IEEE_CATEGORY.emc;
  }

  if (
    category.startsWith("C135 overhead line and pole-line hardware - ") ||
    category.startsWith("overhead transmission lines - ")
  ) {
    return IEEE_CATEGORY.lines;
  }

  if (category.startsWith("transportation and traction power - ")) {
    return IEEE_CATEGORY.transportation;
  }

  if (category.startsWith("communications SCADA and IED cybersecurity - ")) {
    return IEEE_CATEGORY.communications;
  }

  if (
    category.startsWith("1547 DER interconnection - ") ||
    category.startsWith("2030 smart grid DERMS and microgrids - ") ||
    category.startsWith("2800 inverter-based resource interconnection - ")
  ) {
    return IEEE_CATEGORY.interconnection;
  }

  if (category.startsWith("arc flash hazard analysis - ")) {
    return IEEE_CATEGORY.planning;
  }

  if (category.startsWith("battery and dc systems - ")) {
    return IEEE_CATEGORY.batteries;
  }

  if (category.startsWith("3000 industrial and commercial power systems - ")) {
    if (category.endsWith("Power Systems Grounding")) {
      return IEEE_CATEGORY.grounding;
    }

    if (category.endsWith("Protection and Coordination")) {
      return IEEE_CATEGORY.switchgear;
    }

    if (
      category.endsWith("Power Systems Analysis") ||
      category.endsWith("Power Systems Design")
    ) {
      return IEEE_CATEGORY.planning;
    }

    return IEEE_CATEGORY.applications;
  }

  if (category.startsWith("reliability and availability - ")) {
    return IEEE_CATEGORY.reliability;
  }

  if (
    category.startsWith("grounding and grounding connections - ") ||
    category.startsWith("80/81/837 grounding and grounding connections - ")
  ) {
    return IEEE_CATEGORY.grounding;
  }

  if (
    category.startsWith("capacitors - ") ||
    category.startsWith("reactive power compensation - ")
  ) {
    return IEEE_CATEGORY.capacitors;
  }

  if (category.startsWith("heat tracing - ")) {
    return IEEE_CATEGORY.applications;
  }

  if (category.startsWith("cable systems and insulated conductors - ")) {
    return IEEE_CATEGORY.cables;
  }

  if (category.startsWith("substation design and operations - ")) {
    return IEEE_CATEGORY.substations;
  }

  if (category.startsWith("power quality and harmonics - ")) {
    return IEEE_CATEGORY.powerQuality;
  }

  if (category.startsWith("nuclear power electrical equipment - ")) {
    return IEEE_CATEGORY.generation;
  }

  if (
    category.startsWith("electric generators and excitation systems - ") ||
    category.startsWith("electric motors and motor applications - ") ||
    category.startsWith("rotating machine testing insulation and diagnostics - ")
  ) {
    return IEEE_CATEGORY.machinery;
  }

  return "Other IEEE Records";
}

function ieeeDesignationWithoutPublisher(designation: string): string {
  return designation.replace(
    /^(?:IEEE\/ANSI\/USEMCSC|ANSI\/IEEE|IEEE\/ANSI|ANSI\/USEMCSC|IEEE\/IEC|IEC\/IEEE|IEEE\/CSA|CSA\/IEEE|IEEE\/NACE|NACE\/IEEE|IEEE\/AMPP|AMPP\/IEEE|IEEE|ANSI)\s+(?:Std\s+)?/i,
    ""
  );
}

function matchesIeeeStandardNumber(designation: string, standardNumber: string) {
  return new RegExp(
    `^${escapeCategoryRegExp(standardNumber)}(?:[a-z]|\\.|-|/|$)`,
    "i"
  ).test(designation);
}

function escapeCategoryRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getIeeeFamilyPath(standard: StandardRecord): string[] {
  const category = standard.primary_category;

  if (category === "Utility safety code") {
    return ["Electrical Safety Codes", "IEEE C2", "National Electrical Safety Code"];
  }

  if (category.startsWith("electrical safety codes - ")) {
    return [
      "Electrical Safety Codes",
      "IEEE C2",
      category.replace("electrical safety codes - ", "")
    ];
  }

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

  if (category.startsWith("C63 electromagnetic compatibility and radio-noise measurements - ")) {
    return [
      "Electromagnetic Compatibility and Radio-Noise Measurements",
      "C63 Series",
      category.replace("C63 electromagnetic compatibility and radio-noise measurements - ", "")
    ];
  }

  if (category.startsWith("C95 electromagnetic field human exposure safety - ")) {
    return [
      "Electromagnetic Field Human Exposure Safety",
      "C95 Series",
      category.replace("C95 electromagnetic field human exposure safety - ", "")
    ];
  }

  if (category.startsWith("C135 overhead line and pole-line hardware - ")) {
    return [
      "Overhead Line and Pole-Line Hardware",
      "C135 Series",
      category.replace("C135 overhead line and pole-line hardware - ", "")
    ];
  }

  if (category.startsWith("overhead transmission lines - ")) {
    return [
      "Overhead Transmission Lines",
      "IEEE Overhead Transmission Lines",
      category.replace("overhead transmission lines - ", "")
    ];
  }

  if (category.startsWith("transportation and traction power - ")) {
    return [
      "Transportation and Traction Power",
      "IEEE Transportation and Traction Power",
      category.replace("transportation and traction power - ", "")
    ];
  }

  if (category.startsWith("communications SCADA and IED cybersecurity - ")) {
    return [
      "Communications SCADA and IED Cybersecurity",
      "IEEE Communications SCADA and IED Cybersecurity",
      category.replace("communications SCADA and IED cybersecurity - ", "")
    ];
  }

  if (category.startsWith("1547 DER interconnection - ")) {
    return [
      "DER Interconnection",
      "1547 Series",
      category.replace("1547 DER interconnection - ", "")
    ];
  }

  if (category.startsWith("arc flash hazard analysis - ")) {
    return [
      "Arc Flash Hazard Analysis",
      "IEEE Arc Flash Hazard Analysis",
      category.replace("arc flash hazard analysis - ", "")
    ];
  }

  if (category.startsWith("2030 smart grid DERMS and microgrids - ")) {
    return [
      "Smart Grid DERMS and Microgrids",
      "2030 Series",
      category.replace("2030 smart grid DERMS and microgrids - ", "")
    ];
  }

  if (category.startsWith("battery and dc systems - ")) {
    return [
      "Batteries and DC Systems",
      "IEEE Batteries and DC Systems",
      category.replace("battery and dc systems - ", "")
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

  if (category.startsWith("reliability and availability - ")) {
    return [
      "Reliability and Availability",
      "IEEE Reliability and Availability",
      category.replace("reliability and availability - ", "")
    ];
  }

  if (category.startsWith("grounding and grounding connections - ")) {
    return [
      "Grounding and Grounding Connections",
      "IEEE Grounding",
      category.replace("grounding and grounding connections - ", "")
    ];
  }

  if (category.startsWith("80/81/837 grounding and grounding connections - ")) {
    return [
      "Grounding and Grounding Connections",
      "IEEE Grounding",
      category.replace("80/81/837 grounding and grounding connections - ", "")
    ];
  }

  if (category.startsWith("capacitors - ")) {
    return [
      "Capacitors",
      "IEEE Capacitors",
      category.replace("capacitors - ", "")
    ];
  }

  if (category.startsWith("reactive power compensation - ")) {
    return [
      "Reactive Power Compensation",
      "IEEE Reactive Power Compensation",
      category.replace("reactive power compensation - ", "")
    ];
  }

  if (category.startsWith("heat tracing - ")) {
    return [
      "Heat Tracing",
      "IEEE Heat Tracing",
      category.replace("heat tracing - ", "")
    ];
  }

  if (category.startsWith("cable systems and insulated conductors - ")) {
    return [
      "Cable Systems and Insulated Conductors",
      "IEEE Cable Systems",
      category.replace("cable systems and insulated conductors - ", "")
    ];
  }

  if (category.startsWith("substation design and operations - ")) {
    return [
      "Substations",
      "IEEE Substations",
      category.replace("substation design and operations - ", "")
    ];
  }

  if (category.startsWith("power quality and harmonics - ")) {
    return [
      "Power Quality and Harmonics",
      "IEEE Power Quality",
      category.replace("power quality and harmonics - ", "")
    ];
  }

  if (category.startsWith("nuclear power electrical equipment - ")) {
    return [
      "Nuclear Power Electrical Equipment",
      "IEEE Nuclear Power Electrical Equipment",
      category.replace("nuclear power electrical equipment - ", "")
    ];
  }

  if (category.startsWith("electric generators and excitation systems - ")) {
    return [
      "Electric Generators and Excitation Systems",
      "IEEE Electric Generators",
      category.replace("electric generators and excitation systems - ", "")
    ];
  }

  if (category.startsWith("electric motors and motor applications - ")) {
    return [
      "Electric Motors and Motor Applications",
      "IEEE Electric Motors",
      category.replace("electric motors and motor applications - ", "")
    ];
  }

  if (category.startsWith("rotating machine testing insulation and diagnostics - ")) {
    return [
      "Rotating Machine Testing Insulation and Diagnostics",
      "IEEE Rotating Machine Testing",
      category.replace("rotating machine testing insulation and diagnostics - ", "")
    ];
  }

  return ["Other IEEE Records", category.replace(/^IEEE\s+/, "") || "Uncategorized"];
}
