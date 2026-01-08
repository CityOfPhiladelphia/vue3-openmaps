/**
 * Census Tracts - 2020
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Census_Tracts_2020/FeatureServer/0
 */

import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";

export const censusTracts2020 = {
  id: "census-tracts-2020",
  title: "Census Tracts - 2020",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Census_Tracts_2020/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "#888888",
      "fill-opacity": 1,
      "fill-outline-color": "#474747"
  } as FillLayerSpecification["paint"],

  outlinePaint: {
      "line-color": "#474747",
      "line-width": 1.5
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#888888",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Census Tract {NAME}",
      "fields": [
          {
              "field": "NAME",
              "label": "NAME"
          },
          {
              "field": "GEOID",
              "label": "GEOID"
          },
          {
              "field": "STATEFP",
              "label": "STATEFP"
          },
          {
              "field": "COUNTYFP",
              "label": "COUNTYFP"
          }
      ]
  },
};
