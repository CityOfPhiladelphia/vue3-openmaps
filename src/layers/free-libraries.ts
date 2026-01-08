/**
 * Free Libraries
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const freeLibraries = {
  id: "free-libraries",
  title: "Free Libraries",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0",
  where: "asset_group1 = 'A8'",
  opacity: 1,

  paint: {
      "circle-color": "#0070ff",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#0070ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Free Library",
      "fields": [
          {
              "field": "asset_name",
              "label": "Name"
          },
          {
              "field": "asset_addr",
              "label": "Address"
          }
      ]
  },
};
