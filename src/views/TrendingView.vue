<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RepoWithTrend, TimeRange, SortBy, PaginatedResponse } from '@/types'

const { t } = useI18n()

const timeRange = ref<TimeRange>('today')
const selectedLanguage = ref('')
const selectedTopic = ref('')
const searchQuery = ref('')
const sortBy = ref<SortBy>('trend_score')
const currentPage = ref(1)
const pageSize = 20
const loading = ref(true)
const repos = ref<RepoWithTrend[]>([])
const totalPages = ref(1)
const total = ref(0)

const timeRanges = computed<{ label: string; value: TimeRange }[]>(() => [
  { label: t('trending.today'), value: 'today' },
  { label: t('trending.weekly'), value: 'weekly' },
  { label: t('trending.monthly'), value: 'monthly' },
])

const sortOptions = computed<{ label: string; value: SortBy }[]>(() => [
  { label: t('trending.trendScore'), value: 'trend_score' },
  { label: t('trending.todayStars'), value: 'today_stars' },
  { label: t('trending.totalStars'), value: 'stars' },
  { label: t('trending.forks'), value: 'forks' },
  { label: t('trending.recentlyPushed'), value: 'pushed_at' },
  { label: t('trending.newest'), value: 'created_at' },
])

const languages = ['TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'JavaScript', 'Swift']
const topics = ['machine-learning', 'web-framework', 'cli', 'database', 'devtools', 'ai', 'llm', 'rust']

const debounceTimer = ref<ReturnType<typeof setTimeout>>()

function onSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    searchQuery.value = val
    currentPage.value = 1
  }, 300)
}

function toggleLanguage(lang: string) {
  selectedLanguage.value = selectedLanguage.value === lang ? '' : lang
  currentPage.value = 1
}

