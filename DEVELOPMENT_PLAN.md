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
