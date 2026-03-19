# Step 2 Implementation Notes

This step formalizes a single shared state contract for the Vue rewrite.

## What is done

- Expanded the shared composable API in `src/composables/useRoadSafetyState.js`.
- Modeled one source of truth for:
  - selected state
  - active metric key and active metric
  - story progression and completion
  - visited states
  - tooltip payload
  - loaded datasets and loading/error status
- Added composable actions for state transitions:
  - metric changes
  - selected-state updates
  - story stepping/reset
  - tooltip show/hide
  - visited-state reset
  - full app reset
- Updated shell components to read and mutate state only through composable actions.

## Shared state contract

The composable now exposes:

- Base data refs:
  - `driverRows`
  - `geoFeatures`
  - `selectedStateName`
  - `activeMetricKey`
  - `storyStep`
  - `tooltip`
  - `visitedStates`
  - `loading`
  - `loadError`
- Derived getters:
  - `activeMetric`
  - `selectedStateRow`
  - `selectedMetricValue`
  - `storyMilestones`
  - `isStoryComplete`
  - `visitedStateNames`
  - `visitedStateCount`
  - `hasLoadedData`
  - `datasetSummary`
- Actions:
  - `loadRoadSafetyData`
  - `setActiveMetricKey`
  - `setSelectedStateName`
  - `setStoryStep`
  - `advanceStory`
  - `resetStory`
  - `showTooltip`
  - `hideTooltip`
  - `clearVisitedStates`
  - `resetAppState`

## Validation

- `npm run build` passes after this step.
- Shell UI can now exercise state transitions without direct DOM mutation.

## Next implementation step

Build Step 3: move comparison/lookup transformations out of legacy D3 flow into a dedicated data utility layer so map/chart components consume normalized inputs.
