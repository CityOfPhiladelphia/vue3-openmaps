/**
 * Planning Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Planning_Districts/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const planningDistricts = {
  id: "planning-districts",
  title: "Planning Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Planning_Districts/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.25)",
      "fill-opacity": 1,
      "fill-outline-color": "#000000"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.25)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Planning District: {dist_name}",
      "fields": []
  },
};
