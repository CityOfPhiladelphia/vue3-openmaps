/**
 * Business Licenses
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const businessLicenses = {
  id: "business-licenses",
  title: "Business Licenses",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0",
  where: "(revenuecode = '3397') OR (revenuecode = '3629') OR (revenuecode = '3230') OR (revenuecode = '3271') OR (revenuecode = '3006') OR (revenuecode = '3822') OR (revenuecode = '3809') OR (revenuecode = '3843') OR (revenuecode = '3001') OR (revenuecode = '3335') OR (revenuecode = '3371') OR (revenuecode = '3374') OR (revenuecode = '3381') OR (revenuecode = '3311') OR (revenuecode = '3524')",
  minZoom: 14.77,
  opacity: 1,

  paint: {
      "circle-color": "#73b2ff",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#73b2ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Business License - {licensetype}",
      "fields": [
          {
              "field": "business_name",
              "label": "Business Name"
          },
          {
              "field": "licensenum",
              "label": "License Number"
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
