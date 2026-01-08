/**
 * Public Playgrounds
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Playgrounds/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const publicPlaygrounds = {
  id: "public-playgrounds",
  title: "Public Playgrounds",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Playgrounds/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f99300",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Public Playground",
      "fields": [
          {
              "field": "park_name",
              "label": "Park Name"
          },
          {
              "field": "age_range",
              "label": "Age Range"
          }
      ]
  },
};
