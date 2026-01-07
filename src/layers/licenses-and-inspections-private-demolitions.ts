/**
 * Licenses and Inspections - Private Demolitions
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/DEMOLITIONS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsPrivateDemolitions = {
  id: "licenses-and-inspections-private-demolitions",
  title: "Licenses and Inspections - Private Demolitions",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/DEMOLITIONS/FeatureServer/0",
  where: "(city_demo = 'NO') AND (completed_date BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP)",
  opacity: 1,

  paint: {
      "circle-color": "#73dfff",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#73dfff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Private Demolition",
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
              "field": "opa_owner",
              "label": "Owner"
          },
          {
              "field": "caseorpermitnumber",
              "label": "Case/Permit Number"
          },
          {
              "field": "record_type",
              "label": "Record Type"
          },
          {
              "field": "typeofwork",
              "label": "Type of Work"
          },
          {
              "field": "typeofworkdescription",
              "label": "Type of Work Desc."
          },
          {
              "field": "city_demo",
              "label": "City Demo"
          },
          {
              "field": "start_date",
              "label": "Start Date"
          },
          {
              "field": "completed_date",
              "label": "Completion Date"
          },
          {
              "field": "status",
              "label": "Status"
          },
          {
              "field": "mostrecentinsp",
              "label": "Most Recent Inspection"
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
