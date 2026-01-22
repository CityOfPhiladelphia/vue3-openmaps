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
import LayerRadioButtonSet from '@/components/LayerRadioButtonSet.vue'
import CollectionDayLegend from './components/CollectionDayLegend.vue'
import PlowDeploymentLegend from './components/PlowDeploymentLegend.vue'
import SweepLegend from './components/SweepLegend.vue'
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"
import { PhilaLink } from "@phila/phila-ui-link"
import type { LayerConfig, LayerDisplayOptions, TiledLayerConfig } from '@/types/layer'
import type { DataSourceConfig } from '@/types/dataSource'

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

  // PermitPHL - All layers have no opacity slider (matching original shouldShowSlider: false)
  'current-closures-points': {
    shouldShowSlider: false,
  },
  'current-closures-segments': {
    shouldShowSlider: false,
  },
  'future-closures-points': {
    shouldShowSlider: false,
  },
  'future-closures-segments': {
    shouldShowSlider: false,
  },

  // PavePHL - All layers have no opacity slider (matching original shouldShowSlider: false)
  'streets-status-for-paving-season': {
    shouldShowSlider: false,
  },
  'street-condition-index': {
    shouldShowSlider: false,
  },
  'five-year-paving-plan': {
    shouldShowSlider: false,
  },

  // SweepPHL - All layers controlled via SweepLegend component (no individual checkboxes)
  'all-route-locations': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  'swept-streets': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  '2022-litter-index': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  // Day-specific route layers (Mon-Thu)
  'monday-route-locations': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  'tuesday-route-locations': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  'wednesday-route-locations': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
  'thursday-route-locations': {
    shouldShowCheckbox: false,
    shouldShowSlider: false,
    shouldShowLegendBox: false,
  },
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
// Default layers that auto-activate when topic opens
const permitDefaultLayers = [
  'current-closures-points',
  'current-closures-segments',
]

// PermitPHL topic - All layer IDs
const permitLayerIds = [
  'current-closures-points',
  'current-closures-segments',
  'future-closures-points',
  'future-closures-segments',
]

// PavePHL topic - Paving and road conditions
// Default layer that auto-activates when topic opens
const paveDefaultLayers = [
  'streets-status-for-paving-season',
]

// PavePHL topic - All layer IDs
const paveLayerIds = [
  'streets-status-for-paving-season',
  'street-condition-index',
  'five-year-paving-plan',
  // Note: Highway Districts, Council Districts, State Routes commented out in original
]

// PlowPHL topic - Snow removal and winter operations
// Note: PlowPHL uses tiled layers from external MapServer, not WebMap feature layers
// The layers shown depend on the current deployment type from the storms API
const plowLayerIds: string[] = []

// SweepPHL topic - Street sweeping
// Layer IDs are kebab-cased versions of WebMap layer titles (after removing group prefix)
const sweepLayerIds = [
  'all-route-locations',
  'swept-streets',
  '2022-litter-index',
  'monday-route-locations',
  'tuesday-route-locations',
  'wednesday-route-locations',
  'thursday-route-locations',
]

// ============================================================================
// TILED LAYERS CONFIGURATION
// ============================================================================
// ESRI MapServer tiled layers separate from WebMap feature layers
const tiledLayers: TiledLayerConfig[] = [
  // PickupPHL - Collection Day bands with day-of-week colors
  {
    id: 'collectionDay',
    title: 'Collection Day',
    url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CollectionBoundaryPickupPHL__2026/MapServer',
  },
  // PlowPHL - Treated street status (time-based coloring)
  {
    id: 'plowTreatedStreetsStatus',
    title: 'Treated Street Status',
    url: 'https://streetsgis.phila.gov/arcgis/rest/services/PlowPHL/TreatedStatus/MapServer',
  },
  // PlowPHL - Streets not treated by the city
  {
    id: 'plowNotTreatedStreets',
    title: 'Streets Not Treated by City',
    url: 'https://streetsgis.phila.gov/arcgis/rest/services/PlowPHL/NotTreatedCity/MapServer',
  },
  // PlowPHL - Streets not treated during conditional deployment
  {
    id: 'plowConditional',
    title: 'Streets Not Treated (Conditional)',
    url: 'https://streetsgis.phila.gov/arcgis/rest/services/PlowPHL/NotTreatedCond/MapServer',
  },
  // PlowPHL - Streets not treated during highways-only deployment
  {
    id: 'plowHighways',
    title: 'Streets Not Treated (Highways Only)',
    url: 'https://streetsgis.phila.gov/arcgis/rest/services/PlowPHL/NotTreatedHigh/MapServer',
  },
]

