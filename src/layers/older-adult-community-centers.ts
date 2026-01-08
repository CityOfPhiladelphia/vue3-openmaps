/**
 * Older Adult Community Centers
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const olderAdultCommunityCenters = {
  id: "older-adult-community-centers",
  title: "Older Adult Community Centers",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0",
  where: "asset_subtype1 = 'C38'",
  opacity: 1,

  paint: {
      "circle-color": "#8400a8",
      "circle-radius": 8.52,
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
      "title": "Adult Community Center",
      "fields": [
          {
              "field": "site_name",
              "label": "Name"
          },
          {
              "field": "asset_addr",
              "label": "Address"
          }
      ]
  },
};
