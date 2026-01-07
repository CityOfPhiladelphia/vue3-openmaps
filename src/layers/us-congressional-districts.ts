/**
 * US Congressional Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/US_Congressional_2018/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const usCongressionalDistricts = {
  id: "us-congressional-districts",
  title: "US Congressional Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/US_Congressional_2018/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "DISTRICT"
          ],
          2,
          "#fd7f6f",
          3,
          "#7eb0d5",
          5,
          "#b2e061",
          "#888888"
      ],
      "fill-opacity": 0.8,
      "fill-outline-color": "rgba(153, 153, 153, 0.25)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#fd7f6f",
          "label": "District 2"
      },
      {
          "type": "fill",
          "color": "#7eb0d5",
          "label": "District 3"
      },
      {
          "type": "fill",
          "color": "#b2e061",
          "label": "District 5"
      }
  ],

  popup: {
      "title": "US Congressional District {DISTRICT}",
      "fields": [
          {
              "field": "ID",
              "label": "ID"
          },
          {
              "field": "DISTRICT",
              "label": "DISTRICT"
          }
      ]
  },
};
