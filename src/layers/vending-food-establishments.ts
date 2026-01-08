/**
 * Vending Food Establishments
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FoodEstablishments/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const vendingFoodEstablishments = {
  id: "vending-food-establishments",
  title: "Vending Food Establishments",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FoodEstablishments/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#38a800",
      "circle-radius": 6.39,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#38a800",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Active Food Vendor License",
      "fields": [
          {
              "field": "NAME",
              "label": "Name"
          },
          {
              "field": "LICENSENUMBER",
              "label": "License Number",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "INITIALISSUEDATE",
              "label": "Initial Issue Date"
          },
          {
              "field": "MOSTRECENTISSUEDATE",
              "label": "Most Recent Issue Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "BUSINESSCONTACTNAME",
              "label": "Business Contact Name"
          },
          {
              "field": "DOINGBUSINESSAS",
              "label": "Doing Business As"
          },
          {
              "field": "VENDING_LOCATION",
              "label": "Vending Location"
          }
      ]
  },
};
