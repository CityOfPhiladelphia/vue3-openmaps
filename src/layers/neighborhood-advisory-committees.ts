/**
 * Neighborhood Advisory Committees
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/NeighborhoodAdvisoryCommittees/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const neighborhoodAdvisoryCommittees = {
  id: "neighborhood-advisory-committees",
  title: "Neighborhood Advisory Committees",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/NeighborhoodAdvisoryCommittees/FeatureServer/0",
  opacity: 0.75,

  paint: {
      "fill-color": "rgba(249, 226, 137, 0.65)",
      "fill-opacity": 0.75,
      "fill-outline-color": "rgba(110, 110, 110, 0.00)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(249, 226, 137, 0.65)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Neighborhood Advisory Committee",
      "fields": [
          {
              "field": "organization",
              "label": "Organization"
          },
          {
              "field": "street_address",
              "label": "Street Address"
          },
          {
              "field": "phone_number",
              "label": "Phone Number"
          },
          {
              "field": "email_address",
              "label": "Email Address"
          },
          {
              "field": "website_url",
              "label": "Website URL"
          }
      ]
  },
};
