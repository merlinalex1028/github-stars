<script setup lang="ts">
import { ref } from 'vue'

const modelValue = defineModel<string>({ default: '' })
const focused = ref(false)
</script>

<template>
  <div class="search-bar" :class="{ focused }">
    <span class="search-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>
    <input
      v-model="modelValue"
      type="text"
      class="search-input"
      placeholder="Search repositories..."
      @focus="focused = true"
      @blur="focused = false"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 42px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(100, 200, 255, 0.08);
  border-radius: 10px;
  transition: all 0.25s;

  &.focused {
    border-color: rgba(0, 229, 255, 0.35);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.08);
    background: rgba(0, 229, 255, 0.03);
  }
}

.search-icon {
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
}
</style>
