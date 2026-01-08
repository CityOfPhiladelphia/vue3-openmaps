/**
 * Recreation Centers
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const recreationCenters = {
  id: "recreation-centers",
  title: "Recreation Centers",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0",
  where: "asset_subtype1 = 'C50'",
  minZoom: 11.88,
  opacity: 1,

  paint: {
      "circle-color": "#8400a8",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#8400a8",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Recreation Center",
      "fields": [
          {
              "field": "asset_addr",
              "label": "Address"
          },
          {
              "field": "asset_name",
              "label": "Name"
          }
      ]
  },
};
