/**
 * Vending Prohibited Areas
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Prohibited_Areas/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const vendingProhibitedAreas = {
  id: "vending-prohibited-areas",
  title: "Vending Prohibited Areas",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Prohibited_Areas/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(168, 0, 0, 0.35)",
      "fill-opacity": 1
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(168, 0, 0, 0.35)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Vending Prohibited Area",
      "fields": [
          {
              "field": "LOCATION",
              "label": "Location"
          },
          {
              "field": "CODE_REF",
              "label": "Code Reference"
          },
          {
              "field": "REMARKS",
              "label": "Remarks"
          }
      ]
  },
};
