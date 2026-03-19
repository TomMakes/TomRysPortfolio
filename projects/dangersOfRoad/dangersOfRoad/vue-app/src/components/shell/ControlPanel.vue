<script setup>
import { useRoadSafetyState } from '../../composables/useRoadSafetyState'

const state = useRoadSafetyState()

const useOhioScenario = () => {
  state.setSelectedStateName('Ohio')
  state.setStoryStep(1)
}

const useTexasScenario = () => {
  state.setSelectedStateName('Texas')
  state.setStoryStep(3)
}
</script>

<template>
  <section class="card controls-card">
    <div class="controls-header">
      <h2>Comparison Controls</h2>
      <p>Step 2 state actions are wired through the shared composable contract.</p>
    </div>

    <label class="control-field" for="metricSelect">
      Active metric
      <select
        id="metricSelect"
        :value="state.activeMetricKey.value"
        @change="state.setActiveMetricKey(($event.target).value)"
      >
        <option
          v-for="metric in state.metricOptions"
          :key="metric.key"
          :value="metric.key"
        >
          {{ metric.label }}
        </option>
      </select>
    </label>

    <div class="pill-row">
      <p class="pill">Selected state: {{ state.selectedStateName.value }}</p>
      <p class="pill">Story step: {{ state.storyStep.value }}</p>
      <p class="pill">Visited states: {{ state.visitedStateCount.value }}</p>
      <p class="pill">Comparison trio: {{ state.stackedComparisonData.value.length }}</p>
    </div>

    <div class="action-row">
      <button type="button" @click="state.advanceStory()">Advance story</button>
      <button type="button" @click="state.resetStory()">Reset story</button>
      <button type="button" @click="state.clearVisitedStates()">Clear visited</button>
      <button type="button" @click="state.resetAppState()">Reset app state</button>
    </div>

    <div class="action-row">
      <button type="button" @click="useOhioScenario">Story branch: Ohio</button>
      <button type="button" @click="useTexasScenario">Story branch: Texas</button>
    </div>
  </section>
</template>
