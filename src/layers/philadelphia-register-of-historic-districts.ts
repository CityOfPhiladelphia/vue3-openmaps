/**
 * Philadelphia Register of Historic Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HistoricDistricts_Local/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const philadelphiaRegisterOfHistoricDistricts = {
  id: "philadelphia-register-of-historic-districts",
  title: "Philadelphia Register of Historic Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/HistoricDistricts_Local/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "#888888",
      "fill-opacity": 1,
      "fill-outline-color": "#666666"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#888888",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Historic District - {name}",
      "fields": []
  },
};
