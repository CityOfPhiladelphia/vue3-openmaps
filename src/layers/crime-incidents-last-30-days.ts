/**
 * Crime Incidents - Last 30 Days
 *
 * Auto-generated from Esri WebMap
 * Source: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/INCIDENTS_PART1_PART2/FeatureServer/0
 */

import type { CircleLayerSpecification } from "maplibre-gl";

export const crimeIncidentsLast30Days = {
  id: "crime-incidents-last-30-days",
  title: "Crime Incidents - Last 30 Days",
  type: "circle" as const,
  url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/INCIDENTS_PART1_PART2/FeatureServer/0",
  where: "dispatch_date_time BETWEEN CURRENT_TIMESTAMP - 30 AND CURRENT_TIMESTAMP",
  minZoom: 14.43,
  opacity: 1,

  paint: {
      "circle-color": [
          "match",
          [
              "get",
              "text_general_code"
          ],
          "Aggravated Assault No Firearm",
          "#ed5151",
          "Aggravated Assault Firearm",
          "#ed5151",
          "Other Assaults",
          "#ed5151",
          "Homicide - Criminal",
          "#ed5151",
          "Offenses Against Family and Children",
          "#ed5151",
          "Homicide - Gross Negligence",
          "#ed5151",
          "Homicide - Justifiable",
          "#ed5151",
          "Thefts",
          "#149ece",
          "Theft from Vehicle",
          "#149ece",
          "Burglary Residential",
          "#149ece",
          "Motor Vehicle Theft",
          "#149ece",
          "Robbery No Firearm",
          "#149ece",
          "Robbery Firearm",
          "#149ece",
          "Burglary Non-Residential",
          "#149ece",
          "Vandalism/Criminal Mischief",
          "#9e559c",
          "Disorderly Conduct",
          "#9e559c",
          "Public Drunkenness",
          "#9e559c",
          "Vagrancy/Loitering",
          "#9e559c",
          "Fraud",
          "#fc921f",
          "Embezzlement",
          "#fc921f",
          "Forgery and Counterfeiting",
          "#fc921f",
          "Narcotic / Drug Law Violations",
          "#3caf99",
          "DRIVING UNDER THE INFLUENCE",
          "#3caf99",
          "Liquor Law Violations",
          "#3caf99",
          "Rape",
          "#b7814a",
          "Prostitution and Commercialized Vice",
          "#b7814a",
          "Other Sex Offenses (Not Commercialized)",
          "#b7814a",
          "Weapon Violations",
          "#a7c636",
          "Arson",
          "#fd7f6f",
          "Receiving Stolen Property",
          "#f789d8",
          "All Other Offenses",
          "#7f7f7f",
          "Gambling Violations",
          "#f3c613",
          "#aaaaaa"
      ],
      "circle-radius": 7.46,
      "circle-opacity": 1
  } as CircleLayerSpecification["paint"],

  legend: [
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Aggravated Assault No Firearm"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Aggravated Assault Firearm"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Other Assaults"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Homicide - Criminal"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Offenses Against Family and Children"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Homicide - Gross Negligence"
      },
      {
          "type": "circle",
          "color": "#ed5151",
          "label": "Homicide - Justifiable"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Thefts"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Theft from Vehicle"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Burglary Residential"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Motor Vehicle Theft"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Robbery No Firearm"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Robbery Firearm"
      },
      {
          "type": "circle",
          "color": "#149ece",
          "label": "Burglary Non-Residential"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Vandalism/Criminal Mischief"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Disorderly Conduct"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Public Drunkenness"
      },
      {
          "type": "circle",
          "color": "#9e559c",
          "label": "Vagrancy/Loitering"
      },
      {
          "type": "circle",
          "color": "#fc921f",
          "label": "Fraud"
      },
      {
          "type": "circle",
          "color": "#fc921f",
          "label": "Embezzlement"
      },
      {
          "type": "circle",
          "color": "#fc921f",
          "label": "Forgery and Counterfeiting"
      },
      {
          "type": "circle",
          "color": "#3caf99",
          "label": "Narcotic / Drug Law Violations"
      },
      {
          "type": "circle",
          "color": "#3caf99",
          "label": "Driving Under the Influence"
      },
      {
          "type": "circle",
          "color": "#3caf99",
          "label": "Liquor Law Violations"
      },
      {
          "type": "circle",
          "color": "#b7814a",
          "label": "Rape"
      },
      {
          "type": "circle",
          "color": "#b7814a",
          "label": "Prostitution and Commercialized Vice"
      },
      {
          "type": "circle",
          "color": "#b7814a",
          "label": "Other Sex Offenses (Not Commercialized)"
      },
      {
          "type": "circle",
          "color": "#a7c636",
          "label": "Weapon Violations"
      },
      {
          "type": "circle",
          "color": "#fd7f6f",
          "label": "Arson"
      },
      {
          "type": "circle",
          "color": "#f789d8",
          "label": "Receiving Stolen Property"
      },
      {
          "type": "circle",
          "color": "#7f7f7f",
          "label": "All Other Offenses"
      },
      {
          "type": "circle",
          "color": "#f3c613",
          "label": "Gambling Violations"
      }
  ],

  popup: {
      "title": "Crime Incident - {text_general_code}",
      "fields": [
          {
              "field": "dispatch_date_time",
              "label": "Dispatch Date/Time",
              "format": {
                  "dateFormat": "shortDateShortTime",
                  "digitSeparator": false
              }
          },
          {
              "field": "location_block",
              "label": "Location"
          }
      ]
  },
};
