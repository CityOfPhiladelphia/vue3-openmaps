/**
 * Construction Permits - Building
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const constructionPermitsBuilding = {
  id: "construction-permits-building",
  title: "Construction Permits - Building",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0",
  where: "(permitissuedate BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP) AND (permittype = 'BP_ADDITON' OR permittype = 'L_FFORM' OR permittype = 'BP_NEWCNST' OR permittype = 'BP_ADMINST' OR permittype = 'BP_ALTER' OR permittype = 'BP_DEMO' OR permittype = 'BP_FIRESUP' OR permittype = 'BP_SIGN' OR permittype = 'BUILDING' OR permittype = 'RESIDENTIAL BUILDING' OR permittype = 'DEMOLITION' OR permittype = 'SITE / UTILITY PERMIT')",
  minZoom: 15.29,
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
      "title": "Construction - Building Permit",
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
              "field": "commercialorresidential",
              "label": "Commercial or Residential"
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
          }
      ]
  },
};
