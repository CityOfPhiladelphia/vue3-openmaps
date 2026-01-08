/**
 * Licenses and Inspections - City Demolitions
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/DEMOLITIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsCityDemolitions = {
  id: "licenses-and-inspections-city-demolitions",
  title: "Licenses and Inspections - City Demolitions",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/DEMOLITIONS/FeatureServer/0",
  where: "(city_demo = 'YES') AND (completed_date BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP)",
  minZoom: 14.21,
  opacity: 1,

  paint: {
      "circle-color": "#2176d2",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#2176d2",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "City Demolition",
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
              "field": "caseorpermitnumber",
              "label": "Case/Permit Number"
          },
          {
              "field": "typeofwork",
              "label": "Type of Work"
          },
          {
              "field": "typeofworkdescription",
              "label": "Description"
          },
          {
              "field": "start_date",
              "label": "Start Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "completed_date",
              "label": "Completed Date",
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
              "field": "applicanttype",
              "label": "Applicant Type"
          },
          {
              "field": "applicantname",
              "label": "Applicant Name"
          },
          {
              "field": "contractorname",
              "label": "Contractor Name"
          },
          {
              "field": "contractortype",
              "label": "Contractor Type"
          },
          {
              "field": "contractoraddress1",
              "label": "Contractor Address 1"
          },
          {
              "field": "contractoraddress2",
              "label": "Contractor Address 2"
          },
          {
              "field": "contractorcity",
              "label": "Contractor City"
          },
          {
              "field": "contractorstate",
              "label": "Contractor State"
          },
          {
              "field": "contractorzip",
              "label": "Contractor Zipcode"
          }
      ]
  },
};