// ============================================================================
// DATA SOURCES CONFIGURATION
// ============================================================================
// External APIs for dynamic content (notices, trash status, etc.)
const dataSources: DataSourceConfig[] = [
  {
    id: 'notices',
    url: 'https://stsweb.phila.gov/StreetsCityWorks/api/Notice/getNotices',
    type: 'http-get',
  },
  {
    id: 'trashDay',
    url: 'https://admin.phila.gov/wp-json/closures/v1/closure/',
    type: 'http-get',
  },
  {
    // PlowPHL - Storm/deployment status
    id: 'storms',
    url: 'https://stsweb.phila.gov/StreetsCityWorks/api/Storm/getStorm',
    type: 'http-get',
  },
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
// Note: sweep is NOT included - SweepLegend component manages its own layer visibility
const defaultTopicLayersMap: Record<string, string[]> = {
  pickup: pickupDefaultLayers,
  permit: permitDefaultLayers,
  pave: paveDefaultLayers,
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
    // Sort by the order in layerIds array (preserves intended display order)
    .sort((a, b) => layerIds.indexOf(a.id) - layerIds.indexOf(b.id))
}

// ============================================================================
// DATA SOURCE HELPERS FOR PICKUPPHL
// ============================================================================

// Interface for notices data
interface Notice {
  Type: string
  Description: string
}

// Interface for trash day data
interface TrashDayData {
  status?: string
}

// Get pickup-specific notices from the notices data source
function getPickupNotice(dataSourcesState: Record<string, { data: unknown }>): string | null {
  const noticesData = dataSourcesState?.notices?.data as Notice[] | null
  if (!noticesData || !Array.isArray(noticesData)) return null

  const pickupNotices = noticesData.filter(
    (n) => n.Type?.toLowerCase() === 'pickupphl'
  )

  if (pickupNotices.length > 0) {
    return pickupNotices[0].Description
  }
  return null
}

// Get trash status message from trashDay data source
function getTrashStatusMessage(dataSourcesState: Record<string, { data: unknown }>): string {
  const trashData = dataSourcesState?.trashDay?.data as TrashDayData | null
  if (trashData?.status) {
    return trashData.status
  }
  return 'Loading collection status...'
}

// Get CSS class for trash status (normal vs warning)
function getTrashStatusClass(dataSourcesState: Record<string, { data: unknown }>): string {
  const message = getTrashStatusMessage(dataSourcesState)
  const isOnSchedule = message === 'Trash and recycling collections are on schedule.'
  return isOnSchedule ? 'trash-status--normal' : 'trash-status--warning'
}

// Get icon for trash status
function getTrashStatusIcon(dataSourcesState: Record<string, { data: unknown }>): string {
  const message = getTrashStatusMessage(dataSourcesState)
  const isOnSchedule = message === 'Trash and recycling collections are on schedule.'
  return isOnSchedule ? '✓' : '⚠️'
}

// ============================================================================
// DATA SOURCE HELPERS FOR PERMITPHL
// ============================================================================

// Get permit-specific notices from the notices data source
function getPermitNotice(dataSourcesState: Record<string, { data: unknown }>): string | null {
  const noticesData = dataSourcesState?.notices?.data as Notice[] | null
  if (!noticesData || !Array.isArray(noticesData)) return null

  const permitNotices = noticesData.filter(
    (n) => n.Type?.toLowerCase() === 'permitphl'
  )

  if (permitNotices.length > 0) {
    return permitNotices[0].Description
  }
  return null
}

// ============================================================================
// DATA SOURCE HELPERS FOR PAVEPHL
// ============================================================================

// Get pave-specific notices from the notices data source
function getPaveNotice(dataSourcesState: Record<string, { data: unknown }>): string | null {
  const noticesData = dataSourcesState?.notices?.data as Notice[] | null
  if (!noticesData || !Array.isArray(noticesData)) return null

  const paveNotices = noticesData.filter(
    (n) => n.Type?.toLowerCase() === 'pavephl'
  )

  if (paveNotices.length > 0) {
    return paveNotices[0].Description
  }
  return null
}

// ============================================================================
// DATA SOURCE HELPERS FOR SWEEPPHL
// ============================================================================

// Get sweep-specific notices from the notices data source
function getSweepNotice(dataSourcesState: Record<string, { data: unknown }>): string | null {
  const noticesData = dataSourcesState?.notices?.data as Notice[] | null
  if (!noticesData || !Array.isArray(noticesData)) return null

  const sweepNotices = noticesData.filter(
    (n) => n.Type?.toLowerCase() === 'sweepphl'
  )

  if (sweepNotices.length > 0) {
    return sweepNotices[0].Description
  }
  return null
}

// ============================================================================
// DATA SOURCE HELPERS FOR PLOWPHL
// ============================================================================

// Interface for storms data
interface StormsData {
  Deployment?: string
}

// Deployment type constants
const FULL_DEPLOYMENT = 'Full Deployment'
const CONDITIONAL_DEPLOYMENT = 'Conditional Deployment'
const HIGHWAYS_ONLY = 'Highways Only'

// Get plow-specific notices from the notices data source
function getPlowNotice(dataSourcesState: Record<string, { data: unknown }>): string | null {
  const noticesData = dataSourcesState?.notices?.data as Notice[] | null
  if (!noticesData || !Array.isArray(noticesData)) return null

  const plowNotices = noticesData.filter(
    (n) => n.Type?.toLowerCase() === 'plowphl'
  )

  if (plowNotices.length > 0) {
    return plowNotices[0].Description
  }
  return null
}

// Get current deployment type from storms data source
function getDeploymentType(dataSourcesState: Record<string, { data: unknown }>): string {
  const stormsData = dataSourcesState?.storms?.data as StormsData | null
  return stormsData?.Deployment || ''
}

// Check if there's an active snow event
function hasActiveSnowEvent(dataSourcesState: Record<string, { data: unknown }>): boolean {
  const deployment = getDeploymentType(dataSourcesState)
  return deployment === FULL_DEPLOYMENT ||
         deployment === CONDITIONAL_DEPLOYMENT ||
         deployment === HIGHWAYS_ONLY
}

// Get the tiled layers to show based on deployment type
function getPlowTiledLayersForDeployment(deploymentType: string): string[] {
  const layers: string[] = []

  if (deploymentType === FULL_DEPLOYMENT ||
      deploymentType === CONDITIONAL_DEPLOYMENT ||
      deploymentType === HIGHWAYS_ONLY) {
    // Always show treated streets and not treated by city during active deployment
    layers.push('plowTreatedStreetsStatus')
    layers.push('plowNotTreatedStreets')
  }

  if (deploymentType === CONDITIONAL_DEPLOYMENT) {
    layers.push('plowConditional')
  }

  if (deploymentType === HIGHWAYS_ONLY) {
    layers.push('plowHighways')
  }

  return layers
}
</script>

<template>
  <Layerboard
    title="StreetSmartPHL"
    subtitle="Streets Department Interactive Map"
    :web-map-id="WEBMAP_ID"
    theme-color="#0f4d90"
    sidebar-width="30%"
    sidebar-label="Topics"
    :show-default-sidebar="false"
    :initial-zoom="10"
    :initial-center="[-75.16, 40.0]"
    :tiled-layers="tiledLayers"
    :data-sources="dataSources"
    :cyclomedia-config="cyclomediaConfig"
    :pictometry-credentials="pictometryCredentials"
    search-control-position="top-left"
    basemap-control-position="bottom-left"
    navigation-control-position="bottom-left"
    geolocation-control-position="bottom-left"
    cyclomedia-button-position="bottom-left"
    pictometry-button-position="bottom-left"
    :draw-control-position="null"
  >
    <!-- Custom sidebar with topic accordions -->
    <template #sidebar="{ layers, visibleLayers, layerOpacities, loadingLayers, layerErrors, currentZoom, toggleLayer, setLayersVisible, setTiledLayerVisible, setOpacity, visibleTiledLayers, toggleTiledLayer, dataSourcesState, getDataSource }">
      <!-- Initialize layer control functions -->
      <component :is="'div'" style="display:none" :ref="() => initLayerControls(setLayersVisible, setTiledLayerVisible)" />
      <div class="topics-container">
        <!-- Intro paragraph -->
        <p class="intro-text">
          StreetSmartPHL is your portal for viewing information about Streets Department activities.
          Click to open any of the topics below. Select features on the map for detailed information.
        </p>
        <!-- PickupPHL Topic -->
        <TopicAccordion
          title="PickupPHL"
          icon="trash-alt"
          :expanded="expandedTopic === 'pickup'"
          :layer-ids="pickupLayerIds"
          @toggle="(expanded) => onTopicToggle('pickup', expanded)"
        >
          <!-- Topic intro paragraph -->
          <p class="topic-intro">
            See where trash and recycling trucks have visited today, and view where trash and recycling are collected each day of the week.
          </p>

          <!-- Disclaimer popover link -->
          <details class="disclaimer-details">
            <summary class="disclaimer-link">Read disclaimer</summary>
            <div class="disclaimer-content">
              <p>
                Disclaimer: The Streets Department is beta testing GPS technology.
                Outages and interruptions may occur. The Streets Department will
                do its best to notify the public if outages occur.
              </p>
              <p>
                Note: This technology processes data every 15 minutes. A visited
                status can take 15 to 45 minutes to appear on the map.
              </p>
            </div>
          </details>

          <!-- Notices alert (from notices data source) -->
          <div
            v-if="getPickupNotice(dataSourcesState)"
            class="notice-alert"
          >
            <span class="notice-icon">⚠️</span>
            <span v-html="getPickupNotice(dataSourcesState)"></span>
          </div>

          <!-- Trash Status (from trashDay data source) -->
          <div class="trash-status" :class="getTrashStatusClass(dataSourcesState)">
            <div class="trash-status-header">
              <span class="trash-status-icon">{{ getTrashStatusIcon(dataSourcesState) }}</span>
              <strong>Trash and recycling</strong>
            </div>
            <div class="trash-status-message" v-html="getTrashStatusMessage(dataSourcesState)"></div>
          </div>

          <!-- Collection Day tiled layer checkbox + legend -->
          <CollectionDayLegend
            :visible-tiled-layers="visibleTiledLayers"
            :toggle-tiled-layer="toggleTiledLayer"
          />

          <!-- Additional Information box -->
          <div class="info-box">
            <h4>Additional Information</h4>
            <p>
              Visit <a href="https://www.phila.gov/trashday/" target="_blank" rel="noopener">phila.gov/trashday</a> to find your trash day and to get service updates.
            </p>
            <p>
              <a href="https://www.phila.gov/311/form/Pages/default.aspx" target="_blank" rel="noopener">Submit a 311 request</a> to report an issue.
            </p>
          </div>
        </TopicAccordion>

        <!-- PermitPHL Topic -->
        <TopicAccordion
          title="PermitPHL"
          icon="scroll"
          :expanded="expandedTopic === 'permit'"
          :layer-ids="permitLayerIds"
          @toggle="(expanded) => onTopicToggle('permit', expanded)"
        >
          <!-- Topic intro paragraph -->
          <p class="topic-intro">
            View street and sidewalk closure permits.
          </p>

          <!-- Notices alert (from notices data source) -->
          <div
            v-if="getPermitNotice(dataSourcesState)"
            class="notice-alert"
          >
            <span class="notice-icon">⚠️</span>
            <span v-html="getPermitNotice(dataSourcesState)"></span>
          </div>

          <!-- Layer checkboxes -->
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, permitLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="false"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, permitLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>

          <!-- Additional Information box -->
          <div class="info-box">
            <h4>Additional Information</h4>
            <p>
              To apply for a permit, visit <a href="https://stsweb.phila.gov/streetclosure/" target="_blank" rel="noopener">streetclosure</a>
            </p>
            <p>
              To report a violation, <a href="http://iframe.publicstuff.com/#/?client_id=242&request_type_id=1012280" target="_blank" rel="noopener">submit a 311 request</a>
            </p>
            <p>
              Download FAQ doc <a href="http://stsweb.phila.gov/permitPHL/FAQ.pdf" target="_blank" rel="noopener">here</a>
            </p>
          </div>
        </TopicAccordion>

        <!-- PavePHL Topic -->
        <TopicAccordion
          title="PavePHL"
          icon="road"
          :expanded="expandedTopic === 'pave'"
          :layer-ids="paveLayerIds"
          @toggle="(expanded) => onTopicToggle('pave', expanded)"
        >
          <!-- Topic intro paragraph -->
          <p class="topic-intro">
            View status of paving operations.
          </p>

          <!-- Notices alert (from notices data source) -->
          <div
            v-if="getPaveNotice(dataSourcesState)"
            class="notice-alert"
          >
            <span class="notice-icon">⚠️</span>
            <span v-html="getPaveNotice(dataSourcesState)"></span>
          </div>

          <!-- Layer radio buttons (only one visible at a time) -->
          <LayerRadioButtonSet
            :layers="getLayersForTopic(layers, paveLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="false"
            :show-legend="true"
            group-name="pave-layers"
            @select-layer="(layerId, previousIds) => {
              // Turn off previous layers and turn on new one
              if (previousIds.length > 0) {
                setLayersVisible(previousIds, false)
              }
              setLayersVisible([layerId], true)
            }"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, paveLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>

          <!-- Paving Steps info box -->
          <div class="paving-steps-box">
            <h4>Paving Steps</h4>
            <div class="paving-step">
              <strong>Step 1 Milling</strong>
              <p>Milling is the process of grinding off the top layer of asphalt or surface of a roadway. This is usually done in preparation for paving. Contractors, will if needed, tow vehicles to a nearby street, so it is important to not park on a street that is about to be milled.</p>
            </div>
            <div class="paving-step">
              <strong>Step 2 Street Adjustments</strong>
              <p>After asphalt is milled off, utility manholes and castings are prepped and/or replaced by the contractor prior to performing the resurfacing operations on a project.</p>
            </div>
            <div class="paving-step">
              <strong>Step 3 Street Paving</strong>
              <p>City crews provide a new layer of asphalt surface on the streets to protect the underlying road structure and improve the quality of the ride. Residents are required to move their car during these workdays.</p>
            </div>
            <div class="paving-step">
              <strong>Step 4 Street Linestriping</strong>
              <p>The installation of placement markings and crosswalks is the final phase. Road surface markings are used on paved roadways to provide guidance and information to drivers and pedestrians. Striping is done over a series of days/weeks.</p>
            </div>
          </div>
        </TopicAccordion>

        <!-- PlowPHL Topic -->
        <TopicAccordion
          title="PlowPHL"
          icon="snowflake"
          :expanded="expandedTopic === 'plow'"
          :layer-ids="plowLayerIds"
          @toggle="(expanded) => {
            onTopicToggle('plow', expanded)
            // Auto-toggle plow tiled layers based on deployment type
            if (expanded) {
              const deploymentType = getDeploymentType(dataSourcesState)
              const plowLayers = getPlowTiledLayersForDeployment(deploymentType)
              for (const layerId of plowLayers) {
                setTiledLayerVisible(layerId, true)
              }
            } else {
              // Turn off all plow tiled layers when closing
              setTiledLayerVisible('plowTreatedStreetsStatus', false)
              setTiledLayerVisible('plowNotTreatedStreets', false)
              setTiledLayerVisible('plowConditional', false)
              setTiledLayerVisible('plowHighways', false)
            }
          }"
        >
          <!-- Topic intro paragraph -->
          <p class="topic-intro">
            View status of salting and plowing operations during a winter weather event.
          </p>

          <!-- Disclaimer popover link -->
          <details class="disclaimer-details">
            <summary class="disclaimer-link">Read disclaimer</summary>
            <div class="disclaimer-content">
              <p>
                Disclaimer: The Streets Department is beta testing GPS technology.
                Outages and interruptions may occur. The Streets Department will
                do its best to notify the public if outages occur.
              </p>
              <p>
                Note: This technology processes data every 15 minutes. A treated street
                status can take 15 to 45 minutes to appear on the map.
              </p>
            </div>
          </details>

          <!-- Notices alert (from notices data source) -->
          <div
            v-if="getPlowNotice(dataSourcesState)"
            class="notice-alert"
          >
            <span class="notice-icon">⚠️</span>
            <span v-html="getPlowNotice(dataSourcesState)"></span>
          </div>

          <!-- Deployment Status Banner -->
          <div class="deployment-status">
            <span v-if="hasActiveSnowEvent(dataSourcesState)">
              <a
                href="https://www.phila.gov/departments/department-of-streets/roadways/snow-events/#salting-and-plowing-operations"
                target="_blank"
                rel="noopener"
              >
                {{ getDeploymentType(dataSourcesState) }}
              </a>
            </span>
            <span v-else>
              There is no active Snow Event.
            </span>
            <span class="deployment-status-icon">!</span>
          </div>

          <!-- Plow Deployment Legend (only shown during active event) -->
          <PlowDeploymentLegend
            :deployment-type="getDeploymentType(dataSourcesState)"
          />

          <!-- Additional Information box -->
          <div class="info-box">
            <h4>Additional Information</h4>
            <p>
              Visit <a href="https://www.phila.gov/departments/department-of-streets/roadways/snow-events/" target="_blank" rel="noopener">phila.gov</a> to learn more about snow events.
            </p>
          </div>
        </TopicAccordion>

        <!-- SweepPHL Topic -->
        <TopicAccordion
          title="SweepPHL"
          icon="broom"
          :expanded="expandedTopic === 'sweep'"
          :layer-ids="sweepLayerIds"
          @toggle="(expanded) => {
            onTopicToggle('sweep', expanded)
            // SweepLegend manages layers when open, but we need to turn them all off when closing
            if (!expanded) {
              setLayersVisible(sweepLayerIds, false)
            }
          }"
        >
          <!-- Topic intro paragraph -->
          <p class="topic-intro">
            View status of Mechanical Street Sweep Operations.
          </p>

          <!-- Disclaimer popover link -->
          <details class="disclaimer-details">
            <summary class="disclaimer-link">Read disclaimer</summary>
            <div class="disclaimer-content">
              <p>
                Disclaimer: The Streets Department is beta testing GPS technology.
                Outages and interruptions may occur. The Streets Department will
                do its best to notify the public if outages occur.
              </p>
              <p>
                Note: This technology processes data every 15 minutes. A treated street
                status can take 15 to 45 minutes to appear on the map.
              </p>
            </div>
          </details>

          <!-- Notices alert (from notices data source) -->
          <div
            v-if="getSweepNotice(dataSourcesState)"
            class="notice-alert"
          >
            <span class="notice-icon">⚠️</span>
            <span v-html="getSweepNotice(dataSourcesState)"></span>
          </div>

          <!-- Sweep Legend with radio button layer selection -->
          <!-- v-if ensures SweepLegend mounts only when topic opens, not on app load -->
          <SweepLegend
            v-if="expandedTopic === 'sweep'"
            :visible-layer-ids="visibleLayers"
            :set-layers-visible="setLayersVisible"
          />
        </TopicAccordion>
      </div>
    </template>

    <!-- Custom footer -->
    <template #footer>
      <PhilaLink
        text="Feedback"
        href="https://phila.formstack.com/forms/streetsmartphl_feedback"
        target="_blank"
        variant="on-primary"
      />
    </template>
  </Layerboard>
