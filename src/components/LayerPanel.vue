<script setup lang="ts">
import { computed } from "vue";
import type { LayerConfig } from "@/types/layer";
import { TextField } from "@phila/phila-ui-text-field";
import { Icon } from "@phila/phila-ui-core";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";

// Props with configuration options
const props = withDefaults(
  defineProps<{
    /** Array of layer configurations with component type */
    layerList: Array<{ config: LayerConfig; component: string }>;
    /** Set of currently visible layer IDs */
    visibleLayers: Set<string>;
    /** Map of layer IDs to opacity values (0-1) */
    layerOpacities: Record<string, number>;
    /** Set of layer IDs currently loading */
    loadingLayers: Set<string>;
    /** Map of layer IDs to error messages */
    layerErrors: Record<string, string>;
    /** Current map zoom level */
    currentZoom: number;
    /** Current search query */
    searchQuery: string;
    /** Map of layer URLs to metadata page URLs */
    layerMetadata: Record<string, string>;
    /** Display mode: 'flat' for simple list, 'topics' for accordion grouping */
    mode?: "flat" | "topics";
    /** Whether to show the search box */
    showSearch?: boolean;
    /** Whether to show opacity sliders */
    showOpacity?: boolean;
    /** Whether to show legends */
    showLegend?: boolean;
    /** Placeholder text for search input */
    searchPlaceholder?: string;
  }>(),
  {
    mode: "flat",
    showSearch: true,
    showOpacity: true,
    showLegend: true,
    searchPlaceholder: "Search layers...",
  }
);

// Emit events for layer changes
// Note: Vue converts @kebab-case listeners to camelCase, so we emit camelCase
const emit = defineEmits<{
  /** Emitted when a layer's visibility is toggled */
  (e: "toggleLayer", layerId: string): void;
  /** Emitted when a layer's opacity is changed */
  (e: "setOpacity", layerId: string, opacity: number): void;
  /** Emitted when the search query changes */
  (e: "updateSearch", query: string): void;
}>();

// Filtered layer list based on search query
const filteredLayerList = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.layerList;
  }
  const query = props.searchQuery.toLowerCase();
  return props.layerList.filter((layer) =>
    layer.config.title.toLowerCase().includes(query)
  );
});

// Normalize URL for matching (same logic as App.vue)
function normalizeUrl(url: string): string {
  let normalized = url.split("?")[0] || url;
  normalized = normalized.replace(/\/query$/, "");
  normalized = normalized.replace(/\/$/, "");
  return normalized.toLowerCase();
}

// Get metadata URL for a layer (if available)
function getMetadataUrl(layerUrl: string): string | null {
  const normalized = normalizeUrl(layerUrl);
  return props.layerMetadata[normalized] || null;
}

// Check if any layer in the list has metadata (to reserve space for info icons)
const anyLayerHasMetadata = computed(() => {
  return props.layerList.some((layer) => getMetadataUrl(layer.config.url));
});

// Helper functions
function isVisible(layerId: string) {
  return props.visibleLayers.has(layerId);
}

function getLayerOpacity(layerId: string): number {
  return props.layerOpacities[layerId] ?? 1;
}

function isLayerLoading(layerId: string): boolean {
  return props.loadingLayers.has(layerId);
}

function getLayerError(layerId: string): string | null {
  return props.layerErrors[layerId] || null;
}

function isLayerAvailableAtZoom(config: LayerConfig): boolean {
  const zoom = props.currentZoom;
  const minZoom = config.minZoom;
  const maxZoom = config.maxZoom;
  if (minZoom !== undefined && zoom < minZoom) return false;
  if (maxZoom !== undefined && zoom > maxZoom) return false;
  return true;
}

// Computed for v-model binding with TextField
const searchValue = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit("updateSearch", value),
});

function onToggleLayer(layerId: string) {
  emit("toggleLayer", layerId);
}

function onOpacityChange(layerId: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const opacity = parseFloat(input.value);
  emit("setOpacity", layerId, opacity);
}
</script>

