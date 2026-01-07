<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, CircleLayer, FillLayer, LineLayer } from "@phila/phila-ui-map-core";
import "maplibre-gl/dist/maplibre-gl.css";

// Import layer configs
import { athleticFieldsTracksAndCourts } from "./layers/athletic-fields-tracks-and-courts";
import { schools } from "./layers/schools";
import { policeDistricts } from "./layers/police-districts";
import { bikeNetwork } from "./layers/bike-network";
import { zoningBaseDistricts } from "./layers/zoning-base-districts";

// Helper to convert ArcGIS FeatureServer URL to GeoJSON source
function createEsriSource(url: string, where?: string) {
  const whereClause = encodeURIComponent(where || "1=1");
  return {
    type: "geojson" as const,
    data: `${url}/query?where=${whereClause}&outFields=*&f=geojson`,
  };
}

// Layer visibility state
const visibleLayers = ref<Set<string>>(new Set());

function toggleLayer(layerId: string) {
  if (visibleLayers.value.has(layerId)) {
    visibleLayers.value.delete(layerId);
  } else {
    visibleLayers.value.add(layerId);
  }
  // Trigger reactivity
  visibleLayers.value = new Set(visibleLayers.value);
}

function isVisible(layerId: string) {
  return visibleLayers.value.has(layerId);
}

// Layer definitions for the sidebar
const layerList = [
  { config: athleticFieldsTracksAndCourts, component: "circle" },
  { config: schools, component: "circle" },
  { config: policeDistricts, component: "fill" },
  { config: bikeNetwork, component: "line" },
  { config: zoningBaseDistricts, component: "fill" },
];

// Pre-compute sources (using where clause from layer config if present)
const sources = {
  athleticFields: computed(() => createEsriSource(athleticFieldsTracksAndCourts.url, athleticFieldsTracksAndCourts.where)),
  schools: computed(() => createEsriSource(schools.url, (schools as any).where)),
  policeDistricts: computed(() => createEsriSource(policeDistricts.url, (policeDistricts as any).where)),
  bikeNetwork: computed(() => createEsriSource(bikeNetwork.url, (bikeNetwork as any).where)),
  zoningBaseDistricts: computed(() => createEsriSource(zoningBaseDistricts.url, (zoningBaseDistricts as any).where)),
};
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>OpenMaps</h1>
    </header>

    <div class="app-main">
      <aside class="left-panel">
        <div class="layer-list">
          <label
            v-for="layer in layerList"
            :key="layer.config.id"
            class="layer-checkbox"
          >
            <input
              type="checkbox"
              :checked="isVisible(layer.config.id)"
              @change="toggleLayer(layer.config.id)"
            />
            <span>{{ layer.config.title }}</span>
          </label>
        </div>
      </aside>

      <div class="map-container">
        <Map>
          <!-- Circle Layers -->
          <CircleLayer
            v-if="isVisible(athleticFieldsTracksAndCourts.id)"
            :id="athleticFieldsTracksAndCourts.id"
            :source="sources.athleticFields.value"
            :paint="athleticFieldsTracksAndCourts.paint"
          />
          <CircleLayer
            v-if="isVisible(schools.id)"
            :id="schools.id"
            :source="sources.schools.value"
            :paint="schools.paint"
          />

          <!-- Fill Layers -->
          <FillLayer
            v-if="isVisible(policeDistricts.id)"
            :id="policeDistricts.id"
            :source="sources.policeDistricts.value"
            :paint="policeDistricts.paint"
          />
          <FillLayer
            v-if="isVisible(zoningBaseDistricts.id)"
            :id="zoningBaseDistricts.id"
            :source="sources.zoningBaseDistricts.value"
            :paint="zoningBaseDistricts.paint"
          />

          <!-- Line Layers -->
          <LineLayer
            v-if="isVisible(bikeNetwork.id)"
            :id="bikeNetwork.id"
            :source="sources.bikeNetwork.value"
            :paint="bikeNetwork.paint"
          />
        </Map>
      </div>
    </div>

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

.left-panel {
  width: 30%;
  background-color: #fff;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
  overflow-y: auto;
}

.layer-list {
  padding: 16px;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}

.layer-checkbox:hover {
  background-color: #f5f5f5;
}

.layer-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.layer-checkbox span {
  line-height: 1.3;
}

.map-container {
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
</style>
