/**
 * WIC Offices
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WIC_Offices/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const wicOffices = {
  id: "wic-offices",
  title: "WIC Offices",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/WIC_Offices/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#fc8ce2",
      "circle-radius": 9.94,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#fc8ce2",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Women, Infants & Children (WIC) Office",
      "fields": [
          {
              "field": "name",
              "label": "Name"
          },
          {
              "field": "address",
              "label": "Address Line 1"
          },
          {
              "field": "address_2",
              "label": "Address Line 2"
          },
          {
              "field": "phone_number",
              "label": "Phone"
          }
      ]
  },
};
