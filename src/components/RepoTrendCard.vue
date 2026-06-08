<script setup lang="ts">
import type { RepoWithTrend } from '../types'

defineProps<{
  repo: RepoWithTrend
}>()

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}
</script>

<template>
  <div class="repo-card">
    <div class="rank-badge" v-if="repo.rank <= 3">
      {{ repo.rank === 1 ? '🥇' : repo.rank === 2 ? '🥈' : '🥉' }}
    </div>
    <div class="card-top">
      <img
        class="avatar"
        :src="repo.ownerAvatar"
        :alt="repo.owner"
        loading="lazy"
      />
      <div class="repo-info">
        <a class="repo-name" :href="repo.url" target="_blank" rel="noopener">
          {{ repo.fullName }}
        </a>
        <p class="repo-desc">{{ repo.description }}</p>
      </div>
    </div>
    <div class="card-bottom">
      <span v-if="repo.language" class="lang-tag">
        <span class="lang-dot" :style="{ background: langColor(repo.language) }"></span>
        {{ repo.language }}
      </span>
      <span class="stat">
        <span class="stat-icon">&#9733;</span>
        {{ formatNumber(repo.stars) }}
      </span>
      <span class="stat">
        <span class="stat-icon">&#9741;</span>
        {{ formatNumber(repo.forks) }}
      </span>
      <span class="stat today-stars" v-if="repo.todayStars > 0">
        +{{ formatNumber(repo.todayStars) }} today
      </span>
    </div>
  </div>
</template>

<script lang="ts">
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

function langColor(lang: string): string {
  return LANG_COLORS[lang] || '#888'
}
</script>

<style scoped lang="scss">
.repo-card {
  position: relative;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(100, 200, 255, 0.07);
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(0, 229, 255, 0.25);
    box-shadow:
      0 0 30px rgba(0, 229, 255, 0.07),
      inset 0 0 30px rgba(0, 229, 255, 0.02);
    transform: translateY(-2px);
  }
}

.rank-badge {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 22px;
}

.card-top {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(100, 200, 255, 0.1);
}

.repo-info {
  min-width: 0;
  flex: 1;
}

.repo-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #00e5ff;
  }
}

.repo-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 4px 0 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.lang-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.04);
  padding: 3px 10px;
  border-radius: 20px;
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 13px;
}

.today-stars {
  color: #00e676;
  font-weight: 600;
}
</style>
