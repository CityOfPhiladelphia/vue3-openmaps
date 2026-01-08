/**
 * Registered Community Organizations (RCO)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_RCO/FeatureServer/0
 */

import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";

export const registeredCommunityOrganizationsRco = {
  id: "registered-community-organizations-rco",
  title: "Registered Community Organizations (RCO)",
  type: "fill" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zoning_RCO/FeatureServer/0",
  opacity: 0.75,

  paint: {
      "fill-color": "rgba(0, 0, 0, 0.00)",
      "fill-opacity": 0.75,
      "fill-outline-color": "#6e6e6e"
  } as FillLayerSpecification["paint"],

  outlinePaint: {
      "line-color": "#6e6e6e",
      "line-width": 1.5
  } as LineLayerSpecification["paint"],

  legend: [
      {
          "type": "fill",
          "color": "rgba(0, 0, 0, 0.00)",
          "label": "Feature"
      }
  ],

  popup: {
      "title": "Registered Community Organization: {organization_name}",
      "fields": [
          {
              "field": "org_type",
              "label": "Organization Type"
          },
          {
              "field": "organization_address",
              "label": "Organization Address"
          },
          {
              "field": "meeting_location_address",
              "label": "Meeting Location Address"
          },
          {
              "field": "organization_name",
              "label": "Organization Name"
          },
          {
              "field": "preffered_contact_method",
              "label": "Preferred Contact Method"
          },
          {
              "field": "primary_name",
              "label": "Primary Name"
          },
          {
              "field": "primary_address",
              "label": "Primary Mailing Address"
          },
          {
              "field": "primary_email",
              "label": "Primary Email"
          },
          {
              "field": "primary_phone",
              "label": "Primary Phone"
          },
          {
              "field": "p_phone_ext",
              "label": "Primary Phone Ext.",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          },
          {
              "field": "alternate_name",
              "label": "Alternate Name"
          },
          {
              "field": "alternate_address",
              "label": "Alternate Mailing Address"
          },
          {
              "field": "alternate_email",
              "label": "Alternate Email"
          },
          {
              "field": "alternate_phone",
              "label": "Alternate Phone"
          },
          {
              "field": "a_phone_ext",
              "label": "Alternate Phone Ext.",
              "format": {
                  "digitSeparator": true,
                  "places": 0
              }
          }
      ]
  },
};
