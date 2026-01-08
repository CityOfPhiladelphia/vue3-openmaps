/**
 * Ice Rinks
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const iceRinks = {
  id: "ice-rinks",
  title: "Ice Rinks",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0",
  where: "asset_name LIKE '%Ice Rink%'",
  opacity: 1,

  paint: {
      "circle-color": "#73dfff",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#73dfff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Ice Rink",
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
