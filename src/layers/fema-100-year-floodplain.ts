/**
 * FEMA 100 Year Floodplain
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FEMA_100_flood_Plain/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const fema100YearFloodplain = {
  id: "fema-100-year-floodplain",
  title: "FEMA 100 Year Floodplain",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FEMA_100_flood_Plain/FeatureServer/0",
  opacity: 0.7,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "FEMA 100-Year Floodplain",
      "fields": [
          {
              "field": "fld_zone",
              "label": "Flood Zone Designation"
          },
          {
              "field": "sfha_tf",
              "label": "Special Flood Zone Hazard"
          }
      ]
  },
};
