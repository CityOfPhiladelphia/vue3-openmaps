// useLayerboard.ts - Main framework composable
// Provides the primary interface for initializing and using vue3-layerboard

import { ref, readonly, computed } from 'vue'
import type { LayerboardConfig } from '@/types/config'
import type { LayerConfig } from '@/types/layer'
import { getLayerConfigs, buildWebMapUrl } from '@/services/layerConfigService'
import { transformWebMapToLayerConfigs, type EsriWebMap } from '@/utils/webmap-transformer'

/**
 * Main composable for initializing and managing the layerboard framework.
 *
 * @example
 * ```typescript
 * const {
 *   layerConfigs,
 *   visibleLayers,
 *   isLoading,
 *   error,
 *   toggleLayer,
 *   setLayerOpacity,
 *   filterLayers
 * } = useLayerboard({
 *   webMapId: '1596df70df0349e293ceec46a06ccc50',
 *   mode: 'dynamic',
 *   panelMode: 'flat'
 * })
 * ```
 */
export function useLayerboard(config: LayerboardConfig) {
  // ============================================================================
  // STATE
  // ============================================================================

  /** All layer configurations loaded from the WebMap */
  const layerConfigs = ref<LayerConfig[]>([])

  /** Set of currently visible layer IDs */
  const visibleLayers = ref<Set<string>>(new Set())

  /** Map of layer IDs to opacity values (0-1) */
  const layerOpacities = ref<Record<string, number>>({})

  /** Set of layer IDs currently being loaded */
  const loadingLayers = ref<Set<string>>(new Set())

  /** Map of layer IDs to error messages */
  const layerErrors = ref<Record<string, string>>({})

  /** Current search/filter query */
  const searchQuery = ref('')

  /** Whether layer configs are being loaded */
  const isLoading = ref(false)

  /** Whether the composable has been initialized */
  const isInitialized = ref(false)

  /** Error that occurred during initialization */
  const error = ref<Error | null>(null)

  // ============================================================================
  // COMPUTED
  // ============================================================================

  /** Layer configs filtered by search query */
  const filteredLayerConfigs = computed(() => {
    if (!searchQuery.value.trim()) {
      return layerConfigs.value
    }
    const query = searchQuery.value.toLowerCase()
    return layerConfigs.value.filter(layer =>
      layer.title.toLowerCase().includes(query)
    )
  })

  /** Layer configs formatted for LayerPanel component */
  const layerList = computed(() => {
    return layerConfigs.value.map(config => ({
      config,
      component: config.type // "circle", "fill", or "line"
    }))
  })

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Initialize the layerboard by loading layer configurations
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) {
      console.warn('[useLayerboard] Already initialized')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      let configs: LayerConfig[]

      if (config.mode === 'dynamic' || !config.mode) {
        // Dynamic mode: fetch from ArcGIS Online
        if (config.webMapId) {
          configs = await fetchLayerConfigs(config.webMapId)
        } else {
          // Use default service
          configs = await getLayerConfigs()
        }
      } else {
        // Static mode: use provided configs or fetch from service
        configs = await getLayerConfigs()
      }

      layerConfigs.value = configs

      // Initialize opacities from config defaults
      const initialOpacities: Record<string, number> = {}
      configs.forEach(layerConfig => {
        initialOpacities[layerConfig.id] = layerConfig.opacity ?? 1.0
      })
      layerOpacities.value = initialOpacities

      isInitialized.value = true

      console.log(`[useLayerboard] Initialized with ${configs.length} layers`)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to initialize layerboard')
      console.error('[useLayerboard] Initialization error:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch layer configs from a specific WebMap ID
   */
  async function fetchLayerConfigs(webMapId: string): Promise<LayerConfig[]> {
    const url = buildWebMapUrl(webMapId)
    console.log(`[useLayerboard] Fetching WebMap from: ${url}`)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch WebMap: ${response.status} ${response.statusText}`)
    }

    const webMapJson = await response.json() as EsriWebMap
    return transformWebMapToLayerConfigs(webMapJson)
  }

  /**
   * Toggle a layer's visibility
   */
  function toggleLayer(layerId: string): void {
    const newSet = new Set(visibleLayers.value)
    if (newSet.has(layerId)) {
      newSet.delete(layerId)
    } else {
      newSet.add(layerId)
    }
    visibleLayers.value = newSet
  }

  /**
   * Set a layer's opacity
   */
  function setLayerOpacity(layerId: string, opacity: number): void {
    layerOpacities.value = {
      ...layerOpacities.value,
      [layerId]: Math.max(0, Math.min(1, opacity))
    }
  }

  /**
   * Set the search/filter query
   */
  function filterLayers(query: string): void {
    searchQuery.value = query
  }

  /**
   * Set a layer's loading state
   */
  function setLayerLoading(layerId: string, loading: boolean): void {
    const newSet = new Set(loadingLayers.value)
    if (loading) {
      newSet.add(layerId)
    } else {
      newSet.delete(layerId)
    }
    loadingLayers.value = newSet
  }

  /**
   * Set a layer's error state
   */
  function setLayerError(layerId: string, errorMessage: string | null): void {
    if (errorMessage) {
      layerErrors.value = { ...layerErrors.value, [layerId]: errorMessage }
    } else {
      const { [layerId]: _, ...rest } = layerErrors.value
      layerErrors.value = rest
    }
  }

  /**
   * Reset all state to initial values
   */
  function reset(): void {
    layerConfigs.value = []
    visibleLayers.value = new Set()
    layerOpacities.value = {}
    loadingLayers.value = new Set()
    layerErrors.value = {}
    searchQuery.value = ''
    isLoading.value = false
    isInitialized.value = false
    error.value = null
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State (readonly)
    layerConfigs: readonly(layerConfigs),
    visibleLayers: readonly(visibleLayers),
    layerOpacities: readonly(layerOpacities),
    loadingLayers: readonly(loadingLayers),
    layerErrors: readonly(layerErrors),
    searchQuery: readonly(searchQuery),
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    error: readonly(error),

    // Computed
    filteredLayerConfigs,
    layerList,

    // Config
    config,

    // Methods
    initialize,
    toggleLayer,
    setLayerOpacity,
    filterLayers,
    setLayerLoading,
    setLayerError,
    reset,
  }
}

/** Type for the return value of useLayerboard */
export type UseLayerboardReturn = ReturnType<typeof useLayerboard>
