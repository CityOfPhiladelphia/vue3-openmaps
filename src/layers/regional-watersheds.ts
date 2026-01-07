/**
 * Regional Watersheds
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Major_Watersheds_Regional/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const regionalWatersheds = {
  id: "regional-watersheds",
  title: "Regional Watersheds",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Major_Watersheds_Regional/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "{watershed_name}",
      "fields": [
          {
              "field": "sq_miles",
              "label": "Area (sq.mi.)"
          },
          {
              "field": "acres",
              "label": "Area (acres)"
          }
      ]
  },
};
