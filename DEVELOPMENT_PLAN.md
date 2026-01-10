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

1. [ ] Determine the feature's geometry type (Point, LineString, Polygon)
2. [ ] Extract the feature's original style properties (radius or width)
3. [ ] Create highlight GeoJSON:
   - [ ] For **Point**: Create Point feature with `highlightRadius = originalRadius + 3`
   - [ ] For **LineString**: Create LineString feature with `highlightWidth = originalWidth + 3`
   - [ ] For **Polygon**: Extract polygon boundary as LineString with `highlightWidth = originalBorderWidth + 3`
4. [ ] Update the appropriate highlight layer source with the new GeoJSON
5. [ ] Store feature info in `selectedFeature` ref

#### On Feature Deselection
When popup closes or another feature is selected:

1. [ ] Clear the highlight layer sources (set to empty FeatureCollection)
2. [ ] Set `selectedFeature.value = null`

#### Edge Cases
- [ ] If a feature with no original style info is clicked, use default values (radius: 5, width: 2)
- [ ] If clicking the same feature again (while popup is open), don't recreate the highlight
- [ ] If toggling a layer off while its feature is selected, clear the highlight
- [ ] If panning/zooming while a feature is selected, maintain the highlight

### Integration Points

#### MapPanel.vue Changes
- [ ] Add highlight layer initialization in `onMapLoad`
- [ ] Add `selectedFeature` ref to track current selection
- [ ] Create `highlightFeature(feature, layerId)` function
- [ ] Create `clearHighlight()` function
- [ ] Call `highlightFeature()` when popup opens with a feature
- [ ] Call `clearHighlight()` when popup closes

#### Popup Event Handling
- [ ] Ensure popup close event triggers `clearHighlight()`
- [ ] When clicking a new feature while popup is open, clear old highlight before showing new one
- [ ] The popup should already emit events we can hook into - verify `MapPopup.vue` emits close/feature-change events

#### Layer Toggle Interaction
- [ ] Watch for layer visibility changes
- [ ] If the currently selected feature's layer is toggled off, call `clearHighlight()`
- [ ] This prevents orphaned highlights when source layers are hidden

### Helper Functions to Create

#### `src/utils/highlightHelpers.ts`
Create a new utility file with the following functions:

- [ ] `getFeatureStyleProperties(map: MapLibreMap, layerId: string, feature: any): { radius?: number; width?: number }`
  - [ ] Queries the layer's paint properties
  - [ ] Evaluates expressions for the given feature
  - [ ] Returns original style values or defaults

- [ ] `createHighlightGeoJSON(feature: any, geometryType: string, originalStyle: any): GeoJSON`
  - [ ] Converts feature geometry to highlight GeoJSON
  - [ ] Adds calculated highlight size properties (`highlightRadius` or `highlightWidth`)
  - [ ] Handles Polygon → LineString conversion for borders
  - [ ] Returns FeatureCollection with single feature

- [ ] `extractPolygonBorder(polygonCoordinates: number[][][]): number[][]`
  - [ ] Takes polygon coordinates (array of rings)
  - [ ] Returns just the outer ring as LineString coordinates
  - [ ] Used to highlight polygon borders without fills

### Testing Checklist

- [ ] Click a point feature → electric blue circle appears, larger than original
- [ ] Click a line feature → electric blue line appears, thicker than original
- [ ] Click a polygon feature → electric blue border appears, thicker than original polygon outline
- [ ] Close popup → highlight disappears
- [ ] Click a different feature → old highlight clears, new highlight appears
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
- [ ] Modify the existing click handler in `MapPanel.vue` to collect ALL features at the click point
- [ ] Currently, the app likely shows only the first/topmost feature - this needs to change
- [ ] Use MapLibre's `map.queryRenderedFeatures(point, options)` to get all features at click location

#### Query Strategy
- [ ] Query all visible, enabled layers (layers that are currently toggled on)
- [ ] Build array of layer IDs from the current layer config state
- [ ] Filter to only include layers where `visible === true`
- [ ] Pass these layer IDs to `queryRenderedFeatures`:
  ```typescript
  const visibleLayerIds = layerConfigs
    .filter(config => config.visible)
    .map(config => config.id);

  const features = map.queryRenderedFeatures(event.point, {
    layers: visibleLayerIds
  });
  ```

