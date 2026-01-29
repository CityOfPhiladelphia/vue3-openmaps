<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import {
  Map as MapComponent,
  CircleLayer,
  FillLayer,
  LineLayer,
  RasterLayer,
  MapPopup,
  DrawTool,
  MapMarker,
} from "@phila/phila-ui-map-core";
import type {
  CyclomediaConfig,
  PictometryCredentials,
  AisGeocodeResult,
} from "@phila/phila-ui-map-core";
import type { LngLatLike, CircleLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import bboxClip from "@turf/bbox-clip";
import type { TiledLayerConfig } from "@/types/layer";

// Bounds type for spatial queries
interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

// Control position type
type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Props from parent
const props = withDefaults(
  defineProps<{
    visibleLayers: Set<string>;
    layerOpacities: Record<string, number>;
    layerList: Array<{ config: any; component: string }>;
    // Tiled layer props
    tiledLayers?: TiledLayerConfig[];
    visibleTiledLayers?: Set<string>;
    tiledLayerOpacities?: Record<string, number>;
    // Imagery props
    cyclomediaConfig: CyclomediaConfig;
    pictometryCredentials: PictometryCredentials;
    // Map control positions
    basemapControlPosition?: ControlPosition;
    navigationControlPosition?: ControlPosition;
    geolocationControlPosition?: ControlPosition;
    searchControlPosition?: ControlPosition;
    drawControlPosition?: ControlPosition | null;
    cyclomediaButtonPosition?: ControlPosition;
    pictometryButtonPosition?: ControlPosition;
    initialZoom?: number;
    initialCenter?: [number, number];
  }>(),
  {
    basemapControlPosition: 'top-right',
    navigationControlPosition: 'bottom-right',
    geolocationControlPosition: 'bottom-right',
    searchControlPosition: 'top-left',
    drawControlPosition: 'bottom-left',
    cyclomediaButtonPosition: 'top-right',
    pictometryButtonPosition: 'top-right',
  }
);

// Emit events to parent
const emit = defineEmits<{
  (e: "zoom", zoom: number): void;
  (e: "layerLoading", layerId: string, loading: boolean): void;
  (e: "layerError", layerId: string, error: string | null): void;
}>();

// ============================================================================
// MAP REF & ZOOM/SCALE TRACKING
// ============================================================================
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null);
const mapInstance = ref<any>(null); // Store the actual MapLibre map instance

// Current map scale (calculated from zoom level and latitude)
// Scale is needed for ArcGIS MapServer scale-dependent rendering
const currentScale = ref<number>(0);

function onZoomChange(zoom: number) {
  emit("zoom", zoom);
  // Update scale when zoom changes
  if (mapInstance.value) {
    currentScale.value = calculateMapScale(mapInstance.value);
  }
}

/**
 * Calculate the map scale from zoom level and center latitude.
 * This formula matches how ArcGIS calculates scale for Web Mercator projection.
 * At the equator, zoom 0 = scale 559082264.028
 * Scale = 559082264.028 / 2^zoom * cos(latitude)
 */
function calculateMapScale(map: any): number {
  const zoom = map.getZoom();
  const center = map.getCenter();
  const latitude = center.lat;

  // Constants for Web Mercator scale calculation
  // At zoom 0, scale at equator is approximately 559,082,264
  const SCALE_AT_ZOOM_0 = 559082264.028;

  // Adjust for latitude (cos of latitude in radians)
  const latRadians = (latitude * Math.PI) / 180;
  const scale = SCALE_AT_ZOOM_0 * Math.cos(latRadians) / Math.pow(2, zoom);

  return scale;
}

// ============================================================================
// DATA FETCHING
// ============================================================================

// Store for layer data (keyed by layer id)
// All layers use spatial filtering with automatic pagination
const layerData = ref<Record<string, GeoJSON.FeatureCollection>>({});

// Current map bounds (updated on moveend)
const currentBounds = ref<Bounds | null>(null);

// Track which layers were visible in the previous render
// Used to determine which layers are newly visible and need fetching
const previouslyVisibleLayers = ref<Set<string>>(new Set());