function toggleTopic(topic: string) {
  selectedTopic.value = selectedTopic.value === topic ? '' : topic
  currentPage.value = 1
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function rankClass(change: number): string {
  if (change > 0) return 'trend-up'
  if (change < 0) return 'trend-down'
  return 'trend-same'
}

async function fetchRepos() {
  loading.value = true
  try {
    // Placeholder data
    const start = (currentPage.value - 1) * pageSize
    const mockTotal = 87
    totalPages.value = Math.ceil(mockTotal / pageSize)
    total.value = mockTotal
    repos.value = Array.from({ length: Math.min(pageSize, mockTotal - start) }, (_, i) => ({
      id: start + i + 1,
      fullName: `org/repo-${start + i + 1}`,
      owner: 'org',
      ownerAvatar: '',
      description: 'A trending open-source project gaining stars rapidly',
      url: '#',
      stars: 40000 - (start + i) * 200,
      forks: 6000 - (start + i) * 30,
      openIssues: 80,
      language: languages[(start + i) % languages.length],
      topics: [topics[(start + i) % topics.length]],
      license: 'MIT',
      createdAt: '2024-01-15',
      updatedAt: '2025-06-01',
      pushedAt: '2025-06-01',
      homepage: null,
      defaultBranch: 'main',
      todayStars: 800 - (start + i) * 5,
      todayForks: 40 - (start + i),
      trendScore: 95 - (start + i) * 0.5,
      rank: start + i + 1,
      rankChange: (start + i) % 4 === 0 ? 3 : (start + i) % 4 === 1 ? -2 : 0,
    }))
  } finally {
    loading.value = false
  }
}

watch([timeRange, selectedLanguage, selectedTopic, searchQuery, sortBy, currentPage], fetchRepos, { immediate: true })

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const cardRotations = ['-0.5deg', '0.5deg', '-1deg', '1deg', '-0.8deg', '0.3deg', '-1.5deg', '1.2deg', '-0.3deg', '0.7deg']
</script>

<template>
  <div class="trending">
    <h1 class="page-title">{{ t('trending.pageTitle') }}</h1>

    <!-- Controls -->
    <div class="controls">
      <div class="controls__row">
        <div class="date-tabs">
          <button
            v-for="tr in timeRanges"
            :key="tr.value"
            class="tab-btn"
            :class="{ active: timeRange === tr.value }"
            @click="timeRange = tr.value"
          >
            {{ tr.label }}
          </button>
        </div>

        <div class="search-box">
          <span class="search-box__icon">&#128269;</span>
          <input
            type="text"
            class="search-box__input"
            :placeholder="t('trending.searchPlaceholder')"
            @input="onSearchInput"
          />
        </div>

        <div class="sort-select">
          <label class="sort-select__label">{{ t('trending.sortLabel') }}</label>
          <select v-model="sortBy" class="sort-select__dropdown">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="controls__row">
        <div class="filter-group">
          <span class="filter-group__label">{{ t('trending.languageLabel') }}</span>
          <div class="chip-row">
            <button
              v-for="lang in languages"
              :key="lang"
              class="chip"
              :class="{ active: selectedLanguage === lang }"
              @click="toggleLanguage(lang)"
            >
              {{ lang }}
            </button>
          </div>
        </div>
      </div>

      <div class="controls__row">
        <div class="filter-group">
          <span class="filter-group__label">{{ t('trending.topicsLabel') }}</span>
          <div class="chip-row">
            <button
              v-for="topic in topics"
              :key="topic"
              class="chip chip--topic"
              :class="{ active: selectedTopic === topic }"
              @click="toggleTopic(topic)"
            >
              {{ topic }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results info -->
    <div class="results-info" v-if="!loading">
      <span>{{ t('trending.resultsFound', { total }) }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card" />
    </div>

    <!-- Empty State -->
    <div v-else-if="repos.length === 0" class="empty-state">
      <div class="empty-state__icon">&#128270;</div>
      <p class="empty-state__text">{{ t('trending.emptyTitle') }}</p>
      <button class="empty-state__btn" @click="selectedLanguage = ''; selectedTopic = ''; searchQuery = ''">
        {{ t('trending.clearFilters') }}
      </button>
    </div>

    <!-- Repo Cards -->
    <div v-else class="repo-grid">
      <article
        v-for="(repo, idx) in repos"
        :key="repo.id"
        class="repo-card"
        :style="{ transform: `rotate(${cardRotations[idx % cardRotations.length]})` }"
      >
        <div class="repo-card__header">
          <a :href="repo.url" class="repo-card__name">{{ repo.fullName }}</a>
          <span class="repo-card__trend" :class="rankClass(repo.rankChange)">
            {{ repo.rankChange > 0 ? '&#9650;' : repo.rankChange < 0 ? '&#9660;' : '&#9644;' }}
            {{ Math.abs(repo.rankChange) }}
          </span>
        </div>
        <p class="repo-card__desc">{{ repo.description }}</p>
        <div class="repo-card__tags">
          <span v-for="tag in repo.topics" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="repo-card__meta">
          <span class="meta-item meta-item--stars">&#9733; {{ formatNumber(repo.stars) }}</span>
          <span class="meta-item">&#9681; {{ formatNumber(repo.forks) }}</span>
          <span class="meta-item">{{ repo.language }}</span>
          <span class="meta-item meta-item--score">{{ t('trending.scoreLabel') }}: {{ repo.trendScore.toFixed(1) }}</span>
        </div>
        <div class="repo-card__today">
          <span class="today-stars">{{ t('trending.starsToday', { count: formatNumber(repo.todayStars) }) }}</span>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
        &laquo; {{ t('trending.prev') }}
      </button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="page-btn"
        :class="{ active: p === currentPage }"
        @click="goToPage(p)"
      >
        {{ p }}
      </button>
      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
        {{ t('trending.next') }} &raquo;
      </button>
    </nav>
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

.trending {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Caveat', cursive;
  margin: 0 0 1.5rem;
  color: $text;
}

/* Controls */
.controls {
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.controls__row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-tabs {
  display: flex;
  gap: 0.25rem;
  background: #faf8f4;
  border: 1px dashed $border;
  border-radius: 3px;
  padding: 0.25rem;
}

.tab-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 2px;
  background: transparent;
  color: $text-muted;
  font-family: 'Patrick Hand', cursive;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #fef9c3;
    color: $text;
    border: 1.5px solid $border;
    box-shadow: $shadow;
  }

  &:hover:not(.active) {
    color: $text;
    background: #f3f4f6;
  }
}

.search-box {
  flex: 1;
  min-width: 200px;
  position: relative;

  &__icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
    opacity: 0.5;
  }

  &__input {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.25rem;
    border: none;
    border-bottom: 2.5px solid $border;
    border-radius: 0;
    background: transparent;
    color: $text;
    font-family: 'Patrick Hand', cursive;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-bottom-color: #1f2937;
    }

    &::placeholder {
      color: $text-muted;
    }
  }
}

