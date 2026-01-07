/**
 * Vacant Land Indicators
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Land/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const vacantLandIndicators = {
  id: "vacant-land-indicators",
  title: "Vacant Land Indicators",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Land/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": "#0070ff",
      "fill-opacity": 0.8
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#0070ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Likely Vacant Land: {ADDRESS}",
      "fields": [
          {
              "field": "ADDRESS",
              "label": "Address"
          },
          {
              "field": "OWNER1",
              "label": "Owner 1"
          },
          {
              "field": "OWNER2",
              "label": "Owner 2"
          }
      ]
  },
};
