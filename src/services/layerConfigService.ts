/**
 * Layer Configuration Service
 *
 * Handles loading layer configurations dynamically from ArcGIS Online WebMap.
 * Fetches Esri WebMap JSON at runtime and transforms it to LayerConfig format.
 */

import type { LayerConfig } from '@/types/layer';
import { transformWebMapToLayerConfigs, type EsriWebMap } from '@/utils/webmap-transformer';

/**
 * The default Esri WebMap ID (OpenMaps)
 * This can be overridden by passing a webMapId to getLayerConfigs()
 */
export const DEFAULT_WEBMAP_ID = '376af635c84643cd816a8c5d017a53aa';

/**
 * @deprecated Use DEFAULT_WEBMAP_ID instead
 */
export const WEBMAP_ID = DEFAULT_WEBMAP_ID;

/**
 * Builds the fetch URL for the Esri WebMap JSON
 * @param webMapId The Esri WebMap ID
 * @param token Optional ArcGIS token for accessing protected WebMaps
 * @returns The full URL to fetch the WebMap data
 */
export function buildWebMapUrl(webMapId: string, token?: string): string {
  let url = `https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`;
  if (token) {
    url += `&token=${token}`;
  }
  return url;
}

/**
 * Gets the WebMap fetch URL using the default WEBMAP_ID
 */
export function getWebMapUrl(): string {
  return buildWebMapUrl(DEFAULT_WEBMAP_ID);
}

// ============================================================================
// CACHING & STATE
// ============================================================================

/**
 * In-memory cache for transformed layer configs, keyed by webMapId
 * Prevents re-fetching and re-transforming on subsequent calls
 */
const configCache: Map<string, LayerConfig[]> = new Map();

/**
 * Loading state to prevent concurrent fetches, keyed by webMapId
 */
const loadingPromises: Map<string, Promise<LayerConfig[]>> = new Map();

/**
 * Clear the cached layer configs
 * @param webMapId Optional - if provided, only clears cache for that webMapId
 *                 If not provided, clears all cached configs
 */
export function clearCache(webMapId?: string): void {
  if (webMapId) {
    configCache.delete(webMapId);
    loadingPromises.delete(webMapId);
  } else {
    configCache.clear();
    loadingPromises.clear();
  }
}

// ============================================================================
// ARCGIS AUTHENTICATION
// ============================================================================

/** Cached token to avoid regenerating on every request */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Generate an ArcGIS token using username/password from environment variables
 * Set VITE_AGO_USERNAME and VITE_AGO_PASSWORD in your .env.local file
 * @returns Promise resolving to the token string, or undefined if credentials not available
 */
async function generateArcGISToken(): Promise<string | undefined> {
  // @ts-expect-error - Vite env variable
  const username = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AGO_USERNAME;
  // @ts-expect-error - Vite env variable
  const password = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AGO_PASSWORD;

  if (!username || !password) {
    return undefined;
  }

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    console.log('[LayerConfigService] Using cached ArcGIS token');
    return cachedToken;
  }

  console.log('[LayerConfigService] Generating new ArcGIS token...');

  try {
    const response = await fetch('https://www.arcgis.com/sharing/rest/generateToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'f': 'json',
        'username': username,
        'password': password,
        'referer': window.location.origin || 'https://localhost',
        'expiration': '120', // 2 hours
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('[LayerConfigService] Failed to generate token:', data.error);
      return undefined;
    }

    cachedToken = data.token;
    tokenExpiry = data.expires;
    console.log('[LayerConfigService] ArcGIS token generated successfully');
    return cachedToken;
  } catch (err) {
    console.error('[LayerConfigService] Error generating ArcGIS token:', err);
    return undefined;
  }
}

// ============================================================================
// LAYER CONFIG LOADING
// ============================================================================

/**
 * Fetch WebMap JSON from ArcGIS Online
 * @param webMapId The Esri WebMap ID to fetch
 * @param token Optional ArcGIS token for protected WebMaps
 * @returns Promise resolving to the WebMap JSON object
 * @throws Error if fetch fails
 */
async function fetchWebMapJson(webMapId: string, token?: string): Promise<EsriWebMap> {
  const url = buildWebMapUrl(webMapId, token);

  // Log URL without token for security
  console.log(`[LayerConfigService] Fetching WebMap from: ${buildWebMapUrl(webMapId)}${token ? ' (with token)' : ''}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch WebMap: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  // Check for ArcGIS error response (they return 200 with error in body)
  if (json.error) {
    throw new Error(`ArcGIS error: ${json.error.message || json.error.code || 'Unknown error'}`);
  }

  return json as EsriWebMap;
}

/**
 * Load layer configs dynamically
 * Fetches WebMap JSON and transforms it at runtime
 * @param webMapId The Esri WebMap ID to load configs from
 */
async function loadDynamicConfigs(webMapId: string): Promise<LayerConfig[]> {
  try {
    console.log(`[LayerConfigService] Loading configs in DYNAMIC mode for WebMap: ${webMapId}`);

    // Generate token using username/password if available
    const token = await generateArcGISToken();

    // Fetch WebMap JSON
    const webMapJson = await fetchWebMapJson(webMapId, token);

    // Transform to layer configs
    console.log('[LayerConfigService] Transforming WebMap to layer configs');
    const configs = await transformWebMapToLayerConfigs(webMapJson);

    console.log(`[LayerConfigService] Successfully loaded ${configs.length} layer configs`);

    return configs;
  } catch (error) {
    console.error('[LayerConfigService] Error loading dynamic configs:', error);
    throw new Error(`Failed to load dynamic layer configs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gets layer configurations by fetching from ArcGIS Online WebMap
 *
 * This function:
 * - Fetches WebMap JSON and transforms it at runtime
 * - Caches results in memory to avoid redundant fetches/transforms
 * - Prevents concurrent loads with a loading promise guard
 *
 * @param webMapId Optional - the WebMap ID to fetch. Defaults to DEFAULT_WEBMAP_ID
 * @returns Promise resolving to an array of LayerConfig objects
 * @throws Error if fetch or transform fails
 */
export async function getLayerConfigs(webMapId: string = DEFAULT_WEBMAP_ID): Promise<LayerConfig[]> {
  // Return cached configs if available for this webMapId
  const cached = configCache.get(webMapId);
  if (cached) {
    console.log(`[LayerConfigService] ⚠️ Returning CACHED configs for ${webMapId} (transformer will NOT run)`);
    console.log('[LayerConfigService] To force refresh, call clearCache() or reload with Ctrl+Shift+R');
    return cached;
  }

  // If already loading this webMapId, return the existing promise
  const existingPromise = loadingPromises.get(webMapId);
  if (existingPromise) {
    console.log(`[LayerConfigService] Load already in progress for ${webMapId}, waiting...`);
    return existingPromise;
  }

  console.log(`[LayerConfigService] Mode: dynamic, WebMap: ${webMapId}`);

  // Create loading promise
  const loadingPromise = (async () => {
    try {
      const configs = await loadDynamicConfigs(webMapId);

      // Cache the results
      configCache.set(webMapId, configs);

      return configs;
    } finally {
      // Clear loading promise when done (success or error)
      loadingPromises.delete(webMapId);
    }
  })();

  loadingPromises.set(webMapId, loadingPromise);

  return loadingPromise;
}
