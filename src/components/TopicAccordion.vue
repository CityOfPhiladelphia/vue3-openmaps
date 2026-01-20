<script setup lang="ts">
// TopicAccordion.vue - Accordion component for topic-based layer organization
// Used by apps like StreetSmartPHL that group layers by topic

defineProps<{
  topics: Array<{
    id: string
    title: string
    expanded?: boolean
  }>
}>()
</script>

<template>
  <div class="topic-accordion">
    <!-- TODO: Implement topic accordion UI -->
    <slot />
  </div>
</template>

<style scoped>
.topic-accordion {
  display: flex;
  flex-direction: column;
}
</style>
