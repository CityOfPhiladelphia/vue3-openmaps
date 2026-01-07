/**
 * Recycling Diversion Rate
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Recycling_Diversion_Rate/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const recyclingDiversionRate = {
  id: "recycling-diversion-rate",
  title: "Recycling Diversion Rate",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Recycling_Diversion_Rate/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": [
          "step",
          [
              "get",
              "score"
          ],
          "#e6eecf",
          16,
          "#9bc4c1",
          20,
          "#69a8b7",
          24,
          "#4b7e98",
          28.199999999999996,
          "#2e557a"
      ],
      "fill-opacity": 0.8,
      "fill-outline-color": "rgba(255, 255, 255, 0.50)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#e6eecf",
          "label": "12.5 to 16"
      },
      {
          "type": "fill",
          "color": "#9bc4c1",
          "label": "> 16 to 20"
      },
      {
          "type": "fill",
          "color": "#69a8b7",
          "label": "> 20 to 24"
      },
      {
          "type": "fill",
          "color": "#4b7e98",
          "label": "> 24 to 28.1"
      },
      {
          "type": "fill",
          "color": "#2e557a",
          "label": "> 28.1 to 32"
      }
  ],

  popup: {
      "title": "Recycling Diversion Rate",
      "fields": [
          {
              "field": "score",
              "label": "Score"
          }
      ]
  },
};
