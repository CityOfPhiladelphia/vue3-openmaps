/**
 * Layer Configuration Service
 *
 * Handles loading layer configurations in either static or dynamic mode.
 * - Static mode: Uses pre-generated layer config files from src/layers/*.ts
 * - Dynamic mode: Fetches Esri WebMap JSON at runtime and transforms it
 */

import type { LayerConfig } from '@/layers/types';

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

/**
 * Gets layer configurations based on the VITE_LAYER_MODE environment variable
 * @returns Promise resolving to an array of LayerConfig objects
 */
export async function getLayerConfigs(): Promise<LayerConfig[]> {
  const mode = import.meta.env.VITE_LAYER_MODE || 'static';

  if (mode === 'dynamic') {
    // Dynamic mode: fetch and transform WebMap JSON at runtime
    // TODO: Implement dynamic fetching and transformation
    throw new Error('Dynamic mode not yet implemented');
  } else {
    // Static mode: import pre-generated layer configs
    const { layers } = await import('@/layers');
    return layers;
  }
}