#### Feature Deduplication
- [ ] MapLibre may return duplicate features if a layer has multiple sub-layers (e.g., fill + line for polygons)
- [ ] Deduplicate by unique combination of `layerId` + feature ID/properties
- [ ] Create helper function `deduplicateFeatures(features: MapLibreFeature[]): MapLibreFeature[]`
- [ ] Keep the first occurrence of each unique feature

#### Feature Sorting
- [ ] Sort features by layer order (top layers first)
- [ ] Users expect to see features in the same order as layer stacking
- [ ] Use the layer config order to determine priority
- [ ] Create helper function `sortFeaturesByLayerOrder(features: MapLibreFeature[], layerConfigs: LayerConfig[]): MapLibreFeature[]`

### State Management

#### Multi-Feature State
- [ ] Create a reactive ref to track all features at click point:
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
- [ ] `features`: Array of all features at the click point with metadata
- [ ] `currentIndex`: Index of the currently displayed feature (0-based)

#### Computed Properties
- [ ] Create computed property for the currently active feature:
  ```typescript
  const activeFeature = computed(() => {
    if (clickedFeatures.value.features.length === 0) return null;
    return clickedFeatures.value.features[clickedFeatures.value.currentIndex];
  });
  ```
- [ ] Create computed property for feature count display:
  ```typescript
  const featureCountDisplay = computed(() => {
    const total = clickedFeatures.value.features.length;
    const current = clickedFeatures.value.currentIndex + 1; // 1-based for display
    return total > 1 ? `${current} of ${total}` : '';
  });
  ```

#### Navigation Functions
- [ ] Create `goToNextFeature()` function:
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
- [ ] Create `goToPreviousFeature()` function:
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

### Popup UI Updates

#### MapPopup Component Changes
The `@phila/phila-ui-map-core` MapPopup component needs to be updated to support navigation:

- [ ] Add new props to MapPopup.vue:
  ```typescript
  interface MapPopupProps {
    // ... existing props
    showNavigation?: boolean;
    currentFeatureIndex?: number;
    totalFeatures?: number;
    layerName?: string;
  }
  ```

- [ ] Add new events to MapPopup.vue:
  ```typescript
  interface MapPopupEmits {
    // ... existing emits
    (e: 'next'): void;
    (e: 'previous'): void;
  }
  ```

#### Navigation UI Layout
- [ ] Add a header section above the popup content showing:
  - [ ] Layer name (e.g., "Bike Network")
  - [ ] Feature counter (e.g., "1 of 3") - only show when multiple features exist

- [ ] Add Previous/Next buttons:
  - [ ] Position them in the popup header or as floating controls
  - [ ] Style consistently with existing popup design
  - [ ] Disable Previous button when on first feature
  - [ ] Disable Next button when on last feature
  - [ ] Consider using keyboard shortcuts (arrow keys) for navigation

#### Header Layout Example
```vue
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
```

### Popup Content Updates

#### Dynamic Content Rendering
- [ ] When `currentIndex` changes, update popup content to show the active feature's properties
- [ ] Create `updatePopupForActiveFeature()` function that:
  - [ ] Gets the active feature from `clickedFeatures`
  - [ ] Looks up the layer config for popup field configuration
  - [ ] Generates popup HTML/content using existing popup logic
  - [ ] Updates the MapPopup component with new content
  - [ ] Updates the layer name display

#### Layer Name Display
- [ ] Show the layer title (from layer config) in the popup header
- [ ] This helps users understand which layer the current feature belongs to
- [ ] Especially important when features from different layers overlap
- [ ] Example: "Bike Network", "Zoning Districts", "Building Footprints"

### Highlight Integration (Phase 6.4)

#### Update Highlighting on Navigation
- [ ] When user clicks Next/Previous, update the highlight to show the new active feature
- [ ] Call `clearHighlight()` before showing new highlight
- [ ] Call `highlightFeature(activeFeature.value.feature, activeFeature.value.layerId)` after index changes
- [ ] Ensure highlight stays in sync with displayed popup content

#### Single Highlight Rule
- [ ] Only ONE feature should be highlighted at a time (the currently active one)
- [ ] Even if 5 features are at the click point, only highlight the one being viewed
- [ ] When user cycles to the next feature, old highlight clears and new one appears
- [ ] This provides clear visual feedback about which feature's data is being displayed

### Click Lifecycle Updates

