/**
 * Licenses and Inspections - Unsafe Violations
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/UNSAFE/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsUnsafeViolations = {
  id: "licenses-and-inspections-unsafe-violations",
  title: "Licenses and Inspections - Unsafe Violations",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/UNSAFE/FeatureServer/0",
  minZoom: 12.21,
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f99300",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I Unsafe Violation",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "zip",
              "label": "Zipcode"
          },
          {
              "field": "casenumber",
              "label": "Case Number"
          },
          {
              "field": "casecreateddate",
              "label": "Case Created Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "casecompleteddate",
              "label": "Case Completed Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "caseresponsibility",
              "label": "Case Responsibility"
          },
          {
              "field": "violationnumber",
              "label": "Violation Number"
          },
          {
              "field": "violationdate",
              "label": "Violation Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "violationcode",
              "label": "Violation Code"
          },
          {
              "field": "violationcodetitle",
              "label": "Violation Code Title"
          },
          {
              "field": "violationresolutiondate",
              "label": "Violation Resolution Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "violationresolutioncode",
              "label": "Violation Resolution Code"
          }
      ]
  },
};
