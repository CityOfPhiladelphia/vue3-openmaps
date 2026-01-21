/**
 * Layer Configuration Types
 */

export interface LegendItem {
  type: 'fill' | 'line' | 'circle'
  color: string
  label: string
  width?: number
  radius?: number
}

export interface PopupFieldFormat {
  dateFormat?: string
  digitSeparator?: boolean
  places?: number
}

export interface PopupField {
  field: string
  label: string
  format?: PopupFieldFormat
}

export interface PopupConfig {
  title: string
  fields: PopupField[]
}

/**
 * Display options for layer controls in the sidebar
 * These match the original Layerboard's topicLayers options
 */
export interface LayerDisplayOptions {
  /** Whether to show a checkbox for this layer (default: true) */
  shouldShowCheckbox?: boolean
  /** Whether to show an opacity slider for this layer (default: true) */
  shouldShowSlider?: boolean
  /** Whether to show the legend for this layer (default: true) */
  shouldShowLegendBox?: boolean
  /** Alternative display name (overrides title in UI) */
  layerNameChange?: string
}

export interface LayerConfig {
  id: string
  title: string
  type: 'fill' | 'line' | 'circle'
  url: string
  where?: string
  minZoom?: number
  maxZoom?: number
  opacity: number
  paint?: Record<string, unknown>
  outlinePaint?: Record<string, unknown>
  legend: LegendItem[]
  popup: PopupConfig | null
  /** Display options for sidebar controls */
  displayOptions?: LayerDisplayOptions
}

/**
 * Override configuration for layer styles
 * Allows overriding the paint and legend from WebMap with custom values
 */
export interface LayerStyleOverride {
  /** MapLibre paint properties to override */
  paint?: Record<string, unknown>
  /** MapLibre outline paint properties (for polygons) */
  outlinePaint?: Record<string, unknown>
  /** Legend items to override */
  legend?: LegendItem[]
  /** Override the layer type (fill, line, circle) */
  type?: 'fill' | 'line' | 'circle'
}

// MapLibre-specific paint property interfaces
export interface CirclePaint {
  'circle-radius': number | unknown[]
  'circle-color': string | unknown[]
  'circle-opacity'?: number
  'circle-stroke-width'?: number
  'circle-stroke-color'?: string
}

export interface LinePaint {
  'line-width': number | unknown[]
  'line-color': string | unknown[]
  'line-opacity'?: number
}

export interface FillPaint {
  'fill-color': string | unknown[]
  'fill-opacity'?: number
  'fill-outline-color'?: string
}

/**
 * Configuration for ESRI tiled map layers (MapServer tiles)
 * These are separate from WebMap feature layers and rendered as raster tiles.
 * Used by topics like PickupPHL (collection day) and PlowPHL (plow status).
 */
export interface TiledLayerConfig {
  /** Unique identifier for the tiled layer */
  id: string
  /** Display title for the layer */
  title: string
  /** ESRI MapServer tile URL (e.g., https://tiles.arcgis.com/.../MapServer) */
  url: string
  /** Z-index for layer ordering (higher = on top) */
  zIndex?: number
  /** Attribution text to display on the map */
  attribution?: string
  /** Minimum zoom level at which the layer is visible */
  minZoom?: number
  /** Maximum zoom level at which the layer is visible */
  maxZoom?: number
  /** Initial opacity (0-1, default 1) */
  opacity?: number
}
