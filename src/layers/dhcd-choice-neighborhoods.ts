/**
 * DHCD Choice Neighborhoods
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/ChoiceNeighborhoods/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const dhcdChoiceNeighborhoods = {
  id: "dhcd-choice-neighborhoods",
  title: "DHCD Choice Neighborhoods",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/ChoiceNeighborhoods/FeatureServer/0",
  opacity: 0.75,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "type"
          ],
          "Planning",
          "#ffde3e",
          "Implementation",
          "#149ece",
          "#888888"
      ],
      "fill-opacity": 0.75
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#ffde3e",
          "label": "Planning"
      },
      {
          "type": "fill",
          "color": "#149ece",
          "label": "Implementation"
      }
  ],

  popup: {
      "title": "DHCD Choice Neighborhoods",
      "fields": [
          {
              "field": "name",
              "label": "Name"
          },
          {
              "field": "type",
              "label": "Type"
          }
      ]
  },
};
