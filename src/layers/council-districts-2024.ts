/**
 * Council Districts 2024
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Council_Districts_2024/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const councilDistricts2024 = {
  id: "council-districts-2024",
  title: "Council Districts 2024",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Council_Districts_2024/FeatureServer/0",
  opacity: 0.65,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "district"
          ],
          1,
          "#ed5151",
          10,
          "#149ece",
          2,
          "#a7c636",
          3,
          "#9e559c",
          4,
          "#fc921f",
          5,
          "#ffde3e",
          6,
          "#f789d8",
          7,
          "#b7814a",
          8,
          "#3caf99",
          9,
          "#6b6bd6",
          "#888888"
      ],
      "fill-opacity": 0.65,
      "fill-outline-color": "rgba(153, 153, 153, 0.25)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#ed5151",
          "label": "1"
      },
      {
          "type": "fill",
          "color": "#149ece",
          "label": "10"
      },
      {
          "type": "fill",
          "color": "#a7c636",
          "label": "2"
      },
      {
          "type": "fill",
          "color": "#9e559c",
          "label": "3"
      },
      {
          "type": "fill",
          "color": "#fc921f",
          "label": "4"
      },
      {
          "type": "fill",
          "color": "#ffde3e",
          "label": "5"
      },
      {
          "type": "fill",
          "color": "#f789d8",
          "label": "6"
      },
      {
          "type": "fill",
          "color": "#b7814a",
          "label": "7"
      },
      {
          "type": "fill",
          "color": "#3caf99",
          "label": "8"
      },
      {
          "type": "fill",
          "color": "#6b6bd6",
          "label": "9"
      }
  ],

  popup: {
      "title": "City Council District {district}",
      "fields": []
  },
};
