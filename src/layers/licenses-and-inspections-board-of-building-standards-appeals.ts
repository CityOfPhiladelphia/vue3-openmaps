/**
 * Licenses and Inspections - Board of Building Standards Appeals
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsBoardOfBuildingStandardsAppeals = {
  id: "licenses-and-inspections-board-of-building-standards-appeals",
  title: "Licenses and Inspections - Board of Building Standards Appeals",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS/FeatureServer/0",
  where: "(CREATEDDATE BETWEEN CURRENT_TIMESTAMP - 730 AND CURRENT_TIMESTAMP) AND (APPLICATIONTYPE LIKE '%Board of Building%' OR APPLICATIONTYPE LIKE '%rb_bbs%')",
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 5.68,
      "circle-opacity": 1,
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f99300",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{addressobjectid}",
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
              "field": "opa_account_num",
              "label": "OPA Account Number"
          },
          {
              "field": "parcel_id_num",
              "label": "Parcel ID Number"
          },
          {
              "field": "opa_owner",
              "label": "Owner"
          },
          {
              "field": "primaryappellant",
              "label": "Primary Appellant"
          },
          {
              "field": "appellanttype",
              "label": "Appellant Type"
          },
          {
              "field": "appealnumber",
              "label": "Appeal Number"
          },
          {
              "field": "acceleratedappeal",
              "label": "Accelerated Appeal"
          },
          {
              "field": "createddate",
              "label": "Created Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "completeddate",
              "label": "Completed Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "relatedpermit",
              "label": "Related Permit"
          },
          {
              "field": "appealstatus",
              "label": "Appeal Status"
          },
          {
              "field": "appealtype",
              "label": "Appeal Type"
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
              "label": "Appeals Ground"
          },
          {
              "field": "scheduleddate",
              "label": "Scheduled Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "decision",
              "label": "Decision"
          },
          {
              "field": "meetingresult",
              "label": "Meeting Results"
          },
          {
              "field": "decisiondate",
              "label": "Decision Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          }
      ]
  },
};
