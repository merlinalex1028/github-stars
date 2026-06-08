<script setup lang="ts">
defineProps<{
  languages: string[]
  selected: string
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: string): void
}>()
</script>

<template>
  <div class="language-filter">
    <button
      class="pill"
      :class="{ active: selected === '' }"
      @click="emit('update:selected', '')"
    >
      All
    </button>
    <button
      v-for="lang in languages"
      :key="lang"
      class="pill"
      :class="{ active: selected === lang }"
      @click="emit('update:selected', lang)"
    >
      {{ lang }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.language-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(100, 200, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #fff;
    border-color: rgba(0, 229, 255, 0.25);
    background: rgba(0, 229, 255, 0.06);
  }

  &.active {
    color: #00e5ff;
    border-color: rgba(0, 229, 255, 0.4);
    background: rgba(0, 229, 255, 0.1);
    box-shadow: 0 0 16px rgba(0, 229, 255, 0.15);
  }
}
</style>
