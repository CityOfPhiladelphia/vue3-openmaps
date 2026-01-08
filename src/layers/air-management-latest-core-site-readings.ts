/**
 * Air Management Latest Core Site Readings
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const airManagementLatestCoreSiteReadings = {
  id: "air-management-latest-core-site-readings",
  title: "Air Management Latest Core Site Readings",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#f3c613",
      "circle-radius": 11.36,
      "circle-opacity": 1,
      "circle-stroke-color": "rgba(0, 0, 0, 0.00)",
      "circle-stroke-width": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f3c613",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Air Management - Latest Core Site Readings - {SITE_NAME}",
      "fields": [
          {
              "field": "SAMPLE_TIMESTAMP",
              "label": "Sample Timestamp",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "SAMPLE_HOUR",
              "label": "Sample Hour"
          },
          {
              "field": "SITE_TYPE",
              "label": "Site Type"
          },
          {
              "field": "SITE_ADDRESS",
              "label": "Address"
          },
          {
              "field": "CARBON_MONOXIDE_PPM",
              "label": "Carbon Monoxide (ppm)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "NITROGEN_DIOXIDE_PPM",
              "label": "Nitrogen Dioxide (ppm)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "OZONE_PPM",
              "label": "Ozone (ppm)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "PM10_UG_M3",
              "label": "PM10 (UG/M3)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "PM25_UG_M3",
              "label": "PM25 (UG/M3)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          },
          {
              "field": "SULFUR_DIOXIDE_PPB",
              "label": "Sulfur Dioxide (ppb)",
              "format": {
                  "digitSeparator": true,
                  "places": 2
              }
          }
      ]
  },
};
