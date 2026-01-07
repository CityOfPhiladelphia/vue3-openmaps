/**
 * Elementary School Catchments
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/SchoolDist_Catchments_ES/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const elementarySchoolCatchments = {
  id: "elementary-school-catchments",
  title: "Elementary School Catchments",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/SchoolDist_Catchments_ES/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 1,
      "fill-outline-color": "#666666"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Elementary School Catchment",
      "fields": [
          {
              "field": "es_name",
              "label": "Name"
          },
          {
              "field": "es_grade",
              "label": "Grades"
          }
      ]
  },
};
