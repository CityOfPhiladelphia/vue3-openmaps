/**
 * Heat Exposure by Census Tract
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HEAT_EXPOSURE_CENSUS_TRACT/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const heatExposureByCensusTract = {
  id: "heat-exposure-by-census-tract",
  title: "Heat Exposure by Census Tract",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HEAT_EXPOSURE_CENSUS_TRACT/FeatureServer/0",
  opacity: 0.8,

  paint: {
      "fill-color": [
          "step",
          [
              "get",
              "HEI_SCORE"
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
      "title": "GEOID10: {GEOID10}",
      "fields": [
          {
              "field": "HEI_SCORE",
              "label": "Heat Exposure"
          },
          {
              "field": "HSI_SCORE",
              "label": "Sensitivity to Heat"
          },
          {
              "field": "HVI_SCORE",
              "label": "Heat Vulnerability"
          }
      ]
  },
};
