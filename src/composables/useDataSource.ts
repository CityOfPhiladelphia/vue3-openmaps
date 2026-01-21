// useDataSource.ts - Data fetching composable
// Handles fetching GeoJSON data from ArcGIS Feature Services

import { ref, readonly, watch, type Ref } from 'vue'

/**
 * Bounding box for spatial queries
 */
export interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

/**
 * Configuration for a data source
 */
export interface DataSourceConfig {
  /** ArcGIS FeatureServer URL */
  url: string
  /** Optional where clause for filtering features */
  where?: string
  /** Maximum features per request (default: 2000) */
  pageSize?: number
  /** Whether to clip geometries to viewport bounds */
  clipToViewport?: boolean
}

/**
 * Options for fetch operations
 */
export interface FetchOptions {
  /** Spatial bounds for the query */
  bounds?: Bounds
  /** Override where clause */
  where?: string
  /** Output spatial reference (default: 4326) */
  outSR?: number
}

/**
 * Composable for fetching data from ArcGIS Feature Services.
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetch } = useDataSource({
 *   url: 'https://services.arcgis.com/.../FeatureServer/0',
 *   where: "STATUS = 'Active'"
 * })
 *
 * // Fetch with spatial bounds
 * await fetch({ bounds: { north: 40, south: 39, east: -75, west: -76 } })
 * ```
 */
export function useDataSource(config: DataSourceConfig) {
  // ============================================================================
  // STATE
  // ============================================================================

  /** The fetched GeoJSON data */
  const data = ref<GeoJSON.FeatureCollection | null>(null)

  /** Whether a fetch is in progress */
  const isLoading = ref(false)

  /** Error from the last fetch attempt */
  const error = ref<Error | null>(null)

  /** Total features fetched (for pagination tracking) */
  const totalFeatures = ref(0)

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Fetch features from the ArcGIS FeatureServer.
   * Automatically paginates if more than pageSize features exist.
   */
  async function fetchFeatures(options: FetchOptions = {}): Promise<GeoJSON.FeatureCollection> {
    isLoading.value = true
    error.value = null

    const pageSize = config.pageSize || 2000
    let offset = 0
    let allFeatures: GeoJSON.Feature[] = []
    let hasMore = true

    try {
      // Fetch all features, paginating if necessary
      while (hasMore) {
        const baseUrl = config.url.replace(/\/$/, '')
        const whereClause = encodeURIComponent(options.where || config.where || '1=1')

        let queryUrl = `${baseUrl}/query?where=${whereClause}&outFields=*&returnGeometry=true&resultRecordCount=${pageSize}&resultOffset=${offset}&f=geojson`

        // Add spatial query parameters if bounds provided
        if (options.bounds) {
          const geometry = JSON.stringify({
            xmin: options.bounds.west,
            ymin: options.bounds.south,
            xmax: options.bounds.east,
            ymax: options.bounds.north,
            spatialReference: { wkid: 4326 },
          })
          queryUrl += `&geometry=${encodeURIComponent(geometry)}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects`
        }

        const response = await fetch(queryUrl)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const responseData = await response.json() as GeoJSON.FeatureCollection

        if (responseData.features && responseData.features.length > 0) {
          allFeatures = allFeatures.concat(responseData.features)
          offset += responseData.features.length
          // Continue if we got a full page (might be more)
          hasMore = responseData.features.length === pageSize
        } else {
          hasMore = false
        }
      }

      const result: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: allFeatures,
      }

      data.value = result
      totalFeatures.value = allFeatures.length

      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to fetch features')
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear the current data
   */
  function clear(): void {
    data.value = null
    totalFeatures.value = 0
    error.value = null
  }

  /**
   * Refetch data with the same options
   */
  async function refetch(options: FetchOptions = {}): Promise<GeoJSON.FeatureCollection> {
    return fetchFeatures(options)
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State (readonly)
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    totalFeatures: readonly(totalFeatures),

    // Config
    config,

    // Methods
    fetch: fetchFeatures,
    refetch,
    clear,
  }
}

/**
 * Create a reactive data source that refetches when a trigger changes.
 *
 * @example
 * ```typescript
 * const address = ref({ lat: 39.9526, lng: -75.1652 })
 * const { data, isLoading } = useReactiveDataSource(
 *   { url: 'https://services.arcgis.com/.../FeatureServer/0' },
 *   address,
 *   (addr) => ({ bounds: boundsFromAddress(addr) })
 * )
 * // Data refetches automatically when address changes
 * ```
 */
export function useReactiveDataSource<T>(
  config: DataSourceConfig,
  trigger: Ref<T>,
  optionsFn: (value: T) => FetchOptions
) {
  const source = useDataSource(config)

  // Watch trigger and refetch when it changes
  watch(
    trigger,
    async (newValue) => {
      if (newValue) {
        const options = optionsFn(newValue)
        await source.fetch(options)
      }
    },
    { immediate: true }
  )

  return source
}

/** Type for the return value of useDataSource */
export type UseDataSourceReturn = ReturnType<typeof useDataSource>
