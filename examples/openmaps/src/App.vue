<script setup lang="ts">
/**
 * OpenMaps Example App
 *
 * Demonstrates the simplest usage of the Layerboard framework:
 * - Uses default flat layer panel with search
 * - Fetches metadata for layer info links
 */

import Layerboard from '@/components/Layerboard.vue'
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"

// WebMap ID for OpenMaps
const WEBMAP_ID = '376af635c84643cd816a8c5d017a53aa'

// Cyclomedia street-level imagery configuration
const cyclomediaConfig: CyclomediaConfig = {
  username: import.meta.env.VITE_CYCLOMEDIA_USERNAME || "",
  password: import.meta.env.VITE_CYCLOMEDIA_PASSWORD || "",
  apiKey: import.meta.env.VITE_CYCLOMEDIA_API_KEY || "",
  srs: "EPSG:4326",
  locale: "en-US",
}

// Pictometry oblique imagery credentials
const pictometryCredentials: PictometryCredentials = {
  clientId: import.meta.env.VITE_PICTOMETRY_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_PICTOMETRY_CLIENT_SECRET || "",
}
</script>

<template>
  <Layerboard
    title="OpenMaps"
    :web-map-id="WEBMAP_ID"
    theme-color="#0f4d90"
    sidebar-width="30%"
    :fetch-metadata="true"
    :cyclomedia-config="cyclomediaConfig"
    :pictometry-credentials="pictometryCredentials"
  />
</template>
