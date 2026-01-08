const d = require('../webmap-data.json');
const layer = d.operationalLayers.find(l => l.title && l.title.includes('Police District'));
if (layer) {
  console.log('Police layer found:', layer.title);
  const symbol = layer.layerDefinition?.drawingInfo?.renderer?.symbol;
  console.log('Symbol:', JSON.stringify(symbol, null, 2));
  console.log('Outline:', JSON.stringify(symbol?.outline, null, 2));
  console.log('Outline width:', symbol?.outline?.width);
  console.log('Is > 1?', symbol?.outline?.width > 1);
} else {
  console.log('No Police layer found');
}
