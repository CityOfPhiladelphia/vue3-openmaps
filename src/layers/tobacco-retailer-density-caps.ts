/**
 * Tobacco Retailer Density Caps
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/TobRetailerDensityCaps/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const tobaccoRetailerDensityCaps = {
  id: "tobacco-retailer-density-caps",
  title: "Tobacco Retailer Density Caps",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/TobRetailerDensityCaps/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "Tobacco Retailer Density Caps - Planning District:{planningdistrict}",
      "fields": [
          {
              "field": "planningdistrict",
              "label": "Planning District"
          },
          {
              "field": "totalretailers",
              "label": "Total Retailers",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "daytimepop",
              "label": "Daytime Population",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "retailersper1000dp",
              "label": "Retailers per 1000DP",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "maxretailers",
              "label": "Max Retailers",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "remainingslots",
              "label": "Remaining Slots",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          }
      ]
  },
};
