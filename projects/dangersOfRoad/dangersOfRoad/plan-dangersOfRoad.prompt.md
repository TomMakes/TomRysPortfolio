## Plan: Vue Rewrite Roadmap

Rebuild the project as a Vue 3 + Vite single-page app, but treat the rewrite as a product cleanup rather than a line-for-line port. Keep the data story and D3-based visualizations, move all mutable app state into a Vue composable, and redesign the layout first so the visualization components are not constrained by the current fixed-position HTML/CSS structure.

**Steps**
1. Phase 1: App shell and migration boundaries. Create a Vue 3 project with Vite, move static datasets into the new app structure, and establish the high-level page layout before porting any D3 code. This phase defines the new component tree and replaces the current tightly coupled page in index.html and main.css with a maintainable container/page structure.
2. Phase 1: Define a single source of truth for app state in a composable. Model the selected state, active comparison metric key (the currently selected dataset field such as PercentSpeeding or PercentAlcoholImpaired), story progress, visited states, tooltip payload, and loaded datasets in one shared composition module. This blocks later visualization and narrative work because the current globals in main.js must not be reintroduced.
3. Phase 2: Build the data loading and transformation layer. Port rowConverter and all comparison/lookup logic into plain utility functions or the composable so D3 components receive normalized data rather than reading CSV/GeoJSON directly. This depends on step 2.
4. Phase 2: Build the choropleth map component first. Encapsulate the current createChoropleth logic into a dedicated Vue component that renders into an SVG via refs and emits state-selection and hover events upward. This is the first visualization to build because it is the entry point for the current user flow and determines the structure of shared state. Depends on steps 1 to 3.
5. Phase 2: Build the stacked bar chart component second. Encapsulate createStackedBarChart into a separate component that accepts the selected state and comparison metric as props and emits hover interactions. This depends on the shared state/data layer and can proceed in parallel with story UI styling once the composable API is stable.
6. Phase 3: Rebuild the narrative/story system as structured content, not DOM deletion. Replace the current step0/step1/step2/step3/step4 paragraphs and timeout-driven mutation with a data-driven narrative configuration and conditional Vue rendering. Keep story progression logic in the composable and let the narrative panel display the current stage. This depends on steps 2 to 5.
7. Phase 3: Rework the overall layout and responsiveness. Replace fixed-position text and chart placement with CSS Grid/Flexbox so the map, chart, controls, and narrative adapt cleanly to desktop and smaller widths. Because you chose a broader redesign, this phase should intentionally improve usability instead of preserving the current coordinate-based layout.
8. Phase 4: Add interaction polish. Centralize tooltip behavior, selected/visited state styling, transitions between map and chart views, and empty/loading states. These can run in parallel with late layout refinements after the major components are working.
9. Phase 4: Validate behavior against the original app. Confirm the new app still supports the same analytical tasks: selecting a state from the map, comparing that state against high/low states for a metric, switching metrics, and following a story-driven path through the data. This depends on all prior phases.

**Relevant files**
- c:\Users\ripst\OneDrive\Documents\GitStuff\TomRysPortfolio\projects\dangersOfRoad\dangersOfRoad\index.html — source of the current page sections, story copy, controls, and SVG mount points to decompose into Vue components.
- c:\Users\ripst\OneDrive\Documents\GitStuff\TomRysPortfolio\projects\dangersOfRoad\dangersOfRoad\main.js — source of rowConverter, setupEventListeners, createChoropleth, createStackedBarChart, rollStory1/2/3/4, and the current global state model to replace with composables.
- c:\Users\ripst\OneDrive\Documents\GitStuff\TomRysPortfolio\projects\dangersOfRoad\dangersOfRoad\main.css — source of current visual hierarchy and the fixed-position layout rules that should be redesigned rather than copied.
- c:\Users\ripst\OneDrive\Documents\GitStuff\TomRysPortfolio\projects\dangersOfRoad\dangersOfRoad\bad-driversSimplified.csv — primary tabular dataset to import into the Vue app and normalize for map/chart comparisons.
- c:\Users\ripst\OneDrive\Documents\GitStuff\TomRysPortfolio\projects\dangersOfRoad\dangersOfRoad\us-states.json — GeoJSON boundary data for the map component.

**Verification**
1. Scaffold the Vue app and confirm datasets load correctly into the composable without any D3 rendering errors.
2. Verify the choropleth renders all states with the correct color scale and emits the expected selected-state payload on click.
3. Verify the bar chart recomputes correctly for each comparison metric and correctly identifies the selected, lowest, and highest states.
4. Verify story progression changes only through composable state transitions and no direct DOM removal is used.
5. Verify the redesigned layout works at desktop and narrow viewport widths without overlapping text or charts.
6. Compare the original and rewritten app side by side to ensure analytical outputs and story milestones still make sense.

**Decisions**
- Included: Vue 3 migration planning, broader layout/UX redesign, component extraction, composable-based shared state, retention of D3 for rendering.
- Excluded: Pinia setup, backend/API work, changes to the raw datasets, and a line-for-line reproduction of the current fixed-position experience.
- Recommended build order: app shell/state first, choropleth second, stacked bar chart third, narrative system fourth, responsive layout/polish last.

**Further Considerations**
1. Keep D3 only for SVG math/rendering and let Vue own application state and conditional UI. This avoids the current DOM-manipulation coupling.
2. Consider replacing the current hardcoded story branching tied to Ohio and Texas with configurable milestone rules so the narrative remains maintainable after the redesign.
3. If the redesign grows beyond a single page, revisit Pinia later; for the current scope, a composable is the cleaner starting point.