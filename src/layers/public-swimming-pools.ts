/**
 * Public Swimming Pools
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Swimming_Pools/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const publicSwimmingPools = {
  id: "public-swimming-pools",
  title: "Public Swimming Pools",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PPR_Swimming_Pools/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#00c5ff",
      "circle-radius": 8.52,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#00c5ff",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Public Swimming Pool",
      "fields": [
          {
              "field": "amenity_name",
              "label": "Name"
          },
          {
              "field": "address_911",
              "label": "Address"
          },
          {
              "field": "zip_code",
              "label": "Zipcode"
          },
          {
              "field": "pool_type",
              "label": "Pool Type"
          },
          {
              "field": "pool_status",
              "label": "Pool Status"
          }
      ]
  },
};
