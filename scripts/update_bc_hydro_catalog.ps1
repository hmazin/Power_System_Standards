$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$dataPath = Join-Path $repoRoot "data\bc_hydro_standards.csv"

$headers = @(
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
  "notes"
)

$sourcePages = @(
  @{
    url = "https://app.bchydro.com/accounts-billing/electrical-connections/distribution-standards.html"
    host = "https://app.bchydro.com"
    area = "distribution"
    label = "Distribution Technical Standards and Guides"
  },
  @{
    url = "https://app.bchydro.com/accounts-billing/electrical-connections/distribution-generator-interconnections.html"
    host = "https://app.bchydro.com"
    area = "dgi"
    label = "Distribution Generator Interconnections"
  },
  @{
    url = "https://app.bchydro.com/accounts-billing/electrical-connections/transmission-generator-interconnections.html"
    host = "https://app.bchydro.com"
    area = "tgi"
    label = "Transmission Generator Interconnections"
  },
  @{
    url = "https://www.bchydro.com/toolbar/about/strategies-plans-regulatory/tariffs-terms-conditions/oatt.html"
    host = "https://www.bchydro.com"
    area = "oatt"
    label = "Open Access Transmission Tariff"
  },
  @{
    url = "https://www.bchydro.com/toolbar/about/strategies-plans-regulatory/tariffs-terms-conditions/electric-tariff.html"
    host = "https://www.bchydro.com"
    area = "electric_tariff"
    label = "Electric Tariff"
  },
  @{
    url = "https://www.bchydro.com/energy-in-bc/operations/transmission/transmission-system/system-operating-orders.html"
    host = "https://www.bchydro.com"
    area = "soo"
    label = "System Operating Orders"
  },
  @{
    url = "https://www.bchydro.com/energy-in-bc/operations/transmission/transmission-plan/transmission-capital-planning.html"
    host = "https://www.bchydro.com"
    area = "transmission_planning"
    label = "Transmission Capital Planning"
  }
)

$titleOverrides = @{
  "distribution-generator-interconnection-data-form-35kv-less" = "Distribution Generator Interconnection Data Form 35 kV and Less"
  "dgi-basic-distribution-system-information-request-application" = "Basic Distribution System Information Request Application"
  "dgi-screening-study-application-form" = "Screening Study Application Form"
  "dgi-system-impact-data-form-non-integrated-area" = "System Impact Data Form for Non-Integrated Area GHG Reduction"
  "first-nations-electricity-program-application-form" = "First Nations Electricity Program Application Form"
  "first-nations-electricity-program-fact-sheet" = "First Nations Electricity Program Fact Sheet"
  "community-generation-application-form" = "Community Generation Application Form"
  "dgi-basic-distribution-system-information-fact-sheet" = "Basic Distribution System Information Request Fact Sheet"
  "dgi-facilities-study-fact-sheet" = "Facilities Study Fact Sheet"
  "dgi-system-impact-study-fact-sheet" = "System Impact Study Fact Sheet"
  "Screening-Study-Fact-Sheet-" = "Screening Study Fact Sheet"
  "application-agreement-system-impact-study" = "System Impact Study Agreement"
  "application-facilities-study-agrement-template" = "Facilities Study Agreement Template"
  "distribution-generator-interconnection-agreement" = "Distribution Generator Interconnection Agreement"
  "LA-DGI-Requirements-Amendment" = "Distribution Generator Interconnection Requirements Amendment 1"
  "LA-DGI-Requirements-Amendment-2-ctt-shorepower" = "Distribution Generator Interconnection Requirements Amendment 2 - CTT Shore Power"
  "ds-dgi-requirements-ammendment-1" = "Distribution Generator Interconnection Requirements Amendment 1"
  "ds-dgi-requirements-ammendment-2" = "Distribution Generator Interconnection Requirements Amendment 2 - CTT Shore Power"
  "tgi-interconnection-request-generator-interconnection-data-form" = "Generator Interconnection Data Form"
  "tgi-interconnection-request-for-a-generating-factility" = "Interconnection Request for a Generating Facility"
  "tgi-security-methodology-faq" = "Interconnection Security Methodology FAQ"
  "qualified-change-definition-and-determination-process" = "Qualified Change Definition and Determination Process"
  "site-control-criteria" = "Site Control Criteria"
  "system-impact-study-data-form" = "System Impact Study Generator Interconnection Data Form"
  "16-attachment-m1-oatt" = "Standard Generator Interconnection Procedures including SGIA"
  "18-attachment-m1-appendix-2-oatt" = "Attachment M-1 Appendix 2: Interconnection Feasibility Study Agreement"
  "19-attachment-m1-appendix-3-oatt" = "Attachment M-1 Appendix 3: Combined Study Agreement"
  "21-attachment-m1-appendix-5-oatt" = "Attachment M-1 Appendix 5: Standard Generator Interconnection Agreement (SGIA)"
}

