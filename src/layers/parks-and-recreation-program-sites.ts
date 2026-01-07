/**
 * Parks and Recreation Program Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Program_Sites/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const parksAndRecreationProgramSites = {
  id: "parks-and-recreation-program-sites",
  title: "Parks and Recreation Program Sites",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Program_Sites/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#58c04d",
      "circle-radius": 8.251875000000002,
      "circle-opacity": 1,
      "circle-stroke-color": "rgba(0, 0, 0, 0.00)",
      "circle-stroke-width": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#58c04d",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{park_name}",
      "fields": [
          {
              "field": "program_type",
              "label": "Program Type"
          }
      ]
  },
};
