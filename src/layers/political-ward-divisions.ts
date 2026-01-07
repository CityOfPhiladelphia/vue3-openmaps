/**
 * Political Ward Divisions
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Political_Divisions/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const politicalWardDivisions = {
  id: "political-ward-divisions",
  title: "Political Ward Divisions",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Political_Divisions/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 1,
      "fill-outline-color": "#9299a5"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Political Ward Division - {division_num}",
      "fields": []
  },
};
