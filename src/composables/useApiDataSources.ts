/**
 * useApiDataSources.ts - Composable for fetching data from external APIs
 *
 * Used by topic components to display dynamic content like notices, status, etc.
 * This is different from useDataSource which handles GeoJSON layer data.
 */

import { ref, readonly, onMounted, onUnmounted, computed, type Ref } from 'vue'
import type { DataSourceConfig, DataSourceState, DataSourcesState } from '@/types/dataSource'

/**
 * Composable for managing multiple API data sources.
 *
 * @example
 * ```typescript
 * const dataSources: DataSourceConfig[] = [
 *   { id: 'notices', url: 'https://api.example.com/notices', type: 'http-get' },
 *   { id: 'trashDay', url: 'https://api.example.com/trash', type: 'http-get' },
 * ]
 *
 * const { state, getData, refetch, isLoading } = useApiDataSources(dataSources)
 *
 * // Access data for a specific source
 * const notices = computed(() => state.value.notices?.data)
 * ```
 */
export function useApiDataSources(configs: DataSourceConfig[]) {
  // ============================================================================
  // STATE
  // ============================================================================

  /** State for all data sources, keyed by id */
  const state = ref<DataSourcesState>({})

  /** Polling interval IDs for cleanup */
  const pollingIntervals: Map<string, number> = new Map()

  // Initialize state for each data source
  for (const config of configs) {
    state.value[config.id] = {
      data: null,
      loading: false,
      error: null,
      lastFetched: null,
    }
  }

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Fetch data for a single data source
   */
  async function fetchDataSource(config: DataSourceConfig): Promise<void> {
    const id = config.id

    // Set loading state
    state.value = {
      ...state.value,
      [id]: {
        ...state.value[id],
        loading: true,
        error: null,
      },
    }

    try {
      let data: unknown

      if (config.type === 'http-get') {
        const response = await fetch(config.url, {
          method: 'GET',
          ...config.options,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        data = await response.json()
      } else if (config.type === 'http-post') {
        const response = await fetch(config.url, {
          method: 'POST',
          ...config.options,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        data = await response.json()
      } else if (config.type === 'esri') {
        // ESRI FeatureServer query
        const baseUrl = config.url.replace(/\/$/, '')
        const queryUrl = `${baseUrl}/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`

        const response = await fetch(queryUrl, config.options)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const esriData = await response.json()
        // Extract features array from ESRI response
        data = esriData.features?.map((f: { attributes: unknown }) => f.attributes) || []
      } else {
        throw new Error(`Unknown data source type: ${config.type}`)
      }

      // Apply transform if provided
      if (config.transform) {
        data = config.transform(data)
      }

      // Update state with success
      state.value = {
        ...state.value,
        [id]: {
          data,
          loading: false,
          error: null,
          lastFetched: Date.now(),
        },
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      console.error(`Failed to fetch data source "${id}":`, errorMessage)

      // Update state with error
      state.value = {
        ...state.value,
        [id]: {
          ...state.value[id],
          loading: false,
          error: errorMessage,
        },
      }
    }
  }

  /**
   * Fetch all data sources
   */
  async function fetchAll(): Promise<void> {
    await Promise.all(configs.map(config => fetchDataSource(config)))
  }

  /**
   * Refetch a specific data source by id
   */
  async function refetch(id: string): Promise<void> {
    const config = configs.find(c => c.id === id)
    if (config) {
      await fetchDataSource(config)
    } else {
      console.warn(`Data source "${id}" not found`)
    }
  }

  /**
   * Get data for a specific source (convenience method)
   */
  function getData<T = unknown>(id: string): T | null {
    return (state.value[id]?.data as T) ?? null
  }

  /**
   * Check if any data source is loading
   */
  const isLoading = computed(() => {
    return Object.values(state.value).some(s => s.loading)
  })

  /**
   * Check if a specific data source is loading
   */
  function isSourceLoading(id: string): boolean {
    return state.value[id]?.loading ?? false
  }

  /**
   * Get error for a specific source
   */
  function getError(id: string): string | null {
    return state.value[id]?.error ?? null
  }

  /**
   * Start polling for data sources that have pollInterval configured
   */
  function startPolling(): void {
    for (const config of configs) {
      if (config.pollInterval && config.pollInterval > 0) {
        const intervalId = window.setInterval(() => {
          fetchDataSource(config)
        }, config.pollInterval)
        pollingIntervals.set(config.id, intervalId)
      }
    }
  }

  /**
   * Stop all polling
   */
  function stopPolling(): void {
    for (const [, intervalId] of pollingIntervals) {
      window.clearInterval(intervalId)
    }
    pollingIntervals.clear()
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  // Fetch all data sources on mount
  onMounted(() => {
    fetchAll()
    startPolling()
  })

  // Stop polling on unmount
  onUnmounted(() => {
    stopPolling()
  })

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    /** Reactive state for all data sources */
    state: readonly(state) as Readonly<Ref<DataSourcesState>>,

    /** Whether any data source is currently loading */
    isLoading,

    /** Fetch all data sources */
    fetchAll,

    /** Refetch a specific data source by id */
    refetch,

    /** Get data for a specific source */
    getData,

    /** Check if a specific source is loading */
    isSourceLoading,

    /** Get error for a specific source */
    getError,

    /** Stop all polling (useful for cleanup) */
    stopPolling,
  }
}

/** Type for the return value of useApiDataSources */
export type UseApiDataSourcesReturn = ReturnType<typeof useApiDataSources>
