/**
 * Licenses and Inspections - Clean & Seal
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CLEAN_SEAL/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const licensesAndInspectionsCleanSeal = {
  id: "licenses-and-inspections-clean-seal",
  title: "Licenses and Inspections - Clean & Seal",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/CLEAN_SEAL/FeatureServer/0",
  where: "casecreateddate BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP",
  opacity: 1,

  paint: {
      "circle-color": "#f99300",
      "circle-radius": 7.875,
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
      "title": "L+I - Clean & Seal",
      "fields": []
  },
};
