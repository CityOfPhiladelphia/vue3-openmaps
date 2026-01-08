/**
 * Complete Street Types
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CompleteStreetsTypesStndrds/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const completeStreetTypes = {
  id: "complete-street-types",
  title: "Complete Street Types",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CompleteStreetsTypesStndrds/FeatureServer/0",
  minZoom: 13.45,
  opacity: 1,

  paint: {
      "line-color": [
          "match",
          [
              "get",
              "street_typ"
          ],
          "High Volume Pedestrian",
          "#002673",
          "Auto Oriented Commercial/Industrial",
          "#a85e00",
          "Civic/Ceremonial Street",
          "#828282",
          "Walkable Commercial Corridors",
          "#8400a8",
          "Urban Arterial",
          "#e69800",
          "Park Road",
          "#38a800",
          "Scenic Drive",
          "#38a800",
          "City Neighborhood Street",
          "#73b2ff",
          "Lower Density Residential",
          "#df73ff",
          "Shared Narrow",
          "#e60000",
          "Local (Catch All)",
          "#b2b2b2",
          "#aaaaaa"
      ],
      "line-width": 3,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#002673",
          "width": 3,
          "label": "High Volume Pedestrian"
      },
      {
          "type": "line",
          "color": "#a85e00",
          "width": 3,
          "label": "Auto Oriented Commercial/Industrial"
      },
      {
          "type": "line",
          "color": "#828282",
          "width": 3,
          "label": "Civic/Ceremonial Street"
      },
      {
          "type": "line",
          "color": "#8400a8",
          "width": 3,
          "label": "Walkable Commercial Corridors"
      },
      {
          "type": "line",
          "color": "#e69800",
          "width": 3,
          "label": "Urban Arterial"
      },
      {
          "type": "line",
          "color": "#38a800",
          "width": 3,
          "label": "Park Road"
      },
      {
          "type": "line",
          "color": "#38a800",
          "width": 3,
          "label": "Scenic Drive"
      },
      {
          "type": "line",
          "color": "#73b2ff",
          "width": 3,
          "label": "City Neighborhood Street"
      },
      {
          "type": "line",
          "color": "#df73ff",
          "width": 2.0025,
          "label": "Lower Density Residential"
      },
      {
          "type": "line",
          "color": "#e60000",
          "width": 0.9975,
          "label": "Shared Narrow"
      },
      {
          "type": "line",
          "color": "#b2b2b2",
          "width": 0.9975,
          "label": "Local"
      }
  ],

  popup: {
      "title": "{st_name}",
      "fields": [
          {
              "field": "street_typ",
              "label": "Street Type"
          },
          {
              "field": "sidewlk_wd",
              "label": "Recommended Sidewalk Width"
          },
          {
              "field": "wlk_zn",
              "label": "Walking Zone (Minimum Clear Width)"
          }
      ]
  },
};
