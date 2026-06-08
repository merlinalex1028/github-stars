<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { TopicStat } from '@/types'

const router = useRouter()
const loading = ref(true)
const topics = ref<TopicStat[]>([])

const COLORS = [
  '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ef4444', '#84cc16', '#f97316', '#14b8a6',
  '#a78bfa', '#e879f9', '#facc15', '#38bdf8', '#fb7185',
  '#34d399', '#fbbf24', '#c084fc', '#22d3ee', '#a3e635',
]

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function trendLabel(change: number): string {
  if (change > 0) return `+${change}%`
  if (change < 0) return `${change}%`
  return '0%'
}

function trendClass(change: number): string {
  if (change > 0) return 'trend-up'
  if (change < 0) return 'trend-down'
  return 'trend-same'
}

const maxStars = computed(() => Math.max(...topics.value.map(t => t.totalStars), 1))

// Heatmap: generate intensity from todayStars
function heatIntensity(todayStars: number): number {
  const maxToday = Math.max(...topics.value.map(t => t.todayStars), 1)
  return todayStars / maxToday
}

function heatColor(intensity: number): string {
  const r = Math.round(99 + (236 - 99) * intensity)
  const g = Math.round(102 - 102 * intensity)
  const b = Math.round(241 - 91 * intensity)
  const a = 0.15 + intensity * 0.55
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function navigateToTopic(topic: string) {
  router.push({ path: '/trending', query: { topic } })
}

onMounted(async () => {
  try {
    topics.value = [
      { topic: 'machine-learning', repoCount: 1850, totalStars: 1900000, todayStars: 8500, trendChange: 6.2 },
      { topic: 'llm', repoCount: 920, totalStars: 1200000, todayStars: 12000, trendChange: 18.5 },
      { topic: 'web-framework', repoCount: 780, totalStars: 980000, todayStars: 4200, trendChange: 2.1 },
      { topic: 'cli', repoCount: 650, totalStars: 520000, todayStars: 3100, trendChange: 4.8 },
      { topic: 'database', repoCount: 540, totalStars: 680000, todayStars: 2800, trendChange: 1.5 },
      { topic: 'devtools', repoCount: 890, totalStars: 750000, todayStars: 5600, trendChange: 8.3 },
      { topic: 'ai', repoCount: 1200, totalStars: 1500000, todayStars: 9800, trendChange: 10.1 },
      { topic: 'rust', repoCount: 480, totalStars: 620000, todayStars: 4500, trendChange: 15.2 },
      { topic: 'typescript', repoCount: 1100, totalStars: 890000, todayStars: 3800, trendChange: 1.9 },
      { topic: 'react', repoCount: 950, totalStars: 1100000, todayStars: 3200, trendChange: -0.8 },
      { topic: 'api', repoCount: 620, totalStars: 450000, todayStars: 2100, trendChange: 3.4 },
      { topic: 'security', repoCount: 380, totalStars: 320000, todayStars: 1800, trendChange: 7.6 },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="topics">
    <h1 class="page-title">Topic Analytics</h1>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card" />
    </div>

    <template v-else>
      <!-- Heatmap -->
      <div class="heatmap-section glass">
        <h2 class="section-title">Activity Heatmap (Today's Stars)</h2>
        <div class="heatmap-grid">
          <div
            v-for="topic in topics"
            :key="topic.topic"
            class="heatmap-cell"
            :style="{
              background: heatColor(heatIntensity(topic.todayStars)),
              '--size': (0.6 + heatIntensity(topic.todayStars) * 0.4),
            }"
            :title="`${topic.topic}: +${formatNumber(topic.todayStars)} today`"
            @click="navigateToTopic(topic.topic)"
          >
            <span class="heatmap-cell__label">{{ topic.topic }}</span>
            <span class="heatmap-cell__value">+{{ formatNumber(topic.todayStars) }}</span>
          </div>
        </div>
        <div class="heatmap-legend">
          <span class="heatmap-legend__label">Low</span>
          <div class="heatmap-legend__bar" />
          <span class="heatmap-legend__label">High</span>
        </div>
      </div>

      <!-- Topic Cards Grid -->
      <div class="topic-grid">
        <article
          v-for="(topic, i) in topics"
          :key="topic.topic"
          class="topic-card glass"
          :style="{ '--accent': COLORS[i % COLORS.length] }"
          @click="navigateToTopic(topic.topic)"
        >
          <div class="topic-card__header">
            <div class="topic-card__dot" />
            <h3 class="topic-card__name">{{ topic.topic }}</h3>
          </div>

          <div class="topic-card__bar-wrap">
            <div
              class="topic-card__bar"
              :style="{ width: (topic.totalStars / maxStars * 100) + '%' }"
            />
          </div>

          <div class="topic-card__stats">
            <div class="topic-card__stat">
              <span class="topic-card__stat-value">{{ formatNumber(topic.totalStars) }}</span>
              <span class="topic-card__stat-label">Stars</span>
            </div>
            <div class="topic-card__stat">
              <span class="topic-card__stat-value">{{ formatNumber(topic.repoCount) }}</span>
              <span class="topic-card__stat-label">Repos</span>
            </div>
            <div class="topic-card__stat">
              <span class="topic-card__stat-value">+{{ formatNumber(topic.todayStars) }}</span>
              <span class="topic-card__stat-label">Today</span>
            </div>
          </div>

          <div class="topic-card__trend" :class="trendClass(topic.trendChange)">
            {{ trendLabel(topic.trendChange) }} this week
          </div>
        </article>
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

.topics {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text;
  margin: 0 0 1.25rem;
}

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  height: 180px;
  border-radius: 1rem;
  background: linear-gradient(90deg, $border 25%, rgba(99, 102, 241, 0.08) 50%, $border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Heatmap */
.heatmap-section {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.625rem;
}

.heatmap-cell {
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 0 16px rgba(99, 102, 241, 0.12);
  }

  &__label {
    display: block;
    color: $text;
    font-size: 0.78rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    display: block;
    color: $text-muted;
    font-size: 0.7rem;
  }
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &__label {
    font-size: 0.75rem;
    color: $text-muted;
  }

  &__bar {
    width: 120px;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.7));
  }
}

/* Topic Grid */
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.topic-card {
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.12);
    border-color: var(--accent, $glow);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent, $glow);
    box-shadow: 0 0 8px var(--accent, $glow);
  }

  &__name {
    font-size: 1rem;
    font-weight: 700;
    color: $text;
    margin: 0;
  }

  &__bar-wrap {
    height: 4px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 2px;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent, $glow), rgba(167, 139, 250, 0.6));
    transition: width 0.5s ease;
  }

  &__stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
  }

  &__stat-value {
    font-size: 1rem;
    font-weight: 800;
    color: var(--accent, $glow);
  }

  &__stat-label {
    font-size: 0.68rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__trend {
    font-size: 0.82rem;
    font-weight: 600;
    padding-top: 0.5rem;
    border-top: 1px solid $border;
  }
}

.trend-up { color: #10b981; }
.trend-down { color: #ef4444; }
.trend-same { color: $text-muted; }

@media (max-width: 640px) {
  .heatmap-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .topic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
