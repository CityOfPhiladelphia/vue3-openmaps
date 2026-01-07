/**
 * Census Block Groups - 2020
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Census_Block_Groups_2020/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const censusBlockGroups2020 = {
  id: "census-block-groups-2020",
  title: "Census Block Groups - 2020",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Census_Block_Groups_2020/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 1,
      "fill-outline-color": "#828282"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Census Block Group {BLKGRPCE}",
      "fields": [
          {
              "field": "BLKGRPCE",
              "label": "BLKGRPCE"
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
          },
          {
              "field": "TRACTCE",
              "label": "TRACTCE"
          }
      ]
  },
};
