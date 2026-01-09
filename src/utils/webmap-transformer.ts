/**
 * WebMap Transformer
 *
 * Browser-compatible module for transforming Esri WebMap JSON into MapLibre layer configs.
 * Extracted from the CLI converter script for use at runtime.
 */

import type { LayerConfig, LegendItem, PopupConfig } from '@/layers/types';

// ============================================================================
// TYPES
// ============================================================================

export interface EsriWebMap {
  operationalLayers?: EsriOperationalLayer[];
  [key: string]: unknown;
}

export interface EsriOperationalLayer {
  id?: string;
  title: string;
  url?: string;
  opacity?: number;
  layerDefinition?: {
    drawingInfo?: EsriDrawingInfo;
    definitionExpression?: string;
    minScale?: number;
    maxScale?: number;
  };
  popupInfo?: EsriPopupInfo;
  [key: string]: unknown;
}

export interface EsriDrawingInfo {
  renderer?: EsriRenderer;
  [key: string]: unknown;
}

export interface EsriRenderer {
  type: 'simple' | 'uniqueValue' | 'classBreaks';
  symbol?: EsriSymbol;
  label?: string;
  field?: string;
  field1?: string;
  defaultSymbol?: EsriSymbol;
  uniqueValueInfos?: Array<{
    value: string | number;
    label?: string;
    symbol?: EsriSymbol;
  }>;
  classBreakInfos?: Array<{
    classMaxValue: number;
    label?: string;
    symbol?: EsriSymbol;
  }>;
  [key: string]: unknown;
}

export interface EsriSymbol {
  type: 'esriSFS' | 'esriSLS' | 'esriSMS' | 'esriPMS' | 'esriPFS';
  color?: number[];
  size?: number;
  width?: number;
  outline?: {
    color?: number[];
    width?: number;
    style?: string;
  };
  [key: string]: unknown;
}

export interface EsriPopupInfo {
  title?: string;
  fieldInfos?: Array<{
    fieldName: string;
    label?: string;
    visible?: boolean;
    format?: {
      dateFormat?: string;
      digitSeparator?: boolean;
      places?: number;
    };
  }>;
  [key: string]: unknown;
}

interface RendererResult {
  paint: Record<string, unknown>;
  legend: LegendItem[];
  geomType: 'fill' | 'line' | 'circle';
  outlinePaint: Record<string, unknown> | null;
}

// ============================================================================
// COLOR CONVERSION
// ============================================================================

/**
 * Convert Esri RGBA array to CSS color string
 *
 * Transforms Esri's RGBA color format [r, g, b, a] to CSS rgba() or hex.
 * Esri uses 0-255 for alpha, CSS uses 0-1.
 *
 * @param color - Esri RGBA array [red, green, blue, alpha] where each value is 0-255
 * @returns CSS color string (hex for opaque colors, rgba() for transparent)
 * @example
 * esriColorToCSS([255, 0, 0, 255]) // Returns "#ff0000"
 * esriColorToCSS([255, 0, 0, 128]) // Returns "rgba(255, 0, 0, 0.50)"
 */
