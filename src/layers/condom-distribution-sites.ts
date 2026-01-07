/**
 * Condom Distribution Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Condom_distribution_sites/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const condomDistributionSites = {
  id: "condom-distribution-sites",
  title: "Condom Distribution Sites",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Condom_distribution_sites/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#df73ff",
      "circle-radius": 9.75,
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
      "title": "Condom Distribution Site",
      "fields": [
          {
              "field": "site_name",
              "label": "Site Name"
          },
          {
              "field": "hours",
              "label": "Hours"
          },
          {
              "field": "address",
              "label": "Street Address"
          },
          {
              "field": "city",
              "label": "City"
          },
          {
              "field": "state",
              "label": "State"
          },
          {
              "field": "zip",
              "label": "Zip"
          }
      ]
  },
};
