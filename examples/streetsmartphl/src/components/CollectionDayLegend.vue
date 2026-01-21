<script setup lang="ts">
/**
 * CollectionDayLegend.vue
 *
 * Shows a checkbox to toggle the Collection Day tiled layer on/off,
 * plus a legend showing the day-of-week color coding.
 *
 * Used by the PickupPHL topic in StreetSmartPHL.
 */

import { computed } from 'vue'

const props = defineProps<{
  /** Set of currently visible tiled layer IDs */
  visibleTiledLayers: Set<string>
  /** Function to toggle a tiled layer's visibility */
  toggleTiledLayer: (layerId: string) => void
}>()

// The tiled layer ID for collection day
const COLLECTION_DAY_LAYER_ID = 'collectionDay'

// Computed to check if the collection day layer is visible
const isCollectionDayVisible = computed(() => {
  return props.visibleTiledLayers.has(COLLECTION_DAY_LAYER_ID)
})

// Handle checkbox change
function onCheckboxChange() {
  props.toggleTiledLayer(COLLECTION_DAY_LAYER_ID)
}

// Legend items with colors matching the original StreetSmartPHL
const legendItems = [
  { label: 'Monday', colorClass: 'monday' },
  { label: 'Tuesday', colorClass: 'tuesday' },
  { label: 'Wednesday', colorClass: 'wednesday' },
  { label: 'Thursday', colorClass: 'thursday' },
  { label: 'Friday', colorClass: 'friday' },
]
</script>

<template>
  <div class="collection-day-legend">
    <!-- Checkbox to toggle the tiled layer -->
    <label class="layer-checkbox">
      <input
        type="checkbox"
        :checked="isCollectionDayVisible"
        @change="onCheckboxChange"
      />
      <span class="layer-name">Show Collection Day</span>
    </label>

    <!-- Day-of-week legend (only shown when layer is visible) -->
    <ul v-if="isCollectionDayVisible" class="legend-list">
      <li v-for="item in legendItems" :key="item.label" class="legend-item">
        <div class="legend-box" :class="item.colorClass"></div>
        <span class="legend-label">{{ item.label }}</span>
      </li>
      <li class="legend-item">
        <div class="legend-box-outline"></div>
        <span class="legend-label">
          "Twice-a-Week" Collection Boundary<br />
          (Center City and South Philly)
        </span>
      </li>
    </ul>

    <!-- Label legend -->
    <div v-if="isCollectionDayVisible" class="label-legend">
      <strong>Label legend:</strong>
      <ul class="label-list">
        <li class="primary-day">Primary Collection Day (Trash & Recycling)</li>
        <li class="secondary-day">Secondary Collection Day (Trash Only)</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.collection-day-legend {
  padding: 8px 0;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
}

.layer-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.layer-name {
  font-size: 14px;
  font-weight: normal;
}

.legend-list {
  list-style: none;
  margin: 8px 0 0 0;
  padding: 0 8px 0 32px;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 6px;
}

.legend-box {
  width: 20px;
  height: 20px;
  border: 1px solid #666;
  flex-shrink: 0;
}

.legend-box-outline {
  width: 20px;
  height: 20px;
  border: 4px solid #0f4d90;
  background-color: #fff;
  flex-shrink: 0;
}

/* Day colors matching original StreetSmartPHL */
.monday { background-color: #d7e37d; }
.tuesday { background-color: #2892c7; }
.wednesday { background-color: #8cb8a4; }
.thursday { background-color: #f77a2d; }
.friday { background-color: #fccf51; }

.legend-label {
  font-size: 13px;
  line-height: 1.4;
}

.label-legend {
  margin-top: 12px;
  padding: 0 8px 0 32px;
  font-size: 13px;
}

.label-list {
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;
}

.primary-day {
  color: #004da8;
  font-weight: bold;
}

.secondary-day {
  color: #ff0000;
  font-weight: bold;
}
</style>