#### On Map Click with Multiple Features
1. [ ] Collect all features at click point (query + deduplicate + sort)
2. [ ] If no features found, do nothing (no popup, no highlight)
3. [ ] If 1 feature found:
   - [ ] Show popup with single feature (no navigation UI)
   - [ ] Highlight the feature
   - [ ] Set `clickedFeatures` with single item, `currentIndex = 0`
4. [ ] If 2+ features found:
   - [ ] Show popup with first feature (index 0)
   - [ ] Show navigation UI with "1 of N" counter
   - [ ] Highlight the first feature
   - [ ] Set `clickedFeatures` with all items, `currentIndex = 0`

#### On Popup Close
- [ ] Clear `clickedFeatures.value.features` array
- [ ] Reset `clickedFeatures.value.currentIndex` to 0
- [ ] Clear highlight (Phase 6.4 integration)
- [ ] Hide popup

#### On Navigation (Next/Previous)
1. [ ] Update `currentIndex` (wrap around if needed)
2. [ ] Clear old highlight
3. [ ] Highlight new active feature
4. [ ] Update popup content with new feature's properties
5. [ ] Update layer name in header
6. [ ] Update feature counter display

### Helper Functions to Create

#### `src/utils/featureHelpers.ts`
Create a new utility file (or add to existing one) with the following functions:

- [ ] `deduplicateFeatures(features: MapLibreFeature[]): MapLibreFeature[]`
  - [ ] Takes array of features from queryRenderedFeatures
  - [ ] Removes duplicates based on feature ID and layer ID
  - [ ] Returns deduplicated array

- [ ] `sortFeaturesByLayerOrder(features: MapLibreFeature[], layerConfigs: LayerConfig[]): MapLibreFeature[]`
  - [ ] Takes features and layer configs
  - [ ] Sorts features by their layer's position in the layer config array
  - [ ] Layers earlier in the config array (rendered on top) come first
  - [ ] Returns sorted array

- [ ] `getGeometryType(feature: MapLibreFeature): 'Point' | 'LineString' | 'Polygon'`
  - [ ] Determines the feature's geometry type
  - [ ] Handles MapLibre's geometry type naming
  - [ ] Returns standardized geometry type string

- [ ] `enrichFeatureWithMetadata(feature: MapLibreFeature, layerConfigs: LayerConfig[])`
  - [ ] Takes a feature and finds its layer config
  - [ ] Returns object with `{ feature, layerId, layerTitle, geometryType }`
  - [ ] Used when building the `clickedFeatures` array

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

### Architecture Analysis

#### Framework vs Application Code

Before extraction, analyze the codebase and categorize files:

- [ ] **Framework Code** (goes into package):
  - [ ] Core components: LayerPanel, MapPanel, App structure components
  - [ ] Utilities: webmap-transformer, layerConfigService, highlightHelpers, featureHelpers
  - [ ] Type definitions: LayerConfig, WebMap types, component props/emits
  - [ ] Services: AIS geocoding integration, spatial data fetching
  - [ ] State management: Layer visibility, popup state, highlight state
  - [ ] Styles: Component CSS that's framework-specific

- [ ] **Application-Specific Code** (stays in consumer repos):
  - [ ] WebMap ID configuration
  - [ ] App-specific header/footer/branding
  - [ ] Custom layer panel modes (flat list vs topics)
  - [ ] App-specific routing
  - [ ] Environment configuration
  - [ ] Build/deployment scripts

- [ ] **Shared Dependencies**:
  - [ ] `@phila/phila-ui-map-core` - map components (already published)
  - [ ] `@phila/phila-ui-core` - UI components (already published)
  - [ ] `maplibre-gl` - map library
  - [ ] `vue` - framework

#### Configuration API Design

Design the public API that consuming apps will use:

