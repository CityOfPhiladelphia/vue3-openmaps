/**
 * Construction Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const constructionViolationsUnderConstruction = {
  id: "construction-violations-under-construction",
  title: "Construction Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  where: "(VIOLATIONTYPE LIKE 'A-3%' OR VIOLATIONTYPE LIKE 'A-5%' OR VIOLATIONTYPE LIKE 'P-%' OR VIOLATIONTYPE LIKE 'B-%' OR VIOLATIONTYPE LIKE 'E-%' OR VIOLATIONTYPE LIKE 'A-102.9/1%' OR VIOLATIONTYPE LIKE 'A-104.1/1%' OR VIOLATIONTYPE LIKE 'A-104.1/3%' OR VIOLATIONTYPE LIKE 'A-104.1/4%' OR VIOLATIONTYPE LIKE 'A-104.1/5%' OR VIOLATIONTYPE LIKE 'A-104.1/6%' OR VIOLATIONTYPE LIKE 'PM-704.1/1%' OR VIOLATIONTYPE LIKE 'PM-704.1/7%' OR VIOLATIONTYPE LIKE 'PM-704.2/1%' OR VIOLATIONTYPE LIKE 'PM-704.2/2%' OR VIOLATIONTYPE LIKE 'PM-704.2/3%' OR VIOLATIONTYPE LIKE 'PM-704.2/4%' OR VIOLATIONTYPE LIKE 'PM-704.2/5%' OR VIOLATIONTYPE LIKE 'PM-704.2/6%' OR VIOLATIONTYPE LIKE '21-2007,0/1%' OR VIOLATIONTYPE LIKE '14-231/1%' OR VIOLATIONTYPE LIKE '14-231/3%' OR VIOLATIONTYPE LIKE '14-231/2%' OR VIOLATIONTYPE LIKE '14-231/4%' OR VIOLATIONTYPE LIKE '9-1004%' OR VIOLATIONTYPE LIKE '9-1004(6E)%' OR VIOLATIONTYPE LIKE '9-1004.2/1%' OR VIOLATIONTYPE LIKE '9-1004.2/2%' OR VIOLATIONTYPE LIKE '9-1004.2/3%' OR VIOLATIONTYPE LIKE '9-2502.1/1%' OR VIOLATIONTYPE LIKE '9-2502.1/2%' OR VIOLATIONTYPE LIKE '9-504.1/1%') AND (VIOLATIONDATE BETWEEN CURRENT_TIMESTAMP - 256 AND CURRENT_TIMESTAMP AND VIOLATIONDATE BETWEEN CURRENT_TIMESTAMP - 256 AND CURRENT_TIMESTAMP)",
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
      "title": "Construction Violation",
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
              "label": "Case Resolution Code"
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
              "field": "VIOLATIONDESCRIPTION",
              "label": "Description"
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
              "field": "STATUS",
              "label": "Status"
          },
          {
              "field": "CASEPRIORITY",
              "label": "Case Priority"
          },
          {
              "field": "PRIORITYDESC",
              "label": "Priority Description"
          }
      ]
  },
};
