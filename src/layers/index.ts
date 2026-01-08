/**
 * Layer Index
 *
 * Exports the layers currently in use by the app.
 * Add more layers here as they are integrated.
 */

import { athleticFieldsTracksAndCourts } from "./athletic-fields-tracks-and-courts";
import { schools } from "./schools";
import { policeDistricts } from "./police-districts";
import { bikeNetwork } from "./bike-network";
import { zoningBaseDistricts } from "./zoning-base-districts";
import { constructionPermitsBuilding } from "./construction-permits-building";
import { currentlyActiveLaneClosurePermits } from "./currently-active-lane-closure-permits";

// Re-export individual layers
export {
  athleticFieldsTracksAndCourts,
  schools,
  policeDistricts,
  bikeNetwork,
  zoningBaseDistricts,
  constructionPermitsBuilding,
  currentlyActiveLaneClosurePermits,
};

// Export as array for easy iteration
export const layers = [
  athleticFieldsTracksAndCourts,
  schools,
  policeDistricts,
  bikeNetwork,
  zoningBaseDistricts,
  constructionPermitsBuilding,
  currentlyActiveLaneClosurePermits,
];

// Export layer type
export type LayerConfig = typeof layers[number];
