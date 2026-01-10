<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Map, CircleLayer, FillLayer, LineLayer, MapPopup, DrawTool } from "@phila/phila-ui-map-core";
import type { LngLatLike } from "maplibre-gl";

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
const mapRef = ref<InstanceType<typeof Map> | null>(null);

function onZoomChange(zoom: number) {
  emit("zoom", zoom);
}

// ============================================================================
// DATA FETCHING
// ============================================================================

// Helper to fetch all features from ArcGIS FeatureServer with pagination
async function fetchAllFeatures(url: string, where?: string): Promise<GeoJSON.FeatureCollection> {
  const whereClause = encodeURIComponent(where || "1=1");
  const pageSize = 2000;
  let offset = 0;
  let allFeatures: GeoJSON.Feature[] = [];
  let hasMore = true;

  while (hasMore) {
    const queryUrl = `${url}/query?where=${whereClause}&outFields=*&returnGeometry=true&resultRecordCount=${pageSize}&resultOffset=${offset}&f=geojson`;
    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as GeoJSON.FeatureCollection;

    if (data.features && data.features.length > 0) {
      allFeatures = allFeatures.concat(data.features);
      offset += data.features.length;
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

// Helper to convert ArcGIS FeatureServer URL to GeoJSON source
function createEsriSource(url: string, where?: string) {
  const whereClause = encodeURIComponent(where || "1=1");
  return {
    type: "geojson" as const,
    data: `${url}/query?where=${whereClause}&outFields=*&returnGeometry=true&f=geojson`,
  };
}

// Store for pre-fetched paginated data (keyed by layer id)
const paginatedData = ref<Record<string, GeoJSON.FeatureCollection>>({});

// Layers that need pagination (more than 2000 features)
const PAGINATED_LAYER_IDS = ["bike-network"];

// Layers that use spatial filtering (query by map bounds)
const SPATIAL_LAYER_IDS = ["zoning-base-districts"];

// Store for spatially-filtered data (keyed by layer id)
const spatialData = ref<Record<string, GeoJSON.FeatureCollection>>({});

// Current map bounds (updated on moveend)
const currentBounds = ref<Bounds | null>(null);

// Helper to fetch features within a bounding box from ArcGIS FeatureServer
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

  const queryUrl = `${url}/query?where=${whereClause}&geometry=${encodeURIComponent(geometry)}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=geojson`;

  const response = await fetch(queryUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as GeoJSON.FeatureCollection;
  return data;
}

// Fetch spatial layers when bounds change
async function fetchSpatialLayers(bounds: Bounds) {
  for (const { config } of props.layerList) {
    if (SPATIAL_LAYER_IDS.includes(config.id) && props.visibleLayers.has(config.id)) {
      emit("layerLoading", config.id, true);
      try {
        const data = await fetchFeaturesInBounds(config.url, bounds, config.where);
        spatialData.value = { ...spatialData.value, [config.id]: data };
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
  fetchSpatialLayers(data.bounds);
}

// Handle map load event - get initial bounds and zoom
function onMapLoad(map: any) {
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

  // Fetch any spatial layers that are already visible
  fetchSpatialLayers(currentBounds.value);
}

// Watch for visibility changes on spatial layers - fetch if turned on and we have bounds
watch(
  () => props.visibleLayers,
  (newVisible) => {
    if (currentBounds.value) {
      for (const layerId of SPATIAL_LAYER_IDS) {
        if (newVisible.has(layerId) && !spatialData.value[layerId]) {
          // Layer was just turned on and we don't have data yet
          fetchSpatialLayers(currentBounds.value);
          break;
        }
      }
    }
  },
  { deep: true }
);

// Fetch paginated layers on mount
onMounted(async () => {
  for (const { config } of props.layerList) {
    if (PAGINATED_LAYER_IDS.includes(config.id)) {
      emit("layerLoading", config.id, true);
      try {
        const data = await fetchAllFeatures(config.url, config.where);
        paginatedData.value = { ...paginatedData.value, [config.id]: data };
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
});

// ============================================================================
// LAYER FILTERING BY TYPE
// ============================================================================
function isVisible(layerId: string) {
  return props.visibleLayers.has(layerId);
}

// Check if layer has source ready (paginated/spatial layers need data loaded first)
function hasSourceReady(layer: any): boolean {
  if (PAGINATED_LAYER_IDS.includes(layer.id)) {
    return !!paginatedData.value[layer.id];
  }
  if (SPATIAL_LAYER_IDS.includes(layer.id)) {
    return !!spatialData.value[layer.id];
  }
  return true;
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
  // Check if this layer uses paginated data
  if (PAGINATED_LAYER_IDS.includes(layer.id)) {
    const data = paginatedData.value[layer.id];
    // Data should always exist here because we filter with hasSourceReady()
    return { type: "geojson" as const, data: data! };
  }
  // Check if this layer uses spatial data
  if (SPATIAL_LAYER_IDS.includes(layer.id)) {
    const data = spatialData.value[layer.id];
    // Data should always exist here because we filter with hasSourceReady()
    return { type: "geojson" as const, data: data! };
  }
  // Default: create Esri source
  return createEsriSource(layer.url, layer.where);
}

function getLayerOpacity(layerId: string): number {
  return props.layerOpacities[layerId] ?? 1;
}

function getDynamicPaint(layer: any) {
  const opacity = getLayerOpacity(layer.id);
  const opacityKey =
    layer.type === "circle" ? "circle-opacity" :
    layer.type === "fill" ? "fill-opacity" :
    "line-opacity";
  return { ...layer.paint, [opacityKey]: opacity };
}

function getOutlinePaint(layer: any) {
  const opacity = getLayerOpacity(layer.id);
  return { ...layer.outlinePaint, "line-opacity": opacity };
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

// Handle layer click
function handleLayerClick(e: { features?: Array<{ properties?: Record<string, unknown>; geometry?: GeoJSON.Geometry }>; lngLat: { lng: number; lat: number } }, layerId: string) {
  const config = getLayerConfig(layerId);
  if (!config) return;

  const features = e.features || [];
  if (features.length === 0) return;

  const newFeatures: PopupFeature[] = features.map((feature: { properties?: Record<string, unknown>; geometry?: GeoJSON.Geometry }) => ({
    layerId: config.id,
    layerTitle: config.title,
    properties: feature.properties || {},
    popupConfig: config.popup,
  }));

  popupFeatures.value = newFeatures;
  currentFeatureIndex.value = 0;
  popupLngLat.value = [e.lngLat.lng, e.lngLat.lat];

  // Store selected feature for highlighting
  const firstFeature = features[0];
  if (firstFeature && firstFeature.geometry) {
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

// Close popup
function closePopup() {
  popupFeatures.value = [];
  popupLngLat.value = null;
  currentFeatureIndex.value = 0;

  // Clear selected feature highlight
  selectedFeature.value = null;
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

  if (popupFeatures.value.length > 1) {
    html += `<div class="popup-navigation">`;
    html += `<span class="popup-nav-info">${currentFeatureIndex.value + 1} of ${popupFeatures.value.length}</span>`;
    html += `</div>`;
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
const highlightCirclesPaint = {
  "circle-radius": ["get", "highlightRadius"],
  "circle-color": "#00FFFF",
  "circle-opacity": 0.8,
  "circle-stroke-width": 2,
  "circle-stroke-color": "#FFFFFF",
};

const highlightLinesPaint = {
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
</script>

<template>
  <div class="map-panel">
    <Map
      ref="mapRef"
      :basemap-change-controls="{ toggle: true, dropdown: true, position: 'top-right' }"
      :navigation-controls="{ position: 'bottom-right' }"
      :geolocation-control="{ position: 'bottom-right' }"
      :map-search-control="{ position: 'top-left' }"
      @zoom="onZoomChange"
      @click="closePopup"
      @moveend="onMoveEnd"
      @load="onMapLoad"
    >
      <!-- Draw Tool -->
      <DrawTool position="bottom-left" />

      <!-- Circle Layers -->
      <CircleLayer
        v-for="layer in visibleCircleLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        @click="(e) => handleLayerClick(e, layer.id)"
      />

      <!-- Fill Layers -->
      <FillLayer
        v-for="layer in visibleFillLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        @click="(e) => handleLayerClick(e, layer.id)"
      />

      <!-- Outline LineLayer for Fill Layers that have outlinePaint -->
      <LineLayer
        v-for="layer in visibleFillLayersWithOutline"
        :key="layer.id + '-outline'"
        :id="layer.id + '-outline'"
        :source="getSource(layer)"
        :paint="getOutlinePaint(layer)"
        :minzoom="layer.minZoom"
        @click="(e) => handleLayerClick(e, layer.id)"
      />

      <!-- Line Layers -->
      <LineLayer
        v-for="layer in visibleLineLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        @click="(e) => handleLayerClick(e, layer.id)"
      />

      <!-- Highlight Layers - Rendered on top of all feature layers to show selected features -->
      <CircleLayer
        id="highlight-circles"
        :source="{ type: 'geojson', data: highlightCirclesSource }"
        :paint="highlightCirclesPaint"
      />
      <LineLayer
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
        @close="closePopup"
      />
    </Map>
  </div>
</template>

<style scoped>
.map-panel {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
