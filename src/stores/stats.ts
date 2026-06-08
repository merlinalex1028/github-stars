import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StatsOverview, LanguageStat, TopicStat } from '@/types'
import { getStatsOverview, getLanguages, getTopics } from '@/services/api'

export const useStatsStore = defineStore('stats', () => {
  const overview = ref<StatsOverview | null>(null)
  const languages = ref<LanguageStat[]>([])
  const topics = ref<TopicStat[]>([])
  const loading = ref(false)

  async function fetchOverview() {
    loading.value = true
    try {
      overview.value = await getStatsOverview()
    } finally {
      loading.value = false
    }
  }

  async function fetchLanguages() {
    loading.value = true
    try {
      languages.value = await getLanguages()
    } finally {
      loading.value = false
    }
  }

  async function fetchTopics() {
    loading.value = true
    try {
      topics.value = await getTopics()
    } finally {
      loading.value = false
    }
  }

  return {
    overview,
    languages,
    topics,
    loading,
    fetchOverview,
    fetchLanguages,
    fetchTopics,
  }
})