- [ ] Create `LayerboardConfig` interface:
  ```typescript
  interface LayerboardConfig {
    /** Esri WebMap ID to load */
    webMapId: string;

    /** Layer panel display mode */
    panelMode: 'flat' | 'topics';

    /** Topic definitions for topics mode */
    topics?: Topic[];

    /** Initial map view */
    initialView?: {
      center: [number, number];
      zoom: number;
    };

    /** Whether to fetch layers at runtime or use static configs */
    layerMode: 'static' | 'dynamic';

    /** Static layer configs (only if layerMode === 'static') */
    staticLayers?: LayerConfig[];

    /** Basemap options */
    basemap?: {
      defaultImageryUrl: string;
      defaultLabelsUrl: string;
      historicOptions?: BasemapOption[];
    };

    /** Feature to enable/disable */
    features?: {
      search?: boolean;
      geolocation?: boolean;
      basemapToggle?: boolean;
      cyclomedia?: boolean;
      drawTool?: boolean;
    };

    /** AIS geocoding configuration */
    geocoding?: {
      enabled: boolean;
      apiUrl?: string;
    };

    /** Custom component slots */
    slots?: {
      header?: Component;
      footer?: Component;
      sidebar?: Component;
    };
  }
  ```

- [ ] Create `Topic` interface for topics mode:
  ```typescript
  interface Topic {
    id: string;
    title: string;
    /** Controls whether entire topic's layers are visible */
    visible: boolean;
    /** List of layer IDs belonging to this topic */
    layerIds: string[];
  }
  ```

- [ ] Design initialization API:
  ```typescript
  // Option 1: Composable pattern
  const layerboard = useLayerboard(config);

  // Option 2: Plugin pattern
  app.use(Vue3LayerboardPlugin, config);

  // Option 3: Component pattern
  <Layerboard :config="config" />
  ```

### Repository Rename and Package Setup

#### Rename Repository

- [ ] Rename GitHub repository from `vue3-openmaps` to `vue3-layerboard`
  - [ ] Update repository name in GitHub settings
  - [ ] Update local git remotes: `git remote set-url origin <new-url>`
  - [ ] Update README.md with new repo name and purpose

#### Package Structure

- [ ] Create package directory structure:
  ```
  vue3-layerboard/
  ├── src/
  │   ├── components/          # Framework components
  │   │   ├── LayerPanel.vue
  │   │   ├── MapPanel.vue
  │   │   └── index.ts
  │   ├── composables/         # Reusable composition functions
  │   │   ├── useLayerboard.ts
  │   │   ├── useLayerConfig.ts
  │   │   └── index.ts
  │   ├── services/            # Core services
  │   │   ├── layerConfigService.ts
  │   │   └── index.ts
  │   ├── utils/               # Utility functions
  │   │   ├── webmap-transformer.ts
  │   │   ├── highlightHelpers.ts
  │   │   ├── featureHelpers.ts
  │   │   └── index.ts
  │   ├── types/               # TypeScript definitions
  │   │   ├── config.ts
  │   │   ├── layer.ts
  │   │   ├── webmap.ts
  │   │   └── index.ts
  │   └── index.ts             # Main package entry point
  ├── examples/                # Demo apps
  │   ├── openmaps-demo/       # OpenMaps-style flat list demo
  │   └── topics-demo/         # Topics/accordion demo
  ├── package.json
  ├── vite.config.ts           # Build config for library mode
  ├── tsconfig.json
  └── README.md
  ```

#### Package Configuration

- [ ] Update `package.json`:
  ```json
  {
    "name": "@phila/vue3-layerboard",
    "version": "0.1.0",
    "description": "Vue 3 + MapLibre mapping framework for City of Philadelphia",
    "main": "./dist/vue3-layerboard.umd.js",
    "module": "./dist/vue3-layerboard.es.js",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/vue3-layerboard.es.js",
        "require": "./dist/vue3-layerboard.umd.js",
        "types": "./dist/index.d.ts"
      },
      "./styles": "./dist/style.css"
    },
    "files": [
      "dist"
    ],
    "scripts": {
      "dev": "vite",
      "build": "vite build && vue-tsc --declaration --emitDeclarationOnly",
      "preview": "vite preview"
    },
    "peerDependencies": {
      "vue": "^3.4.0",
      "@phila/phila-ui-map-core": "^0.1.0",
      "@phila/phila-ui-core": "^0.1.0",
      "maplibre-gl": "^4.0.0"
    },
    "devDependencies": {
      "@vitejs/plugin-vue": "^5.0.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0",
      "vue-tsc": "^1.8.0"
    },
    "repository": {
      "type": "git",
      "url": "https://github.com/CityOfPhiladelphia/vue3-layerboard.git"
    },
    "keywords": ["vue3", "maplibre", "gis", "philadelphia", "mapping"],
    "author": "City of Philadelphia",
    "license": "MIT"
  }
  ```

