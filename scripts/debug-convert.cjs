// Test convertSimpleRenderer logic
function hasVisibleOutline(outline) {
  if (!outline) return false;
  if (outline.style === 'esriSLSNull') return false;
  if (outline.color === null) return false;
  return true;
}

const symbol = {
  "color": [0, 0, 0, 0],
  "outline": {
    "color": [102, 102, 102, 255],
    "width": 2.25,
    "type": "esriSLS",
    "style": "esriSLSSolid"
  },
  "type": "esriSFS",
  "style": "esriSFSSolid"
};

console.log('hasVisibleOutline:', hasVisibleOutline(symbol.outline));
console.log('outlineWidth:', symbol.outline.width);
console.log('outlineWidth > 1:', symbol.outline.width > 1);

if (hasVisibleOutline(symbol.outline)) {
  const outlineWidth = symbol.outline.width || 1;
  console.log('Calculated outlineWidth:', outlineWidth);
  if (outlineWidth > 1) {
    console.log('Should create outlinePaint!');
  } else {
    console.log('Width <= 1, no outlinePaint');
  }
}
