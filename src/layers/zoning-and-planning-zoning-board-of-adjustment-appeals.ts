/**
 * Zoning and Planning - Zoning Board of Adjustment Appeals
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const zoningAndPlanningZoningBoardOfAdjustmentAppeals = {
  id: "zoning-and-planning-zoning-board-of-adjustment-appeals",
  title: "Zoning and Planning - Zoning Board of Adjustment Appeals",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS/FeatureServer/0",
  where: "(CREATEDDATE BETWEEN CURRENT_TIMESTAMP - 730 AND CURRENT_TIMESTAMP) AND (APPLICATIONTYPE = 'RB_ZBA' OR APPLICATIONTYPE = 'Zoning Board of Adjustment')",
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 7.875,
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
      "title": "Zoning Board of Adjustment Appeal",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "zip",
              "label": "Zip"
          },
          {
              "field": "opa_owner",
              "label": "Owner"
          },
          {
              "field": "opa_account_num",
              "label": "OPA Account Num."
          },
          {
              "field": "parcel_id_num",
              "label": "Parcel ID Num."
          },
          {
              "field": "primaryappellant",
              "label": "Primary Appellant"
          },
          {
              "field": "appealnumber",
              "label": "Appeal Number"
          },
          {
              "field": "appealtype",
              "label": "Appeal Type"
          },
          {
              "field": "appealstatus",
              "label": "Appeal Status"
          },
          {
              "field": "acceleratedappeal",
              "label": "Accelerated Appeal"
          },
          {
              "field": "createddate",
              "label": "Created Date"
          },
          {
              "field": "scheduleddate",
              "label": "Scheduled Date"
          },
          {
              "field": "completeddate",
              "label": "Completed Date"
          },
          {
              "field": "relatedpermit",
              "label": "Related Permit"
          },
          {
              "field": "agendadescription",
              "label": "Agenda Description"
          },
          {
              "field": "applicationtype",
              "label": "Application Type"
          },
          {
              "field": "appealgrounds",
              "label": "Appeal Grounds"
          },
          {
              "field": "meetingnumber",
              "label": "Meeting Number"
          },
          {
              "field": "meetingresult",
              "label": "Meeting Result"
          },
          {
              "field": "decision",
              "label": "Decision"
          },
          {
              "field": "decisiondate",
              "label": "Decision Date"
          }
      ]
  },
};
