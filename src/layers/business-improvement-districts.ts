/**
 * Business Improvement Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/business_improvement_districts/FeatureServer/0
 */

import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";

export const businessImprovementDistricts = {
  id: "business-improvement-districts",
  title: "Business Improvement Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/business_improvement_districts/FeatureServer/0",
  minZoom: 8.34,
  opacity: 1,

  paint: {
      "fill-color": "#888888",
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
          "color": "#888888",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{organization}",
      "fields": [
          {
              "field": "website",
              "label": "Website"
          },
          {
              "field": "phone",
              "label": "Phone Number"
          },
          {
              "field": "bill_number",
              "label": "Bill Number",
              "format": {
                  "digitSeparator": false,
                  "places": 0
              }
          },
          {
              "field": "expiration_date",
              "label": "Expiration Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "update_date",
              "label": "Update Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "ordination",
              "label": "Ordination"
          }
      ]
  },
};
