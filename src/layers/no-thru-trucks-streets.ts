/**
 * No-thru-Trucks Streets
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/No_thru_Trucks/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const noThruTrucksStreets = {
  id: "no-thru-trucks-streets",
  title: "No-thru-Trucks Streets",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/No_thru_Trucks/FeatureServer/0",
  opacity: 1,

  paint: {
      "line-color": "#666666",
      "line-width": 3,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#666666",
          "width": 3,
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Non-Thru Street for Trucks",
      "fields": [
          {
              "field": "stname",
              "label": "Street"
          },
          {
              "field": "from_",
              "label": "From"
          },
          {
              "field": "to_",
              "label": "To"
          }
      ]
  },
};
