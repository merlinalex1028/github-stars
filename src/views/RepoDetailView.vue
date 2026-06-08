<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { GithubRepo, RepoTrendSnapshot } from '@/types'

const route = useRoute()
const loading = ref(true)
const repo = ref<GithubRepo | null>(null)
const snapshots = ref<RepoTrendSnapshot[]>([])

const breadcrumbs = [
  { label: 'Dashboard', to: '/' },
  { label: 'Trending', to: '/trending' },
]

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

onMounted(async () => {
  try {
    // Placeholder data
    repo.value = {
      id: 1,
      fullName: 'vercel/next.js',
      owner: 'vercel',
      ownerAvatar: '',
      description: 'The React Framework for the Web. Used by some of the world\'s largest companies, Next.js enables you to create high-quality web applications with the power of React components.',
      url: 'https://github.com/vercel/next.js',
      stars: 128500,
      forks: 27400,
      openIssues: 2840,
      language: 'TypeScript',
      topics: ['nextjs', 'react', 'framework', 'javascript', 'typescript', 'ssr', 'vercel'],
      license: 'MIT',
      createdAt: '2016-10-05',
      updatedAt: '2025-06-08',
      pushedAt: '2025-06-08',
      homepage: 'https://nextjs.org',
      defaultBranch: 'canary',
    }

    snapshots.value = Array.from({ length: 30 }, (_, i) => ({
      repoId: 1,
      date: `2025-05-${String(10 + i).padStart(2, '0')}`,
      stars: 128500 - (30 - i) * 150,
      forks: 27400 - (30 - i) * 20,
      openIssues: 2840,
      todayStars: 180 + Math.round(Math.sin(i) * 40),
      todayForks: 12 + Math.round(Math.sin(i) * 5),
      trendScore: 92 + Math.round(Math.sin(i * 0.5) * 4),
      rank: 1,
      rankChange: 0,
    }))
  } finally {
    loading.value = false
  }
})

const latestSnapshot = () => snapshots.value[snapshots.value.length - 1]

const starChartData = () => {
  return snapshots.value.map(s => ({ date: s.date.slice(5), stars: s.todayStars }))
}

const forkChartData = () => {
  return snapshots.value.map(s => ({ date: s.date.slice(5), forks: s.todayForks }))
}

const maxStarHeight = () => {
  const max = Math.max(...snapshots.value.map(s => s.todayStars))
  return max || 1
}
</script>

<template>
  <div class="repo-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link
        v-for="crumb in breadcrumbs"
        :key="crumb.to"
        :to="crumb.to"
        class="breadcrumb__link"
      >
        {{ crumb.label }}
      </router-link>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">{{ repo?.fullName || 'Loading...' }}</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-detail">
      <div class="skeleton-block skeleton-block--header" />
      <div class="skeleton-block skeleton-block--stats" />
      <div class="skeleton-block skeleton-block--chart" />
    </div>

    <template v-else-if="repo">
      <!-- Repo Header -->
      <header class="repo-header glass">
        <div class="repo-header__top">
          <div class="repo-header__avatar">
            <div class="avatar-placeholder">{{ repo.owner.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="repo-header__info">
            <h1 class="repo-header__name">
              <a :href="repo.url" target="_blank" rel="noopener">{{ repo.fullName }}</a>
            </h1>
            <p class="repo-header__desc">{{ repo.description }}</p>
          </div>
        </div>

        <div class="repo-header__meta">
          <span v-if="repo.license" class="meta-badge">&#128220; {{ repo.license }}</span>
          <span class="meta-badge">&#128197; Created {{ repo.createdAt }}</span>
          <span v-if="repo.homepage" class="meta-badge">
            <a :href="repo.homepage" target="_blank" rel="noopener">&#127760; Website</a>
          </span>
        </div>
      </header>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-block glass" style="--glow: #f59e0b;">
          <div class="stat-block__value">{{ formatNumber(repo.stars) }}</div>
          <div class="stat-block__label">Stars</div>
        </div>
        <div class="stat-block glass" style="--glow: #6366f1;">
          <div class="stat-block__value">{{ formatNumber(repo.forks) }}</div>
          <div class="stat-block__label">Forks</div>
        </div>
        <div class="stat-block glass" style="--glow: #ef4444;">
          <div class="stat-block__value">{{ formatNumber(repo.openIssues) }}</div>
          <div class="stat-block__label">Open Issues</div>
        </div>
        <div class="stat-block glass" style="--glow: #10b981;">
          <div class="stat-block__value">{{ latestSnapshot()?.todayStars ?? 0 }}</div>
          <div class="stat-block__label">Today Stars</div>
        </div>
        <div class="stat-block glass" style="--glow: #8b5cf6;">
          <div class="stat-block__value">{{ latestSnapshot()?.trendScore.toFixed(1) ?? '0' }}</div>
          <div class="stat-block__label">Trend Score</div>
        </div>
      </div>

      <!-- Topics -->
      <div class="topics-row glass">
        <span class="topics-row__label">Topics:</span>
        <router-link
          v-for="topic in repo.topics"
          :key="topic"
          :to="{ path: '/trending', query: { topic } }"
          class="topic-tag"
        >
          {{ topic }}
        </router-link>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-panel glass">
          <h3 class="chart-panel__title">Daily Star Gains (30 Days)</h3>
          <div class="bar-chart">
            <div
              v-for="snap in snapshots"
              :key="snap.date"
              class="bar-chart__col"
              :title="`${snap.date}: +${snap.todayStars} stars`"
            >
              <div
                class="bar-chart__bar bar-chart__bar--star"
                :style="{ height: (snap.todayStars / maxStarHeight() * 100) + '%' }"
              />
              <span class="bar-chart__label">{{ snap.date.slice(8) }}</span>
            </div>
          </div>
        </div>

        <div class="chart-panel glass">
          <h3 class="chart-panel__title">Daily Fork Gains (30 Days)</h3>
          <div class="bar-chart">
            <div
              v-for="snap in snapshots"
              :key="snap.date"
              class="bar-chart__col"
              :title="`${snap.date}: +${snap.todayForks} forks`"
            >
              <div
                class="bar-chart__bar bar-chart__bar--fork"
                :style="{ height: (snap.todayForks / (Math.max(...snapshots.map(s => s.todayForks)) || 1) * 100) + '%' }"
              />
              <span class="bar-chart__label">{{ snap.date.slice(8) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Score Line -->
      <div class="chart-panel glass">
        <h3 class="chart-panel__title">Trend Score Over Time</h3>
        <div class="line-chart">
          <svg viewBox="0 0 600 150" preserveAspectRatio="none" class="line-chart__svg">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              :d="(() => {
                const max = Math.max(...snapshots.map(s => s.trendScore))
                const min = Math.min(...snapshots.map(s => s.trendScore))
                const range = max - min || 1
                const points = snapshots.map((s, i) => {
                  const x = (i / (snapshots.length - 1)) * 600
                  const y = 140 - ((s.trendScore - min) / range) * 130
                  return `${x},${y}`
                })
                const line = 'M' + points.join(' L')
                const area = line + ` L600,150 L0,150 Z`
                return area
              })()"
              fill="url(#scoreGrad)"
            />
            <path
              :d="(() => {
                const max = Math.max(...snapshots.map(s => s.trendScore))
                const min = Math.min(...snapshots.map(s => s.trendScore))
                const range = max - min || 1
                const points = snapshots.map((s, i) => {
                  const x = (i / (snapshots.length - 1)) * 600
                  const y = 140 - ((s.trendScore - min) / range) * 130
                  return `${x},${y}`
                })
                return 'M' + points.join(' L')
              })()"
              fill="none"
              stroke="#6366f1"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
