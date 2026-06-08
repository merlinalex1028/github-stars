export interface GithubRepo {
  id: number
  fullName: string
  owner: string
  ownerAvatar: string
  description: string
  url: string
  stars: number
  forks: number
  openIssues: number
  language: string
  topics: string[]
  license: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string
  homepage: string | null
  defaultBranch: string
}

export interface RepoTrendSnapshot {
  repoId: number
  date: string
  stars: number
  forks: number
  openIssues: number
  todayStars: number
  todayForks: number
  trendScore: number
  rank: number
  rankChange: number
}

export interface RepoWithTrend extends GithubRepo {
  todayStars: number
  todayForks: number
  trendScore: number
  rank: number
  rankChange: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface StatsOverview {
  totalRepos: number
  todayStars: number
  languageCount: number
  aiProjectCount: number
  topTopic: string
  topLanguage: string
}

export interface LanguageStat {
  language: string
  repoCount: number
  totalStars: number
  todayStars: number
  trendChange: number
}

export interface TopicStat {
  topic: string
  repoCount: number
  totalStars: number
  todayStars: number
  trendChange: number
}

export interface SyncLog {
  id: number
  syncDate: string
  status: 'success' | 'failed'
  totalRepos: number
  message: string
  duration: number
}

export type TimeRange = 'today' | 'weekly' | 'monthly'

export type SortBy = 'trend_score' | 'today_stars' | 'stars' | 'forks' | 'pushed_at' | 'created_at'

export interface TrendingParams {
  range?: TimeRange
  language?: string
  topic?: string
  page?: number
  pageSize?: number
  sortBy?: SortBy
  search?: string
}
