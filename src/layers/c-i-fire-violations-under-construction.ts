/**
 * C&I Fire Violations (under construction)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const cIFireViolationsUnderConstruction = {
  id: "c-i-fire-violations-under-construction",
  title: "C&I Fire Violations (under construction)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LI_VIOLATIONS/FeatureServer/0",
  where: "(VIOLATIONTYPE LIKE 'FC-%') AND (VIOLATIONDATE BETWEEN CURRENT_TIMESTAMP - 256 AND CURRENT_TIMESTAMP)",
  opacity: 1,

  paint: {
      "circle-color": "#ff0000",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ff0000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "C&I Fire Violation",
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
              "label": "Case Solution Date"
          },
          {
              "field": "CASERESOLUTIONCODE",
              "label": "Case Solution Code"
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
              "label": "Violation Description"
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
