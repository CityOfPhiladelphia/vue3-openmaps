<script setup lang="ts">
/**
 * Layerboard.vue - Main framework component
 *
 * Provides the standard layout structure for all Layerboard applications:
 * - Header with title and optional subtitle
 * - Sidebar panel (LayerPanel by default, or custom via slot)
 * - Map panel with Cyclomedia/Pictometry support
 * - Footer
 * - Mobile toggle for responsive layout
 * - Loading and error states
 *
 * All layer state management is handled internally.
 */

import { ref, computed, onMounted, provide, readonly } from 'vue'
import "@phila/phila-ui-map-core/dist/assets/phila-ui-map-core.css"

import MapPanel from './MapPanel.vue'
import LayerPanel from './LayerPanel.vue'
import { Icon } from "@phila/phila-ui-core"
import { faCaretLeft, faCaretRight } from "@fortawesome/pro-solid-svg-icons"
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"

import { getLayerConfigs, clearCache } from '@/services/layerConfigService'
import type { LayerConfig, TiledLayerConfig, LayerStyleOverride } from '@/types/layer'
import type { DataSourceConfig } from '@/types/dataSource'
import { useApiDataSources } from '@/composables/useApiDataSources'

// ============================================================================
// PROPS
// ============================================================================

// Control position type for map controls
type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const props = withDefaults(
  defineProps<{
    /** App title displayed in header */
    title: string
    /** Optional subtitle displayed in header */
    subtitle?: string
    /** WebMap ID to load layers from */
    webMapId: string
    /** Primary theme color for header/footer (CSS color value) */
    themeColor?: string
    /** Cyclomedia street-level imagery configuration */
    cyclomediaConfig?: CyclomediaConfig
    /** Pictometry oblique imagery credentials */
    pictometryCredentials?: PictometryCredentials
    /** Whether to show the default LayerPanel in sidebar (set false when using sidebar slot) */
    showDefaultSidebar?: boolean
    /** Sidebar width in CSS units */
    sidebarWidth?: string
    /** Label for mobile toggle button when showing map */
    sidebarLabel?: string
    /** Label for mobile toggle button when showing sidebar */
    mapLabel?: string
    /** Whether to fetch metadata from Carto for layer info links */
    fetchMetadata?: boolean
    /** Tiled layer configurations (ESRI MapServer tiles separate from WebMap) */
    tiledLayers?: TiledLayerConfig[]
    /** API data source configurations for fetching external data (notices, status, etc.) */
    dataSources?: DataSourceConfig[]
    /** Layer style overrides - override paint/legend for specific layers by ID */
    layerStyleOverrides?: Record<string, LayerStyleOverride>
    /** Position of basemap toggle/dropdown control */
    basemapControlPosition?: ControlPosition
    /** Position of zoom in/out navigation control */
    navigationControlPosition?: ControlPosition
    /** Position of geolocation (find me) control */
    geolocationControlPosition?: ControlPosition
    /** Position of address search control */
    searchControlPosition?: ControlPosition
    /** Position of draw tool control (set to null to remove) */
    drawControlPosition?: ControlPosition | null
    /** Position of Cyclomedia street view button */
    cyclomediaButtonPosition?: ControlPosition
    /** Position of Pictometry oblique imagery button */
    pictometryButtonPosition?: ControlPosition
    /** Initial map zoom level */
    initialZoom?: number
    /** Initial map center [lng, lat] */
    initialCenter?: [number, number]
  }>(),
  {
    themeColor: '#0f4d90',
    showDefaultSidebar: true,
    sidebarWidth: '30%',
    sidebarLabel: 'Layers',
    mapLabel: 'Map',
    fetchMetadata: false,
    tiledLayers: () => [],
    dataSources: () => [],
    layerStyleOverrides: () => ({}),
    basemapControlPosition: 'top-right',
    navigationControlPosition: 'bottom-right',
    geolocationControlPosition: 'bottom-right',
    searchControlPosition: 'top-left',
    drawControlPosition: 'bottom-left',
    cyclomediaButtonPosition: 'top-right',
    pictometryButtonPosition: 'top-right',
  }
)

// ============================================================================
// EMITS
// ============================================================================
const emit = defineEmits<{
  /** Emitted when layer configs are loaded */
  (e: 'configs-loaded', configs: LayerConfig[]): void
  /** Emitted when loading fails */
  (e: 'load-error', error: string): void
  /** Emitted when zoom level changes */
  (e: 'zoom', zoom: number): void
}>()

