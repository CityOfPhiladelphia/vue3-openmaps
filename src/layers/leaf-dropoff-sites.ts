/**
 * Leaf Dropoff Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Leaf_Dropoff_Sites/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const leafDropoffSites = {
  id: "leaf-dropoff-sites",
  title: "Leaf Dropoff Sites",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Leaf_Dropoff_Sites/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "{drop_off_location}",
      "fields": [
          {
              "field": "arc_single_line_input",
              "label": "Address"
          },
          {
              "field": "time",
              "label": "Open Hours"
          },
          {
              "field": "exceptions",
              "label": "Exceptions"
          }
      ]
  },
};
