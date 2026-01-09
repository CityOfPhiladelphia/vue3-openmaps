# OpenMaps Vue 3 + MapLibre Migration Plan

Migrating the legacy openmaps app from @phila/layerboard (Esri Classic WebMaps + Leaflet)
to a new Vue 3 + MapLibre architecture using @phila/phila-ui-map-core.

## Phase 0: Foundation (COMPLETED)
- [x] Set up Vue 3 + Vite project
- [x] Create converter script to extract layers from Esri WebMap JSON
- [x] Generate TypeScript layer config files with:
  - [x] Paint styles (simple, uniqueValue, classBreaks renderers)
  - [x] Legend configuration
  - [x] Popup configuration
  - [x] Where clause (definitionExpression)
- [x] Basic app layout (header, sidebar, map, footer)
- [x] Layer toggle checkboxes in sidebar

## Phase 1: Core Layer Support (COMPLETED)
- [x] CircleLayer support (points)
- [x] FillLayer support (polygons)
- [x] LineLayer support (lines)
- [x] Handle polygon outlines > 1px (separate LineLayer for thick outlines)
- [x] Unique value renderer color matching
- [x] Handle numeric type coercion in match expressions
- [x] Pagination for large datasets (>2000 features) - bike network
- [x] Scale/zoom range support (minZoom/maxZoom from Esri minScale/maxScale)

## Phase 2: Layer List & UX Improvements (COMPLETED)
- [x] Search/filter layers by name
- [x] Gray out and disable checkboxes for layers outside current zoom range
- [x] Layer opacity slider
- [x] Loading indicators while fetching layer data
- [x] Error handling for failed layer loads
- [ ] (Optional) Categories/groups for organizing layers in sidebar

## Phase 3: Popups & Interaction (COMPLETED)
- [x] Click-to-identify features
- [x] Popup display with configured fields
- [x] Template substitution for popup titles (e.g., "{streetname}")
- [x] Multiple feature popup handling (when clicking overlapping features)
- [x] Created MapPopup.vue component in @phila/phila-ui-map-core

## Phase 4: Legend (COMPLETED)
- [x] Legend integrated into LayerPanel (shown under each layer when visible)
- [x] Display legend items for visible layers
- [x] Support for all legend types (circle, line, fill)
- [x] Unique value / class breaks legend entries

## Phase 5: Basemaps & Imagery (COMPLETED)
- [x] Basemap switcher
- [x] Historical imagery support (via dropdown)
- [x] Aerial/satellite imagery toggle

## Phase 6: Address Search & Geolocation (COMPLETED)
- [x] Address search input
- [x] Geocoding integration
- [x] Geolocation (locate me) button
- [x] Search result marker (handled by MapSearchControl)

## Phase 6.25: Runtime Layer Configuration (Dynamic vs Static Mode)

This phase adds the ability to fetch and transform the Esri WebMap JSON at runtime, instead of relying on pre-generated static layer config files. Both modes should be supported for comparison and rollback purposes.

### Environment/Config Setup
- [x] Add environment variable `VITE_LAYER_MODE` with values `'static'` | `'dynamic'` (default to `'static'` for backwards compatibility)
- [x] Ensure build process includes this env var for production builds

### WebMap ID Configuration
- [x] Define `WEBMAP_ID` constant (value: `'1596df70df0349e293ceec46a06ccc50'`) in the layer config service or a config file
- [x] Build the fetch URL from the ID using pattern: `https://www.arcgis.com/sharing/rest/content/items/${WEBMAP_ID}/data?f=json`
- [x] Keep the ID near where it's used (in `layerConfigService.ts` or a `src/config.ts` file) - not hidden in env vars since it's public

### Extract Transformation Logic into Shared Module
- [x] Create new file `src/utils/webmap-transformer.ts` (or similar location)
- [x] Move/copy the core transformation logic from the existing converter script (`scripts/convert-esri-webmap.ts` or similar) into this new module
- [x] Refactor transformation functions to be importable and callable at runtime (not just CLI script)
- [x] Key functions to extract:
  - [x] `transformEsriRenderer()` - converts Esri renderer JSON to MapLibre paint styles
  - [x] `transformPopupConfig()` - converts Esri popupInfo to app's popup format
  - [x] `transformLegendConfig()` - generates legend entries from renderer
  - [x] `convertScaleToZoom()` - converts Esri minScale/maxScale to MapLibre zoom levels
  - [x] `buildWhereClause()` - extracts definitionExpression
- [x] Ensure the module works in browser environment (no Node.js-only APIs like `fs`)
- [x] Export a main function `transformWebMapToLayerConfigs(webMapJson: EsriWebMap): LayerConfig[]`

