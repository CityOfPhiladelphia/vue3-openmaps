/**
 * Philadelphia Register of Historic Places
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Historic_sites_PhilReg/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const philadelphiaRegisterOfHistoricPlaces = {
  id: "philadelphia-register-of-historic-places",
  title: "Philadelphia Register of Historic Places",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Historic_sites_PhilReg/FeatureServer/0",
  minZoom: 13.19,
  opacity: 0.72,

  paint: {
      "fill-color": "#63beff",
      "fill-opacity": 0.72
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#63beff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Historic Site",
      "fields": [
          {
              "field": "loc",
              "label": "Location"
          },
          {
              "field": "district",
              "label": "Historic District"
          }
      ]
  },
};