function Normalize-Text([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return ""
  }

  $text = [System.Net.WebUtility]::HtmlDecode($value)
  $text = $text -replace [char]0x00A0, " "
  $text = $text -replace [char]0x2010, "-"
  $text = $text -replace [char]0x2011, "-"
  $text = $text -replace [char]0x2012, "-"
  $text = $text -replace [char]0x2013, "-"
  $text = $text -replace [char]0x2014, "-"
  $text = $text -replace [char]0x2018, "'"
  $text = $text -replace [char]0x2019, "'"
  $text = $text -replace [char]0x201C, '"'
  $text = $text -replace [char]0x201D, '"'
  $text = $text -replace [char]0x00AE, ""
  $text = $text -replace [char]0x2122, ""
  $text = $text -replace "\s+", " "
  return $text.Trim()
}

function Get-FileStem([string]$url) {
  $leaf = [System.IO.Path]::GetFileName(([System.Uri]$url).AbsolutePath)
  return $leaf -replace "\.[^.]+$", ""
}

function To-TitleFromStem([string]$stem) {
  $text = $stem -replace "%20", " "
  $text = $text -replace "[-_]+", " "
  $text = $text -replace "\s+", " "
  return (Get-Culture).TextInfo.ToTitleCase($text.Trim().ToLowerInvariant())
}

function Get-Title([string]$text, [string]$url) {
  $title = Normalize-Text $text
  $stem = Get-FileStem $url

  foreach ($key in $titleOverrides.Keys) {
    if ($stem -like "*$key*") {
      return $titleOverrides[$key]
    }
  }

  if ($title -in @("Application form", "Fact sheet", "Sample agreement")) {
    return To-TitleFromStem $stem
  }

  return $title
}

function To-Slug([string]$value) {
  $text = (Normalize-Text $value).ToUpperInvariant()
  $text = $text -replace "&", " AND "
  $text = $text -replace "[^A-Z0-9]+", "-"
  $text = $text.Trim("-")
  if ($text.Length -gt 84) {
    $text = $text.Substring(0, 84).Trim("-")
  }
  return $text
}

function Get-Designation([string]$title, [string]$url, [string]$area) {
  if ($title -match "^(ES\d{2}\s+[A-Z]\d?(?:-\d{2})?)") {
    return $matches[1]
  }
  if ($title -match "^(ES\d{2}\s+[A-Z])\s") {
    return $matches[1]
  }
  if ($title -match "Information Bulletin(?:\s+(\d{4}-\d{3}(?:\s+R\d)?))?") {
    if ($matches[1]) {
      return "Information Bulletin " + ($matches[1] -replace "\s+", " ")
    }
    $stem = Get-FileStem $url
    if ($stem -match "(EA\d{4}-\d{3}(?:-R\d|R\d)?)") {
      return "Information Bulletin " + ($matches[1] -replace "-", " ")
    }
    return "Information Bulletin"
  }
  if ($title -match "^Attachment\s+([^:]+)") {
    return "Attachment " + $matches[1].Trim()
  }
  if ($title -match "Tariff Supplement\s+(\d+)") {
    return "Tariff Supplement " + $matches[1]
  }
  if ($title -match "^Schedule\s+(\d+)") {
    return "Schedule " + $matches[1]
  }
  if ($title -match "No\.\s*([0-9]+)\s*R([0-9]+)") {
    return "COWS " + $matches[1] + " R" + $matches[2]
  }
  if ($title -match "^(POR\s+\d{4}-\d{3}\s+R\d)") {
    return $matches[1]
  }
  if ($title -match "^(SOO\s+\d[A-Z]-\d+)") {
    return $matches[1]
  }
  if ($area -eq "oatt") {
    return "OATT " + ((To-Slug $title) -replace "^OPEN-ACCESS-TRANSMISSION-TARIFF-", "")
  }
  if ($area -eq "electric_tariff") {
    return "Electric Tariff " + ((To-Slug $title) -replace "^ELECTRIC-TARIFF-", "")
  }

  $words = (Normalize-Text $title).Split(" ") | Where-Object { $_ }
  return ($words | Select-Object -First 6) -join " "
}

