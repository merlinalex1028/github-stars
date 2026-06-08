<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { LanguageStat } from '@/types'

const { t } = useI18n()
const router = useRouter()
const loading = ref(true)
const languages = ref<LanguageStat[]>([])

const COLORS = [
  '#4f6df5', '#db2777', '#059669', '#d97706', '#7c3aed',
  '#0891b2', '#dc2626', '#65a30d', '#ea580c', '#0d9488',
  '#8b5cf6', '#c026d3', '#ca8a04', '#0284c7', '#e11d48',
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

const totalStars = computed(() => languages.value.reduce((sum, l) => sum + l.totalStars, 0))

const pieSegments = computed(() => {
  const sorted = [...languages.value].sort((a, b) => b.totalStars - a.totalStars)
  const top = sorted.slice(0, 8)
  const otherStars = sorted.slice(8).reduce((sum, l) => sum + l.totalStars, 0)
  const all = otherStars > 0 ? [...top, { language: 'Other', totalStars: otherStars, repoCount: 0, todayStars: 0, trendChange: 0 }] : top

  let cumulative = 0
  return all.map((l, i) => {
    const pct = totalStars.value > 0 ? (l.totalStars / totalStars.value) * 100 : 0
    const segment = {
      language: l.language,
      pct,
      startAngle: cumulative,
      endAngle: cumulative + pct,
      color: COLORS[i % COLORS.length],
    }
    cumulative += pct
    return segment
  })
})

function piePath(startAngle: number, endAngle: number, outerR: number, innerR: number): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const x1 = 100 + outerR * Math.cos(toRad(startAngle))
  const y1 = 100 + outerR * Math.sin(toRad(startAngle))
  const x2 = 100 + outerR * Math.cos(toRad(endAngle))
  const y2 = 100 + outerR * Math.sin(toRad(endAngle))
  const x3 = 100 + innerR * Math.cos(toRad(endAngle))
  const y3 = 100 + innerR * Math.sin(toRad(endAngle))
  const x4 = 100 + innerR * Math.cos(toRad(startAngle))
  const y4 = 100 + innerR * Math.sin(toRad(startAngle))
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M${x1},${y1} A${outerR},${outerR} 0 ${largeArc},1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${largeArc},0 ${x4},${y4} Z`
}

function navigateToLanguage(lang: string) {
  router.push({ path: '/trending', query: { language: lang } })
}

onMounted(async () => {
  try {
    languages.value = [
      { language: 'TypeScript', repoCount: 3200, totalStars: 2800000, todayStars: 12500, trendChange: 3.2 },
      { language: 'Python', repoCount: 2800, totalStars: 2400000, todayStars: 11200, trendChange: 2.8 },
      { language: 'Rust', repoCount: 890, totalStars: 980000, todayStars: 8900, trendChange: 12.5 },
      { language: 'Go', repoCount: 1100, totalStars: 1200000, todayStars: 5400, trendChange: 1.1 },
      { language: 'JavaScript', repoCount: 2600, totalStars: 2100000, todayStars: 8200, trendChange: -0.5 },
      { language: 'Java', repoCount: 980, totalStars: 850000, todayStars: 3200, trendChange: -1.2 },
      { language: 'C++', repoCount: 650, totalStars: 720000, todayStars: 2800, trendChange: 0.8 },
      { language: 'Swift', repoCount: 420, totalStars: 380000, todayStars: 1500, trendChange: 5.3 },
      { language: 'Kotlin', repoCount: 380, totalStars: 310000, todayStars: 1200, trendChange: 4.1 },
      { language: 'C#', repoCount: 520, totalStars: 450000, todayStars: 1800, trendChange: -0.3 },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="languages">
    <h1 class="page-title">{{ t('languages.pageTitle') }}</h1>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card" />
    </div>

    <template v-else>
      <!-- Pie Chart -->
      <div class="pie-section glass">
        <h2 class="section-title">{{ t('languages.sectionTitle') }}</h2>
        <div class="pie-layout">
          <svg viewBox="0 0 200 200" class="pie-svg">
            <path
              v-for="seg in pieSegments"
              :key="seg.language"
              :d="piePath(seg.startAngle, seg.endAngle, 90, 50)"
              :fill="seg.color"
              class="pie-slice"
              @click="navigateToLanguage(seg.language)"
            >
              <title>{{ seg.language }}: {{ seg.pct.toFixed(1) }}%</title>
            </path>
            <text x="100" y="96" text-anchor="middle" fill="#1e293b" font-size="10" font-weight="800">
              {{ formatNumber(totalStars) }}
            </text>
            <text x="100" y="110" text-anchor="middle" fill="#64748b" font-size="6">{{ t('languages.totalStars') }}</text>
          </svg>

          <div class="pie-legend">
            <div
              v-for="seg in pieSegments"
              :key="seg.language"
              class="legend-item"
              @click="navigateToLanguage(seg.language)"
            >
              <span class="legend-dot" :style="{ background: seg.color }" />
              <span class="legend-label">{{ seg.language }}</span>
              <span class="legend-pct">{{ seg.pct.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Cards -->
      <div class="lang-grid">
        <article
          v-for="(lang, i) in languages"
          :key="lang.language"
          class="lang-card glass"
          :style="{ '--accent': COLORS[i % COLORS.length] }"
          @click="navigateToLanguage(lang.language)"
        >
          <div class="lang-card__header">
            <div class="lang-card__dot" />
            <h3 class="lang-card__name">{{ lang.language }}</h3>
          </div>
          <div class="lang-card__stats">
            <div class="lang-card__stat">
              <span class="lang-card__stat-value">{{ formatNumber(lang.totalStars) }}</span>
              <span class="lang-card__stat-label">{{ t('languages.stars') }}</span>
            </div>
            <div class="lang-card__stat">
              <span class="lang-card__stat-value">{{ formatNumber(lang.repoCount) }}</span>
              <span class="lang-card__stat-label">{{ t('languages.repos') }}</span>
            </div>
            <div class="lang-card__stat">
              <span class="lang-card__stat-value">+{{ formatNumber(lang.todayStars) }}</span>
              <span class="lang-card__stat-label">{{ t('languages.today') }}</span>
            </div>
          </div>
          <div class="lang-card__trend" :class="trendClass(lang.trendChange)">
            {{ trendLabel(lang.trendChange) }} {{ t('languages.thisWeek') }}
          </div>
        </article>
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

.languages {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, $glow, #059669);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
              0 1px 2px rgba(0, 0, 0, 0.06),
              0 0 1px rgba(99, 102, 241, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text;
  margin: 0 0 1.25rem;
}

/* Pie Section */
.pie-section {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.pie-layout {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pie-svg {
  width: 240px;
  height: 240px;
  flex-shrink: 0;
}

.pie-slice {
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: center;

  &:hover {
    opacity: 0.85;
    filter: brightness(1.1);
  }
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(99, 102, 241, 0.06);
  }
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  color: $text;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 100px;
}

.legend-pct {
  color: $text-muted;
  font-size: 0.82rem;
}

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  height: 160px;
  border-radius: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Language Grid */
.lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.lang-card {
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(79, 109, 245, 0.1);
    border-color: var(--accent, $glow);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 1rem;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent, $glow);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);
  }

  &__name {
    font-size: 1.1rem;
    font-weight: 700;
    color: $text;
    margin: 0;
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
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--accent, $glow);
  }

  &__stat-label {
    font-size: 0.7rem;
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

.trend-up { color: #059669; }
.trend-down { color: #dc2626; }
.trend-same { color: $text-muted; }

@media (max-width: 640px) {
  .pie-layout {
    flex-direction: column;
  }

  .lang-grid {
    grid-template-columns: 1fr;
  }
}
</style>
