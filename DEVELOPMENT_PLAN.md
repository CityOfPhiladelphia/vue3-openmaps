# OpenMaps Vue 3 + MapLibre Migration Plan

Migrating the legacy openmaps app from @phila/layerboard (Esri Classic WebMaps + Leaflet)
to a new Vue 3 + MapLibre architecture using @phila/phila-ui-map-core.

---

## Framework Vision: vue3-layerboard

**IMPORTANT**: This codebase is being developed with a dual purpose:

1. **Immediate Goal**: Migrate the OpenMaps application to Vue 3 + MapLibre
2. **Long-term Goal**: Extract this into **vue3-layerboard**, a reusable framework package

### What is vue3-layerboard?

vue3-layerboard will be a published npm package that replaces the legacy Vue 2 `@phila/layerboard` framework. It will provide a configuration-driven mapping framework for City of Philadelphia applications that need to:

- Display Esri WebMaps using open-source MapLibre GL JS (instead of proprietary Esri APIs)
- Present layers in a configurable panel (flat list or topic-based accordion)
- Support layer toggling, legends, popups, and feature interaction
- Share common mapping components (search, geolocation, basemap controls, etc.)

### Framework Consumers

Multiple City of Philadelphia applications will use vue3-layerboard:

1. **OpenMaps** (atlas.phila.gov) - General purpose mapping portal with flat layer list
2. **StreetsSmartPHL** - Streets Department app with topic-based layer organization
3. **CSOcast** - Water Department app for CSO monitoring
4. Other future mapping applications

### Why Separate Repos?

Different teams maintain these applications and don't want to share repositories or coordinate commits. Each app will have its own repo and use vue3-layerboard as a dependency (via npm).

### Development Approach

**Write code with framework reusability in mind**:

- Keep implementation generic and configuration-driven
- Don't hardcode OpenMaps-specific logic
- Design components and utilities to work with any WebMap ID
- Separate app-specific concerns from framework functionality
- Document configuration options and extension points

Phases 6.4 through 7 should be implemented as if they're already part of the framework. Think of this codebase as "vue3-layerboard-demo" - the code you write will eventually be extracted into the published package.

**Phase 8** (below) will handle the actual framework extraction and migration process.

---

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

## Phase 6.4: Feature Highlighting on Selection

This phase adds visual highlighting for selected features. When a user clicks a feature and the popup opens, the feature should be highlighted in electric blue with enhanced visibility (larger circles, thicker lines). The highlight should clear when the popup closes or another feature is selected.

### Overview
- **Goal**: Provide clear visual feedback showing which feature is currently selected
- **Scope**: Highlight only the active/selected feature (the one with popup open)
- **Geometry Types**: Points (circles) and lines (including polygon borders)
- **No fill highlighting**: Polygons are represented by their border lines only

### Highlight Layer Architecture

#### Layer Setup
- [x] Create two dedicated highlight layers that sit on top of all feature layers:
  - [x] `highlight-circles-layer` - for point features
  - [x] `highlight-lines-layer` - for line and polygon border features
- [x] These layers should be added to the map AFTER all regular feature layers to ensure highlights appear on top
- [x] Use a single GeoJSON source for each layer type: `highlight-circles-source` and `highlight-lines-source`

#### Initial Layer State
- [x] Both highlight layers should start with empty GeoJSON sources:
  ```typescript
  {
    type: "FeatureCollection",
    features: []
  }
  ```
- [x] Layers should be created once during map initialization and persist throughout the app lifecycle
- [x] Update the source data (not recreate layers) when features are selected/deselected

### Highlight Styling

#### Color Specification
- [x] Use electric blue/cyan color: `#00FFFF`
- [x] Apply to both circle and line layers
- [x] Consider adding a subtle glow effect with `circle-stroke-color` and `line-blur` for enhanced visibility

#### Circle (Point) Styling
- [x] Base the highlight size on the original feature's circle radius
- [x] Add **+3px** to the original circle radius
- [x] Example paint properties:
  ```typescript
  {
    'circle-radius': ['get', 'highlightRadius'], // original radius + 3
    'circle-color': '#00FFFF',
    'circle-opacity': 0.8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#FFFFFF'
  }
  ```
- [x] Store the calculated highlight radius in the feature properties when creating the highlight GeoJSON

#### Line Styling (Lines and Polygon Borders)
- [x] Base the highlight width on the original feature's line width
- [x] Add **+3px** to the original line width
- [x] Example paint properties:
  ```typescript
  {
    'line-width': ['get', 'highlightWidth'], // original width + 3
    'line-color': '#00FFFF',
    'line-opacity': 0.9
  }
  ```
- [x] Store the calculated highlight width in the feature properties when creating the highlight GeoJSON

### State Management

#### Tracking Selected Feature
- [x] Create a reactive ref in `App.vue` (or MapPanel.vue) to track the currently selected feature:
  ```typescript
  const selectedFeature = ref<{
    geometry: any;
    geometryType: 'Point' | 'LineString' | 'Polygon';
    originalStyle: {
      radius?: number;  // for circles
      width?: number;   // for lines
    };
  } | null>(null);
  ```
- [x] Update this ref when a feature is clicked and popup opens
- [x] Clear this ref when popup closes or map is clicked elsewhere

#### Extracting Original Style Information
When a feature is clicked, we need to determine its original visual properties to calculate the highlight size:

- [x] For **point features** (circles):
  - [x] Query the layer's paint properties to get `circle-radius`
  - [x] If `circle-radius` uses expressions (match, case, etc.), evaluate it for the clicked feature
  - [x] Use MapLibre's `map.getPaintProperty(layerId, 'circle-radius')` API
  - [x] Handle both numeric values and expressions

- [x] For **line features** (lines and polygon borders):
  - [x] Query the layer's paint properties to get `line-width`
  - [x] Similar expression evaluation as circles
  - [x] Use `map.getPaintProperty(layerId, 'line-width')` API

- [x] Create helper function `getFeatureStyleProperties(layerId: string, feature: any)` that:
  - [x] Takes a layer ID and feature
  - [x] Returns an object with `{ radius?: number, width?: number }`
  - [x] Evaluates expressions if needed using feature properties
  - [x] Falls back to default values if properties can't be determined (e.g., radius: 5, width: 2)

### Highlight Lifecycle

#### On Feature Click (Selection)
When a feature is clicked and popup opens:

1. [x] Determine the feature's geometry type (Point, LineString, Polygon)
2. [x] Extract the feature's original style properties (radius or width)
3. [x] Create highlight GeoJSON:
   - [x] For **Point**: Create Point feature with `highlightRadius = originalRadius + 3`
   - [x] For **LineString**: Create LineString feature with `highlightWidth = originalWidth + 3`
   - [x] For **Polygon**: Extract polygon boundary as LineString with `highlightWidth = originalBorderWidth + 3`
4. [x] Update the appropriate highlight layer source with the new GeoJSON
5. [x] Store feature info in `selectedFeature` ref

#### On Feature Deselection
When popup closes or another feature is selected:

1. [x] Clear the highlight layer sources (set to empty FeatureCollection)
2. [x] Set `selectedFeature.value = null`

#### Edge Cases
- [x] If a feature with no original style info is clicked, use default values (radius: 5, width: 2)
- [x] If clicking the same feature again (while popup is open), don't recreate the highlight
- [x] If toggling a layer off while its feature is selected, clear the highlight
- [x] If panning/zooming while a feature is selected, maintain the highlight

### Integration Points

#### MapPanel.vue Changes
- [x] Add highlight layer initialization in `onMapLoad`
- [x] Add `selectedFeature` ref to track current selection
- [x] Create `highlightFeature(feature, layerId)` function
- [x] Create `clearHighlight()` function
- [x] Call `highlightFeature()` when popup opens with a feature
- [x] Call `clearHighlight()` when popup closes

#### Popup Event Handling
- [x] Ensure popup close event triggers `clearHighlight()`
- [x] When clicking a new feature while popup is open, clear old highlight before showing new one
- [x] The popup should already emit events we can hook into - verify `MapPopup.vue` emits close/feature-change events

#### Layer Toggle Interaction
- [x] Watch for layer visibility changes
- [x] If the currently selected feature's layer is toggled off, call `clearHighlight()`
- [x] This prevents orphaned highlights when source layers are hidden

### Helper Functions to Create

#### `src/utils/highlightHelpers.ts`
Create a new utility file with the following functions:

- [x] `getFeatureStyleProperties(map: MapLibreMap, layerId: string, feature: any): { radius?: number; width?: number }`
  - [x] Queries the layer's paint properties
  - [x] Evaluates expressions for the given feature
  - [x] Returns original style values or defaults

- [x] `createHighlightGeoJSON(feature: any, geometryType: string, originalStyle: any): GeoJSON`
  - [x] Converts feature geometry to highlight GeoJSON
  - [x] Adds calculated highlight size properties (`highlightRadius` or `highlightWidth`)
  - [x] Handles Polygon → LineString conversion for borders
  - [x] Returns FeatureCollection with single feature

- [x] `extractPolygonBorder(polygonCoordinates: number[][][]): number[][]`
  - [x] Takes polygon coordinates (array of rings)
  - [x] Returns just the outer ring as LineString coordinates
  - [x] Used to highlight polygon borders without fills

### Testing Checklist

- [ ] Click a point feature → electric blue circle appears, larger than original
- [ ] Click a line feature → electric blue line appears, thicker than original
- [ ] Click a polygon feature → electric blue border appears, thicker than original polygon outline
- [ ] Close popup → highlight disappears
- [ ] Click a different feature → old highlight clears, new highlight appears

## Phase 6.45: Fix Fill Layer Rendering Issues

**IMPORTANT: This phase was discovered during Phase 6.4 testing**

- **Goal**: Ensure all fill layers render correctly with proper visibility and transparency
- **Issues Identified**:
  1. Some fill layers don't render at all (e.g., Commercial Corridors)
  2. Some fill layers render completely opaque when they should be transparent (e.g., Combined Sewer Service Area)

### Investigation Steps

- [x] Check layer config files for fill layers with rendering issues
  - [x] Commercial Corridors layer config
  - [x] Combined Sewer Service Area layer config
- [x] Verify paint properties are correctly applied in MapPanel.vue
- [x] Check if opacity is being handled correctly in `getDynamicPaint()`
- [x] Verify GeoJSON data is loading correctly for these layers
- [ ] Check browser console for any errors when layers are toggled on

### Common Fill Layer Issues to Check

#### Opacity Problems
- [x] Check if `fill-opacity` is being set correctly
- [x] Verify that layer opacity slider values are being applied
- [x] Ensure opacity from layer config is preserved
- [x] Check if `getDynamicPaint()` is correctly merging opacity values

#### Visibility Problems
- [x] Verify layer data is being fetched successfully
- [x] Check if source is being created correctly for fill layers
- [x] Verify `minZoom` isn't preventing layer from showing at current zoom level
- [x] Check if paint properties have correct structure

#### Paint Property Structure
- [x] Ensure `fill-color` is properly set
- [x] Ensure `fill-opacity` is properly set
- [x] Ensure `fill-outline-color` exists if needed
- [x] Check for any MapLibre expression syntax errors

### Fixes to Implement

- [x] Fix Commercial Corridors layer not rendering (numeric match values in static config)
- [x] Fix webmap-transformer.ts `coerceMatchValue()` to always return strings for MapLibre match expressions
- [x] Fix Combined Sewer Service Area opacity issue
- [ ] Audit all other fill layers for similar issues
- [x] Add defensive checks in `getDynamicPaint()` for fill layers
- [x] Ensure default opacity values if not specified

