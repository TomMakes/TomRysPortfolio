# Step 4 Implementation Notes

This step ports the legacy choropleth into a dedicated Vue + D3 component that renders from normalized utility output.

## What is done

- Added src/components/visualizations/ChoroplethMap.vue.
- The choropleth now renders into an SVG via a Vue ref and D3 path generation.
- The component consumes normalized `mapFeatureData` and `activeMetricExtent` from shared state.
- The component emits upward events:
  - `state-select` with selected state payload.
  - `state-hover` with hover payload and pointer coordinates.
  - `state-leave` when pointer exits a state.
- Updated src/components/shell/MapPanelShell.vue to use the new component and bind emitted events to composable actions.

## Why this matters

The map visualization is now decoupled from raw CSV/GeoJSON parsing and global mutable variables.
The state transitions now flow through Vue composable actions, enabling predictable behavior and easier testing.

## Complex function note

The render function in src/components/visualizations/ChoroplethMap.vue includes a header comment that documents:
- expected arguments (`featureRows`, `domainExtent`)
- how those arguments are transformed into projection/path/fill output
- emitted interaction payloads

## Next implementation step

Build Step 5 by porting createStackedBarChart into a dedicated component using `stackedComparisonData` and `activeComparison`.
