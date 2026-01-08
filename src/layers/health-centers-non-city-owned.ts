/**
 * Health Centers (non-city owned)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Health_Centers/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const healthCentersNonCityOwned = {
  id: "health-centers-non-city-owned",
  title: "Health Centers (non-city owned)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Health_Centers/FeatureServer/0",
  where: "organization <> 'PDPH'",
  opacity: 1,

  paint: {
      "circle-color": "#2176d2",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#2176d2",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Health Center (non-city owned): {name}",
      "fields": [
          {
              "field": "name",
              "label": "Name"
          },
          {
              "field": "organization",
              "label": "Organization"
          },
          {
              "field": "full_address",
              "label": "Address"
          },
          {
              "field": "zip",
              "label": "Zip",
              "format": {
                  "digitSeparator": false,
                  "places": 0
              }
          },
          {
              "field": "phone",
              "label": "Phone"
          },
          {
              "field": "dental_phone",
              "label": "Dental Phone"
          },
          {
              "field": "website",
              "label": "Website"
          }
      ]
  },
};