// ============================================================================
// LAYER STATE
// ============================================================================
const layerList = ref<Array<{ config: LayerConfig; component: string }>>([])
const configsLoading = ref(true)
const configsError = ref<string | null>(null)

const currentZoom = ref(12)
const searchQuery = ref("")
const visibleLayers = ref<Set<string>>(new Set())
const layerOpacities = ref<Record<string, number>>({})
const loadingLayers = ref<Set<string>>(new Set())
const layerErrors = ref<Record<string, string>>({})

// Metadata lookup (for OpenMaps-style layer info links)
const layerMetadata = ref<Record<string, string>>({})

// ============================================================================
// TILED LAYER STATE
// ============================================================================
/** Set of currently visible tiled layer IDs */
const visibleTiledLayers = ref<Set<string>>(new Set())
/** Opacity values for tiled layers (0-1) */
const tiledLayerOpacities = ref<Record<string, number>>({})

// Initialize tiled layer opacities when props change
function initTiledLayerOpacities() {
  const opacities: Record<string, number> = {}
  for (const tiled of props.tiledLayers) {
    opacities[tiled.id] = tiled.opacity ?? 1.0
  }
  tiledLayerOpacities.value = opacities
}

// ============================================================================
// TILED LAYER METHODS
// ============================================================================
function toggleTiledLayer(layerId: string) {
  if (visibleTiledLayers.value.has(layerId)) {
    visibleTiledLayers.value.delete(layerId)
  } else {
    visibleTiledLayers.value.add(layerId)
  }
  visibleTiledLayers.value = new Set(visibleTiledLayers.value)
}

function setTiledLayerVisible(layerId: string, visible: boolean) {
  if (visible) {
    visibleTiledLayers.value.add(layerId)
  } else {
    visibleTiledLayers.value.delete(layerId)
  }
  visibleTiledLayers.value = new Set(visibleTiledLayers.value)
}

function setTiledLayerOpacity(layerId: string, opacity: number) {
  tiledLayerOpacities.value = { ...tiledLayerOpacities.value, [layerId]: opacity }
}

// ============================================================================
// API DATA SOURCES
// ============================================================================
// Initialize data sources composable (only if configs provided)
const dataSourcesComposable = props.dataSources.length > 0
  ? useApiDataSources(props.dataSources)
  : null

// Expose data source state and methods
const dataSourcesState = computed(() => dataSourcesComposable?.state.value ?? {})
const dataSourcesLoading = computed(() => dataSourcesComposable?.isLoading.value ?? false)

function getDataSourceData<T = unknown>(id: string): T | null {
  return dataSourcesComposable?.getData<T>(id) ?? null
}

function refetchDataSource(id: string): Promise<void> {
  return dataSourcesComposable?.refetch(id) ?? Promise.resolve()
}

// ============================================================================
// PROVIDE STATE TO CHILD COMPONENTS
// ============================================================================
// These are provided so custom sidebar content can access layer state
provide('layerboard-layers', readonly(layerList))
provide('layerboard-visible', visibleLayers)
provide('layerboard-opacities', layerOpacities)
provide('layerboard-loading', readonly(loadingLayers))
provide('layerboard-errors', readonly(layerErrors))
provide('layerboard-zoom', readonly(currentZoom))
provide('layerboard-toggle-layer', toggleLayer)
provide('layerboard-set-layer-visible', setLayerVisible)
provide('layerboard-set-layers-visible', setLayersVisible)
provide('layerboard-set-opacity', setLayerOpacity)
// Tiled layer state
provide('layerboard-tiled-layers', readonly(computed(() => props.tiledLayers)))
provide('layerboard-visible-tiled', visibleTiledLayers)
provide('layerboard-tiled-opacities', tiledLayerOpacities)
provide('layerboard-toggle-tiled', toggleTiledLayer)
provide('layerboard-set-tiled-opacity', setTiledLayerOpacity)
provide('layerboard-set-tiled-visible', setTiledLayerVisible)
// Data source state
provide('layerboard-data-sources-state', dataSourcesState)
provide('layerboard-data-sources-loading', dataSourcesLoading)
provide('layerboard-get-data-source', getDataSourceData)
provide('layerboard-refetch-data-source', refetchDataSource)

// ============================================================================
// COMPUTED
// ============================================================================
const headerStyle = computed(() => ({
  backgroundColor: props.themeColor,
}))

const footerStyle = computed(() => ({
  backgroundColor: props.themeColor,
}))

const mobileToggleStyle = computed(() => ({
  backgroundColor: props.themeColor,
}))

const sidebarStyle = computed(() => ({
  width: sidebarCollapsed.value ? '0' : props.sidebarWidth,
}))

