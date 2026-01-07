/**
 * Healthy Start - Maternal, Child, and Family Centers
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Healthy_Start_CRCs/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const healthyStartMaternalChildAndFamilyCenters = {
  id: "healthy-start-maternal-child-and-family-centers",
  title: "Healthy Start - Maternal, Child, and Family Centers",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Healthy_Start_CRCs/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#8400c6",
      "circle-radius": 10.499999999999998,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#8400c6",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Maternal/Child/Family Center: {facility_name}",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "city",
              "label": "City"
          },
          {
              "field": "state",
              "label": "State"
          },
          {
              "field": "zip",
              "label": "Zip"
          },
          {
              "field": "phone",
              "label": "Phone"
          },
          {
              "field": "days_open",
              "label": "Days Open"
          },
          {
              "field": "hours",
              "label": "Hours"
          }
      ]
  },
};
