/**
 * Green Stormwater Infrastructure Projects (Public)
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/GSI_Public_Projects_Point/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const greenStormwaterInfrastructureProjectsPublic = {
  id: "green-stormwater-infrastructure-projects-public",
  title: "Green Stormwater Infrastructure Projects (Public)",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/GSI_Public_Projects_Point/FeatureServer/0",
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "primaryprogramname"
          ],
          "Open Space",
          "#ed5151",
          "Open Space,Streets",
          "#149ece",
          "Facilities",
          "#a7c636",
          "Streets",
          "#9e559c",
          "Vacant Land",
          "#fc921f",
          "Streets,Vacant Land",
          "#ffde3e",
          "Schools",
          "#f789d8",
          "Facilities,Open Space,Streets",
          "#b7814a",
          "Facilities,Streets",
          "#3caf99",
          "Open Space,Streets,Vacant Land",
          "#6b6bd6",
          "#aaaaaa"
      ],
      "circle-radius": 9,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Open Space"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Open Space,Streets"
      },
      {
          "type": "circle",
          "color": "#a7c636",
          "label": "Facilities"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Streets"
      },
      {
          "type": "circle",
          "color": "#fc921f",
          "label": "Vacant Land"
      },
      {
          "type": "circle",
          "color": "#ffde3e",
          "label": "Streets,Vacant Land"
      },
      {
          "type": "circle",
          "color": "#f789d8",
          "label": "Schools"
      },
      {
          "type": "circle",
          "color": "#b7814a",
          "label": "Facilities,Open Space,Streets"
      },
      {
          "type": "circle",
          "color": "#3caf99",
          "label": "Facilities,Streets"
      },
      {
          "type": "circle",
          "color": "#6b6bd6",
          "label": "Open Space,Streets,Vacant Land"
      }
  ],

  popup: {
      "title": "GSI Public Project - {projectname}",
      "fields": [
          {
              "field": "projectid",
              "label": "Project ID"
          },
          {
              "field": "projectname",
              "label": "Project Name"
          },
          {
              "field": "worknumber",
              "label": "Work Number"
          },
          {
              "field": "statuscategory",
              "label": "Status Category"
          },
          {
              "field": "primaryprogramname",
              "label": "Primary Program Name"
          },
          {
              "field": "locationtype",
              "label": "Location Type"
          },
          {
              "field": "smp_treetrench",
              "label": "SMP Tree Trench"
          },
          {
              "field": "smp_planter",
              "label": "SMP Planter"
          },
          {
              "field": "smp_bumpout",
              "label": "SMP Bumpout"
          },
          {
              "field": "smp_raingarden",
              "label": "SMP Rain Garden"
          },
          {
              "field": "smp_basin",
              "label": "SMP Basin"
          },
          {
              "field": "smp_infiltrationstoragetrench",
              "label": "SMP Infiltration Storage Trench"
          },
          {
              "field": "smp_perviouspaving",
              "label": "SMP Pervious Paving"
          },
          {
              "field": "smp_swale",
              "label": "SMP Swale"
          },
          {
              "field": "smp_wetland",
              "label": "SMP Wetland"
          },
          {
              "field": "smp_cisternrainbarrel",
              "label": "SMP Cistern Rain Barrel"
          },
          {
              "field": "smp_greenroof",
              "label": "SMP Green Roof"
          },
          {
              "field": "smp_stormwatertree",
              "label": "SMP Stormwater Tree"
          },
          {
              "field": "smp_drainagewell",
              "label": "SMP Drainage Well"
          },
          {
              "field": "smp_greengutter",
              "label": "SMP Green Gutter"
          },
          {
              "field": "smp_blueroof",
              "label": "SMP Blue Roof"
          },
          {
              "field": "smp_depaving",
              "label": "SMP Depaving"
          },
          {
              "field": "smp_inletdisconnection",
              "label": "SMP Inlet Disconnection"
          },
          {
              "field": "status",
              "label": "Status"
          },
          {
              "field": "smpdata_phase",
              "label": "SMP Data Phase"
          },
          {
              "field": "worktype",
              "label": "Work Type"
          },
          {
              "field": "project_type",
              "label": "Project Type"
          },
          {
              "field": "gsiip_district",
              "label": "GSI Planning District"
          },
          {
              "field": "outreach_contact",
              "label": "Outreach Contact"
          },
          {
              "field": "outreach_email",
              "label": "Outreach Email"
          },
          {
              "field": "project_page_link",
              "label": "Project Page Link"
          }
      ]
  },
};
