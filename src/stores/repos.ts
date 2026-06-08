import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GithubRepo, RepoTrendSnapshot, RepoWithTrend, TrendingParams } from '@/types'
import { getTrending, getRepoDetail } from '@/services/api'

export const useReposStore = defineStore('repos', () => {
  const trendingRepos = ref<RepoWithTrend[]>([])
  const currentRepo = ref<GithubRepo | null>(null)
  const snapshots = ref<RepoTrendSnapshot[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTrending(params: TrendingParams = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await getTrending(params)
      trendingRepos.value = response.data
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch trending repos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRepoDetail(owner: string, repo: string) {
    loading.value = true
    error.value = null

    try {
      const result = await getRepoDetail(owner, repo)
      currentRepo.value = result.repo
      snapshots.value = result.snapshots
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch repo detail'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    trendingRepos,
    currentRepo,
    snapshots,
    loading,
    error,
    fetchTrending,
    fetchRepoDetail,
  }
})
