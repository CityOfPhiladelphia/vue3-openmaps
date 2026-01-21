<script setup lang="ts">
// TopicAccordion.vue - Accordion component for topic-based layer organization
// Used by apps like StreetSmartPHL that group layers by topic

import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Title displayed in the accordion header */
    title: string
    /** Optional icon name or component */
    icon?: string
    /** Whether the accordion is initially expanded */
    expanded?: boolean
    /** Array of layer IDs associated with this topic */
    layerIds?: string[]
    /** Optional CSS class for custom styling */
    headerClass?: string
  }>(),
  {
    expanded: false,
    layerIds: () => [],
  }
)

const emit = defineEmits<{
  /** Emitted when the accordion is toggled open/closed */
  (e: 'toggle', expanded: boolean): void
  /** Emitted when a layer within this topic changes */
  (e: 'layerChange', layerId: string, visible: boolean): void
}>()

// Internal expanded state, initialized from prop
const isExpanded = ref(props.expanded)

// Watch for external changes to expanded prop
watch(
  () => props.expanded,
  (newVal) => {
    isExpanded.value = newVal
  }
)

function toggleAccordion() {
  isExpanded.value = !isExpanded.value
  emit('toggle', isExpanded.value)
}
</script>

<template>
  <div class="topic-accordion" :class="{ 'is-expanded': isExpanded }">
    <!-- Accordion Header -->
    <button
      class="topic-header"
      :class="headerClass"
      type="button"
      :aria-expanded="isExpanded"
      @click="toggleAccordion"
    >
      <!-- Icon slot or FontAwesome icon -->
      <span v-if="icon || $slots.icon" class="topic-icon">
        <slot name="icon">
          <font-awesome-icon v-if="icon" :icon="['fas', icon]" />
        </slot>
      </span>

      <!-- Title -->
      <span class="topic-title">{{ title }}</span>

      <!-- Expand/collapse indicator -->
      <span class="topic-chevron" :class="{ 'is-rotated': isExpanded }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>

    <!-- Accordion Content -->
    <div v-show="isExpanded" class="topic-content">
      <!-- Default slot for custom topic content (layer checkboxes, etc.) -->
      <slot>
        <p class="topic-empty">No content provided for this topic.</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.topic-accordion {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.topic-accordion:last-child {
  margin-bottom: 0;
}

.topic-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  transition: background-color 0.2s ease;
}

.topic-header:hover {
  background: #ebebeb;
}

.topic-header:focus {
  outline: 2px solid #0f4d90;
  outline-offset: -2px;
}

.topic-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  color: #0f4d90;
}

.topic-icon:empty {
  display: none;
}

.topic-title {
  flex: 1;
}

.topic-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: transform 0.2s ease;
}

.topic-chevron.is-rotated {
  transform: rotate(180deg);
}

.topic-content {
  padding: 8px 16px 16px;
  background: #fff;
}

.topic-empty {
  color: #666;
  font-style: italic;
  font-size: 14px;
  margin: 0;
  padding: 8px 0;
}

/* Expanded state styling */
.topic-accordion.is-expanded .topic-header {
  background: #e8e8e8;
}
</style>
