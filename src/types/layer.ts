// Layer configuration types

export interface LayerConfig {
  id: string
  title: string
  sourceUrl: string
  geometryType: 'point' | 'line' | 'polygon'
  paint: CirclePaint | LinePaint | FillPaint
  legend: LegendItem[]
  popup?: PopupConfig
  minZoom?: number
  maxZoom?: number
  whereClause?: string
  visible?: boolean
}

export interface CirclePaint {
  'circle-radius': number | any[]
  'circle-color': string | any[]
  'circle-opacity'?: number
  'circle-stroke-width'?: number
  'circle-stroke-color'?: string
}

export interface LinePaint {
  'line-width': number | any[]
  'line-color': string | any[]
  'line-opacity'?: number
}

export interface FillPaint {
  'fill-color': string | any[]
  'fill-opacity'?: number
  'fill-outline-color'?: string
}

export interface LegendItem {
  label: string
  color: string
  type: 'circle' | 'line' | 'fill'
  radius?: number
  width?: number
}

export interface PopupConfig {
  title: string
  fields: PopupField[]
}

export interface PopupField {
  label: string
  field: string
  format?: 'date' | 'number' | 'currency'
}
