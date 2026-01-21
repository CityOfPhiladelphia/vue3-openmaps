// useLayerConfig.ts - Layer state management composable
// Manages layer visibility, loading states, and configuration

import { ref, computed } from 'vue'
import type { LayerConfig } from '@/types'

export function useLayerConfig() {
  const layers = ref<LayerConfig[]>([])
  const visibleLayerIds = ref<Set<string>>(new Set())
  const loadingLayerIds = ref<Set<string>>(new Set())

  // TODO: Extract layer state logic from App.vue

  function toggleLayer(layerId: string) {
    if (visibleLayerIds.value.has(layerId)) {
      visibleLayerIds.value.delete(layerId)
    } else {
      visibleLayerIds.value.add(layerId)
    }
  }

  function setLayers(newLayers: LayerConfig[]) {
    layers.value = newLayers
  }

  return {
    layers: computed(() => layers.value),
    visibleLayerIds: computed(() => visibleLayerIds.value),
    loadingLayerIds: computed(() => loadingLayerIds.value),
    toggleLayer,
    setLayers,
  }
}
