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
      <span class="breadcrumb__sep">&#8594;</span>
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
      <header class="repo-header">
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
        <div class="stat-block stat-block--yellow">
          <div class="stat-block__value">{{ formatNumber(repo.stars) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.stars') }}</div>
        </div>
        <div class="stat-block stat-block--blue">
          <div class="stat-block__value">{{ formatNumber(repo.forks) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.forks') }}</div>
        </div>
        <div class="stat-block stat-block--pink">
          <div class="stat-block__value">{{ formatNumber(repo.openIssues) }}</div>
          <div class="stat-block__label">{{ t('repoDetail.openIssues') }}</div>
        </div>
        <div class="stat-block stat-block--green">
          <div class="stat-block__value">{{ latestSnapshot()?.todayStars ?? 0 }}</div>
          <div class="stat-block__label">{{ t('repoDetail.todayStars') }}</div>
        </div>
        <div class="stat-block stat-block--white">
          <div class="stat-block__value">{{ latestSnapshot()?.trendScore.toFixed(1) ?? '0' }}</div>
          <div class="stat-block__label">{{ t('repoDetail.trendScore') }}</div>
        </div>
      </div>

      <!-- Topics -->
      <div class="topics-row">
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
        <div class="chart-panel">
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

        <div class="chart-panel">
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
      <div class="chart-panel">
        <h3 class="chart-panel__title">{{ t('repoDetail.trendScoreOverTime') }}</h3>
        <div class="line-chart">
          <svg viewBox="0 0 600 150" preserveAspectRatio="none" class="line-chart__svg">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
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
              stroke="#f59e0b"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
$max-width: 1280px;
$text: #1f2937;
$text-body: #374151;
$text-muted: #6b7280;
$border: #d1d5db;
$shadow: 3px 3px 0 rgba(0, 0, 0, 0.06);
$shadow-hover: 5px 5px 0 rgba(0, 0, 0, 0.08);

.repo-detail {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-family: 'Patrick Hand', cursive;

  &__link {
    color: $text-muted;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $text;
      text-decoration: underline;
      text-decoration-style: dashed;
    }
  }

  &__sep {
    color: $text-muted;
    font-size: 1rem;
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
  border-radius: 3px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border: 1.5px solid $border;
  box-shadow: $shadow;

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
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
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
    font-weight: 700;
    font-family: 'Caveat', cursive;
    margin: 0;

    a {
      color: $text;
      text-decoration: none;

      &:hover {
        color: $text;
        text-decoration: underline;
        text-decoration-style: dashed;
      }
    }
  }

  &__desc {
    color: $text-muted;
    font-size: 0.95rem;
    font-family: 'Patrick Hand', cursive;
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
  background: #fef9c3;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Caveat', cursive;
  color: #92400e;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.06);
}

.meta-badge {
  font-size: 0.8rem;
  color: $text-muted;
  font-family: 'Patrick Hand', cursive;
  padding: 0.3rem 0.75rem;
  border-radius: 2px;
  border: 1px dashed $border;

  a {
    color: $text-muted;
    text-decoration: none;

    &:hover {
      color: $text;
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
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-hover;
  }

  &--yellow { background: #fef9c3; }
  &--blue { background: #dbeafe; }
  &--pink { background: #fce7f3; }
  &--green { background: #dcfce7; }
  &--white { background: #ffffff; }

  &__value {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    color: $text;
  }

  &__label {
    color: $text-muted;
    font-size: 0.8rem;
    font-family: 'Patrick Hand', cursive;
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
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    font-family: 'Patrick Hand', cursive;
    font-weight: 600;
  }
}

.topic-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  font-size: 0.78rem;
  font-family: 'Patrick Hand', cursive;
  background: #fef9c3;
  color: #92400e;
  border: 1px dashed #d1d5db;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #fde68a;
    border-style: solid;
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
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  padding: 1.5rem;
  margin-bottom: 1rem;

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
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
      background: #f59e0b;
      opacity: 0.7;
    }

    &--fork {
      background: #7dd3fc;
      opacity: 0.7;
    }
  }

  &__label {
    font-size: 0.55rem;
    color: $text-muted;
    font-family: 'Patrick Hand', cursive;
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
