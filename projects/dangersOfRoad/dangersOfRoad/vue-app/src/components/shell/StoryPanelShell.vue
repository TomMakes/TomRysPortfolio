<script setup>
import { useRoadSafetyState } from '../../composables/useRoadSafetyState'

const state = useRoadSafetyState()
</script>

<template>
  <section class="card story-card">
    <div class="panel-header">
      <h2>Narrative Panel</h2>
      <p>Story progress is now state-driven and controlled through composable actions.</p>
    </div>

    <p class="story-status">
      Story status: {{ state.isStoryComplete.value ? 'Complete' : 'In progress' }}
    </p>

    <ul class="story-list">
      <li
        v-for="milestone in state.storyMilestones.value"
        :key="milestone.id"
        :class="{ active: milestone.id === state.storyStep.value }"
        @click="state.setStoryStep(milestone.id)"
      >
        <span>Step {{ milestone.id }}</span>
        <p>{{ milestone.label }}</p>
      </li>
    </ul>
  </section>
</template>
