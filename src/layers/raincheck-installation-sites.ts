/**
 * RainCheck Installation Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/RainCheck_Installed/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const raincheckInstallationSites = {
  id: "raincheck-installation-sites",
  title: "RainCheck Installation Sites",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/RainCheck_Installed/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "tools_installed"
          ],
          "de-paving",
          "#3b4db3",
          "downspout planter",
          "#41b53f",
          "permeable pavers",
          "#c9562c",
          "planter box",
          "#4cb8c2",
          "porous pavers",
          "#bf307f",
          "porous paving",
          "#df73ff",
          "rain barrel",
          "#00c5ff",
          "rain garden",
          "#2f679e",
          "#aaaaaa"
      ],
      "circle-radius": 7.875,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#3b4db3",
          "label": "De-paving"
      },
      {
          "type": "circle",
          "color": "#41b53f",
          "label": "Downspout Planter"
      },
      {
          "type": "circle",
          "color": "#c9562c",
          "label": "Permeable Pavers"
      },
      {
          "type": "circle",
          "color": "#4cb8c2",
          "label": "Planter Box"
      },
      {
          "type": "circle",
          "color": "#bf307f",
          "label": "Porous Pavers"
      },
      {
          "type": "circle",
          "color": "#df73ff",
          "label": "Porous Paving"
      },
      {
          "type": "circle",
          "color": "#00c5ff",
          "label": "Rain Barrel"
      },
      {
          "type": "circle",
          "color": "#2f679e",
          "label": "Rain Garden"
      }
  ],

  popup: {
      "title": "RainCheck Installation: {tools_installed}",
      "fields": [
          {
              "field": "status_1",
              "label": "Status"
          },
          {
              "field": "address",
              "label": "Address"
          }
      ]
  },
};
