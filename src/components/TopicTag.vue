<script setup lang="ts">
defineProps<{
  topic: string
  active?: boolean
  count?: number
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="topic-tag" :class="{ active }" @click="emit('click')">
    <span class="tag-label">#{{ topic }}</span>
    <span v-if="count !== undefined" class="tag-count">{{ count }}</span>
  </button>
</template>

<style scoped lang="scss">
.topic-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid rgba(100, 200, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    border-color: rgba(124, 77, 255, 0.3);
    background: rgba(124, 77, 255, 0.08);
  }

  &.active {
    color: #b388ff;
    border-color: rgba(124, 77, 255, 0.4);
    background: rgba(124, 77, 255, 0.12);
    box-shadow: 0 0 12px rgba(124, 77, 255, 0.12);
  }
}

.tag-label {
  white-space: nowrap;
}

.tag-count {
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