$max-width: 1280px;
$bg: #050816;
$card-bg: #0B1026;
$border: rgba(99, 102, 241, 0.15);
$glow: #6366f1;
$text: #e2e8f0;
$text-muted: #94a3b8;

.repo-detail {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.06);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  &__link {
    color: $text-muted;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $glow;
    }
  }

  &__sep {
    color: $text-muted;
    opacity: 0.5;
  }

  &__current {
    color: $text;
    font-weight: 600;
  }
}

/* Skeleton */
.skeleton-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-block {
  border-radius: 1rem;
  background: linear-gradient(90deg, $border 25%, rgba(99, 102, 241, 0.08) 50%, $border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &--header { height: 160px; }
  &--stats { height: 100px; }
  &--chart { height: 300px; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Repo Header */
.repo-header {
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  &__top {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0;

    a {
      color: $text;
      text-decoration: none;

      &:hover {
        color: $glow;
      }
    }
  }

  &__desc {
    color: $text-muted;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0.5rem 0 0;
  }

  &__meta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, $glow, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.3);
}

.meta-badge {
  font-size: 0.8rem;
  color: $text-muted;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid $border;

  a {
    color: $text-muted;
    text-decoration: none;

    &:hover {
      color: $glow;
    }
  }
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-block {
  text-align: center;
  padding: 1.25rem 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }

  &__value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--glow, $glow);
    text-shadow: 0 0 10px var(--glow, $glow);
  }

  &__label {
    color: $text-muted;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }
}

/* Topics */
.topics-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.topic-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.2);
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(139, 92, 246, 0.25);
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
  }
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.chart-panel {
  padding: 1.5rem;
  margin-bottom: 1rem;

  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: $text;
    margin: 0 0 1rem;
  }
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 200px;

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    position: relative;
  }

  &__bar {
    width: 100%;
    border-radius: 2px 2px 0 0;
    transition: height 0.5s ease;
    min-height: 2px;

    &--star {
      background: linear-gradient(180deg, #f59e0b, rgba(245, 158, 11, 0.2));
      box-shadow: 0 0 6px rgba(245, 158, 11, 0.3);
    }

    &--fork {
      background: linear-gradient(180deg, $glow, rgba(99, 102, 241, 0.2));
      box-shadow: 0 0 6px rgba(99, 102, 241, 0.3);
    }
  }

  &__label {
    font-size: 0.55rem;
    color: $text-muted;
    margin-top: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
  }
}

.line-chart {
  height: 180px;

  &__svg {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 640px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .repo-header__top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
