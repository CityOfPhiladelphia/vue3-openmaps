<script setup lang="ts">
// StreetSmartPHL Example App
// Demonstrates topic-based accordion mode

import { TopicAccordion, MapPanel } from '../../../src/components'
import { useLayerboard } from '../../../src/composables'
import { config } from './config'

const { isInitialized, initialize } = useLayerboard(config)

initialize()
</script>

<template>
  <div class="app">
    <header>
      <h1>StreetSmartPHL</h1>
    </header>
    <main>
      <aside>
        <TopicAccordion :topics="config.topics || []">
          <!-- Topic components will be rendered here -->
        </TopicAccordion>
      </aside>
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

aside {
  width: 300px;
}
</style>
