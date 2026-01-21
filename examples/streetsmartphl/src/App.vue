<script setup lang="ts">
/**
 * StreetSmartPHL Example App
 *
 * Demonstrates custom sidebar usage with the Layerboard framework:
 * - Uses topic accordions instead of default flat layer panel
 * - Groups layers by topic (PickupPHL, PermitPHL, PavePHL, PlowPHL, SweepPHL)
 */

import { ref } from 'vue'
import Layerboard from '@/components/Layerboard.vue'
import TopicAccordion from '@/components/TopicAccordion.vue'
import LayerCheckboxSet from '@/components/LayerCheckboxSet.vue'
import CollectionDayLegend from './components/CollectionDayLegend.vue'
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"
import type { LayerConfig, LayerDisplayOptions, TiledLayerConfig } from '@/types/layer'

// ============================================================================
// LAYER DISPLAY OPTIONS
// ============================================================================
// Configure how layers appear in the sidebar (matching original StreetSmartPHL)
// Layers with shouldShowCheckbox: false are auto-controlled (no user checkbox)

const layerDisplayOptions: Record<string, LayerDisplayOptions> = {
  // PickupPHL - Sanitation visits layers have no checkbox (auto-controlled)
  'sanitation-visits-close': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
    layerNameChange: "Status of today's sanitation truck visits",
  },
  'sanitation-visits-intermediate': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  'sanitation-visits-far': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  // Note: 'collectionboundary' removed - it's an ArcGISMapServiceLayer, not queryable as GeoJSON
  // The boundary is rendered as part of the CollectionBoundaryPickupPHL__2026 tiled layer
}

// ============================================================================
// WEBMAP CONFIGURATION
// ============================================================================
// StreetSmartPHL WebMap ID (production - public)
const WEBMAP_ID = 'bf08ea4ce7194f68934a7150567151ae'

// ============================================================================
// TOPIC CONFIGURATION
// ============================================================================
// Define which layers belong to each topic
// These layer titles come from the actual StreetSmartPHL WebMap

// PickupPHL topic - Sanitation collection and visits
// Note: 'collectionboundary' was removed - it's an ArcGISMapServiceLayer, not a FeatureLayer
// The boundary outline is included in the CollectionBoundaryPickupPHL__2026 tiled layer
const pickupLayerIds = [
  'sanitation-visits-close',
  'sanitation-visits-intermediate',
  'sanitation-visits-far',
]

// Layers that auto-activate when topic opens (no user checkbox)
const pickupDefaultLayers = [
  'sanitation-visits-close',
  'sanitation-visits-intermediate',
  'sanitation-visits-far',
]

// PermitPHL topic - Street closure permits
const permitLayerIds = [
  'current-closures-points',
  'current-closures-segments',
  'future-closures-points',
  'future-closures-segments',
]

// PavePHL topic - Paving and road conditions
const paveLayerIds = [
  'streets-status-for-paving-season',
  'street-condition-index',
  'five-year-paving-plan',
  'highway-districts',
  'council-districts',
  'state-routes',
]

// PlowPHL topic - Snow removal and winter operations
const plowLayerIds = [
  'treated-street-status',
  'streets-not-treated-by-the-city',
]

// SweepPHL topic - Street sweeping
const sweepLayerIds = [
  'all-route-locations',
  'swept-streets',
  '2022-litter-index',
]

// ============================================================================
// TILED LAYERS CONFIGURATION
// ============================================================================
// ESRI MapServer tiled layers separate from WebMap feature layers
const tiledLayers: TiledLayerConfig[] = [
  {
    // Collection Day bands with day-of-week colors and dual-color labels (Fri/Tue)
    // Updated URL from WebMap bf08ea4ce7194f68934a7150567151ae (2026 version)
    id: 'collectionDay',
    title: 'Collection Day',
    url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CollectionBoundaryPickupPHL__2026/MapServer',
  },
  // PlowPHL tiled layers (for future implementation)
  // {
  //   id: 'plowTreatedStreetsStatus',
  //   title: 'Treated Street Status',
  //   url: 'https://plowphl-services.phila.gov/arcweb/rest/services/Projects/TreatedStatus/MapServer',
  // },
]

