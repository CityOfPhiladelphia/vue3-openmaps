/**
 * Vending Special Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Special_Districts/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const vendingSpecialDistricts = {
  id: "vending-special-districts",
  title: "Vending Special Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Special_Districts/FeatureServer/0",
  opacity: 0.56,

  paint: {
      "fill-color": "#ffaa00",
      "fill-opacity": 0.56
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#ffaa00",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Vending Special District: {neigh_busi}",
      "fields": [
          {
              "field": "location",
              "label": "Details"
          },
          {
              "field": "code_ref",
              "label": "Code Ref"
          }
      ]
  },
};
