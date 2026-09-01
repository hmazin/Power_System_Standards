import fs from "node:fs";
import path from "node:path";

const IEEE_ROOT = "https://standards.ieee.org";
const SITEMAP_INDEX_URL = `${IEEE_ROOT}/wp-sitemap.xml`;
const DATA_PATH = path.join(process.cwd(), "data", "ieee_standards.csv");
const FETCH_TIMEOUT_MS = 30000;
const FETCH_ATTEMPTS = 4;
const PAGE_CONCURRENCY = 4;
const SUPPLEMENTAL_STANDARD_URLS = [
  "https://standards.ieee.org/ieee/C2/10814",
  "https://standards.ieee.org/ieee/C37.66/4937",
  "https://standards.ieee.org/ieee/C63.2/11340",
  "https://standards.ieee.org/ieee/C63.4/5841",
  "https://standards.ieee.org/ieee/C63.9/11615",
  "https://standards.ieee.org/ieee/C63.10/10445",
  "https://standards.ieee.org/ieee/C63.10a/11614",
  "https://standards.ieee.org/ieee/C63.10-2020_Cor1/10915",
  "https://standards.ieee.org/ieee/C63.14/10910",
  "https://standards.ieee.org/ieee/C63.22/2912",
  "https://standards.ieee.org/ieee/C63.24/10513",
  "https://standards.ieee.org/ieee/C63.25.2/11463",
  "https://standards.ieee.org/ieee/C63.27/10662",
  "https://standards.ieee.org/ieee/1584/5802",
  "https://standards.ieee.org/ieee/1584.1/7468",
  "https://standards.ieee.org/ieee/1584.2/11030",
  "https://standards.ieee.org/ieee/493/3402",
  "https://standards.ieee.org/ieee/762/6856",
  "https://standards.ieee.org/ieee/859/6196",
  "https://standards.ieee.org/ieee/1240/1888",
  "https://standards.ieee.org/ieee/1366/7243",
  "https://standards.ieee.org/ieee/80/4089",
  "https://standards.ieee.org/ieee/81/11218",
  "https://standards.ieee.org/ieee/837/10271",
  "https://standards.ieee.org/ieee/18/6773",
  "https://standards.ieee.org/ieee/824/10208",
  "https://standards.ieee.org/ieee/1036/5912",
  "https://standards.ieee.org/ieee/1052/5530",
  "https://standards.ieee.org/ieee/1623/7756",
  "https://standards.ieee.org/ieee/48/6208",
  "https://standards.ieee.org/ieee/82/10826",
  "https://standards.ieee.org/ieee/383/7707",
  "https://standards.ieee.org/ieee/386/7573",
  "https://standards.ieee.org/ieee/400/7618",
  "https://standards.ieee.org/ieee/400.1/6967",
  "https://standards.ieee.org/ieee/400.2/11049",
  "https://standards.ieee.org/ieee/400.3/5316",
  "https://standards.ieee.org/ieee/400.5/6988",
  "https://standards.ieee.org/ieee/404/10721",
  "https://standards.ieee.org/ieee/C135.80/10650",
  "https://standards.ieee.org/ieee/C135.90/7759",
  "https://standards.ieee.org/ieee/C135.100/10678",
  "https://standards.ieee.org/ieee/16/7356",
  "https://standards.ieee.org/ieee/1474.1/6959",
  "https://standards.ieee.org/ieee/1474.2/7438",
  "https://standards.ieee.org/ieee/1474.3/7439",
  "https://standards.ieee.org/ieee/1474.4/11421",
  "https://standards.ieee.org/ieee/1627/7224",
  "https://standards.ieee.org/ieee/1653.1/10259",
  "https://standards.ieee.org/ieee/1653.2/7215",
  "https://standards.ieee.org/ieee/1653.3/6790",
  "https://standards.ieee.org/ieee/1653.5/6080",
  "https://standards.ieee.org/ieee/1653.6/7216",
  "https://standards.ieee.org/ieee/1791/5894",
  "https://standards.ieee.org/ieee/1833/10196",
  "https://standards.ieee.org/ieee/1896/5930",
  "https://standards.ieee.org/ieee/2720/6802",
  "https://standards.ieee.org/ieee/2753/7267",
  "https://standards.ieee.org/ieee/2839/7666",
  "https://standards.ieee.org/ieee/2853/10159",
  "https://standards.ieee.org/ieee/2950/10412",
  "https://standards.ieee.org/ieee/2956/10413",
  "https://standards.ieee.org/ieee/3143/11518",
  "https://standards.ieee.org/ieee/3175/10974",
  "https://standards.ieee.org/ieee/3351/11658",
  "https://standards.ieee.org/ieee/3352/11659",
  "https://standards.ieee.org/ieee/487/5662",
  "https://standards.ieee.org/ieee/487.1/5711",
  "https://standards.ieee.org/ieee/487.2/11558",
  "https://standards.ieee.org/ieee/487.3/5587",
  "https://standards.ieee.org/ieee/487.4/5381",
  "https://standards.ieee.org/ieee/487.5/5382",
  "https://standards.ieee.org/ieee/643/892",
  "https://standards.ieee.org/ieee/776/7241",
  "https://standards.ieee.org/ieee/820/10326",
  "https://standards.ieee.org/ieee/999/1377",
  "https://standards.ieee.org/ieee/1137/7206",
  "https://standards.ieee.org/ieee/1379/2070",
  "https://standards.ieee.org/ieee/1613/10454",
  "https://standards.ieee.org/ieee/1615/5591",
  "https://standards.ieee.org/ieee/1646/3461",
  "https://standards.ieee.org/ieee/1686/7207",
  "https://standards.ieee.org/ieee/1686-2022_Cor_1/11847",
  "https://standards.ieee.org/ieee/1692/10979",
  "https://standards.ieee.org/ieee/1711.1/7053",
  "https://standards.ieee.org/ieee/1711.2/5714",
  "https://standards.ieee.org/ieee/1815/5414",
  "https://standards.ieee.org/ieee/1815.1/5699",
  "https://standards.ieee.org/ieee/1815.2/7731",
  "https://standards.ieee.org/ieee/430/4959",
  "https://standards.ieee.org/ieee/516/5911",
  "https://standards.ieee.org/ieee/524/4813",
  "https://standards.ieee.org/ieee/539/7581",
  "https://standards.ieee.org/ieee/644/6732",
  "https://standards.ieee.org/ieee/738/10207",
  "https://standards.ieee.org/ieee/987/10480",
  "https://standards.ieee.org/ieee/1048/3895",
  "https://standards.ieee.org/ieee/1138/10325",
  "https://standards.ieee.org/ieee/1222/7507",
  "https://standards.ieee.org/ieee/1227/7582",
  "https://standards.ieee.org/ieee/1542/6774",
  "https://standards.ieee.org/ieee/1591.1/7470",
  "https://standards.ieee.org/ieee/1591.4/7596",
  "https://standards.ieee.org/ieee/1594/7076",
  "https://standards.ieee.org/ieee/1808/10588",
  "https://standards.ieee.org/ieee/1863/10507",
  "https://standards.ieee.org/ieee/1936.2/10521",
  "https://standards.ieee.org/ieee/1936.3/11009",
  "https://standards.ieee.org/ieee/2445/7190",
  "https://standards.ieee.org/ieee/2655/7365",
  "https://standards.ieee.org/ieee/2746/7263",
  "https://standards.ieee.org/ieee/2797/7463",
  "https://standards.ieee.org/ieee/2821/7642",
  "https://standards.ieee.org/ieee/2828/7689",
  "https://standards.ieee.org/ieee/2833/7692",
  "https://standards.ieee.org/ieee/2954/10410",
  "https://standards.ieee.org/ieee/3133/10754",
  "https://standards.ieee.org/ieee/3134/10755",
  "https://standards.ieee.org/ieee/3336/11132",
  "https://standards.ieee.org/ieee/525/7274",
  "https://standards.ieee.org/ieee/532/5902",
  "https://standards.ieee.org/ieee/592/7127",
  "https://standards.ieee.org/ieee/634/7032",
  "https://standards.ieee.org/ieee/690/11419",
  "https://standards.ieee.org/ieee/835/1228",
  "https://standards.ieee.org/ieee/1142/7302",
  "https://standards.ieee.org/ieee/1186/11578",
  "https://standards.ieee.org/ieee/1202/11003",
  "https://standards.ieee.org/ieee/1210/6976",
  "https://standards.ieee.org/ieee/1234/6771",
  "https://standards.ieee.org/ieee/1235/10132",
  "https://standards.ieee.org/ieee/1242/5001",
  "https://standards.ieee.org/ieee/1406/5903",
  "https://standards.ieee.org/ieee/1407/6171",
  "https://standards.ieee.org/ieee/1493/10430",
  "https://standards.ieee.org/ieee/1617/6674",
  "https://standards.ieee.org/ieee/1637/10182",
  "https://standards.ieee.org/ieee/1682/7752",
  "https://standards.ieee.org/ieee/1717/7506",
  "https://standards.ieee.org/ieee/1816/7606",
  "https://standards.ieee.org/ieee/2780/12023",
  "https://standards.ieee.org/ieee/2789/11172",
  "https://standards.ieee.org/ieee/3150/10848",
  "https://standards.ieee.org/ieee/605/5908",
  "https://standards.ieee.org/ieee/693/4996",
  "https://standards.ieee.org/ieee/979/7242",
  "https://standards.ieee.org/ieee/980/7038",
  "https://standards.ieee.org/ieee/998/6860",
  "https://standards.ieee.org/ieee/1127/7039",
  "https://standards.ieee.org/ieee/1246/11053",
  "https://standards.ieee.org/ieee/1264/10562",
  "https://standards.ieee.org/ieee/1267/5030",
  "https://standards.ieee.org/ieee/1268/5230",
  "https://standards.ieee.org/ieee/1378/6945",
  "https://standards.ieee.org/ieee/1402/6050",
  "https://standards.ieee.org/ieee/1427/6231",
  "https://standards.ieee.org/ieee/1527/4976",
  "https://standards.ieee.org/ieee/1818/7128",
  "https://standards.ieee.org/ieee/519/10677",
  "https://standards.ieee.org/ieee/1159/6124",
  "https://standards.ieee.org/ieee/1159.3/10437",
  "https://standards.ieee.org/ieee/1250/7009",
  "https://standards.ieee.org/ieee/1409/5214",
  "https://standards.ieee.org/ieee/1453/10459",
  "https://standards.ieee.org/ieee/1459/7578",
  "https://standards.ieee.org/ieee/1531/6729",
  "https://standards.ieee.org/ieee/1564/4156",
  "https://standards.ieee.org/ieee/1668/6798",
  "https://standards.ieee.org/ieee/2426/10919",
  "https://standards.ieee.org/ieee/2938/10408",
  "https://standards.ieee.org/ieee/C50.12/7280",
  "https://standards.ieee.org/ieee/C50.13/5266",
  "https://standards.ieee.org/ieee/43/4791",
  "https://standards.ieee.org/ieee/56/5526",
  "https://standards.ieee.org/ieee/62.2/6970",
  "https://standards.ieee.org/ieee/67/3278",
  "https://standards.ieee.org/ieee/95/3142",
  "https://standards.ieee.org/ieee/112/4807",
  "https://standards.ieee.org/ieee/115/6673",
  "https://standards.ieee.org/ieee/252/7433",
  "https://standards.ieee.org/ieee/286/7705",
  "https://standards.ieee.org/ieee/303/10130",
  "https://standards.ieee.org/ieee/334/7576",
  "https://standards.ieee.org/ieee/421.1/6698",
  "https://standards.ieee.org/ieee/421.2/4597",
  "https://standards.ieee.org/ieee/433/6826",
  "https://standards.ieee.org/ieee/421.4/5228",
  "https://standards.ieee.org/ieee/434/3679",
  "https://standards.ieee.org/ieee/522/6940",
  "https://standards.ieee.org/ieee/492/723",
  "https://standards.ieee.org/ieee/620/7434",
  "https://standards.ieee.org/ieee/810/5212",
  "https://standards.ieee.org/ieee/841/10131",
  "https://standards.ieee.org/ieee/841.1/10674",
  "https://standards.ieee.org/ieee/1068/5899",
  "https://standards.ieee.org/ieee/1095/4063",
  "https://standards.ieee.org/ieee/1129/5584",
  "https://standards.ieee.org/ieee/1248/5901",
  "https://standards.ieee.org/ieee/1310/5411",
  "https://standards.ieee.org/ieee/1349/10559",
  "https://standards.ieee.org/ieee/1665/6853",
  "https://standards.ieee.org/ieee/1553/6085",
  "https://standards.ieee.org/ieee/1799/7751",
  "https://standards.ieee.org/ieee/1812/6854",
  "https://standards.ieee.org/ieee/2420/6143",
  "https://standards.ieee.org/ieee/2455/7186",
  "https://standards.ieee.org/ieee/2465/11257",
  "https://standards.ieee.org/ieee/63332-387/10356"
];
const CABLE_STANDARD_NUMBERS = [
  "48",
  "82",
  "383",
  "386",
  "400",
  "400.1",
  "400.2",
  "400.3",
  "400.4",
  "400.5",
  "404",
  "525",
  "532",
  "575",
  "592",
  "634",
  "690",
  "835",
  "1142",
  "1186",
  "1202",
  "1210",
  "1234",
  "1235",
  "1242",
  "1406",
  "1407",
  "1493",
  "1511",
  "1511.1",
  "1511.2",
  "1617",
  "1637",
  "1682",
  "1717",
  "1718",
  "1816",
  "2780",
  "2789",
  "3150"
];
const BATTERY_STANDARD_NUMBERS = [
  "450",
  "484",
  "485",
  "937",
  "946",
  "1013",
  "1106",
  "1115",
  "1184",
  "1187",
  "1188",
  "1189",
  "1375",
  "1491",
  "1561",
  "1562",
  "1578",
  "1635",
  "1657",
  "1660",
  "1661",
  "1679",
  "1679.1",
  "1679.2",
  "1679.3",
  "1881",
  "2405",
  "2686",
  "2962",
  "2993"
];
const SUBSTATION_STANDARD_NUMBERS = [
  "605",
  "693",
  "979",
  "980",
  "998",
  "1127",
  "1246",
  "1264",
  "1267",
  "1268",
  "1378",
  "1402",
  "1427",
  "1527",
  "1818"
];
const CAPACITOR_STANDARD_NUMBERS = [
  "18",
  "824",
  "1036",
  "1726"
];
const REACTIVE_COMPENSATION_STANDARD_NUMBERS = [
  "1031",
  "1052",
  "1303",
  "1585",
  "1623"
];
const HEAT_TRACING_STANDARD_NUMBERS = [
  "515",
  "515.1",
  "62395-1",
  "62395-2",
  "60079-30-1",
  "60079-30-2",
  "844",
  "844.1",
  "844.2",
  "844.3",
  "844.4"
];
const POWER_QUALITY_STANDARD_NUMBERS = [
  "519",
  "1159",
  "1159.3",
  "1250",
  "1409",
  "1453",
  "1459",
  "1531",
  "1564",
  "1668",
  "2426",
  "2938"
];
const NUCLEAR_POWER_ELECTRICAL_EQUIPMENT_STANDARD_NUMBERS = [
  "7-4.3.2",
  "308",
  "317",
  "323",
  "334",
  "336",
  "338",
  "344",
  "352",
  "379",
  "382",
  "383",
  "384",
  "387",
  "415",
  "420",
  "494",
  "500",
  "572",
  "577",
  "603",
  "622",
  "627",
  "638",
  "649",
  "650",
  "690",
  "741",
  "765",
  "805",
  "833",
  "845",
  "934",
  "1023",
  "1082",
  "1186",
  "1205",
  "1290",
  "1682",
  "2420",
  "63332-387",
  "C37.81",
  "C37.82",
  "C37.98",
  "C37.105"
];
const GENERATOR_AND_EXCITATION_STANDARD_NUMBERS = [
  "C50.12",
  "C50.13",
  "387",
  "67",
  "115",
  "421.1",
  "421.2",
  "421.3",
  "421.4",
  "421.5",
  "421.6",
  "492",
  "810",
  "1095",
  "1129",
  "1248",
  "1553",
  "1665",
  "2420",
  "63332-387"
];
const ELECTRIC_MOTOR_STANDARD_NUMBERS = [
  "252",
  "303",
  "334",
  "841",
  "841.1",
  "1068"
];
const ROTATING_MACHINE_TESTING_STANDARD_NUMBERS = [
  "43",
  "56",
  "62.2",
  "95",
  "112",
  "117",
  "286",
  "433",
  "434",
  "522",
  "620",
  "1310",
  "1349",
  "1434",
  "1776",
  "1799",
  "1812",
  "2455",
  "2465"
];
const ROTATING_MACHINE_STANDARD_NUMBERS = [
  ...GENERATOR_AND_EXCITATION_STANDARD_NUMBERS,
  ...ELECTRIC_MOTOR_STANDARD_NUMBERS,
  ...ROTATING_MACHINE_TESTING_STANDARD_NUMBERS
];
const RELIABILITY_AND_AVAILABILITY_STANDARD_NUMBERS = [
  "3006",
  "493",
  "762",
  "859",
  "1240",
  "1366"
];
const OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS = [
  "430",
  "516",
  "524",
  "539",
  "644",
  "656",
  "738",
  "987",
  "1048",
  "1138",
  "1222",
  "1227",
  "1542",
  "1591.1",
  "1591.2",
  "1591.3",
  "1591.4",
  "1594",
  "1595",
  "1808",
  "1829",
  "1863",
  "1897",
  "1936.2",
  "1936.3",
  "2445",
  "2655",
  "2683",
  "2746",
  "2797",
  "2819",
  "2821",
  "2828",
  "2833",
  "2954",
  "3133",
  "3134",
  "3336"
];
const TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS = [
  "16",
  "1474.1",
  "1474.2",
  "1474.3",
  "1474.4",
  "1627",
  "1628",
  "1629",
  "1630",
  "1653.1",
  "1653.2",
  "1653.3",
  "1653.4",
  "1653.5",
  "1653.6",
  "1791",
  "1833",
  "1896",
  "2720",
  "2753",
  "2839",
  "2853",
  "2950",
  "2956",
  "3143",
  "3175",
  "3351",
  "3352"
];
const COMMUNICATIONS_SCADA_CYBERSECURITY_STANDARD_NUMBERS = [
  "487",
  "487.1",
  "487.2",
  "487.3",
  "487.4",
  "487.5",
  "643",
  "776",
  "820",
  "999",
  "1137",
  "1379",
  "1613",
  "1613.1",
  "1615",
  "1646",
  "1686",
  "1692",
  "1711.1",
  "1711.2",
  "1815",
  "1815.1",
  "1815.2"
];
const ELECTRICAL_SAFETY_CODE_STANDARD_NUMBERS = [
  "C2"
];
const INACTIVE_REFERENCE_DESIGNATIONS = new Set([
  "IEEE 80-2013",
  "IEEE 835-1994",
  "IEEE 1409-2012",
  "IEEE 1564-2014",
  "IEEE 493-2007",
  "IEEE 1240-2000",
  "IEEE 487-2015",
  "IEEE 487.1-2014",
  "IEEE 487.3-2014",
  "IEEE 487.3a-2022",
  "IEEE 487.4-2013",
  "IEEE 487.5-2013",
  "IEEE 643-2004",
  "IEEE 999-1992",
  "IEEE 1379-2000",
  "IEEE 1613.1-2013",
  "IEEE 1646-2004",
  "IEEE 1815-2012",
  "IEEE 1815.1-2015",
  "IEEE 1815.1-2015/Cor 1-2016",
  "IEEE 43-2013",
  "IEEE C50.13-2014",
  "IEEE 67-2005",
  "IEEE 95-2002",
  "IEEE 1068-2015",
  "IEEE 1095-2012",
  "IEEE 1129-2014",
  "IEEE 117-2015",
  "IEEE 810-2015",
  "IEEE 1310-2012",
  "IEEE 1434-2014",
  "IEEE 421.2-2014",
  "IEEE 421.4-2014",
  "IEEE 434-2006",
  "IEEE 492-1999",
  "IEEE 1776-2008"
]);

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
  "notes"
];

