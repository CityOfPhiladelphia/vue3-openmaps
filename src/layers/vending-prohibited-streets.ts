/**
 * Vending Prohibited Streets
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Prohibited_Streets/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const vendingProhibitedStreets = {
  id: "vending-prohibited-streets",
  title: "Vending Prohibited Streets",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vending_Prohibited_Streets/FeatureServer/0",
  opacity: 1,

  paint: {
      "line-color": "#a80000",
      "line-width": 1.5,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#a80000",
          "width": 1.5,
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Vending Prohibited Street: {stname}",
      "fields": [
          {
              "field": "stname",
              "label": "Street Name"
          },
          {
              "field": "st_side",
              "label": "Street Side"
          },
          {
              "field": "area_1",
              "label": "Area"
          },
          {
              "field": "code_ref",
              "label": "Code Ref"
          }
      ]
  },
};
