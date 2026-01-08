/**
 * Commercial Corridors
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Commercial_Corridors/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const commercialCorridors = {
  id: "commercial-corridors",
  title: "Commercial Corridors",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Commercial_Corridors/FeatureServer/0",
  opacity: 0.7,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "corridor_type"
          ],
          "<Null>",
          "rgba(178, 178, 178, 0.65)",
          1,
          "rgba(252, 223, 182, 0.65)",
          2,
          "rgba(240, 161, 65, 0.65)",
          3,
          "rgba(179, 87, 7, 0.65)",
          4,
          "rgba(216, 218, 235, 0.65)",
          5,
          "rgba(152, 141, 194, 0.65)",
          6,
          "rgba(82, 39, 135, 0.65)",
          "#888888"
      ],
      "fill-opacity": 0.7,
      "fill-outline-color": "rgba(110, 110, 110, 0.00)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(178, 178, 178, 0.65)",
          "label": "Undefined"
      },
      {
          "type": "fill",
          "color": "rgba(252, 223, 182, 0.65)",
          "label": "Neighborhood Subcenter"
      },
      {
          "type": "fill",
          "color": "rgba(240, 161, 65, 0.65)",
          "label": "Neighborhood Center"
      },
      {
          "type": "fill",
          "color": "rgba(179, 87, 7, 0.65)",
          "label": "Community Center"
      },
      {
          "type": "fill",
          "color": "rgba(216, 218, 235, 0.65)",
          "label": "Regional Center"
      },
      {
          "type": "fill",
          "color": "rgba(152, 141, 194, 0.65)",
          "label": "Super-regional Center"
      },
      {
          "type": "fill",
          "color": "rgba(82, 39, 135, 0.65)",
          "label": "Specialty Center"
      }
  ],

  popup: {
      "title": "Commercial Corridor: {name}",
      "fields": [
          {
              "field": "corridor_type",
              "label": "Corridor Type",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "p_dist",
              "label": "Planning District"
          },
          {
              "field": "stage",
              "label": "Stage",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "comm_count",
              "label": "Total Count of Commercial Spaces",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "gla",
              "label": "Gross Leasable Area (estimated sq.ft.)"
          }
      ]
  },
};