### Testing Checklist

- [ ] Commercial Corridors layer renders and is visible
- [x] Combined Sewer Service Area renders with proper transparency
- [ ] All other fill layers render correctly
- [x] Opacity slider works for all fill layers
- [x] Fill layers respect their configured opacity values
- [ ] Click outside features → popup closes, highlight clears
- [ ] Toggle off the layer of selected feature → highlight disappears
- [ ] Pan/zoom with feature selected → highlight remains visible and positioned correctly
- [ ] Select features from layers with various style renderers (simple, unique value, class breaks)
- [ ] Verify highlight sizes are consistent (+3px) across different original sizes

### Technical Notes

#### MapLibre GeoJSON Source Updates
- Update highlight sources using:
  ```typescript
  const source = map.getSource('highlight-circles-source');
  if (source && source.type === 'geojson') {
    source.setData(newGeoJSON);
  }
  ```

#### Polygon Border Extraction
- Polygons in GeoJSON have structure: `coordinates: [[[lng, lat], [lng, lat], ...]]`
- First array is outer ring, subsequent arrays are holes
- To highlight the border, extract just the outer ring: `coordinates[0]`
- Convert to LineString: `{ type: 'LineString', coordinates: polygonCoords[0] }`

#### Layer Ordering
- Highlight layers must be added AFTER all feature layers
- If layers are added dynamically, ensure highlights stay on top
- Consider using MapLibre's `beforeId` parameter when adding highlight layers
- Alternatively, re-add highlight layers whenever new feature layers are added

#### Expression Evaluation
- If `circle-radius` or `line-width` uses MapLibre expressions (match, case, interpolate):
- Use `map.queryRenderedFeatures()` to get the rendered feature with computed properties
- Or manually evaluate expressions using the feature's properties
- For MVP, fall back to default values if expression evaluation is too complex

## Phase 6.5: Multi-Layer Popup Navigation

This phase adds support for navigating through multiple overlapping features when a user clicks on a location where features from different layers intersect. Instead of only showing the topmost feature, users can cycle through all features at the click point using Previous/Next buttons.

### Overview
- **Goal**: Allow users to view all features at a click point, not just the topmost one
- **Scope**: Handle clicks that return multiple features from different visible layers
- **UI**: Add navigation controls to popup for cycling through features
- **Integration**: Update Phase 6.4 highlighting to work with multi-feature navigation

### Feature Collection on Click

#### Click Event Handling
- [x] Modify the existing click handler in `MapPanel.vue` to collect ALL features at the click point
- [x] Currently, the app likely shows only the first/topmost feature - this needs to change
- [x] Use MapLibre's `map.queryRenderedFeatures(point, options)` to get all features at click location

#### Query Strategy
- [x] Query all visible, enabled layers (layers that are currently toggled on)
- [x] Build array of layer IDs from the current layer config state
- [x] Filter to only include layers where `visible === true`
- [x] Pass these layer IDs to `queryRenderedFeatures`:
  ```typescript
  const visibleLayerIds = layerConfigs
    .filter(config => config.visible)
    .map(config => config.id);

  const features = map.queryRenderedFeatures(event.point, {
    layers: visibleLayerIds
  });
  ```

#### Feature Deduplication
- [x] MapLibre may return duplicate features if a layer has multiple sub-layers (e.g., fill + line for polygons)
- [x] Deduplicate by unique combination of `layerId` + feature ID/properties
- [x] Create helper function `deduplicateFeatures(features: MapLibreFeature[]): MapLibreFeature[]`
- [x] Keep the first occurrence of each unique feature

#### Feature Sorting
- [x] Sort features by layer order (top layers first)
- [x] Users expect to see features in the same order as layer stacking
- [x] Use the layer config order to determine priority
- [x] Create helper function `sortFeaturesByLayerOrder(features: MapLibreFeature[], layerConfigs: LayerConfig[]): MapLibreFeature[]`

### State Management

#### Multi-Feature State
- [x] Create a reactive ref to track all features at click point:
  ```typescript
  const clickedFeatures = ref<{
    features: Array<{
      feature: any;
      layerId: string;
      layerTitle: string;
      geometryType: 'Point' | 'LineString' | 'Polygon';
    }>;
    currentIndex: number;
  }>({
    features: [],
    currentIndex: 0
  });
  ```
  **Note**: Implementation uses `popupFeatures` array and `currentFeatureIndex` ref instead of nested structure
- [x] `features`: Array of all features at the click point with metadata
- [x] `currentIndex`: Index of the currently displayed feature (0-based)

#### Computed Properties
- [x] Create computed property for the currently active feature:
  ```typescript
  const activeFeature = computed(() => {
    if (clickedFeatures.value.features.length === 0) return null;
    return clickedFeatures.value.features[clickedFeatures.value.currentIndex];
  });
  ```
  **Note**: Implementation uses `currentPopupFeature` computed property
- [x] Create computed property for feature count display:
  ```typescript
  const featureCountDisplay = computed(() => {
    const total = clickedFeatures.value.features.length;
    const current = clickedFeatures.value.currentIndex + 1; // 1-based for display
    return total > 1 ? `${current} of ${total}` : '';
  });
  ```
  **Note**: Display logic is in `popupHtml` computed property

#### Navigation Functions
- [x] Create `goToNextFeature()` function:
  ```typescript
  function goToNextFeature() {
    const total = clickedFeatures.value.features.length;
    if (total <= 1) return;

    clickedFeatures.value.currentIndex =
      (clickedFeatures.value.currentIndex + 1) % total;

    // Update popup content and highlight
    updatePopupForActiveFeature();
  }
  ```
  **Note**: Highlight update happens via watcher on `currentFeatureIndex`
- [x] Create `goToPreviousFeature()` function:
  ```typescript
  function goToPreviousFeature() {
    const total = clickedFeatures.value.features.length;
    if (total <= 1) return;

    clickedFeatures.value.currentIndex =
      (clickedFeatures.value.currentIndex - 1 + total) % total;

    // Update popup content and highlight
    updatePopupForActiveFeature();
  }
  ```
  **Note**: Highlight update happens via watcher on `currentFeatureIndex`

### Popup UI Updates

#### MapPopup Component Changes
The `@phila/phila-ui-map-core` MapPopup component needs to be updated to support navigation:

- [x] Add new props to MapPopup.vue:
  ```typescript
  interface MapPopupProps {
    // ... existing props
    showNavigation?: boolean;
    currentFeatureIndex?: number;
    totalFeatures?: number;
    layerName?: string;
  }
  ```

- [x] Add new events to MapPopup.vue:
  ```typescript
  interface MapPopupEmits {
    // ... existing emits
    (e: 'next'): void;
    (e: 'previous'): void;
  }
  ```

#### Navigation UI Layout
- [x] Add a header section above the popup content showing:
  - [x] Layer name (e.g., "Bike Network")
  - [x] Feature counter (e.g., "1 of 3") - only show when multiple features exist

- [x] Add Previous/Next buttons:
  - [x] Position them in the popup header or as floating controls
  - [x] Style consistently with existing popup design
  - [x] Disable Previous button when on first feature
  - [x] Disable Next button when on last feature
  - [ ] Consider using keyboard shortcuts (arrow keys) for navigation

#### Header Layout Example

<div class="popup-header" v-if="showNavigation">
  <div class="layer-name">{{ layerName }}</div>
  <div class="navigation-controls" v-if="totalFeatures > 1">
    <button
      @click="$emit('previous')"
      :disabled="currentFeatureIndex === 0"
      class="nav-button"
    >
      ← Previous
    </button>
    <span class="feature-counter">
      {{ currentFeatureIndex + 1 }} of {{ totalFeatures }}
    </span>
    <button
      @click="$emit('next')"
      :disabled="currentFeatureIndex === totalFeatures - 1"
      class="nav-button"
    >
      Next →
    </button>
  </div>
</div>


### Popup Content Updates

#### Dynamic Content Rendering
- [x] When `currentIndex` changes, update popup content to show the active feature's properties
  **Note**: Content updates happen automatically via `currentPopupFeature` computed property and watcher on `currentFeatureIndex`
- [x] Create `updatePopupForActiveFeature()` function that:
  - [x] Gets the active feature from `clickedFeatures`
  - [x] Looks up the layer config for popup field configuration
  - [x] Generates popup HTML/content using existing popup logic
  - [x] Updates the MapPopup component with new content
  - [x] Updates the layer name display
  **Note**: Implemented via computed properties and watchers instead of a single function

#### Layer Name Display
- [x] Show the layer title (from layer config) in the popup header
- [x] This helps users understand which layer the current feature belongs to
- [x] Especially important when features from different layers overlap
- [x] Example: "Bike Network", "Zoning Districts", "Building Footprints"

### Highlight Integration (Phase 6.4)

#### Update Highlighting on Navigation
- [x] When user clicks Next/Previous, update the highlight to show the new active feature
- [x] Call `clearHighlight()` before showing new highlight
  **Note**: Implemented via watcher on `currentFeatureIndex`
- [x] Call `highlightFeature(activeFeature.value.feature, activeFeature.value.layerId)` after index changes
  **Note**: Implemented via watcher that updates `selectedFeature`
- [x] Ensure highlight stays in sync with displayed popup content

#### Single Highlight Rule
- [x] Only ONE feature should be highlighted at a time (the currently active one)
- [x] Even if 5 features are at the click point, only highlight the one being viewed
- [x] When user cycles to the next feature, old highlight clears and new one appears
- [x] This provides clear visual feedback about which feature's data is being displayed

### Click Lifecycle Updates

#### On Map Click with Multiple Features
1. [x] Collect all features at click point (query + deduplicate + sort)
   **Note**: Implemented in `handleLayerClick` function (lines 417-451)
2. [x] If no features found, do nothing (no popup, no highlight)
   **Note**: Early return on line 443 if `allFeatures.length === 0`
3. [x] If 1 feature found:
   - [x] Show popup with single feature (no navigation UI)
   - [x] Highlight the feature
   - [x] Set `clickedFeatures` with single item, `currentIndex = 0`
   **Note**: Navigation UI automatically hidden via `:show-navigation="popupFeatures.length > 1"`
4. [x] If 2+ features found:
   - [x] Show popup with first feature (index 0)
   - [x] Show navigation UI with "1 of N" counter
   - [x] Highlight the first feature
   - [x] Set `clickedFeatures` with all items, `currentIndex = 0`
   **Note**: All handled automatically in `handleLayerClick` - sets `currentFeatureIndex = 0` on line 470

#### On Popup Close
- [x] Clear `clickedFeatures.value.features` array
  **Note**: Implemented as `popupFeatures.value = []` in `closePopup` (line 495)
- [x] Reset `clickedFeatures.value.currentIndex` to 0
  **Note**: Implemented as `currentFeatureIndex.value = 0` in `closePopup` (line 497)
- [x] Clear highlight (Phase 6.4 integration)
  **Note**: Implemented as `selectedFeature.value = null` in `closePopup` (line 500)
- [x] Hide popup
  **Note**: Popup is v-if controlled, automatically hidden when `currentPopupFeature` is null

#### On Navigation (Next/Previous)
1. [x] Update `currentIndex` (wrap around if needed)
   **Note**: Implemented in `goToNextFeature` and `goToPreviousFeature` with modulo wrapping (lines 505-519)
2. [x] Clear old highlight
   **Note**: Automatic via watcher on `currentFeatureIndex` which updates `selectedFeature`
3. [x] Highlight new active feature

---

## Phase 6.5 Debugging - Popup Navigation Issues

