/**
 * Vital Statistics - Population by District
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vital_Population_PD/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const vitalStatisticsPopulationByDistrict = {
  id: "vital-statistics-population-by-district",
  title: "Vital Statistics - Population by District",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vital_Population_PD/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": [
          "step",
          [
              "get",
              "count_all_races_ethnicities"
          ],
          "#aaaaaa"
      ],
      "fill-opacity": 0.8,
      "fill-outline-color": "rgba(194, 194, 194, 0.25)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#aaaaaa",
          "label": "9007199254740991"
      }
  ],

  popup: {
      "title": "{geography_name}",
      "fields": [
          {
              "field": "year",
              "label": "Year",
              "format": {
                  "digitSeparator": false,
                  "places": 0
              }
          },
          {
              "field": "count_all_races_ethnicities",
              "label": "Population count - all races and ethnicities",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "count_asian_pi_nh",
              "label": "Count of Non-Hispanic Asian and Pacific Islander",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "count_black_nh",
              "label": "Count of Non-Hispanic Black",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "count_hispanic",
              "label": "Count of Hispanic",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "count_white_nh",
              "label": "Count of Non-Hispanic White",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "percent_asian_pi_nh",
              "label": "Percent of Population Non-Hispanic Asian and Pacific Islander",
              "format": {
                  "digitSeparator": false,
                  "places": 2
              }
          },
          {
              "field": "percent_black_nh",
              "label": "Percent of Population Non-Hispanic Black",
              "format": {
                  "digitSeparator": false,
                  "places": 2
              }
          },
          {
              "field": "percent_hispanic",
              "label": "Percent of Population Hispanic",
              "format": {
                  "digitSeparator": false,
                  "places": 2
              }
          },
          {
              "field": "percent_white_nh",
              "label": "Percent of Population Non-Hispanic White",
              "format": {
                  "digitSeparator": false,
                  "places": 2
              }
          }
      ]
  },
};