.sort-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    font-family: 'Patrick Hand', cursive;
    white-space: nowrap;
  }

  &__dropdown {
    padding: 0.5rem 0.75rem;
    border: 1.5px solid $border;
    border-radius: 3px;
    background: #faf8f4;
    color: $text;
    font-family: 'Patrick Hand', cursive;
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: #1f2937;
    }
  }
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  &__label {
    color: $text-muted;
    font-size: 0.85rem;
    font-family: 'Patrick Hand', cursive;
    white-space: nowrap;
    font-weight: 600;
  }
}

.chip-row {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.chip {
  padding: 0.3rem 0.75rem;
  border: 1.5px dashed $border;
  border-radius: 3px;
  background: transparent;
  color: $text-muted;
  font-size: 0.78rem;
  font-family: 'Patrick Hand', cursive;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &.active {
    background: #fef9c3;
    border-style: solid;
    border-color: #9ca3af;
    color: $text;
    box-shadow: $shadow;
  }

  &:hover:not(.active) {
    border-style: solid;
    border-color: #9ca3af;
    color: $text;
  }

  &--topic.active {
    background: #fce7f3;
    border-color: #9ca3af;
    color: $text;
  }
}

.results-info {
  color: $text-muted;
  font-size: 0.85rem;
  font-family: 'Patrick Hand', cursive;
  margin-bottom: 1rem;
}

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  height: 200px;
  border-radius: 3px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border: 1.5px solid $border;
  box-shadow: $shadow;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  &__text {
    color: $text-muted;
    font-size: 1.1rem;
    font-family: 'Patrick Hand', cursive;
    margin-bottom: 1.5rem;
  }

  &__btn {
    padding: 0.6rem 1.5rem;
    border: 1.5px solid $border;
    border-radius: 3px;
    background: transparent;
    color: $text;
    font-family: 'Patrick Hand', cursive;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: $shadow;

    &:hover {
      background: #faf8f4;
      box-shadow: $shadow-hover;
      transform: translateY(-2px);
    }
  }
}

/* Repo Grid */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.repo-card {
  padding: 1.25rem;
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px) rotate(0deg) !important;
    box-shadow: $shadow-hover;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  &__name {
    color: $text;
    font-weight: 700;
    font-size: 1rem;
    font-family: 'Patrick Hand', cursive;
    text-decoration: none;

    &:hover {
      color: $text;
      text-decoration: underline;
      text-decoration-style: dashed;
    }
  }

  &__trend {
    font-size: 0.8rem;
    white-space: nowrap;
    font-weight: 600;
    font-family: 'Patrick Hand', cursive;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.82rem;
    font-family: 'Patrick Hand', cursive;
    margin: 0 0 0.75rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  &__meta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: $text-muted;
    font-family: 'Patrick Hand', cursive;
  }

  &__today {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed $border;
  }
}

.tag {
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-family: 'Patrick Hand', cursive;
  background: #fef9c3;
  color: #92400e;
  border: 1px dashed #d1d5db;
}

.meta-item--stars {
  color: #b45309;
}

.meta-item--score {
  color: $text;
  font-weight: 600;
}

.today-stars {
  color: #059669;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Patrick Hand', cursive;
}

.trend-up { color: #059669; }
.trend-down { color: #dc2626; }
.trend-same { color: $text-muted; }

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  color: $text-muted;
  font-size: 0.85rem;
  font-family: 'Patrick Hand', cursive;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    color: $text;
    border-bottom: 2px solid $text;
    font-weight: 600;
  }

  &:hover:not(.active):not(:disabled) {
    color: $text;
    border-bottom: 2px dashed $border;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

@media (max-width: 640px) {
  .repo-grid,
  .skeleton-grid {
    grid-template-columns: 1fr;
  }

  .controls__row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: unset;
  }
}
</style>
