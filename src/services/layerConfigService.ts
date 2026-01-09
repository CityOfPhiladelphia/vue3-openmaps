/**
 * Layer Configuration Service
 *
 * Handles loading layer configurations in either static or dynamic mode.
 * - Static mode: Uses pre-generated layer config files from src/layers/*.ts
 * - Dynamic mode: Fetches Esri WebMap JSON at runtime and transforms it
 */

import type { LayerConfig } from '@/layers/types';
import { transformWebMapToLayerConfigs, type EsriWebMap } from '@/utils/webmap-transformer';

/**
 * The Esri WebMap ID for the OpenMaps application
 * This is a public ID used to fetch the layer configuration from ArcGIS Online
 */
export const WEBMAP_ID = '1596df70df0349e293ceec46a06ccc50';

/**
 * Builds the fetch URL for the Esri WebMap JSON
 * @param webMapId The Esri WebMap ID
 * @returns The full URL to fetch the WebMap data
 */
export function buildWebMapUrl(webMapId: string): string {
  return `https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`;
}

/**
 * Gets the WebMap fetch URL using the default WEBMAP_ID
 */
export function getWebMapUrl(): string {
  return buildWebMapUrl(WEBMAP_ID);
}

// ============================================================================
// CACHING & STATE
// ============================================================================

/**
 * In-memory cache for transformed layer configs
 * Prevents re-fetching and re-transforming on subsequent calls
 */
let cachedConfigs: LayerConfig[] | null = null;

/**
 * Loading state to prevent concurrent fetches
 */
let loadingPromise: Promise<LayerConfig[]> | null = null;

/**
 * Clear the cached layer configs
 * Useful for testing or forcing a refresh
 */
export function clearCache(): void {
  cachedConfigs = null;
  loadingPromise = null;
}

// ============================================================================
// LAYER CONFIG LOADING
// ============================================================================

/**
 * Fetch WebMap JSON from ArcGIS Online
 * @returns Promise resolving to the WebMap JSON object
 * @throws Error if fetch fails
 */
async function fetchWebMapJson(): Promise<EsriWebMap> {
  const url = getWebMapUrl();

  console.log(`[LayerConfigService] Fetching WebMap from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch WebMap: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json as EsriWebMap;
}

/**
 * Load layer configs in dynamic mode
 * Fetches WebMap JSON and transforms it at runtime
 */
async function loadDynamicConfigs(): Promise<LayerConfig[]> {
  try {
    console.log('[LayerConfigService] Loading configs in DYNAMIC mode');

    // Fetch WebMap JSON
    const webMapJson = await fetchWebMapJson();

    // Transform to layer configs
    console.log('[LayerConfigService] Transforming WebMap to layer configs');
    const configs = transformWebMapToLayerConfigs(webMapJson);

    console.log(`[LayerConfigService] Successfully loaded ${configs.length} layer configs`);

    return configs;
  } catch (error) {
    console.error('[LayerConfigService] Error loading dynamic configs:', error);

    // Option 1: Re-throw the error (fail hard)
    throw new Error(`Failed to load dynamic layer configs: ${error instanceof Error ? error.message : 'Unknown error'}`);

    // Option 2: Fall back to static mode (uncomment to enable fallback)
    // console.warn('[LayerConfigService] Falling back to static mode');
    // return loadStaticConfigs();
  }
}

/**
 * Load layer configs in static mode
 * Imports pre-generated layer config files
 */
async function loadStaticConfigs(): Promise<LayerConfig[]> {
  console.log('[LayerConfigService] Loading configs in STATIC mode');

  const { layers } = await import('@/layers');

  console.log(`[LayerConfigService] Successfully loaded ${layers.length} layer configs`);

  return layers as LayerConfig[];
}

/**
 * Gets layer configurations based on the VITE_LAYER_MODE environment variable
 *
 * This function:
 * - Checks the VITE_LAYER_MODE environment variable (defaults to 'static')
 * - In static mode: imports pre-generated layer configs from src/layers/*.ts
 * - In dynamic mode: fetches WebMap JSON and transforms it at runtime
 * - Caches results in memory to avoid redundant fetches/transforms
 * - Prevents concurrent loads with a loading promise guard
 *
 * @returns Promise resolving to an array of LayerConfig objects
 * @throws Error if dynamic mode fails to fetch or transform
 */
export async function getLayerConfigs(): Promise<LayerConfig[]> {
  // Return cached configs if available
  if (cachedConfigs) {
    console.log('[LayerConfigService] Returning cached configs');
    return cachedConfigs;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    console.log('[LayerConfigService] Load already in progress, waiting...');
    return loadingPromise;
  }

  // Determine mode from environment variable
  const mode = import.meta.env.VITE_LAYER_MODE || 'static';
  console.log(`[LayerConfigService] Mode: ${mode}`);

  // Create loading promise
  loadingPromise = (async () => {
    try {
      let configs: LayerConfig[];

      if (mode === 'dynamic') {
        configs = await loadDynamicConfigs();
      } else {
        configs = await loadStaticConfigs();
      }

      // Cache the results
      cachedConfigs = configs;

      return configs;
    } finally {
      // Clear loading promise when done (success or error)
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}
