/**
 * Vision Zero High Injury Network 2020
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HIGH_INJURY_NETWORK_2020/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const visionZeroHighInjuryNetwork2020 = {
  id: "vision-zero-high-injury-network-2020",
  title: "Vision Zero High Injury Network 2020",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HIGH_INJURY_NETWORK_2020/FeatureServer/0",
  opacity: 1,

  paint: {
      "line-color": "#666666",
      "line-width": 3,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#666666",
          "width": 3,
          "label": "Feature"
      }
  ],

  popup: null,
};
