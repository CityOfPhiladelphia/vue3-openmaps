/**
 * PPR Tree Inventory
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/ppr_tree_inventory_2025/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const pprTreeInventory = {
  id: "ppr-tree-inventory",
  title: "PPR Tree Inventory",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/ppr_tree_inventory_2025/FeatureServer/0",
  minZoom: 17.07,
  opacity: 1,

  paint: {
      "circle-color": "#4c7300",
      "circle-radius": 5.68,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#4c7300",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{tree_name}",
      "fields": [
          {
              "field": "tree_dbh",
              "label": "Diameter at Breast Height (DBH)",
              "format": {
                  "digitSeparator": false,
                  "places": 6
              }
          },
          {
              "field": "year",
              "label": "Year"
          }
      ]
  },
};
