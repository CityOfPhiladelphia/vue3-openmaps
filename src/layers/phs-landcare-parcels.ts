/**
 * PHS LandCare Parcels
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/phs_landcare/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const phsLandcareParcels = {
  id: "phs-landcare-parcels",
  title: "PHS LandCare Parcels",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/phs_landcare/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": "rgba(197, 0, 255, 0.93)",
      "fill-opacity": 1,
      "fill-outline-color": "rgba(110, 110, 110, 0.00)"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(197, 0, 255, 0.93)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "PHS LandCare Parcel",
      "fields": [
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "zipcode",
              "label": "Zipcode"
          },
          {
              "field": "district",
              "label": "Council District"
          },
          {
              "field": "year",
              "label": "Year"
          },
          {
              "field": "season",
              "label": "Season"
          },
          {
              "field": "program",
              "label": "Program"
          },
          {
              "field": "comm_ptnr",
              "label": "Community Partner"
          },
          {
              "field": "fmr_prgm",
              "label": "Former LandCare Program"
          },
          {
              "field": "stabilized",
              "label": "Stabilized"
          },
          {
              "field": "numparcels",
              "label": "Number of Parcels"
          },
          {
              "field": "parcelarea",
              "label": "Parcel Area"
          }
      ]
  },
};
