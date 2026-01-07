/**
 * Webmap Converter Script
 *
 * Converts an Esri Classic WebMap JSON into individual TypeScript layer config files
 * for use with MapLibre GL JS.
 *
 * Usage: node scripts/convert-webmap.js <webmap-id> [output-dir]
 *
 * Example: node scripts/convert-webmap.js 1596df70df0349e293ceec46a06ccc50 ./src/layers
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const WEBMAP_ID = process.argv[2] || '1596df70df0349e293ceec46a06ccc50';
const OUTPUT_DIR = process.argv[3] || './src/layers';
const WEBMAP_URL = `https://phl.maps.arcgis.com/sharing/rest/content/items/${WEBMAP_ID}/data?f=json`;

// ============================================================================
// COLOR CONVERSION
// ============================================================================

/**
 * Convert Esri RGBA array [r, g, b, a] to CSS rgba() or hex
 * Esri alpha is 0-255, CSS is 0-1
 */
function esriColorToCSS(color) {
  if (!color || !Array.isArray(color)) return '#888888';

  const [r, g, b, a = 255] = color;
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
function convertOpacity(opacity) {
  return opacity !== undefined ? opacity : 1;
}

// ============================================================================
// GEOMETRY TYPE DETECTION
// ============================================================================

/**
 * Detect geometry type from Esri symbol type
 */
function detectGeometryType(symbol) {
  if (!symbol) return 'fill';

  switch (symbol.type) {
    case 'esriSFS': // Simple Fill Symbol
      return 'fill';
    case 'esriSLS': // Simple Line Symbol
      return 'line';
    case 'esriSMS': // Simple Marker Symbol
      return 'circle';
    case 'esriPMS': // Picture Marker Symbol
      return 'symbol';
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
function hasVisibleOutline(outline) {
  if (!outline) return false;
  if (outline.style === 'esriSLSNull') return false;
  if (outline.color === null) return false;
  return true;
}

/**
 * Convert Esri Simple renderer to MapLibre paint
 */
function convertSimpleRenderer(renderer, layerOpacity) {
  const symbol = renderer.symbol;
  const geomType = detectGeometryType(symbol);

  let paint = {};
  let legend = [];

  if (geomType === 'fill' && symbol) {
    paint = {
      'fill-color': esriColorToCSS(symbol.color),
      'fill-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(symbol.outline)) {
      paint['fill-outline-color'] = esriColorToCSS(symbol.outline.color);
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
    // Use size * 0.75 as a reasonable conversion (size/2 * 1.5 for point-to-pixel)
    const radius = (symbol.size || 6) * 0.75;

    paint = {
      'circle-color': esriColorToCSS(symbol.color),
      'circle-radius': radius,
      'circle-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(symbol.outline)) {
      paint['circle-stroke-color'] = esriColorToCSS(symbol.outline.color);
      paint['circle-stroke-width'] = symbol.outline.width || 1;
    }

    legend = [{
      type: 'circle',
      color: esriColorToCSS(symbol.color),
      label: renderer.label || 'Feature',
    }];
  }

  return { paint, legend, geomType };
}

/**
 * Coerce a value to handle string/number mismatches in Esri data.
 * Esri stores unique values as strings, but actual field data may be numeric.
 * Returns the numeric form if the string can be parsed as a number.
 */
function coerceMatchValue(value) {
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
 * Convert Esri UniqueValue renderer to MapLibre paint with match expression
 */
function convertUniqueValueRenderer(renderer, layerOpacity) {
  const field = renderer.field1;
  const uniqueValueInfos = renderer.uniqueValueInfos || [];
  const defaultSymbol = renderer.defaultSymbol;

  if (uniqueValueInfos.length === 0) {
    return convertSimpleRenderer({ symbol: defaultSymbol }, layerOpacity);
  }

  const firstSymbol = uniqueValueInfos[0]?.symbol || defaultSymbol;
  const geomType = detectGeometryType(firstSymbol);

  let paint = {};
  let legend = [];

  if (geomType === 'fill') {
    // Build match expression for fill-color
    const colorMatch = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'fill',
        color: esriColorToCSS(info.symbol?.color),
        label: info.label || info.value,
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
      paint['fill-outline-color'] = esriColorToCSS(firstSymbol.outline.color);
    }
  } else if (geomType === 'line') {
    const colorMatch = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'line',
        color: esriColorToCSS(info.symbol?.color),
        width: info.symbol?.width || 1,
        label: info.label || info.value,
      });
    }

    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    paint = {
      'line-color': colorMatch,
      'line-width': firstSymbol?.width || 2,
      'line-opacity': convertOpacity(layerOpacity),
    };
  } else if (geomType === 'circle') {
    const colorMatch = ['match', ['get', field]];

    for (const info of uniqueValueInfos) {
      colorMatch.push(coerceMatchValue(info.value));
      colorMatch.push(esriColorToCSS(info.symbol?.color));

      legend.push({
        type: 'circle',
        color: esriColorToCSS(info.symbol?.color),
        label: info.label || info.value,
      });
    }

    colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : '#888888');

    // Esri size is diameter in points, MapLibre radius is in pixels
    // Use size * 0.75 as a reasonable conversion (size/2 * 1.5 for point-to-pixel)
    const radius = (firstSymbol?.size || 6) * 0.75;

    paint = {
      'circle-color': colorMatch,
      'circle-radius': radius,
      'circle-opacity': convertOpacity(layerOpacity),
    };

    if (hasVisibleOutline(firstSymbol?.outline)) {
      paint['circle-stroke-color'] = esriColorToCSS(firstSymbol.outline.color);
      paint['circle-stroke-width'] = firstSymbol.outline.width || 1;
    }
  }

  return { paint, legend, geomType };
}

