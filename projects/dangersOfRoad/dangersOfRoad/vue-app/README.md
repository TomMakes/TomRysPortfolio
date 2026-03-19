# Dangers Of The Road (Vue Rewrite)

This folder contains the Vue 3 + Vite rewrite workspace for the original static D3 project.

Steps 1 and 2 from the migration plan are implemented here:

- Vue application shell and high-level layout
- component boundaries for map, chart, controls, and story
- composable-driven shared state contract and data loading boundary
- datasets relocated to `public/data`

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` creates a production build
- `npm run preview` previews the production build

## Project notes

Detailed implementation notes are in:

- `docs/step-1-notes.md`
- `docs/step-2-notes.md`
- `docs/step-3-notes.md`
