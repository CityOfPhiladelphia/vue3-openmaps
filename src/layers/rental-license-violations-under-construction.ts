/**
 * Rental License Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const rentalLicenseViolationsUnderConstruction = {
  id: "rental-license-violations-under-construction",
  title: "Rental License Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  where: "(VIOLATIONTYPE = 'PM-102.0/1') OR (VIOLATIONTYPE = 'PM-102.3/1') OR (VIOLATIONTYPE = 'PM-102.6/3') OR (VIOLATIONTYPE = 'PM-102.1/1') OR (VIOLATIONTYPE = 'PM-102.2/1')",
  minZoom: 14.42,
  opacity: 1,

  paint: {
      "circle-color": "#a80000",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#a80000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Rental License Violation",
      "fields": [
          {
              "field": "ADDRESS",
              "label": "Address"
          },
          {
              "field": "OWNERNAME",
              "label": "Owner Name"
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
              "field": "CASERESOLUTIONDATE",
              "label": "Case Resolution Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "CASERESOLUTIONCODE",
              "label": "Case Solution Code"
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
              "field": "VIOLATIONTYPE",
              "label": "Violation Type"
          },
          {
              "field": "VIOLATIONDESCRIPTION",
              "label": "Violation Description"
          },
          {
              "field": "MOSTRECENTINSP",
              "label": "Most Recent Inspection",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "CASESTATUS",
              "label": "Case Status"
          },
          {
              "field": "PRIORITYDESC",
              "label": "Priority Description"
          }
      ]
  },
};
