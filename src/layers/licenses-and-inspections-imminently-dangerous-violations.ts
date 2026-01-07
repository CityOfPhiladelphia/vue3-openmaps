/**
 * Licenses and Inspections - Imminently Dangerous Violations
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/IMM_DANG/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsImminentlyDangerousViolations = {
  id: "licenses-and-inspections-imminently-dangerous-violations",
  title: "Licenses and Inspections - Imminently Dangerous Violations",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/IMM_DANG/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#999999",
      "circle-radius": 9,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#999999",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I Imminently Dangerous",
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
              "label": "Case Added Date"
          },
          {
              "field": "casecompleteddate",
              "label": "Case Completion Date"
          },
          {
              "field": "violationnumber",
              "label": "Violation Number"
          },
          {
              "field": "violationdate",
              "label": "Violation Date"
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
              "label": "Violation Resolution Date"
          },
          {
              "field": "violationresolutioncode",
              "label": "Violation Resolution Code"
          },
          {
              "field": "mostrecentinvestigation",
              "label": "Most Recent Investigation"
          }
      ]
  },
};
