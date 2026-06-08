<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { StatsOverview, RepoWithTrend } from '@/types'

const stats = ref<StatsOverview>({
  totalRepos: 0,
  todayStars: 0,
  languageCount: 0,
  aiProjectCount: 0,
  topTopic: '',
  topLanguage: '',
})

const topRepos = ref<RepoWithTrend[]>([])
const loading = ref(true)

const statCards = computed(() => [
  { label: 'Total Repos', value: stats.value.totalRepos, icon: '&#9733;', color: '#6366f1' },
  { label: 'Today Stars', value: stats.value.todayStars, icon: '&#11088;', color: '#f59e0b' },
  { label: 'Languages', value: stats.value.languageCount, icon: '&#127760;', color: '#10b981' },
  { label: 'AI Projects', value: stats.value.aiProjectCount, icon: '&#129302;', color: '#8b5cf6' },
  { label: 'Top Language', value: stats.value.topLanguage, icon: '&#128187;', color: '#ec4899', isText: true },
])

onMounted(async () => {
  try {
    // Placeholder data for skeleton rendering
    stats.value = {
      totalRepos: 12847,
      todayStars: 58923,
      languageCount: 42,
      aiProjectCount: 1893,
      topTopic: 'machine-learning',
      topLanguage: 'TypeScript',
    }
    topRepos.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      fullName: `org/repo-${i + 1}`,
      owner: 'org',
      ownerAvatar: '',
      description: 'A trending open-source project on GitHub',
      url: '#',
      stars: 50000 - i * 3000,
      forks: 8000 - i * 500,
      openIssues: 120 - i * 10,
      language: ['TypeScript', 'Rust', 'Python', 'Go', 'Java'][i % 5],
      topics: ['ai', 'open-source'],
      license: 'MIT',
      createdAt: '2023-01-01',
      updatedAt: '2025-06-01',
      pushedAt: '2025-06-01',
      homepage: null,
      defaultBranch: 'main',
      todayStars: 1200 - i * 80,
      todayForks: 60 - i * 4,
      trendScore: 98.5 - i * 2.3,
      rank: i + 1,
      rankChange: i % 3 === 0 ? 2 : i % 3 === 1 ? -1 : 0,
    }))
  } finally {
    loading.value = false
  }
})

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function rankIcon(change: number): string {
  if (change > 0) return '&#9650;'
  if (change < 0) return '&#9660;'
  return '&#9644;'
}

function rankClass(change: number): string {
  if (change > 0) return 'rank-up'
  if (change < 0) return 'rank-down'
  return 'rank-same'
}
</script>

<template>
  <div class="dashboard">
    <section class="hero">
      <h1 class="hero__title">
        <span class="hero__glitch" data-text="GitPulse">GitPulse</span>
      </h1>
      <p class="hero__subtitle">Real-time GitHub trending analytics &mdash; powered by data, driven by stars.</p>
    </section>

    <section class="stats-grid">
      <div
        v-for="(card, i) in statCards"
        :key="i"
        class="stat-card glass"
        :style="{ '--glow': card.color }"
      >
        <div class="stat-card__icon" v-html="card.icon" />
        <div class="stat-card__value">{{ card.isText ? card.value : formatNumber(card.value as number) }}</div>
        <div class="stat-card__label">{{ card.label }}</div>
      </div>
    </section>

    <section class="top-repos glass">
      <h2 class="section-title">Top 10 Trending Repos</h2>
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 5" :key="i" class="skeleton-row" />
      </div>
      <ol v-else class="repo-list">
        <li
          v-for="repo in topRepos"
          :key="repo.id"
          class="repo-row"
        >
          <span class="repo-row__rank">#{{ repo.rank }}</span>
          <div class="repo-row__info">
            <a :href="repo.url" class="repo-row__name">{{ repo.fullName }}</a>
            <p class="repo-row__desc">{{ repo.description }}</p>
          </div>
          <span class="repo-row__lang">{{ repo.language }}</span>
          <span class="repo-row__stars">&#9733; {{ formatNumber(repo.stars) }}</span>
          <span class="repo-row__trend" :class="rankClass(repo.rankChange)" v-html="rankIcon(repo.rankChange) + ' ' + Math.abs(repo.rankChange)" />
        </li>
      </ol>
    </section>

    <section class="charts-row">
      <div class="chart-placeholder glass">
        <h3 class="section-title">Star Trend (7 Days)</h3>
        <div class="chart-area">
          <div class="chart-bar" v-for="h in [40, 65, 55, 80, 70, 90, 75]" :key="h" :style="{ height: h + '%' }" />
        </div>
      </div>
      <div class="chart-placeholder glass">
        <h3 class="section-title">Language Distribution</h3>
        <div class="chart-donut">
          <div class="donut-ring" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
