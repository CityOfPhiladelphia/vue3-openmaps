/**
 * Licenses and Inspections - Violations (All) (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsViolationsAllUnderConstruction = {
  id: "licenses-and-inspections-violations-all-under-construction",
  title: "Licenses and Inspections - Violations (All) (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  minZoom: 16.25,
  opacity: 1,

  paint: {
      "circle-color": "#b45533",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#b45533",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I Violation",
      "fields": [
          {
              "field": "ADDRESS",
              "label": "Address"
          },
          {
              "field": "ORGANIZATION",
              "label": "Organization"
          },
          {
              "field": "CASENUMBER",
              "label": "Case Number"
          },
          {
              "field": "CASEADDEDDATE",
              "label": "Case Added Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "VIOLATIONTYPE",
              "label": "Violation Type"
          },
          {
              "field": "VIOLATIONDESCRIPTION",
              "label": "Description"
          },
          {
              "field": "VIOLATIONDATE",
              "label": "Violation Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "CASERESOLUTIONDATE",
              "label": "Case Resolved Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "STATUS",
              "label": "Status"
          }
      ]
  },
};
