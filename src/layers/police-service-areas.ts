/**
 * Police Service Areas
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Boundaries_PSA/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const policeServiceAreas = {
  id: "police-service-areas",
  title: "Police Service Areas",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Boundaries_PSA/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "Police Service Area {psa_num}",
      "fields": [
          {
              "field": "dist_numc",
              "label": "District Num"
          },
          {
              "field": "div_code",
              "label": "Division Code"
          }
      ]
  },
};
