/**
 * Business Permits - Signs
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const businessPermitsSigns = {
  id: "business-permits-signs",
  title: "Business Permits - Signs",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0",
  where: "(permitissuedate BETWEEN CURRENT_TIMESTAMP - 730 AND CURRENT_TIMESTAMP) AND (permittype = 'BP_SIGN' OR typeofwork = 'SIGN')",
  minZoom: 14.77,
  opacity: 1,

  paint: {
      "circle-color": "#ffaa00",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ffaa00",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Business - Sign Permit",
      "fields": [
          {
              "field": "permitnumber",
              "label": "Permit Number"
          },
          {
              "field": "permittype",
              "label": "Permit Type"
          },
          {
              "field": "permitdescription",
              "label": "Description"
          },
          {
              "field": "typeofwork",
              "label": "Type of Work"
          },
          {
              "field": "approvedscopeofwork",
              "label": "Scope of Work"
          },
          {
              "field": "permitissuedate",
              "label": "Issue Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "status",
              "label": "Status"
          },
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "zip",
              "label": "Zipcode"
          }
      ]
  },
};
