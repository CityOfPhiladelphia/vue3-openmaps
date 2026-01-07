/**
 * Wire Wastebaskets
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WasteBaskets_Wire/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const wireWastebaskets = {
  id: "wire-wastebaskets",
  title: "Wire Wastebaskets",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WasteBaskets_Wire/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#a80000",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#a80000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Wire Wastebasket",
      "fields": [
          {
              "field": "ADDRESS",
              "label": "Address"
          },
          {
              "field": "CORNERSIDE",
              "label": "Corner"
          }
      ]
  },
};
