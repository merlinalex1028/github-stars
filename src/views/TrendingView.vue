<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { RepoWithTrend, TimeRange, SortBy, PaginatedResponse } from '@/types'

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

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const sortOptions: { label: string; value: SortBy }[] = [
  { label: 'Trend Score', value: 'trend_score' },
  { label: 'Today Stars', value: 'today_stars' },
  { label: 'Total Stars', value: 'stars' },
  { label: 'Forks', value: 'forks' },
  { label: 'Recently Pushed', value: 'pushed_at' },
  { label: 'Newest', value: 'created_at' },
]

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
</script>

<template>
  <div class="trending">
    <h1 class="page-title">Trending Repositories</h1>

    <!-- Controls -->
    <div class="controls glass">
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
            placeholder="Search repositories..."
            @input="onSearchInput"
          />
        </div>

        <div class="sort-select">
          <label class="sort-select__label">Sort:</label>
          <select v-model="sortBy" class="sort-select__dropdown">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="controls__row">
        <div class="filter-group">
          <span class="filter-group__label">Language:</span>
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
          <span class="filter-group__label">Topics:</span>
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
      <span>{{ total }} repositories found</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card" />
    </div>

    <!-- Empty State -->
    <div v-else-if="repos.length === 0" class="empty-state glass">
      <div class="empty-state__icon">&#128270;</div>
      <p class="empty-state__text">No repositories match your filters.</p>
      <button class="empty-state__btn" @click="selectedLanguage = ''; selectedTopic = ''; searchQuery = ''">
        Clear Filters
      </button>
    </div>

    <!-- Repo Cards -->
    <div v-else class="repo-grid">
      <article v-for="repo in repos" :key="repo.id" class="repo-card glass">
        <div class="repo-card__header">
          <a :href="repo.url" class="repo-card__name">{{ repo.fullName }}</a>
          <span class="repo-card__trend" :class="rankClass(repo.rankChange)">
            {{ repo.rankChange > 0 ? '&#9650;' : repo.rankChange < 0 ? '&#9660;' : '&#9644;' }}
            {{ Math.abs(repo.rankChange) }}
          </span>
        </div>
        <p class="repo-card__desc">{{ repo.description }}</p>
        <div class="repo-card__tags">
          <span v-for="t in repo.topics" :key="t" class="tag">{{ t }}</span>
        </div>
        <div class="repo-card__meta">
          <span class="meta-item meta-item--stars">&#9733; {{ formatNumber(repo.stars) }}</span>
          <span class="meta-item">&#9681; {{ formatNumber(repo.forks) }}</span>
          <span class="meta-item">{{ repo.language }}</span>
          <span class="meta-item meta-item--score">Score: {{ repo.trendScore.toFixed(1) }}</span>
        </div>
        <div class="repo-card__today">
          <span class="today-stars">+{{ formatNumber(repo.todayStars) }} stars today</span>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
        &laquo; Prev
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
        Next &raquo;
      </button>
    </nav>
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

.trending {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, $glow, #a78bfa);
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

/* Controls */
.controls {
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
  background: rgba(99, 102, 241, 0.08);
  border-radius: 0.625rem;
  padding: 0.25rem;
}

.tab-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: $text-muted;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $glow;
    color: #fff;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
  }

  &:hover:not(.active) {
    color: $text;
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
    border: 1px solid $border;
    border-radius: 0.5rem;
    background: rgba(5, 8, 22, 0.6);
    color: $text;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: $glow;
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.2);
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
    white-space: nowrap;
  }

  &__dropdown {
    padding: 0.5rem 0.75rem;
    border: 1px solid $border;
    border-radius: 0.5rem;
    background: rgba(5, 8, 22, 0.6);
    color: $text;
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: $glow;
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
  border: 1px solid $border;
  border-radius: 999px;
  background: transparent;
  color: $text-muted;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &.active {
    background: rgba(99, 102, 241, 0.2);
    border-color: $glow;
    color: $glow;
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.15);
  }

  &:hover:not(.active) {
    border-color: rgba(99, 102, 241, 0.3);
    color: $text;
  }

  &--topic.active {
    background: rgba(236, 72, 153, 0.15);
    border-color: #ec4899;
    color: #ec4899;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.15);
  }
}

.results-info {
  color: $text-muted;
  font-size: 0.85rem;
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
  border-radius: 1rem;
  background: linear-gradient(90deg, $border 25%, rgba(99, 102, 241, 0.08) 50%, $border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  &__text {
    color: $text-muted;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  &__btn {
    padding: 0.6rem 1.5rem;
    border: 1px solid $glow;
    border-radius: 0.5rem;
    background: transparent;
    color: $glow;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(99, 102, 241, 0.15);
    }
  }
}

/* Repo Grid */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.repo-card {
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.12);
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
    text-decoration: none;

    &:hover {
      color: $glow;
      text-decoration: underline;
    }
  }

  &__trend {
    font-size: 0.8rem;
    white-space: nowrap;
    font-weight: 600;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.82rem;
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
  }

  &__today {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid $border;
  }
}

.tag {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.meta-item--stars {
  color: #f59e0b;
}

.meta-item--score {
  color: $glow;
  font-weight: 600;
}

.today-stars {
  color: #10b981;
  font-size: 0.82rem;
  font-weight: 600;
}

.trend-up { color: #10b981; }
.trend-down { color: #ef4444; }
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
  border: 1px solid $border;
  border-radius: 0.5rem;
  background: transparent;
  color: $text-muted;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $glow;
    color: #fff;
    border-color: $glow;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
  }

  &:hover:not(.active):not(:disabled) {
    border-color: $glow;
    color: $text;
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