// Layers with complex geometries that should be clipped to viewport bounds
// This reduces MapLibre's rendering workload by only rendering visible portions
const CLIP_TO_VIEWPORT_LAYER_IDS = ["fema-100-year-floodplain", "fema-500-year-floodplain"];

// Helper to fetch features within a bounding box from ArcGIS FeatureServer
// Automatically paginates if more than 2000 features exist in the bounds
// For configured layers, clips geometries to viewport bounds to improve rendering performance
async function fetchFeaturesInBounds(
  url: string,
  bounds: Bounds,
  layerId: string,
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

  // Clip geometries to viewport bounds for configured layers
  // This reduces MapLibre's rendering workload - similar to how Leaflet only rendered visible portions
  if (CLIP_TO_VIEWPORT_LAYER_IDS.includes(layerId)) {
    const bboxArray: [number, number, number, number] = [bounds.west, bounds.south, bounds.east, bounds.north];

    allFeatures = allFeatures.map(feature => {
      // Only clip polygon geometries (the complex ones causing performance issues)
      if (feature.geometry &&
          (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
        try {
          // Clip the feature to the viewport bounds
          // Type assertion needed because we've already verified it's a Polygon or MultiPolygon
          const clipped = bboxClip(feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>, bboxArray);
          return clipped;
        } catch (err) {
          // If clipping fails, return the original feature
          console.warn(`Failed to clip feature in ${layerId}:`, err);
          return feature;
        }
      }
      // Return non-polygon features unchanged
      return feature;
    });
  }

  return {
    type: "FeatureCollection",
    features: allFeatures,
  };
}

// Fetch specific layers in parallel
// This is used to fetch only newly visible layers without re-fetching already loaded layers
async function fetchSpecificLayers(bounds: Bounds, layerIds: string[]) {
  // Build array of fetch promises for parallel loading
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

// Fetch all visible layers for the current bounds
// This delegates to fetchSpecificLayers for parallel loading
async function fetchLayers(bounds: Bounds) {
  const visibleIds = [...props.visibleLayers];
  await fetchSpecificLayers(bounds, visibleIds);
}

// Handle map moveend event
function onMoveEnd(data: { center: { lng: number; lat: number }; zoom: number; bounds: Bounds }) {
  currentBounds.value = data.bounds;
  fetchLayers(data.bounds);
}

// Handle map load event - get initial bounds, zoom, and scale
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

  // Calculate the initial map scale for scale-based layer switching
  currentScale.value = calculateMapScale(map);

  // Fetch any layers that are already visible
  fetchLayers(currentBounds.value);
}

// Watch for visibility changes - fetch only newly visible layers
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
      // Determine which layers are newly visible by comparing current vs previous visibility
      const currentVisibleIds = new Set(props.visibleLayers);
      const newlyVisibleIds = [...currentVisibleIds].filter(
        id => !previouslyVisibleLayers.value.has(id)
      );

      // Update the tracking set for next time
      previouslyVisibleLayers.value = new Set(currentVisibleIds);

      // Only fetch data for newly visible layers (not already-visible ones)
      if (newlyVisibleIds.length > 0) {
        await fetchSpecificLayers(currentBounds.value, newlyVisibleIds);
      }
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
// TILED LAYER HELPERS
// ============================================================================

// Check if a tiled layer is visible
function isTiledLayerVisible(layerId: string): boolean {
  return props.visibleTiledLayers?.has(layerId) ?? false;
}

// Get tiled layer opacity
function getTiledLayerOpacity(layerId: string): number {
  return props.tiledLayerOpacities?.[layerId] ?? 1;
}

// Convert ESRI MapServer URL to tile URL template for MapLibre
// ESRI tile services use {z}/{y}/{x} format
function getEsriTileUrl(baseUrl: string): string {
  // Remove trailing slash if present
  const url = baseUrl.replace(/\/$/, '');
  // ESRI MapServer tile endpoint pattern
  return `${url}/tile/{z}/{y}/{x}`;
}

// Get raster source configuration for a tiled layer
function getTiledLayerSource(layer: TiledLayerConfig) {
  return {
    type: 'raster' as const,
    tiles: [getEsriTileUrl(layer.url)],
    tileSize: 256,
    attribution: layer.attribution || '',
  };
}

// ============================================================================
// SCALE-BASED RENDERING FOR TILED LAYERS
// ============================================================================
// For layers with scaleBasedRendering enabled, we fetch scale thresholds
// from the MapServer and switch between tiled (zoomed out) and dynamic
// export rendering (zoomed in) based on the current map scale.

// Store for MapServer layer metadata (scale thresholds)
interface MapServerLayerInfo {
  minScale: number; // Layer is visible when scale > maxScale (zoomed out)
  maxScale: number; // Layer is visible when scale < minScale (zoomed in)
}
const mapServerMetadata = ref<Record<string, MapServerLayerInfo>>({});
const metadataFetchedFor = ref<Set<string>>(new Set());

/**
 * Fetch layer definition metadata from MapServer REST API.
 * This gets the minScale/maxScale thresholds that determine when
 * to switch between tiled and dynamic rendering.
 */
async function fetchMapServerMetadata(layer: TiledLayerConfig): Promise<void> {
  // Only fetch once per layer
  if (metadataFetchedFor.value.has(layer.id)) return;
  metadataFetchedFor.value.add(layer.id);

  try {
    const url = layer.url.replace(/\/$/, '');
    const response = await fetch(`${url}?f=json`);
    if (!response.ok) {
      console.warn(`[MapPanel] Failed to fetch metadata for ${layer.id}: ${response.status}`);
      return;
    }

    const data = await response.json();

    // Get the scale thresholds from the MapServer response
    // The "layers" array contains sublayer definitions with scale info
    // We use the service-level minScale/maxScale as the switch threshold
    // because it represents the bounds of the tiled cache
    let minScale = data.minScale || 0;
    let maxScale = data.maxScale || 0;

    // If service-level scales aren't set, look at the sublayers
    // Find the innermost (most zoomed in) layer's maxScale as our threshold
    if (data.layers && data.layers.length > 0) {
      // Find the sublayer with the smallest maxScale (most zoomed in threshold)
      // This is typically the "zoomed in" version of the layer
      for (const sublayer of data.layers) {
        if (sublayer.maxScale && sublayer.maxScale > 0) {
          if (maxScale === 0 || sublayer.maxScale < maxScale) {
            maxScale = sublayer.maxScale;
          }
        }
      }
    }

    // If we still don't have a threshold, use a sensible default
    // Scale ~72,000 corresponds to roughly zoom level 14
    if (maxScale === 0) {
      maxScale = 72000;
    }

    mapServerMetadata.value = {
      ...mapServerMetadata.value,
      [layer.id]: { minScale, maxScale },
    };

    console.log(`[MapPanel] Fetched scale metadata for ${layer.id}: minScale=${minScale}, maxScale=${maxScale}`);
  } catch (err) {
    console.warn(`[MapPanel] Error fetching metadata for ${layer.id}:`, err);
  }
}

// Fetch metadata for all scale-based tiled layers on mount
onMounted(() => {
  if (props.tiledLayers) {
    for (const layer of props.tiledLayers) {
      if (layer.scaleBasedRendering) {
        fetchMapServerMetadata(layer);
      }
    }
  }
});

/**
 * Determine if a scale-based layer should use tiled rendering (zoomed out)
 * or dynamic rendering (zoomed in) based on current map scale.
 *
 * Returns: 'tiled' | 'dynamic' | 'none'
 */
function getScaleBasedRenderMode(layer: TiledLayerConfig): 'tiled' | 'dynamic' | 'none' {
  if (!layer.scaleBasedRendering) {
    return 'tiled'; // Non-scale-based layers always use tiled
  }

  const metadata = mapServerMetadata.value[layer.id];
  if (!metadata) {
    // Metadata not yet loaded - default to tiled until we know better
    return 'tiled';
  }

  const scale = currentScale.value;
  if (scale === 0) {
    return 'tiled'; // Map not ready yet
  }

  // ArcGIS scale logic:
  // - minScale is the smallest scale (most zoomed out) at which the layer is visible
  // - maxScale is the largest scale (most zoomed in) at which the layer is visible
  // - When scale > metadata.maxScale, we're zoomed out -> use tiles
  // - When scale <= metadata.maxScale, we're zoomed in -> use dynamic
  if (scale > metadata.maxScale) {
    return 'tiled';
  } else {
    return 'dynamic';
  }
}

/**
 * Build the dynamic export URL for a MapServer layer.
 * This uses the /export endpoint which renders imagery on-demand at any scale.
 */
function getDynamicExportSource(layer: TiledLayerConfig, bounds: Bounds): { type: 'raster'; tiles: string[]; tileSize: number; attribution: string } {
  const url = layer.url.replace(/\/$/, '');

  // Build the export URL with the current bounds
  // We use 256x256 tiles to match the standard tile size
  const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
  const exportUrl = `${url}/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image`;

  return {
    type: 'raster' as const,
    tiles: [exportUrl],
    tileSize: 256,
    attribution: layer.attribution || '',
  };
}

// Get visible tiled layers that should use pre-rendered tiles
const visibleTiledLayersList = computed(() => {
  if (!props.tiledLayers) return [];
  return props.tiledLayers.filter(layer => {
    if (!isTiledLayerVisible(layer.id)) return false;

    // For scale-based layers, only include if we should use tiled mode
    if (layer.scaleBasedRendering) {
      return getScaleBasedRenderMode(layer) === 'tiled';
    }
    return true;
  });
});

// Get visible tiled layers that should use dynamic export rendering
const visibleDynamicExportLayersList = computed(() => {
  if (!props.tiledLayers) return [];
  return props.tiledLayers.filter(layer => {
    if (!isTiledLayerVisible(layer.id)) return false;

    // Only include scale-based layers that should use dynamic mode
    if (layer.scaleBasedRendering) {
      return getScaleBasedRenderMode(layer) === 'dynamic';
    }
    return false;
  });
});

/**
 * Get the dynamic export source for a layer.
 * This creates a raster source that uses the MapServer /export endpoint.
 */
function getDynamicExportLayerSource(layer: TiledLayerConfig) {
  const url = layer.url.replace(/\/$/, '');

  // Use MapLibre's built-in {bbox-epsg-3857} template for dynamic export
  // This automatically substitutes the current tile bounds in Web Mercator
  const exportUrl = `${url}/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image`;

  return {
    type: 'raster' as const,
    tiles: [exportUrl],
    tileSize: 256,
    attribution: layer.attribution || '',
  };
}

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
  // If the transformer set opacity to 1.0 AND the color has transparency,
  // it means the transformer intentionally moved opacity to the color channel
  // In this case, don't override with the slider's initial value
  const transformerSetOpacityToOne = paint[opacityKey] === 1.0;
  const colorHasAlpha = typeof color === 'string' && color.startsWith('rgba(');

  if (transformerSetOpacityToOne && colorHasAlpha) {
    // Transformer handled opacity via color alpha channel
    // Only apply slider if user has adjusted it (slider !== 1.0)
    if (sliderOpacity === 1.0) {
      // User hasn't adjusted slider, keep transformer's values
      return paint;
    } else {
      // User adjusted slider, apply it by multiplying with color alpha
      // Extract alpha from rgba and combine with slider
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match && match[4]) {
        const [, r, g, b, alpha] = match;
        const finalAlpha = parseFloat(alpha) * sliderOpacity;
        paint[colorKey] = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        paint[opacityKey] = 1.0;
      }
      return paint;
    }
  }

  // Standard case: slider controls opacity directly
  // Check if color has alpha channel (rgba format)
  // If so, extract the alpha and replace color with fully opaque version
  // This allows the slider to control the full 0-100% opacity range
  if (colorHasAlpha) {
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

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================
// Handles keyboard shortcuts when popup is visible:
// - Arrow Left/Up: previous feature
// - Arrow Right/Down: next feature
// - Escape: close popup

function handleKeyDown(event: KeyboardEvent) {
  // Only handle keys when popup is visible
  if (popupFeatures.value.length === 0) return;

  // Don't interfere with text input fields
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  switch (event.key) {
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
      event.preventDefault();
      closePopup();
      break;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

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

// ============================================================================
// SEARCH RESULT MARKER
// ============================================================================
// Displays a marker pin at the searched address location.
// The marker moves (not accumulates) when a new search is performed.

const searchMarkerLngLat = ref<[number, number] | null>(null);

/**
 * Handle search result from MapSearchControl.
 * Updates the search marker to show the searched location.
 */
function handleSearchResult(result: AisGeocodeResult) {
  const [lng, lat] = result.geometry.coordinates;
  searchMarkerLngLat.value = [lng, lat];
}
</script>

<template>
  <div class="map-panel">
    <MapComponent
      ref="mapRef"
      :zoom="props.initialZoom"
      :center="props.initialCenter"
      :navigation-controls="{ position: props.navigationControlPosition }"
      :geolocation-control="{ position: props.geolocationControlPosition }"
      :basemap-change-controls="{ toggle: true, dropdown: true, position: props.basemapControlPosition }"
      :map-search-control="{ position: props.searchControlPosition }"
      :enable-cyclomedia="true"
      :cyclomedia-config="props.cyclomediaConfig"
      :cyclomedia-button-position="props.cyclomediaButtonPosition"
      :enable-pictometry="true"
      :pictometry-credentials="props.pictometryCredentials"
      :pictometry-button-position="props.pictometryButtonPosition"
      tool-panel-layout="vertical"
      :tool-panel-split-ratio="50"
      @zoom="onZoomChange"
      @click="closePopup"
      @moveend="onMoveEnd"
      @load="onMapLoad"
      @search-result="handleSearchResult"
    >
      <!-- Draw Tool - only render if position is not null -->
      <DrawTool v-if="props.drawControlPosition !== null" :position="props.drawControlPosition" />

      <!-- Tiled Layers (ESRI MapServer pre-rendered tiles) - for zoomed out views -->
      <RasterLayer
        v-for="tiledLayer in visibleTiledLayersList"
        :key="'tiled-' + tiledLayer.id"
        :id="'tiled-' + tiledLayer.id"
        :source="getTiledLayerSource(tiledLayer)"
        :paint="{ 'raster-opacity': getTiledLayerOpacity(tiledLayer.id) }"
        :minzoom="tiledLayer.minZoom"
        :maxzoom="tiledLayer.maxZoom"
      />

      <!-- Dynamic Export Layers (ESRI MapServer /export endpoint) - for zoomed in views -->
      <!-- These render on-demand at any scale, providing sharp imagery when zoomed in -->
      <RasterLayer
        v-for="dynamicLayer in visibleDynamicExportLayersList"
        :key="'dynamic-' + dynamicLayer.id"
        :id="'dynamic-' + dynamicLayer.id"
        :source="getDynamicExportLayerSource(dynamicLayer)"
        :paint="{ 'raster-opacity': getTiledLayerOpacity(dynamicLayer.id) }"
        :minzoom="dynamicLayer.minZoom"
        :maxzoom="dynamicLayer.maxZoom"
      />

      <!-- Circle Layers - positioned before highlight layers -->
      <CircleLayer
        v-for="layer in visibleCircleLayers"
        :key="layer.id"
        :id="layer.id"
        :source="getSource(layer)"
        :paint="getDynamicPaint(layer)"
        :minzoom="layer.minZoom"
        :maxzoom="layer.maxZoom"
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
        :maxzoom="layer.maxZoom"
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
        :maxzoom="layer.maxZoom"
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
        :maxzoom="layer.maxZoom"
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

      <!-- Search Result Marker - Shows a pin at the searched address -->
      <MapMarker
        :lng-lat="searchMarkerLngLat"
        color="#2176d2"
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
