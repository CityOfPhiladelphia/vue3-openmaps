<script setup lang="ts">
// LayerCheckboxSet.vue - Reusable layer toggle checkboxes
// Can be used standalone or within TopicAccordion

import type { LayerConfig } from '@/types/layer'

const props = withDefaults(
  defineProps<{
    /** Array of layer configurations to display */
    layers: LayerConfig[]
    /** Set of currently visible layer IDs */
    visibleLayerIds: Set<string>
    /** Map of layer IDs to opacity values (0-1) */
    layerOpacities?: Record<string, number>
    /** Set of layer IDs currently loading */
    loadingLayerIds?: Set<string>
    /** Map of layer IDs to error messages */
    layerErrors?: Record<string, string>
    /** Current map zoom level (for zoom-based availability) */
    currentZoom?: number
    /** Whether to show opacity sliders */
    showOpacity?: boolean
    /** Whether to show legends */
    showLegend?: boolean
  }>(),
  {
    layerOpacities: () => ({}),
    loadingLayerIds: () => new Set(),
    layerErrors: () => ({}),
    currentZoom: 12,
    showOpacity: true,
    showLegend: true,
  }
)

const emit = defineEmits<{
  /** Emitted when a layer's visibility is toggled */
  (e: 'toggleLayer', layerId: string): void
  /** Emitted when a layer's opacity is changed */
  (e: 'setOpacity', layerId: string, opacity: number): void
}>()

// Helper functions
function isVisible(layerId: string): boolean {
  return props.visibleLayerIds.has(layerId)
}

function getLayerOpacity(layerId: string): number {
  return props.layerOpacities[layerId] ?? 1
}

function isLayerLoading(layerId: string): boolean {
  return props.loadingLayerIds.has(layerId)
}

function getLayerError(layerId: string): string | null {
  return props.layerErrors[layerId] || null
}

function isLayerAvailableAtZoom(config: LayerConfig): boolean {
  const zoom = props.currentZoom
  const minZoom = config.minZoom
  const maxZoom = config.maxZoom
  if (minZoom !== undefined && zoom < minZoom) return false
  if (maxZoom !== undefined && zoom > maxZoom) return false
  return true
}

function onToggleLayer(layerId: string) {
  emit('toggleLayer', layerId)
}

function onOpacityChange(layerId: string, event: Event) {
  const input = event.target as HTMLInputElement
  emit('setOpacity', layerId, parseFloat(input.value))
}
</script>

<template>
  <div class="layer-checkbox-set">
    <div
      v-for="layer in layers"
      :key="layer.id"
      class="layer-item"
    >
      <!-- Layer checkbox row -->
      <label
        class="layer-checkbox"
        :class="{
          'layer-unavailable': !isLayerAvailableAtZoom(layer),
          'layer-error': getLayerError(layer.id),
        }"
      >
        <input
          type="checkbox"
          :checked="isVisible(layer.id)"
          :disabled="!isLayerAvailableAtZoom(layer)"
          @change="onToggleLayer(layer.id)"
        />
        <span class="layer-title">
          {{ layer.title }}
          <span v-if="isLayerLoading(layer.id)" class="loading-indicator">
            Loading...
          </span>
          <span
            v-if="getLayerError(layer.id)"
            class="error-indicator"
            :title="getLayerError(layer.id) || ''"
          >
            Error
          </span>
          <span v-if="!isLayerAvailableAtZoom(layer)" class="zoom-indicator">
            (zoom in)
          </span>
        </span>
      </label>

      <!-- Opacity slider -->
      <div v-if="showOpacity && isVisible(layer.id)" class="opacity-control">
        <label class="opacity-label">
          Opacity: {{ Math.round(getLayerOpacity(layer.id) * 100) }}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="getLayerOpacity(layer.id)"
          class="opacity-slider"
          @input="onOpacityChange(layer.id, $event)"
        />
      </div>

      <!-- Legend -->
      <ul
        v-if="showLegend && isVisible(layer.id) && layer.legend?.length"
        class="layer-legend"
      >
        <li
          v-for="(item, index) in layer.legend"
          :key="index"
          class="legend-item"
        >
          <!-- Circle symbol -->
          <span
            v-if="item.type === 'circle'"
            class="legend-symbol legend-circle"
            :style="{ backgroundColor: item.color }"
          ></span>

          <!-- Line symbol -->
          <span
            v-else-if="item.type === 'line'"
            class="legend-symbol legend-line"
            :style="{
              backgroundColor: item.color,
              height: `${item.width || 2}px`,
            }"
          ></span>

          <!-- Fill symbol -->
          <span
            v-else-if="item.type === 'fill'"
            class="legend-symbol legend-fill"
            :style="{ backgroundColor: item.color }"
          ></span>

          <span class="legend-label">{{ item.label }}</span>
        </li>
      </ul>
    </div>

    <!-- Empty state -->
    <div v-if="layers.length === 0" class="empty-state">
      No layers available
    </div>
  </div>
</template>

<style scoped>
.layer-checkbox-set {
  display: flex;
  flex-direction: column;
}

.layer-item {
  border-bottom: 1px solid #eee;
}

.layer-item:last-child {
  border-bottom: none;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.layer-checkbox:hover {
  background-color: #f5f5f5;
}

.layer-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.layer-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer-title {
  line-height: 1.4;
  flex: 1;
}

/* Unavailable layer styles */
.layer-unavailable {
  color: #999;
  cursor: not-allowed;
}

.layer-unavailable:hover {
  background-color: transparent;
}

.zoom-indicator {
  font-size: 11px;
  color: #888;
  font-style: italic;
  margin-left: 4px;
}

/* Loading indicator */
.loading-indicator {
  font-size: 11px;
  color: #0f4d90;
  font-style: italic;
  margin-left: 4px;
}

/* Error indicator */
.layer-error {
  color: #c00;
}

.error-indicator {
  font-size: 11px;
  color: #c00;
  font-weight: bold;
  margin-left: 4px;
  cursor: help;
}

/* Opacity control */
.opacity-control {
  padding: 4px 8px 8px 36px;
}

.opacity-label {
  font-size: 11px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.opacity-slider {
  width: 100%;
  height: 4px;
  cursor: pointer;
}

/* Legend styles */
.layer-legend {
  list-style: none;
  margin: 0;
  padding: 4px 8px 8px 36px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.legend-symbol {
  flex-shrink: 0;
}

.legend-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-line {
  width: 20px;
  min-height: 2px;
  border-radius: 1px;
}

.legend-fill {
  width: 14px;
  height: 14px;
  border: 1px solid #666;
}

.legend-label {
  font-size: 12px;
  color: #555;
}

/* Empty state */
.empty-state {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
  font-size: 14px;
}
</style>
