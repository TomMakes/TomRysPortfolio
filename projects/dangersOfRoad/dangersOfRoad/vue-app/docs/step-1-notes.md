# Step 1 Implementation Notes

This project now has a Vue 3 + Vite shell that defines migration boundaries before any D3 porting.

## What is done

- Added a Vue app shell with maintainable page layout.
- Added component boundaries for map, chart, controls, and narrative.
- Added a shared composable store for runtime state and data loading.
- Moved static datasets into `public/data`.

## Component boundaries

- `src/components/RoadSafetyShell.vue`
- `src/components/shell/MapPanelShell.vue`
- `src/components/shell/ChartPanelShell.vue`
- `src/components/shell/ControlPanel.vue`
- `src/components/shell/StoryPanelShell.vue`

## Shared state boundary

- `src/composables/useRoadSafetyState.js`

The composable is the single source of truth for mutable app state:

- selected state
- active metric key
- story step
- visited states
- tooltip payload
- loaded datasets and loading/error status

## Data location

- `public/data/bad-drivers.csv`
- `public/data/bad-driversSimplified.csv`
- `public/data/us-states.json`

## Next implementation step

Port `createChoropleth` into the map panel using an SVG ref and emit selection/hover events back to the composable.
