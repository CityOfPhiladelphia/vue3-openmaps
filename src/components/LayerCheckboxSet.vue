<script setup lang="ts">
// LayerCheckboxSet.vue - Reusable layer toggle checkboxes
// Can be used standalone or within TopicAccordion

import type { LayerConfig } from '@/types'

defineProps<{
  layers: LayerConfig[]
  visibleLayerIds: Set<string>
}>()

defineEmits<{
  (e: 'toggle', layerId: string): void
}>()
</script>

<template>
  <div class="layer-checkbox-set">
    <!-- TODO: Extract checkbox logic from LayerPanel -->
    <slot />
  </div>
</template>

<style scoped>
.layer-checkbox-set {
  display: flex;
  flex-direction: column;
}
</style>
