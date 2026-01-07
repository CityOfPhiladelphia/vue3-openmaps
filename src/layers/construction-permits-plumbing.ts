/**
 * Construction Permits - Plumbing
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const constructionPermitsPlumbing = {
  id: "construction-permits-plumbing",
  title: "Construction Permits - Plumbing",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0",
  where: "(permitissuedate BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP) AND (permittype = 'PP_PLUMBNG' OR permittype = 'PLUMBING')",
  opacity: 1,

  paint: {
      "circle-color": "#0070ff",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#0070ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Construction - Plumbing Permit",
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
              "label": "Issue Date"
          },
          {
              "field": "status",
              "label": "Status"
          }
      ]
  },
};
