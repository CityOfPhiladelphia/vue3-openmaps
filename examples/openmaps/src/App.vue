<script setup lang="ts">
// OpenMaps Example App
// Demonstrates flat layer list mode

import { LayerPanel, MapPanel } from '../../../src/components'
import { useLayerboard } from '../../../src/composables'
import { config } from './config'

const { isInitialized, initialize } = useLayerboard(config)

initialize()
</script>

<template>
  <div class="app">
    <header>
      <h1>OpenMaps</h1>
    </header>
    <main>
      <LayerPanel />
      <MapPanel />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  display: flex;
  flex: 1;
}
</style>
