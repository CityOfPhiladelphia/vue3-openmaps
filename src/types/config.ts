// LayerboardConfig - Main configuration interface for the framework

import type { LayerConfig } from './layer'

export interface LayerboardConfig {
  /**
   * ArcGIS Online WebMap ID to fetch layer configuration from
   */
  webMapId: string

  /**
   * Mode for layer configuration
   * - 'dynamic': Fetch from ArcGIS Online at runtime (recommended)
   * - 'static': Use pre-generated static config files
   */
  mode?: 'dynamic' | 'static'

  /**
   * Layer panel display mode
   * - 'flat': Simple list of all layers (OpenMaps style)
   * - 'topics': Grouped by topic in accordion (StreetSmartPHL style)
   */
  panelMode?: 'flat' | 'topics'

  /**
   * Topic configuration (required when panelMode is 'topics')
   */
  topics?: TopicConfig[]

  /**
   * Static layer configurations (used when mode is 'static')
   */
  staticLayers?: LayerConfig[]

  /**
   * Initial map view settings
   */
  initialView?: InitialViewConfig

  /**
   * Feature flags to enable/disable framework features
   */
  features?: FeatureFlags

  /**
   * Optional callback when map is ready
   */
  onMapReady?: (map: unknown) => void
}

/**
 * Initial map view configuration
 */
export interface InitialViewConfig {
  /** Center coordinates [longitude, latitude] */
  center: [number, number]
  /** Initial zoom level */
  zoom: number
  /** Optional min zoom constraint */
  minZoom?: number
  /** Optional max zoom constraint */
  maxZoom?: number
}

/**
 * Feature flags for enabling/disabling framework features
 */
export interface FeatureFlags {
  /** Enable address search (default: true) */
  search?: boolean
  /** Enable geolocation/locate me button (default: true) */
  geolocation?: boolean
  /** Enable Cyclomedia street-level imagery integration */
  cyclomedia?: boolean
  /** Enable Pictometry oblique imagery integration */
  pictometry?: boolean
  /** Enable layer opacity controls (default: true) */
  opacitySliders?: boolean
  /** Enable layer legends (default: true) */
  legends?: boolean
}

export interface TopicConfig {
  id: string
  title: string
  icon?: string
  layerIds: string[]
  defaultExpanded?: boolean
}
