/**
 * Combined Sewer Service Area
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Combined_Sewer_Service_Area/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const combinedSewerServiceArea = {
  id: "combined-sewer-service-area",
  title: "Combined Sewer Service Area",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Combined_Sewer_Service_Area/FeatureServer/0",
  opacity: 0.17,

  paint: {
      "fill-color": "#858585",
      "fill-opacity": 0.17,
      "fill-outline-color": "#353535"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#858585",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Combined Sewer Service Area",
      "fields": []
  },
};