// ============================================================================
// LAYER LOADING
// ============================================================================
async function loadLayerConfigs() {
  try {
    configsLoading.value = true
    configsError.value = null

    const configs = await getLayerConfigs(props.webMapId)

    // Apply layer style overrides if provided
    const overriddenConfigs = configs.map(config => {
      const override = props.layerStyleOverrides[config.id]
      if (override) {
        console.log(`[Layerboard] Applying style override for layer: ${config.id}`)
        return {
          ...config,
          paint: override.paint ?? config.paint,
          outlinePaint: override.outlinePaint ?? config.outlinePaint,
          legend: override.legend ?? config.legend,
          type: override.type ?? config.type,
        }
      }
      return config
    })

    // Build layerList from configs
    layerList.value = overriddenConfigs.map(config => ({
      config,
      component: config.type,
    }))

    // Initialize layer opacities
    const initialOpacities: Record<string, number> = {}
    overriddenConfigs.forEach(config => {
      initialOpacities[config.id] = config.opacity ?? 1.0
    })
    layerOpacities.value = initialOpacities

    console.log(`[Layerboard] Loaded ${overriddenConfigs.length} layer configs from WebMap ${props.webMapId}`)
    console.log('[Layerboard] Layer IDs:', overriddenConfigs.map(c => c.id))
    emit('configs-loaded', overriddenConfigs)
  } catch (error) {
    console.error('[Layerboard] Failed to load layer configs:', error)
    const errorMsg = error instanceof Error ? error.message : 'Failed to load layer configurations'
    configsError.value = errorMsg
    emit('load-error', errorMsg)
  } finally {
    configsLoading.value = false
  }
}

// ============================================================================
// METADATA LOADING (optional)
// ============================================================================
function normalizeUrl(url: string): string {
  let normalized = url.split("?")[0] || url
  normalized = normalized.replace(/\/query$/, "")
  normalized = normalized.replace(/\/$/, "")
  return normalized.toLowerCase()
}

