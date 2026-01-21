<script setup lang="ts">
/**
 * SweepLegend.vue - Legend and layer selection for SweepPHL
 *
 * Provides radio button selection for three mutually exclusive layer groups:
 * 1. Swept Streets + Today's Route (Mon-Thu only)
 * 2. All Route Locations (with day-of-week colors)
 * 3. 2022 Litter Index (choropleth)
 */

import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  /** Set of currently visible layer IDs */
  visibleLayerIds: Set<string>
  /** Function to set multiple layers visible/invisible */
  setLayersVisible: (layerIds: string[], visible: boolean) => void
}>()

// Selected radio option
const selectedOption = ref<'swept' | 'allRoutes' | 'litterIndex'>('swept')

// Get current day of week
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const currentDay = new Date().getDay()
const currentWeekDay = computed(() => weekDays[currentDay])
const isWeekday = computed(() => currentDay >= 1 && currentDay <= 4)

// Layer IDs (kebab-cased from WebMap layer titles)
const sweptStreetsLayerId = 'swept-streets'
const allRoutesLayerId = 'all-route-locations'
const litterIndexLayerId = '2022-litter-index'

// Day-specific route layer IDs (Mon-Thu)
const dayRouteLayerIds: Record<number, string> = {
  1: 'monday-route-locations',
  2: 'tuesday-route-locations',
  3: 'wednesday-route-locations',
  4: 'thursday-route-locations',
}

// Get all layer IDs for turning off
const allSweepLayerIds = [
  sweptStreetsLayerId,
  allRoutesLayerId,
  litterIndexLayerId,
  ...Object.values(dayRouteLayerIds),
]

// Handle radio selection change
function onOptionChange(option: 'swept' | 'allRoutes' | 'litterIndex') {
  selectedOption.value = option

  // Turn off all sweep layers first
  props.setLayersVisible(allSweepLayerIds, false)

  // Turn on selected layer(s)
  if (option === 'swept') {
    const layersToShow = [sweptStreetsLayerId]
    // On Mon-Thu, also show the day-specific route layer
    if (isWeekday.value && dayRouteLayerIds[currentDay]) {
      layersToShow.push(dayRouteLayerIds[currentDay])
    }
    props.setLayersVisible(layersToShow, true)
  } else if (option === 'allRoutes') {
    props.setLayersVisible([allRoutesLayerId], true)
  } else if (option === 'litterIndex') {
    props.setLayersVisible([litterIndexLayerId], true)
  }
}

// Initialize with swept streets on mount
// SweepLegend is solely responsible for layer visibility - no default layers in App.vue
onMounted(() => {
  console.log('[SweepLegend] onMounted called - setting swept streets visible')
  onOptionChange('swept')
})
</script>

<template>
  <div class="sweep-legend">
    <!-- Option 1: Swept Streets -->
    <div class="legend-option">
      <label class="radio-label">
        <input
          type="radio"
          name="sweep-option"
          :checked="selectedOption === 'swept'"
          @change="onOptionChange('swept')"
        />
        <span class="option-title">Swept Streets</span>
      </label>

      <!-- Legend items (shown when selected) -->
      <div v-if="selectedOption === 'swept'" class="legend-items">
        <div class="legend-item">
          <span class="legend-line legend-line--swept"></span>
          <span class="legend-label">Swept Streets</span>
        </div>
        <div v-if="isWeekday" class="legend-item">
          <span class="legend-line legend-line--day-route"></span>
          <span class="legend-label">{{ currentWeekDay }} Route Locations</span>
        </div>
      </div>
    </div>

    <!-- Option 2: All Route Locations -->
    <div class="legend-option">
      <label class="radio-label">
        <input
          type="radio"
          name="sweep-option"
          :checked="selectedOption === 'allRoutes'"
          @change="onOptionChange('allRoutes')"
        />
        <span class="option-title">All Route Locations</span>
      </label>

      <!-- Legend items (shown when selected) -->
      <div v-if="selectedOption === 'allRoutes'" class="legend-items">
        <div class="legend-item">
          <span class="legend-line legend-line--mon"></span>
          <span class="legend-label">Mon</span>
        </div>
        <div class="legend-item">
          <span class="legend-line legend-line--tue"></span>
          <span class="legend-label">Tue</span>
        </div>
        <div class="legend-item">
          <span class="legend-line legend-line--wed"></span>
          <span class="legend-label">Wed</span>
        </div>
        <div class="legend-item">
          <span class="legend-line legend-line--thu"></span>
          <span class="legend-label">Thu</span>
        </div>
        <div class="legend-item">
          <span class="legend-line legend-line--multi"></span>
          <span class="legend-label">Multi</span>
        </div>
      </div>
    </div>

    <!-- Option 3: 2022 Litter Index -->
    <div class="legend-option">
      <label class="radio-label">
        <input
          type="radio"
          name="sweep-option"
          :checked="selectedOption === 'litterIndex'"
          @change="onOptionChange('litterIndex')"
        />
        <span class="option-title">2022 Litter Index</span>
      </label>

      <!-- Legend items (shown when selected) -->
      <div v-if="selectedOption === 'litterIndex'" class="legend-items litter-index-legend">
        <div class="legend-item">
          <span class="legend-box legend-box--high"></span>
          <span class="legend-label">3.250001 - 4.000000</span>
        </div>
        <div class="legend-item">
          <span class="legend-box legend-box--medium-high"></span>
          <span class="legend-label">2.750001 - 3.250000</span>
        </div>
        <div class="legend-item">
          <span class="legend-box legend-box--medium"></span>
          <span class="legend-label">2.250001 - 2.750000</span>
        </div>
        <div class="legend-item">
          <span class="legend-box legend-box--medium-low"></span>
          <span class="legend-label">1.750001 - 2.250000</span>
        </div>
        <div class="legend-item">
          <span class="legend-box legend-box--low"></span>
          <span class="legend-label">1.000000 - 1.750000</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sweep-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-option {
  display: flex;
  flex-direction: column;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 0;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
}

.option-title {
  font-size: 14px;
  color: #333;
}

.legend-items {
  margin-left: 26px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-line {
  width: 25px;
  height: 4px;
  flex-shrink: 0;
  border-radius: 1px;
}

.legend-box {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 1px solid #6e6e6e;
}

/* Swept Streets - Magenta/Pink */
.legend-line--swept {
  background-color: #e601a9;
}

/* Day Route - Yellow */
.legend-line--day-route {
  background-color: #ffff9b;
}

/* Monday - Green */
.legend-line--mon {
  background-color: #4ce601;
}

/* Tuesday - Blue */
.legend-line--tue {
  background-color: #016eff;
}

/* Wednesday - Orange */
.legend-line--wed {
  background-color: #ffaa01;
}

/* Thursday - Purple */
.legend-line--thu {
  background-color: #c301ff;
}

/* Multi-day - Cyan */
.legend-line--multi {
  background-color: #01ffc5;
}

/* Litter Index - Color scale */
.legend-box--high {
  background-color: rgba(168, 0, 0, 0.53);
}

.legend-box--medium-high {
  background-color: rgba(255, 0, 0, 0.53);
}

.legend-box--medium {
  background-color: rgb(255, 128, 0);
}

.legend-box--medium-low {
  background-color: rgba(255, 255, 0, 0.53);
}

.legend-box--low {
  background-color: rgba(139, 209, 0, 0.53);
}

.legend-label {
  font-size: 12px;
  color: #555;
}

.litter-index-legend .legend-item {
  padding: 2px 0;
}
</style>
