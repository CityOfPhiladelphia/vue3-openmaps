function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const outlinePaint = { 'line-color': '#666666', 'line-width': 2.25 };
const maplibreType = 'fill';

const outlinePaintLine = outlinePaint
  ? `\n\n  outlinePaint: ${JSON.stringify(outlinePaint, null, 4).replace(/\n/g, '\n  ')} as LineLayerSpecification["paint"],`
  : '';

const imports = outlinePaint
  ? `import type { ${capitalize(maplibreType)}LayerSpecification, LineLayerSpecification } from "maplibre-gl";`
  : `import type { ${capitalize(maplibreType)}LayerSpecification } from "maplibre-gl";`;

console.log('=== outlinePaintLine ===');
console.log(outlinePaintLine);
console.log('=== imports ===');
console.log(imports);
console.log('=== Full template output ===');

const content = `/**
 * Test
 */

${imports}

export const test = {
  id: "test",
  paint: {} as FillLayerSpecification["paint"],${outlinePaintLine}

  legend: [],
};
`;

console.log(content);
