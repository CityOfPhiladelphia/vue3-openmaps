/**
 * Construction Permits - Zoning
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const constructionPermitsZoning = {
  id: "construction-permits-zoning",
  title: "Construction Permits - Zoning",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0",
  where: "(permittype = 'ZP_ZON/USE') OR (permittype = 'ZP_ZONING')",
  opacity: 1,

  paint: {
      "circle-color": "#38a800",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#38a800",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Construction - Zoning Permit",
      "fields": [
          {
              "field": "address",
              "label": "ADDRESS"
          },
          {
              "field": "zip",
              "label": "ZIP"
          },
          {
              "field": "permitnumber",
              "label": "PERMITNUMBER"
          },
          {
              "field": "permittype",
              "label": "PERMITTYPE"
          },
          {
              "field": "permitdescription",
              "label": "PERMITDESCRIPTION"
          },
          {
              "field": "commercialorresidential",
              "label": "COMMERCIALORRESIDENTIAL"
          },
          {
              "field": "typeofwork",
              "label": "TYPEOFWORK"
          },
          {
              "field": "approvedscopeofwork",
              "label": "APPROVEDSCOPEOFWORK"
          },
          {
              "field": "permitissuedate",
              "label": "PERMITISSUEDATE"
          },
          {
              "field": "status",
              "label": "STATUS"
          }
      ]
  },
};