</template>

<style scoped>
.topics-container {
  padding: 10px;
}

.intro-text {
  margin: 0 0 16px 0;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #444;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-style: italic;
}

.no-layers {
  padding: 12px 16px;
  color: #666;
  font-style: italic;
  font-size: 14px;
}

/* Topic intro paragraph */
.topic-intro {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

/* Disclaimer details/popover */
.disclaimer-details {
  margin-bottom: 12px;
}

.disclaimer-link {
  color: #0f4d90;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.disclaimer-link:hover {
  color: #21498b;
}

.disclaimer-content {
  margin-top: 8px;
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
  color: #555;
}

.disclaimer-content p {
  margin: 0 0 8px 0;
}

.disclaimer-content p:last-child {
  margin-bottom: 0;
}

/* Info box */
.info-box {
  margin-top: 16px;
  padding: 12px;
  background-color: #e8f4fd;
  border: 1px solid #b8d4e8;
  border-radius: 4px;
}

.info-box h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f4d90;
}

.info-box p {
  margin: 0 0 6px 0;
  font-size: 13px;
  line-height: 1.5;
}

.info-box p:last-child {
  margin-bottom: 0;
}

.info-box a {
  color: #0f4d90;
  text-decoration: underline;
}

.info-box a:hover {
  color: #21498b;
}