- [ ] Configure Vite for library mode in `vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import { resolve } from 'path'

  export default defineConfig({
    plugins: [vue()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Vue3Layerboard',
        formats: ['es', 'umd'],
        fileName: (format) => `vue3-layerboard.${format}.js`
      },
      rollupOptions: {
        external: ['vue', '@phila/phila-ui-map-core', '@phila/phila-ui-core', 'maplibre-gl'],
        output: {
          globals: {
            vue: 'Vue',
            'maplibre-gl': 'maplibregl'
          }
        }
      }
    }
  })
  ```

### Code Extraction

#### Extract Core Components

- [ ] Move LayerPanel.vue to `src/components/LayerPanel.vue`
  - [ ] Make panel mode configurable via props
  - [ ] Support both flat list and topics mode
  - [ ] Remove OpenMaps-specific hardcoded elements

- [ ] Move MapPanel.vue to `src/components/MapPanel.vue`
  - [ ] Accept configuration via props
  - [ ] Emit events for app-level handling
  - [ ] Keep generic, no app-specific logic

- [ ] Create `src/components/TopicsPanel.vue` for topic-based layer organization:
  - [ ] Accordion UI with expandable topics
  - [ ] Each topic controls visibility of its layers
  - [ ] Layer checkboxes nested under topics
  - [ ] Based on analysis of old Vue 2 layerboard streetsmartphl implementation

#### Extract Utilities

- [ ] Move `src/utils/webmap-transformer.ts` to package
  - [ ] Already generic, no changes needed
  - [ ] Ensure all imports are relative or from dependencies

- [ ] Move `src/services/layerConfigService.ts` to package
  - [ ] Make WebMap ID configurable (passed via config, not hardcoded)
  - [ ] Support both static and dynamic modes via config

- [ ] Create `src/utils/highlightHelpers.ts` (Phase 6.4 code)
  - [ ] Generic feature highlighting utilities
  - [ ] No app-specific logic

- [ ] Create `src/utils/featureHelpers.ts` (Phase 6.5 code)
  - [ ] Feature deduplication and sorting
  - [ ] Geometry type detection
  - [ ] Feature metadata enrichment

#### Extract Types

- [ ] Create `src/types/config.ts` with all configuration interfaces
- [ ] Create `src/types/layer.ts` with LayerConfig and related types
- [ ] Create `src/types/webmap.ts` with Esri WebMap JSON types
- [ ] Export all types from `src/types/index.ts`

#### Create Composables

- [ ] Create `src/composables/useLayerboard.ts`:
  ```typescript
  export function useLayerboard(config: LayerboardConfig) {
    // Initialize layer config service
    // Set up state management
    // Provide map and layer refs
    // Return public API
    return {
      layerConfigs: readonly(layerConfigs),
      map: readonly(map),
      toggleLayer: (layerId: string) => { ... },
      setLayerOpacity: (layerId: string, opacity: number) => { ... },
      // ... other public methods
    }
  }
  ```

- [ ] Create `src/composables/useLayerConfig.ts`:
  - [ ] Handles loading static vs dynamic configs
  - [ ] Manages layer visibility state
  - [ ] Provides layer filtering/search

- [ ] Create `src/composables/useMapInteraction.ts`:
  - [ ] Handles feature clicks
  - [ ] Manages popup state
  - [ ] Manages feature highlighting
  - [ ] Multi-feature navigation

#### Create Main Entry Point

- [ ] Create `src/index.ts`:
  ```typescript
  // Export main composable
  export { useLayerboard } from './composables/useLayerboard'

  // Export components
  export { default as LayerPanel } from './components/LayerPanel.vue'
  export { default as MapPanel } from './components/MapPanel.vue'
  export { default as TopicsPanel } from './components/TopicsPanel.vue'

  // Export utilities (for advanced usage)
  export * from './utils'

  // Export types
  export * from './types'

  // Export services (for custom integrations)
  export * from './services'
  ```

### Example Applications

#### Create OpenMaps Demo

- [ ] Create `examples/openmaps-demo/` directory
- [ ] Copy current App.vue structure
- [ ] Configure with OpenMaps WebMap ID
- [ ] Use flat list panel mode
- [ ] Demonstrate all features (search, geolocation, basemap, etc.)
- [ ] Include README with setup instructions

#### Create Topics Demo

