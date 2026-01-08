/**
 * Traffic Calming Devices
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/traffic_calming_devices/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const trafficCalmingDevices = {
  id: "traffic-calming-devices",
  title: "Traffic Calming Devices",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/traffic_calming_devices/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 7.99,
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
      "title": "Traffic Calming Devices",
      "fields": [
          {
              "field": "seg_id",
              "label": "Street Segment ID",
              "format": {
                  "digitSeparator": false,
                  "places": 0
              }
          }
      ]
  },
};
