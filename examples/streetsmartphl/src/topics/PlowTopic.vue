<script setup lang="ts">
// PlowTopic.vue - Snow plowing topic component for StreetSmartPHL

import { LayerCheckboxSet } from '../../../../src/components'
</script>

<template>
  <div class="plow-topic">
    <h3>Snow Plowing Information</h3>
    <!-- TODO: Add snow plowing-specific UI and layer controls -->
    <LayerCheckboxSet :layers="[]" :visible-layer-ids="new Set()" />
  </div>
</template>

<style scoped>
.plow-topic {
  padding: 1rem;
}
</style>
