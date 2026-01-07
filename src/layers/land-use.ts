/**
 * Land Use
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Land_Use/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const landUse = {
  id: "land-use",
  title: "Land Use",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Land_Use/FeatureServer/0",
  where: "c_dig1 <> 5",
  opacity: 1,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "c_dig2"
          ],
          11,
          "#ffffcc",
          12,
          "#f7ff14",
          13,
          "#ffaa00",
          21,
          "#e60000",
          22,
          "#a60000",
          23,
          "#e6957a",
          31,
          "#8800ff",
          41,
          "#0073ff",
          51,
          "#cccccc",
          61,
          "#00ffe5",
          62,
          "#9bccb3",
          71,
          "#66cc00",
          72,
          "#ffffcc",
          81,
          "#f7ff14",
          91,
          "#ffaa00",
          92,
          "#e60000",
          "#888888"
      ],
      "fill-opacity": 1,
      "fill-outline-color": "#6e6e6e"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#ffffcc",
          "label": "11 Residential Low"
      },
      {
          "type": "fill",
          "color": "#f7ff14",
          "label": "12 Residential Medium"
      },
      {
          "type": "fill",
          "color": "#ffaa00",
          "label": "13 Residential High"
      },
      {
          "type": "fill",
          "color": "#e60000",
          "label": "21 Commercial Consumer"
      },
      {
          "type": "fill",
          "color": "#a60000",
          "label": "22 Commercial Business/Professional"
      },
      {
          "type": "fill",
          "color": "#e6957a",
          "label": "23 Commercial Mixed Residential"
      },
      {
          "type": "fill",
          "color": "#8800ff",
          "label": "31 Industrial"
      },
      {
          "type": "fill",
          "color": "#0073ff",
          "label": "41 Civic/Institution"
      },
      {
          "type": "fill",
          "color": "#cccccc",
          "label": "51 Greened ROW"
      },
      {
          "type": "fill",
          "color": "#00ffe5",
          "label": "61 Culture/Amusement"
      },
      {
          "type": "fill",
          "color": "#9bccb3",
          "label": "62 Active Recreation"
      },
      {
          "type": "fill",
          "color": "#66cc00",
          "label": "71 Park/Open Space"
      },
      {
          "type": "fill",
          "color": "#ffffcc",
          "label": "72 Cemetery"
      },
      {
          "type": "fill",
          "color": "#f7ff14",
          "label": "81 Water"
      },
      {
          "type": "fill",
          "color": "#ffaa00",
          "label": "91 Vacant"
      },
      {
          "type": "fill",
          "color": "#e60000",
          "label": "92 Other/Unknown"
      }
  ],

  popup: {
      "title": "{C_DIG1}",
      "fields": [
          {
              "field": "objectid",
              "label": "OBJECTID"
          },
          {
              "field": "c_dig1desc",
              "label": "c_Dig1 Description"
          },
          {
              "field": "c_dig2desc",
              "label": "c_Dig2 Description"
          },
          {
              "field": "c_dig3desc",
              "label": "c_Dig3 Description"
          },
          {
              "field": "year",
              "label": "Year"
          },
          {
              "field": "vacbldg",
              "label": "Vacant Building"
          }
      ]
  },
};
