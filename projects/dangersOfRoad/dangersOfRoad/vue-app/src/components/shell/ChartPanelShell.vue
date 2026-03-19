<script setup>
import { useRoadSafetyState } from '../../composables/useRoadSafetyState'

defineProps({
  summary: {
    type: Object,
    required: true
  }
})

const state = useRoadSafetyState()

const formatNumber = (value) => {
  return Number.isFinite(value) ? value.toFixed(2) : 'N/A'
}
</script>

<template>
  <section class="card panel-card">
    <div class="panel-header">
      <h2>Stacked Bar Chart Panel</h2>
      <p>Chart inputs now come from normalized comparison utilities instead of inline CSV scanning.</p>
    </div>

    <div class="panel-placeholder chart-placeholder">
      <p>Current metric key: {{ state.activeMetricKey.value }}</p>
      <p>Current metric label: {{ state.activeMetric.value.label }}</p>
      <p>Current metric description: {{ state.activeMetric.value.description }}</p>
      <p>
        Comparison set: {{ state.activeComparison.value.lowerState?.State ?? 'N/A' }},
        {{ state.activeComparison.value.selectedState?.State ?? 'N/A' }},
        {{ state.activeComparison.value.upperState?.State ?? 'N/A' }}
      </p>
      <p>Loaded rows available for charting: {{ summary.statesInCsv }}</p>

      <ul class="comparison-list">
        <li v-for="row in state.stackedComparisonData.value" :key="`${row.State}-${row.metricKey}`">
          <strong>{{ row.State }}</strong>
          <span>{{ row.metricValue }}% {{ state.activeMetric.value.label.toLowerCase() }}</span>
          <span>{{ formatNumber(row.comparedCollisionBurden) }} attributed collisions</span>
          <span>{{ formatNumber(row.remainderCollisionBurden) }} remaining collisions</span>
        </li>
      </ul>
    </div>
  </section>
</template>
