/**
 * Business Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const businessViolationsUnderConstruction = {
  id: "business-violations-under-construction",
  title: "Business Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  where: "(VIOLATIONDATE BETWEEN CURRENT_TIMESTAMP - 256 AND CURRENT_TIMESTAMP AND VIOLATIONTYPE <> '14-231/2' AND VIOLATIONTYPE <> '14-231/1' AND VIOLATIONTYPE <> '14-231/3' AND VIOLATIONTYPE <> '14-231/4' AND VIOLATIONTYPE <> '9-1003.2/1' AND VIOLATIONTYPE <> '9-1004' AND VIOLATIONTYPE <> '9-1004(6E)' AND VIOLATIONTYPE <> '9-1004.2/1' AND VIOLATIONTYPE <> '9-1004.2/2' AND VIOLATIONTYPE <> '9-1004.2/3' AND VIOLATIONTYPE <> '9-2502.1/1' AND VIOLATIONTYPE <> '9-2502.1/2' AND VIOLATIONTYPE <> '9-504.1/1') AND (VIOLATIONTYPE = 'PM-102.6/6' OR VIOLATIONTYPE = 'PM-102.8/1' OR VIOLATIONTYPE = 'PM-704.1/1' OR VIOLATIONTYPE = 'PM-704.1/2' OR VIOLATIONTYPE = 'PM-704.1/3' OR VIOLATIONTYPE = 'PM-704.1/4' OR VIOLATIONTYPE = 'PM-704.1/5' OR VIOLATIONTYPE = 'PM-704.1/5' OR VIOLATIONTYPE = 'PM-704.2/5' OR VIOLATIONTYPE = 'PM-704.3/2' OR VIOLATIONTYPE = 'PM-704.3/3' OR VIOLATIONTYPE = 'PM-102.4/4' OR VIOLATIONTYPE LIKE '03-%' OR VIOLATIONTYPE LIKE '06-%' OR VIOLATIONTYPE LIKE '09-%' OR VIOLATIONTYPE LIKE '9-%' OR VIOLATIONTYPE LIKE '10-%' OR VIOLATIONTYPE LIKE '14-%' OR VIOLATIONTYPE LIKE '19-%' OR VIOLATIONTYPE LIKE 'LD-%' OR VIOLATIONTYPE LIKE 'LO-%' OR VIOLATIONTYPE LIKE 'PA-%')",
  opacity: 1,

  paint: {
      "circle-color": "#a80000",
      "circle-radius": 7.875,
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
      "title": "Business Violation",
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
              "label": "Case Added Date"
          },
          {
              "field": "CASERESOLUTIONDATE",
              "label": "Case Resolution Date"
          },
          {
              "field": "CASERESOLUTIONCODE",
              "label": "Case Resolution Code"
          },
          {
              "field": "VIOLATIONDATE",
              "label": "Violation Date"
          },
          {
              "field": "VIOLATIONTYPE",
              "label": "Violation Type"
          },
          {
              "field": "VIOLATIONDESCRIPTION",
              "label": "Violation Type Description"
          },
          {
              "field": "MOSTRECENTINSP",
              "label": "Most Recent Inspection"
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
