/**
 * Athletic Fields, Tracks, and Courts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const athleticFieldsTracksAndCourts = {
  id: "athletic-fields-tracks-and-courts",
  title: "Athletic Fields, Tracks, and Courts",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/City_Facilities_pub/FeatureServer/0",
  where: "(asset_subtype1 = 'C3') OR (asset_subtype1 = 'C4') OR (asset_subtype1 = 'C58') OR (asset_subtype1 = 'C6') OR (asset_subtype1 = 'C67') OR (asset_subtype1 = 'C68') OR (asset_subtype1 = 'C85') OR (asset_subtype1 = 'C87') OR (asset_subtype1 = 'C88') OR (asset_subtype1 = 'C89') OR (asset_subtype1 = 'C90')",
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "asset_subtype1"
          ],
          "C4",
          "#ed5151",
          "C87",
          "#149ece",
          "C67",
          "#a7c636",
          "C3",
          "#9e559c",
          "C88",
          "#fc921f",
          "C89",
          "#ffde3e",
          "C90",
          "#f789d8",
          "C85",
          "#b7814a",
          "C68",
          "#3caf99",
          "C58",
          "#6b6bd6",
          "C6",
          "#b54779",
          "#aaaaaa"
      ],
      "circle-radius": 8.4375,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Basketball Court"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Baseball Field"
      },
      {
          "type": "circle",
          "color": "#a7c636",
          "label": "Tennis Court"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Athletic Field\\Soccer Field"
      },
      {
          "type": "circle",
          "color": "#fc921f",
          "label": "Street Hockey Court\\Rink"
      },
      {
          "type": "circle",
          "color": "#ffde3e",
          "label": "Batting Cage"
      },
      {
          "type": "circle",
          "color": "#f789d8",
          "label": "Handball Court"
      },
      {
          "type": "circle",
          "color": "#b7814a",
          "label": "Volleyball Court"
      },
      {
          "type": "circle",
          "color": "#3caf99",
          "label": "Athletic Track"
      },
      {
          "type": "circle",
          "color": "#6b6bd6",
          "label": "Skateboard Park"
      },
      {
          "type": "circle",
          "color": "#b54779",
          "label": "Bocci Court"
      }
  ],

  popup: {
      "title": "{asset_name}",
      "fields": [
          {
              "field": "asset_addr",
              "label": "Address"
          },
          {
              "field": "site_name",
              "label": "Site_Name"
          }
      ]
  },
};
