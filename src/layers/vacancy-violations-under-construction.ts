/**
 * Vacancy Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const vacancyViolationsUnderConstruction = {
  id: "vacancy-violations-under-construction",
  title: "Vacancy Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/VIOLATIONS/FeatureServer/0",
  where: "(casecreateddate BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP) AND (violationcode LIKE 'PM-308%' OR violationcode LIKE 'PM-307%' OR violationcode LIKE 'PM-306%' OR violationcode LIKE 'PM-102.4/2%' OR violationcode LIKE 'PM-102.4/1%' OR violationcode LIKE 'PM-102.4/4%')",
  minZoom: 10.76,
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
      "title": "Vacancy Violation",
      "fields": [
          {
              "field": "address",
              "label": "Address"
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
              "field": "casetype",
              "label": "Case Type"
          },
          {
              "field": "casestatus",
              "label": "Case Status"
          },
          {
              "field": "caseresponsibility",
              "label": "Case Responsibility"
          },
          {
              "field": "caseprioritydesc",
              "label": "Case Priority Description"
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
              "field": "violationstatus",
              "label": "Violation Status"
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
              "label": "VIOLATIONRESOLUTIONCODE"
          },
          {
              "field": "mostrecentinvestigation",
              "label": "MOSTRECENTINVESTIGATION",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "publicnov",
              "label": "PUBLICNOV"
          },
          {
              "field": "opa_account_num",
              "label": "OPA_ACCOUNT_NUM"
          },
          {
              "field": "unit_type",
              "label": "UNIT_TYPE"
          },
          {
              "field": "unit_num",
              "label": "UNIT_NUM"
          },
          {
              "field": "zip",
              "label": "ZIP"
          },
          {
              "field": "censustract",
              "label": "CENSUSTRACT"
          },
          {
              "field": "opa_owner",
              "label": "OPA_OWNER"
          },
          {
              "field": "systemofrecord",
              "label": "SYSTEMOFRECORD"
          },
          {
              "field": "geocode_x",
              "label": "GEOCODE_X",
              "format": {
                  "digitSeparator": false,
                  "places": 6
              }
          },
          {
              "field": "geocode_y",
              "label": "GEOCODE_Y",
              "format": {
                  "digitSeparator": false,
                  "places": 6
              }
          }
      ]
  },
};
