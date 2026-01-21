/**
 * WebMap Transformer
 *
 * Browser-compatible module for transforming Esri WebMap JSON into MapLibre layer configs.
 * Extracted from the CLI converter script for use at runtime.
 */

import type { LayerConfig, LegendItem, PopupConfig } from '@/types';

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
  /** Minimum value for classBreaks renderer (used for label generation) */
  minValue?: number;
  uniqueValueInfos?: Array<{
    value: string | number;
    label?: string;
    symbol?: EsriSymbol;
  }>;
  classBreakInfos?: Array<{
    classMaxValue: number;
    classMinValue?: number;
    label?: string;
    symbol?: EsriSymbol;
  }>;
  visualVariables?: Array<{
    type: 'colorInfo' | 'sizeInfo' | 'opacityInfo' | 'rotationInfo';
    field?: string;
    stops?: Array<{
      value: number;
      color?: number[];
      size?: number;
      label?: string;
    }>;
    [key: string]: unknown;
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
 * Returns false if outline style is null/none, color is null, width is 0, or alpha is 0
 */
function hasVisibleOutline(outline?: { style?: string; color?: number[] | null; width?: number }): boolean {
  if (!outline) return false;
  if (outline.style === 'esriSLSNull') return false;
  if (outline.color === null) return false;
  if (outline.width === 0) return false;
  // Check if alpha channel is 0 (fully transparent)
  if (outline.color && outline.color[3] === 0) return false;
  return true;
}

/**
 * Coerce a value to string for MapLibre match expressions.
 * MapLibre requires all match values to be strings (not numbers).
 * Esri may store unique values as strings or numbers, but we always
 * convert to strings for consistency in MapLibre expressions.
 */
function coerceMatchValue(value: string | number): string {
  // Always return string form for MapLibre match expressions
  return String(value);
}

/**
 * Convert Esri Simple renderer to MapLibre paint
 */
function convertSimpleRenderer(renderer: EsriRenderer, layerOpacity?: number, layerTitle?: string): RendererResult {
  const symbol = renderer.symbol;
  const geomType = detectGeometryType(symbol);

  console.log('[Transformer] convertSimpleRenderer - geomType:', geomType, 'symbol:', symbol);

  let paint: Record<string, unknown> = {};
  let legend: LegendItem[] = [];
  let outlinePaint: Record<string, unknown> | null = null;

  if (geomType === 'fill' && symbol) {
    // Check if fill color is null (no fill) or has alpha = 0 (fully transparent)
    const fillAlpha = symbol.color === null ? 0 : (symbol.color?.[3] ?? 255);
    // Use transparent color when alpha is 0 or color is null to ensure no fill is rendered
    const fillColor = fillAlpha === 0 ? 'rgba(0, 0, 0, 0)' : esriColorToCSS(symbol.color);

    // If symbol color already has transparency (alpha < 255), that transparency is baked into fillColor
    // In this case, use fill-opacity: 1.0 to avoid double-applying opacity
    // Otherwise, use the layer's opacity value
    const fillOpacity = fillAlpha === 0 ? 0 : (fillAlpha < 255 ? 1.0 : convertOpacity(layerOpacity));

    console.log(`[Transformer] Fill layer opacity calculation for "${layerTitle}":`, {
      symbolColor: symbol.color,
      fillAlpha,
      layerOpacity,
      fillOpacity,
      fillColor
    });

    paint = {
      'fill-color': fillColor,
      'fill-opacity': fillOpacity,
    };

    // For fill layers with visible outlines, create separate outline paint
    // MapLibre's fill-outline-color only supports 1px, so we need a LineLayer for thicker outlines
    if (hasVisibleOutline(symbol.outline)) {
      const outlineWidth = symbol.outline!.width || 1;
      const outlineColor = esriColorToCSS(symbol.outline!.color);

      console.log('[Transformer] Fill layer with outline:', {
        fillAlpha,
        outlineWidth,
        outlineColor,
        willCreateOutlinePaint: outlineWidth > 1 || fillAlpha === 0
      });

      // For transparent fills, don't use fill-outline-color as it can cause rendering issues
      // Instead, rely solely on the separate LineLayer for the outline
      if (fillAlpha !== 0) {
        paint['fill-outline-color'] = outlineColor;
      }

      // If outline is thicker than 1px OR fill is transparent, create separate line paint
      if (outlineWidth > 1 || fillAlpha === 0) {
        outlinePaint = {
          'line-color': outlineColor,
          'line-width': outlineWidth,
        };
        console.log('[Transformer] Created outlinePaint:', outlinePaint);
      }
    } else {
      console.log('[Transformer] No visible outline for fill layer, hasVisibleOutline returned false');
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
 *
 * This function handles unique value (categorical) symbology where different field values
 * get different colors/symbols. It's used for layers like Land Use, Zoning, Commercial Corridors, etc.
 *
 * @param renderer The Esri unique value renderer configuration
 * @param layerOpacity Optional opacity override (0-1)
 * @param customLabelMap Optional map of field values to custom labels
 *
 * The customLabelMap parameter enables a hybrid approach:
 * - Use renderer from one source (e.g., service) for field/colors
 * - Use labels from another source (e.g., service description) for human-readable names
 *
 * Label precedence (first match wins):
 * 1. customLabelMap.get(value) - Custom label from service description
 * 2. info.label - Label from renderer's uniqueValueInfos
 * 3. String(value) - The raw field value as fallback
 *
 * Example for Land Use with c_dig2 field:
 * - Renderer has: { value: "11", label: "11", symbol: {...} }
 * - customLabelMap has: "11" → "Residential Low Density"
 * - Result legend: { label: "Residential Low Density", color: "...", type: "fill" }
 */
function convertUniqueValueRenderer(
  renderer: EsriRenderer,
  layerOpacity?: number,
  customLabelMap?: Map<string, string>
): RendererResult {
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
    // Use to-string to ensure field values match string literals in the expression
    const colorMatch: unknown[] = ['match', ['to-string', ['get', field]]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      // LABEL MERGING: Hybrid approach to get the best label available
      // This enables using service renderer (correct field/colors) with custom labels (from description)
      //
      // Precedence chain:
      // 1. customLabel from customLabelMap (e.g., "11 Residential Low Density" from service description)
      // 2. info.label from renderer (e.g., "11" or "Residential" from uniqueValueInfos)
      // 3. valueStr as last resort (e.g., "11" - the raw field value)
      //
      // Example for Land Use:
      // - valueStr = "11"
      // - customLabelMap.get("11") = "Residential Low Density" (from service description)
      // - info.label = "11" (from service renderer's uniqueValueInfos)
      // - Result: label = "Residential Low Density" (customLabel wins)
      const valueStr = String(info.value);
      const customLabel = customLabelMap?.get(valueStr);
      const label = customLabel || info.label || valueStr;

      legend.push({
        type: 'fill' as const,
        color: esriColorToCSS(info.symbol?.color),
        label: label,
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
    // Use to-string to ensure field values match string literals in the expression
    const colorMatch: unknown[] = ['match', ['to-string', ['get', field]]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      // LABEL MERGING: Same hybrid approach as fill layers (see comment above in fill section)
      // Precedence: customLabelMap → renderer label → raw value
      const valueStr = String(info.value);
      const customLabel = customLabelMap?.get(valueStr);
      const label = customLabel || info.label || valueStr;

      legend.push({
        type: 'line' as const,
        color: esriColorToCSS(info.symbol?.color),
        width: info.symbol?.width || 1,
        label: label,
      });
    }

    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    paint = {
      'line-color': colorMatch,
      'line-width': firstSymbol?.width || 2,
      'line-opacity': convertOpacity(layerOpacity),
    };
  } else if (geomType === 'circle') {
    // Use to-string to ensure field values match string literals in the expression
    const colorMatch: unknown[] = ['match', ['to-string', ['get', field]]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      // LABEL MERGING: Same hybrid approach as fill layers (see comment above in fill section)
      // Precedence: customLabelMap → renderer label → raw value
      const valueStr = String(info.value);
      const customLabel = customLabelMap?.get(valueStr);
      const label = customLabel || info.label || valueStr;

      legend.push({
        type: 'circle' as const,
        color: esriColorToCSS(info.symbol?.color),
        label: label,
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
 * Convert Esri ClassBreaks renderer to MapLibre paint with step or interpolate expression
 *
 * Handles two types of class breaks rendering:
 * 1. Traditional classBreakInfos: Discrete color classes with step expression
 * 2. visualVariables with colorInfo: Continuous color ramp with interpolate expression
 *
 * Visual variables are commonly used for choropleth maps with smooth color gradients.
 * Example: Heat Exposure layer uses 5 color stops to create a diverging color scheme
 * (dark blue → green → yellow) based on HEI_SCORE values.
 */
function convertClassBreaksRenderer(renderer: EsriRenderer, layerOpacity?: number): RendererResult {
  const field = renderer.field!;
  const classBreakInfos = renderer.classBreakInfos || [];

  // Check for visualVariables with colorInfo (continuous color ramp)
  const colorVariable = renderer.visualVariables?.find(v => v.type === 'colorInfo');

  if (colorVariable?.stops && colorVariable.stops.length > 0) {
    // Use visualVariables for continuous color ramp
    return convertColorInfoRenderer(colorVariable, field, renderer, layerOpacity);
  }

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
        type: 'fill' as const,
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
  } else if (geomType === 'line') {
    // Build step expression for line-color
    // step format: ["step", ["get", field], color0, stop1, color1, stop2, color2, ...]
    const colorStep: unknown[] = ['step', ['get', field]];

    // Add first color (for values below first break)
    colorStep.push(esriColorToCSS(classBreakInfos[0]?.symbol?.color));

    // Track previous class max value for label generation
    let prevMaxValue = renderer.minValue ?? 0;

    for (let i = 0; i < classBreakInfos.length; i++) {
      const info = classBreakInfos[i]!;

      if (i > 0) {
        // Add break value and color
        colorStep.push(classBreakInfos[i - 1]!.classMaxValue);
        colorStep.push(esriColorToCSS(info.symbol?.color));
      }

      legend.push({
        type: 'line' as const,
        color: esriColorToCSS(info.symbol?.color),
        width: info.symbol?.width || firstSymbol?.width || 2,
        label: info.label || `${prevMaxValue} - ${info.classMaxValue}`,
      });

      prevMaxValue = info.classMaxValue + 1;
    }

    // Get line width from first symbol
    const lineWidth = firstSymbol?.width || 2;

    paint = {
      'line-color': colorStep,
      'line-width': lineWidth,
      'line-opacity': convertOpacity(layerOpacity),
    };
  }

  return { paint, legend, geomType, outlinePaint };
}

/**
 * Convert Esri visualVariables colorInfo to MapLibre paint with interpolate expression
 *
 * Creates a continuous color ramp using linear interpolation between color stops.
 * This is used for choropleth maps where colors transition smoothly based on data values.
 *
 * MapLibre interpolate format:
 * ["interpolate", ["linear"], ["get", field], stop1, color1, stop2, color2, ...]
 *
 * @param colorVariable - The colorInfo visual variable with stops
 * @param field - The field name to interpolate on
 * @param renderer - The full renderer (for accessing default symbol/outline)
 * @param layerOpacity - Layer opacity
 */
function convertColorInfoRenderer(
  colorVariable: NonNullable<EsriRenderer['visualVariables']>[0],
  field: string,
  renderer: EsriRenderer,
  layerOpacity?: number
): RendererResult {
  const stops = colorVariable.stops || [];

  if (stops.length === 0) {
    return { paint: {}, legend: [], geomType: 'fill', outlinePaint: null };
  }

  // Determine geometry type from first classBreakInfo symbol or default symbol
  const firstSymbol = renderer.classBreakInfos?.[0]?.symbol || renderer.defaultSymbol;
  const geomType = detectGeometryType(firstSymbol);

  let paint: Record<string, unknown> = {};
  let legend: LegendItem[] = [];
  let outlinePaint: Record<string, unknown> | null = null;

  if (geomType === 'fill') {
    // Build interpolate expression for smooth color transitions
    // interpolate format: ["interpolate", ["linear"], ["get", field], value1, color1, value2, color2, ...]
    const colorInterpolate: unknown[] = ['interpolate', ['linear'], ['get', field]];

    for (const stop of stops) {
      colorInterpolate.push(stop.value);
      colorInterpolate.push(esriColorToCSS(stop.color));

      // Add legend entry for each stop
      legend.push({
        type: 'fill' as const,
        color: esriColorToCSS(stop.color),
        label: stop.label || `${stop.value}`,
      });
    }

    // Wrap interpolate in a case expression to handle null/undefined values
    // If field value is null, use transparent color so "no data" areas are not filled
    const colorExpression: unknown[] = [
      'case',
      ['==', ['get', field], null],
      'rgba(0, 0, 0, 0)',  // Transparent for null/no-data values
      colorInterpolate      // Otherwise use the interpolated color
    ];

    paint = {
      'fill-color': colorExpression,
      'fill-opacity': convertOpacity(layerOpacity),
    };

    // Check for outline on default symbol or first class break symbol
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
 * The customLabelMap parameter (optional, only for unique value renderers):
 * Enables hybrid approach where you can use renderer from one source (e.g., service)
 * for field/colors/symbols, but labels from another source (e.g., service description)
 * for human-readable names. This solves cases where:
 * - Renderer has correct colors but only numeric labels (e.g., "11", "22")
 * - Description field has detailed labels (e.g., "11 Residential Low Density")
 * - Example: Land Use layer uses service renderer (c_dig2 field, correct colors) with
 *   parsed description labels ("Residential Low Density" instead of just "11")
 *
 * @param drawingInfo - Esri drawing info containing renderer configuration
 * @param layerOpacity - Layer opacity (0-1), defaults to 1
 * @param customLabelMap - Optional map of field values to custom labels (unique value renderers only)
 * @returns Object containing paint styles, legend items, geometry type, and optional outline paint
 *
 * @example Basic usage
 * const result = transformEsriRenderer(layer.drawingInfo, 0.8);
 * // result.paint = { 'fill-color': '#ff0000', 'fill-opacity': 0.8 }
 * // result.legend = [{ type: 'fill', color: '#ff0000', label: 'Feature' }]
 * // result.geomType = 'fill'
 *
 * @example With custom labels (hybrid approach for unique value renderers)
 * const labelMap = new Map([
 *   ['11', 'Residential Low Density'],
 *   ['22', 'Commercial Business/Professional']
 * ]);
 * const result = transformEsriRenderer(serviceDrawingInfo, 1.0, labelMap);
 * // result uses renderer's field/colors but labelMap's descriptive labels
 */
export function transformEsriRenderer(
  drawingInfo?: EsriDrawingInfo,
  layerOpacity?: number,
  customLabelMap?: Map<string, string>,
  layerTitle?: string
): RendererResult {
  if (!drawingInfo?.renderer) {
    console.warn('[Transformer] No renderer found in drawingInfo - layer will use service default (not available in WebMap)');
    // Return empty paint - the layer will need to fetch service metadata for its default renderer
    // For now, this will result in MapLibre default styling (which may not be correct)
    return { paint: {}, legend: [], geomType: 'fill', outlinePaint: null };
  }

  const renderer = drawingInfo.renderer;

  switch (renderer.type) {
    case 'simple':
      return convertSimpleRenderer(renderer, layerOpacity, layerTitle);
    case 'uniqueValue':
      return convertUniqueValueRenderer(renderer, layerOpacity, customLabelMap);
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
 * @param customLabelMap - Optional map of field values to custom labels
 * @returns Array of legend items with type, color, and label
 * @example
 * const legend = transformLegendConfig(layer.drawingInfo);
 * // Returns: [{ type: 'fill', color: '#ff0000', label: 'Parks' }]
 */
export function transformLegendConfig(
  drawingInfo?: EsriDrawingInfo,
  layerOpacity?: number,
  customLabelMap?: Map<string, string>
): LegendItem[] {
  const result = transformEsriRenderer(drawingInfo, layerOpacity, customLabelMap);
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
// SERVICE METADATA FETCHING
// ============================================================================

/**
 * Parse service description to extract code-to-label mappings
 *
 * Some Esri services have human-readable labels in their description field that don't
 * appear in the renderer's uniqueValueInfos. This is particularly common when a WebMap
 * uses the wrong field for symbology, but the service's description contains the correct
 * detailed labels for a different field.
 *
 * Example use case: Land Use layer
 * - WebMap uses c_dig1 (8 categories, wrong field)
 * - Service renderer uses c_dig2 (16 categories, correct field)
 * - Service description has detailed labels: "11 Residential Low Density", "22 Commercial Business/Professional"
 * - Without parsing description, we'd only get numeric labels like "11", "22"
 * - By parsing description, we get the full human-readable labels
 *
 * Format expected in description field:
 * ```
 * 11 Residential Low Density
 * 12 Residential Medium
 * 13 Residential High
 * 21 Commercial Consumer
 * ...
 * ```
 *
 * The pattern matches 1-3 digit codes followed by a space and label text.
 * This works for hierarchical coding systems (1-digit, 2-digit, 3-digit categories).
 *
 * @param description The service description field (typically from serviceData.description)
 * @returns Map of code values (as strings) to descriptive labels
 */
function parseServiceDescription(description: string | undefined): Map<string, string> {
  const labelMap = new Map<string, string>();

  if (!description) {
    return labelMap;
  }

  // Split by newlines and parse each line
  const lines = description.split('\n');

  // Match lines like "11 Residential Low Density" or "3 Commercial" (1-3 digits, space, label)
  const codePattern = /^(\d{1,3})\s+(.+)$/;

  for (const line of lines) {
    const match = line.trim().match(codePattern);
    if (match) {
      const [, code, label] = match;
      // Store as string → string mapping (codes are always treated as strings for MapLibre match expressions)
      if (code && label) {
        labelMap.set(code, label.trim());
      }
    }
  }

  return labelMap;
}

/**
 * Fetch drawing info and description from a feature service
 *
 * This function is called in two scenarios:
 *
 * 1. **Missing renderer**: When a layer has NO renderer in the WebMap (e.g., City Limits)
 *    - WebMap's layerDefinition.drawingInfo.renderer is undefined
 *    - Need to fetch the service's default renderer to know how to style the layer
 *
 * 2. **Incorrect renderer**: When a layer is in USE_SERVICE_RENDERER array (e.g., Land Use)
 *    - WebMap has a renderer but it uses the wrong field or has wrong symbology
 *    - Service's default renderer has the correct field and colors
 *    - Service's description may have human-readable labels not in the renderer
 *
 * The function returns BOTH drawingInfo and description because:
 * - drawingInfo provides the renderer (field, colors, uniqueValueInfos)
 * - description may contain additional human-readable labels (e.g., "11 Residential Low Density")
 *   that aren't in the renderer's uniqueValueInfos (which might just say "11")
 *
 * Example return for Land Use service:
 * ```json
 * {
 *   "drawingInfo": {
 *     "renderer": {
 *       "type": "uniqueValue",
 *       "field1": "c_dig2",
 *       "uniqueValueInfos": [
 *         { "value": "11", "label": "11", "symbol": {...} },
 *         { "value": "22", "label": "22", "symbol": {...} }
 *       ]
 *     }
 *   },
 *   "description": "11 Residential Low Density\n12 Residential Medium\n22 Commercial Business/Professional\n..."
 * }
 * ```
 *
 * @param serviceUrl The feature service URL (e.g., "https://services.arcgis.com/.../FeatureServer/0")
 * @returns Promise resolving to object with drawingInfo and optional description, or null if fetch fails
 */
async function fetchServiceDrawingInfo(serviceUrl: string): Promise<{ drawingInfo: EsriDrawingInfo; description?: string } | null> {
  try {
    console.log(`[Transformer] Fetching service metadata from: ${serviceUrl}`);
    const response = await fetch(`${serviceUrl}?f=json`);

    if (!response.ok) {
      console.warn(`[Transformer] Failed to fetch service metadata: ${response.status}`);
      return null;
    }

    const serviceData = await response.json();
    if (!serviceData.drawingInfo) {
      return null;
    }

    // Return both drawingInfo (for renderer) and description (for custom labels)
    return {
      drawingInfo: serviceData.drawingInfo,
      description: serviceData.description
    };
  } catch (error) {
    console.error(`[Transformer] Error fetching service metadata:`, error);
    return null;
  }
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
export async function transformWebMapToLayerConfigs(webMapJson: EsriWebMap): Promise<LayerConfig[]> {
  const operationalLayers = webMapJson.operationalLayers || [];
  const configs: LayerConfig[] = [];

  // USE_SERVICE_RENDERER: Layers where WebMap renderer is incorrect
  //
  // Add layer titles to this array when the WebMap has the wrong symbology and you want
  // to use the service's default renderer instead. This is a manual override mechanism.
  //
  // Why this is needed:
  // - Sometimes a WebMap is configured with the wrong field for symbology
  // - Or the WebMap uses a simplified/incorrect color scheme
  // - The FeatureServer's default renderer has the correct configuration
  //
  // Example: 'Zoning and Planning_Land Use'
  // - WebMap uses field: c_dig1 (8 categories) - WRONG
  // - Service uses field: c_dig2 (16 categories) - CORRECT
  // - Service description has labels: "11 Residential Low Density", etc.
  // - By adding to this array, we fetch service renderer AND parse description for labels
  //
  // This is different from layers with NO renderer in WebMap (like City Limits):
  // - Those are automatically detected and fetch from service (no need to add here)
  // - This array is only for layers that HAVE a renderer but it's WRONG
  //
  // What happens when a layer is in this array:
  // 1. Ignore WebMap's renderer completely
  // 2. Fetch service metadata (renderer + description)
  // 3. Parse description for custom labels (e.g., "11 Residential Low Density")
  // 4. Merge service renderer (field/colors) with parsed labels
  // 5. Result: correct field, correct colors, human-readable labels
  const USE_SERVICE_RENDERER: string[] = ['Zoning and Planning_Land Use'];

  console.log('🔄 [Transformer] ===== STARTING FRESH TRANSFORMATION =====');
  console.log('[Transformer] Starting transformation of', operationalLayers.length, 'layers');

  for (const layer of operationalLayers) {
    // Skip layers without URLs (like group layers)
    if (!layer.url) {
      console.log(`Skipping layer without URL: ${layer.title}`);
      continue;
    }

    // Skip layers with specific itemId that are under construction
    // This itemId (4f39b829b96d437da9231727d9c91fab) is shared by 6 incomplete L&I violation layers:
    // - Licenses and Inspections - Violations (All) (under construction)
    // - Rental License Violations (under construction)
    // - Property Maintenance Violations (under construction)
    // - Construction Violations (under construction)
    // - C&I Fire Violations (under construction)
    // - Business Violations (under construction)
    // The production app filters these out but keeps "Vacancy Violations (under construction)"
    // which has a different itemId (0c88f402894440ca8b8005fdc71f5366)
    if (layer.itemId === '4f39b829b96d437da9231727d9c91fab') {
      console.log(`Skipping layer with under-construction itemId: ${layer.title}`);
      continue;
    }

    console.log('[Transformer] Processing layer:', layer.title);
    console.log(`[Transformer] Layer "${layer.title}" - Renderer type:`, layer.layerDefinition?.drawingInfo?.renderer?.type);

    try {
      // Get drawingInfo - either from WebMap or fetch from service
      let drawingInfo = layer.layerDefinition?.drawingInfo;
      let serviceLabelMap: Map<string, string> | undefined;

      // HYBRID APPROACH: Use service renderer + description when needed
      // This handles three scenarios:
      //
      // Scenario 1: Missing drawingInfo entirely in WebMap
      //   - WebMap has no layerDefinition.drawingInfo at all
      //   - Need to fetch service's default renderer to know how to style the layer
      //
      // Scenario 2: Missing renderer in WebMap (e.g., City Limits, Street Condition Index)
      //   - WebMap has drawingInfo but no renderer inside it
      //   - Need to fetch service's default renderer to know how to style the layer
      //   - Example: Street Condition Index has classBreaks renderer in service but not in WebMap
      //
      // Scenario 3: Incorrect renderer in WebMap (layers in USE_SERVICE_RENDERER array)
      //   - WebMap has a renderer but it's wrong (wrong field, wrong colors)
      //   - Service has the correct renderer
      //   - Service description may have human-readable labels that aren't in the renderer
      //   - Example: Land Use uses c_dig1 in WebMap (wrong), c_dig2 in service (correct)
      //
      // When fetching from service, we get:
      //   - drawingInfo.renderer (correct field, colors, symbols)
      //   - description (human-readable labels like "11 Residential Low Density")
      //
      // The parsed labels from description override the renderer's labels, creating a hybrid:
      //   - Field and colors from service renderer
      //   - Labels from service description (if available) or renderer labels (fallback)
      const needsServiceRenderer = !drawingInfo || !drawingInfo.renderer;
      const forceServiceRenderer = USE_SERVICE_RENDERER.includes(layer.title);

      if ((needsServiceRenderer || forceServiceRenderer) && layer.url) {
        if (forceServiceRenderer) {
          console.log(`[Transformer] Layer "${layer.title}" configured to use service renderer instead of WebMap renderer`);
        } else {
          console.log(`[Transformer] Layer "${layer.title}" has no renderer in WebMap, fetching from service...`);
        }

        const serviceData = await fetchServiceDrawingInfo(layer.url);
        if (serviceData) {
          drawingInfo = serviceData.drawingInfo;
          console.log(`[Transformer] Fetched renderer from service for "${layer.title}":`, serviceData.drawingInfo?.renderer?.type);

          // Parse description for custom labels (if description exists and is parseable)
          // This allows us to merge service renderer (field/colors) with custom labels (from description)
          if (serviceData.description) {
            serviceLabelMap = parseServiceDescription(serviceData.description);
            if (serviceLabelMap.size > 0) {
              console.log(`[Transformer] Parsed ${serviceLabelMap.size} custom labels from service description`);
            }
          }
        } else {
          console.warn(`[Transformer] Failed to fetch renderer from service for "${layer.title}"`);
        }
      }

      // Transform renderer to get paint styles and legend
      // Pass serviceLabelMap to merge custom labels with renderer
      // The customLabelMap takes precedence: customLabel || rendererLabel || value
      const { paint, legend, geomType, outlinePaint } = transformEsriRenderer(
        drawingInfo,
        layer.opacity,
        serviceLabelMap,
        layer.title
      );

      console.log(`[Transformer] Layer "${layer.title}" - Result: geomType=${geomType}, hasOutlinePaint=${!!outlinePaint}`);

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

      // Determine effective opacity for the slider
      // For fill layers with transparent fills (alpha=0), use layer opacity for outline visibility
      // The fill will always stay at 0, but the slider controls the outline
      let effectiveOpacity = layer.opacity ?? 1;

      // Build layer config
      const config: LayerConfig = {
        id: layerId,
        title: displayTitle,
        type: geomType,
        url: layer.url,
        opacity: effectiveOpacity,
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

  // Sort configs alphabetically by title to match static layer order
  configs.sort((a, b) => a.title.localeCompare(b.title));

  return configs;
}
