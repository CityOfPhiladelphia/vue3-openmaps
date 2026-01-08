/**
 * Vacancy Licenses
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const vacancyLicenses = {
  id: "vacancy-licenses",
  title: "Vacancy Licenses",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0",
  where: "(revenuecode = '3219') OR (revenuecode = '3634')",
  minZoom: 14.25,
  opacity: 1,

  paint: {
      "circle-color": "#38a800",
      "circle-radius": 7.46,
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
      "title": "Vacancy License",
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
              "field": "licensenum",
              "label": "License Number"
          },
          {
              "field": "licensetype",
              "label": "License Type"
          },
          {
              "field": "revenuecode",
              "label": "Revenue Code"
          },
          {
              "field": "initialissuedate",
              "label": "Initial Issue Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "mostrecentissuedate",
              "label": "Most Recent Issue Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "expirationdate",
              "label": "Expiration Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "inactivedate",
              "label": "Inactive Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "licensestatus",
              "label": "License Status"
          },
          {
              "field": "business_name",
              "label": "Business Name"
          },
          {
              "field": "business_mailing_address",
              "label": "Mailing Address"
          }
      ]
  },
};
