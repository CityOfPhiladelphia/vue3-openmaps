/**
 * Licenses and Inspections - Complaints
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/COMPLAINTS/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsComplaints = {
  id: "licenses-and-inspections-complaints",
  title: "Licenses and Inspections - Complaints",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/COMPLAINTS/FeatureServer/0",
  where: "complaintdate BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP",
  minZoom: 15.02,
  opacity: 1,

  paint: {
      "circle-color": "#f3c613",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f3c613",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I Complaints",
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
              "field": "casestatus",
              "label": "Case Status"
          },
          {
              "field": "casenumber",
              "label": "Case Number"
          },
          {
              "field": "complaintnumber",
              "label": "Complaint Number"
          },
          {
              "field": "complaintcode",
              "label": "Complaint Code"
          },
          {
              "field": "complaintcodename",
              "label": "Complaint Code Name"
          },
          {
              "field": "unitresponsible",
              "label": "Unit Responsible"
          },
          {
              "field": "ticket_num_311",
              "label": "311 Ticket Number"
          },
          {
              "field": "complaintdate",
              "label": "Complaint Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "complaintstatus",
              "label": "Complaint Status"
          },
          {
              "field": "initialinvestigation_date",
              "label": "Initial Investigation Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "complaintresolution_date",
              "label": "Complaint Resolution Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          }
      ]
  },
};
