import { computed, ref } from 'vue'
import { DEFAULT_METRIC_KEY, METRIC_OPTIONS } from '../constants/metrics'
import {
  buildMapFeatureData,
  buildMetricLookup,
  buildStackedComparisonData,
  buildStateLookup,
  getComparisonSet,
  getGeoFeatures,
  getMetricExtent,
  parseDriversCsv
} from '../utils/roadSafetyData'

// Module-scoped refs make this composable a shared singleton store without Pinia.
const driverRows = ref([])
const geoFeatures = ref([])
const selectedStateName = ref('Ohio')
const activeMetricKey = ref(DEFAULT_METRIC_KEY)
const storyStep = ref(0)
const visitedStates = ref(new Set())
const tooltip = ref({ visible: false, title: '', value: '', x: 0, y: 0 })
const loading = ref(false)
const loadError = ref('')

let hasLoaded = false
let loadRequest = null

const STORY_MILESTONES = [
  { id: 0, label: 'Intro and map context' },
  { id: 1, label: 'Initial state selection and baseline comparison' },
  { id: 2, label: 'Metric switch and interpretation' },
  { id: 3, label: 'Bad-case state walkthrough' },
  { id: 4, label: 'Summary and free exploration' }
]

const activeMetric = computed(() => {
  return METRIC_OPTIONS.find((metric) => metric.key === activeMetricKey.value) ?? METRIC_OPTIONS[0]
})

const stateLookup = computed(() => {
  return buildStateLookup(driverRows.value)
})

const selectedStateRow = computed(() => {
  return stateLookup.value.get(selectedStateName.value) ?? null
})

const storyMilestones = computed(() => STORY_MILESTONES)

const visitedStateNames = computed(() => Array.from(visitedStates.value.values()))

const visitedStateCount = computed(() => visitedStates.value.size)

const hasLoadedData = computed(() => {
  return driverRows.value.length > 0 && geoFeatures.value.length > 0
})

const datasetSummary = computed(() => {
  return {
    statesInCsv: driverRows.value.length,
    mapFeatures: geoFeatures.value.length,
    hasLoadedData: hasLoadedData.value
  }
})

const isStoryComplete = computed(() => {
  return storyStep.value >= STORY_MILESTONES[STORY_MILESTONES.length - 1].id
})

const selectedMetricValue = computed(() => {
  if (!selectedStateRow.value) {
    return null
  }

  return selectedStateRow.value[activeMetricKey.value]
})

const activeMetricExtent = computed(() => {
  return getMetricExtent(driverRows.value, activeMetricKey.value)
})

const mapFeatureData = computed(() => {
  return buildMapFeatureData(geoFeatures.value, driverRows.value, activeMetricKey.value, selectedStateName.value)
})

const activeComparison = computed(() => {
  return getComparisonSet(driverRows.value, selectedStateName.value, activeMetricKey.value)
})

const stackedComparisonData = computed(() => {
  return buildStackedComparisonData(driverRows.value, selectedStateName.value, activeMetricKey.value)
})

export async function loadRoadSafetyData() {
  if (hasLoaded) {
    return
  }

  if (loadRequest) {
    await loadRequest
    return
  }

  loading.value = true
  loadError.value = ''

  loadRequest = (async () => {
    try {
      const [driversResponse, statesResponse] = await Promise.all([
        fetch('/data/bad-driversSimplified.csv'),
        fetch('/data/us-states.json')
      ])

      if (!driversResponse.ok || !statesResponse.ok) {
        throw new Error('Unable to load source files from /public/data.')
      }

      const csvText = await driversResponse.text()
      driverRows.value = parseDriversCsv(csvText)

      const geoJson = await statesResponse.json()
      geoFeatures.value = getGeoFeatures(geoJson)

      visitedStates.value.add(selectedStateName.value)
      hasLoaded = true
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'Unexpected data loading failure.'
    } finally {
      loading.value = false
      loadRequest = null
    }
  })()

  await loadRequest
}

export function useRoadSafetyState() {
  const setActiveMetricKey = (metricKey) => {
    if (METRIC_OPTIONS.some((metric) => metric.key === metricKey)) {
      activeMetricKey.value = metricKey
    }
  }

  const setSelectedStateName = (stateName) => {
    if (!stateName) {
      return
    }

    selectedStateName.value = stateName
    visitedStates.value.add(stateName)
  }

  const setStoryStep = (nextStep) => {
    const boundedStep = Math.max(0, Math.min(nextStep, STORY_MILESTONES.length - 1))
    storyStep.value = boundedStep
  }

  const advanceStory = () => {
    setStoryStep(storyStep.value + 1)
  }

  const resetStory = () => {
    storyStep.value = 0
  }

  const showTooltip = ({ title = '', value = '', x = 0, y = 0 }) => {
    tooltip.value = {
      visible: true,
      title,
      value,
      x,
      y
    }
  }

  const hideTooltip = () => {
    tooltip.value.visible = false
  }

  const clearVisitedStates = () => {
    visitedStates.value = new Set(selectedStateName.value ? [selectedStateName.value] : [])
  }

  const resetAppState = () => {
    activeMetricKey.value = DEFAULT_METRIC_KEY
    selectedStateName.value = 'Ohio'
    storyStep.value = 0
    tooltip.value = { visible: false, title: '', value: '', x: 0, y: 0 }
    visitedStates.value = new Set(['Ohio'])
  }

  return {
    metricOptions: METRIC_OPTIONS,
    activeMetric,
    activeMetricKey,
    driverRows,
    geoFeatures,
    stateLookup,
    selectedStateName,
    selectedStateRow,
    selectedMetricValue,
    activeMetricExtent,
    mapFeatureData,
    activeComparison,
    stackedComparisonData,
    storyStep,
    storyMilestones,
    isStoryComplete,
    tooltip,
    visitedStates,
    visitedStateNames,
    visitedStateCount,
    loading,
    loadError,
    hasLoadedData,
    datasetSummary,
    loadRoadSafetyData,
    setActiveMetricKey,
    setSelectedStateName,
    setStoryStep,
    advanceStory,
    resetStory,
    showTooltip,
    hideTooltip,
    clearVisitedStates,
    resetAppState
  }
}
