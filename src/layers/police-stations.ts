/**
 * Police Stations
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Police_Stations/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const policeStations = {
  id: "police-stations",
  title: "Police Stations",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Police_Stations/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#005ce6",
      "circle-radius": 9,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#005ce6",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Police Station, District {DISTRICT_NUMBER}",
      "fields": [
          {
              "field": "LOCATION",
              "label": "Address"
          },
          {
              "field": "TELEPHONE_NUMBER",
              "label": "Phone"
          }
      ]
  },
};