export function esriColorToCSS(color: number[] | null | undefined): string {
  if (!color || !Array.isArray(color) || color.length < 3) return '#888888';

  const r = color[0]!;
  const g = color[1]!;
  const b = color[2]!;
  const a = color[3] ?? 255;

  const alpha = a / 255;

  if (alpha === 1) {
    // Return hex for full opacity
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

/**
 * Convert Esri opacity (0-1) to MapLibre opacity
 */
export function convertOpacity(opacity: number | undefined): number {
  return opacity !== undefined ? opacity : 1;
}

// ============================================================================
// SCALE TO ZOOM CONVERSION
// ============================================================================

/**
 * Convert Esri map scale to MapLibre zoom level
 *
 * Esri minScale = layer disappears when zoomed OUT beyond this scale (large number = zoomed out)
 * Esri maxScale = layer disappears when zoomed IN beyond this scale (small number = zoomed in)
 *
 * MapLibre minzoom = layer appears at this zoom and higher (more zoomed in)
 * MapLibre maxzoom = layer disappears at this zoom and higher (more zoomed in)
 *
 * Formula: zoom ≈ log2(559082264 / scale)
 * 559082264 is the approximate scale at zoom 0 at the equator
 */
const SCALE_AT_ZOOM_0 = 559082264;

function scaleToZoom(scale: number): number | null {
  if (!scale || scale <= 0) return null;
  return Math.round(Math.log2(SCALE_AT_ZOOM_0 / scale) * 100) / 100;
}

/**
 * Convert Esri minScale/maxScale to MapLibre minzoom/maxzoom
 *
 * Note: The relationship is inverted!
 * - Esri minScale (large number) = zoomed out limit → MapLibre minzoom (small zoom level)
 * - Esri maxScale (small number) = zoomed in limit → MapLibre maxzoom (large zoom level)
 *
 * Uses the formula: zoom ≈ log2(559082264 / scale)
 * where 559082264 is the approximate scale at zoom level 0 at the equator.
 *
 * @param minScale - Esri minScale (layer disappears when zoomed out beyond this)
 * @param maxScale - Esri maxScale (layer disappears when zoomed in beyond this)
 * @returns Object with optional minZoom and maxZoom properties for MapLibre
 * @example
 * convertScaleToZoom(100000, 5000) // Returns { minZoom: 12.45, maxZoom: 17.11 }
 */
export function convertScaleToZoom(minScale?: number, maxScale?: number): { minZoom?: number; maxZoom?: number } {
  const result: { minZoom?: number; maxZoom?: number } = {};

  // Esri minScale (zoomed out limit) → MapLibre minzoom
  if (minScale && minScale > 0) {
    const zoom = scaleToZoom(minScale);
    if (zoom !== null) {
      result.minZoom = zoom;
    }
  }

  // Esri maxScale (zoomed in limit) → MapLibre maxzoom
  if (maxScale && maxScale > 0) {
    const zoom = scaleToZoom(maxScale);
    if (zoom !== null) {
      result.maxZoom = zoom;
    }
  }

  return result;
}

// ============================================================================
// GEOMETRY TYPE DETECTION
// ============================================================================

/**
 * Detect geometry type from Esri symbol type
 */
function detectGeometryType(symbol?: EsriSymbol): 'fill' | 'line' | 'circle' {
  if (!symbol) return 'fill';

  switch (symbol.type) {
    case 'esriSFS': // Simple Fill Symbol
      return 'fill';
    case 'esriSLS': // Simple Line Symbol
      return 'line';
    case 'esriSMS': // Simple Marker Symbol
      return 'circle';
    case 'esriPMS': // Picture Marker Symbol
      return 'circle';
    case 'esriPFS': // Picture Fill Symbol
      return 'fill';
    default:
      return 'fill';
  }
}

// ============================================================================
// PAINT STYLE CONVERSION
// ============================================================================

/**
 * Check if an Esri outline should be rendered
 * Returns false if outline style is null/none or color is null
 */
function hasVisibleOutline(outline?: { style?: string; color?: number[] | null }): boolean {
  if (!outline) return false;
  if (outline.style === 'esriSLSNull') return false;
  if (outline.color === null) return false;
  return true;
}

/**
 * Coerce a value to handle string/number mismatches in Esri data.
 * Esri stores unique values as strings, but actual field data may be numeric.
 * Returns the numeric form if the string can be parsed as a number.
 */
function coerceMatchValue(value: string | number): string | number {
  // If it's a string that looks like a number, use the numeric form
  // since ArcGIS GeoJSON returns numeric fields as numbers
  if (typeof value === 'string') {
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') {
      return num;
    }
  }
  return value;
}

/**
 * Convert Esri Simple renderer to MapLibre paint
 */
function convertSimpleRenderer(renderer: EsriRenderer, layerOpacity?: number): RendererResult {
  const symbol = renderer.symbol;
  const geomType = detectGeometryType(symbol);

  let paint: Record<string, unknown> = {};
  let legend: LegendItem[] = [];
  let outlinePaint: Record<string, unknown> | null = null;

  if (geomType === 'fill' && symbol) {
    paint = {
      'fill-color': esriColorToCSS(symbol.color),
      'fill-opacity': convertOpacity(layerOpacity),
    };

    // For fill layers with visible outlines, create separate outline paint
    // MapLibre's fill-outline-color only supports 1px, so we need a LineLayer for thicker outlines
    if (hasVisibleOutline(symbol.outline)) {
      const outlineWidth = symbol.outline!.width || 1;
      const outlineColor = esriColorToCSS(symbol.outline!.color);

      // Always add fill-outline-color for the 1px fallback
      paint['fill-outline-color'] = outlineColor;

      // If outline is thicker than 1px, create separate line paint
      if (outlineWidth > 1) {
        outlinePaint = {
          'line-color': outlineColor,
          'line-width': outlineWidth,
        };
      }
    }

    legend = [{
      type: 'fill',
      color: esriColorToCSS(symbol.color),
      label: renderer.label || 'Feature',
    }];
  } else if (geomType === 'line' && symbol) {
    paint = {
      'line-color': esriColorToCSS(symbol.color),
      'line-width': symbol.width || 1,
      'line-opacity': convertOpacity(layerOpacity),
    };

    legend = [{
      type: 'line',
      color: esriColorToCSS(symbol.color),
      width: symbol.width || 1,
      label: renderer.label || 'Feature',
    }];
  } else if (geomType === 'circle' && symbol) {
    // Esri size is diameter in points, MapLibre radius is in pixels
    // Empirically tuned multiplier to match Esri rendering
    const radius = Math.round((symbol.size || 6) * 0.71 * 100) / 100;

    paint = {
      'circle-color': esriColorToCSS(symbol.color),
      'circle-radius': radius,
      'circle-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(symbol.outline)) {
      paint['circle-stroke-color'] = esriColorToCSS(symbol.outline!.color);
      paint['circle-stroke-width'] = symbol.outline!.width || 1;
    }

    legend = [{
      type: 'circle',
      color: esriColorToCSS(symbol.color),
      label: renderer.label || 'Feature',
    }];
  }

  return { paint, legend, geomType, outlinePaint };
}

/**
 * Convert Esri UniqueValue renderer to MapLibre paint with match expression
 */
function convertUniqueValueRenderer(renderer: EsriRenderer, layerOpacity?: number): RendererResult {
  const field = renderer.field1!;
  const uniqueValueInfos = renderer.uniqueValueInfos || [];
  const defaultSymbol = renderer.defaultSymbol;

  if (uniqueValueInfos.length === 0) {
    return convertSimpleRenderer({ ...renderer, symbol: defaultSymbol }, layerOpacity);
  }

  const firstSymbol = uniqueValueInfos[0]?.symbol || defaultSymbol;
  const geomType = detectGeometryType(firstSymbol);

  let paint: Record<string, unknown> = {};
  let legend: LegendItem[] = [];
  let outlinePaint: Record<string, unknown> | null = null;

  if (geomType === 'fill') {
    // Build match expression for fill-color
    const colorMatch: unknown[] = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'fill',
        color: esriColorToCSS(info.symbol?.color),
        label: info.label || String(info.value),
      });
    }

    // Default color
    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    paint = {
      'fill-color': colorMatch,
      'fill-opacity': convertOpacity(layerOpacity),
    };

    // Handle outline if present
    if (hasVisibleOutline(firstSymbol?.outline)) {
      const outlineWidth = firstSymbol!.outline!.width || 1;
      const outlineColor = esriColorToCSS(firstSymbol!.outline!.color);

      paint['fill-outline-color'] = outlineColor;

      // If outline is thicker than 1px, create separate line paint
      if (outlineWidth > 1) {
        outlinePaint = {
          'line-color': outlineColor,
          'line-width': outlineWidth,
        };
      }
    }
  } else if (geomType === 'line') {
    const colorMatch: unknown[] = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'line',
        color: esriColorToCSS(info.symbol?.color),
        width: info.symbol?.width || 1,
        label: info.label || String(info.value),
      });
    }

    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    paint = {
      'line-color': colorMatch,
      'line-width': firstSymbol?.width || 2,
      'line-opacity': convertOpacity(layerOpacity),
    };
  } else if (geomType === 'circle') {
    const colorMatch: unknown[] = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'circle',
        color: esriColorToCSS(info.symbol?.color),
        label: info.label || String(info.value),
      });
    }

    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    // Esri size is diameter in points, MapLibre radius is in pixels
    // Empirically tuned multiplier to match Esri rendering
    const radius = Math.round((firstSymbol?.size || 6) * 0.71 * 100) / 100;

    paint = {
      'circle-color': colorMatch,
      'circle-radius': radius,
      'circle-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(firstSymbol?.outline)) {
      paint['circle-stroke-color'] = esriColorToCSS(firstSymbol!.outline!.color);
      paint['circle-stroke-width'] = firstSymbol!.outline!.width || 1;
    }
  }

  return { paint, legend, geomType, outlinePaint };
}