$max-width: 1280px;
$bg: #050816;
$card-bg: #0B1026;
$border: rgba(99, 102, 241, 0.15);
$glow-primary: #6366f1;
$text: #e2e8f0;
$text-muted: #94a3b8;

.dashboard {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Hero */
.hero {
  text-align: center;
  padding: 3rem 0 2rem;

  &__title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    margin: 0;
  }

  &__glitch {
    position: relative;
    display: inline-block;
    color: transparent;
    background: linear-gradient(135deg, $glow-primary, #a78bfa, #ec4899);
    background-clip: text;
    -webkit-background-clip: text;

    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      background: inherit;
      background-clip: text;
      -webkit-background-clip: text;
    }

    &::before {
      animation: glitch-1 3s infinite;
      clip-path: inset(0 0 60% 0);
    }

    &::after {
      animation: glitch-2 3s infinite;
      clip-path: inset(40% 0 0 0);
    }
  }

  &__subtitle {
    color: $text-muted;
    font-size: 1.125rem;
    margin-top: 0.75rem;
  }
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(-2px, 1px); }
  60% { transform: translate(1px, 2px); }
}

/* Glass mixin */
.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.06);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.15);
  }

  &__icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--glow, $glow-primary);
    text-shadow: 0 0 12px var(--glow, $glow-primary);
  }

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

/* Top Repos */
.top-repos {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text;
  margin: 0 0 1rem;
}

.repo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.repo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }

  &__rank {
    font-weight: 800;
    font-size: 1.1rem;
    color: $glow-primary;
    min-width: 2.5rem;
    text-align: center;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    color: $text;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: $glow-primary;
      text-decoration: underline;
    }
  }

  &__desc {
    color: $text-muted;
    font-size: 0.8rem;
    margin: 0.2rem 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__lang {
    font-size: 0.8rem;
    color: $text-muted;
    white-space: nowrap;
  }

  &__stars {
    font-size: 0.85rem;
    color: #f59e0b;
    white-space: nowrap;
  }

  &__trend {
    font-size: 0.8rem;
    white-space: nowrap;
    min-width: 3rem;
    text-align: right;
  }
}

.rank-up { color: #10b981; }
.rank-down { color: #ef4444; }
.rank-same { color: $text-muted; }

/* Skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-row {
  height: 3rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, $border 25%, rgba(99, 102, 241, 0.08) 50%, $border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.chart-placeholder {
  padding: 1.5rem;
  min-height: 280px;
}

.chart-area {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 200px;
  padding-top: 1rem;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, $glow-primary 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 0.375rem 0.375rem 0 0;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
  transition: height 0.5s ease;
}

.chart-donut {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.donut-ring {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 24px solid transparent;
  border-top-color: $glow-primary;
  border-right-color: #a78bfa;
  border-bottom-color: #ec4899;
  border-left-color: #10b981;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .repo-row {
    flex-wrap: wrap;
    gap: 0.5rem;

    &__lang,
    &__stars,
    &__trend {
      font-size: 0.75rem;
    }
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
