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