/**
 * Convert Esri ClassBreaks renderer to MapLibre paint with step expression
 */
function convertClassBreaksRenderer(renderer: EsriRenderer, layerOpacity?: number): RendererResult {
  const field = renderer.field!;
  const classBreakInfos = renderer.classBreakInfos || [];

  if (classBreakInfos.length === 0) {
    return { paint: {}, legend: [], geomType: 'fill', outlinePaint: null };
  }

  const firstSymbol = classBreakInfos[0]?.symbol;
  const geomType = detectGeometryType(firstSymbol);

  let paint: Record<string, unknown> = {};
  let legend: LegendItem[] = [];
  let outlinePaint: Record<string, unknown> | null = null;

  if (geomType === 'fill') {
    // Build step expression for fill-color
    // step format: ["step", ["get", field], color0, stop1, color1, stop2, color2, ...]
    const colorStep: unknown[] = ['step', ['get', field]];

    // Add first color (for values below first break)
    colorStep.push(esriColorToCSS(classBreakInfos[0]?.symbol?.color));

    for (let i = 0; i < classBreakInfos.length; i++) {
      const info = classBreakInfos[i]!;

      if (i > 0) {
        // Add break value and color
        colorStep.push(classBreakInfos[i - 1]!.classMaxValue);
        colorStep.push(esriColorToCSS(info.symbol?.color));
      }

      legend.push({
        type: 'fill',
        color: esriColorToCSS(info.symbol?.color),
        label: info.label || `${info.classMaxValue}`,
      });
    }

    paint = {
      'fill-color': colorStep,
      'fill-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(firstSymbol?.outline)) {
      const outlineWidth = firstSymbol!.outline!.width || 1;
      const outlineColor = esriColorToCSS(firstSymbol!.outline!.color);

      paint['fill-outline-color'] = outlineColor;

      if (outlineWidth > 1) {
        outlinePaint = {
          'line-color': outlineColor,
          'line-width': outlineWidth,
        };
      }
    }
  }

  return { paint, legend, geomType, outlinePaint };
}

