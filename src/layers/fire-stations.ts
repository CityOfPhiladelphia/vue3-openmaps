/**
 * Fire Stations
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Fire_Dept_Facilities/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const fireStations = {
  id: "fire-stations",
  title: "Fire Stations",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Fire_Dept_Facilities/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#ff0000",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ff0000",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Fire Station",
      "fields": [
          {
              "field": "eng",
              "label": "Engine",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "lad",
              "label": "Ladder",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "location",
              "label": "Address"
          }
      ]
  },
};
