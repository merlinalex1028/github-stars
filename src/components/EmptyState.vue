<script setup lang="ts">
defineProps<{
  message?: string
  icon?: string
}>()
</script>

<template>
  <div class="empty-state">
    <span class="empty-icon">{{ icon || '🔍' }}</span>
    <p class="empty-message">{{ message || 'No results found' }}</p>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.4;
}

.empty-message {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}
</style>