/**
 * Convert Esri ClassBreaks renderer to MapLibre paint with step expression
 */
function convertClassBreaksRenderer(renderer, layerOpacity) {
  const field = renderer.field;
  const classBreakInfos = renderer.classBreakInfos || [];

  if (classBreakInfos.length === 0) {
    return { paint: {}, legend: [], geomType: 'fill' };
  }

  const firstSymbol = classBreakInfos[0]?.symbol;
  const geomType = detectGeometryType(firstSymbol);

  let paint = {};
  let legend = [];

  if (geomType === 'fill') {
    // Build step expression for fill-color
    // step format: ["step", ["get", field], color0, stop1, color1, stop2, color2, ...]
    const colorStep = ['step', ['get', field]];

    // Add first color (for values below first break)
    colorStep.push(esriColorToCSS(classBreakInfos[0]?.symbol?.color));

    for (let i = 0; i < classBreakInfos.length; i++) {
      const info = classBreakInfos[i];

      if (i > 0) {
        // Add break value and color
        colorStep.push(classBreakInfos[i - 1].classMaxValue);
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

    if (firstSymbol?.outline) {
      paint['fill-outline-color'] = esriColorToCSS(firstSymbol.outline.color);
    }
  }

  return { paint, legend, geomType };
}

/**
 * Main renderer conversion function
 */
function convertRenderer(drawingInfo, layerOpacity) {
  if (!drawingInfo?.renderer) {
    return { paint: {}, legend: [], geomType: 'fill' };
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
      console.warn(`Unknown renderer type: ${renderer.type}`);
      return { paint: {}, legend: [], geomType: 'fill' };
  }
}

// ============================================================================
// POPUP CONVERSION
// ============================================================================

/**
 * Convert Esri popupInfo to our popup config format
 */
function convertPopupInfo(popupInfo) {
  if (!popupInfo) return null;

  const title = popupInfo.title || '';
  const fieldInfos = popupInfo.fieldInfos || [];

  // Filter to visible fields only
  const visibleFields = fieldInfos
    .filter(f => f.visible !== false)
    .map(f => ({
      field: f.fieldName,
      label: f.label || f.fieldName,
    }));

  return {
    title,
    fields: visibleFields,
  };
}

// ============================================================================
// ID/NAME GENERATION
// ============================================================================

/**
 * Convert title to a valid JavaScript identifier
 */
function titleToId(title) {
  // Remove the "Group_" prefix
  const cleanTitle = title.includes('_')
    ? title.split('_').slice(1).join('_')
    : title;

  // Convert to camelCase
  return cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-z0-9]/gi, '')
    .replace(/^[0-9]/, '_$&'); // Prefix with _ if starts with number
}

/**
 * Convert title to kebab-case for layer ID
 */