// ============================================================================
// CYCLOMEDIA CONFIGURATION
// ============================================================================
const cyclomediaConfig: CyclomediaConfig = {
  username: import.meta.env.VITE_CYCLOMEDIA_USERNAME || "",
  password: import.meta.env.VITE_CYCLOMEDIA_PASSWORD || "",
  apiKey: import.meta.env.VITE_CYCLOMEDIA_API_KEY || "",
  srs: "EPSG:4326",
  locale: "en-US",
}

// ============================================================================
// PICTOMETRY CONFIGURATION
// ============================================================================
const pictometryCredentials: PictometryCredentials = {
  clientId: import.meta.env.VITE_PICTOMETRY_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_PICTOMETRY_CLIENT_SECRET || "",
}

// ============================================================================
// DEFAULT TOPIC LAYERS MAP
// ============================================================================
// Maps topic ID to layers that auto-activate when that topic opens
const defaultTopicLayersMap: Record<string, string[]> = {
  pickup: pickupDefaultLayers,
  // Other topics can have default layers added here as needed
}

// ============================================================================
// DEFAULT TILED LAYERS MAP
// ============================================================================
// Maps topic ID to tiled layers that auto-activate when that topic opens
const defaultTiledLayersMap: Record<string, string[]> = {
  pickup: ['collectionDay'],
  // Other topics can have default tiled layers added here as needed
}

// ============================================================================
// TOPIC ACCORDION STATE
// ============================================================================
// No topic is open by default - user must click to expand
const expandedTopic = ref<string | null>(null)

// References to layer control functions from Layerboard slot
let setLayersVisibleFn: ((layerIds: string[], visible: boolean) => void) | null = null
let setTiledLayerVisibleFn: ((layerId: string, visible: boolean) => void) | null = null

function initLayerControls(
  setLayersVisible: (layerIds: string[], visible: boolean) => void,
  setTiledLayerVisible: (layerId: string, visible: boolean) => void
) {
  setLayersVisibleFn = setLayersVisible
  setTiledLayerVisibleFn = setTiledLayerVisible
}

function onTopicToggle(topicId: string, expanded: boolean) {
  // Get previous topic's default layers to turn off
  const previousTopic = expandedTopic.value
  const previousDefaultLayers = previousTopic ? defaultTopicLayersMap[previousTopic] || [] : []
  const previousDefaultTiledLayers = previousTopic ? defaultTiledLayersMap[previousTopic] || [] : []

  if (expanded) {
    // Opening a topic closes any other open topic
    expandedTopic.value = topicId

    // Turn off previous topic's default layers (feature layers)
    if (setLayersVisibleFn && previousDefaultLayers.length > 0 && previousTopic !== topicId) {
      setLayersVisibleFn(previousDefaultLayers, false)
    }

    // Turn off previous topic's default tiled layers
    if (setTiledLayerVisibleFn && previousDefaultTiledLayers.length > 0 && previousTopic !== topicId) {
      for (const tiledLayerId of previousDefaultTiledLayers) {
        setTiledLayerVisibleFn(tiledLayerId, false)
      }
    }

    // Turn on this topic's default layers (feature layers)
    const defaultLayers = defaultTopicLayersMap[topicId] || []
    if (setLayersVisibleFn && defaultLayers.length > 0) {
      setLayersVisibleFn(defaultLayers, true)
    }

    // Turn on this topic's default tiled layers
    const defaultTiledLayers = defaultTiledLayersMap[topicId] || []
    if (setTiledLayerVisibleFn && defaultTiledLayers.length > 0) {
      for (const tiledLayerId of defaultTiledLayers) {
        setTiledLayerVisibleFn(tiledLayerId, true)
      }
    }
  } else {
    // Closing the current topic
    expandedTopic.value = null

    // Turn off this topic's default layers (feature layers)
    const defaultLayers = defaultTopicLayersMap[topicId] || []
    if (setLayersVisibleFn && defaultLayers.length > 0) {
      setLayersVisibleFn(defaultLayers, false)
    }

    // Turn off this topic's default tiled layers
    const defaultTiledLayers = defaultTiledLayersMap[topicId] || []
    if (setTiledLayerVisibleFn && defaultTiledLayers.length > 0) {
      for (const tiledLayerId of defaultTiledLayers) {
        setTiledLayerVisibleFn(tiledLayerId, false)
      }
    }
  }
}

