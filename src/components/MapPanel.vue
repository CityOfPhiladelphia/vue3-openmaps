<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Map as MapComponent, CircleLayer, FillLayer, LineLayer, MapPopup, DrawTool } from "@phila/phila-ui-map-core";
import type { LngLatLike, CircleLayerSpecification, LineLayerSpecification } from "maplibre-gl";

// Bounds type for spatial queries
interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

// Props from parent
const props = defineProps<{
  visibleLayers: Set<string>;
  layerOpacities: Record<string, number>;
  layerList: Array<{ config: any; component: string }>;
}>();

// Emit events to parent
const emit = defineEmits<{
  (e: "zoom", zoom: number): void;
  (e: "layerLoading", layerId: string, loading: boolean): void;
  (e: "layerError", layerId: string, error: string | null): void;
}>();

// ============================================================================
// MAP REF & ZOOM TRACKING
// ============================================================================
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null);
const mapInstance = ref<any>(null); // Store the actual MapLibre map instance

function onZoomChange(zoom: number) {
  emit("zoom", zoom);
}

// ============================================================================
// DATA FETCHING
// ============================================================================

// Store for layer data (keyed by layer id)
// All layers use spatial filtering with automatic pagination
const layerData = ref<Record<string, GeoJSON.FeatureCollection>>({});

// Current map bounds (updated on moveend)
const currentBounds = ref<Bounds | null>(null);

// Helper to fetch features within a bounding box from ArcGIS FeatureServer
// Automatically paginates if more than 2000 features exist in the bounds
async function fetchFeaturesInBounds(
  url: string,
  bounds: Bounds,
  where?: string
): Promise<GeoJSON.FeatureCollection> {
  const whereClause = encodeURIComponent(where || "1=1");

  // Create Esri geometry envelope for spatial query
  const geometry = JSON.stringify({
    xmin: bounds.west,
    ymin: bounds.south,
    xmax: bounds.east,
    ymax: bounds.north,
    spatialReference: { wkid: 4326 },
  });

  const pageSize = 2000;
  let offset = 0;
  let allFeatures: GeoJSON.Feature[] = [];
  let hasMore = true;

  // Fetch all features within bounds, paginating if necessary
  while (hasMore) {
    const queryUrl = `${url}/query?where=${whereClause}&geometry=${encodeURIComponent(geometry)}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&resultRecordCount=${pageSize}&resultOffset=${offset}&f=geojson`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as GeoJSON.FeatureCollection;

    if (data.features && data.features.length > 0) {
      allFeatures = allFeatures.concat(data.features);
      offset += data.features.length;
      // Continue if we got a full page (might be more)
      hasMore = data.features.length === pageSize;
    } else {
      hasMore = false;
    }
  }

  return {
    type: "FeatureCollection",
    features: allFeatures,
  };
}

