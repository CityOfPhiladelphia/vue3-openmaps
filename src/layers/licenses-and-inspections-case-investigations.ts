/**
 * Licenses and Inspections - Case Investigations
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CASE_INVESTIGATIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsCaseInvestigations = {
  id: "licenses-and-inspections-case-investigations",
  title: "Licenses and Inspections - Case Investigations",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CASE_INVESTIGATIONS/FeatureServer/0",
  where: "(investigationcompleted IS NULL) OR (investigationcompleted BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP)",
  minZoom: 14.37,
  opacity: 1,

  paint: {
      "circle-color": "#cc3000",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#cc3000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I - Case Investigation",
      "fields": [
          {
              "field": "casenumber",
              "label": "Case Number"
          },
          {
              "field": "casetype",
              "label": "Case Type"
          },
          {
              "field": "caseresponsibility",
              "label": "Case Responsibility"
          },
          {
              "field": "casepriority",
              "label": "Case Priority"
          },
          {
              "field": "investigationtype",
              "label": "Investigation Type"
          },
          {
              "field": "investigationstatus",
              "label": "Investigation Status"
          },
          {
              "field": "opa_account_num",
              "label": "OPA Account Number"
          },
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "zip",
              "label": "Zipcode"
          },
          {
              "field": "opa_owner",
              "label": "Owner"
          }
      ]
  },
};
