/**
 * Rubbish and Recycling Collection Schedule
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Rubbish_Recyc_Coll_Bnd/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const rubbishAndRecyclingCollectionSchedule = {
  id: "rubbish-and-recycling-collection-schedule",
  title: "Rubbish and Recycling Collection Schedule",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Rubbish_Recyc_Coll_Bnd/FeatureServer/0",
  opacity: 0.57,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "collday"
          ],
          "MON",
          "#d7e37d",
          "TUE",
          "#2892c7",
          "WED",
          "#8cb8a4",
          "THU",
          "#f77a2d",
          "FRI",
          "#fccf51",
          " ",
          "#888888",
          "#888888"
      ],
      "fill-opacity": 0.57
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#d7e37d",
          "label": "MON"
      },
      {
          "type": "fill",
          "color": "#2892c7",
          "label": "TUE"
      },
      {
          "type": "fill",
          "color": "#8cb8a4",
          "label": "WED"
      },
      {
          "type": "fill",
          "color": "#f77a2d",
          "label": "THU"
      },
      {
          "type": "fill",
          "color": "#fccf51",
          "label": "FRI"
      },
      {
          "type": "fill",
          "color": "#888888",
          "label": " "
      }
  ],

  popup: {
      "title": "Rubbish/Recycling Collection on - {collday}",
      "fields": []
  },
};
