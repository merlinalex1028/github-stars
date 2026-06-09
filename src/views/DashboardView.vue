<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { StatsOverview, RepoWithTrend } from '@/types'
import { getStatsOverview, getTrending } from '@/services/api'

const { t } = useI18n()

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
  { label: t('dashboard.totalRepos'), value: stats.value.totalRepos, icon: '&#9733;', color: '#f59e0b' },
  { label: t('dashboard.todayStars'), value: stats.value.todayStars, icon: '&#11088;', color: '#f59e0b' },
  { label: t('dashboard.languages'), value: stats.value.languageCount, icon: '&#127760;', color: '#10b981' },
  { label: t('dashboard.aiProjects'), value: stats.value.aiProjectCount, icon: '&#129302;', color: '#3b82f6' },
  { label: t('dashboard.topLanguage'), value: stats.value.topLanguage, icon: '&#128187;', color: '#ec4899', isText: true },
])

const stickyColors = ['#fef9c3', '#fce7f3', '#dbeafe', '#dcfce7', '#ffffff']

onMounted(async () => {
  loading.value = true
  try {
    const [overview, trending] = await Promise.all([
      getStatsOverview(),
      getTrending({ page: 1, pageSize: 10, sortBy: 'trend_score' }),
    ])

    stats.value = overview
    topRepos.value = trending.data
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
      <p class="hero__subtitle">{{ t('dashboard.heroSubtitle') }}</p>
    </section>

    <section class="stats-grid">
      <div
        v-for="(card, i) in statCards"
        :key="i"
        class="stat-card"
        :style="{ '--glow': card.color, '--sticky-bg': stickyColors[i % stickyColors.length] }"
      >
        <div class="stat-card__icon" v-html="card.icon" />
        <div class="stat-card__value">{{ card.isText ? card.value : formatNumber(card.value as number) }}</div>
        <div class="stat-card__label">{{ card.label }}</div>
      </div>
    </section>

    <section class="top-repos">
      <h2 class="section-title">{{ t('dashboard.topReposTitle') }}</h2>
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
      <div class="chart-placeholder">
        <h3 class="section-title">{{ t('dashboard.starTrend') }}</h3>
        <div class="chart-area">
          <div class="chart-bar" v-for="(h, i) in [40, 65, 55, 80, 70, 90, 75]" :key="i" :style="{ height: h + '%' }" />
        </div>
      </div>
      <div class="chart-placeholder">
        <h3 class="section-title">{{ t('dashboard.languageDistribution') }}</h3>
        <div class="chart-donut">
          <div class="donut-ring" />
        </div>
      </div>
    </section>
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
    font-weight: 700;
    font-family: 'Caveat', cursive;
    letter-spacing: -0.01em;
    margin: 0;
    color: $text;
  }

  &__glitch {
    display: inline-block;
    color: $text;
    background: none;
    background-clip: initial;
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;

    &::before,
    &::after {
      display: none;
    }
  }

  &__subtitle {
    color: $text-muted;
    font-family: 'Patrick Hand', cursive;
    font-size: 1.125rem;
    margin-top: 0.75rem;
  }
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  background: var(--sticky-bg, #ffffff);
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  transform: rotate(-0.5deg);

  &:nth-child(2n) {
    transform: rotate(0.5deg);
  }

  &:nth-child(3n) {
    transform: rotate(-1deg);
  }

  &:hover {
    transform: translateY(-3px) rotate(0deg);
    box-shadow: $shadow-hover;
  }

  &__icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    color: var(--glow, #1f2937);
  }

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    font-family: 'Patrick Hand', cursive;
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

/* Top Repos */
.top-repos {
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Caveat', cursive;
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
  border-bottom: 1px dashed $border;

  &:last-child {
    border-bottom: none;
  }

  &__rank {
    font-weight: 700;
    font-size: 1.1rem;
    font-family: 'Caveat', cursive;
    color: #1f2937;
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
    font-family: 'Patrick Hand', cursive;
    text-decoration: none;

    &:hover {
      color: #1f2937;
      text-decoration: underline;
      text-decoration-style: dashed;
    }
  }

  &__desc {
    color: $text-muted;
    font-size: 0.8rem;
    font-family: 'Patrick Hand', cursive;
    margin: 0.2rem 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__lang {
    font-size: 0.8rem;
    color: $text-muted;
    font-family: 'Patrick Hand', cursive;
    white-space: nowrap;
    padding: 0.15rem 0.5rem;
    border: 1px dashed $border;
    border-radius: 2px;
  }

  &__stars {
    font-size: 0.85rem;
    color: #b45309;
    font-family: 'Patrick Hand', cursive;
    white-space: nowrap;
  }

  &__trend {
    font-size: 0.8rem;
    white-space: nowrap;
    min-width: 3rem;
    text-align: right;
    font-family: 'Patrick Hand', cursive;
  }
}

.rank-up { color: #059669; }
.rank-down { color: #dc2626; }
.rank-same { color: $text-muted; }

/* Skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-row {
  height: 3rem;
  border-radius: 3px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
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
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
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
  border-radius: 2px 2px 0 0;
  transition: height 0.5s ease;

  &:nth-child(7n+1) { background: #f59e0b; }
  &:nth-child(7n+2) { background: #84a98c; }
  &:nth-child(7n+3) { background: #7dd3fc; }
  &:nth-child(7n+4) { background: #fda4af; }
  &:nth-child(7n+5) { background: #f59e0b; }
  &:nth-child(7n+6) { background: #84a98c; }
  &:nth-child(7n+7) { background: #7dd3fc; }
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
  border-top-color: #f59e0b;
  border-right-color: #84a98c;
  border-bottom-color: #7dd3fc;
  border-left-color: #fda4af;
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
