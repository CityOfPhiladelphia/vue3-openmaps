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
      "circle-radius": 12,
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
              "label": "Sample Timestamp"
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
              "label": "Carbon Monoxide (ppm)"
          },
          {
              "field": "NITROGEN_DIOXIDE_PPM",
              "label": "Nitrogen Dioxide (ppm)"
          },
          {
              "field": "OZONE_PPM",
              "label": "Ozone (ppm)"
          },
          {
              "field": "PM10_UG_M3",
              "label": "PM10 (UG/M3)"
          },
          {
              "field": "PM25_UG_M3",
              "label": "PM25 (UG/M3)"
          },
          {
              "field": "SULFUR_DIOXIDE_PPB",
              "label": "Sulfur Dioxide (ppb)"
          }
      ]
  },
};