/* Notice alert */
.notice-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
  color: #856404;
}

.notice-icon {
  flex-shrink: 0;
}

/* Trash status */
.trash-status {
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.trash-status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
}

.trash-status-icon {
  font-size: 18px;
}

.trash-status-message {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
}

/* Normal status (on schedule) */
.trash-status--normal .trash-status-header {
  background-color: #d4edda;
  color: #155724;
}

.trash-status--normal .trash-status-icon {
  color: #28a745;
}

.trash-status--normal .trash-status-message {
  background-color: #f0f0f0;
}

/* Warning status (not on schedule) */
.trash-status--warning .trash-status-header {
  background-color: #f8d7da;
  color: #721c24;
}

.trash-status--warning .trash-status-icon {
  color: #dc3545;
}

.trash-status--warning .trash-status-message {
  background-color: #f0f0f0;
}

/* Paving steps box */
.paving-steps-box {
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.paving-steps-box h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.paving-step {
  margin-bottom: 12px;
}

.paving-step:last-child {
  margin-bottom: 0;
}

.paving-step strong {
  display: block;
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.paving-step p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #555;
}

/* Deployment status banner (PlowPHL) */
.deployment-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 12px;
  background-color: #fff8d8;
  border-left: 5px solid #ffed97;
  font-size: 14px;
  font-weight: 550;
  color: #4a4a4a;
}

.deployment-status a {
  color: #4a4a4a;
  text-decoration: underline;
}

.deployment-status a:hover {
  color: #21498b;
}

.deployment-status-icon {
  font-weight: bold;
  font-size: 16px;
}
</style>