// ============================================================================
// HELPER - FILTER LAYERS BY TOPIC AND APPLY DISPLAY OPTIONS
// ============================================================================
function getLayersForTopic(
  layers: Array<{ config: LayerConfig; component: string }>,
  layerIds: string[]
): LayerConfig[] {
  return layers
    .filter(layer => layerIds.includes(layer.config.id))
    .map(layer => {
      // Apply display options if configured for this layer
      const displayOpts = layerDisplayOptions[layer.config.id]
      if (displayOpts) {
        return {
          ...layer.config,
          displayOptions: {
            ...layer.config.displayOptions,
            ...displayOpts,
          },
        }
      }
      return layer.config
    })
}
</script>

<template>
  <Layerboard
    title="StreetSmartPHL"
    subtitle="Streets Department Interactive Map"
    :web-map-id="WEBMAP_ID"
    theme-color="#2176d2"
    sidebar-width="30%"
    sidebar-label="Topics"
    :show-default-sidebar="false"
    :tiled-layers="tiledLayers"
    :cyclomedia-config="cyclomediaConfig"
    :pictometry-credentials="pictometryCredentials"
  >
    <!-- Custom sidebar with topic accordions -->
    <template #sidebar="{ layers, visibleLayers, layerOpacities, loadingLayers, layerErrors, currentZoom, toggleLayer, setLayersVisible, setTiledLayerVisible, setOpacity, visibleTiledLayers, toggleTiledLayer }">
      <!-- Initialize layer control functions -->
      <component :is="'div'" style="display:none" :ref="() => initLayerControls(setLayersVisible, setTiledLayerVisible)" />
      <div class="topics-container">
        <!-- PickupPHL Topic -->
        <TopicAccordion
          title="PickupPHL"
          icon="trash-alt"
          :expanded="expandedTopic === 'pickup'"
          :layer-ids="pickupLayerIds"
          @toggle="(expanded) => onTopicToggle('pickup', expanded)"
        >
          <!-- Collection Day tiled layer checkbox + legend -->
          <CollectionDayLegend
            :visible-tiled-layers="visibleTiledLayers"
            :toggle-tiled-layer="toggleTiledLayer"
          />
        </TopicAccordion>

        <!-- PermitPHL Topic -->
        <TopicAccordion
          title="PermitPHL"
          icon="scroll"
          :expanded="expandedTopic === 'permit'"
          :layer-ids="permitLayerIds"
          @toggle="(expanded) => onTopicToggle('permit', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, permitLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, permitLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- PavePHL Topic -->
        <TopicAccordion
          title="PavePHL"
          icon="road"
          :expanded="expandedTopic === 'pave'"
          :layer-ids="paveLayerIds"
          @toggle="(expanded) => onTopicToggle('pave', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, paveLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, paveLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- PlowPHL Topic -->
        <TopicAccordion
          title="PlowPHL"
          icon="snowflake"
          :expanded="expandedTopic === 'plow'"
          :layer-ids="plowLayerIds"
          @toggle="(expanded) => onTopicToggle('plow', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, plowLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, plowLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- SweepPHL Topic -->
        <TopicAccordion
          title="SweepPHL"
          icon="broom"
          :expanded="expandedTopic === 'sweep'"
          :layer-ids="sweepLayerIds"
          @toggle="(expanded) => onTopicToggle('sweep', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, sweepLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, sweepLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>
      </div>
    </template>

    <!-- Custom footer -->
    <template #footer>
      City of Philadelphia - Streets Department
    </template>
  </Layerboard>
</template>

<style scoped>
.topics-container {
  padding: 0;
}

.no-layers {
  padding: 12px 16px;
  color: #666;
  font-style: italic;
  font-size: 14px;
}
</style>
