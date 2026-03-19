<script setup>
import ChoroplethMap from '../visualizations/ChoroplethMap.vue'
import { useRoadSafetyState } from '../../composables/useRoadSafetyState'

defineProps({
  summary: {
    type: Object,
    required: true
  }
})

const state = useRoadSafetyState()

const formatNumber = (value) => {
  return Number.isFinite(value) ? value.toFixed(1) : 'N/A'
}

const showSampleTooltip = () => {
  const selectedFeature = state.mapFeatureData.value.find((featureDatum) => featureDatum.isSelected)
  state.showTooltip({
    title: state.selectedStateName.value,
    value: `${formatNumber(selectedFeature?.fatalCollisionRate ?? null)} fatal collisions per billion miles traveled`,
    x: 320,
    y: 200
  })
}

const onMapStateSelect = ({ stateName }) => {
  state.setSelectedStateName(stateName)
}

const onMapStateHover = ({ stateName, value, x, y }) => {
  state.showTooltip({
    title: stateName,
    value: `${formatNumber(value)} ${state.activeMetric.value.label.toLowerCase()}`,
    x,
    y
  })
}

const onMapStateLeave = () => {
  state.hideTooltip()
}
</script>

<template>
  <section class="card panel-card">
    <div class="panel-header">
      <h2>Choropleth Map</h2>
      <p>Step 4 renders D3 map paths from normalized utility output and emits interactions through Vue events.</p>
    </div>

    <div class="map-stage">
      <ChoroplethMap
        :feature-data="state.mapFeatureData.value"
        :metric-extent="state.activeMetricExtent.value"
        :metric-label="state.activeMetric.value.label"
        @state-select="onMapStateSelect"
        @state-hover="onMapStateHover"
        @state-leave="onMapStateLeave"
      />
    </div>

    <div class="map-meta-row">
      <p>{{ summary.mapFeatures }} geographic features loaded.</p>
      <p>{{ state.mapFeatureData.value.filter((featureDatum) => featureDatum.hasData).length }} states include metric data.</p>
      <p>Selected state: {{ state.selectedStateName.value }}</p>
      <p>
        Active metric domain: {{ formatNumber(state.activeMetricExtent.value[0]) }} to
        {{ formatNumber(state.activeMetricExtent.value[1]) }}
      </p>
      <p>
        Selected map value: {{ formatNumber(state.selectedStateRow.value?.[state.activeMetricKey.value]) }} for
        {{ state.activeMetric.value.label }}
      </p>
      <p>
        Tooltip status: {{ state.tooltip.value.visible ? 'visible' : 'hidden' }}
        <span v-if="state.tooltip.value.visible">
          ({{ state.tooltip.value.title }}: {{ state.tooltip.value.value }})
        </span>
      </p>
      <div class="action-row">
        <button type="button" @click="showSampleTooltip">Show sample tooltip payload</button>
        <button type="button" @click="state.hideTooltip()">Hide tooltip</button>
      </div>
    </div>
  </section>
</template>
