<script setup lang="ts">
import type { RepoWithTrend } from '../types'
import RepoTrendCard from './RepoTrendCard.vue'

defineProps<{
  repos: RepoWithTrend[]
}>()
</script>

<template>
  <div class="rank-list">
    <RepoTrendCard
      v-for="(repo, index) in repos"
      :key="repo.id"
      :repo="repo"
      :class="['rank-item', { 'top-3': index < 3 }]"
    />
  </div>
</template>

<style scoped lang="scss">
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  &.top-3 {
    border-color: rgba(0, 229, 255, 0.15);
    background: rgba(0, 229, 255, 0.02);

    &:nth-child(1) {
      border-color: rgba(255, 215, 0, 0.2);
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(0, 229, 255, 0.02) 100%);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
    }

    &:nth-child(2) {
      border-color: rgba(192, 192, 192, 0.18);
      background: linear-gradient(135deg, rgba(192, 192, 192, 0.03) 0%, rgba(0, 229, 255, 0.02) 100%);
    }

    &:nth-child(3) {
      border-color: rgba(205, 127, 50, 0.18);
      background: linear-gradient(135deg, rgba(205, 127, 50, 0.03) 0%, rgba(0, 229, 255, 0.02) 100%);
    }
  }
}
</style>