### Create Layer Config Service
- [x] Create new file `src/services/layerConfigService.ts`
- [x] Implement `getLayerConfigs(): Promise<LayerConfig[]>` function that:
  - [x] Checks `VITE_LAYER_MODE` environment variable
  - [x] If `'static'`: imports and returns the existing static layer configs from `src/layers/*.ts` files (current behavior)
  - [x] If `'dynamic'`: fetches JSON from `VITE_WEBMAP_URL`, runs `transformWebMapToLayerConfigs()`, and returns the result
- [x] Add error handling for fetch failures in dynamic mode (log error, maybe fall back to static?)
- [x] Add loading state management (the fetch + transform may take 1-2 seconds)
- [x] Cache the transformed configs in memory so subsequent calls don't re-fetch

### Update App Initialization
- [x] Locate where layer configs are currently imported/loaded (likely in `App.vue`, a store, or composable)
- [x] Replace direct static imports with call to `layerConfigService.getLayerConfigs()`
- [x] Handle the async nature - layer list should show loading state until configs are ready
- [x] Ensure map doesn't try to render layers before configs are loaded

### Type Safety
- [x] Create TypeScript interface `EsriWebMap` for the raw Esri JSON structure (or use `any` with runtime validation)
- [x] Ensure `LayerConfig` interface is shared between static files and dynamic transformer
- [x] Add JSDoc comments to transformer functions explaining input/output

### Testing & Validation
- [ ] Test with `VITE_LAYER_MODE=static` - app should work exactly as before using pre-generated files
- [ ] Test with `VITE_LAYER_MODE=dynamic` - app should fetch JSON and generate configs at runtime
- [ ] Compare layer rendering between both modes - should be visually identical
- [ ] Test dynamic mode with network throttling to ensure loading states work
- [ ] Verify popups, legends, and zoom constraints work in both modes

### Deployment Setup (for A/B comparison)
- [x] Create build scripts in `package.json`:
  - [x] `build:static` - runs `vite build --mode static` (loads `.env.static`)
  - [x] `build:dynamic` - runs `vite build --mode dynamic` (loads `.env.dynamic`)
- [x] Create environment files:
  - [x] `.env` - default for local dev (static mode)
  - [x] `.env.static` - sets `VITE_LAYER_MODE=static`
  - [x] `.env.dynamic` - sets `VITE_LAYER_MODE=dynamic`
- [x] Update GitHub Actions workflow (`.github/workflows/dev_push_to_s3.yml`):
  - [x] Build static → deploy to `openmaps-dev.phila.gov` (S3 + CloudFront E3T7BKDV4NKW92)
  - [x] Build dynamic → deploy to `openmaps-dev2.phila.gov` (S3 + CloudFront E30RQ5P7SS12OW)
  - [x] Sequential deployment: static completes before dynamic starts
- [ ] Verify both endpoints are accessible for stakeholder comparison

### Cleanup (After Decision is Made)
- [ ] Once team decides on preferred approach, either:
  - [ ] Remove dynamic mode code if static is chosen
  - [ ] Remove static layer files (`src/layers/*.ts`) if dynamic is chosen
  - [ ] Or keep both if flexibility is valuable long-term

## Phase 6.5: Multi-Layer Popup Navigation
- [ ] Handle clicks that intersect features from multiple active layers
- [ ] Collect all features from all visible layers at click point
- [ ] Popup UI shows feature count indicator (e.g., "1 of 3")
- [ ] Previous/Next navigation buttons to cycle through features
- [ ] Display layer name in popup header to identify which layer each feature belongs to
- [ ] Maintain feature list state while popup is open
- [ ] Clear feature list when popup is closed or map is clicked elsewhere

## Phase 7: Advanced Features
- [ ] URL routing (share map state via URL)
- [ ] Cyclomedia integration (if needed)
- [ ] Print/export functionality

## Technical Notes

### Scale to Zoom Conversion
Esri uses map scale, MapLibre uses zoom levels. The conversion formula:
```
zoom = log2(559082264 / scale)
```
- Esri `minScale` (zoomed out limit) → MapLibre `minzoom`
- Esri `maxScale` (zoomed in limit) → MapLibre `maxzoom`

### Pagination for Large Datasets
ArcGIS FeatureServer has `maxRecordCount` limit (typically 2000). For layers with more
features, use `resultOffset` and `resultRecordCount` parameters to paginate.

### Polygon Outlines
MapLibre's `fill-outline-color` only supports 1px width. For thicker outlines, generate
a separate `outlinePaint` property and render with an additional LineLayer.
