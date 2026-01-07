/**
 * Polling Places
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/POLLING_PLACES/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const pollingPlaces = {
  id: "polling-places",
  title: "Polling Places",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/POLLING_PLACES/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#f3c613",
      "circle-radius": 9,
      "circle-opacity": 1,
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#f3c613",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{placename}",
      "fields": [
          {
              "field": "ward",
              "label": "Ward"
          },
          {
              "field": "division",
              "label": "Division"
          },
          {
              "field": "precinct",
              "label": "Precinct"
          },
          {
              "field": "street_address",
              "label": "Street Address"
          },
          {
              "field": "zip_code",
              "label": "Zip Code"
          }
      ]
  },
};