- [ ] Create `examples/topics-demo/` directory
- [ ] Model after old Vue 2 layerboard streetsmartphl structure
- [ ] Configure with topics-based WebMap
- [ ] Use topics panel mode
- [ ] Define topic structure:
  ```typescript
  const topics: Topic[] = [
    {
      id: 'streets',
      title: 'Streets',
      visible: true,
      layerIds: ['bike-network', 'paving-status']
    },
    {
      id: 'permits',
      title: 'Permits',
      visible: false,
      layerIds: ['construction-permits', 'street-closures']
    }
  ]
  ```
- [ ] Include README explaining topic configuration

### Documentation

#### README.md

- [ ] Write comprehensive README with:
  - [ ] Introduction to vue3-layerboard
  - [ ] Installation instructions
  - [ ] Basic usage example
  - [ ] Configuration API documentation
  - [ ] Links to example apps
  - [ ] Contributing guidelines
  - [ ] Migration guide from Vue 2 layerboard

#### API Documentation

- [ ] Document `LayerboardConfig` interface with all options
- [ ] Document `useLayerboard` composable API
- [ ] Document exported components and their props
- [ ] Document utility functions for advanced usage
- [ ] Create JSDoc comments for all public APIs

#### Migration Guide

- [ ] Write guide comparing Vue 2 `@phila/layerboard` to vue3-layerboard
- [ ] Map old configuration patterns to new ones
- [ ] Explain breaking changes
- [ ] Provide code examples for common migration scenarios

### Testing

#### Unit Tests

- [ ] Set up Vitest for unit testing
- [ ] Test webmap-transformer functions
- [ ] Test highlightHelpers utilities
- [ ] Test featureHelpers utilities
- [ ] Test layerConfigService logic
- [ ] Test composables in isolation

#### Integration Tests

- [ ] Test full layerboard initialization with different configs
- [ ] Test flat list mode
- [ ] Test topics mode
- [ ] Test feature highlighting
- [ ] Test multi-feature popups
- [ ] Test layer toggling and opacity

#### Example App Testing

- [ ] Manually test OpenMaps demo
- [ ] Manually test Topics demo
- [ ] Verify both demos work identically to current implementations

### Publishing

#### NPM Setup

- [ ] Set up npm organization scope: `@phila`
- [ ] Ensure team members have publish access
- [ ] Configure `.npmrc` if needed for private registry

#### Pre-publish Checklist

- [ ] Build the package: `npm run build`
- [ ] Verify `dist/` contents include all necessary files
- [ ] Test package locally with `npm link` in example apps
- [ ] Verify types are exported correctly (`.d.ts` files present)
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Update version in `package.json`

#### Publish to NPM

- [ ] Dry run: `npm publish --dry-run`
- [ ] Publish beta: `npm publish --tag beta` (for initial testing)
- [ ] Test beta installation in separate project
- [ ] Publish stable: `npm publish` (when ready for production)

#### GitHub Release

- [ ] Create Git tag: `git tag v0.1.0`
- [ ] Push tag: `git push origin v0.1.0`
- [ ] Create GitHub release with changelog
- [ ] Attach build artifacts if needed

### Application Migration

#### OpenMaps Migration

- [ ] Create `vue3-migration` branch in original `openmaps` repo
- [ ] Install vue3-layerboard: `npm install @phila/vue3-layerboard`
- [ ] Remove old framework code (keep only app-specific files)
- [ ] Create `src/config/layerboard.config.ts`:
  ```typescript
  import type { LayerboardConfig } from '@phila/vue3-layerboard'

  export const layerboardConfig: LayerboardConfig = {
    webMapId: '1596df70df0349e293ceec46a06ccc50',
    panelMode: 'flat',
    layerMode: 'dynamic',
    basemap: {
      defaultImageryUrl: '...',
      defaultLabelsUrl: '...',
      historicOptions: [...]
    },
    features: {
      search: true,
      geolocation: true,
      basemapToggle: true,
      cyclomedia: true,
      drawTool: true
    }
  }
  ```
- [ ] Update App.vue to use `useLayerboard(layerboardConfig)`
- [ ] Remove duplicate component definitions (use framework exports)
- [ ] Update imports to reference `@phila/vue3-layerboard`
- [ ] Test all functionality still works
- [ ] Update deployment pipeline if needed

#### StreetsSmartPHL Migration

