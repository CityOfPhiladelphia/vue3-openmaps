/**
 * Neighborhood Energy Centers
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Neighborhood_Energy_Centers/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const neighborhoodEnergyCenters = {
  id: "neighborhood-energy-centers",
  title: "Neighborhood Energy Centers",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Neighborhood_Energy_Centers/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#f3c613",
      "circle-radius": 7.498125,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f3c613",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Neighborhood Energy Center",
      "fields": [
          {
              "field": "organization",
              "label": "Organization"
          },
          {
              "field": "street_address",
              "label": "Street Address"
          },
          {
              "field": "zip_code",
              "label": "Zipcode"
          },
          {
              "field": "phone_number",
              "label": "Phone Number"
          },
          {
              "field": "website_url",
              "label": "URL"
          }
      ]
  },
};
