const DRIVER_NUMERIC_FIELDS = [
  'FatalCollisionBillion',
  'PercentSpeeding',
  'PercentAlcoholImpaired',
  'PercentNotDistracted',
  'PercentNewAccidents',
  'InsurancePremiums',
  'LossesIncurredByInsurance'
]

export function parseDriversCsv(csvText) {
  const [headerLine, ...lines] = csvText.trim().split(/\r?\n/)
  const headers = headerLine.split(',')

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => normalizeDriverRow(splitCsvLine(line), headers))
}

export function getGeoFeatures(geoJson) {
  return Array.isArray(geoJson?.features) ? geoJson.features : []
}

export function buildStateLookup(driverRows) {
  return new Map(driverRows.map((row) => [row.State, row]))
}

export function buildMetricLookup(driverRows, metricKey = 'FatalCollisionBillion') {
  return new Map(driverRows.map((row) => [row.State, toNumber(row[metricKey])]))
}

/** Returns the highest and lowest value for a given metric */
export function getMetricExtent(driverRows, metricKey) {
  const values = driverRows
    .map((row) => toNumber(row[metricKey]))
    .filter((value) => Number.isFinite(value))

  if (values.length === 0) {
    return [0, 0]
  }

  return [Math.min(...values), Math.max(...values)]
}

export function buildMapFeatureData(geoFeatures, driverRows, metricKey, selectedStateName) {
  const stateLookup = buildStateLookup(driverRows)

  return geoFeatures.map((feature) => {
    const stateName = feature?.properties?.name ?? ''
    const row = stateLookup.get(stateName) ?? null
    const value = row ? toNumber(row[metricKey]) : null

    return {
      id: feature?.id ?? stateName,
      feature,
      stateName,
      row,
      value,
      fatalCollisionRate: row ? toNumber(row.FatalCollisionBillion) : null,
      isSelected: stateName === selectedStateName,
      hasData: row !== null
    }
  })
}

export function getComparisonSet(driverRows, selectedStateName, metricKey) {
  const stateLookup = buildStateLookup(driverRows)
  const selectedState = stateLookup.get(selectedStateName) ?? null

  if (driverRows.length === 0) {
    return {
      selectedState,
      lowerState: null,
      upperState: null,
      metricKey
    }
  }

  const sortedRows = [...driverRows].sort((leftRow, rightRow) => {
    return toNumber(leftRow[metricKey]) - toNumber(rightRow[metricKey])
  })

  return {
    selectedState,
    lowerState: sortedRows[0] ?? null,
    upperState: sortedRows[sortedRows.length - 1] ?? null,
    metricKey
  }
}

export function buildStackedComparisonData(driverRows, selectedStateName, metricKey) {
  const comparisonSet = getComparisonSet(driverRows, selectedStateName, metricKey)
  const comparisonRows = [comparisonSet.lowerState, comparisonSet.selectedState, comparisonSet.upperState]

  return comparisonRows.filter(Boolean).map((row) => buildStackedComparisonRow(row, metricKey))
}

function buildStackedComparisonRow(row, metricKey) {
  const totalFatalCollisionBillion = toNumber(row.FatalCollisionBillion)
  const metricValue = toNumber(row[metricKey])
  const comparedCollisionBurden = (metricValue / 100) * totalFatalCollisionBillion
  const remainderCollisionBurden = totalFatalCollisionBillion - comparedCollisionBurden

  return {
    State: row.State,
    metricKey,
    metricValue,
    totalFatalCollisionBillion,
    comparedCollisionBurden,
    remainderCollisionBurden,
    stackedSegments: {
      compared: comparedCollisionBurden,
      remainder: remainderCollisionBurden
    }
  }
}

/** Trim any trailing whitespace from values, convert numeric values from string to number. */
function normalizeDriverRow(values, headers) {
  const row = {}

  headers.forEach((header, index) => {
    const rawValue = (values[index] ?? '').trim()
    row[header] = DRIVER_NUMERIC_FIELDS.includes(header) ? Number(rawValue) : rawValue
  })

  return row
}

function splitCsvLine(line) {
  return line.split(',')
}

function toNumber(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}