- [ ] Create `vue3-migration` branch in `streetsmartphl` repo
- [ ] Install vue3-layerboard
- [ ] Create topics-based configuration:
  ```typescript
  export const layerboardConfig: LayerboardConfig = {
    webMapId: '<streetsmartphl-webmap-id>',
    panelMode: 'topics',
    topics: [
      { id: 'streets', title: 'Streets', visible: true, layerIds: [...] },
      { id: 'permits', title: 'Permits', visible: false, layerIds: [...] }
    ],
    // ... other config
  }
  ```
- [ ] Migrate custom Streets Department branding/header
- [ ] Test topic accordion functionality
- [ ] Ensure all existing features work

#### CSOcast Migration

- [ ] Follow similar pattern as StreetsSmartPHL
- [ ] Determine if using flat list or topics mode
- [ ] Configure with CSOcast WebMap ID
- [ ] Migrate Water Department branding
- [ ] Test CSO-specific functionality

### Maintenance and Versioning

#### Semantic Versioning

- [ ] Follow semver: `MAJOR.MINOR.PATCH`
- [ ] MAJOR: Breaking changes to public API
- [ ] MINOR: New features, backward compatible
- [ ] PATCH: Bug fixes, backward compatible

#### Changelog

- [ ] Maintain `CHANGELOG.md` with all version changes
- [ ] Document breaking changes prominently
- [ ] List new features and bug fixes

#### Dependency Updates

- [ ] Keep `@phila/phila-ui-map-core` up to date
- [ ] Keep Vue, MapLibre, and other dependencies current
- [ ] Test thoroughly after dependency updates

#### Consumer Support

- [ ] Provide migration support to app teams
- [ ] Create GitHub issues for bug reports
- [ ] Review and merge pull requests from consumers
- [ ] Maintain example apps as reference implementations

### Success Criteria

- [ ] vue3-layerboard package is published to npm
- [ ] Package can be installed and used in new projects
- [ ] OpenMaps demo app runs with framework package
- [ ] Topics demo app demonstrates accordion mode
- [ ] At least one production app (OpenMaps) successfully migrated to use the package
- [ ] Documentation is complete and clear
- [ ] Tests pass and provide good coverage
- [ ] Package follows npm best practices (proper exports, types, tree-shaking support)

### Rollback Plan

If framework extraction encounters major issues:

- [ ] Keep original vue3-openmaps repo intact (don't delete)
- [ ] Consumers can fall back to vendoring/copying code if package doesn't work
- [ ] Beta tag allows testing without committing production apps
- [ ] Vue3-migration branches can be abandoned if migration fails

### Technical Considerations

#### Shared State Management

- **Challenge**: Different apps may want different state management solutions (Pinia, Vuex, plain refs)
- **Solution**: Use Vue's provide/inject pattern for internal state, keep composables framework-agnostic

#### CSS and Styling

- **Challenge**: Apps have different design systems and branding
- **Solution**:
  - Export minimal base styles
  - Use CSS custom properties for theming
  - Allow consumers to override styles
  - Don't bundle framework CSS by default (opt-in via import)

#### TypeScript Support

- **Challenge**: Consumers may use JavaScript or TypeScript
- **Solution**:
  - Write package in TypeScript
  - Export `.d.ts` files for type safety
  - Ensure package works in both JS and TS projects

#### Bundle Size

- **Challenge**: Framework shouldn't add excessive weight to apps
- **Solution**:
  - Use tree-shaking friendly exports
  - Mark dependencies as external (peer dependencies)
  - Don't bundle Vue, MapLibre, or phila-ui packages
  - Lazy load optional features

#### Breaking Changes

- **Challenge**: Changes to framework may break consumer apps
- **Solution**:
  - Use semantic versioning strictly
  - Deprecate features before removing them
  - Provide migration guides for breaking changes
  - Consider LTS versions for stability

#### Monorepo Alternative

If separate package approach becomes too complex:

- **Alternative**: Create monorepo with framework + apps in one repository
- **Structure**:
  ```
  packages/
    ├── vue3-layerboard/     # Framework package
    ├── openmaps/            # OpenMaps app
    ├── streetsmartphl/      # StreetsSmartPHL app
    └── csocast/             # CSOcast app
  ```
- **Pros**: Easier coordination, shared tooling
- **Cons**: Teams must coordinate commits, shared CI/CD
- **Decision**: Only consider if separate package approach fails

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
