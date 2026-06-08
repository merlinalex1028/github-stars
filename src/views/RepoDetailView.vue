<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { GithubRepo, RepoTrendSnapshot } from '@/types'

const { t } = useI18n()
const route = useRoute()
const loading = ref(true)
const repo = ref<GithubRepo | null>(null)
const snapshots = ref<RepoTrendSnapshot[]>([])

const breadcrumbs = computed(() => [
  { label: t('repoDetail.dashboard'), to: '/' },
  { label: t('repoDetail.trending'), to: '/trending' },
])

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
      <span class="breadcrumb__current">{{ repo?.fullName || t('repoDetail.loading') }}</span>
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
          <span class="meta-badge">&#128197; {{ t('repoDetail.created', { date: repo.createdAt }) }}</span>
          <span v-if="repo.homepage" class="meta-badge">
            <a :href="repo.homepage" target="_blank" rel="noopener">&#127760; {{ t('repoDetail.website') }}</a>
          </span>
        </div>
      </header>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-block glass" style="--glow: #d97706;">
          <div class="stat-block__value">{{ formatNumber(repo.stars) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.stars') }}</div>
        </div>
        <div class="stat-block glass" style="--glow: #4f6df5;">
          <div class="stat-block__value">{{ formatNumber(repo.forks) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.forks') }}</div>
        </div>
        <div class="stat-block glass" style="--glow: #dc2626;">
          <div class="stat-block__value">{{ formatNumber(repo.openIssues) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.openIssues') }}</div>
        </div>
        <div class="stat-block glass" style="--glow: #059669;">
          <div class="stat-block__value">{{ latestSnapshot()?.todayStars ?? 0 }}</div>
          <div class="stat-block__label">{{ t('repoDetail.todayStars') }}</div>
        </div>
        <div class="stat-block glass" style="--glow: #7c3aed;">
          <div class="stat-block__value">{{ latestSnapshot()?.trendScore.toFixed(1) ?? '0' }}</div>
          <div class="stat-block__label">{{ t('repoDetail.trendScore') }}</div>
        </div>
      </div>

      <!-- Topics -->
      <div class="topics-row glass">
        <span class="topics-row__label">{{ t('repoDetail.topics') }}</span>
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
          <h3 class="chart-panel__title">{{ t('repoDetail.dailyStarGains') }} {{ t('repoDetail.daysPeriod') }}</h3>
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
          <h3 class="chart-panel__title">{{ t('repoDetail.dailyForkGains') }} {{ t('repoDetail.daysPeriod') }}</h3>
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
        <h3 class="chart-panel__title">{{ t('repoDetail.trendScoreOverTime') }}</h3>
        <div class="line-chart">
          <svg viewBox="0 0 600 150" preserveAspectRatio="none" class="line-chart__svg">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4f6df5" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#4f6df5" stop-opacity="0" />
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
              stroke="#4f6df5"
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
$bg: #f8faff;
$card-bg: #ffffff;
$border: rgba(99, 102, 241, 0.12);
$glow: #4f6df5;
$text: #1e293b;
$text-muted: #64748b;

.repo-detail {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
              0 1px 2px rgba(0, 0, 0, 0.06),
              0 0 1px rgba(99, 102, 241, 0.06);
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
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
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
  background: linear-gradient(135deg, $glow, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 2px 8px rgba(79, 109, 245, 0.2);
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
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.15);
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(124, 58, 237, 0.15);
    box-shadow: 0 1px 4px rgba(124, 58, 237, 0.1);
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
      background: linear-gradient(180deg, #d97706, rgba(217, 119, 6, 0.15));
      box-shadow: 0 1px 4px rgba(217, 119, 6, 0.2);
    }

    &--fork {
      background: linear-gradient(180deg, $glow, rgba(79, 109, 245, 0.15));
      box-shadow: 0 1px 4px rgba(79, 109, 245, 0.2);
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
