<script setup lang="ts">
// PaveTopic.vue - Paving topic component for StreetSmartPHL

import { LayerCheckboxSet } from '../../../../src/components'
</script>

<template>
  <div class="pave-topic">
    <h3>Paving Information</h3>
    <!-- TODO: Add paving-specific UI and layer controls -->
    <LayerCheckboxSet :layers="[]" :visible-layer-ids="new Set()" />
  </div>
</template>

<style scoped>
.pave-topic {
  padding: 1rem;
}
</style>