const SERIES = new Map([
  [
    "C2",
    {
      title: "Electrical Safety Codes",
      primaryPrefix: "electrical safety codes",
      summaryTopic: "National Electrical Safety Code requirements for electric supply stations, overhead and underground supply and communications lines, and related utility work rules"
    }
  ],
  [
    "C57",
    {
      title: "Transformers, Regulators, and Reactors",
      primaryPrefix: "C57 transformers regulators and reactors",
      summaryTopic: "transformers, reactors, insulating liquids, bushings, and related transformer equipment"
    }
  ],
  [
    "C37",
    {
      title: "Switchgear and Protection Equipment",
      primaryPrefix: "C37 switchgear and protection equipment",
      summaryTopic: "switchgear, circuit breakers, relays, reclosers, and protection equipment"
    }
  ],
  [
    "C62",
    {
      title: "Surge Arresters and Surge Protective Devices",
      primaryPrefix: "C62 surge arresters and surge protective devices",
      summaryTopic: "surge arresters, surge protective devices, insulation coordination, and transient overvoltage protection"
    }
  ],
  [
    "C63",
    {
      title: "Electromagnetic Compatibility and Radio-Noise Measurements",
      primaryPrefix: "C63 electromagnetic compatibility and radio-noise measurements",
      summaryTopic: "electromagnetic compatibility, radio-noise emissions measurements, EMI instrumentation, antenna calibration, test-site validation, RF immunity, ESD, wireless coexistence, and compliance testing"
    }
  ],
  [
    "C95",
    {
      title: "Electromagnetic Field Human Exposure Safety",
      primaryPrefix: "C95 electromagnetic field human exposure safety",
      summaryTopic: "human exposure limits, electromagnetic field measurements, safety programs, symbols, and hazard communication"
    }
  ],
  [
    "C135",
    {
      title: "Overhead Line and Pole-Line Hardware",
      primaryPrefix: "C135 overhead line and pole-line hardware",
      summaryTopic: "overhead line hardware, pole-line hardware, fasteners, fittings, and mechanical testing for transmission and distribution line construction"
    }
  ],
  [
    "OVERHEAD_TRANSMISSION_LINES",
    {
      title: "Overhead Transmission Lines",
      primaryPrefix: "overhead transmission lines",
      summaryTopic: "overhead transmission line design, conductors, line ratings, structures, insulation, field effects, grounding, construction, inspection, maintenance, and overhead utility fiber"
    }
  ],
  [
    "TRANSPORTATION_TRACTION_POWER",
    {
      title: "Transportation and Traction Power",
      primaryPrefix: "transportation and traction power",
      summaryTopic: "rail transit traction power, overhead contact systems, rail vehicle electrical equipment, communications-based train control, rail potential, stray-current mitigation, high-speed rail, and maglev vehicle systems"
    }
  ],
  [
    "COMMUNICATIONS_SCADA_CYBERSECURITY",
    {
      title: "Communications, SCADA, and IED Cybersecurity",
      primaryPrefix: "communications SCADA and IED cybersecurity",
      summaryTopic: "power-system communications, SCADA protocols, substation network communication, DNP3 profiles, secure SCADA serial links, IED cybersecurity, communications facility protection, and electric-supply/telecommunications coordination"
    }
  ],
  [
    "1547",
    {
      title: "DER Interconnection",
      primaryPrefix: "1547 DER interconnection",
      summaryTopic: "distributed energy resource interconnection, interoperability, conformance testing, and application guidance"
    }
  ],
  [
    "1584",
    {
      title: "Arc Flash Hazard Analysis",
      primaryPrefix: "arc flash hazard analysis",
      summaryTopic: "arc-flash hazard calculations, study scoping, deliverables, and data collection"
    }
  ],
  [
    "2030",
    {
      title: "Smart Grid, DERMS, and Microgrids",
      primaryPrefix: "2030 smart grid DERMS and microgrids",
      summaryTopic: "smart grid interoperability, microgrid controllers, DER management systems, and grid control automation"
    }
  ],
  [
    "BATTERIES",
    {
      title: "Batteries and DC Systems",
      primaryPrefix: "battery and dc systems",
      summaryTopic: "stationary batteries, battery energy storage technologies, battery monitoring, chargers, ventilation, safety, and related DC power systems"
    }
  ],
  [
    "2800",
    {
      title: "Inverter-Based Resource Interconnection",
      primaryPrefix: "2800 inverter-based resource interconnection",
      summaryTopic: "inverter-based resource interconnection, grid-forming capabilities, and bulk power system performance verification"
    }
  ],
  [
    "3000",
    {
      title: "Industrial and Commercial Power Systems",
      primaryPrefix: "3000 industrial and commercial power systems",
      summaryTopic: "industrial and commercial power systems design, analysis, grounding, protection, standby power, maintenance, operations, and safety"
    }
  ],
  [
    "RELIABILITY_AND_AVAILABILITY",
    {
      title: "Reliability and Availability",
      primaryPrefix: "reliability and availability",
      summaryTopic: "power-system reliability planning, reliable industrial and commercial power systems, reliability indices, outage reporting, generating-unit availability and productivity, reliability data analysis, and HVDC converter station reliability"
    }
  ],
  [
    "GROUNDING",
    {
      title: "Grounding and Grounding Connections",
      primaryPrefix: "grounding and grounding connections",
      summaryTopic: "AC substation grounding safety, grounding-system measurements, permanent substation grounding connections, and neutral grounding in electrical utility systems"
    }
  ],
  [
    "CAPACITORS",
    {
      title: "Capacitors",
      primaryPrefix: "capacitors",
      summaryTopic: "shunt power capacitors, series capacitor banks, fixed-series capacitor banks, and shunt capacitor application"
    }
  ],
  [
    "REACTIVE_COMPENSATION",
    {
      title: "Reactive Power Compensation",
      primaryPrefix: "reactive power compensation",
      summaryTopic: "static var compensators, STATCOM systems, electronic voltage fluctuation compensation devices, and related reactive power compensation equipment"
    }
  ],
  [
    "HEAT_TRACING",
    {
      title: "Heat Tracing",
      primaryPrefix: "heat tracing",
      summaryTopic: "electrical resistance trace heating, explosive-atmosphere trace heating, skin effect trace heating, and impedance heating for pipelines, vessels, equipment, structures, and commercial applications"
    }
  ],
  [
    "CABLES",
    {
      title: "Cable Systems and Insulated Conductors",
      primaryPrefix: "cable systems and insulated conductors",
      summaryTopic: "power cable systems, insulated conductors, joints, terminations, accessories, field testing, installation, fire performance, and condition assessment"
    }
  ],
  [
    "SUBSTATIONS",
    {
      title: "Substations",
      primaryPrefix: "substation design and operations",
      summaryTopic: "electric power substation design, construction, operation, safety, environmental compatibility, fire protection, physical security, oil containment, bus design, seismic design, HVDC converter stations, auxiliary systems, and lightning shielding"
    }
  ],
  [
    "POWER_QUALITY",
    {
      title: "Power Quality and Harmonics",
      primaryPrefix: "power quality and harmonics",
      summaryTopic: "power quality monitoring, harmonics, harmonic filters, voltage quality, flicker, voltage sags, ride-through testing, nonsinusoidal power measurement, and transient overvoltage measurement"
    }
  ],
  [
    "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT",
    {
      title: "Nuclear Power Electrical Equipment",
      primaryPrefix: "nuclear power electrical equipment",
      summaryTopic: "Class 1E equipment, safety systems, nuclear facility electrical power systems, nuclear cables and splices, standby power supplies, safety-related motors, switchgear, relays, and controls"
    }
  ],
  [
    "GENERATORS_AND_EXCITATION",
    {
      title: "Electric Generators and Excitation Systems",
      primaryPrefix: "electric generators and excitation systems",
      summaryTopic: "synchronous generators, hydro generators, turbine generators, generator-motors, excitation systems, standby generator units, generator monitoring, generator rewind, and hydroelectric commissioning"
    }
  ],
  [
    "ELECTRIC_MOTORS",
    {
      title: "Electric Motors and Motor Applications",
      primaryPrefix: "electric motors and motor applications",
      summaryTopic: "induction motors, severe-duty process-industry motors, nuclear safety-related motors, motor auxiliary devices, and AC motor repair and rewinding"
    }
  ],
  [
    "ROTATING_MACHINE_TESTING",
    {
      title: "Rotating Machine Testing, Insulation, and Diagnostics",
      primaryPrefix: "rotating machine testing insulation and diagnostics",
      summaryTopic: "shared rotating-machine testing, insulation maintenance, insulation diagnostics, thermal evaluation, partial discharge measurement, permanent magnet machine testing, and DC electric machine maintenance"
    }
  ]
]);

