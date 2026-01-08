/**
 * Parks and Recreation Buildings/Structures
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Buildings_Structures/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const parksAndRecreationBuildingsStructures = {
  id: "parks-and-recreation-buildings-structures",
  title: "Parks and Recreation Buildings/Structures",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Buildings_Structures/FeatureServer/0",
  minZoom: 11.41,
  opacity: 1,

  paint: {
      "fill-color": "#a3ff73",
      "fill-opacity": 1,
      "fill-outline-color": "rgba(110, 110, 110, 0.00)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#a3ff73",
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
