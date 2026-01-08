<script setup lang="ts">
import { ref, onMounted } from "vue";
import "maplibre-gl/dist/maplibre-gl.css";

import MapPanel from "./components/MapPanel.vue";
import LayerPanel from "./components/LayerPanel.vue";

// Import layer configs
import { layers } from "./layers";

// ============================================================================
// LAYER DEFINITIONS
// ============================================================================
// Build layerList from layers array, deriving component type from layer.type
const layerList = layers.map(config => ({
  config,
  component: config.type, // "circle", "fill", or "line"
}));

// ============================================================================
// SHARED STATE
// ============================================================================
const currentZoom = ref(12);
const searchQuery = ref("");
const visibleLayers = ref<Set<string>>(new Set());
const layerOpacities = ref<Record<string, number>>({});
const loadingLayers = ref<Set<string>>(new Set());
const layerErrors = ref<Record<string, string>>({});

// ============================================================================
// METADATA LOOKUP
// ============================================================================
// Maps layer URLs to their metadata page URLs (from Knack)
const layerMetadata = ref<Record<string, string>>({});

// Normalize URL for matching: remove query params, trailing slashes, and /query suffix
function normalizeUrl(url: string): string {
  let normalized = url.split("?")[0] || url; // Remove query params
  normalized = normalized.replace(/\/query$/, ""); // Remove /query suffix
  normalized = normalized.replace(/\/$/, ""); // Remove trailing slash
  return normalized.toLowerCase();
}

// Fetch metadata from Carto API and build lookup
async function fetchMetadata() {
  try {
    const apiUrl = "https://phl.carto.com/api/v2/sql?q=" + encodeURIComponent(
      "select url_text, COALESCE(representation, '') as representation " +
      "from phl.knack_metadata_reps_endpoints_join " +
      "WHERE ( format = 'API' OR format = 'GeoService' ) " +
      "AND url_text IS NOT null"
    );
    const response = await fetch(apiUrl);
    if (!response.ok) return;

    const data = await response.json();
    const lookup: Record<string, string> = {};

    // Build lookup from normalized URL to metadata page
    for (const row of data.rows || []) {
      if (row.url_text && row.representation) {
        const normalizedUrl = normalizeUrl(row.url_text);
        const metadataUrl = `https://metadata.phila.gov/#home/representationdetails/${row.representation}/`;
        lookup[normalizedUrl] = metadataUrl;
      }
    }

    layerMetadata.value = lookup;
  } catch (err) {
    console.error("Error fetching metadata:", err);
  }
}

onMounted(() => {
  fetchMetadata();
});

// ============================================================================
// MOBILE PANEL TOGGLE
// ============================================================================
const activePanel = ref<"layers" | "map">("map");

function togglePanel() {
  activePanel.value = activePanel.value === "layers" ? "map" : "layers";
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================
function onZoomChange(zoom: number) {
  currentZoom.value = zoom;
}

function toggleLayer(layerId: string) {
  if (visibleLayers.value.has(layerId)) {
    visibleLayers.value.delete(layerId);
  } else {
    visibleLayers.value.add(layerId);
  }
  visibleLayers.value = new Set(visibleLayers.value);
}

function setLayerOpacity(layerId: string, opacity: number) {
  layerOpacities.value = { ...layerOpacities.value, [layerId]: opacity };
}

function setLayerLoading(layerId: string, loading: boolean) {
  if (loading) {
    loadingLayers.value.add(layerId);
  } else {
    loadingLayers.value.delete(layerId);
  }
  loadingLayers.value = new Set(loadingLayers.value);
}

function setLayerError(layerId: string, error: string | null) {
  if (error) {
    layerErrors.value = { ...layerErrors.value, [layerId]: error };
  } else {
    const { [layerId]: _, ...rest } = layerErrors.value;
    layerErrors.value = rest;
  }
}

function updateSearch(query: string) {
  searchQuery.value = query;
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>OpenMaps</h1>
    </header>

    <div class="app-main">
      <div class="layer-panel-wrapper" :class="{ 'active': activePanel === 'layers' }">
        <LayerPanel
          :layer-list="layerList"
          :visible-layers="visibleLayers"
          :layer-opacities="layerOpacities"
          :loading-layers="loadingLayers"
          :layer-errors="layerErrors"
          :current-zoom="currentZoom"
          :search-query="searchQuery"
          :layer-metadata="layerMetadata"
          @toggle-layer="toggleLayer"
          @set-opacity="setLayerOpacity"
          @update-search="updateSearch"
        />
      </div>

      <div class="map-panel-wrapper" :class="{ 'active': activePanel === 'map' }">
        <MapPanel
          :visible-layers="visibleLayers"
          :layer-opacities="layerOpacities"
          :layer-list="layerList"
          @zoom="onZoomChange"
          @layer-loading="setLayerLoading"
          @layer-error="setLayerError"
        />
      </div>
    </div>

    <!-- Mobile toggle button -->
    <button class="mobile-toggle" @click="togglePanel">
      <span v-if="activePanel === 'map'">Layers</span>
      <span v-else>Map</span>
    </button>

    <footer class="app-footer">
      City of Philadelphia
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>

<!-- Popup styles (unscoped for MapLibre) -->
<style>
.popup-content {
  font-size: 14px;
  min-width: 200px;
}

.popup-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f4d90;
}

.popup-table {
  width: 100%;
  border-collapse: collapse;
}

.popup-table th,
.popup-table td {
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.popup-table th {
  font-weight: 600;
  color: #666;
  width: 40%;
}

.popup-table td {
  color: #333;
}

.popup-no-fields {
  color: #666;
  font-style: italic;
  margin: 8px 0;
}

.popup-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.popup-nav-info {
  font-size: 12px;
  color: #666;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.app-header {
  background-color: #0f4d90;
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
}

.app-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.app-main {
  display: flex;
  flex: 1;
  min-height: 0;
}

.layer-panel-wrapper {
  width: 30%;
  min-width: 280px;
  max-width: 400px;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
}

.map-panel-wrapper {
  flex: 1;
  position: relative;
}

.app-footer {
  background-color: #0f4d90;
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  font-size: 14px;
}

/* Mobile toggle button - hidden on desktop */
.mobile-toggle {
  display: none;
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #0f4d90;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.mobile-toggle:hover {
  background-color: #0d3d73;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .app-main {
    position: relative;
  }

  .layer-panel-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    z-index: 10;
    display: none;
    border-right: none;
  }

  .layer-panel-wrapper.active {
    display: block;
  }

  .map-panel-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }

  .map-panel-wrapper.active {
    display: block;
  }

  .mobile-toggle {
    display: block;
  }
}
</style>