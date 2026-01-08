/**
 * Middle School Catchments
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/SchoolDist_Catchments_MS/FeatureServer/0
 */

import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";

export const middleSchoolCatchments = {
  id: "middle-school-catchments",
  title: "Middle School Catchments",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/SchoolDist_Catchments_MS/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 1,
      "fill-outline-color": "#666666"
  } as FillLayerSpecification["paint"],

  outlinePaint: {
      "line-color": "#666666",
      "line-width": 2.25
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Middle School Catchment",
      "fields": [
          {
              "field": "ms_name",
              "label": "Name"
          },
          {
              "field": "ms_grade",
              "label": "Grades"
          }
      ]
  },
};