/**
 * Transform Esri renderer to MapLibre paint styles
 *
 * Main renderer conversion function that handles all Esri renderer types:
 * - Simple: Single symbol for all features
 * - UniqueValue: Different symbols based on attribute field values
 * - ClassBreaks: Graduated colors based on numeric ranges
 *
 * Converts Esri symbols and colors to MapLibre paint properties, generates
 * legend entries, and handles outline styling for fill layers.
 *
 * @param drawingInfo - Esri drawing info containing renderer configuration
 * @param layerOpacity - Layer opacity (0-1), defaults to 1
 * @returns Object containing paint styles, legend items, geometry type, and optional outline paint
 * @example
 * const result = transformEsriRenderer(layer.drawingInfo, 0.8);
 * // result.paint = { 'fill-color': '#ff0000', 'fill-opacity': 0.8 }
 * // result.legend = [{ type: 'fill', color: '#ff0000', label: 'Feature' }]
 * // result.geomType = 'fill'
 */
export function transformEsriRenderer(drawingInfo?: EsriDrawingInfo, layerOpacity?: number): RendererResult {
  if (!drawingInfo?.renderer) {
    return { paint: {}, legend: [], geomType: 'fill', outlinePaint: null };
  }

  const renderer = drawingInfo.renderer;

  switch (renderer.type) {
    case 'simple':
      return convertSimpleRenderer(renderer, layerOpacity);
    case 'uniqueValue':
      return convertUniqueValueRenderer(renderer, layerOpacity);
    case 'classBreaks':
      return convertClassBreaksRenderer(renderer, layerOpacity);
    default:
      console.warn(`Unknown renderer type: ${(renderer as { type: string }).type}`);
      return { paint: {}, legend: [], geomType: 'fill', outlinePaint: null };
  }
}

// ============================================================================
// POPUP CONVERSION
// ============================================================================

/**
 * Transform Esri popupInfo to application popup configuration
 *
 * Converts Esri's popupInfo structure to the app's PopupConfig format.
 * Filters to visible fields only and preserves field formatting options
 * (date formats, number formatting, etc.).
 *
 * @param popupInfo - Esri popup info from layer definition
 * @returns PopupConfig object with title and visible fields, or null if no popup info
 * @example
 * const popup = transformPopupConfig(layer.popupInfo);
 * // Returns: { title: "{NAME}", fields: [{ field: "name", label: "Name" }] }
 */
export function transformPopupConfig(popupInfo?: EsriPopupInfo): PopupConfig | null {
  if (!popupInfo) return null;

  const title = popupInfo.title || '';
  const fieldInfos = popupInfo.fieldInfos || [];

  // Filter to visible fields only and include format info
  const visibleFields = fieldInfos
    .filter(f => f.visible === true)
    .map(f => {
      const field: {
        field: string;
        label: string;
        format?: {
          dateFormat?: string;
          digitSeparator?: boolean;
          places?: number;
        };
      } = {
        field: f.fieldName,
        label: f.label || f.fieldName,
      };

      // Include format info if present
      if (f.format) {
        field.format = {};
        if (f.format.dateFormat) {
          field.format.dateFormat = f.format.dateFormat;
        }
        if (f.format.digitSeparator !== undefined) {
          field.format.digitSeparator = f.format.digitSeparator;
        }
        if (f.format.places !== undefined) {
          field.format.places = f.format.places;
        }
        // Only include format if it has properties
        if (Object.keys(field.format).length === 0) {
          delete field.format;
        }
      }

      return field;
    });

  return {
    title,
    fields: visibleFields,
  };
}

