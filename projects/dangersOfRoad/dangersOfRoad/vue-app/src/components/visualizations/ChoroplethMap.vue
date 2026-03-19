<script setup>
import * as d3 from 'd3'
import { onMounted, ref, watch } from 'vue'

const COLOR_RANGE = ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f']

const props = defineProps({
  featureData: {
    type: Array,
    default: () => []
  },
  metricExtent: {
    type: Array,
    default: () => [0, 0]
  },
  metricLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['state-select', 'state-hover', 'state-leave'])
const svgRef = ref(null)

const width = 960
const height = 620

/**
 * Transforms normalized map-feature rows into a rendered choropleth and binds interaction callbacks.
 *
 * Args:
 * - `featureRows`: Array of normalized rows from Step 3 utilities. Each row contains `{ feature, stateName, value, hasData, isSelected, row }`.
 * - `domainExtent`: Two-number array `[min, max]` used to configure the quantized fill scale.
 *
 * Output:
 * - Draws/updates the SVG paths on `svgRef` and emits `state-select`, `state-hover`, and `state-leave` events.
 */
function renderChoropleth(featureRows, domainExtent) {
  if (!svgRef.value) {
    return
  }

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  svg.attr('viewBox', `0 0 ${width} ${height}`)
  svg.attr('role', 'img')
  svg.attr('aria-label', 'United States choropleth map of dangerous driving metrics')

  if (!Array.isArray(featureRows) || featureRows.length === 0) {
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6d6256')
      .style('font-size', '16px')
      .text('Map data is loading...')
    return
  }

  const geoCollection = {
    type: 'FeatureCollection',
    features: featureRows.map((featureRow) => featureRow.feature)
  }

  const projection = d3.geoAlbersUsa().fitSize([width, height], geoCollection)
  const path = d3.geoPath().projection(projection)

  const [rawMin, rawMax] = domainExtent
  const min = Number.isFinite(rawMin) ? rawMin : 0
  const max = Number.isFinite(rawMax) ? rawMax : min
  const domain = min === max ? [min, min + 1] : [min, max]

  const color = d3.scaleQuantize().domain(domain).range(COLOR_RANGE)

  const clipPathId = (featureRow, index) => {
    const baseId = String(featureRow.id ?? featureRow.stateName ?? `feature-${index}`)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
    return `state-clip-${baseId}`
  }

  const defs = svg.append('defs').attr('class', 'clip-paths-for-states')
  defs
    .selectAll('clipPath')
    .data(featureRows, (featureRow) => featureRow.id)
    .join('clipPath')
    .attr('id', (featureRow, index) => clipPathId(featureRow, index))
    .append('path')
    .attr('d', (featureRow) => path(featureRow.feature))

  const mapLayer = svg.append('g').attr('class', 'map-layer')

  mapLayer
    .selectAll('path')
    .data(featureRows, (featureRow) => featureRow.id)
    .join('path')
    .attr('class', (featureRow) => {
      const classes = ['map-state']
      if (featureRow.isSelected) {
        classes.push('is-selected')
      }
      return classes.join(' ')
    })
    .attr('d', (featureRow) => path(featureRow.feature))
    .attr('clip-path', (featureRow, index) => `url(#${clipPathId(featureRow, index)})`)
    .attr('fill', (featureRow) => {
      if (!featureRow.hasData) {
        return '#c8c1b3'
      }
      return color(featureRow.value)
    })
    .on('click', (_, featureRow) => {
      emit('state-select', {
        stateName: featureRow.stateName,
        value: featureRow.value,
        row: featureRow.row
      })
    })
    .on('mouseenter', (event, featureRow) => {
      emit('state-hover', {
        stateName: featureRow.stateName,
        value: featureRow.value,
        x: event.clientX,
        y: event.clientY
      })
    })
    .on('mousemove', (event, featureRow) => {
      emit('state-hover', {
        stateName: featureRow.stateName,
        value: featureRow.value,
        x: event.clientX,
        y: event.clientY
      })
    })
    .on('mouseleave', () => {
      emit('state-leave')
    })

  svg
    .append('text')
    .attr('class', 'map-title')
    .attr('x', width / 2)
    .attr('y', 32)
    .attr('text-anchor', 'middle')
    .text(`Fatal collisions per billion miles by state (${props.metricLabel.toLowerCase()})`)
}

onMounted(() => {
  renderChoropleth(props.featureData, props.metricExtent)
})

watch(
  () => [props.featureData, props.metricExtent],
  () => {
    renderChoropleth(props.featureData, props.metricExtent)
  },
  { deep: true }
)
</script>

<template>
  <div class="choropleth-map-shell">
    <svg ref="svgRef" class="choropleth-map"></svg>
  </div>
</template>