async function fetchMetadataLookup() {
  if (!props.fetchMetadata) return

  try {
    const apiUrl = "https://phl.carto.com/api/v2/sql?q=" + encodeURIComponent(
      "select url_text, COALESCE(representation, '') as representation " +
      "from phl.knack_metadata_reps_endpoints_join " +
      "WHERE ( format = 'API' OR format = 'GeoService' ) " +
      "AND url_text IS NOT null"
    )
    const response = await fetch(apiUrl)
    if (!response.ok) return

    const data = await response.json()
    const lookup: Record<string, string> = {}

    for (const row of data.rows || []) {
      if (row.url_text && row.representation) {
        const normalizedUrl = normalizeUrl(row.url_text)
        const metadataUrl = `https://metadata.phila.gov/#home/representationdetails/${row.representation}/`
        lookup[normalizedUrl] = metadataUrl
      }
    }

    layerMetadata.value = lookup
  } catch (err) {
    console.error("[Layerboard] Error fetching metadata:", err)
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================
function onZoomChange(zoom: number) {
  currentZoom.value = zoom
  emit('zoom', zoom)
}

function toggleLayer(layerId: string) {
  if (visibleLayers.value.has(layerId)) {
    visibleLayers.value.delete(layerId)
  } else {
    visibleLayers.value.add(layerId)
  }
  visibleLayers.value = new Set(visibleLayers.value)
}

function setLayerVisible(layerId: string, visible: boolean) {
  if (visible) {
    visibleLayers.value.add(layerId)
  } else {
    visibleLayers.value.delete(layerId)
  }
  visibleLayers.value = new Set(visibleLayers.value)
}

function setLayersVisible(layerIds: string[], visible: boolean) {
  for (const layerId of layerIds) {
    if (visible) {
      visibleLayers.value.add(layerId)
    } else {
      visibleLayers.value.delete(layerId)
    }
  }
  visibleLayers.value = new Set(visibleLayers.value)
}

function setLayerOpacity(layerId: string, opacity: number) {
  layerOpacities.value = { ...layerOpacities.value, [layerId]: opacity }
}

function setLayerLoading(layerId: string, loading: boolean) {
  if (loading) {
    loadingLayers.value.add(layerId)
  } else {
    loadingLayers.value.delete(layerId)
  }
  loadingLayers.value = new Set(loadingLayers.value)
}

function setLayerError(layerId: string, error: string | null) {
  if (error) {
    layerErrors.value = { ...layerErrors.value, [layerId]: error }
  } else {
    const { [layerId]: _, ...rest } = layerErrors.value
    layerErrors.value = rest
  }
}

function updateSearch(query: string) {
  searchQuery.value = query
}

// ============================================================================
// MOBILE PANEL TOGGLE
// ============================================================================
const activePanel = ref<"sidebar" | "map">("map")

function togglePanel() {
  activePanel.value = activePanel.value === "sidebar" ? "map" : "sidebar"
}

// ============================================================================
// DESKTOP SIDEBAR COLLAPSE
// ============================================================================
const sidebarCollapsed = ref(false)

function toggleSidebarCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// ============================================================================
// EXPOSE API FOR PARENT COMPONENTS
// ============================================================================
defineExpose({
  /** Layer configurations */
  layerList,
  /** Set of visible layer IDs */
  visibleLayers,
  /** Layer opacity values */
  layerOpacities,
  /** Set of currently loading layer IDs */
  loadingLayers,
  /** Map of layer errors by ID */
  layerErrors,
  /** Current map zoom level */
  currentZoom,
  /** Toggle a layer's visibility */
  toggleLayer,
  /** Set a layer's visibility explicitly */
  setLayerVisible,
  /** Set multiple layers' visibility at once */
  setLayersVisible,
  /** Set a layer's opacity */
  setLayerOpacity,
  /** Reload layer configurations */
  reloadConfigs: loadLayerConfigs,
  /** Clear configuration cache */
  clearCache: () => clearCache(props.webMapId),
  // Tiled layer APIs
  /** Set of visible tiled layer IDs */
  visibleTiledLayers,
  /** Tiled layer opacity values */
  tiledLayerOpacities,
  /** Toggle a tiled layer's visibility */
  toggleTiledLayer,
  /** Set a tiled layer's visibility explicitly */
  setTiledLayerVisible,
  /** Set a tiled layer's opacity */
  setTiledLayerOpacity,
  // Data source APIs
  /** State of all data sources */
  dataSourcesState,
  /** Whether any data source is loading */
  dataSourcesLoading,
  /** Get data from a specific data source */
  getDataSourceData,
  /** Refetch a specific data source */
  refetchDataSource,
})

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(() => {
  loadLayerConfigs()
  fetchMetadataLookup()
  initTiledLayerOpacities()
})
</script>

<template>
  <div class="layerboard-layout">
    <!-- Header -->
    <header class="layerboard-header" :style="headerStyle">
      <slot name="header">
        <h1>{{ title }}</h1>
        <span v-if="subtitle" class="layerboard-subtitle">{{ subtitle }}</span>
      </slot>
    </header>

    <!-- Main content area -->
    <div class="layerboard-main">
      <!-- Loading state -->
      <div v-if="configsLoading" class="layerboard-loading">
        <div class="layerboard-spinner" :style="{ borderTopColor: themeColor }"></div>
        <p>Loading layer configurations...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="configsError" class="layerboard-error">
        <h2>Error Loading Layers</h2>
        <p>{{ configsError }}</p>
        <button
          class="layerboard-retry-button"
          :style="{ backgroundColor: themeColor }"
          @click="loadLayerConfigs"
        >
          Retry
        </button>
      </div>

      <!-- Normal app view -->
      <template v-else>
        <!-- Sidebar Panel -->
        <aside
          class="layerboard-sidebar"
          :class="{ 'is-active': activePanel === 'sidebar' }"
          :style="sidebarStyle"
        >
          <slot name="sidebar" :layers="layerList" :visible-layers="visibleLayers" :layer-opacities="layerOpacities" :loading-layers="loadingLayers" :layer-errors="layerErrors" :current-zoom="currentZoom" :toggle-layer="toggleLayer" :set-layer-visible="setLayerVisible" :set-layers-visible="setLayersVisible" :set-opacity="setLayerOpacity" :tiled-layers="tiledLayers" :visible-tiled-layers="visibleTiledLayers" :tiled-layer-opacities="tiledLayerOpacities" :toggle-tiled-layer="toggleTiledLayer" :set-tiled-layer-visible="setTiledLayerVisible" :set-tiled-layer-opacity="setTiledLayerOpacity" :data-sources-state="dataSourcesState" :data-sources-loading="dataSourcesLoading" :get-data-source="getDataSourceData" :refetch-data-source="refetchDataSource">
            <!-- Default: LayerPanel for flat layer list -->
            <LayerPanel
              v-if="showDefaultSidebar"
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
          </slot>
        </aside>

        <!-- Map Panel -->
        <div class="layerboard-map" :class="{ 'is-active': activePanel === 'map' }">
          <MapPanel
            :visible-layers="visibleLayers"
            :layer-opacities="layerOpacities"
            :layer-list="layerList"
            :tiled-layers="tiledLayers"
            :visible-tiled-layers="visibleTiledLayers"
            :tiled-layer-opacities="tiledLayerOpacities"
            :cyclomedia-config="cyclomediaConfig"
            :pictometry-credentials="pictometryCredentials"
            :basemap-control-position="basemapControlPosition"
            :navigation-control-position="navigationControlPosition"
            :geolocation-control-position="geolocationControlPosition"
            :search-control-position="searchControlPosition"
            :draw-control-position="drawControlPosition"
            :cyclomedia-button-position="cyclomediaButtonPosition"
            :pictometry-button-position="pictometryButtonPosition"
            :initial-zoom="initialZoom"
            :initial-center="initialCenter"
            @zoom="onZoomChange"
            @layer-loading="setLayerLoading"
            @layer-error="setLayerError"
          />
        </div>

        <!-- Desktop sidebar collapse toggle -->
        <button
          class="layerboard-sidebar-toggle"
          :class="{ 'is-collapsed': sidebarCollapsed }"
          :style="{ left: sidebarCollapsed ? '0' : props.sidebarWidth }"
          @click="toggleSidebarCollapse"
          aria-label="Toggle sidebar"
        >
          <Icon
            :icon-definition="sidebarCollapsed ? faCaretRight : faCaretLeft"
            size="medium"
            decorative
          />
        </button>
      </template>
    </div>

    <!-- Mobile toggle button -->
    <button
      class="layerboard-mobile-toggle"
      :style="mobileToggleStyle"
      @click="togglePanel"
    >
      <span v-if="activePanel === 'map'">{{ sidebarLabel }}</span>
      <span v-else>{{ mapLabel }}</span>
    </button>

    <!-- Footer -->
    <footer class="layerboard-footer" :style="footerStyle">
      <slot name="footer">
        City of Philadelphia
      </slot>
    </footer>
  </div>
</template>

<style>
/* Global reset for Layerboard app - ensures no scrollbars */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Reset for all children within layout */
.layerboard-layout * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<!-- Popup styles (unscoped for MapLibre) -->
<style>
/* Override the layerboard reset for popup navigation */
.popup-navigation-header {
  padding: 8px 12px !important;
  margin: -15px -15px 10px -15px !important;
}

.popup-layer-name {
  margin-bottom: 8px !important;
}

.popup-navigation-controls {
  gap: 8px !important;
}

.popup-nav-button {
  padding: 6px 12px !important;
}

.popup-content {
  font-size: 14px;
  min-width: 200px;
}

.popup-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f4d90;
}

.popup-table {
  width: 100%;
  border-collapse: collapse;
}

.popup-table th,
.popup-table td {
  padding: 4px 8px 4px 0;
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
.layerboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Header */
.layerboard-header {
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.layerboard-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.layerboard-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

/* Main content */
.layerboard-main {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

/* Sidebar */
.layerboard-sidebar {
  background-color: #fff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  flex-shrink: 0;
}

/* Map */
.layerboard-map {
  flex: 1;
  position: relative;
}

/* Footer */
.layerboard-footer {
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Mobile toggle button - hidden on desktop */
.layerboard-mobile-toggle {
  display: none;
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.layerboard-mobile-toggle:hover {
  filter: brightness(0.9);
}

/* Desktop sidebar collapse toggle - visible on desktop only */
.layerboard-sidebar-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
}

.layerboard-sidebar-toggle:hover {
  background-color: #f0f0f0;
}

/* Sidebar transition for smooth collapse */
.layerboard-sidebar {
  transition: width 0.3s ease;
  overflow: hidden;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .layerboard-main {
    position: relative;
  }

  .layerboard-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100%;
    z-index: 10;
    display: none;
    border-right: none;
  }

  .layerboard-sidebar.is-active {
    display: block;
  }

  .layerboard-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }

  .layerboard-map.is-active {
    display: block;
  }

  .layerboard-mobile-toggle {
    display: block;
  }

  .layerboard-sidebar-toggle {
    display: none;
  }
}

/* Loading state */
.layerboard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.layerboard-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0f4d90;
  border-radius: 50%;
  animation: layerboard-spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes layerboard-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.layerboard-loading p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Error state */
.layerboard-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.layerboard-error h2 {
  color: #d32f2f;
  font-size: 24px;
  margin-bottom: 16px;
}

.layerboard-error p {
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 500px;
}

.layerboard-retry-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.layerboard-retry-button:hover {
  filter: brightness(0.9);
}
</style>
