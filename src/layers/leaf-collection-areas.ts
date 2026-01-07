/**
 * Leaf Collection Areas
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Leaf_Collection_Areas/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const leafCollectionAreas = {
  id: "leaf-collection-areas",
  title: "Leaf Collection Areas",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Leaf_Collection_Areas/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.8,
      "fill-outline-color": "#666666"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#888888",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Leaf Collection Area",
      "fields": [
          {
              "field": "schedule",
              "label": "Schedule"
          }
      ]
  },
};
