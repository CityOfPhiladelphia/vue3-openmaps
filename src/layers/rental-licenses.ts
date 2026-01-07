/**
 * Rental Licenses
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const rentalLicenses = {
  id: "rental-licenses",
  title: "Rental Licenses",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/BUSINESS_LICENSES/FeatureServer/0",
  where: "revenuecode = '3202'",
  opacity: 1,

  paint: {
      "circle-color": "#df73ff",
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#df73ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "L+I Rental License",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "unit_type",
              "label": "Unit Type"
          },
          {
              "field": "unit_num",
              "label": "Unit Number"
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
              "label": "Initial Issue Date"
          },
          {
              "field": "mostrecentissuedate",
              "label": "Most Recent Issue Date"
          },
          {
              "field": "expirationdate",
              "label": "Expiration Date"
          },
          {
              "field": "inactivedate",
              "label": "Inactive Date"
          },
          {
              "field": "licensestatus",
              "label": "License Status"
          },
          {
              "field": "numberofunits",
              "label": "Number of Units"
          },
          {
              "field": "legalfirstname",
              "label": "First Name"
          },
          {
              "field": "legallastname",
              "label": "Last Name"
          },
          {
              "field": "legalname",
              "label": "Legal Name"
          },
          {
              "field": "legalentitytype",
              "label": "Legan Entity Type"
          },
          {
              "field": "business_name",
              "label": "Business Name"
          },
          {
              "field": "business_mailing_address",
              "label": "Business Mailing Address"
          }
      ]
  },
};
