<script setup>
import { computed, onMounted } from 'vue'
import ChartPanelShell from './shell/ChartPanelShell.vue'
import ControlPanel from './shell/ControlPanel.vue'
import MapPanelShell from './shell/MapPanelShell.vue'
import StoryPanelShell from './shell/StoryPanelShell.vue'
import { useRoadSafetyState } from '../composables/useRoadSafetyState'

const state = useRoadSafetyState()

onMounted(() => {
  state.loadRoadSafetyData()
})

const dataSummary = computed(() => {
  return state.datasetSummary.value
})
</script>

<template>
  <div class="page-shell">
    <header class="hero">
      <p class="eyebrow">Step 4 Complete: Choropleth Component Port</p>
      <h1>Dangers Of The Road</h1>
      <p class="subtitle">
        The map now renders through a dedicated Vue + D3 component and sends selection and hover events through the
        composable state contract.
      </p>
      <p v-if="state.loading.value" class="status-line">Loading source data from /public/data...</p>
      <p v-else-if="state.loadError.value" class="status-line error">Data error: {{ state.loadError.value }}</p>
      <p v-else class="status-line ok">
        Loaded {{ dataSummary.statesInCsv }} CSV rows and {{ dataSummary.mapFeatures }} map features.
      </p>
    </header>

    <main class="workspace-grid">
      <MapPanelShell :summary="dataSummary" />

      <section class="right-column">
        <ControlPanel />
        <ChartPanelShell :summary="dataSummary" />
        <StoryPanelShell />
      </section>
    </main>
  </div>
</template>
