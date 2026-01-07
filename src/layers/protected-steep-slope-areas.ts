/**
 * Protected Steep Slope Areas
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_SteepSlopeProtectArea_r/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const protectedSteepSlopeAreas = {
  id: "protected-steep-slope-areas",
  title: "Protected Steep Slope Areas",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_SteepSlopeProtectArea_r/FeatureServer/0",
  opacity: 0.75,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.25)",
      "fill-opacity": 0.75,
      "fill-outline-color": "#000000"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.25)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Protected Steep Slope Area",
      "fields": [
          {
              "field": "regulation",
              "label": "Regulation"
          },
          {
              "field": "code_secti",
              "label": "Code Section"
          },
          {
              "field": "code_sec_1",
              "label": "Code Link"
          }
      ]
  },
};
