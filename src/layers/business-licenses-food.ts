/**
 * Business Licenses - Food
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const businessLicensesFood = {
  id: "business-licenses-food",
  title: "Business Licenses - Food",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0",
  where: "(revenuecode = '3113') OR (revenuecode = '3118') OR (revenuecode = '3119') OR (revenuecode = '3120') OR (revenuecode = '3121') OR (revenuecode = '3122') OR (revenuecode = '3123')",
  minZoom: 14.77,
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
      "title": "Food License",
      "fields": [
          {
              "field": "business_name",
              "label": "Business Name"
          },
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
              "field": "revenuecode",
              "label": "Revenue Code"
          },
          {
              "field": "licensetype",
              "label": "License Type"
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
          }
      ]
  },
};