### Issue 1: Next Button Closes Popup Instead of Navigating ✅ FIXED
**Problem**: When clicking the Next button in the popup (when multiple features are at a click point), the popup closes instead of showing the next feature's information.

**Root Cause**: The MapPopup component had watchers on `html` and `currentFeatureIndex` that called `createPopup()`, which removed and recreated the popup. This removal triggered the MapLibre popup's `close` event, which propagated and closed the popup.

**Solution**: Combined the watchers into one that updates popup content in-place using `popup.setHTML()` instead of recreating the popup. This prevents the close event from firing.

**Files Changed**:
- `phila-ui-4/packages/map-core/src/components/popups/MapPopup.vue` - Lines 190-212

**Debugging Steps**:
- [x] Check if Next button click is propagating and triggering close event - **FOUND: createPopup() was removing popup**
- [x] Verify `@next` event handler is being called correctly - **Working correctly**
- [x] Check if `goToNextFeature()` is executing fully before popup closes - **Was executing, but popup was being recreated**
- [x] Review event propagation/stopPropagation in MapPopup component - **Added stopPropagation, but main fix was avoiding popup recreation**
- [x] Check if popup close is triggered by click outside detection - **Not the issue**

### Issue 2: Next Button Visibility is Inconsistent ✅ LIKELY FIXED
**Problem**: The Next button shows up at the wrong times - sometimes when clicking only 1 feature, and sometimes missing when clicking 2+ features.

**Status**: After fixing Issue 1, this issue appears to have resolved itself. User tested clicking around and could not reproduce the inconsistent behavior anymore.

**Theory**: The popup recreation bug in Issue 1 may have been causing race conditions that made the navigation UI appear/disappear incorrectly.

**Expected Behavior**:
- Click 1 feature → No Next button (single feature, nothing to navigate)
- Click 2+ features → Next button appears with "1 of N" counter

**Debugging Steps**:
- [x] Fixed Issue 1 popup recreation bug
- [x] User tested and cannot reproduce inconsistent behavior anymore
- [ ] ~~Check `popupFeatures.length` calculation~~ - Not needed, issue appears resolved
- [ ] ~~Verify `:show-navigation="popupFeatures.length > 1"` logic~~ - Not needed, issue appears resolved
- [ ] ~~Check if features are being deduplicated correctly~~ - Not needed, issue appears resolved
- [ ] ~~Review `handleLayerClick` to ensure all features at click point are collected~~ - Not needed, issue appears resolved
- [ ] ~~Log `popupFeatures` array length on each click to see actual vs expected count~~ - Not needed, issue appears resolved

### Issue 3: Feature Collection at Click Point ✅ FIXED
**Investigation needed**: Ensure all features at a click point are being collected correctly.

**Status**: After fixing Issue 1, this issue also resolved itself. Features are now being collected and displayed correctly when clicking on overlapping features.

**Theory**: The popup recreation bug was causing the feature collection/display to behave inconsistently. With the popup staying stable and updating in-place, the feature collection logic works correctly.

**Debugging Steps**:
- [x] Fixed Issue 1 popup recreation bug
- [x] User tested and confirmed feature collection is working correctly
- [ ] ~~Add console.log in `handleLayerClick` showing number of features found~~ - Not needed, working correctly
- [ ] ~~Verify `queryRenderedFeatures` is being called with correct parameters~~ - Not needed, working correctly
- [ ] ~~Check if deduplication logic is removing too many features~~ - Not needed, working correctly
- [ ] ~~Verify layer ordering in feature sort is correct~~ - Not needed, working correctly
   **Note**: Watcher on `currentFeatureIndex` (lines 683-735) re-queries and updates highlight
4. [x] Update popup content with new feature's properties
   **Note**: Automatic via `currentPopupFeature` computed property and `popupHtml` computed property
5. [x] Update layer name in header
   **Note**: Automatic via `:layer-name="currentPopupFeature.layerTitle"` prop binding
6. [x] Update feature counter display
   **Note**: Automatic via `:current-feature-index` and `:total-features` prop bindings

### Helper Functions to Create

#### `src/utils/featureHelpers.ts`
Create a new utility file (or add to existing one) with the following functions:

- [x] `deduplicateFeatures(features: MapLibreFeature[]): MapLibreFeature[]`
  - [x] Takes array of features from queryRenderedFeatures
  - [x] Removes duplicates based on feature ID and layer ID
  - [x] Returns deduplicated array
  **Note**: Implemented inline in MapPanel.vue (lines 379-393)

- [x] `sortFeaturesByLayerOrder(features: MapLibreFeature[], layerConfigs: LayerConfig[]): MapLibreFeature[]`
  - [x] Takes features and layer configs
  - [x] Sorts features by their layer's position in the layer config array
  - [x] Layers earlier in the config array (rendered on top) come first
  - [x] Returns sorted array
  **Note**: Implemented inline in MapPanel.vue (lines 395-415)

- [x] `getGeometryType(feature: MapLibreFeature): 'Point' | 'LineString' | 'Polygon'`
  - [x] Determines the feature's geometry type
  - [x] Handles MapLibre's geometry type naming
  - [x] Returns standardized geometry type string
  **Note**: Implemented inline in MapPanel.vue (lines 488-490)

- [x] `enrichFeatureWithMetadata(feature: MapLibreFeature, layerConfigs: LayerConfig[])`
  - [x] Takes a feature and finds its layer config
  - [x] Returns object with `{ feature, layerId, layerTitle, geometryType }`
  - [x] Used when building the `clickedFeatures` array
  **Note**: Implemented inline in `handleLayerClick` during PopupFeature conversion (lines 454-465)

### Keyboard Navigation (Optional Enhancement)

#### Add Keyboard Shortcuts
- [ ] Listen for arrow key events when popup is open
- [ ] Arrow Left or Arrow Up → Previous feature
- [ ] Arrow Right or Arrow Down → Next feature
- [ ] Escape → Close popup
- [ ] Only active when popup is visible
- [ ] Don't interfere with text input fields if popup contains any

#### Implementation
```typescript
function handleKeyboardNavigation(event: KeyboardEvent) {
  if (!popupVisible.value) return;

  switch(event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      goToPreviousFeature();
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      goToNextFeature();
      break;
    case 'Escape':
      closePopup();
      break;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardNavigation);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardNavigation);
});
```

### Edge Cases to Handle

- [ ] **No features at click point**: Don't show popup or highlight
- [ ] **Single feature at click point**: Show popup without navigation UI, no counter
- [ ] **Layer toggled off while viewing its feature**: Remove that feature from `clickedFeatures` array, adjust index if needed
- [ ] **All features' layers toggled off**: Close popup and clear highlight
- [ ] **User clicks elsewhere while multi-feature popup is open**: Clear `clickedFeatures`, start fresh with new click point
- [ ] **Rapid clicking (multiple features in queue)**: Cancel previous popup state before showing new one
- [ ] **Feature from hidden layer somehow in results**: Filter out before displaying

### Integration with Existing Code

#### MapPanel.vue Changes Summary
- [ ] Update click handler to collect all features (not just first)
- [ ] Add `clickedFeatures` ref and related computed properties
- [ ] Add navigation functions (`goToNextFeature`, `goToPreviousFeature`, `updatePopupForActiveFeature`)
- [ ] Update popup event handlers to respond to next/previous events
- [ ] Integrate with Phase 6.4 highlighting (clear + highlight on navigation)
- [ ] Watch for layer visibility changes to filter `clickedFeatures`

#### MapPopup Component Changes Summary
- [ ] Add navigation-related props (showNavigation, currentFeatureIndex, totalFeatures, layerName)
- [ ] Add navigation events (next, previous)
- [ ] Add UI for layer name display
- [ ] Add UI for feature counter (1 of N)
- [ ] Add Previous/Next buttons with proper enabled/disabled states
- [ ] Style navigation controls to fit existing popup design

### Testing Checklist

#### Basic Navigation
- [ ] Click on location with single feature → popup shows, no navigation UI
- [ ] Click on location with 2 features → popup shows "1 of 2", navigation buttons appear
- [ ] Click Next → moves to feature 2, counter shows "2 of 2", highlight updates
- [ ] Click Previous from feature 2 → moves back to feature 1, highlight updates
- [ ] Click Next on last feature → wraps to first feature (or disabled if not wrapping)
- [ ] Click Previous on first feature → wraps to last feature (or disabled if not wrapping)

#### Layer Name Display
- [ ] Layer name shows correct title from layer config for each feature
- [ ] Layer name updates when navigating between features from different layers
- [ ] Layer name is prominently displayed and readable

#### Highlight Integration
- [ ] Only the active feature is highlighted (not all features at click point)
- [ ] Highlight updates when clicking Next/Previous
- [ ] Highlight clears when popup closes
- [ ] Highlight clears when clicking elsewhere on map

#### Edge Cases
- [ ] Toggle off active feature's layer → feature removed from list, popup shows next feature or closes
- [ ] Click on 3 overlapping features → counter shows "1 of 3", can navigate through all
- [ ] Rapid clicks on different locations → popup updates cleanly without stale data
- [ ] Features from same layer at one point → deduplicated correctly, no duplicates in navigation

#### Keyboard Navigation (if implemented)
- [ ] Arrow keys navigate through features when popup is open
- [ ] Arrow keys don't interfere when typing in search box or other inputs
- [ ] Escape key closes popup

### Performance Considerations

#### Query Optimization
- [ ] Limit `queryRenderedFeatures` to only visible layers (not all layers in map)
- [ ] Consider limiting query to a small radius around click point if performance is an issue
- [ ] Don't query layers that are outside their zoom range (already handled by layer visibility)

#### Debouncing/Throttling
- [ ] If users rapidly click Next/Previous, ensure highlights update smoothly
- [ ] Consider debouncing the highlight update if it causes visual jitter
- [ ] Popup content updates should be immediate (no debouncing)

---

## Phase 6.5.5: Layer Data Fetching Optimization

**Goal**: Eliminate unnecessary layer re-fetching and enable parallel data loading for better performance.

**Priority**: High (performance issue causing UX degradation)

### Current Problems

#### Problem 1: Unnecessary Re-fetching
When a user toggles a layer on, ALL visible layers are re-fetched, including layers that already have loaded data.

**Root Cause**:
- `watch(() => props.visibleLayers.size)` triggers on any visibility change (MapPanel.vue:182)
- The watcher calls `fetchLayers(currentBounds.value)` which loops through ALL visible layers (line 193)
- No check exists for whether a layer already has data loaded (line 136)
- Result: Turning on Layer B causes Layer A (already on) to reload unnecessarily

**User Impact**:
- Wasted network bandwidth
- Slower layer loading experience
- Loading spinners appear for layers that are already loaded
- Unnecessary server load

#### Problem 2: Sequential Loading
Layers load one at a time instead of in parallel due to `await` inside the `for` loop.

**Root Cause**:
```typescript
for (const { config } of props.layerList) {
  if (props.visibleLayers.has(config.id)) {
    await fetchFeaturesInBounds(...); // Blocks next iteration
  }
}
```

**User Impact**:
- If 3 layers need loading, they load sequentially: Layer1 → Layer2 → Layer3
- Total load time = sum of individual load times
- Should load in parallel: Layer1 + Layer2 + Layer3 simultaneously
- Total load time = max(Layer1, Layer2, Layer3) time

### Solution Design

