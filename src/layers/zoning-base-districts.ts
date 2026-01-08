/**
 * Zoning Base Districts
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_BaseDistricts/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const zoningBaseDistricts = {
  id: "zoning-base-districts",
  title: "Zoning Base Districts",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_BaseDistricts/FeatureServer/0",
  opacity: 1,

  paint: {
      "fill-color": [
          "match",
          [
              "get",
              "code"
          ],
          "CA1",
          "#fcd1cc",
          "CA2",
          "#fcd1cc",
          "CMX1",
          "#ff7070",
          "CMX2",
          "#ff7070",
          "CMX2.5",
          "#ff7070",
          "CMX3",
          "#eb0000",
          "CMX4",
          "#850000",
          "CMX5",
          "#850000",
          "I1",
          "#c37ff0",
          "I2",
          "#9b27d9",
          "I3",
          "#41009c",
          "ICMX",
          "#c300e6",
          "IP",
          "#7c7ac4",
          "IRMX",
          "#ec8ef5",
          "RM1",
          "#ffa72b",
          "RM2",
          "#ffa72b",
          "RM3",
          "#ffa72b",
          "RM4",
          "#ffa72b",
          "RMX1",
          "#ff8138",
          "RMX2",
          "#ff8138",
          "RMX3",
          "#ff8138",
          "RSA1",
          "#ffff0f",
          "RSA2",
          "#ffff0f",
          "RSA3",
          "#ffff0f",
          "RSA4",
          "#ffff0f",
          "RSA5",
          "#ffff0f",
          "RSD1",
          "#fff4c4",
          "RSD2",
          "#fff4c4",
          "RSD3",
          "#fff4c4",
          "RTA1",
          "#d4d40d",
          "SPAIR",
          "#b1b3b5",
          "SPENT",
          "#805624",
          "SPINS",
          "#63beff",
          "SPPOA",
          "#138c00",
          "SPPOP",
          "#118e00",
          "SPCIV",
          "#63beff",
          "RTA2",
          "#d4d40b",
          "RSA6",
          "#ffff0f",
          "SPSTA",
          "#8acc66",
          "#828282"
      ],
      "fill-opacity": 1,
      "fill-outline-color": "#1a1a1a"
  } as FillLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "#fcd1cc",
          "label": "CA1"
      },
      {
          "type": "fill",
          "color": "#fcd1cc",
          "label": "CA2"
      },
      {
          "type": "fill",
          "color": "#ff7070",
          "label": "CMX1"
      },
      {
          "type": "fill",
          "color": "#ff7070",
          "label": "CMX2"
      },
      {
          "type": "fill",
          "color": "#ff7070",
          "label": "CMX2.5"
      },
      {
          "type": "fill",
          "color": "#eb0000",
          "label": "CMX3"
      },
      {
          "type": "fill",
          "color": "#850000",
          "label": "CMX4"
      },
      {
          "type": "fill",
          "color": "#850000",
          "label": "CMX5"
      },
      {
          "type": "fill",
          "color": "#c37ff0",
          "label": "I1"
      },
      {
          "type": "fill",
          "color": "#9b27d9",
          "label": "I2"
      },
      {
          "type": "fill",
          "color": "#41009c",
          "label": "I3"
      },
      {
          "type": "fill",
          "color": "#c300e6",
          "label": "ICMX"
      },
      {
          "type": "fill",
          "color": "#7c7ac4",
          "label": "IP"
      },
      {
          "type": "fill",
          "color": "#ec8ef5",
          "label": "IRMX"
      },
      {
          "type": "fill",
          "color": "#ffa72b",
          "label": "RM1"
      },
      {
          "type": "fill",
          "color": "#ffa72b",
          "label": "RM2"
      },
      {
          "type": "fill",
          "color": "#ffa72b",
          "label": "RM3"
      },
      {
          "type": "fill",
          "color": "#ffa72b",
          "label": "RM4"
      },
      {
          "type": "fill",
          "color": "#ff8138",
          "label": "RMX1"
      },
      {
          "type": "fill",
          "color": "#ff8138",
          "label": "RMX2"
      },
      {
          "type": "fill",
          "color": "#ff8138",
          "label": "RMX3"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA1"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA2"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA3"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA4"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA5"
      },
      {
          "type": "fill",
          "color": "#fff4c4",
          "label": "RSD1"
      },
      {
          "type": "fill",
          "color": "#fff4c4",
          "label": "RSD2"
      },
      {
          "type": "fill",
          "color": "#fff4c4",
          "label": "RSD3"
      },
      {
          "type": "fill",
          "color": "#d4d40d",
          "label": "RTA1"
      },
      {
          "type": "fill",
          "color": "#b1b3b5",
          "label": "SPAIR"
      },
      {
          "type": "fill",
          "color": "#805624",
          "label": "SPENT"
      },
      {
          "type": "fill",
          "color": "#63beff",
          "label": "SPINS"
      },
      {
          "type": "fill",
          "color": "#138c00",
          "label": "SPPOA"
      },
      {
          "type": "fill",
          "color": "#118e00",
          "label": "SPPOP"
      },
      {
          "type": "fill",
          "color": "#63beff",
          "label": "SPCIV"
      },
      {
          "type": "fill",
          "color": "#d4d40b",
          "label": "RTA2"
      },
      {
          "type": "fill",
          "color": "#ffff0f",
          "label": "RSA6"
      },
      {
          "type": "fill",
          "color": "#8acc66",
          "label": "SPSTA"
      },
      {
          "type": "fill",
          "color": "#828282",
          "label": "Other"
      }
  ],

  popup: {
      "title": "Zoning_BaseDistricts",
      "fields": [
          {
              "field": "code",
              "label": "Code No Dash"
          },
          {
              "field": "citycor",
              "label": "CITYCOR",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "long_code",
              "label": "Code With Dash"
          },
          {
              "field": "zoninggroup",
              "label": "General Zoning Group"
          },
          {
              "field": "pending",
              "label": "Pending"
          },
          {
              "field": "pendingbill",
              "label": "Pending Bill"
          },
          {
              "field": "pendingbillurl",
              "label": "Pending Bill URL"
          },
          {
              "field": "sunset_date",
              "label": "Sunset Date",
              "format": {
                  "dateFormat": "shortDateShortTime"
              }
          },
          {
              "field": "sunsetbillnum",
              "label": "SUNSETBILLNUM"
          },
          {
              "field": "sunsetbilllink",
              "label": "Sunset Bill Link"
          }
      ]
  },
};
