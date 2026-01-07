/**
 * Registered Community Gardens
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Registered_Community_Gardens/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const registeredCommunityGardens = {
  id: "registered-community-gardens",
  title: "Registered Community Gardens",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Registered_Community_Gardens/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": "#58c04d",
      "circle-radius": 12,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#58c04d",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "{garden_name}",
      "fields": [
          {
              "field": "park_name",
              "label": "Park Name"
          },
          {
              "field": "address",
              "label": "Address"
          },
          {
              "field": "contact_email",
              "label": "Contact Email"
          },
          {
              "field": "contact_website",
              "label": "Contact Website"
          },
          {
              "field": "garden_description",
              "label": "Garden Description"
          },
          {
              "field": "hours_sunday",
              "label": "Hours Sunday"
          },
          {
              "field": "hours_monday",
              "label": "Hours Monday"
          },
          {
              "field": "hours_tuesday",
              "label": "Hours Tuesday"
          },
          {
              "field": "hours_wednesday",
              "label": "Hours Wednesday"
          },
          {
              "field": "hours_thursday",
              "label": "Hours Thursday"
          },
          {
              "field": "hours_friday",
              "label": "Hours Friday"
          },
          {
              "field": "hours_saturday",
              "label": "Hours Saturday"
          },
          {
              "field": "garden_status",
              "label": "State"
          },
          {
              "field": "council_district",
              "label": "Council District"
          }
      ]
  },
};
