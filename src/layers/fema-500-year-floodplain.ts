/**
 * FEMA 500 Year Floodplain
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FEMA_500_Flood_Plain/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const fema500YearFloodplain = {
  id: "fema-500-year-floodplain",
  title: "FEMA 500 Year Floodplain",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FEMA_500_Flood_Plain/FeatureServer/0",
  opacity: 0.5,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "FEMA 500-Year Floodplain",
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
