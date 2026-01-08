/**
 * Public Spraygrounds
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Spraygrounds/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const publicSpraygrounds = {
  id: "public-spraygrounds",
  title: "Public Spraygrounds",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Spraygrounds/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#2176d2",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#2176d2",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Public Sprayground",
      "fields": [
          {
              "field": "park_name",
              "label": "Park Name"
          },
          {
              "field": "spray_type",
              "label": "Type"
          },
          {
              "field": "spray_status",
              "label": "Status"
          }
      ]
  },
};
