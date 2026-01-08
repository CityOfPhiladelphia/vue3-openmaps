/**
 * Currently Active Lane Closure Permits
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LaneClosure_Master/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const currentlyActiveLaneClosurePermits = {
  id: "currently-active-lane-closure-permits",
  title: "Currently Active Lane Closure Permits",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LaneClosure_Master/FeatureServer/0",
  where: "(effectivedate BETWEEN CURRENT_TIMESTAMP - 5120 AND CURRENT_TIMESTAMP) AND (expirationdate NOT BETWEEN CURRENT_TIMESTAMP - 5120 AND CURRENT_TIMESTAMP)",
  minZoom: 14.37,
  opacity: 1,

  paint: {
      "line-color": [
          "match",
          [
              "get",
              "occupancytype"
          ],
          "Footway",
          "#a7c636",
          "Partial Closure",
          "#149ece",
          "Full Closure",
          "#ed5151",
          "#888888"
      ],
      "line-width": 1.5,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#a7c636",
          "width": 1.5,
          "label": "Footway"
      },
      {
          "type": "line",
          "color": "#149ece",
          "width": 2.25,
          "label": "Partial Closure"
      },
      {
          "type": "line",
          "color": "#ed5151",
          "width": 3,
          "label": "Full Closure"
      },
      {
          "type": "line",
          "color": "#888888",
          "width": 1.5,
          "label": "Other"
      }
  ],

  popup: {
      "title": "Current Lane Closure: {permittype}",
      "fields": [
          {
              "field": "purpose",
              "label": "Description"
          },
          {
              "field": "effectivedate",
              "label": "Beginning Date",
              "format": {
                  "dateFormat": "longMonthDayYear",
                  "digitSeparator": false
              }
          },
          {
              "field": "expirationdate",
              "label": "Ending Date",
              "format": {
                  "dateFormat": "longMonthDayYear",
                  "digitSeparator": false
              }
          },
          {
              "field": "occupancytype",
              "label": "Lane Closure Type"
          },
          {
              "field": "permitnumber",
              "label": "Permit Number"
          },
          {
              "field": "raindate",
              "label": "Rain Date",
              "format": {
                  "dateFormat": "longMonthDayYear",
                  "digitSeparator": false
              }
          },
          {
              "field": "status",
              "label": "Status"
          },
          {
              "field": "permittype",
              "label": "Permit Type"
          },
          {
              "field": "address",
              "label": "Address"
          }
      ]
  },
};
