/**
 * Police Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Boundaries_District/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const policeDistricts = {
  id: "police-districts",
  title: "Police Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Boundaries_District/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 1,
      "fill-outline-color": "#666666"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Police District {dist_numc}",
      "fields": []
  },
};