#### Core Principle: Separate Concerns
We need to distinguish between two different scenarios:
1. **Visibility Change** → Only fetch newly visible layers (don't re-fetch existing)
2. **Map Movement** → Re-fetch all visible layers for new bounds

#### Approach: Track Previous Visibility State

**Step 1: Add State Tracking**
```typescript
// Track which layers were visible in the previous render
const previouslyVisibleLayers = ref<Set<string>>(new Set());
```

**Step 2: Modify Visibility Watcher**
```typescript
watch(
  () => props.visibleLayers.size,
  () => {
    if (currentBounds.value) {
      // Find newly visible layers (in current but not in previous)
      const newlyVisibleLayerIds = Array.from(props.visibleLayers)
        .filter(id => !previouslyVisibleLayers.value.has(id));

      // Only fetch the newly visible layers
      if (newlyVisibleLayerIds.length > 0) {
        fetchSpecificLayers(currentBounds.value, newlyVisibleLayerIds);
      }

      // Update previous state
      previouslyVisibleLayers.value = new Set(props.visibleLayers);
    }
  }
);
```

**Step 3: Parallel Fetching**
```typescript
async function fetchSpecificLayers(bounds: Bounds, layerIds: string[]) {
  // Build array of fetch promises
  const fetchPromises = layerIds.map(async (layerId) => {
    const config = props.layerList.find(l => l.config.id === layerId)?.config;
    if (!config) return;

    emit("layerLoading", layerId, true);
    try {
      const data = await fetchFeaturesInBounds(config.url, bounds, layerId, config.where);
      layerData.value = { ...layerData.value, [layerId]: data };
      emit("layerError", layerId, null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      emit("layerError", layerId, message);
      console.error(`Error loading ${layerId}:`, err);
    } finally {
      emit("layerLoading", layerId, false);
    }
  });

  // Wait for all fetches to complete in parallel
  await Promise.all(fetchPromises);
}
```

**Step 4: Refactor fetchLayers() for Map Movement**
```typescript
// For map movement (pan/zoom), re-fetch all visible layers
async function fetchLayers(bounds: Bounds) {
  const layerIds = props.layerList
    .filter(({ config }) => props.visibleLayers.has(config.id))
    .map(({ config }) => config.id);

  await fetchSpecificLayers(bounds, layerIds);
}
```

### Implementation Plan

**Order of Operations**:
1. ✅ Add `previouslyVisibleLayers` ref
2. ✅ Create new `fetchSpecificLayers()` function with parallel fetching
3. ✅ Update visibility watcher to only fetch newly visible layers
4. ✅ Refactor `fetchLayers()` to use `fetchSpecificLayers()`
5. ✅ Test visibility changes (should not re-fetch existing layers)
6. ✅ Test map panning (should re-fetch all visible layers)
7. ✅ Test parallel loading with multiple layers toggled on simultaneously

### Testing Strategy

**Test Case 1: Single Layer Toggle**
- Start: No layers visible
- Action: Turn on Layer A
- Expected: Only Layer A fetches
- Verify: Network tab shows 1 request

**Test Case 2: Add Second Layer**
- Start: Layer A visible and loaded
- Action: Turn on Layer B
- Expected: Only Layer B fetches, Layer A does NOT re-fetch
- Verify: Network tab shows 1 request (Layer B only), Layer A spinner does not appear

**Test Case 3: Map Pan**
- Start: Layer A and Layer B visible
- Action: Pan the map
- Expected: Both Layer A and Layer B re-fetch for new bounds
- Verify: Network tab shows 2 requests (one for each layer)

**Test Case 4: Parallel Loading**
- Start: No layers visible
- Action: Turn on Layer A, Layer B, and Layer C simultaneously
- Expected: All 3 layers fetch in parallel (not sequentially)
- Verify: Network tab shows 3 overlapping requests, total time ≈ max(A, B, C) not sum(A + B + C)

**Test Case 5: Toggle Off and On**
- Start: Layer A visible and loaded
- Action: Toggle Layer A off, then immediately on again
- Expected: Layer A re-fetches (because it's newly visible again)
- Verify: Network tab shows fetch request

### Edge Cases to Handle

**Edge Case 1: Rapid Toggling**
If user rapidly toggles layers on/off, we might have:
- Multiple visibility change events in quick succession
- Need to ensure we don't fetch the same layer multiple times

**Solution**: The visibility watcher already handles this because it compares current vs previous state. If Layer A is toggled off then on rapidly, the watcher will see it as "newly visible" and fetch it once.

**Edge Case 2: Layer Toggled Off While Loading**
If user toggles a layer off while it's still loading:
- The fetch promise continues (can't cancel it easily)
- The data arrives and updates `layerData.value`
- But the layer is no longer in `visibleLayers`, so it won't render

**Solution**: This is acceptable behavior. The data sits in `layerData.value` unused but available if the layer is toggled back on (won't need to re-fetch).

**Edge Case 3: Bounds Change During Load**
If the map is panned while layers are loading:
- Old fetches complete with old bounds data
- New fetches start with new bounds
- Both update `layerData.value`

**Solution**: The last fetch to complete will win (overwrites previous data). This is acceptable since we want the most recent bounds data.

### Performance Benefits

**Before**:
- Toggle on Layer B → All layers (A, B, C, ...) re-fetch
- If 5 layers are visible, that's 5 unnecessary fetches
- Layers load sequentially: Time = T_A + T_B + T_C + ...

**After**:
- Toggle on Layer B → Only Layer B fetches
- Layers load in parallel: Time = max(T_A, T_B, T_C, ...)
- Significantly faster user experience

**Estimated Improvement**:
- If toggling on 1 layer when 5 are already visible: 5x fewer network requests
- If loading 3 layers simultaneously: 3x faster load time (parallel vs sequential)

### Code Location

**File**: `src/components/MapPanel.vue`

**Functions to Modify**:
- Line 158: `fetchLayers()` - refactor to use new helper
- Line 182: Visibility watcher - add diff logic
- New: `fetchSpecificLayers()` - parallel fetching helper

**New State**:
- `previouslyVisibleLayers` ref - tracks previous visibility state

### Risks and Mitigation

**Risk**: More complex state management
- **Mitigation**: Add detailed comments explaining the visibility diffing logic

**Risk**: Race conditions with parallel fetches
- **Mitigation**: Each layer ID is unique, so parallel fetches update different keys in `layerData.value` - no conflicts

**Risk**: Breaking existing behavior
- **Mitigation**: Comprehensive testing of all scenarios (visibility changes, map panning, layer toggling)

---

## Phase 6.6: MapPanel.vue Refactoring

**Goal**: Break up the 982-line MapPanel.vue component into more manageable, maintainable pieces using composables.

**Priority**: Medium (complete Phase 6.5 items first before starting this refactor)

### Why Refactor?

- MapPanel.vue is 982 lines long - too large to easily understand and maintain
- Complex logic is intertwined (data fetching, popup management, highlighting, layer filtering)
- Testing individual features in isolation is difficult
- Future framework extraction (Phase 8) will be easier with well-organized code

### Refactoring Strategy: Composables First

Use Vue 3 composables to extract logical concerns into separate files. This approach:
- Keeps component structure intact (less risky than component splitting)
- Enables isolated testing of each composable
- Maintains single component in Vue DevTools (easier debugging)
- Can be done incrementally (one composable at a time)

### Recommended Refactorings (in priority order)

#### 1. Extract `usePopupManager` Composable (~250 lines)

**Location**: `src/composables/usePopupManager.ts`

**What to extract** (lines 295-571 of MapPanel.vue):
- State: `popupFeatures`, `popupLngLat`, `currentFeatureIndex`
- Helper functions:
  - `getLayerConfig()` - lookup layer config by ID
  - `substituteTemplate()` - replace {fieldName} in templates
  - `formatFieldValue()` - format dates, numbers, etc.
  - `deduplicateFeatures()` - remove duplicate features
  - `sortFeaturesByLayerOrder()` - sort by layer rendering order
- Event handlers:
  - `handleLayerClick()` - collect features at click point
  - `closePopup()` - clear popup state
  - `goToNextFeature()` - cycle to next feature
  - `goToPreviousFeature()` - cycle to previous feature
- Computed properties:
  - `currentPopupFeature` - active feature being displayed
  - `popupTitle` - popup title with template substitution
  - `popupHtml` - formatted popup content HTML

**Interface**:
```typescript
export function usePopupManager(
  props: { layerList: LayerConfig[], visibleLayers: Set<string> },
  mapInstance: Ref<MapLibreMap | null>
) {
  return {
    // State
    popupLngLat: Ref<LngLatLike | null>,
    popupFeatures: Ref<PopupFeature[]>,
    currentFeatureIndex: Ref<number>,

    // Computed
    currentPopupFeature: ComputedRef<PopupFeature | null>,
    popupTitle: ComputedRef<string>,
    popupHtml: ComputedRef<string>,

    // Methods
    handleLayerClick: (e: ClickEvent) => void,
    closePopup: () => void,
    goToNextFeature: () => void,
    goToPreviousFeature: () => void,
  }
}
```

**Benefits**:
- Isolates all popup-related logic in one place
- Most complex single responsibility in the file
- Clear inputs (layer config, map) and outputs (popup state, handlers)

#### 2. Extract `useFeatureHighlight` Composable (~200 lines)

**Location**: `src/composables/useFeatureHighlight.ts`

**What to extract** (lines 574-866 of MapPanel.vue):
- State:
  - `highlightCirclesSource` - GeoJSON for highlighted points
  - `highlightLinesSource` - GeoJSON for highlighted lines/polygons
  - `selectedFeature` - currently highlighted feature with metadata
- Paint configs:
  - `highlightCirclesPaint` - electric blue circle styling
  - `highlightLinesPaint` - electric blue line styling
- Helper functions:
  - `getGeometryType()` - determine Point/LineString/Polygon
  - `getOriginalStyleProperties()` - extract original circle radius or line width
  - `extractPolygonBorder()` - convert polygon to border LineString
  - `createHighlightGeoJSON()` - build highlight feature with +3px sizing
  - `updateHighlightLayers()` - update appropriate layer sources
  - `clearHighlightLayers()` - reset to empty feature collections
- Watchers:
  - Watch `selectedFeature` → update highlight layers
  - Watch `visibleLayers` → clear highlight if layer toggled off
  - Watch `currentFeatureIndex` → update highlight when navigating

**Interface**:
```typescript
export function useFeatureHighlight(
  props: { layerList: LayerConfig[], visibleLayers: Set<string> },
  currentPopupFeature: ComputedRef<PopupFeature | null>,
  currentFeatureIndex: Ref<number>,
  popupLngLat: Ref<LngLatLike | null>,
  mapInstance: Ref<MapLibreMap | null>
) {
  return {
    // State
    selectedFeature: Ref<SelectedFeature | null>,

    // Highlight sources (for map layers)
    highlightCirclesSource: Ref<GeoJSON.FeatureCollection>,
    highlightLinesSource: Ref<GeoJSON.FeatureCollection>,

    // Paint configs (for map layers)
    highlightCirclesPaint: CircleLayerSpecification['paint'],
    highlightLinesPaint: LineLayerSpecification['paint'],

    // Methods
    clearHighlightLayers: () => void,
  }
}
```

**Benefits**:
- Self-contained feature with complex geometry manipulation
- Coordinates with popup but can work independently
- Clear separation of concerns

#### 3. Extract `useLayerDataFetching` Composable (~180 lines)

**Location**: `src/composables/useLayerDataFetching.ts`

**What to extract** (lines 38-206 of MapPanel.vue):
- State:
  - `paginatedData` - pre-fetched data for large layers
  - `spatialData` - dynamically fetched data by bounds
  - `currentBounds` - current map viewport bounds
- Helper functions:
  - `fetchAllFeatures()` - paginated fetch for >2000 features
  - `fetchFeaturesInBounds()` - spatial query by bounding box
  - `fetchSpatialLayers()` - fetch all visible layers in bounds
- Event handlers:
  - `onMapLoad()` - get initial bounds, emit zoom, fetch visible layers
  - `onMoveEnd()` - update bounds, fetch layers for new viewport
- Lifecycle:
  - `onMounted()` - fetch paginated layers once
  - Watch `visibleLayers` → fetch newly visible layers

**Interface**:
```typescript
export function useLayerDataFetching(
  props: { layerList: LayerConfig[], visibleLayers: Set<string> },
  emit: (event: 'layerLoading' | 'layerError' | 'zoom', ...args: any[]) => void
) {
  return {
    // State
    paginatedData: Ref<Record<string, GeoJSON.FeatureCollection>>,
    spatialData: Ref<Record<string, GeoJSON.FeatureCollection>>,
    currentBounds: Ref<Bounds | null>,

    // Event handlers (to bind in template)
    onMapLoad: (map: MapLibreMap) => void,
    onMoveEnd: (data: MoveEndData) => void,
  }
}
```

**Benefits**:
- Clear responsibility: managing data loading
- Separates fetching concerns from rendering concerns
- Easy to test data fetching in isolation

#### 4. Extract `useLayerFiltering` Composable (~100 lines)

**Location**: `src/composables/useLayerFiltering.ts`

**What to extract** (lines 210-292 of MapPanel.vue):
- Helper functions:
  - `isVisible()` - check if layer is toggled on
  - `hasSourceReady()` - check if layer data is loaded
  - `getSource()` - get GeoJSON source for a layer
  - `getLayerOpacity()` - get opacity from props or default
  - `getDynamicPaint()` - merge layer paint with opacity slider
  - `getOutlinePaint()` - get outline paint with opacity
- Computed properties:
  - `visibleCircleLayers` - filtered circle layers
  - `visibleFillLayers` - filtered fill layers
  - `visibleFillLayersWithOutline` - fill layers that need outlines
  - `visibleLineLayers` - filtered line layers

**Interface**:
```typescript
export function useLayerFiltering(
  props: { layerList: LayerConfig[], visibleLayers: Set<string>, layerOpacities: Record<string, number> },
  paginatedData: Ref<Record<string, GeoJSON.FeatureCollection>>,
  spatialData: Ref<Record<string, GeoJSON.FeatureCollection>>
) {
  return {
    // Computed
    visibleCircleLayers: ComputedRef<LayerConfig[]>,
    visibleFillLayers: ComputedRef<LayerConfig[]>,
    visibleFillLayersWithOutline: ComputedRef<LayerConfig[]>,
    visibleLineLayers: ComputedRef<LayerConfig[]>,

    // Methods
    getSource: (layer: LayerConfig) => GeoJSONSource,
    getDynamicPaint: (layer: LayerConfig) => any,
    getOutlinePaint: (layer: LayerConfig) => any,
  }
}
```

**Benefits**:
- Pure functions and simple computeds
- Could also be utility module instead of composable
- Centralizes layer filtering logic

#### 5. Extract Field Formatting Utilities (~50 lines)

**Location**: `src/utils/popupFormatters.ts`

**What to extract** (lines 340-383 of MapPanel.vue):
- `formatFieldValue()` - pure function with date/number logic
- `PopupFieldFormat` interface
- `PopupField` interface

**Interface**:
```typescript
export interface PopupFieldFormat {
  dateFormat?: string;
  digitSeparator?: boolean;
  places?: number;
}

export interface PopupField {
  field: string;
  label: string;
  format?: PopupFieldFormat;
}

export function formatFieldValue(value: unknown, format?: PopupFieldFormat): string {
  // Date formatting
  // Number formatting with separators and decimal places
  // String fallback
}
```

**Benefits**:
- Pure utility function with no dependencies
- Easy to test
- Reusable across components

### Result After Refactoring

**MapPanel.vue** would be ~200 lines:
- Template (100 lines) - unchanged
- Setup using 4-5 composables (50 lines)
- Simple prop/emit definitions (30 lines)
- Basic map lifecycle hooks (20 lines)

**New files created:**
- `src/composables/usePopupManager.ts` (~280 lines with types)
- `src/composables/useFeatureHighlight.ts` (~230 lines with types)
- `src/composables/useLayerDataFetching.ts` (~200 lines with types)
- `src/composables/useLayerFiltering.ts` (~120 lines)
- `src/utils/popupFormatters.ts` (~60 lines)

**Example refactored setup:**
```typescript
<script setup lang="ts">
import { usePopupManager } from '@/composables/usePopupManager'
import { useFeatureHighlight } from '@/composables/useFeatureHighlight'
import { useLayerDataFetching } from '@/composables/useLayerDataFetching'
import { useLayerFiltering } from '@/composables/useLayerFiltering'

const props = defineProps<{...}>()
const emit = defineEmits<{...}>()

// Data fetching
const {
  paginatedData,
  spatialData,
  currentBounds,
  onMapLoad,
  onMoveEnd,
} = useLayerDataFetching(props, emit)

// Layer visibility & filtering
const {
  visibleCircleLayers,
  visibleFillLayers,
  visibleLineLayers,
  getSource,
  getDynamicPaint,
} = useLayerFiltering(props, paginatedData, spatialData)

// Popup management
const {
  popupLngLat,
  popupHtml,
  currentPopupFeature,
  popupFeatures,
  currentFeatureIndex,
  handleLayerClick,
  closePopup,
  goToNextFeature,
  goToPreviousFeature,
} = usePopupManager(props, mapInstance)

// Feature highlighting
const {
  selectedFeature,
  highlightCirclesSource,
  highlightLinesSource,
  highlightPaint,
} = useFeatureHighlight(props, currentPopupFeature, currentFeatureIndex, popupLngLat, mapInstance)
</script>
```

### Implementation Approach

**DO NOT start this refactoring until:**
- [ ] All Phase 6.5 items are complete and tested
- [ ] User confirms Phase 6.5 is working correctly in production
- [ ] User explicitly requests starting the MapPanel.vue refactor

**When ready to implement:**
1. Create a feature branch: `refactor/mappanel-composables`
2. Extract composables one at a time (start with `usePopupManager`)
3. Test after each extraction - ensure functionality unchanged
4. Commit each composable extraction separately (easier to review/rollback)
5. Update MapPanel.vue to use all composables
6. Comprehensive testing of all features
7. Code review before merging to main

### Testing Strategy

For each composable:
- [ ] Write unit tests for pure functions
- [ ] Write integration tests for reactive behavior
- [ ] Manually test in dev environment after extraction
- [ ] Ensure no functionality lost or changed

After complete refactor:
- [ ] Full manual testing of all features
- [ ] Layer toggling works
- [ ] Popups show correct data
- [ ] Multi-feature navigation works
- [ ] Highlighting updates correctly
- [ ] Opacity sliders work
- [ ] Data fetching works (pagination + spatial filtering)

### Benefits of This Refactor

- **Maintainability**: Each composable has single, clear responsibility
- **Testability**: Isolated logic can be tested independently
- **Readability**: 200-line component is much easier to understand than 982 lines
- **Framework Extraction** (Phase 8): Composables can be extracted to vue3-layerboard package
- **Debugging**: Easier to trace bugs to specific composable
- **Performance**: Can optimize individual composables without affecting others

### Risks and Mitigation

**Risk**: Breaking existing functionality during refactor
- **Mitigation**: Extract one composable at a time, test thoroughly after each

**Risk**: Introducing subtle bugs in reactive behavior
- **Mitigation**: Write integration tests for each composable, manual testing

**Risk**: Premature abstraction that makes code harder to change
- **Mitigation**: Keep composables focused, don't over-engineer interfaces

**Risk**: Time investment for no visible user benefit
- **Mitigation**: Only do this if team has bandwidth, after all user-facing features are complete

---

### Technical Notes

#### MapLibre Feature Query
- `map.queryRenderedFeatures(point)` returns ALL features at that pixel coordinate
- Without the `layers` option, it returns features from ALL layers (including hidden ones)
- Always pass `{ layers: visibleLayerIds }` to limit results to active layers
- Features are returned in rendering order (top layer first by default)

#### Feature Identity
- MapLibre features may not have stable IDs
- Use combination of `feature.layer.id + JSON.stringify(feature.properties)` for deduplication
- Or use `feature.id` if your feature layers have unique IDs set

#### Wrap-Around vs. Disabled Buttons
- Two UX patterns:
  1. **Wrap-around**: Next on last feature goes to first, Previous on first goes to last (circular navigation)
  2. **Disabled buttons**: Previous disabled on first, Next disabled on last (linear navigation)
- Choose based on user preference - recommend disabled buttons for clarity (less surprising)

#### Layer Order Determination
- Layer rendering order in MapLibre doesn't directly map to config array order
- Use the `layerConfigs` array order as the source of truth for sorting
- Layers added to map later are rendered on top (unless `beforeId` is used)

## Phase 7: Advanced Features
- [ ] URL routing (share map state via URL)
- [ ] Cyclomedia integration (if needed)
- [ ] Print/export functionality

## Phase 8: Framework Extraction and Migration

This phase transforms the vue3-openmaps codebase into the reusable vue3-layerboard framework package and migrates existing applications to use it.

### Overview

- **Goal**: Extract generic mapping framework code into a published npm package
- **Scope**: Repository rename, package structure, API design, publishing, and app migration
- **Result**: Multiple City apps can use `@phila/vue3-layerboard` as a dependency

### Pre-Extraction Analysis

Before restructuring, analyze how the original layerboard framework was configured by existing apps to understand what the new framework needs to support.

#### Analyze Original OpenMaps Configuration

- [x] Review `openmaps/src/main.js` to understand how it configured the old `@phila/layerboard`
- [x] Document configuration options used:
  - [x] `customComps` - Custom Vue components (About modal)
  - [x] `footerContent` - Footer links/buttons configuration
  - [x] `bundled: true` - Bundle mode
  - [x] `layerFilter: true` - Enable layer search/filter (flat list mode)
  - [x] `router` - Vue router configuration
  - [x] `geolocation` - Enable/disable with icon
  - [x] `addressInput` - Search box configuration (width, position, placeholder)
  - [x] `map` - Basemap, imagery, historic basemaps, center, click behavior
  - [x] `cyclomedia` - Cyclomedia integration with credentials
  - [x] `pictometry` - Pictometry integration (disabled in OpenMaps)
  - [x] `baseConfig` - External CDN config URL
  - [x] `webmapId` - ArcGIS WebMap ID

#### Analyze Original StreetSmartPHL Configuration

- [x] Review `StreetSmartPHL/src/main.js` to understand more complex layerboard usage
- [x] Document additional configuration options:
  - [x] `defaultPanel: 'topics'` - Topics-based UI instead of flat list
  - [x] `topics: [...]` - Array of topic modules (pickup, permit, pave, plow, sweep)
  - [x] `dataSources` - External data fetching modules
  - [x] `tiledLayers` - Additional ArcGIS tiled layers beyond webmap
  - [x] `components` - Info panel components array (infoBox, topic-set)
  - [x] `initialPopover` - Splash screen configuration
  - [x] `labelFields` - Custom label field mappings
  - [x] `resetDataOnGeocode` - Data reset behavior
  - [x] 8 custom components (splash screen, legends, status displays)
  - [x] FontAwesome icon registration

#### Key Differences Between Apps

- [x] Document differences:
  - OpenMaps: flat layer list (`layerFilter: true`), router enabled, historic basemaps, 1 custom component
  - StreetSmartPHL: topics accordion (`defaultPanel: 'topics'`), router disabled, no historic basemaps, 8 custom components, dataSources, tiledLayers, splash screen

#### Analyze Topic Configuration Structure

- [x] Review `StreetSmartPHL/src/topics/pave.js` to understand topic structure
- [x] Document topic configuration:
  - [x] `key` - Unique identifier for the topic
  - [x] `icon` - FontAwesome icon name
  - [x] `label` - User-facing display label
  - [x] `dataSources` - Array of data source keys this topic depends on
  - [x] `components` - Array of UI components to render in the topic panel:
    - [x] `paragraph` - Static or dynamic text (can use function for dynamic content)
    - [x] `checkbox-set` - Layer toggles with options:
      - `topicLayers` - Array of layers with title and display options
      - `defaultTopicLayers` - Layers on by default
      - `shouldShowSlider` - Opacity slider toggle
      - `shouldShowLegendBox` - Legend visibility
    - [x] `division` - Styled container with nested components
    - [x] `radio-button-set` - Mutually exclusive layer selection (commented out but available)
    - [x] `popover-link` - Links that open popovers with tables/content
    - [x] `horizontal-table` - Data tables with field definitions
- [x] Note: Components can access state via function slots: `function(state) { return state.sources.weekPave.data; }`

#### Analyze Data Source Configuration Structure

- [x] Review `StreetSmartPHL/src/data-sources/week-pave.js` to understand data source structure
- [x] Document data source configuration:
  - [x] `id` - Unique identifier matching the key used in topics
  - [x] `url` - ArcGIS FeatureServer URL
  - [x] `type` - Data source type ("esri")
  - [x] `dependent` - Dependency relationship ("none" or another source ID)
  - [x] `options` - Query options (`relationship: "where"`)
  - [x] `parameters` - Query parameters (`targetField`, `sourceValue`)
  - [x] `success(data)` - Success callback
  - [x] `error(err)` - Error callback

#### Architectural Decision: Vue-Idiomatic Approach

- [x] Evaluated old layerboard's config-driven component system
- [x] Identified problems with old approach:
  - [x] Configuration as code - mixes data with logic, hard to type-check and debug
  - [x] Reinvents Vue - custom `components` array with `type: "paragraph"` etc. instead of using Vue components
  - [x] Function slots everywhere - `text: function(state) {}` loses Vue reactivity benefits
  - [x] String component references - `type: "horizontal-table"` breaks tree-shaking and type safety
- [x] **Decision: Do NOT maintain backwards compatibility with old config system**
- [x] **Decision: Use Vue-idiomatic patterns instead:**
  - [x] Topics are Vue components (`PaveTopic.vue`, `PlowTopic.vue`) not JS config objects
  - [x] Framework provides reusable building blocks as proper Vue components with typed props
  - [x] Data sources use Vue composables with proper reactivity
  - [x] Topics registered by passing Vue components, not config objects with string type names
- [x] Tradeoff accepted: StreetSmartPHL will need significant rewriting, but result will be:
  - Clearer, more maintainable code
  - Better TypeScript support
  - Better Vue dev tools integration
  - Less "framework magic" to understand

#### Framework Requirements Summary (Revised)

Based on our architectural decision to use Vue-idiomatic patterns, the framework needs to provide:

**Panel Modes:**
- Flat layer list mode (OpenMaps style)
- Topics accordion mode (StreetSmartPHL style) - where topics are Vue components, not config objects

**Reusable Vue Components for Building Topic Panels:**
- `<LayerCheckboxSet>` - Toggle multiple layers with legend and opacity options
- `<TopicAccordion>` - Expandable accordion container for topics
- `<DataTable>` - Display tabular data from data sources
- `<InfoBox>` - Styled information/alert container
- `<PopoverLink>` - Links that open popovers with additional content

**Vue Composables:**
- `useDataSource(config)` - Fetch from ArcGIS FeatureServer with Vue reactivity
- `useLayerboard(config)` - Main framework composable for initialization

**Key Principle:** Topics are Vue components (e.g., `PaveTopic.vue`) that compose framework building blocks, NOT JavaScript config objects with string type references.

**Features to Support:**
- Map configuration (center, zoom, basemaps, historic imagery)
- Cyclomedia integration
- Pictometry integration
- Geolocation
- Address search
- Layer visibility, opacity, legends
- Feature popups and highlighting

---

### 8.1 Architecture Analysis

Categorize the current vue3-openmaps codebase to understand what becomes framework vs application code.

#### Current File Structure (as of January 2025)

```
vue3-openmaps/src/
├── App.vue                      # Main app component
├── main.ts                      # Vue app initialization
├── assets/                      # CSS and images
│   ├── base.css
│   ├── main.css
│   └── logo.svg
├── components/
│   ├── LayerPanel.vue           # Layer list sidebar
│   └── MapPanel.vue             # Map container
├── layers/                      # 130+ static layer config files
│   ├── index.ts                 # Exports all layers
│   ├── types.ts                 # LayerConfig type definitions
│   └── [130+ layer files]       # Philadelphia-specific layer configs
├── services/
│   └── layerConfigService.ts    # Loads layers (static or dynamic)
├── stores/
│   └── counter.ts               # Placeholder Pinia store
└── utils/
    └── webmap-transformer.ts    # Converts Esri WebMap JSON to LayerConfig
```

#### Categorize Files

- [x] Review and categorize each file/folder:

**Framework Code** (will be in `@phila/vue3-layerboard` package):
- [x] `components/LayerPanel.vue` - Generic layer panel (needs refactoring for flexibility)
- [x] `components/MapPanel.vue` - Generic map container
- [x] `services/layerConfigService.ts` - Layer loading service (needs WebMap ID as param)
- [x] `utils/webmap-transformer.ts` - Already generic
- [x] `layers/types.ts` - LayerConfig interface and related types
- [x] New composables to be created

**Application-Specific Code** (stays in example apps / consumer repos):
- [x] `App.vue` - App-specific layout and configuration
- [x] `main.ts` - App initialization with specific config
- [x] `assets/` - App-specific styles and branding
- [x] ~~`layers/*.ts` (130+ files)~~ - **TO BE DELETED** - Using dynamic mode (layers fetched from ArcGIS Online at runtime)
- [x] `stores/counter.ts` - Placeholder, can be removed
- [x] Environment files - Only `.env` needed (dynamic mode is the default)
- [x] GitHub workflows and deployment scripts

**Dependencies** (peer dependencies of the framework):
- [x] `@phila/phila-ui-map-core` - Map components (MapLibreMap, etc.) - v0.0.2-beta.3
- [x] `@phila/phila-ui-core` - UI components and utilities - v2.2.1-beta.0
- [x] `@phila/phila-ui-search` - Search component (transitive dependency via phila-ui-core, v1.0.6-beta.2)
- [x] `maplibre-gl` - Map library - v5.14.0
- [x] `vue` - Framework - v3.5.26

---

### 8.2 Repository Restructure

Transform vue3-openmaps into vue3-layerboard with framework code and example apps.

#### Rename Repository

- [x] Rename GitHub repository from `vue3-openmaps` to `vue3-layerboard` (done on GitHub.com)
- [x] Update local git remote: `git remote set-url origin git@github.com:CityOfPhiladelphia/vue3-layerboard.git`
- [x] Update README.md title and description to reflect new framework purpose

#### Create New Directory Structure

- [x] Create the following structure:
  ```
  vue3-layerboard/
  ├── src/                        # Framework source code
  │   ├── components/
  │   │   ├── LayerPanel.vue
  │   │   ├── MapPanel.vue
  │   │   ├── TopicAccordion.vue  # NEW - for topics mode
  │   │   ├── LayerCheckboxSet.vue # NEW - reusable layer toggles
  │   │   └── index.ts
  │   ├── composables/
  │   │   ├── useLayerboard.ts    # NEW - main framework composable
  │   │   ├── useLayerConfig.ts   # NEW - layer state management
  │   │   ├── useDataSource.ts    # NEW - data fetching composable
  │   │   └── index.ts
  │   ├── services/
  │   │   ├── layerConfigService.ts
  │   │   └── index.ts
  │   ├── utils/
  │   │   ├── webmap-transformer.ts
  │   │   └── index.ts
  │   ├── types/
  │   │   ├── config.ts           # LayerboardConfig interface
  │   │   ├── layer.ts            # LayerConfig and related
  │   │   └── index.ts
  │   └── index.ts                # Main package exports
  ├── examples/
  │   ├── openmaps/               # OpenMaps example app
  │   │   ├── src/
  │   │   │   ├── App.vue
  │   │   │   ├── main.ts
  │   │   │   └── config.ts       # OpenMaps-specific config (WebMap ID, etc.)
  │   │   ├── index.html
  │   │   ├── package.json
  │   │   └── vite.config.ts
  │   └── streetsmartphl/         # StreetSmartPHL example app
  │       ├── src/
  │       │   ├── App.vue
  │       │   ├── main.ts
  │       │   ├── config.ts
  │       │   └── topics/         # Topic Vue components
  │       │       ├── PaveTopic.vue
  │       │       ├── PlowTopic.vue
  │       │       └── index.ts
  │       ├── index.html
  │       ├── package.json
  │       └── vite.config.ts
  ├── package.json                # Framework package
  ├── vite.config.ts              # Library build config
  ├── tsconfig.json
  └── README.md
  ```

#### Move Existing Files

- [x] Move `src/components/LayerPanel.vue` → `src/components/LayerPanel.vue` (already in place)
- [x] Move `src/components/MapPanel.vue` → `src/components/MapPanel.vue` (already in place)
- [x] Move `src/services/layerConfigService.ts` → `src/services/layerConfigService.ts` (already in place)
- [x] Move `src/utils/webmap-transformer.ts` → `src/utils/webmap-transformer.ts` (already in place)
- [x] Move `src/layers/types.ts` → `src/types/layer.ts` (merged into new types file)
- [x] Move `src/App.vue` → `examples/openmaps/src/App.vue`
- [x] Move `src/main.ts` → `examples/openmaps/src/main.ts`
- [x] Delete `src/layers/*.ts` (all 117 static layer files) - Using dynamic mode instead
- [x] Move `src/assets/` → `examples/openmaps/src/assets/`
- [x] Delete `src/stores/counter.ts` (unused placeholder)

---

### 8.3 Package Configuration

Set up the framework as a publishable npm package.

#### Update Root package.json

- [x] Update `package.json` for library publishing:
  ```json
  {
    "name": "@phila/layerboard",
    "version": "3.0.0-beta.0",
    "type": "module",
    "description": "Vue 3 + MapLibre mapping framework for City of Philadelphia applications",
    "main": "./dist/index.js",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.mjs",
        "require": "./dist/index.js"
      },
      "./components": {
        "types": "./dist/components/index.d.ts",
        "import": "./dist/components/index.mjs"
      },
      "./composables": {
        "types": "./dist/composables/index.d.ts",
        "import": "./dist/composables/index.mjs"
      }
    },
    "files": ["dist"],
    "scripts": {
      "build": "vite build",
      "dev": "vite",
      "dev:openmaps": "cd examples/openmaps && vite",
      "dev:streetsmartphl": "cd examples/streetsmartphl && vite"
    },
    "peerDependencies": {
      "vue": "^3.4.0",
      "@phila/phila-ui-map-core": ">=0.1.0",
      "@phila/phila-ui-core": ">=2.0.0",
      "maplibre-gl": "^5.0.0"
    }
  }
  ```

#### Configure Vite for Library Mode

- [x] Update `vite.config.ts` for library build:
  ```typescript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import dts from 'vite-plugin-dts'
  import { resolve } from 'path'

  export default defineConfig({
    plugins: [
      vue(),
      dts({ include: ['src'] })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
      },
      rollupOptions: {
        external: [
          'vue',
          '@phila/phila-ui-map-core',
          '@phila/phila-ui-core',
          '@phila/phila-ui-search',
          'maplibre-gl'
        ]
      }
    }
  })
  ```

---

### 8.4 Create Framework Components

Build the reusable components that consuming apps will use.

#### Refactor LayerPanel.vue

- [x] Make LayerPanel accept props for configuration instead of hardcoding
- [x] Add `mode` prop: `'flat' | 'topics'`
- [x] Add slot for custom topic components in topics mode
- [x] Emit events for layer changes instead of directly mutating state

#### Create TopicAccordion.vue

- [x] Create expandable accordion component for topics mode
- [x] Props: `title`, `icon`, `expanded`, `layerIds`, `headerClass`
- [x] Slots: default slot for custom topic content, icon slot
- [x] Emits: `toggle`, `layerChange`

#### Create LayerCheckboxSet.vue

- [x] Reusable component for toggling multiple layers
- [x] Props: `layers`, `visibleLayerIds`, `layerOpacities`, `loadingLayerIds`, `layerErrors`, `currentZoom`, `showLegend`, `showOpacity`
- [x] Integrates with LayerPanel state via emits: `toggleLayer`, `setOpacity`

---

### 8.5 Create Framework Composables

Build Vue composables for state management and data fetching.

#### Create useLayerboard.ts

- [x] Main initialization composable
- [x] Accepts `LayerboardConfig` object
- [x] Returns reactive state and methods:
  ```typescript
  export function useLayerboard(config: LayerboardConfig) {
    const layerConfigs = ref<LayerConfig[]>([])
    const visibleLayers = ref<Set<string>>(new Set())
    const isLoading = ref(true)

    // Load layers based on config.layerMode
    // ...

    return {
      layerConfigs: readonly(layerConfigs),
      visibleLayers: readonly(visibleLayers),
      isLoading: readonly(isLoading),
      toggleLayer,
      setLayerOpacity,
      filterLayers
    }
  }
  ```

#### Create useDataSource.ts

- [x] Composable for fetching data from ArcGIS FeatureServers
- [x] Supports reactive refetching when address changes
- [x] Returns loading state, data, and error
  ```typescript
  export function useDataSource(config: DataSourceConfig) {
    const data = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    async function fetch(params?: Record<string, any>) { ... }

    return { data, isLoading, error, fetch }
  }
  ```

---

### 8.6 Create Type Definitions

Define TypeScript interfaces for the framework API.

#### Create src/types/config.ts

- [x] Define `LayerboardConfig` interface:
  ```typescript
  export interface LayerboardConfig {
    webMapId: string
    layerMode: 'static' | 'dynamic'
    panelMode: 'flat' | 'topics'
    staticLayers?: LayerConfig[]
    initialView?: { center: [number, number]; zoom: number }
    features?: {
      search?: boolean
      geolocation?: boolean
      cyclomedia?: boolean
      pictometry?: boolean
    }
  }
  ```

#### Create src/types/layer.ts

- [x] Move and expand `LayerConfig` interface from current `layers/types.ts`
- [x] Add supporting types: `LegendItem`, `PopupConfig`, etc.

---

### 8.7 Set Up Example Apps

Create working example applications that demonstrate framework usage.

#### Set Up OpenMaps Example

- [x] Create `examples/openmaps/package.json` with workspace reference to framework
- [x] Create `examples/openmaps/vite.config.ts`
- [x] Update `examples/openmaps/src/main.ts` to use `useLayerboard`
- [x] Update `examples/openmaps/src/App.vue` to use framework components
- [ ] Verify all 130+ layers still work
- [ ] Test search, geolocation, basemaps, cyclomedia, pictometry

#### Set Up StreetSmartPHL Example

- [x] Create `examples/streetsmartphl/` directory structure
- [x] Create topic Vue components (PaveTopic.vue, PlowTopic.vue, etc.)
- [x] Each topic uses framework building blocks (`LayerCheckboxSet`, `DataTable`, etc.)
- [x] Configure with StreetSmartPHL WebMap ID
- [ ] Test topics accordion functionality

#### 8.7.5 Create Main Layerboard Component

Extract the common app layout structure into a reusable `Layerboard.vue` component so example apps don't duplicate the panel/map/header/footer structure.

- [x] Create `src/components/Layerboard.vue` with:
  - [x] Standard layout structure (header, sidebar, map panel, footer, mobile toggle)
  - [x] All layer state management handled internally (visibleLayers, layerOpacities, loadingLayers, layerErrors)
  - [x] Configurable via props: `title`, `subtitle`, `webMapId`, `themeColor`, `sidebarWidth`, `sidebarLabel`, `mapLabel`
  - [x] `cyclomediaConfig` and `pictometryCredentials` props for imagery
  - [x] `showDefaultSidebar` prop to use LayerPanel or custom sidebar
  - [x] `fetchMetadata` prop for OpenMaps-style metadata links
  - [x] Slots for customization: `#header`, `#sidebar`, `#footer`
  - [x] Sidebar slot receives layer state as slot props (`layers`, `visibleLayers`, `toggleLayer`, etc.)
  - [x] Loading and error states with retry button
  - [x] Mobile responsive toggle between sidebar and map
  - [x] Exposes API via `defineExpose` for parent component access
- [x] Export `Layerboard` from `src/components/index.ts`
- [x] Update `layerConfigService.ts` to accept `webMapId` parameter (with caching per WebMap)
- [x] Update OpenMaps example to use `<Layerboard>` component (simplified from ~500 lines to ~40 lines)
- [x] Update StreetSmartPHL example to use `<Layerboard>` with custom `#sidebar` slot for topic accordions (simplified from ~670 lines to ~280 lines)
- [x] Create `pnpm-workspace.yaml` to enable workspace dependency resolution

#### 8.7.6 Debug Layerboard.vue CSS Issues

Fix CSS layout issues causing scrollbars and content being cut off in example apps.

- [x] Investigate CSS causing horizontal and vertical scrollbars around the entire app
- [x] Identify the CSS rules causing content to be offscreen on the right and bottom edges
- [x] Move necessary global CSS from example App.vue files to Layerboard.vue component
- [x] Ensure `html`, `body`, and root element have proper sizing (100vh, 100vw, no overflow)
- [x] Verify flex layout fills available space without causing overflow
- [x] Make sidebar width consistent across both example apps (use OpenMaps width as default)
- [x] Test both OpenMaps and StreetSmartPHL examples to confirm scrollbars are removed
- [x] Ensure mobile responsive behavior still works correctly

#### 8.7.7 StreetSmartPHL Full Topic Implementation

Make the StreetSmartPHL example app fully functional with all 5 topics matching the production app at streetsmartphl.phila.gov. Reference the existing `streetsmartphl` project on the local machine for component configurations.

##### 8.7.7.1 Generic Topic Functionality

Before implementing individual topics, ensure the generic topic infrastructure works correctly.

**NOTE**: The original Layerboard topic system is more complex than simple checkboxes. Key concepts from the original:
- `topicLayers` array with per-layer options: `shouldShowCheckbox`, `shouldShowSlider`, `shouldShowLegendBox`, `layerNameChange`
- `defaultTopicLayers` - layers that auto-activate when the app loads (not just when topic opens)
- `tiledLayers` - separate ESRI tile map layers (different from WebMap feature layers)
- `dataSources` - external data fetching for dynamic components like "trash-status"
- Layer visibility requires BOTH being in `webMapActiveLayers` (toggled on) AND `activeTopicLayers` (topic has it defined)

**Basic Topic Infrastructure:**
- [x] Ensure only one topic can be open at a time (expanding one closes the other)
- [x] Update App.vue layer IDs to match WebMap transformer output (slugified IDs)
- [x] No topic should be open when the app loads (expandedTopic starts as null)
- [x] When a topic opens, auto-activate its default tiled layers (e.g., collectionDay for PickupPHL)
- [x] Add spacing around topic accordions (border, border-radius, margin-bottom)
- [x] Add intro paragraph above topics explaining how to use StreetSmartPHL
- [ ] Ensure layer visibility toggles work within topics (checkboxes control map layers)
- [ ] Verify layer legends display correctly within topics
- [ ] Test layer opacity controls work within topics
- [ ] Ensure zoom-dependent layer visibility warnings appear
- [ ] Verify loading states show for layers within topics
- [ ] Test error handling for failed layer loads within topics
- [ ] Ensure closing a topic doesn't remove layers from the map (persistence)

**Advanced Topic Features (matching original Layerboard):**
- [x] Support per-layer display options (`shouldShowCheckbox: false` hides checkbox, layer is auto-controlled)
- [x] Support `layerNameChange` to display different label than layer title
- [x] Support `shouldShowSlider: false` to hide opacity slider per layer
- [x] Support `shouldShowLegendBox: false` to hide legend per layer
- [x] Support `defaultTopicLayers` for auto-activating feature layers when topic opens (implemented via `setLayersVisible` slot prop)
- [x] Support `defaultTiledLayersMap` for auto-activating tiled layers when topic opens (implemented via `setTiledLayerVisible` slot prop)

**Known Issues / Future Work:**
- [ ] CORS errors for `plowphl-services.phila.gov` - server needs CORS headers enabled, or add proxy support
- [ ] Some layers show "Error" when toggled on (CORS/server unavailable) - consider adding proxy for CORS-blocked services
- [x] Implement `shouldShowCheckbox: false` behavior in LayerCheckboxSet component

##### 8.7.7.2 TiledLayers Support (Framework Feature)

Implement support for ESRI tiled map layers (MapServer tiles) that are separate from WebMap feature layers. These are used by PickupPHL and PlowPHL topics in the original StreetSmartPHL.

**TiledLayers Configuration (in Layerboard.vue or tiledLayerService.ts):**
- [x] Create `TiledLayerConfig` interface with `id`, `url`, `zIndex`, `attribution` properties
- [x] Add `tiledLayers` prop to Layerboard component for registering available tiled layers
- [x] Create `activeTiledLayers` state (Set or array) to track which tiled layers are visible
- [x] Add `toggleTiledLayer(id)` and `setTiledLayerVisible(id, visible)` methods
- [x] Expose tiled layer state/methods via slot props for custom sidebars

**TiledLayers Rendering (in MapPanel.vue or MapView):**
- [x] Add MapLibre raster source for each configured tiled layer
- [x] Add MapLibre raster layer that renders when tiled layer is active
- [ ] Handle tiled layer z-index ordering
- [x] Support show/hide based on `activeTiledLayers` state

**Original StreetSmartPHL TiledLayers to Support:**
| ID | URL | Used By |
|----|-----|---------|
| collectionDay | `https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/PickupPHL_CollectionBands/MapServer` | PickupPHL |
| plowTreatedStreetsStatus | `https://plowphl-services.phila.gov/arcweb/rest/services/Projects/TreatedStatus/MapServer` | PlowPHL |
| plowNotTreatedStreets | `https://plowphl-services.phila.gov/arcweb/rest/services/Projects/NotTreatedCity/MapServer` | PlowPHL |
| plowConditional | `https://plowphl-services.phila.gov/arcweb/rest/services/Projects/NotTreatedCond/MapServer` | PlowPHL |
| plowHighways | `https://plowphl-services.phila.gov/arcweb/rest/services/Projects/NotTreatedHigh/MapServer` | PlowPHL |

##### 8.7.7.3 DataSources Support (Framework Feature)

Implement support for fetching external data from APIs. This data is used by custom topic components to display status, notices, and conditionally show/hide layers.

**DataSources Service (src/composables/useApiDataSources.ts):**
- [x] Create `DataSourceConfig` interface with `id`, `url`, `type` ('http-get' | 'http-post' | 'esri'), `options`
- [x] Create `useApiDataSources()` composable for fetching and caching data
- [x] Implement HTTP GET fetcher for REST APIs
- [x] Implement ESRI FeatureServer fetcher for ArcGIS services
- [x] Add loading/error state tracking per data source
- [x] Add auto-refresh/polling capability for real-time data

**DataSources Integration with Layerboard:**
- [x] Add `dataSources` prop to Layerboard component for registering data sources
- [x] Fetch data sources on mount (automatic via composable)
- [x] Expose data source state via slot props for custom topic components
- [x] Provide `refetchDataSource(id)` method for manual refresh

**Original StreetSmartPHL DataSources to Support:**
| ID | URL | Type | Used By |
|----|-----|------|---------|
| notices | `https://stsweb.phila.gov/StreetsCityWorks/api/Notice/getNotices` | HTTP | All topics |
| storms | `https://stsweb.phila.gov/StreetsCityWorks/api/Storm/getStorm` | HTTP | PlowPHL |
| trashDay | `https://admin.phila.gov/wp-json/closures/v1/closure/` | HTTP | PickupPHL |
| weekPave | `https://services.arcgis.com/.../StreetSmartPHL/FeatureServer/4` | ESRI | PavePHL |
| weekMill | `https://services.arcgis.com/.../StreetSmartPHL/FeatureServer/3` | ESRI | PavePHL |

##### 8.7.7.4 PickupPHL Topic

Implement the PickupPHL (sanitation collection) topic to match production functionality.

**WebMap Feature Layers (auto-visible when topic active, no checkboxes):**
- [x] Sanitation Visits - Close (zoom-dependent visibility)
- [x] Sanitation Visits - Intermediate (zoom-dependent visibility)
- [x] Sanitation Visits - Far (zoom-dependent visibility)
- ~~CollectionBoundary~~ - **NOT a Feature Layer** - it's an `ArcGISMapServiceLayer` (dynamic map service), not queryable for GeoJSON. The "twice-a-week" boundary outline is included in the `CollectionBoundaryPickupPHL__2026` tiled layer.

**Auto-Activating Layers When Topic Opens:**
The PickupPHL topic needs to auto-activate certain layers when the topic accordion is expanded:
- [x] Implement `defaultTopicLayers` support in TopicAccordion or Layerboard
  - Added `setLayerVisible()` and `setLayersVisible()` methods to Layerboard.vue
  - Exposed via slot props for custom sidebars
- [x] When PickupPHL topic expands, auto-toggle ON: Sanitation Visits layers
  - Implemented `defaultTopicLayersMap` in App.vue
  - `onTopicToggle()` now activates/deactivates default layers when topics open/close
- [x] These layers have `shouldShowCheckbox: false` so they're NOT listed in UI, just auto-activated

**TiledLayers:**
- [x] Create `CollectionDayLegend.vue` component with checkbox "Show Collection Day"
- [x] Checkbox toggles `collectionDay` tiled layer on/off
- [x] Display day-of-week legend (Monday-Friday with colors)
- [x] Updated tiled layer URL to `CollectionBoundaryPickupPHL__2026` (2026 version from WebMap)

**Tiled Layer Content (rendered server-side by MapServer):**
The `collectionDay` tiled layer at `https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CollectionBoundaryPickupPHL__2026/MapServer` includes:
- [x] Verify tiled layer renders day-of-week color bands correctly
- [x] Verify tiled layer renders dual-color labels (e.g., "Fri/Tue" where "Fri/" is blue #004da8, "Tue" is red #ff0000)
- [x] Labels are rendered server-side by MapServer - no client-side implementation needed
- [x] Primary day (blue) = Trash & Recycling collection day
- [x] Secondary day (red) = Trash Only collection day (for twice-a-week areas)

**DataSources:**
- [x] Fetch `notices` data source, filter for type "pickupphl", display alerts
- [x] Fetch `trashDay` data source, display collection status in TrashStatus section

**Custom Components:**
- [x] Trash status display (inline in App.vue, not separate component) - displays current trash/recycling collection status
- [x] Create `CollectionDayLegend.vue` - checkbox + day-of-week color legend

**Topic UI Content (matching original pickup.js components array):**
- [x] Add intro paragraph: "See where trash and recycling trucks have visited today, and view where trash and recycling are collected each day of the week."
- [x] Add "Read disclaimer" popover link with GPS technology disclaimer text
- [x] Add dynamic notices alert paragraph (from notices data source)
- [x] Add TrashStatus section showing collection status (from trashDay data source)
- [x] Add "Additional Information" info box with links to phila.gov/trashday and 311

##### 8.7.7.5 PermitPHL Topic

Implement the PermitPHL (street closure permits) topic to match production functionality.

**WebMap Feature Layers (with checkboxes):**
- [x] Current Closures (points)
- [x] Current Closures (segments)
- [x] Future Closures (points)
- [x] Future Closures (segments)

**DataSources:**
- [x] Fetch `notices` data source, filter for type "permitphl", display alerts

**Topic UI Content:**
- [x] Add intro paragraph: "View street and sidewalk closure permits."
- [x] Add dynamic notices alert (from notices data source, type "permitphl")
- [x] Configure layer display options (no opacity slider, matching original)
- [x] Configure default topic layers (Current Closures auto-activate when topic opens)
- [x] Add "Additional Information" info box with links to apply for permit, report violation, FAQ

##### 8.7.7.6 PavePHL Topic

Implement the PavePHL (paving and road conditions) topic to match production functionality.

**WebMap Feature Layers (with checkboxes):**
- [x] Streets Status for Paving Season
- [x] Street Condition Index
- [x] Five Year Paving Plan
- [ ] Highway Districts (commented out in original)
- [ ] Council Districts (commented out in original)
- [ ] State Routes (commented out in original)

**DataSources:**
- [ ] Fetch `weekPave` data source - weekly paving schedule (optional - popover tables)
- [ ] Fetch `weekMill` data source - weekly milling schedule (optional - popover tables)
- [x] Fetch `notices` data source, filter for type "pavephl", display alerts

**Topic UI Content:**
- [x] Add intro paragraph: "View status of paving operations."
- [x] Add dynamic notices alert (from notices data source, type "pavephl")
- [x] Configure layer display options (no opacity slider, matching original)
- [x] Configure default topic layers (Streets Status for Paving Season auto-activate)
- [x] Add "Paving Steps" info box with 4-step explanation (Milling, Adjustments, Paving, Linestriping)

**Follow-up Issues:**
- [x] Use radio buttons instead of checkboxes for layer selection (only one layer visible at a time)
- [x] Fix layer order to match original: Streets Status for Paving Season, Street Condition Index, Five Year Paving Plan
- [x] Fix Street Condition Index layer colors (should be green, orange, red)

##### 8.7.7.7 PlowPHL Topic

Implement the PlowPHL (snow removal and winter operations) topic to match production functionality.

**WebMap Feature Layers (auto-visible based on deployment type, no checkboxes):**
- [x] Treated Street Status (via tiled layer)
- [x] Streets not treated by the City (via tiled layer)

**TiledLayers (conditional visibility based on storms data):**
- [x] `plowTreatedStreetsStatus` - visible during Full/Conditional/Highways deployments
- [x] `plowNotTreatedStreets` - visible during Full deployments
- [x] `plowConditional` - visible during Conditional deployments
- [x] `plowHighways` - visible during Highways Only deployments

**DataSources:**
- [x] Fetch `storms` data source - current deployment type (Full/Conditional/Highways/None)
- [x] Fetch `notices` data source, filter for type "plowphl", display alerts

**Custom Components:**
- [x] Create `PlowDeploymentLegend.vue` - dynamic legend based on deployment type
- [x] Deployment status banner displayed inline in topic (not separate DeploymentType.vue)
- [x] Tiled layer toggling based on deployment type (inline in App.vue toggle handler)

##### 8.7.7.8 SweepPHL Topic

Implement the SweepPHL (street sweeping) topic to match production functionality.

**WebMap Feature Layers (with radio buttons - mutually exclusive):**
- [x] All Route Locations
- [x] Swept Streets
- [x] 2022 Litter Index
- [x] Day-specific Route Locations (Monday-Thursday)

**DataSources:**
- [x] Fetch `notices` data source, filter for type "sweepphl", display alerts

**Custom Components:**
- [x] Create `SweepLegend.vue` - radio button group to toggle between sweep layers
  - Manages layer visibility (no default layers in topic config)
  - Mounts only when topic opens (v-if on expandedTopic)
  - Initializes with Swept Streets + day-specific route on mount
  - Turns off all sweep layers when topic closes

#### 8.7.8 Map Controls Configuration

Add props to Layerboard.vue for configuring map control positions.

**Map Control Position Props:**
- [x] Add `basemapControlPosition` prop (default: 'top-right')
- [x] Add `navigationControlPosition` prop (default: 'bottom-right')
- [x] Add `geolocationControlPosition` prop (default: 'bottom-right')
- [x] Add `searchControlPosition` prop (default: 'top-left')
- [x] Add `drawControlPosition` prop (default: 'bottom-left', null to remove)
- [x] Pass control position props through to MapPanel/phila-ui-map-core

**Position Values:**
- 'top-left', 'top-right', 'bottom-left', 'bottom-right'

**StreetSmartPHL Configuration:**
- Search control: top-left (default)
- Basemap, navigation, geolocation: bottom-left
- Draw control: removed (null)

---

### 8.8 Testing and Validation

Ensure the framework and examples work correctly.

#### Manual Testing

- [ ] Run `pnpm dev:openmaps` and verify all features work
- [ ] Run `pnpm dev:streetsmartphl` and verify topics mode works
- [ ] Test layer toggling, legends, opacity
- [ ] Test popups and feature highlighting
- [ ] Test search and geolocation
- [ ] Test basemap switching

#### Build Testing

- [ ] Run `pnpm build` and verify dist/ output
- [ ] Verify TypeScript declarations are generated
- [ ] Test importing framework in a fresh project

---

### 8.9 Documentation

Write documentation for framework consumers.

#### Update README.md

- [ ] Explain what vue3-layerboard is
- [ ] Installation instructions
- [ ] Basic usage example (flat mode)
- [ ] Topics mode example
- [ ] Link to example apps
- [ ] API reference (or link to docs)

---

### 8.10 Publishing (Future)

Once framework is stable, publish to npm.

- [ ] Publish beta: `npm publish --tag beta`
- [ ] Test in separate project
- [ ] Publish stable when ready

---

### 8.11 Consumer App Migration (Future)

After framework is published, migrate production apps.

#### OpenMaps Production Migration

- [ ] Create branch in original `openmaps` repo
- [ ] Install `@phila/vue3-layerboard`
- [ ] Replace framework code with package imports
- [ ] Keep only app-specific config and layers
- [ ] Test and deploy

#### StreetSmartPHL Production Migration

- [ ] Create `vue3-streetsmartphl` repo
- [ ] Install `@phila/vue3-layerboard`
- [ ] Create topic Vue components
- [ ] Migrate from old Vue 2 layerboard
- [ ] Test and deploy

---

### Success Criteria for Phase 8

- [ ] Repository renamed to vue3-layerboard
- [ ] Framework builds as npm package
- [ ] OpenMaps example runs with framework
- [ ] StreetSmartPHL example runs with topics mode
- [ ] TypeScript types are exported correctly
- [ ] Documentation explains usage

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