function Get-RecordType([string]$title, [string]$url, [string]$area) {
  if ($title -match "Information Bulletin") { return "information_bulletin" }
  if ($title -match "^Attachment") { return "tariff_attachment" }
  if ($title -match "Tariff Supplement") { return "tariff_supplement" }
  if ($title -match "^Schedule\s+\d+") { return "tariff_schedule" }
  if ($title -match "Terms and Conditions") { return "tariff_terms" }
  if ($title -match "Agreement") { return "agreement" }
  if ($title -match "Checklist") { return "checklist" }
  if ($title -match "Application|Form|POR\s") { return "form" }
  if ($title -match "Fact Sheet|FAQ") { return "fact_sheet" }
  if ($title -match "Sample SLD") { return "sample_drawing" }
  if ($title -match "Guide|Guidelines|Process|Criteria") { return "guidance" }
  if ($title -match "Methodology") { return "methodology" }
  if ($title -match "Procedure|Procedures") { return "procedure" }
  if ($title -match "No\.\s*[0-9]+") { return "work_specification" }
  if ($area -eq "soo") { return "operating_order" }
  if ($area -in @("oatt", "electric_tariff")) { return "tariff" }
  return "standard"
}

function Get-Category([string]$title, [string]$area) {
  if ($area -eq "oatt") { return "BC Hydro transmission tariff" }
  if ($area -eq "electric_tariff") { return "BC Hydro electric tariff" }
  if ($area -eq "soo") { return "BC Hydro system operating orders" }
  if ($area -eq "transmission_planning") { return "BC Hydro transmission planning" }
  if ($area -eq "tgi") { return "BC Hydro transmission generator interconnection" }
  if ($area -eq "dgi") {
    if ($title -match "CTT|Closed Transition") { return "BC Hydro closed transition transfer interconnection" }
    return "BC Hydro distribution generator interconnection"
  }
  if ($title -match "^ES43") { return "BC Hydro overhead distribution standards" }
  if ($title -match "^ES53") { return "BC Hydro underground electrical standards" }
  if ($title -match "^ES54") { return "BC Hydro underground civil standards" }
  if ($title -match "^ES55") { return "BC Hydro power quality standards" }
  if ($title -match "Revenue|Meter|EATON|socket") { return "BC Hydro revenue metering requirements" }
  if ($title -match "Primary Service|Primary Guide") { return "BC Hydro primary service requirements" }
  if ($title -match "Secondary") { return "BC Hydro secondary service requirements" }
  if ($title -match "Class of Work|No\.\s*[0-9]+") { return "BC Hydro class of work specifications" }
  if ($title -match "Distribution Generator|Generator Islanding|100 kW") { return "BC Hydro distribution generator interconnection" }
  if ($title -match "Information Bulletin") { return "BC Hydro distribution information bulletins" }
  return "BC Hydro distribution technical publications"
}

function Get-LatestEdition([string]$title) {
  if ($title -match "Revision\s*([0-9]+).*(20[0-9]{2})") {
    return "Revision " + $matches[1] + " " + $matches[2]
  }
  if ($title -match "\bR([0-9]+)\b") {
    return "R" + $matches[1]
  }
  if ($title -match "\b(20[0-9]{2})[- ]([0-9]{3})\b") {
    return $matches[1] + "-" + $matches[2]
  }
  if ($title -match "\b(20[0-9]{2})\b") {
    return $matches[1]
  }
  return "current"
}

function Get-Applicability([string]$recordType, [string]$area) {
  if ($recordType -in @("tariff", "tariff_terms", "tariff_schedule", "tariff_attachment", "tariff_supplement")) {
    return "Regulated tariff terms where applicable"
  }
  if ($recordType -in @("form", "checklist", "fact_sheet", "sample_drawing", "guidance")) {
    return "Supporting workflow or guidance document"
  }
  if ($area -in @("dgi", "tgi")) {
    return "BC Hydro interconnection requirement where applicable"
  }
  return "BC Hydro requirement or reference where applicable"
}

function Should-Include([object]$link) {
  $title = $link.title
  $href = $link.href
  $area = $link.area

  if ([string]::IsNullOrWhiteSpace($title)) { return $false }
  if ($href -match "#(main-content)?$|#$|#accordion_item|#contact|#reports|#process|#technical|#revenue|#community-generation|#first-nations-electricity-program|#information-policies|#ceap|#transmissionstudy|#transmission") { return $false }
  if ($title -in @("Skip to content", "Top of page", "How to reach us", "contact us", "Transmission Generators team")) { return $false }
  if ($title -in @("Distribution Technical Standards & Guides", "Distribution Technical Standards and Guides", "technical standards and guides", "Open Access Transmission Tariff", "Electric Tariff")) { return $false }
  if ($title -match "^20[0-9]{2} Information Bulletins$|^20[0-9]{2}-[0-9]{3}$|^ES\d{2} .+Information Bulletins$") { return $false }

  switch ($area) {
    "distribution" {
      return ($href -match "distribution-standards|/distribution/standards/" -and $title -notmatch "^Distribution Standards")
    }
    "dgi" {
      return ($href -match "/content/dam/|distribution-generator-interconnections|distribution-standards" -and $title -notmatch "^Distribution Generator Interconnections$")
    }
    "tgi" {
      return ($href -match "/content/dam/|transmission-generator-interconnections|system-operating-orders" -and $title -notmatch "^Transmission Generator Interconnections$")
    }
    "oatt" {
      return ($href -match "/content/dam/.+open-access-transmission-tariff|/content/dam/.+electric-tariff/00-bch-oatt")
    }
    "electric_tariff" {
      return ($href -match "/content/dam/" -and $title -match "Electric Tariff|Tariff Supplement")
    }
    "soo" {
      return ($href -match "system_operating_orders")
    }
    "transmission_planning" {
      return ($href -match "/content/dam/.+(transmission-planning|transmission-tariff)")
    }
  }

  return $false
}

