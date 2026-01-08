/**
 * Bike Network
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Bike_Network/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const bikeNetwork = {
  id: "bike-network",
  title: "Bike Network",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Bike_Network/FeatureServer/0",
  opacity: 1,

  paint: {
      "line-color": [
          "match",
          [
              "get",
              "type"
          ],
          "Buffered",
          "#68bd2b",
          "Buffered w Conventional",
          "#3860c7",
          "Contraflow w Conventional, same",
          "#c42fc2",
          "Conventional",
          "#c29c3e",
          "Conventional w Sharrows",
          "#c7352e",
          "Sharrow",
          "#2ac9c4",
          "#aaaaaa"
      ],
      "line-width": 3,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#68bd2b",
          "width": 3,
          "label": "Buffered"
      },
      {
          "type": "line",
          "color": "#3860c7",
          "width": 3,
          "label": "Buffered w Conventional"
      },
      {
          "type": "line",
          "color": "#c42fc2",
          "width": 3,
          "label": "Contraflow w Conventional, same"
      },
      {
          "type": "line",
          "color": "#c29c3e",
          "width": 3,
          "label": "Conventional"
      },
      {
          "type": "line",
          "color": "#c7352e",
          "width": 3,
          "label": "Conventional w Sharrows"
      },
      {
          "type": "line",
          "color": "#2ac9c4",
          "width": 3,
          "label": "Sharrow"
      },
      {
          "type": "line",
          "color": "#aaaaaa",
          "width": 3,
          "label": "Other"
      }
  ],

  popup: {
      "title": "Bike Network: {streetname}",
      "fields": [
          {
              "field": "type",
              "label": "Bike Network Type"
          }
      ]
  },
};