function titleToKebab(title) {
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
function getDisplayTitle(title) {
  return title.includes('_')
    ? title.split('_').slice(1).join(' ')
    : title;
}

// ============================================================================
// FILE GENERATION
// ============================================================================

/**
 * Generate TypeScript layer config file content
 */
function generateLayerFile(layer, index) {
  const { paint, legend, geomType } = convertRenderer(
    layer.layerDefinition?.drawingInfo,
    layer.opacity
  );

  const popup = convertPopupInfo(layer.popupInfo);
  const varName = titleToId(layer.title);
  const layerId = titleToKebab(layer.title);
  const displayTitle = getDisplayTitle(layer.title);

  // Get definition expression (where clause) if present
  const where = layer.layerDefinition?.definitionExpression || null;

  // Determine MapLibre layer type
  const maplibreType = geomType === 'symbol' ? 'circle' : geomType;

  // Build the where clause line
  const whereClauseLine = where ? `\n  where: ${JSON.stringify(where)},` : '';

  const content = `/**
 * ${displayTitle}
 *
 * Auto-generated from Esri WebMap
 * Source: ${layer.url}
 */

import type { ${capitalize(maplibreType)}LayerSpecification } from "maplibre-gl";

export const ${varName} = {
  id: "${layerId}",
  title: "${displayTitle}",
  type: "${maplibreType}" as const,
  url: "${layer.url}",${whereClauseLine}
  opacity: ${layer.opacity ?? 1},

  paint: ${JSON.stringify(paint, null, 4).replace(/\n/g, '\n  ')} as ${capitalize(maplibreType)}LayerSpecification["paint"],

  legend: ${JSON.stringify(legend, null, 4).replace(/\n/g, '\n  ')},

  popup: ${popup ? JSON.stringify(popup, null, 4).replace(/\n/g, '\n  ') : 'null'},
};
`;

  return {
    varName,
    fileName: `${layerId}.ts`,
    content,
    displayTitle,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate index.ts that exports all layers
 */
function generateIndexFile(layers) {
  const imports = layers.map(l =>
    `import { ${l.varName} } from "./${l.fileName.replace('.ts', '')}";`
  ).join('\n');

  const exports = layers.map(l => `  ${l.varName},`).join('\n');

  const layerList = layers.map(l => `  ${l.varName},`).join('\n');

  return `/**
 * Layer Index
 *
 * Auto-generated from Esri WebMap
 *
 * Total layers: ${layers.length}
 */

${imports}

// Re-export individual layers
export {
${exports}
};

// Export as array in display order
export const layers = [
${layerList}
];

// Export layer type
export type LayerConfig = typeof layers[number];
`;
}

/**
 * Generate types.ts with shared types
 */
function generateTypesFile() {
  return `/**
 * Layer Configuration Types
 */

export interface LegendItem {
  type: "fill" | "line" | "circle";
  color: string;
  label: string;
  width?: number;
}

export interface PopupField {
  field: string;
  label: string;
}

export interface PopupConfig {
  title: string;
  fields: PopupField[];
}

export interface LayerConfig {
  id: string;
  title: string;
  type: "fill" | "line" | "circle";
  url: string;
  where?: string;
  opacity: number;
  paint: Record<string, unknown>;
  legend: LegendItem[];
  popup: PopupConfig | null;
}
`;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log(`Fetching webmap: ${WEBMAP_ID}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  // Fetch webmap JSON
  const response = await fetch(WEBMAP_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch webmap: ${response.status}`);
  }

  const webmap = await response.json();
  const operationalLayers = webmap.operationalLayers || [];

  console.log(`Found ${operationalLayers.length} operational layers`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Convert each layer
  const layerFiles = [];

  for (let i = 0; i < operationalLayers.length; i++) {
    const layer = operationalLayers[i];

    // Skip layers without URLs (like group layers)
    if (!layer.url) {
      console.log(`Skipping layer without URL: ${layer.title}`);
      continue;
    }

    console.log(`Converting: ${layer.title}`);

    try {
      const fileInfo = generateLayerFile(layer, i);
      layerFiles.push(fileInfo);

      // Write layer file
      const filePath = path.join(OUTPUT_DIR, fileInfo.fileName);
      fs.writeFileSync(filePath, fileInfo.content);

    } catch (err) {
      console.error(`Error converting ${layer.title}:`, err.message);
    }
  }

  // Write index.ts
  const indexContent = generateIndexFile(layerFiles);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);

  // Write types.ts
  const typesContent = generateTypesFile();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'types.ts'), typesContent);

  console.log(`\nGenerated ${layerFiles.length} layer files`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('\nFiles created:');
  console.log('  - types.ts');
  console.log('  - index.ts');
  layerFiles.forEach(f => console.log(`  - ${f.fileName}`));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
