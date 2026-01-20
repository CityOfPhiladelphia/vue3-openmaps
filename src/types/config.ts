// LayerboardConfig - Main configuration interface for the framework

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
   * Optional callback when map is ready
   */
  onMapReady?: (map: any) => void
}

export interface TopicConfig {
  id: string
  title: string
  icon?: string
  layerIds: string[]
  defaultExpanded?: boolean
}
