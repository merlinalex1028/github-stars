<script setup lang="ts">
import type { TimeRange } from '../types'

defineProps<{
  selected: TimeRange
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: TimeRange): void
}>()

const tabs: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]
</script>

<template>
  <div class="date-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab-btn"
      :class="{ active: selected === tab.value }"
      @click="emit('update:selected', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.date-tabs {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(100, 200, 255, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.tab-btn {
  padding: 7px 20px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  &.active {
    background: rgba(0, 229, 255, 0.12);
    color: #00e5ff;
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.12);
  }
}
</style>
