/**
 * Future Lane Closure Permits
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LaneClosure_Master/FeatureServer/0
 */

import type { LineLayerSpecification } from "maplibre-gl";

export const futureLaneClosurePermits = {
  id: "future-lane-closure-permits",
  title: "Future Lane Closure Permits",
  type: "line" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LaneClosure_Master/FeatureServer/0",
  where: "effectivedate NOT BETWEEN CURRENT_TIMESTAMP - 5120 AND CURRENT_TIMESTAMP",
  minZoom: 14.22,
  opacity: 1,

  paint: {
      "line-color": [
          "match",
          [
              "get",
              "occupancytype"
          ],
          "Partial Closure",
          "#149ece",
          "Full Closure",
          "#ed5151",
          "#888888"
      ],
      "line-width": 3,
      "line-opacity": 1
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "line",
          "color": "#149ece",
          "width": 3,
          "label": "Partial Closure"
      },
      {
          "type": "line",
          "color": "#ed5151",
          "width": 3,
          "label": "Full Closure"
      }
  ],

  popup: {
      "title": "Future Lane Closure: {permittype}",
      "fields": [
          {
              "field": "purpose",
              "label": "Description"
          },
          {
              "field": "permittype",
              "label": "Permit Type"
          },
          {
              "field": "effectivedate",
              "label": "Beginning Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "expirationdate",
              "label": "Ending Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "occupancytype",
              "label": "Occupancy Type"
          },
          {
              "field": "permitnumber",
              "label": "Permit Number"
          },
          {
              "field": "raindate",
              "label": "Rain Date",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "status",
              "label": "Status"
          },
          {
              "field": "address",
              "label": "Address"
          }
      ]
  },
};
