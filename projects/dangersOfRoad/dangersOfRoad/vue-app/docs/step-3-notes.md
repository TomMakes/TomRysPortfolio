# Step 3 Implementation Notes

This step moves legacy parsing and comparison logic into a dedicated utility layer so the visualization components can consume normalized data shapes.

## What is done

- Added `src/utils/roadSafetyData.js` for CSV parsing, GeoJSON feature normalization, metric lookup creation, and comparison dataset shaping.
- Refactored `src/composables/useRoadSafetyState.js` to expose normalized derived data instead of keeping transformation logic inline.
- Updated the shell panels to consume:
  - normalized map feature rows
  - metric extents for choropleth scaling
  - selected/lower/upper comparison sets
  - stacked comparison rows for the future D3 bar chart port

## New shared outputs

The composable now exposes these Step 3 data structures:

- `stateLookup`
- `activeMetricExtent`
- `mapFeatureData`
- `activeComparison`
- `stackedComparisonData`

## Why this matters

The next D3 components no longer need to:

- parse CSV text
- scan arrays to find selected states
- compute comparison extremes inline
- re-derive stackable bar values on each render path

That logic now lives in one plain-JavaScript utility module with a stable interface.

## Validation

- The shared state layer now loads raw assets and immediately converts them into visualization-ready structures.
- Shell components display normalized comparison and map metadata without touching raw CSV parsing logic.

## Next implementation step

Build Step 4: port the legacy choropleth into a dedicated Vue + D3 component using `mapFeatureData`, `activeMetricExtent`, and shared selection/tooltip actions.