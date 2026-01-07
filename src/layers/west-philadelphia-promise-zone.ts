/**
 * West Philadelphia Promise Zone
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Promise_Zone/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const westPhiladelphiaPromiseZone = {
  id: "west-philadelphia-promise-zone",
  title: "West Philadelphia Promise Zone",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Philadelphia_Promise_Zone/FeatureServer/0",
  opacity: 0.6,

  paint: {
      "fill-color": "#e69800",
      "fill-opacity": 0.6
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#e69800",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "West Philadelphia Promise Zone",
      "fields": []
  },
};