const requestedSeries = process.argv.slice(2).flatMap(normalizeSeriesArg);
const isPartialRefresh = requestedSeries.length > 0;
const targetSeries = requestedSeries.length
  ? [...new Set(requestedSeries.filter((series) => SERIES.has(series)))]
  : [...SERIES.keys()];

if (!targetSeries.length) {
  throw new Error(
    `No supported IEEE family or series requested. Supported values: ${[
      ...SERIES.keys(),
      "GROUND",
      "80",
      "81",
      "837",
      "C62.92",
      "NESC",
      "ELECTRICAL_SAFETY_CODES",
      "SAFETY_CODES",
      "UTILITY_SAFETY",
      "C63",
      "EMC",
      "ELECTROMAGNETIC_COMPATIBILITY",
      "RADIO_NOISE",
      "CAPACITOR",
      ...CAPACITOR_STANDARD_NUMBERS,
      "REACTIVE_COMPENSATION",
      "REACTIVE_POWER_COMPENSATION",
      "VAR_COMPENSATION",
      ...REACTIVE_COMPENSATION_STANDARD_NUMBERS,
      "HEAT_TRACING",
      "TRACE_HEATING",
      "ELECTRIC_HEAT_TRACING",
      ...HEAT_TRACING_STANDARD_NUMBERS,
      "BATTERIES",
      ...BATTERY_STANDARD_NUMBERS,
      "CABLE",
      ...CABLE_STANDARD_NUMBERS,
      "SUBSTATIONS",
      ...SUBSTATION_STANDARD_NUMBERS,
      "POWER_QUALITY",
      ...POWER_QUALITY_STANDARD_NUMBERS,
      "RELIABILITY",
      "AVAILABILITY",
      "POWER_SYSTEM_RELIABILITY",
      ...RELIABILITY_AND_AVAILABILITY_STANDARD_NUMBERS,
      "NUCLEAR",
      "NUCLEAR_POWER",
      "CLASS_1E",
      ...NUCLEAR_POWER_ELECTRICAL_EQUIPMENT_STANDARD_NUMBERS,
      "ROTATING_MACHINES",
      "ELECTRIC_MACHINERY",
      "MACHINES",
      "GENERATORS",
      "GENERATION",
      "GENERATORS_AND_EXCITATION",
      "ELECTRIC_GENERATORS",
      ...GENERATOR_AND_EXCITATION_STANDARD_NUMBERS,
      "MOTORS",
      "ELECTRIC_MOTORS",
      "MOTOR_APPLICATIONS",
      ...ELECTRIC_MOTOR_STANDARD_NUMBERS,
      "ROTATING_MACHINE_TESTING",
      "MACHINE_TESTING",
      "MACHINE_DIAGNOSTICS",
      ...ROTATING_MACHINE_STANDARD_NUMBERS,
      "OVERHEAD_TRANSMISSION_LINES",
      "OVERHEAD_LINES",
      "TRANSMISSION_LINES",
      "OHL",
      ...OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS,
      "TRANSPORTATION",
      "TRACTION",
      "TRACTION_POWER",
      "TRANSPORTATION_TRACTION_POWER",
      "RAIL",
      "RAIL_TRANSIT",
      "OCS",
      "CBTC",
      ...TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS,
      "COMMUNICATIONS_SCADA_CYBERSECURITY",
      "COMMUNICATIONS",
      "SCADA",
      "IED_CYBERSECURITY",
      "CYBERSECURITY",
      "DNP3",
      "PSCC",
      ...COMMUNICATIONS_SCADA_CYBERSECURITY_STANDARD_NUMBERS,
      ...ELECTRICAL_SAFETY_CODE_STANDARD_NUMBERS
    ].join(", ")}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const allUrls = await discoverIeeeStandardUrls();
  const candidateUrls = allUrls.filter((url) =>
    targetSeries.some((series) => seriesMatchesUrl(series, url))
  );

  let processedCount = 0;
  const pageRecords = await mapWithConcurrency(candidateUrls, PAGE_CONCURRENCY, async (url) => {
    try {
      return parseIeeePage(url, await fetchText(url));
    } finally {
      processedCount += 1;

      if (processedCount % 50 === 0 || processedCount === candidateUrls.length) {
        console.log(`processed_pages=${processedCount}/${candidateUrls.length}`);
      }
    }
  }
  );
  const failedRecords = pageRecords.filter((record) => record.error);
  const activeRows = pageRecords
    .filter((record) => !record.error)
    .filter(
      (record) => record.status === "Active Standard" || isInactiveReference(record)
    )
    .filter((record) => record.designation)
    .filter((record) => editionFromDesignation(record.designation))
    .filter((record) => targetSeries.includes(seriesFromDesignation(record.designation)))
    .map(toStandardRow);

  const rows = mergeWithExistingRows(activeRows);

  fs.writeFileSync(DATA_PATH, toCsv(rows), "utf8");

  console.log(`candidate_urls=${candidateUrls.length}`);
  console.log(`active_records=${rows.length}`);
  console.log(
    `series_counts=${targetSeries
      .map(
        (series) =>
          `${series}:${rows.filter((row) => seriesFromDesignation(row.designation) === series).length}`
      )
      .join(",")}`
  );
  console.log(`failed_pages=${failedRecords.length}`);

  if (failedRecords.length) {
    console.log(
      `failed_urls=${failedRecords
        .slice(0, 10)
        .map((record) => record.url)
        .join(",")}`
    );
  }
}

function mergeWithExistingRows(refreshedRows) {
  const existingRows = isPartialRefresh
    ? readExistingRows().filter(
      (row) => !targetSeries.some((series) => rowBelongsToSeries(row, series))
    )
    : [];

  return dedupeBy([...existingRows, ...refreshedRows], (row) => row.standard_id)
    .sort((a, b) => {
      const seriesCompare =
        seriesSortIndex(seriesFromDesignation(a.designation)) -
        seriesSortIndex(seriesFromDesignation(b.designation));
      if (seriesCompare) {
        return seriesCompare;
      }

      return compareDesignation(a.designation, b.designation);
    });
}

function rowBelongsToSeries(row, series) {
  if (seriesFromDesignation(row.designation) === series) {
    return true;
  }

  const config = SERIES.get(series);

  return Boolean(
    config && row.primary_category?.startsWith(`${config.primaryPrefix} - `)
  );
}

function readExistingRows() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const csv = fs.readFileSync(DATA_PATH, "utf8").trim();

  if (!csv) {
    return [];
  }

  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);

    return CSV_HEADERS.reduce((row, header) => {
      const index = headers.indexOf(header);
      row[header] = index >= 0 ? values[index] ?? "" : "";
      return row;
    }, {});
  });
}

async function discoverIeeeStandardUrls() {
  const sitemapIndex = await fetchText(SITEMAP_INDEX_URL);
  const sitemapUrls = extractXmlLocs(sitemapIndex).filter((url) =>
    /\/ieee-sitemap\d*\.xml$/i.test(url)
  );
  const standardUrls = [];

  for (const sitemapUrl of sitemapUrls) {
    const sitemap = await fetchText(sitemapUrl);
    standardUrls.push(
      ...extractXmlLocs(sitemap).filter((url) => /\/ieee\/[A-Z0-9.]/i.test(url))
    );
  }

  return [
    ...new Set([
      ...standardUrls,
      ...SUPPLEMENTAL_STANDARD_URLS,
      ...extractExistingIeeeUrls()
    ])
  ];
}

function extractExistingIeeeUrls() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  return [
    ...fs
      .readFileSync(DATA_PATH, "utf8")
      .matchAll(/https:\/\/standards\.ieee\.org\/ieee\/[^,\r\n"]+/g)
  ].map((match) => match[0]);
}

function parseIeeePage(url, html) {
  const meta = parseMetaTags(html);
  const designation = cleanText(meta.designation);
  const title = cleanTitle(cleanText(meta.title));
  const status = cleanText(meta.Status);

  return {
    url,
    designation,
    title,
    status,
    standardCommittee: htmlField(html, "stnd-standard-committee"),
    boardApprovalDate: htmlField(html, "stnd-board-approval-date"),
    parApprovalDate: htmlField(html, "stnd-par-approval-date"),
    publishedDate: htmlField(html, "stnd-published-date"),
    standardRecordNumber: cleanText(meta.StdRecNo),
    society: cleanText(meta.Society),
    topic: cleanText(meta.topic),
    type: cleanText(meta.type)
  };
}

function toStandardRow(record) {
  const series = seriesFromDesignation(record.designation);
  const config = SERIES.get(series);
  const subcategory = subcategoryFor(series, record.title, record.designation);
  const edition = editionFromDesignation(record.designation) || record.publishedDate || "current";
  const notes = [
    `IEEE SA page status: ${record.status}.`,
    record.publishedDate ? `Published: ${record.publishedDate}.` : "",
    record.boardApprovalDate ? `Board approval: ${record.boardApprovalDate}.` : "",
    record.standardCommittee ? `Standard committee: ${record.standardCommittee}.` : "",
    record.standardRecordNumber ? `IEEE record number: ${record.standardRecordNumber}.` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return {
    standard_id: `IEEE-${slugify(standardNumberFromDesignation(record.designation))}`,
    designation: record.designation,
    title: record.title,
    publisher: "IEEE",
    record_type: recordTypeFor(record.title, record.designation),
    country_scope: "International / North America",
    primary_category: `${config.primaryPrefix} - ${subcategory}`,
    latest_known_edition: edition,
    applicability:
      "Consensus IEEE power and energy standard used where specified by law, code, authority having jurisdiction, utility requirement, project specification, or contract",
    summary: `IEEE ${config.title} metadata record for ${config.summaryTopic}; this record points to the official IEEE SA page for ${record.designation}.`,
    official_url: record.url,
    source_download_url: "",
    notes
  };
}

function subcategoryFor(series, title, designation) {
  const haystack = `${designation} ${title}`.toLowerCase();

  if (series === "C2") {
    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    return "National Electrical Safety Code";
  }

  if (series === "C57") {
    if (/terminology|definitions|nomenclature/.test(haystack)) {
      return "Terminology and Reference";
    }

    if (/test|measurement|calibration/.test(haystack)) {
      return "Test Codes and Methods";
    }

    if (/dry-type|dry type|cast-coil|ventilated/.test(haystack)) {
      return "Dry-Type Transformers";
    }

    if (/liquid-immersed|oil-immersed|mineral-oil|natural ester|insulating liquid|insulating oil/.test(haystack)) {
      return "Liquid-Immersed Transformers";
    }

    if (/distribution|pad-mounted|overhead|submersible|network|subway|vault/.test(haystack)) {
      return "Distribution Transformers";
    }

    if (/instrument transformer|current transformer|voltage transformer|metering/.test(haystack)) {
      return "Instrument Transformers";
    }

    if (/bushing|terminal|connection|enclosure|cabinet/.test(haystack)) {
      return "Bushings Accessories and Enclosures";
    }

    if (/loading|maintenance|monitor|diagnostic|dissolved gas|field testing|repair|failure/.test(haystack)) {
      return "Monitoring Diagnostics and Maintenance";
    }

    if (/insulation|thermal|temperature|dielectric|short-circuit|through-fault/.test(haystack)) {
      return "Insulation Thermal and Mechanical Performance";
    }

    if (/regulator|reactor|tap changer|tap-changer|rectifier|furnace|specialty/.test(haystack)) {
      return "Specialty Transformers Reactors and Regulators";
    }

    return "General Transformer Requirements";
  }

  if (series === "C37") {
    if (/terminology|definitions|ratings|symmetrical current|basis/.test(haystack)) {
      return "Definitions Ratings and Reference";
    }

    if (/circuit breaker|circuit-breaker|breaker/.test(haystack)) {
      return "Circuit Breakers";
    }

    if (/switchgear|switchboard|metal-clad|metal-enclosed/.test(haystack)) {
      return "Switchgear Assemblies";
    }

    if (/relay|relaying|protection|trip|control circuit/.test(haystack)) {
      return "Relays Protection and Control";
    }

    if (/recloser|sectionalizer|fuse|interrupter|cutout/.test(haystack)) {
      return "Reclosers Sectionalizers Fuses and Interrupters";
    }

    if (/test|testing|measurement|calibration|monitor|diagnostic/.test(haystack)) {
      return "Testing Monitoring and Diagnostics";
    }

    return "General Switchgear and Protection Requirements";
  }

  if (series === "C62") {
    if (/surge arrester|arrester/.test(haystack)) {
      return "Surge Arresters";
    }

    if (/surge protective device|spd|protective device/.test(haystack)) {
      return "Surge Protective Devices";
    }

    if (/insulation coordination|application guide|guide|selection|low-voltage|low voltage/.test(haystack)) {
      return "Application Guides and Insulation Coordination";
    }

    if (/test|testing|measurement|wave|transient|impulse/.test(haystack)) {
      return "Testing and Transient Measurement";
    }

    return "General Surge Protection Requirements";
  }

  if (series === "C63") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesStandardNumber(standardNumber, "C63.2")) {
      return "EMI Instrumentation";
    }

    if (matchesStandardNumber(standardNumber, "C63.4")) {
      return "Radio-Noise Emissions Measurements";
    }

    if (matchesStandardNumber(standardNumber, "C63.5")) {
      return "Antenna Calibration";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C63.6", "C63.7", "C63.25.1", "C63.25.2"])) {
      return "Radiated Emission Test Sites";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C63.011", "C63.022", "C63.29"])) {
      return "Radio-Disturbance Characteristics";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C63.9", "C63.15", "C63.18", "C63.24"])) {
      return "RF Immunity Testing";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C63.10", "C63.17", "C63.26"])) {
      return "Wireless Device Compliance Testing";
    }

    if (matchesStandardNumber(standardNumber, "C63.27")) {
      return "Wireless Coexistence";
    }

    if (matchesStandardNumber(standardNumber, "C63.19")) {
      return "Hearing Aid Compatibility";
    }

    if (matchesStandardNumber(standardNumber, "C63.22")) {
      return "Automated EMI Measurements";
    }

    if (matchesStandardNumber(standardNumber, "C63.23")) {
      return "EMC Measurement Uncertainty";
    }

    if (matchesStandardNumber(standardNumber, "C63.12")) {
      return "Electromagnetic Compatibility Limits";
    }

    if (matchesStandardNumber(standardNumber, "C63.13")) {
      return "EMI Power-Line Filters";
    }

    if (matchesStandardNumber(standardNumber, "C63.14")) {
      return "EMC Dictionary";
    }

    if (matchesStandardNumber(standardNumber, "C63.16")) {
      return "ESD Test Methodologies";
    }

    return "General Electromagnetic Compatibility";
  }

  if (series === "C135") {
    if (/fastener|bolt|nut|lag screw|washer|staple/.test(haystack)) {
      return "Fasteners";
    }

    if (/pole line|pole-line|wood pole/.test(haystack)) {
      return "Pole-Line Hardware";
    }

    if (/test|testing|slip|pull-out|mechanical/.test(haystack)) {
      return "Testing and Mechanical Performance";
    }

    if (/line hardware|clevis|fitting|socket|shackle|yoke|suspension|strain|deadend|dead-end/.test(haystack)) {
      return "Line Hardware";
    }

    return "General Overhead Line Hardware";
  }

  if (series === "OVERHEAD_TRANSMISSION_LINES") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1863", "2954"])) {
      return "Line Design and Criteria";
    }

    if (matchesAnyStandardNumber(standardNumber, ["524", "738"])) {
      return "Conductors Ratings and Installation";
    }

    if (matchesAnyStandardNumber(standardNumber, ["987", "2833"])) {
      return "Insulators and Line Supports";
    }

    if (matchesAnyStandardNumber(standardNumber, ["2445", "2655", "2683"])) {
      return "Structures and Corrosion";
    }

    if (matchesAnyStandardNumber(standardNumber, ["430", "539", "644", "656", "1227", "1829", "1897", "2746", "2819"])) {
      return "Corona Field Effects and Interference";
    }

    if (matchesAnyStandardNumber(standardNumber, ["516", "1048", "1542", "1808"])) {
      return "Maintenance Grounding and Field Work";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1936.2", "1936.3", "2797", "2821", "2828", "3133", "3134", "3336"])) {
      return "Inspection Survey and Weather Monitoring";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1138", "1222", "1591.1", "1591.2", "1591.3", "1591.4", "1594", "1595"])) {
      return "Overhead Utility Fiber";
    }

    return "General Overhead Transmission Lines";
  }

  if (series === "TRANSPORTATION_TRACTION_POWER") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1474.1", "1474.2", "1474.3", "1474.4", "2839"])) {
      return "Train Control and Rail Safety Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["16", "2956"])) {
      return "Rail Vehicle Electrical Equipment";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1627", "1628", "1629", "1630", "1791", "1833", "1896", "2753"])) {
      return "Overhead Contact Systems and Current Collection";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1653.1", "1653.2", "1653.3", "1653.4", "1653.5", "1653.6"])) {
      return "Traction Power Substations and Distribution Facilities";
    }

    if (matchesAnyStandardNumber(standardNumber, ["2720", "2853", "3175"])) {
      return "Rail Potential Grounding and Stray Current";
    }

    if (matchesAnyStandardNumber(standardNumber, ["2950", "3143", "3351", "3352"])) {
      return "High-Speed Rail and Maglev Systems";
    }

    return "General Transportation and Traction Power";
  }

  if (series === "COMMUNICATIONS_SCADA_CYBERSECURITY") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["487", "487.1", "487.2", "487.3", "487.4", "487.5", "1692"])) {
      return "Communications Facility Protection";
    }

    if (matchesStandardNumber(standardNumber, "643")) {
      return "Power-Line Carrier";
    }

    if (matchesAnyStandardNumber(standardNumber, ["776", "1137"])) {
      return "Electric Supply and Communication Line Coordination";
    }

    if (matchesStandardNumber(standardNumber, "820")) {
      return "Telephone Loop Performance";
    }

    if (matchesStandardNumber(standardNumber, "999")) {
      return "Master Remote SCADA Communications";
    }

    if (matchesStandardNumber(standardNumber, "1379")) {
      return "RTU and IED Data Communications";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1613", "1613.1"])) {
      return "Communications Device Environmental Testing";
    }

    if (matchesStandardNumber(standardNumber, "1615")) {
      return "Substation Network Communication";
    }

    if (matchesStandardNumber(standardNumber, "1646")) {
      return "Substation Automation Communication Timing";
    }

    if (matchesStandardNumber(standardNumber, "1686")) {
      return "IED Cybersecurity";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1711.1", "1711.2"])) {
      return "Secure SCADA Serial Links";
    }

    if (matchesStandardNumber(standardNumber, "1815.2")) {
      return "DER DNP3 Profiles";
    }

    if (matchesStandardNumber(standardNumber, "1815.1")) {
      return "IEC 61850 and DNP3 Mapping";
    }

    if (matchesStandardNumber(standardNumber, "1815")) {
      return "DNP3 Communications";
    }

    return "General Communications SCADA and IED Cybersecurity";
  }

  if (series === "C95") {
    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (/military workplace|force health/.test(haystack)) {
      return "Military Workplace Exposure";
    }

    if (/measurement|computation|dosimetry|assessment/.test(haystack)) {
      return "Measurement and Computation";
    }

    if (/symbol|sign|label|hazard communication/.test(haystack)) {
      return "Symbols and Hazard Communication";
    }

    if (/safety program/.test(haystack)) {
      return "Safety Programs";
    }

    if (/safety levels|exposure/.test(haystack)) {
      return "Human Exposure Limits";
    }

    return "General EMF Safety";
  }

  if (series === "1547") {
    if (/energy storage|storage|battery/.test(haystack)) {
      return "Energy Storage DER";
    }

    if (/test|testing|conformance|verification|commissioning|certification/.test(haystack)) {
      return "Conformance Testing and Verification";
    }

    if (/application guide|guide|use of|background|implementation/.test(haystack)) {
      return "Application Guides";
    }

    if (/secondary network|area network|spot network|network distribution/.test(haystack)) {
      return "Secondary Networks";
    }

    if (/interconnection|interoperability|distributed energy resources|der/.test(haystack)) {
      return "Interconnection Requirements";
    }

    return "General DER Interconnection";
  }

  if (series === "1584") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/^1584\.2(?:\D|$)/.test(standardNumber)) {
      return "Data Collection";
    }

    if (/^1584\.1(?:\D|$)/.test(standardNumber)) {
      return "Study Scope and Deliverables";
    }

    if (/^1584[A-Z](?:\D|$)/.test(standardNumber) || /amendment|corrigendum|errata/.test(haystack)) {
      return "Amendments and Corrections";
    }

    return "Hazard Calculations";
  }

  if (series === "2030") {
    if (/microgrid/.test(haystack)) {
      return "Microgrids and Controllers";
    }

    if (/derms|distributed energy resources management|aggregation/.test(haystack)) {
      return "DERMS and Aggregation";
    }

    if (/energy storage|storage system|ess/.test(haystack)) {
      return "Energy Storage Integration";
    }

    if (/control|automation/.test(haystack)) {
      return "Control and Automation";
    }

    if (/charging|electric vehicle|transportation|virtual power plant|vpp/.test(haystack)) {
      return "EV Charging and Virtual Power Plants";
    }

    if (/smart grid|interoperability|reference model|information technology|communications/.test(haystack)) {
      return "Smart Grid Interoperability";
    }

    return "General Smart Grid Integration";
  }

  if (series === "BATTERIES") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (matchesAnyStandardNumber(standardNumber, ["450", "484", "485"])) {
      return "Vented Lead-Acid Batteries";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1187", "1188", "1189"])) {
      return "Valve-Regulated Lead-Acid Batteries";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1106", "1115"])) {
      return "Nickel-Cadmium Batteries";
    }

    if (matchesStandardNumber(standardNumber, "1184")) {
      return "UPS Battery Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["937", "1013", "1561", "1562", "1661"])) {
      return "PV and Remote Hybrid Battery Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["946", "2405"])) {
      return "DC Power Systems and Chargers";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1375", "1491", "2686"])) {
      return "Monitoring Protection and Management";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1578", "1635", "1657", "1881"])) {
      return "Safety Ventilation and Terminology";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1660", "1679", "1679.1", "1679.2", "1679.3", "2962", "2993"])) {
      return "Stationary Energy Storage Technologies";
    }

    if (/battery charger|rectifier|dc power/.test(haystack)) {
      return "DC Power Systems and Chargers";
    }

    if (/lithium|sodium|flow|energy storage|storage technolog/.test(haystack)) {
      return "Stationary Energy Storage Technologies";
    }

    return "General Batteries and DC Systems";
  }

  if (series === "2800") {
    if (/test|testing|verification|conformity|assessment/.test(haystack)) {
      return "Test and Verification";
    }

    if (/grid forming|grid-forming|gfm/.test(haystack)) {
      return "Grid-Forming IBR";
    }

    if (/amendment|corrigendum/.test(haystack)) {
      return "Amendments and Corrections";
    }

    return "Transmission IBR Interconnection";
  }

  if (series === "3000") {
    const standardNumber = standardNumberFromDesignation(designation);

    if (/^3001(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Design";
    }

    if (/^3002(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Analysis";
    }

    if (/^3003(?:\.|-)/.test(standardNumber)) {
      return "Power Systems Grounding";
    }

    if (/^3004(?:\.|-)/.test(standardNumber)) {
      return "Protection and Coordination";
    }

    if (/^3005(?:\.|-)/.test(standardNumber)) {
      return "Energy and Standby Power";
    }

    if (/^3006(?:\.|-)/.test(standardNumber)) {
      return "Reliability";
    }

    if (/^3007(?:\.|-)/.test(standardNumber)) {
      return "Maintenance Operations and Safety";
    }

    return "General Industrial and Commercial Power Systems";
  }

  if (series === "RELIABILITY_AND_AVAILABILITY") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/^3006(?:\.|-|$)/.test(standardNumber)) {
      return "Power Systems Reliability";
    }

    if (/^493(?:[A-Z]|-|$)/.test(standardNumber)) {
      return "Gold Book Reliable Industrial and Commercial Power Systems";
    }

    if (/^1366(?:[A-Z]|-|$)/.test(standardNumber)) {
      return "Distribution Reliability Indices";
    }

    if (/^762(?:[A-Z]|-|$)/.test(standardNumber)) {
      return "Generating Unit Reliability Availability and Productivity";
    }

    if (/^859(?:[A-Z]|-|$)/.test(standardNumber)) {
      return "Transmission Facility Outage Reporting and Analysis";
    }

    if (/^1240(?:[A-Z]|-|$)/.test(standardNumber)) {
      return "HVDC Converter Station Reliability";
    }

    return "General Reliability and Availability";
  }

  if (series === "GROUNDING") {
    const standardNumber = standardNumberFromDesignation(designation);

    if (/^C62\.92(?:\.|-|$)/.test(standardNumber)) {
      return "Neutral Grounding in Electrical Utility Systems";
    }

    if (/^80(?:\.|-|$)/.test(standardNumber)) {
      return "Substation Grounding Safety";
    }

    if (/^81(?:\.|-|$)/.test(standardNumber)) {
      return "Grounding Measurements";
    }

    if (/^837(?:\.|-|$)/.test(standardNumber)) {
      return "Grounding Connections";
    }

    return "General Grounding";
  }

  if (series === "CAPACITORS") {
    const standardNumber = standardNumberFromDesignation(designation);

    if (matchesStandardNumber(standardNumber, "18")) {
      return "Shunt Power Capacitors";
    }

    if (matchesStandardNumber(standardNumber, "824")) {
      return "Series Capacitor Banks";
    }

    if (matchesStandardNumber(standardNumber, "1036")) {
      return "Shunt Capacitor Application";
    }

    if (matchesStandardNumber(standardNumber, "1726")) {
      return "Fixed-Series Capacitor Banks";
    }

    return "General Capacitors";
  }

  if (series === "REACTIVE_COMPENSATION") {
    const standardNumber = standardNumberFromDesignation(designation);

    if (matchesStandardNumber(standardNumber, "1031")) {
      return "Transmission Static Var Compensators";
    }

    if (matchesStandardNumber(standardNumber, "1052")) {
      return "STATCOM Systems";
    }

    if (matchesStandardNumber(standardNumber, "1303")) {
      return "Static Var Compensator Field Tests";
    }

    if (matchesStandardNumber(standardNumber, "1585")) {
      return "Series Devices for Voltage Fluctuation Compensation";
    }

    if (matchesStandardNumber(standardNumber, "1623")) {
      return "Dynamic Voltage Compensation Devices";
    }

    return "General Reactive Power Compensation";
  }

  if (series === "HEAT_TRACING") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (matchesAnyStandardNumber(standardNumber, ["515", "515.1", "62395-1", "62395-2"])) {
      return "Electrical Resistance Trace Heating";
    }

    if (matchesAnyStandardNumber(standardNumber, ["60079-30-1", "60079-30-2"])) {
      return "Explosive Atmosphere Trace Heating";
    }

    if (matchesAnyStandardNumber(standardNumber, ["844", "844.1", "844.2"])) {
      return "Skin Effect Trace Heating";
    }

    if (matchesAnyStandardNumber(standardNumber, ["844.3", "844.4"])) {
      return "Impedance Heating";
    }

    return "General Heat Tracing";
  }

  if (series === "CABLES") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (matchesStandardNumber(standardNumber, "835")) {
      return "Ampacity and Thermal Reference";
    }

    if (matchesAnyStandardNumber(standardNumber, ["383", "690", "1186", "1682"])) {
      return "Nuclear Cable Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["48", "386", "404", "592", "1493", "1637", "1816", "2780"])) {
      return "Terminations Joints and Accessories";
    }

    if (matchesAnyStandardNumber(standardNumber, ["82", "400", "400.1", "400.2", "400.3", "400.4", "400.5", "1234", "1406", "1407", "1511", "1511.1", "1511.2", "1617", "3150"])) {
      return "Testing Diagnostics and Condition Assessment";
    }

    if (matchesAnyStandardNumber(standardNumber, ["634", "1202", "1717"])) {
      return "Fire Performance and Protection";
    }

    if (matchesAnyStandardNumber(standardNumber, ["525", "532", "575", "1142", "1210", "1235", "1242", "1718", "2789"])) {
      return "Design Installation and Application";
    }

    return "General Cable Systems";
  }

  if (series === "SUBSTATIONS") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (matchesStandardNumber(standardNumber, "605")) {
      return "Bus Design and Buswork";
    }

    if (matchesStandardNumber(standardNumber, "693")) {
      return "Seismic Design and Equipment Qualification";
    }

    if (matchesStandardNumber(standardNumber, "979")) {
      return "Fire Protection";
    }

    if (matchesStandardNumber(standardNumber, "980")) {
      return "Oil Spill Containment";
    }

    if (matchesStandardNumber(standardNumber, "998")) {
      return "Lightning Shielding";
    }

    if (matchesStandardNumber(standardNumber, "1127")) {
      return "Community and Environmental Compatibility";
    }

    if (matchesStandardNumber(standardNumber, "1246")) {
      return "Temporary Protective Grounding";
    }

    if (matchesStandardNumber(standardNumber, "1264")) {
      return "Animal Mitigation";
    }

    if (matchesStandardNumber(standardNumber, "1267")) {
      return "Project Specifications and Turnkey Delivery";
    }

    if (matchesStandardNumber(standardNumber, "1268")) {
      return "Mobile Substation Installation";
    }

    if (matchesStandardNumber(standardNumber, "1378")) {
      return "HVDC Converter Stations";
    }

    if (matchesStandardNumber(standardNumber, "1402")) {
      return "Physical Security";
    }

    if (matchesStandardNumber(standardNumber, "1427")) {
      return "Clearances and Insulation Levels";
    }

    if (matchesStandardNumber(standardNumber, "1527")) {
      return "Seismic Buswork";
    }

    if (matchesStandardNumber(standardNumber, "1818")) {
      return "Low-Voltage Auxiliary Systems";
    }

    return "General Substation Design and Operations";
  }

  if (series === "POWER_QUALITY") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (matchesAnyStandardNumber(standardNumber, ["519", "1531"])) {
      return "Harmonics and Harmonic Filters";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1159", "1159.3"])) {
      return "Monitoring and Data Exchange";
    }

    if (matchesStandardNumber(standardNumber, "1250")) {
      return "Voltage Quality";
    }

    if (matchesStandardNumber(standardNumber, "1409")) {
      return "Power Quality Improvement";
    }

    if (matchesStandardNumber(standardNumber, "1453")) {
      return "Flicker and Voltage Fluctuations";
    }

    if (matchesStandardNumber(standardNumber, "1459")) {
      return "Nonsinusoidal and Unbalanced Power Measurement";
    }

    if (matchesAnyStandardNumber(standardNumber, ["1564", "1668", "2938"])) {
      return "Voltage Sags and Ride-Through";
    }

    if (matchesStandardNumber(standardNumber, "2426")) {
      return "Transient Overvoltage Measurement";
    }

    return "General Power Quality";
  }

  if (series === "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesStandardNumber(standardNumber, "7-4.3.2")) {
      return "Digital Computers in Nuclear Safety Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["308", "765"])) {
      return "Class 1E Power Systems and Preferred Power Supply";
    }

    if (matchesAnyStandardNumber(standardNumber, ["323", "344", "382", "627", "1205"])) {
      return "Class 1E Equipment Qualification and Aging";
    }

    if (matchesAnyStandardNumber(standardNumber, ["317", "383", "572", "628", "690", "1186", "1682"])) {
      return "Nuclear Cables Penetrations and Raceway Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C37.81", "C37.82", "C37.98", "C37.105", "649"])) {
      return "Class 1E Switchgear and Protective Relays";
    }

    if (matchesStandardNumber(standardNumber, "334")) {
      return "Class 1E Motors";
    }

    if (matchesAnyStandardNumber(standardNumber, ["387", "2420", "63332-387"])) {
      return "Nuclear Standby Power Supplies";
    }

    if (matchesAnyStandardNumber(standardNumber, ["603", "338", "352", "379", "577"])) {
      return "Nuclear Safety Systems Criteria and Reliability";
    }

    if (matchesAnyStandardNumber(standardNumber, ["384", "415", "420", "494", "500", "741", "805", "833", "845", "934", "1023", "1082", "1290"])) {
      return "Nuclear Electrical Equipment Programs and Controls";
    }

    if (matchesStandardNumber(standardNumber, "336")) {
      return "Nuclear Facility Installation Inspection and Testing";
    }

    if (matchesStandardNumber(standardNumber, "622")) {
      return "Electric Heat Tracing for Nuclear Power Generating Stations";
    }

    if (matchesStandardNumber(standardNumber, "638")) {
      return "Class 1E Transformers";
    }

    if (matchesStandardNumber(standardNumber, "650")) {
      return "Class 1E Static Chargers and Inverters";
    }

    return "General Nuclear Power Electrical Equipment";
  }

  if (series === "GENERATORS_AND_EXCITATION") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["421.1", "421.2", "421.3", "421.4", "421.5", "421.6"])) {
      return "Excitation Systems";
    }

    if (matchesAnyStandardNumber(standardNumber, ["C50.12", "C50.13"])) {
      return "Synchronous Generator Requirements";
    }

    if (matchesAnyStandardNumber(standardNumber, ["387", "63332-387", "2420"])) {
      return "Standby Generator Units";
    }

    if (matchesStandardNumber(standardNumber, "115")) {
      return "Synchronous Machine Test Procedures";
    }

    if (matchesStandardNumber(standardNumber, "1553")) {
      return "Generator Insulation Testing";
    }

    if (matchesAnyStandardNumber(standardNumber, ["67", "492", "1129", "1665"])) {
      return "Generator Maintenance Repair and Monitoring";
    }

    if (matchesAnyStandardNumber(standardNumber, ["810", "1095", "1248"])) {
      return "Hydroelectric Installation and Commissioning";
    }

    return "General Electric Generators";
  }

  if (series === "ELECTRIC_MOTORS") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["841", "841.1"])) {
      return "Severe Duty Induction Motors";
    }

    if (matchesStandardNumber(standardNumber, "252")) {
      return "Induction Motor Test Procedures";
    }

    if (matchesStandardNumber(standardNumber, "334")) {
      return "Nuclear Safety-Related Motors";
    }

    if (matchesStandardNumber(standardNumber, "303")) {
      return "Motor Auxiliary Devices in Classified Locations";
    }

    if (matchesStandardNumber(standardNumber, "1068")) {
      return "AC Motor Repair and Rewinding";
    }

    return "General Electric Motors";
  }

  if (series === "ROTATING_MACHINE_TESTING") {
    const standardNumber = standardNumberFromDesignation(designation).toUpperCase();

    if (/corrigendum|corrigenda|amendment/.test(haystack)) {
      return "Amendments and Corrections";
    }

    if (matchesAnyStandardNumber(standardNumber, ["112", "620", "1812"])) {
      return "Machine Test Procedures and Performance";
    }

    if (matchesAnyStandardNumber(standardNumber, ["43", "56", "62.2", "95", "117", "286", "433", "434", "522", "1310", "1434", "1776", "1799", "2465"])) {
      return "Insulation Testing and Diagnostics";
    }

    if (matchesStandardNumber(standardNumber, "2455")) {
      return "DC Electric Machine Repair and Maintenance";
    }

    if (matchesStandardNumber(standardNumber, "1349")) {
      return "Hazardous Location Electric Machine Applications";
    }

    return "General Rotating Machine Testing";
  }

  return "General";
}

function recordTypeFor(title, designation) {
  const haystack = `${designation} ${title}`.toLowerCase();

  if (/corrigendum|corrigenda/.test(haystack)) {
    return "corrigendum";
  }

  if (/amendment/.test(haystack)) {
    return "amendment";
  }

  if (/recommended practice/.test(haystack)) {
    return "recommended_practice";
  }

  if (/guide/.test(haystack)) {
    return "guide";
  }

  return "standard";
}

function seriesMatchesUrl(series, url) {
  if (series === "C2") {
    return matchesAnyIeeeUrlNumber(url, ELECTRICAL_SAFETY_CODE_STANDARD_NUMBERS);
  }

  if (series === "GROUNDING") {
    return /\/ieee\/(?:80|81|837|C62\.92)(?:[./_-]|$)/i.test(url);
  }

  if (series === "CAPACITORS") {
    return matchesAnyIeeeUrlNumber(url, CAPACITOR_STANDARD_NUMBERS);
  }

  if (series === "REACTIVE_COMPENSATION") {
    return matchesAnyIeeeUrlNumber(url, REACTIVE_COMPENSATION_STANDARD_NUMBERS);
  }

  if (series === "HEAT_TRACING") {
    return matchesAnyIeeeUrlNumber(url, HEAT_TRACING_STANDARD_NUMBERS);
  }

  if (series === "CABLES") {
    return matchesAnyIeeeUrlNumber(url, CABLE_STANDARD_NUMBERS);
  }

  if (series === "BATTERIES") {
    return matchesAnyIeeeUrlNumber(url, BATTERY_STANDARD_NUMBERS);
  }

  if (series === "SUBSTATIONS") {
    return matchesAnyIeeeUrlNumber(url, SUBSTATION_STANDARD_NUMBERS);
  }

  if (series === "POWER_QUALITY") {
    return matchesAnyIeeeUrlNumber(url, POWER_QUALITY_STANDARD_NUMBERS);
  }

  if (series === "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT") {
    return matchesAnyIeeeUrlNumber(url, NUCLEAR_POWER_ELECTRICAL_EQUIPMENT_STANDARD_NUMBERS);
  }

  if (series === "GENERATORS_AND_EXCITATION") {
    return matchesAnyIeeeUrlNumber(url, GENERATOR_AND_EXCITATION_STANDARD_NUMBERS);
  }

  if (series === "ELECTRIC_MOTORS") {
    return matchesAnyIeeeUrlNumber(url, ELECTRIC_MOTOR_STANDARD_NUMBERS);
  }

  if (series === "ROTATING_MACHINE_TESTING") {
    return matchesAnyIeeeUrlNumber(url, ROTATING_MACHINE_TESTING_STANDARD_NUMBERS);
  }

  if (series === "OVERHEAD_TRANSMISSION_LINES") {
    return matchesAnyIeeeUrlNumber(url, OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS);
  }

  if (series === "TRANSPORTATION_TRACTION_POWER") {
    return matchesAnyIeeeUrlNumber(url, TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS);
  }

  if (series === "COMMUNICATIONS_SCADA_CYBERSECURITY") {
    return matchesAnyIeeeUrlNumber(url, COMMUNICATIONS_SCADA_CYBERSECURITY_STANDARD_NUMBERS);
  }

  if (series === "RELIABILITY_AND_AVAILABILITY") {
    return /\/ieee\/(?:3006(?:\.\d+)?|493|762|859|1240|1366)(?:[./_-]|$)/i.test(url);
  }

  if (series === "3000") {
    return /\/ieee\/300[0-7](?:[./_-]|$)/i.test(url);
  }

  const suffix = series.startsWith("C") ? "[./_-]|$" : "[a-z]|[./_-]|$";
  return new RegExp(`/ieee/${series.replace("C", "[Cc]")}(?:${suffix})`, "i").test(url);
}

function seriesFromDesignation(designation) {
  const standardNumber = standardNumberFromDesignation(designation).toUpperCase();
  const cSeriesMatch = standardNumber.match(/^(C(?:37|57|62|63|95|135))\b/);

  if (matchesAnyStandardNumber(standardNumber, ELECTRICAL_SAFETY_CODE_STANDARD_NUMBERS)) {
    return "C2";
  }

  if (/^C62\.92(?:\.|-|$)/.test(standardNumber)) {
    return "GROUNDING";
  }

  if (matchesAnyStandardNumber(standardNumber, NUCLEAR_POWER_ELECTRICAL_EQUIPMENT_STANDARD_NUMBERS)) {
    return "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT";
  }

  if (cSeriesMatch) {
    return cSeriesMatch[1];
  }

  if (/^1547(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "1547";
  }

  if (/^1584(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "1584";
  }

  if (/^2030(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "2030";
  }

  if (matchesAnyStandardNumber(standardNumber, BATTERY_STANDARD_NUMBERS)) {
    return "BATTERIES";
  }

  if (/^2800(?:[A-Z]|\.\d+|-|$)/.test(standardNumber)) {
    return "2800";
  }

  if (isReliabilityAndAvailabilityStandardNumber(standardNumber)) {
    return "RELIABILITY_AND_AVAILABILITY";
  }

  if (/^300[0-7](?:\.\d+|-|$)/.test(standardNumber)) {
    return "3000";
  }

  if (/^(?:80|81|837)(?:\.\d+|-|$)/.test(standardNumber)) {
    return "GROUNDING";
  }

  if (matchesAnyStandardNumber(standardNumber, CAPACITOR_STANDARD_NUMBERS)) {
    return "CAPACITORS";
  }

  if (matchesAnyStandardNumber(standardNumber, REACTIVE_COMPENSATION_STANDARD_NUMBERS)) {
    return "REACTIVE_COMPENSATION";
  }

  if (matchesAnyStandardNumber(standardNumber, HEAT_TRACING_STANDARD_NUMBERS)) {
    return "HEAT_TRACING";
  }

  if (matchesAnyStandardNumber(standardNumber, CABLE_STANDARD_NUMBERS)) {
    return "CABLES";
  }

  if (matchesAnyStandardNumber(standardNumber, SUBSTATION_STANDARD_NUMBERS)) {
    return "SUBSTATIONS";
  }

  if (matchesAnyStandardNumber(standardNumber, POWER_QUALITY_STANDARD_NUMBERS)) {
    return "POWER_QUALITY";
  }

  if (matchesAnyStandardNumber(standardNumber, OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS)) {
    return "OVERHEAD_TRANSMISSION_LINES";
  }

  if (matchesAnyStandardNumber(standardNumber, TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS)) {
    return "TRANSPORTATION_TRACTION_POWER";
  }

  if (matchesAnyStandardNumber(standardNumber, COMMUNICATIONS_SCADA_CYBERSECURITY_STANDARD_NUMBERS)) {
    return "COMMUNICATIONS_SCADA_CYBERSECURITY";
  }

  if (matchesAnyStandardNumber(standardNumber, GENERATOR_AND_EXCITATION_STANDARD_NUMBERS)) {
    return "GENERATORS_AND_EXCITATION";
  }

  if (matchesAnyStandardNumber(standardNumber, ELECTRIC_MOTOR_STANDARD_NUMBERS)) {
    return "ELECTRIC_MOTORS";
  }

  if (matchesAnyStandardNumber(standardNumber, ROTATING_MACHINE_TESTING_STANDARD_NUMBERS)) {
    return "ROTATING_MACHINE_TESTING";
  }

  return "";
}

function normalizeSeriesArg(value) {
  const normalized = value.toUpperCase().replace(/^C-95$/, "C95");

  if (
    ["NESC", "ELECTRICAL_SAFETY_CODES", "SAFETY_CODES", "UTILITY_SAFETY"].includes(normalized) ||
    matchesAnyStandardNumber(normalized, ELECTRICAL_SAFETY_CODE_STANDARD_NUMBERS)
  ) {
    return "C2";
  }

  if (
    ["GROUND", "GROUNDING", "80", "81", "837", "C62.92"].includes(normalized) ||
    /^C62\.92(?:\.|-|$)/.test(normalized)
  ) {
    return "GROUNDING";
  }

  if (
    ["EMC", "ELECTROMAGNETIC_COMPATIBILITY", "RADIO_NOISE", "RADIO_NOISE_MEASUREMENTS"].includes(normalized) ||
    /^C63(?:[A-Z]|\.\d+|-|\/|$)/.test(normalized)
  ) {
    return "C63";
  }

  if (
    ["CAPACITOR", "CAPACITORS"].includes(normalized) ||
    CAPACITOR_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "CAPACITORS";
  }

  if (
    ["REACTIVE", "REACTIVE_COMPENSATION", "REACTIVE_POWER_COMPENSATION", "SVC", "STATCOM", "VAR_COMPENSATION"].includes(normalized) ||
    REACTIVE_COMPENSATION_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "REACTIVE_COMPENSATION";
  }

  if (
    ["HEAT_TRACING", "TRACE_HEATING", "ELECTRIC_HEAT_TRACING"].includes(normalized) ||
    HEAT_TRACING_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "HEAT_TRACING";
  }

  if (
    ["NUCLEAR", "NUCLEAR_POWER", "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT", "CLASS_1E"].includes(normalized) ||
    NUCLEAR_POWER_ELECTRICAL_EQUIPMENT_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "NUCLEAR_POWER_ELECTRICAL_EQUIPMENT";
  }

  if (
    ["CABLE", "CABLES", "INSULATED_CONDUCTORS"].includes(normalized) ||
    CABLE_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "CABLES";
  }

  if (
    ["BATTERY", "BATTERIES", "DC", "DC_SYSTEMS"].includes(normalized) ||
    BATTERY_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "BATTERIES";
  }

  if (
    ["SUBSTATION", "SUBSTATIONS"].includes(normalized) ||
    SUBSTATION_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "SUBSTATIONS";
  }

  if (
    ["POWER_QUALITY", "POWERQUALITY", "PQ", "HARMONICS"].includes(normalized) ||
    POWER_QUALITY_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "POWER_QUALITY";
  }

  if (
    ["RELIABILITY", "RELIABILITY_AND_AVAILABILITY", "AVAILABILITY", "POWER_SYSTEM_RELIABILITY"].includes(normalized) ||
    isReliabilityAndAvailabilityStandardNumber(normalized)
  ) {
    return "RELIABILITY_AND_AVAILABILITY";
  }

  if (
    ["ELECTRIC_MACHINERY", "MACHINERY", "MACHINES", "ROTATING_MACHINES"].includes(normalized)
  ) {
    return ["GENERATORS_AND_EXCITATION", "ELECTRIC_MOTORS", "ROTATING_MACHINE_TESTING"];
  }

  if (
    ["GENERATOR", "GENERATORS", "GENERATION", "ELECTRIC_GENERATORS", "GENERATORS_AND_EXCITATION", "EXCITATION"].includes(normalized) ||
    GENERATOR_AND_EXCITATION_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "GENERATORS_AND_EXCITATION";
  }

  if (
    ["MOTOR", "MOTORS", "ELECTRIC_MOTORS", "MOTOR_APPLICATIONS"].includes(normalized) ||
    ELECTRIC_MOTOR_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "ELECTRIC_MOTORS";
  }

  if (
    ["ROTATING_MACHINE_TESTING", "MACHINE_TESTING", "MACHINE_DIAGNOSTICS", "INSULATION_DIAGNOSTICS"].includes(normalized) ||
    ROTATING_MACHINE_TESTING_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "ROTATING_MACHINE_TESTING";
  }

  if (
    ROTATING_MACHINE_STANDARD_NUMBERS.includes(normalized)
  ) {
    return ["GENERATORS_AND_EXCITATION", "ELECTRIC_MOTORS", "ROTATING_MACHINE_TESTING"];
  }

  if (
    ["OVERHEAD_TRANSMISSION_LINES", "OVERHEAD_LINES", "TRANSMISSION_LINES", "TRANSMISSION_LINE", "OHL"].includes(normalized) ||
    OVERHEAD_TRANSMISSION_LINE_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "OVERHEAD_TRANSMISSION_LINES";
  }

  if (
    ["TRANSPORTATION", "TRACTION", "TRACTION_POWER", "TRANSPORTATION_TRACTION_POWER", "RAIL", "RAIL_TRANSIT", "OCS", "CBTC"].includes(normalized) ||
    TRANSPORTATION_TRACTION_POWER_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "TRANSPORTATION_TRACTION_POWER";
  }

  if (
    ["COMMUNICATIONS_SCADA_CYBERSECURITY", "COMMUNICATIONS", "SCADA", "IED_CYBERSECURITY", "CYBERSECURITY", "DNP3", "PSCC"].includes(normalized) ||
    COMMUNICATIONS_SCADA_CYBERSECURITY_STANDARD_NUMBERS.includes(normalized)
  ) {
    return "COMMUNICATIONS_SCADA_CYBERSECURITY";
  }

  return normalized;
}

function matchesAnyIeeeUrlNumber(url, standardNumbers) {
  return standardNumbers.some((standardNumber) =>
    new RegExp(
      `/ieee/${escapeRegExp(standardNumber)}(?:[a-z]|[./_-]|$)`,
      "i"
    ).test(url)
  );
}

function matchesAnyStandardNumber(standardNumber, standardNumbers) {
  return standardNumbers.some((candidate) =>
    matchesStandardNumber(standardNumber, candidate)
  );
}

function isReliabilityAndAvailabilityStandardNumber(standardNumber) {
  const normalized = standardNumber.toUpperCase();

  return /^3006(?:\.|-|$)/.test(normalized) ||
    matchesAnyStandardNumber(normalized, RELIABILITY_AND_AVAILABILITY_STANDARD_NUMBERS);
}

function matchesStandardNumber(standardNumber, candidate) {
  return new RegExp(
    `^${escapeRegExp(candidate.toUpperCase())}(?:[A-Z]|-|/|$)`
  ).test(standardNumber.toUpperCase());
}

function isInactiveReference(record) {
  return INACTIVE_REFERENCE_DESIGNATIONS.has(record.designation);
}

function editionFromDesignation(designation) {
  return designation.match(/-(\d{4})(?:\b|$)/)?.[1] ?? "";
}

function compareDesignation(a, b) {
  return numericTokens(a).localeCompare(numericTokens(b), undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

function seriesSortIndex(series) {
  const index = [...SERIES.keys()].indexOf(series);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function numericTokens(value) {
  return standardNumberFromDesignation(value);
}

function standardNumberFromDesignation(value) {
  return value.replace(
    /^(?:IEEE\/ANSI\/USEMCSC|ANSI\/IEEE|IEEE\/ANSI|ANSI\/USEMCSC|IEEE\/IEC|IEC\/IEEE|IEEE\/CSA|CSA\/IEEE|IEEE\/NACE|NACE\/IEEE|IEEE\/AMPP|AMPP\/IEEE|IEEE|ANSI)\s+(?:Std\s+)?/i,
    ""
  );
}

function parseMetaTags(html) {
  const meta = {};

  for (const match of html.matchAll(
    /<meta\s+name=["']([^"']+)["']\s+content=["']([\s\S]*?)["']\s*\/?>/gi
  )) {
    meta[match[1]] = decodeHtml(match[2]);
  }

  return meta;
}

function htmlField(html, id) {
  const match = html.match(
    new RegExp(`<dd\\b[^>]*id=["']${escapeRegExp(id)}["'][^>]*>([\\s\\S]*?)<\\/dd>`, "i")
  );

  return match ? stripHtml(match[1]) : "";
}

function extractXmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) =>
    decodeHtml(match[1]).trim()
  );
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const itemIndex = index;
      index += 1;

      try {
        results[itemIndex] = await mapper(items[itemIndex], itemIndex);
      } catch (error) {
        results[itemIndex] = {
          url: items[itemIndex],
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

async function fetchText(url, attempts = FETCH_ATTEMPTS) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "PowerSystemStandardsRegistry/0.1 metadata research"
        },
        redirect: "follow",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Fetch failed ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await wait(attempt * 500);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`GET ${url} failed: ${lastError?.message ?? lastError}`);
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cleanTitle(value) {
  return value.replace(/^IEEE SA\s+-\s+/i, "").trim();
}

function cleanText(value) {
  return stripHtml(value ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " "));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&trade;|&#8482;|&#x2122;/g, "")
    .replace(/&reg;|&#174;|&#x00AE;/g, "")
    .replace(/&ndash;|&dash;|&#8211;|&#x2013;/g, "-")
    .replace(/&mdash;|&#8212;|&#x2014;/g, "-")
    .replace(/&rsquo;|&#8217;|&#x2019;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, "\"")
    .replace(/&#039;|&apos;/g, "'")
    .trim();
}

function slugify(value) {
  return value
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dedupeBy(rows, keyFn) {
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

function toCsv(rows) {
  return [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      CSV_HEADERS.map((header) => csvCell(row[header] ?? "")).join(",")
    )
  ].join("\n") + "\n";
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

function csvCell(value) {
  const text = String(value)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\u2010|\u2011|\u2012|\u2013|\u2014/g, "-")
    .replace(/\u2122|\u00AE/g, "")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, "\"");

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  return text;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