function Escape-CsvValue([object]$value) {
  if ($null -eq $value) {
    return ""
  }
  $text = [string]$value
  if ($text -match '[,"\r\n]') {
    return '"' + ($text -replace '"', '""') + '"'
  }
  return $text
}

function Convert-RowToCsv([hashtable]$row) {
  $values = foreach ($header in $headers) {
    Escape-CsvValue $row[$header]
  }
  return ($values -join ",")
}

$existingRows = Import-Csv $dataPath
$existingIds = @{}
$existingUrls = @{}
$existingTitles = @{}
foreach ($row in $existingRows) {
  $existingIds[$row.standard_id] = $true
  $existingUrls[$row.official_url] = $true
  $existingTitles[(Normalize-Text $row.title).ToLowerInvariant()] = $true
}

$candidateMap = @{}
foreach ($page in $sourcePages) {
  $html = (Invoke-WebRequest -Uri $page.url -UseBasicParsing).Content
  $matches = [regex]::Matches($html, '<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', [System.Text.RegularExpressions.RegexOptions]::Singleline)

  foreach ($match in $matches) {
    $href = $match.Groups[1].Value
    $text = [regex]::Replace($match.Groups[2].Value, "<.*?>", "")
    $text = Normalize-Text $text

    if ($href.StartsWith("/")) {
      $href = $page.host + $href
    }

    $title = Get-Title $text $href
    $link = [pscustomobject]@{
      title = $title
      href = $href
      area = $page.area
      source = $page.url
      label = $page.label
    }

    if (-not (Should-Include $link)) {
      continue
    }

    $key = ($title.ToLowerInvariant() + "|" + $href.ToLowerInvariant())
    if (-not $candidateMap.ContainsKey($key)) {
      $candidateMap[$key] = $link
    }
  }
}

$newRows = New-Object System.Collections.Generic.List[hashtable]
foreach ($link in ($candidateMap.Values | Sort-Object area,title,href)) {
  $titleKey = (Normalize-Text $link.title).ToLowerInvariant()
  if ($existingUrls.ContainsKey($link.href) -or $existingTitles.ContainsKey($titleKey)) {
    continue
  }

  $designation = Get-Designation $link.title $link.href $link.area
  $idBase = "BCHYDRO-" + (To-Slug $designation)
  if ($idBase -eq "BCHYDRO-" -or $existingIds.ContainsKey($idBase)) {
    $idBase = "BCHYDRO-" + (To-Slug $link.title)
  }
  if ($idBase -eq "BCHYDRO-" -or $existingIds.ContainsKey($idBase)) {
    $idBase = "BCHYDRO-" + (To-Slug (Get-FileStem $link.href))
  }

  $standardId = $idBase
  $suffix = 2
  while ($existingIds.ContainsKey($standardId)) {
    $standardId = $idBase + "-" + $suffix
    $suffix += 1
  }

  $recordType = Get-RecordType $link.title $link.href $link.area
  $category = Get-Category $link.title $link.area
  $summaryTitle = (Normalize-Text $link.title).TrimEnd(".")

  $row = @{
    standard_id = $standardId
    designation = $designation
    title = $link.title
    publisher = "BC Hydro"
    record_type = $recordType
    country_scope = "Canada - British Columbia"
    primary_category = $category
    latest_known_edition = Get-LatestEdition $link.title
    applicability = Get-Applicability $recordType $link.area
    summary = "BC Hydro record for $summaryTitle."
    official_url = $link.href
    notes = "Extracted from official BC Hydro $($link.label) source page."
  }

  $newRows.Add($row)
  $existingIds[$standardId] = $true
  $existingUrls[$link.href] = $true
  $existingTitles[$titleKey] = $true
}

if ($newRows.Count -gt 0) {
  $lines = foreach ($row in $newRows) {
    Convert-RowToCsv $row
  }
  Add-Content -Path $dataPath -Value $lines -Encoding utf8
}

Write-Output "candidate_links=$($candidateMap.Count)"
Write-Output "new_rows=$($newRows.Count)"
Write-Output "total_rows=$((Import-Csv $dataPath).Count)"
