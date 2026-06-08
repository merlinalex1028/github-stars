<script setup lang="ts">
import type { RepoWithTrend } from '../types'
import TopicTag from './TopicTag.vue'

defineProps<{
  repo: RepoWithTrend
}>()

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="detail-panel">
    <div class="panel-header">
      <img class="avatar" :src="repo.ownerAvatar" :alt="repo.owner" />
      <div>
        <a class="repo-name" :href="repo.url" target="_blank" rel="noopener">
          {{ repo.fullName }}
        </a>
        <p class="repo-desc">{{ repo.description }}</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-cell">
        <span class="stat-value">{{ formatNumber(repo.stars) }}</span>
        <span class="stat-label">Stars</span>
      </div>
      <div class="stat-cell">
        <span class="stat-value">{{ formatNumber(repo.forks) }}</span>
        <span class="stat-label">Forks</span>
      </div>
      <div class="stat-cell">
        <span class="stat-value">{{ formatNumber(repo.openIssues) }}</span>
        <span class="stat-label">Issues</span>
      </div>
      <div class="stat-cell">
        <span class="stat-value highlight">+{{ formatNumber(repo.todayStars) }}</span>
        <span class="stat-label">Today</span>
      </div>
    </div>

    <div class="meta-row" v-if="repo.language">
      <span class="meta-label">Language</span>
      <span class="meta-value">{{ repo.language }}</span>
    </div>
    <div class="meta-row" v-if="repo.license">
      <span class="meta-label">License</span>
      <span class="meta-value">{{ repo.license }}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Updated</span>
      <span class="meta-value">{{ formatDate(repo.pushedAt) }}</span>
    </div>

    <div class="topics-section" v-if="repo.topics.length">
      <span class="topics-label">Topics</span>
      <div class="topics-list">
        <TopicTag v-for="t in repo.topics" :key="t" :topic="t" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-panel {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(100, 200, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
}

.panel-header {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(100, 200, 255, 0.1);
}

.repo-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #00e5ff;
  }
}

.repo-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 6px 0 0;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-cell {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(100, 200, 255, 0.06);
  border-radius: 10px;
  padding: 14px 12px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #fff;

  &.highlight {
    color: #00e676;
  }
}

.stat-label {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(100, 200, 255, 0.05);

  &:last-of-type {
    border-bottom: none;
  }
}

.meta-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.meta-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.topics-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 200, 255, 0.05);
}

.topics-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
