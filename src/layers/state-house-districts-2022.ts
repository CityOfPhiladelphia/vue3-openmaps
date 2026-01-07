/**
 * State House Districts 2022
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/State_House_Rep_2022/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const stateHouseDistricts2022 = {
  id: "state-house-districts-2022",
  title: "State House Districts 2022",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/State_House_Rep_2022/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "State House District {DISTRICT}",
      "fields": []
  },
};
