/**
 * Vacant Building Indicators
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Bldg/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const vacantBuildingIndicators = {
  id: "vacant-building-indicators",
  title: "Vacant Building Indicators",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Bldg/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": "#ff0000",
      "fill-opacity": 0.8
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#ff0000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Likely Vacant Building: {address}",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "owner1",
              "label": "Owner 1"
          },
          {
              "field": "owner2",
              "label": "Owner 2"
          },
          {
              "field": "bldg_desc",
              "label": "Building Description"
          }
      ]
  },
};
