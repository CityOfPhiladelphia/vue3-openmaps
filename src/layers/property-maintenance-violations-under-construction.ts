/**
 * Property Maintenance Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const propertyMaintenanceViolationsUnderConstruction = {
  id: "property-maintenance-violations-under-construction",
  title: "Property Maintenance Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  where: "(VIOLATIONTYPE LIKE 'PM%') AND (VIOLATIONDATE BETWEEN CURRENT_TIMESTAMP - 256 AND CURRENT_TIMESTAMP)",
  opacity: 1,

  paint: {
      "circle-color": "#00c5ff",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#00c5ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Property Maintenance Violation",
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
              "label": "Case Resolution Code",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
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
