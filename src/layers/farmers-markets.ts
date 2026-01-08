/**
 * Farmers' Markets
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Farmers_Markets/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const farmersMarkets = {
  id: "farmers-markets",
  title: "Farmers' Markets",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Farmers_Markets/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#00c5ff",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#00c5ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Farmers' Market - {name}",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "address_notes",
              "label": "Address Notes"
          },
          {
              "field": "day",
              "label": "Day"
          },
          {
              "field": "time",
              "label": "Time"
          },
          {
              "field": "months",
              "label": "Months"
          },
          {
              "field": "accept_snap_access",
              "label": "Accept SNAP"
          },
          {
              "field": "accept_fmnp",
              "label": "Accept FMNP"
          },
          {
              "field": "accept_philly_food_bucks_",
              "label": "Accept Philly Food Bucks"
          },
          {
              "field": "major_bus_subway_routes",
              "label": "Major Bus Subway Routes"
          }
      ]
  },
};
