/**
 * Parks and Recreation Properties
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Properties/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const parksAndRecreationProperties = {
  id: "parks-and-recreation-properties",
  title: "Parks and Recreation Properties",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Properties/FeatureServer/0",
  opacity: 0.72,

  paint: {
      "fill-color": "#38a800",
      "fill-opacity": 0.72
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#38a800",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Parks and Recreation Building",
      "fields": [
          {
              "field": "public_name",
              "label": "Name"
          },
          {
              "field": "address_911",
              "label": "Address"
          },
          {
              "field": "zip_code",
              "label": "Zipcode"
          }
      ]
  },
};
