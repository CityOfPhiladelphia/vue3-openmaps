/**
 * Rebuild Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Rebuild_Sites/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const rebuildSites = {
  id: "rebuild-sites",
  title: "Rebuild Sites",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Rebuild_Sites/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "Copy_of_Master_Site_List_9_24_8"
          ],
          "Eligible",
          "#ffaa00",
          "Selected",
          "#4ce600",
          "#888888"
      ],
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ffaa00",
          "label": "Eligible"
      },
      {
          "type": "circle",
          "color": "#4ce600",
          "label": "Selected"
      }
  ],

  popup: {
      "title": "{Copy_of_Master_Site_List_9_24_8} Rebuild Site",
      "fields": [
          {
              "field": "SITE_NAME",
              "label": "Site Name"
          },
          {
              "field": "ASSET_ADDR",
              "label": "Site Address"
          },
          {
              "field": "CITYOWNED",
              "label": "City Owned"
          },
          {
              "field": "Copy_of_Master_Site_List_9_24_5",
              "label": "Preliminary Site Needs"
          },
          {
              "field": "Copy_of_Master_Site_List_9_24_9",
              "label": "Project Type"
          }
      ]
  },
};
