/**
 * Hospitals
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Hospitals/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const hospitals = {
  id: "hospitals",
  title: "Hospitals",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Hospitals/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#ff73df",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ff73df",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{hospital_name}",
      "fields": [
          {
              "field": "street_address",
              "label": "Address"
          },
          {
              "field": "zip_code",
              "label": "ZipCode",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "phone_number",
              "label": "Phone Number"
          },
          {
              "field": "hospital_type",
              "label": "Hospital Type"
          }
      ]
  },
};