/**
 * Generate legend entries from Esri renderer
 *
 * Convenience function that extracts just the legend items from the renderer
 * transformation. This is the same as the legend array returned by
 * transformEsriRenderer().
 *
 * @param drawingInfo - Esri drawing info containing renderer configuration
 * @param layerOpacity - Layer opacity (0-1), defaults to 1
 * @returns Array of legend items with type, color, and label
 * @example
 * const legend = transformLegendConfig(layer.drawingInfo);
 * // Returns: [{ type: 'fill', color: '#ff0000', label: 'Parks' }]
 */
export function transformLegendConfig(drawingInfo?: EsriDrawingInfo, layerOpacity?: number): LegendItem[] {
  const result = transformEsriRenderer(drawingInfo, layerOpacity);
  return result.legend;
}

/**
 * Extract Esri definitionExpression as where clause
 *
 * Simple extraction of the definitionExpression from Esri layer definition.
 * This SQL-like expression filters which features are displayed on the map.
 *
 * @param layerDefinition - Esri layer definition object
 * @returns Definition expression string, or undefined if not present
 * @example
 * const where = buildWhereClause(layer.layerDefinition);
 * // Returns: "STATUS = 'Active' AND YEAR >= 2020"
 */
export function buildWhereClause(layerDefinition?: { definitionExpression?: string }): string | undefined {
  return layerDefinition?.definitionExpression;
}

// ============================================================================
// ID/NAME GENERATION
// ============================================================================

/**
 * Convert title to kebab-case for layer ID
 */
function titleToKebab(title: string): string {
  // Remove the "Group_" prefix
  const cleanTitle = title.includes('_')
    ? title.split('_').slice(1).join(' ')
    : title;

  return cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get display title (without group prefix)
 */
function getDisplayTitle(title: string): string {
  return title.includes('_')
    ? title.split('_').slice(1).join(' ')
    : title;
}

// ============================================================================
// MAIN TRANSFORMATION
// ============================================================================

/**
 * Transform Esri WebMap JSON to array of LayerConfig objects
 *
 * This is the main entry point for runtime transformation.
 * Takes a WebMap JSON object and returns an array of layer configurations
 * compatible with the app's LayerConfig interface.
 *
 * @param webMapJson The Esri WebMap JSON object
 * @returns Array of LayerConfig objects ready to use with MapLibre
 */
export function transformWebMapToLayerConfigs(webMapJson: EsriWebMap): LayerConfig[] {
  const operationalLayers = webMapJson.operationalLayers || [];
  const configs: LayerConfig[] = [];

  for (const layer of operationalLayers) {
    // Skip layers without URLs (like group layers)
    if (!layer.url) {
      console.log(`Skipping layer without URL: ${layer.title}`);
      continue;
    }

    try {
      // Transform renderer to get paint styles and legend
      const { paint, legend, geomType, outlinePaint } = transformEsriRenderer(
        layer.layerDefinition?.drawingInfo,
        layer.opacity
      );

      // Transform popup config
      const popup = transformPopupConfig(layer.popupInfo);

      // Get where clause
      const where = buildWhereClause(layer.layerDefinition);

      // Convert scale range to zoom levels
      const zoomRange = convertScaleToZoom(
        layer.layerDefinition?.minScale,
        layer.layerDefinition?.maxScale
      );

      // Generate IDs and titles
      const layerId = titleToKebab(layer.title);
      const displayTitle = getDisplayTitle(layer.title);

      // Build layer config
      const config: LayerConfig = {
        id: layerId,
        title: displayTitle,
        type: geomType,
        url: layer.url,
        opacity: layer.opacity ?? 1,
        paint,
        legend,
        popup,
      };

      // Add optional properties
      if (where) {
        config.where = where;
      }
      if (zoomRange.minZoom !== undefined) {
        config.minZoom = zoomRange.minZoom;
      }
      if (zoomRange.maxZoom !== undefined) {
        config.maxZoom = zoomRange.maxZoom;
      }
      if (outlinePaint) {
        config.outlinePaint = outlinePaint;
      }

      configs.push(config);
    } catch (err) {
      console.error(`Error transforming layer ${layer.title}:`, err);
    }
  }

  return configs;
}
