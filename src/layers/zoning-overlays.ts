/**
 * Zoning Overlays
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_Overlays/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const zoningOverlays = {
  id: "zoning-overlays",
  title: "Zoning Overlays",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_Overlays/FeatureServer/0",
  minZoom: 11.58,
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "Zoning Overlay: {overlay_name}",
      "fields": [
          {
              "field": "type",
              "label": "Type"
          },
          {
              "field": "code_section",
              "label": "Code Section"
          },
          {
              "field": "code_section_link",
              "label": "Code Link"
          },
          {
              "field": "pending",
              "label": "Pending"
          }
      ]
  },
};
