// useLayerboard.ts - Main framework composable
// Provides the primary interface for initializing and using vue3-layerboard

import { ref, computed } from 'vue'
import type { LayerboardConfig } from '@/types'

export function useLayerboard(config: LayerboardConfig) {
  const isInitialized = ref(false)
  const error = ref<Error | null>(null)

  // TODO: Implement main framework initialization logic
  // - Load layer configs (static or dynamic mode)
  // - Set up map instance
  // - Initialize state management

  async function initialize() {
    try {
      isInitialized.value = true
    } catch (e) {
      error.value = e as Error
    }
  }

  return {
    isInitialized: computed(() => isInitialized.value),
    error: computed(() => error.value),
    initialize,
  }
}
