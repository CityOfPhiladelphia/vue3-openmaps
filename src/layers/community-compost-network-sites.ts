/**
 * Community Compost Network Sites
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Community_Compost_Network_Site/FeatureServer/0
 */

import type { FillLayerSpecification } from "maplibre-gl";

export const communityCompostNetworkSites = {
  id: "community-compost-network-sites",
  title: "Community Compost Network Sites",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Community_Compost_Network_Site/FeatureServer/0",
  opacity: 1,

  paint: {} as FillLayerSpecification["paint"],

  legend: [],

  popup: {
      "title": "{site_name}",
      "fields": [
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
              "field": "site_description",
              "label": "Description"
          },
          {
              "field": "site_status",
              "label": "Status"
          },
          {
              "field": "compost_site_type",
              "label": "Site Type"
          },
          {
              "field": "access_information",
              "label": "Access Information"
          },
          {
              "field": "council_district",
              "label": "Council District"
          }
      ]
  },
};
