/**
 * Big Belly Wastebaskets
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WasteBaskets_Big_Belly/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const bigBellyWastebaskets = {
  id: "big-belly-wastebaskets",
  title: "Big Belly Wastebaskets",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WasteBaskets_Big_Belly/FeatureServer/0",
  minZoom: 12.18,
  opacity: 1,

  paint: {
      "circle-color": "#004da8",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#004da8",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Big Belly Wastebasket",
      "fields": [
          {
              "field": "description",
              "label": "Location"
          }
      ]
  },
};
