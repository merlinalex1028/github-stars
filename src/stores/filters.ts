import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TimeRange, SortBy } from '@/types'

export const useFiltersStore = defineStore('filters', () => {
  const range = ref<TimeRange>('today')
  const language = ref<string>('')
  const topic = ref<string>('')
  const page = ref(1)
  const pageSize = ref(10)
  const sortBy = ref<SortBy>('trend_score')
  const search = ref('')

  function setRange(value: TimeRange) {
    range.value = value
    page.value = 1
  }

  function setLanguage(value: string) {
    language.value = value
    page.value = 1
  }

  function setTopic(value: string) {
    topic.value = value
    page.value = 1
  }

  function setPage(value: number) {
    page.value = value
  }

  function setSortBy(value: SortBy) {
    sortBy.value = value
    page.value = 1
  }

  function setSearch(value: string) {
    search.value = value
    page.value = 1
  }

  function resetFilters() {
    range.value = 'today'
    language.value = ''
    topic.value = ''
    page.value = 1
    pageSize.value = 10
    sortBy.value = 'trend_score'
    search.value = ''
  }

  return {
    range,
    language,
    topic,
    page,
    pageSize,
    sortBy,
    search,
    setRange,
    setLanguage,
    setTopic,
    setPage,
    setSortBy,
    setSearch,
    resetFilters,
  }
})
