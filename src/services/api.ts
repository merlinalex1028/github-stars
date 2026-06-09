import type {
  GithubRepo,
  RepoTrendSnapshot,
  RepoWithTrend,
  PaginatedResponse,
  StatsOverview,
  LanguageStat,
  TopicStat,
  SyncLog,
  TrendingParams,
} from '@/types'
import {
  mockGetTrending,
  mockGetRepoDetail,
  mockGetLanguages,
  mockGetTopics,
  mockGetStatsOverview,
  mockTriggerSync,
} from './mock'

const BASE_URL = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message ?? `HTTP ${response.status}`)
  }

  return response.json()
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function getTrending(
  params: TrendingParams = {},
): Promise<PaginatedResponse<RepoWithTrend>> {
  try {
    const query = buildQuery(params as Record<string, string | number | undefined>)
    const result = await request<PaginatedResponse<RepoWithTrend>>(`/trending${query}`)
    if (result.data && result.data.length > 0) {
      return result
    }
    return mockGetTrending(params)
  } catch {
    return mockGetTrending(params)
  }
}

export async function getRepoDetail(
  owner: string,
  repo: string,
): Promise<{ repo: GithubRepo; snapshots: RepoTrendSnapshot[] }> {
  try {
    const result = await request<{ repo: GithubRepo; snapshots: RepoTrendSnapshot[] }>(
      `/repos/${owner}/${repo}`,
    )
    if (result.repo) {
      return result
    }
    return mockGetRepoDetail(owner, repo)
  } catch {
    return mockGetRepoDetail(owner, repo)
  }
}

export async function getLanguages(): Promise<LanguageStat[]> {
  try {
    const result = await request<{ success: boolean; data: LanguageStat[] }>('/languages')
    if (result.data && result.data.length > 0) {
      return result.data
    }
    return mockGetLanguages()
  } catch {
    return mockGetLanguages()
  }
}

export async function getTopics(): Promise<TopicStat[]> {
  try {
    const result = await request<{ success: boolean; data: TopicStat[] }>('/topics')
    if (result.data && result.data.length > 0) {
      return result.data
    }
    return mockGetTopics()
  } catch {
    return mockGetTopics()
  }
}

export async function getStatsOverview(): Promise<StatsOverview> {
  try {
    const result = await request<{ success: boolean; data: StatsOverview }>('/stats/overview')
    if (result.data && result.data.totalRepos > 0) {
      return result.data
    }
    return mockGetStatsOverview()
  } catch {
    return mockGetStatsOverview()
  }
}

export async function triggerSync(secret?: string): Promise<SyncLog> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (secret) {
      headers['Authorization'] = `Bearer ${secret}`
    }
    const result = await request<{ success: boolean; data: SyncLog }>('/sync', { method: 'POST', headers })
    return result.data
  } catch {
    return mockTriggerSync()
  }
}
