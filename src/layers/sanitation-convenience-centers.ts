/**
 * Sanitation Convenience Centers
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Sanitation_Convenience_Centers/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const sanitationConvenienceCenters = {
  id: "sanitation-convenience-centers",
  title: "Sanitation Convenience Centers",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Sanitation_Convenience_Centers/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "{NAME}",
      "fields": [
          {
              "field": "ADDRESS",
              "label": "Address"
          },
          {
              "field": "PHONE",
              "label": "Phone"
          }
      ]
  },
};