// Fetch all visible layers for the current bounds
async function fetchLayers(bounds: Bounds) {
  for (const { config } of props.layerList) {
    // Fetch data for all visible layers
    if (props.visibleLayers.has(config.id)) {
      emit("layerLoading", config.id, true);
      try {
        const data = await fetchFeaturesInBounds(config.url, bounds, config.where);
        layerData.value = { ...layerData.value, [config.id]: data };
        emit("layerError", config.id, null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load";
        emit("layerError", config.id, message);
        console.error(`Error loading ${config.id}:`, err);
      } finally {
        emit("layerLoading", config.id, false);
      }
    }
  }
}

// Handle map moveend event
function onMoveEnd(data: { center: { lng: number; lat: number }; zoom: number; bounds: Bounds }) {
  currentBounds.value = data.bounds;
  fetchLayers(data.bounds);
}

// Handle map load event - get initial bounds and zoom
function onMapLoad(map: any) {
  // Store the MapLibre map instance for later use
  mapInstance.value = map;

  const bounds = map.getBounds();
  currentBounds.value = {
    west: bounds.getWest(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    north: bounds.getNorth(),
  };

  // Emit the initial zoom level so layer availability is correctly calculated
  const zoom = map.getZoom();
  emit("zoom", zoom);

  // Fetch any layers that are already visible
  fetchLayers(currentBounds.value);
}

// Watch for visibility changes - fetch any newly visible layers
// We watch the Set size because the Set is mutated (not replaced), so watching the Set itself won't trigger
watch(
  () => props.visibleLayers.size,
  async () => {
    // Close any open popup when layer visibility changes
    // This prevents showing data from a layer that's no longer visible
    if (popupFeatures.value.length > 0) {
      closePopup();
    }

    if (currentBounds.value) {
      // Fetch data for any newly visible layers
      fetchLayers(currentBounds.value);
    }
  }
);

// ============================================================================
// LAYER FILTERING BY TYPE
// ============================================================================
function isVisible(layerId: string) {
  return props.visibleLayers.has(layerId);
}

// Check if layer has data ready to render
function hasSourceReady(layer: any): boolean {
  return !!layerData.value[layer.id];
}

const visibleCircleLayers = computed(() =>
  props.layerList
    .filter(l => l.config.type === "circle" && isVisible(l.config.id) && hasSourceReady(l.config))
    .map(l => l.config)
);

const visibleFillLayers = computed(() =>
  props.layerList
    .filter(l => l.config.type === "fill" && isVisible(l.config.id) && hasSourceReady(l.config))
    .map(l => l.config)
);

const visibleFillLayersWithOutline = computed(() =>
  props.layerList
    .filter(l => l.config.type === "fill" && l.config.outlinePaint && isVisible(l.config.id) && hasSourceReady(l.config))
    .map(l => l.config)
);

const visibleLineLayers = computed(() =>
  props.layerList
    .filter(l => l.config.type === "line" && isVisible(l.config.id) && hasSourceReady(l.config))
    .map(l => l.config)
);

// ============================================================================
// GENERIC SOURCE & PAINT HELPERS
// ============================================================================
function getSource(layer: any) {
  const data = layerData.value[layer.id];
  // Data should always exist here because we filter with hasSourceReady()
  return { type: "geojson" as const, data: data! };
}

function getLayerOpacity(layerId: string): number {
  return props.layerOpacities[layerId] ?? 1;
}

function getDynamicPaint(layer: any) {
  const sliderOpacity = getLayerOpacity(layer.id);
  const opacityKey =
    layer.type === "circle" ? "circle-opacity" :
    layer.type === "fill" ? "fill-opacity" :
    "line-opacity";

  // For fill layers, check if the base paint has fill-opacity of 0 (transparent fill)
  // If so, keep it at 0 regardless of slider (the slider controls outline visibility instead)
  if (layer.type === "fill" && layer.paint['fill-opacity'] === 0) {
    return { ...layer.paint, 'fill-opacity': 0 };
  }

  // Extract color key based on layer type
  const colorKey =
    layer.type === "circle" ? "circle-color" :
    layer.type === "fill" ? "fill-color" :
    "line-color";

  const paint = { ...layer.paint };
  const color = paint[colorKey];

  // Check if color has alpha channel (rgba format)
  // If so, extract the alpha and replace color with fully opaque version
  // This allows the slider to control the full 0-100% opacity range
  // The layer will start at its configured opacity, but can reach 100% when slider is maxed
  if (typeof color === 'string' && color.startsWith('rgba(')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      const [, r, g, b] = match;
      // Replace color with fully opaque version so slider has full control
      paint[colorKey] = `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Use the slider value as the final opacity
  // The slider represents absolute opacity (0.0 to 1.0)
  paint[opacityKey] = sliderOpacity;
  return paint;
}

function getOutlinePaint(layer: any) {
  const sliderOpacity = getLayerOpacity(layer.id);
  // Use the slider value as the final opacity for outlines too
  return { ...layer.outlinePaint, "line-opacity": sliderOpacity };
}

// ============================================================================
// POPUP STATE & HANDLING
// ============================================================================
interface PopupFieldFormat {
  dateFormat?: string;
  digitSeparator?: boolean;
  places?: number;
}

interface PopupField {
  field: string;
  label: string;
  format?: PopupFieldFormat;
}

interface PopupFeature {
  layerId: string;
  layerTitle: string;
  properties: Record<string, unknown>;
  popupConfig: {
    title: string;
    fields: PopupField[];
  } | null;
}

const popupFeatures = ref<PopupFeature[]>([]);
const popupLngLat = ref<LngLatLike | null>(null);
const currentFeatureIndex = ref(0);

// Get layer config by ID
function getLayerConfig(layerId: string) {
  const baseLayerId = layerId.replace(/-outline$/, "");
  const layer = props.layerList.find(l => l.config.id === baseLayerId);
  return layer?.config;
}

// Template substitution: replace {fieldName} with feature property values
function substituteTemplate(template: string, properties: Record<string, unknown>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, fieldName) => {
    const value = properties[fieldName];
    if (value === null || value === undefined) return "";
    return String(value);
  });
}

// Format field value for display
function formatFieldValue(value: unknown, format?: PopupFieldFormat): string {
  if (value === null || value === undefined) return "-";

  if (format?.dateFormat && typeof value === "number") {
    const date = new Date(value);
    switch (format.dateFormat) {
      case "shortDateShortTime":
        return date.toLocaleString();
      case "longMonthDayYear":
        return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
      case "shortDate":
        return date.toLocaleDateString();
      case "longDate":
        return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      default:
        return date.toLocaleDateString();
    }
  }

  if (typeof value === "number") {
    if (value > 1000000000000 && !format) {
      return new Date(value).toLocaleDateString();
    }

    const places = format?.places;
    const useDigitSeparator = format?.digitSeparator ?? true;

    if (places !== undefined) {
      const formatted = value.toFixed(places);
      if (useDigitSeparator) {
        const parts = formatted.split(".");
        const integerPart = parts[0] || "0";
        const decimalPart = parts[1];
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
      }
      return formatted;
    }

    return useDigitSeparator ? value.toLocaleString() : String(value);
  }

  return String(value);
}

// Deduplicate features by creating a unique key from layer ID and feature properties
// MapLibre may return the same feature multiple times (e.g., from fill + outline layers)
function deduplicateFeatures(features: MapLibreFeature[]): MapLibreFeature[] {
  const seen = new Set<string>();
  return features.filter((feature) => {
    // Create a unique key from base layer ID (without -outline suffix) and stringified properties
    const baseLayerId = feature.layer.id.replace(/-outline$/, '');
    const key = `${baseLayerId}:${JSON.stringify(feature.properties)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Sort features by layer order (layers rendered on top appear first)
// Uses the layer config order to determine which features should be shown first
function sortFeaturesByLayerOrder(
  features: MapLibreFeature[],
  layerConfigs: Array<{ id: string }>
): MapLibreFeature[] {
  // Create a map of layer ID to its index in the config (lower index = rendered earlier = lower priority)
  const layerIndexMap = new Map<string, number>();
  layerConfigs.forEach((config, index) => {
    layerIndexMap.set(config.id, index);
  });

  // Sort features by their layer's index (higher index = rendered later = shown first)
  return features.sort((a, b) => {
    const baseLayerIdA = a.layer.id.replace(/-outline$/, '');
    const baseLayerIdB = b.layer.id.replace(/-outline$/, '');
    const indexA = layerIndexMap.get(baseLayerIdA) ?? -1;
    const indexB = layerIndexMap.get(baseLayerIdB) ?? -1;
    return indexB - indexA; // Reverse order: higher index first
  });
}

// MapLibre feature type from queryRenderedFeatures
interface MapLibreFeature {
  properties: Record<string, unknown>;
  geometry: GeoJSON.Geometry;
  layer: { id: string };
  source?: string;
  sourceLayer?: string;
  state?: Record<string, unknown>;
}

// Handle layer click - collects ALL features at click point from all visible layers
function handleLayerClick(e: { lngLat: { lng: number; lat: number } }) {
  // Query ALL visible layers at the click point, not just the clicked layer
  // This enables navigation between multiple overlapping features
  const map = mapInstance.value;
  if (!map) return;

  // Build array of all visible layer IDs from the layer configuration
  const visibleLayerIds: string[] = [];
  props.layerList.forEach(layerItem => {
    const layerConfig = layerItem.config;
    if (props.visibleLayers.has(layerConfig.id)) {
      visibleLayerIds.push(layerConfig.id);
      // Include outline layers for fill layers
      if (layerConfig.outlinePaint) {
        visibleLayerIds.push(`${layerConfig.id}-outline`);
      }
    }
  });

  // Query all features at the click point from all visible layers
  const point = map.project([e.lngLat.lng, e.lngLat.lat]);
  const allFeatures = map.queryRenderedFeatures(point, {
    layers: visibleLayerIds,
  }) as MapLibreFeature[];

  if (allFeatures.length === 0) return;

  // Remove duplicate features (e.g., outline + fill from same feature)
  const uniqueFeatures = deduplicateFeatures(allFeatures);

  // Sort features by layer rendering order (bottom to top)
  // Extract just the configs for the sorting function
  const layerConfigs = props.layerList.map(item => item.config);
  const sortedFeatures = sortFeaturesByLayerOrder(uniqueFeatures, layerConfigs);

  // Convert to PopupFeature format
  const newFeatures: PopupFeature[] = sortedFeatures.map((feature) => {
    const baseLayerId = feature.layer.id.replace(/-outline$/, '');
    const config = getLayerConfig(baseLayerId);
    if (!config) return null;

    return {
      layerId: config.id,
      layerTitle: config.title,
      properties: feature.properties || {},
      popupConfig: config.popup,
    };
  }).filter((f): f is PopupFeature => f !== null);

  if (newFeatures.length === 0) return;

  popupFeatures.value = newFeatures;
  currentFeatureIndex.value = 0;
  popupLngLat.value = [e.lngLat.lng, e.lngLat.lat];

  // Store selected feature for highlighting (use the first feature from the sorted list)
  const firstFeature = sortedFeatures[0];
  if (firstFeature && firstFeature.geometry) {
    const baseLayerId = firstFeature.layer.id.replace(/-outline$/, '');
    const config = getLayerConfig(baseLayerId);
    if (config) {
      const geometryType = getGeometryType(firstFeature.geometry);
      const originalStyle = getOriginalStyleProperties(config.id, config.type);

      selectedFeature.value = {
        geometry: firstFeature.geometry,
        geometryType,
        layerId: config.id,
        properties: firstFeature.properties || {},
        originalStyle,
      };
    }
  }
}

// Close popup
function closePopup() {
  popupFeatures.value = [];
  popupLngLat.value = null;
  currentFeatureIndex.value = 0;

  // Clear selected feature highlight
  selectedFeature.value = null;
}

// Navigate to next feature in the popup
// Cycles through all features collected at the click point
function goToNextFeature() {
  const total = popupFeatures.value.length;
  if (total <= 1) return;

  currentFeatureIndex.value = (currentFeatureIndex.value + 1) % total;
}

// Navigate to previous feature in the popup
// Cycles through all features collected at the click point
function goToPreviousFeature() {
  const total = popupFeatures.value.length;
  if (total <= 1) return;

  currentFeatureIndex.value = (currentFeatureIndex.value - 1 + total) % total;
}

// Current feature for display
const currentPopupFeature = computed(() => {
  if (popupFeatures.value.length === 0) return null;
  return popupFeatures.value[currentFeatureIndex.value];
});

// Popup title with template substitution
const popupTitle = computed(() => {
  const feature = currentPopupFeature.value;
  if (!feature || !feature.popupConfig) return feature?.layerTitle || "";
  return substituteTemplate(feature.popupConfig.title, feature.properties);
});

// Generate popup HTML content
const popupHtml = computed(() => {
  const feature = currentPopupFeature.value;
  if (!feature) return "";

  let html = `<div class="popup-content">`;
  html += `<h3 class="popup-title">${popupTitle.value}</h3>`;

  if (feature.popupConfig?.fields?.length) {
    html += `<table class="popup-table">`;
    for (const field of feature.popupConfig.fields) {
      const value = formatFieldValue(feature.properties[field.field], field.format);
      html += `<tr><th>${field.label}</th><td>${value}</td></tr>`;
    }
    html += `</table>`;
  } else {
    html += `<p class="popup-no-fields">No additional information available.</p>`;
  }

  html += `</div>`;
  return html;
});

// ============================================================================
// FEATURE HIGHLIGHT LAYERS
// ============================================================================
// Empty GeoJSON sources for highlight layers
const highlightCirclesSource = ref<GeoJSON.FeatureCollection>({
  type: "FeatureCollection",
  features: [],
});

const highlightLinesSource = ref<GeoJSON.FeatureCollection>({
  type: "FeatureCollection",
  features: [],
});

// Highlight layer paint properties
const highlightCirclesPaint: CircleLayerSpecification["paint"] = {
  "circle-radius": ["get", "highlightRadius"],
  "circle-color": "#00FFFF",
  "circle-opacity": 0.8,
  "circle-stroke-width": 2,
  "circle-stroke-color": "#FFFFFF",
};

const highlightLinesPaint: LineLayerSpecification["paint"] = {
  "line-width": ["get", "highlightWidth"],
  "line-color": "#00FFFF",
  "line-opacity": 0.9,
};

// ============================================================================
// SELECTED FEATURE STATE
// ============================================================================
interface SelectedFeature {
  geometry: GeoJSON.Geometry;
  geometryType: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  layerId: string;
  properties: Record<string, unknown>;
  originalStyle: {
    radius?: number;  // for circles
    width?: number;   // for lines
  };
}

const selectedFeature = ref<SelectedFeature | null>(null);

// Helper function to determine geometry type from a feature
function getGeometryType(geometry: GeoJSON.Geometry): SelectedFeature['geometryType'] {
  return geometry.type as SelectedFeature['geometryType'];
}

// Helper function to get original style properties for a layer
function getOriginalStyleProperties(layerId: string, layerType: string): { radius?: number; width?: number } {
  const config = getLayerConfig(layerId);
  if (!config) return { radius: 5, width: 2 }; // defaults

  const paint = config.paint || {};

  if (layerType === 'circle') {
    // Extract circle-radius - handle both static values and expressions
    const radiusValue = paint['circle-radius'];
    if (typeof radiusValue === 'number') {
      return { radius: radiusValue };
    }
    // For expressions, we'll use a default for now
    // In the future, this could evaluate the expression for the specific feature
    return { radius: 5 };
  }

  if (layerType === 'line' || layerType === 'fill') {
    // Extract line-width
    const widthValue = paint['line-width'];
    if (typeof widthValue === 'number') {
      return { width: widthValue };
    }
    // Check outlinePaint for fill layers
    if (config.outlinePaint && config.outlinePaint['line-width']) {
      const outlineWidth = config.outlinePaint['line-width'];
      if (typeof outlineWidth === 'number') {
        return { width: outlineWidth };
      }
    }
    return { width: 2 };
  }

  return { radius: 5, width: 2 };
}

// ============================================================================
// HIGHLIGHT LIFECYCLE FUNCTIONS
// ============================================================================

// Extract the outer ring coordinates from a polygon for highlighting the border
// Polygons are arrays of rings (first is outer, rest are holes), we only want the outer ring
function extractPolygonBorder(coordinates: number[][][]): number[][] {
  if (!coordinates || coordinates.length === 0) {
    return [];
  }
  // Return the outer ring as LineString coordinates
  return coordinates[0] ?? [];
}

// Build GeoJSON feature for highlighting based on geometry type
// Creates a prominent highlight that's significantly larger than the original feature
// so it's clearly visible on top of (and around) the selected feature
function createHighlightGeoJSON(feature: SelectedFeature): GeoJSON.FeatureCollection {
  const { geometry, geometryType, originalStyle } = feature;

  // For Point geometries, add +3px to the original radius for visibility
  if (geometryType === 'Point' || geometryType === 'MultiPoint') {
    const originalRadius = originalStyle.radius || 5;
    const highlightRadius = originalRadius + 3;
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry,
        properties: {
          highlightRadius,
        },
      }],
    };
  }

  // For LineString geometries, add +3px to the original width for visibility
  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    const originalWidth = originalStyle.width || 2;
    const highlightWidth = originalWidth + 3;
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry,
        properties: {
          highlightWidth,
        },
      }],
    };
  }

  // For Polygon geometries, extract the border and add +3px to the original width
  // We only highlight the border, not the fill, for better visual clarity
  if (geometryType === 'Polygon') {
    const polygonCoords = (geometry as GeoJSON.Polygon).coordinates;
    const borderCoords = extractPolygonBorder(polygonCoords);
    const originalWidth = originalStyle.width || 2;
    const highlightWidth = originalWidth + 3;

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: borderCoords,
        },
        properties: {
          highlightWidth,
        },
      }],
    };
  }

  // For MultiPolygon, convert each polygon's border to a LineString
  if (geometryType === 'MultiPolygon') {
    const multiPolygonCoords = (geometry as GeoJSON.MultiPolygon).coordinates;
    const originalWidth = originalStyle.width || 2;
    const highlightWidth = originalWidth + 3;

    const features = multiPolygonCoords.map((polygonCoords) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: extractPolygonBorder(polygonCoords),
      },
      properties: {
        highlightWidth,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  // Return empty collection for unsupported geometry types
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

// Update highlight layer sources with the selected feature's geometry
// Routes to the appropriate layer (circles or lines) based on geometry type
function updateHighlightLayers(feature: SelectedFeature | null) {
  if (!feature) {
    clearHighlightLayers();
    return;
  }

  const highlightGeoJSON = createHighlightGeoJSON(feature);

  // Route to the appropriate highlight layer based on geometry type
  if (feature.geometryType === 'Point' || feature.geometryType === 'MultiPoint') {
    highlightCirclesSource.value = highlightGeoJSON;
    highlightLinesSource.value = { type: 'FeatureCollection', features: [] };
  } else {
    // Lines, Polygons, and MultiPolygons all use the lines layer
    highlightLinesSource.value = highlightGeoJSON;
    highlightCirclesSource.value = { type: 'FeatureCollection', features: [] };
  }
}

// Clear all highlight layers by resetting to empty feature collections
function clearHighlightLayers() {
  highlightCirclesSource.value = { type: 'FeatureCollection', features: [] };
  highlightLinesSource.value = { type: 'FeatureCollection', features: [] };
}

// Watch for changes to selectedFeature and update highlights accordingly
// This automatically syncs the highlight layers with feature selection/deselection
watch(selectedFeature, (newFeature) => {
  updateHighlightLayers(newFeature);
});

// Watch for layer visibility changes to prevent orphaned highlights
// If the currently selected feature's layer is toggled off, clear the highlight
watch(
  () => props.visibleLayers,
  (newVisibleLayers) => {
    if (selectedFeature.value && !newVisibleLayers.has(selectedFeature.value.layerId)) {
      // The selected feature's layer was toggled off, clear the highlight and popup
      selectedFeature.value = null;
      closePopup();
    }
  },
  { deep: true }
);

// Watch for changes to currentFeatureIndex to update highlight when navigating between features
// This syncs the highlight with the currently displayed popup feature
watch(currentFeatureIndex, () => {
  const feature = currentPopupFeature.value;
  if (!feature) {
    selectedFeature.value = null;
    return;
  }

  // Get the actual feature with geometry from the original query
  // We need to re-query to get the geometry since popupFeatures only has properties
  const map = mapInstance.value;
  if (!map || !popupLngLat.value) return;

  // Build array of visible layer IDs
  const visibleLayerIds: string[] = [];
  props.layerList.forEach(layerItem => {
    const layerConfig = layerItem.config;
    if (props.visibleLayers.has(layerConfig.id)) {
      visibleLayerIds.push(layerConfig.id);
      if (layerConfig.outlinePaint) {
        visibleLayerIds.push(`${layerConfig.id}-outline`);
      }
    }
  });

  // Query features at the popup location
  const point = map.project(popupLngLat.value as [number, number]);
  const allFeatures = map.queryRenderedFeatures(point, {
    layers: visibleLayerIds,
  });

  // Find the feature that matches the current popup feature
  const matchingFeature = allFeatures.find((f: { properties?: Record<string, unknown>; geometry?: GeoJSON.Geometry; layer: { id: string } }) => {
    const baseLayerId = f.layer.id.replace(/-outline$/, '');
    return baseLayerId === feature.layerId &&
           JSON.stringify(f.properties) === JSON.stringify(feature.properties);
  });

  if (matchingFeature && matchingFeature.geometry) {
    const config = getLayerConfig(feature.layerId);
    if (config) {
      const geometryType = getGeometryType(matchingFeature.geometry);
      const originalStyle = getOriginalStyleProperties(config.id, config.type);

      selectedFeature.value = {
        geometry: matchingFeature.geometry,
        geometryType,
        layerId: config.id,
        properties: matchingFeature.properties || {},
        originalStyle,
      };
    }
  }
});
</script>

<template>
  <div class="map-panel">
    <MapComponent
      ref="mapRef"
      :basemap-change-controls="{ toggle: true, dropdown: true, position: 'top-right' }"
      :navigation-controls="{ position: 'bottom-right' }"
      :geolocation-control="{ position: 'bottom-right' }"
      :map-search-control="{ position: 'top-left' }"
      basemap-before-id="feature-layers-start"
      @zoom="onZoomChange"
      @click="closePopup"
      @moveend="onMoveEnd"
      @load="onMapLoad"
    >
      <!-- Draw Tool -->
      <DrawTool position="bottom-left" />

      <!-- Placeholder layer - always present to serve as before-id anchor for basemap layers -->
      <!-- This ensures basemaps stay below all feature layers even when basemap sources change -->
      <CircleLayer
        key="feature-layers-start"
        id="feature-layers-start"
        :source="{ type: 'geojson', data: { type: 'FeatureCollection', features: [] } }"
        :paint="{ 'circle-radius': 0 }"
      />

      <!-- Circle Layers - positioned before highlight layers -->
      <CircleLayer
        v-for="layer in visibleCircleLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        :before-id="'highlight-circles'"
        @click="handleLayerClick"
      />

      <!-- Fill Layers - positioned before highlight layers -->
      <FillLayer
        v-for="layer in visibleFillLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        :before-id="'highlight-circles'"
        @click="handleLayerClick"
      />

      <!-- Outline LineLayer for Fill Layers that have outlinePaint - positioned before highlight layers -->
      <LineLayer
        v-for="layer in visibleFillLayersWithOutline"
        :key="layer.id + '-outline'"
        :id="layer.id + '-outline'"
        :source="getSource(layer)"
        :paint="getOutlinePaint(layer)"
        :minzoom="layer.minZoom"
        :before-id="'highlight-lines'"
        @click="handleLayerClick"
      />

      <!-- Line Layers - positioned before highlight layers -->
      <LineLayer
        v-for="layer in visibleLineLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        :before-id="'highlight-lines'"
        @click="handleLayerClick"
      />

      <!-- Highlight Layers - Must be last to render on top of all feature layers -->
      <!-- These show the currently selected feature with electric blue highlighting -->
      <CircleLayer
        key="highlight-circles-layer"
        id="highlight-circles"
        :source="{ type: 'geojson', data: highlightCirclesSource }"
        :paint="highlightCirclesPaint"
      />
      <LineLayer
        key="highlight-lines-layer"
        id="highlight-lines"
        :source="{ type: 'geojson', data: highlightLinesSource }"
        :paint="highlightLinesPaint"
      />

      <!-- Popup -->
      <MapPopup
        v-if="currentPopupFeature && popupLngLat"
        :lng-lat="popupLngLat"
        :html="popupHtml"
        :close-on-click="false"
        :show-navigation="popupFeatures.length > 1"
        :current-feature-index="currentFeatureIndex"
        :total-features="popupFeatures.length"
        :layer-name="currentPopupFeature.layerTitle"
        @close="closePopup"
        @next="goToNextFeature"
        @previous="goToPreviousFeature"
      />
    </MapComponent>
  </div>
</template>

<style scoped>
.map-panel {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