<template>
  <aside class="layer-panel">
    <!-- Search box (configurable) -->
    <div v-if="showSearch" class="search-box">
      <TextField
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        class-name="layer-search-field"
      />
    </div>

    <!-- Topics mode: render slot content -->
    <div v-if="mode === 'topics'" class="topics-container">
      <slot name="topics">
        <!-- Default: show message if no topics provided -->
        <div class="no-topics">
          No topic components provided. Use the "topics" slot to add TopicAccordion components.
        </div>
      </slot>
    </div>

    <!-- Flat mode: render layer list -->
    <div
      v-else
      class="layer-list"
      :class="{ 'has-metadata': anyLayerHasMetadata }"
    >
      <div
        v-for="layer in filteredLayerList"
        :key="layer.config.id"
        class="layer-item"
      >
        <div class="layer-row">
          <!-- Info icon (metadata link) - shows if this layer has metadata, or placeholder if any layer has metadata -->
          <a
            v-if="getMetadataUrl(layer.config.url)"
            :href="getMetadataUrl(layer.config.url) || ''"
            target="_blank"
            rel="noopener noreferrer"
            class="metadata-link"
            title="View metadata"
            @click.stop
          >
            <Icon
              :icon-definition="faCircleInfo"
              size="small"
              inline
              decorative
            />
          </a>
          <span
            v-else-if="anyLayerHasMetadata"
            class="metadata-placeholder"
          ></span>

          <label
            class="layer-checkbox"
            :class="{
              'layer-unavailable': !isLayerAvailableAtZoom(layer.config),
              'layer-error': getLayerError(layer.config.id),
            }"
          >
            <input
              type="checkbox"
              :checked="isVisible(layer.config.id)"
              :disabled="!isLayerAvailableAtZoom(layer.config)"
              @change="onToggleLayer(layer.config.id)"
            />
            <span class="layer-title">
              {{ layer.config.title }}
              <span
                v-if="isLayerLoading(layer.config.id)"
                class="loading-indicator"
              >
                Loading...
              </span>
              <span
                v-if="getLayerError(layer.config.id)"
                class="error-indicator"
                :title="getLayerError(layer.config.id) || ''"
              >
                Error
              </span>
              <span
                v-if="!isLayerAvailableAtZoom(layer.config)"
                class="zoom-indicator"
              >
                (zoom in)
              </span>
            </span>
          </label>
        </div>

        <!-- Opacity slider (shown when layer is visible and showOpacity is true) -->
        <div
          v-if="showOpacity && isVisible(layer.config.id)"
          class="opacity-control"
        >
          <label class="opacity-label">
            Opacity: {{ Math.round(getLayerOpacity(layer.config.id) * 100) }}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="getLayerOpacity(layer.config.id)"
            class="opacity-slider"
            @input="onOpacityChange(layer.config.id, $event)"
          />
        </div>

        <!-- Legend (shown when layer is visible, showLegend is true, and has legend items) -->
        <ul
          v-if="showLegend && isVisible(layer.config.id) && layer.config.legend?.length"
          class="layer-legend"
        >
          <li
            v-for="(item, index) in layer.config.legend"
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

      <div v-if="filteredLayerList.length === 0" class="no-results">
        No layers match "{{ searchQuery }}"
      </div>
    </div>
  </aside>
</template>

<style scoped>
.layer-panel {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Search box styles */
.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.search-box :deep(.phila-input) {
  width: 100%;
}

.search-box :deep(.phila-text-field) {
  width: 100% !important;
}

/* Topics container for accordion mode */
.topics-container {
  flex: 1;
  overflow-y: auto;
}

.no-topics {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.layer-list {
  padding: 8px 16px;
  flex: 1;
  overflow-y: auto;
}

/* Layer row - contains info icon and checkbox/label */
.layer-row {
  display: flex;
  align-items: center;
}

/* Metadata info icon link */
.metadata-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  min-height: 24px;
  color: var(--Schemes-On-Surface, #000);
  flex-shrink: 0;
  align-self: center;
}

/* Placeholder to maintain alignment when layer has no metadata but others do */
.metadata-placeholder {
  width: 24px;
  min-height: 24px;
  flex-shrink: 0;
  align-self: center;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}

.layer-checkbox:hover {
  background-color: #f5f5f5;
}

.layer-checkbox input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
  align-self: center;
}

.layer-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer-title {
  line-height: 1.4;
  flex: 1;
}

/* Unavailable layer styles (zoom range) */
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
  padding: 4px 8px 12px 40px;
}

/* Adjust padding when metadata icons are shown */
.has-metadata .opacity-control {
  padding-left: 64px;
}

.opacity-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.opacity-slider {
  width: 100%;
  height: 4px;
  cursor: pointer;
}

/* No results message */
.no-results {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}

/* Legend styles */
.layer-legend {
  list-style: none;
  margin: 0 0 8px 0;
  padding: 4px 8px 8px 40px;
}

/* Adjust padding when metadata icons are shown */
.has-metadata .layer-legend {
  padding-left: 64px;
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
</style>
