/**
 * Schools
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Schools/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const schools = {
  id: "schools",
  title: "Schools",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Schools/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "type"
          ],
          2,
          "#ed5151",
          4,
          "#149ece",
          1,
          "#a7c636",
          3,
          "#9e559c",
          "#aaaaaa"
      ],
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Charter"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Closed"
      },
      {
          "type": "circle",
          "color": "#a7c636",
          "label": "District"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Private"
      }
  ],

  popup: {
      "title": "{type_specific} School",
      "fields": [
          {
              "field": "school_name",
              "label": "Name"
          },
          {
              "field": "street_address",
              "label": "Address"
          },
          {
              "field": "phone_number",
              "label": "Phone"
          },
          {
              "field": "grade_org",
              "label": "Grades"
          }
      ]
  },
};
