<script setup lang="ts">
/**
 * PlowDeploymentLegend.vue - Legend for PlowPHL plow deployment status
 *
 * Displays color-coded legend items based on the current deployment type:
 * - Full Deployment: Shows all treated status colors + not treated by city
 * - Conditional Deployment: Also shows conditional streets
 * - Highways Only: Also shows highways-only streets
 * - No Active Event: Legend is hidden
 */

defineProps<{
  /** Current deployment type from storms API */
  deploymentType: string
}>()

// Deployment type constants
const FULL_DEPLOYMENT = 'Full Deployment'
const CONDITIONAL_DEPLOYMENT = 'Conditional Deployment'
const HIGHWAYS_ONLY = 'Highways Only'
const NO_ACTIVE_EVENT = ''
</script>

<template>
  <div
    v-if="deploymentType && deploymentType !== NO_ACTIVE_EVENT && deploymentType !== 'There is no active Snow Event.'"
    class="plow-legend"
  >
    <div class="legend-title">Treated street status</div>

    <!-- Treated status colors (always shown during active deployment) -->
    <div class="legend-item">
      <span class="legend-line legend-line--less-six"></span>
      <span class="legend-label">Treated less than 6 hours ago</span>
    </div>

    <div class="legend-item">
      <span class="legend-line legend-line--six-twelve"></span>
      <span class="legend-label">Treated between 6 and 12 hours ago</span>
    </div>

    <div class="legend-item">
      <span class="legend-line legend-line--more-twelve"></span>
      <span class="legend-label">Treated over 12 hours ago</span>
    </div>

    <!-- Conditional deployment specific -->
    <div v-if="deploymentType === CONDITIONAL_DEPLOYMENT" class="legend-item">
      <span class="legend-line legend-line--conditional"></span>
      <span class="legend-label">Streets not treated during Conditional Deployment</span>
    </div>

    <!-- Highways only specific -->
    <div v-if="deploymentType === HIGHWAYS_ONLY" class="legend-item">
      <span class="legend-line legend-line--highways"></span>
      <span class="legend-label">Streets not treated during Highways Only Deployment</span>
    </div>

    <!-- Not treated by city (always shown during active deployment) -->
    <div class="legend-item">
      <span class="legend-line legend-line--not-treated"></span>
      <span class="legend-label">Streets not treated by the City</span>
    </div>
  </div>
</template>

<style scoped>
.plow-legend {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #fff;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.legend-line {
  width: 30px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 2px;
}

/* Treated less than 6 hours ago - solid dark blue */
.legend-line--less-six {
  background-color: #0f4d90;
}

/* Treated 6-12 hours ago - dashed medium blue */
.legend-line--six-twelve {
  background: repeating-linear-gradient(
    90deg,
    #176ac4 0px,
    #176ac4 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Treated over 12 hours ago - dashed light blue */
.legend-line--more-twelve {
  background: repeating-linear-gradient(
    90deg,
    #5c8ef4 0px,
    #5c8ef4 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Conditional deployment streets - orange */
.legend-line--conditional {
  background-color: #eb6d00;
  height: 3px;
}

/* Highways only streets - orange */
.legend-line--highways {
  background-color: #eb6d00;
  height: 3px;
}

/* Streets not treated by city - gray */
.legend-line--not-treated {
  background-color: #949494;
  height: 3px;
}

.legend-label {
  font-size: 12px;
  color: #555;
  line-height: 1.4;
}
</style>
