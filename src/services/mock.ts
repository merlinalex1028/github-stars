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

const mockRepos: GithubRepo[] = [
  {
    id: 1,
    fullName: 'openai/whisper',
    owner: 'openai',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/14957082?v=4',
    description: 'Robust Speech Recognition via Large-Scale Weak Supervision',
    url: 'https://github.com/openai/whisper',
    stars: 72500,
    forks: 8600,
    openIssues: 120,
    language: 'Python',
    topics: ['speech-recognition', 'ai', 'machine-learning'],
    license: 'MIT',
    createdAt: '2022-09-21T00:00:00Z',
    updatedAt: '2026-06-07T12:00:00Z',
    pushedAt: '2026-06-06T18:30:00Z',
    homepage: 'https://openai.com/research/whisper',
    defaultBranch: 'main',
  },
  {
    id: 2,
    fullName: 'langchain-ai/langchain',
    owner: 'langchain-ai',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/126733545?v=4',
    description: 'Build context-aware reasoning applications',
    url: 'https://github.com/langchain-ai/langchain',
    stars: 98000,
    forks: 15200,
    openIssues: 340,
    language: 'Python',
    topics: ['llm', 'ai', 'langchain', 'agents'],
    license: 'MIT',
    createdAt: '2022-10-17T00:00:00Z',
    updatedAt: '2026-06-08T08:00:00Z',
    pushedAt: '2026-06-08T06:45:00Z',
    homepage: 'https://langchain.com',
    defaultBranch: 'master',
  },
  {
    id: 3,
    fullName: 'denoland/deno',
    owner: 'denoland',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/42048915?v=4',
    description: 'A modern runtime for JavaScript and TypeScript',
    url: 'https://github.com/denoland/deno',
    stars: 96000,
    forks: 5400,
    openIssues: 1800,
    language: 'Rust',
    topics: ['javascript', 'typescript', 'runtime', 'v8'],
    license: 'MIT',
    createdAt: '2018-05-01T00:00:00Z',
    updatedAt: '2026-06-08T10:00:00Z',
    pushedAt: '2026-06-08T09:15:00Z',
    homepage: 'https://deno.land',
    defaultBranch: 'main',
  },
  {
    id: 4,
    fullName: 'vercel/next.js',
    owner: 'vercel',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/14985020?v=4',
    description: 'The React Framework for the Web',
    url: 'https://github.com/vercel/next.js',
    stars: 125000,
    forks: 26500,
    openIssues: 2800,
    language: 'JavaScript',
    topics: ['react', 'framework', 'nextjs', 'ssr'],
    license: 'MIT',
    createdAt: '2016-10-05T00:00:00Z',
    updatedAt: '2026-06-08T11:00:00Z',
    pushedAt: '2026-06-08T10:30:00Z',
    homepage: 'https://nextjs.org',
    defaultBranch: 'canary',
  },
  {
    id: 5,
    fullName: 'sveltejs/svelte',
    owner: 'sveltejs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/23617963?v=4',
    description: 'Cybernetically enhanced web apps',
    url: 'https://github.com/sveltejs/svelte',
    stars: 80000,
    forks: 4200,
    openIssues: 650,
    language: 'JavaScript',
    topics: ['framework', 'ui', 'compiler', 'svelte'],
    license: 'MIT',
    createdAt: '2016-11-20T00:00:00Z',
    updatedAt: '2026-06-07T22:00:00Z',
    pushedAt: '2026-06-07T20:00:00Z',
    homepage: 'https://svelte.dev',
    defaultBranch: 'main',
  },
  {
    id: 6,
    fullName: 'tailwindlabs/tailwindcss',
    owner: 'tailwindlabs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/67109815?v=4',
    description: 'A utility-first CSS framework for rapid UI development',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    stars: 84000,
    forks: 4300,
    openIssues: 45,
    language: 'TypeScript',
    topics: ['css', 'framework', 'tailwind', 'ui'],
    license: 'MIT',
    createdAt: '2017-10-01T00:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
    pushedAt: '2026-06-08T08:00:00Z',
    homepage: 'https://tailwindcss.com',
    defaultBranch: 'main',
  },
  {
    id: 7,
    fullName: 'docker/compose',
    owner: 'docker',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/5429470?v=4',
    description: 'Define and run multi-container applications with Docker',
    url: 'https://github.com/docker/compose',
    stars: 34000,
    forks: 5200,
    openIssues: 280,
    language: 'Go',
    topics: ['docker', 'containers', 'compose', 'devops'],
    license: 'Apache-2.0',
    createdAt: '2013-12-16T00:00:00Z',
    updatedAt: '2026-06-07T18:00:00Z',
    pushedAt: '2026-06-07T16:00:00Z',
    homepage: 'https://docs.docker.com/compose',
    defaultBranch: 'main',
  },
  {
    id: 8,
    fullName: 'tokio-rs/tokio',
    owner: 'tokio-rs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/20248544?v=4',
    description: 'A runtime for writing reliable asynchronous applications with Rust',
    url: 'https://github.com/tokio-rs/tokio',
    stars: 27000,
    forks: 2500,
    openIssues: 95,
    language: 'Rust',
    topics: ['async', 'rust', 'runtime', 'networking'],
    license: 'MIT',
    createdAt: '2017-03-10T00:00:00Z',
    updatedAt: '2026-06-08T07:00:00Z',
    pushedAt: '2026-06-08T06:00:00Z',
    homepage: 'https://tokio.rs',
    defaultBranch: 'master',
  },
  {
    id: 9,
    fullName: 'vuejs/core',
    owner: 'vuejs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/6128107?v=4',
    description: 'Vue.js is a progressive JavaScript framework for building UI on the web',
    url: 'https://github.com/vuejs/core',
    stars: 48000,
    forks: 8300,
    openIssues: 720,
    language: 'TypeScript',
    topics: ['vue', 'framework', 'javascript', 'ui'],
    license: 'MIT',
    createdAt: '2018-09-30T00:00:00Z',
    updatedAt: '2026-06-08T10:00:00Z',
    pushedAt: '2026-06-08T09:00:00Z',
    homepage: 'https://vuejs.org',
    defaultBranch: 'main',
  },
  {
    id: 10,
    fullName: 'facebook/react',
    owner: 'facebook',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/69631?v=4',
    description: 'The library for web and native user interfaces',
    url: 'https://github.com/facebook/react',
    stars: 230000,
    forks: 46000,
    openIssues: 1100,
    language: 'JavaScript',
    topics: ['react', 'javascript', 'ui', 'frontend'],
    license: 'MIT',
    createdAt: '2013-05-29T00:00:00Z',
    updatedAt: '2026-06-08T11:00:00Z',
    pushedAt: '2026-06-08T10:00:00Z',
    homepage: 'https://react.dev',
    defaultBranch: 'main',
  },
  {
    id: 11,
    fullName: 'astral-sh/uv',
    owner: 'astral-sh',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/119053493?v=4',
    description: 'An extremely fast Python package installer and resolver',
    url: 'https://github.com/astral-sh/uv',
    stars: 42000,
    forks: 1200,
    openIssues: 420,
    language: 'Rust',
    topics: ['python', 'package-manager', 'uv', 'fast'],
    license: 'Apache-2.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-06-08T08:00:00Z',
    pushedAt: '2026-06-08T07:30:00Z',
    homepage: 'https://docs.astral.sh/uv',
    defaultBranch: 'main',
  },
  {
    id: 12,
    fullName: 'ollama/ollama',
    owner: 'ollama',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/151674099?v=4',
    description: 'Get up and running with large language models locally',
    url: 'https://github.com/ollama/ollama',
    stars: 110000,
    forks: 8900,
    openIssues: 1500,
    language: 'Go',
    topics: ['llm', 'ai', 'local', 'ollama'],
    license: 'MIT',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2026-06-08T10:30:00Z',
    pushedAt: '2026-06-08T10:00:00Z',
    homepage: 'https://ollama.com',
    defaultBranch: 'main',
  },
  {
    id: 13,
    fullName: 'huggingface/transformers',
    owner: 'huggingface',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/25220110?v=4',
    description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX',
    url: 'https://github.com/huggingface/transformers',
    stars: 140000,
    forks: 28000,
    openIssues: 1700,
    language: 'Python',
    topics: ['machine-learning', 'nlp', 'deep-learning', 'transformers'],
    license: 'Apache-2.0',
    createdAt: '2018-10-29T00:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
    pushedAt: '2026-06-08T08:00:00Z',
    homepage: 'https://huggingface.co/docs/transformers',
    defaultBranch: 'main',
  },
  {
    id: 14,
    fullName: 'rustdesk/rustdesk',
    owner: 'rustdesk',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/71656156?v=4',
    description: 'An open-source remote desktop application designed for self-hosting',
    url: 'https://github.com/rustdesk/rustdesk',
    stars: 78000,
    forks: 10200,
    openIssues: 560,
    language: 'Rust',
    topics: ['remote-desktop', 'rust', 'self-hosted', 'desktop'],
    license: 'AGPL-3.0',
    createdAt: '2020-09-01T00:00:00Z',
    updatedAt: '2026-06-08T07:00:00Z',
    pushedAt: '2026-06-08T06:00:00Z',
    homepage: 'https://rustdesk.com',
    defaultBranch: 'master',
  },
  {
    id: 15,
    fullName: 'withastro/astro',
    owner: 'withastro',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/44914706?v=4',
    description: 'The web framework for content-driven websites',
    url: 'https://github.com/withastro/astro',
    stars: 47000,
    forks: 2500,
    openIssues: 380,
    language: 'TypeScript',
    topics: ['astro', 'framework', 'ssg', 'web'],
    license: 'MIT',
    createdAt: '2021-03-15T00:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
    pushedAt: '2026-06-08T08:30:00Z',
    homepage: 'https://astro.build',
    defaultBranch: 'main',
  },
  {
    id: 16,
    fullName: 'biomejs/biome',
    owner: 'biomejs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/140182603?v=4',
    description: 'A toolchain for web projects, aimed to provide functionalities to maintain them',
    url: 'https://github.com/biomejs/biome',
    stars: 16000,
    forks: 520,
    openIssues: 340,
    language: 'Rust',
    topics: ['linter', 'formatter', 'toolchain', 'javascript'],
    license: 'MIT',
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2026-06-07T20:00:00Z',
    pushedAt: '2026-06-07T19:00:00Z',
    homepage: 'https://biomejs.dev',
    defaultBranch: 'main',
  },
  {
    id: 17,
    fullName: 'shadcn-ui/ui',
    owner: 'shadcn-ui',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/124599?v=4',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    url: 'https://github.com/shadcn-ui/ui',
    stars: 72000,
    forks: 4600,
    openIssues: 240,
    language: 'TypeScript',
    topics: ['ui', 'components', 'tailwind', 'radix'],
    license: 'MIT',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2026-06-08T08:00:00Z',
    pushedAt: '2026-06-08T07:00:00Z',
    homepage: 'https://ui.shadcn.com',
    defaultBranch: 'main',
  },
  {
    id: 18,
    fullName: 'mlc-ai/mlc-llm',
    owner: 'mlc-ai',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/129273757?v=4',
    description: 'Universal LLM Deployment Engine with ML Compilation',
    url: 'https://github.com/mlc-ai/mlc-llm',
    stars: 19000,
    forks: 1500,
    openIssues: 210,
    language: 'Python',
    topics: ['llm', 'ai', 'mlc', 'deployment'],
    license: 'Apache-2.0',
    createdAt: '2023-04-20T00:00:00Z',
    updatedAt: '2026-06-07T15:00:00Z',
    pushedAt: '2026-06-07T14:00:00Z',
    homepage: 'https://mlc.ai',
    defaultBranch: 'main',
  },
  {
    id: 19,
    fullName: 'supabase/supabase',
    owner: 'supabase',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/54469796?v=4',
    description: 'The open source Firebase alternative',
    url: 'https://github.com/supabase/supabase',
    stars: 75000,
    forks: 7200,
    openIssues: 450,
    language: 'TypeScript',
    topics: ['database', 'firebase', 'postgres', 'bass'],
    license: 'Apache-2.0',
    createdAt: '2020-01-07T00:00:00Z',
    updatedAt: '2026-06-08T10:00:00Z',
    pushedAt: '2026-06-08T09:00:00Z',
    homepage: 'https://supabase.com',
    defaultBranch: 'master',
  },
  {
    id: 20,
    fullName: 'vitejs/vite',
    owner: 'vitejs',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/65625612?v=4',
    description: 'Next generation frontend tooling',
    url: 'https://github.com/vitejs/vite',
    stars: 70000,
    forks: 6300,
    openIssues: 480,
    language: 'TypeScript',
    topics: ['vite', 'bundler', 'frontend', 'tooling'],
    license: 'MIT',
    createdAt: '2020-04-21T00:00:00Z',
    updatedAt: '2026-06-08T11:00:00Z',
    pushedAt: '2026-06-08T10:00:00Z',
    homepage: 'https://vitejs.dev',
    defaultBranch: 'main',
  },
]

function generateTrendSnapshot(repo: GithubRepo, index: number): RepoTrendSnapshot {
  const todayStars = Math.floor(Math.random() * 800) + 50
  const todayForks = Math.floor(Math.random() * 80) + 5
  return {
    repoId: repo.id,
    date: new Date().toISOString().split('T')[0],
    stars: repo.stars,
    forks: repo.forks,
    openIssues: repo.openIssues,
    todayStars,
    todayForks,
    trendScore: Math.round((todayStars * 0.7 + todayForks * 0.3) * 100) / 100,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 11) - 5,
  }
}

function buildRepoWithTrend(repo: GithubRepo, index: number): RepoWithTrend {
  const snapshot = generateTrendSnapshot(repo, index)
  return {
    ...repo,
    todayStars: snapshot.todayStars,
    todayForks: snapshot.todayForks,
    trendScore: snapshot.trendScore,
    rank: snapshot.rank,
    rankChange: snapshot.rankChange,
  }
}

const mockLanguageStats: LanguageStat[] = [
  { language: 'TypeScript', repoCount: 5, totalStars: 316000, todayStars: 2800, trendChange: 12.5 },
  { language: 'Rust', repoCount: 5, totalStars: 253000, todayStars: 2100, trendChange: 8.3 },
  { language: 'Python', repoCount: 4, totalStars: 329500, todayStars: 3500, trendChange: 15.2 },
  { language: 'JavaScript', repoCount: 3, totalStars: 435000, todayStars: 1800, trendChange: -2.1 },
  { language: 'Go', repoCount: 2, totalStars: 144000, todayStars: 950, trendChange: 5.7 },
]

const mockTopicStats: TopicStat[] = [
  { topic: 'ai', repoCount: 6, totalStars: 460500, todayStars: 4200, trendChange: 18.5 },
  { topic: 'llm', repoCount: 4, totalStars: 269000, todayStars: 3100, trendChange: 22.3 },
  { topic: 'framework', repoCount: 4, totalStars: 300000, todayStars: 1900, trendChange: 6.1 },
  { topic: 'rust', repoCount: 3, totalStars: 183000, todayStars: 1400, trendChange: 10.8 },
  { topic: 'ui', repoCount: 4, totalStars: 283000, todayStars: 2200, trendChange: 9.4 },
  { topic: 'machine-learning', repoCount: 3, totalStars: 239500, todayStars: 2800, trendChange: 14.2 },
  { topic: 'typescript', repoCount: 3, totalStars: 202000, todayStars: 1600, trendChange: 7.5 },
  { topic: 'react', repoCount: 2, totalStars: 355000, todayStars: 1200, trendChange: -1.3 },
  { topic: 'web', repoCount: 2, totalStars: 117000, todayStars: 800, trendChange: 4.9 },
  { topic: 'tailwind', repoCount: 2, totalStars: 156000, todayStars: 1100, trendChange: 11.2 },
]

const mockSyncLogs: SyncLog[] = [
  { id: 1, syncDate: '2026-06-08T08:00:00Z', status: 'success', totalRepos: 20, message: 'Sync completed successfully', duration: 45 },
  { id: 2, syncDate: '2026-06-07T08:00:00Z', status: 'success', totalRepos: 19, message: 'Sync completed successfully', duration: 52 },
  { id: 3, syncDate: '2026-06-06T08:00:00Z', status: 'failed', totalRepos: 0, message: 'API rate limit exceeded', duration: 12 },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetTrending(
  params: TrendingParams = {},
): Promise<PaginatedResponse<RepoWithTrend>> {
  await delay(300 + Math.random() * 200)

  const { page = 1, pageSize = 10, range = 'today', language, topic, sortBy = 'trend_score', search } = params

  let repos = mockRepos.map((repo, i) => buildRepoWithTrend(repo, i))

  if (language) {
    repos = repos.filter((r) => r.language.toLowerCase() === language.toLowerCase())
  }
  if (topic) {
    repos = repos.filter((r) => r.topics.includes(topic.toLowerCase()))
  }
  if (search) {
    const q = search.toLowerCase()
    repos = repos.filter(
      (r) => r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    )
  }

  repos.sort((a, b) => {
    switch (sortBy) {
      case 'today_stars': return b.todayStars - a.todayStars
      case 'stars': return b.stars - a.stars
      case 'forks': return b.forks - a.forks
      case 'trend_score':
      default: return b.trendScore - a.trendScore
    }
  })

  const total = repos.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = repos.slice(start, start + pageSize)

  return { data, total, page, pageSize, totalPages }
}

export async function mockGetRepoDetail(
  owner: string,
  repo: string,
): Promise<{ repo: GithubRepo; snapshots: RepoTrendSnapshot[] }> {
  await delay(200 + Math.random() * 150)

  const found = mockRepos.find((r) => r.owner === owner && r.fullName.endsWith(`/${repo}`))
  if (!found) {
    throw new Error(`Repository ${owner}/${repo} not found`)
  }

  const snapshots: RepoTrendSnapshot[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      repoId: found.id,
      date: date.toISOString().split('T')[0],
      stars: found.stars - (6 - i) * Math.floor(Math.random() * 200 + 100),
      forks: found.forks - (6 - i) * Math.floor(Math.random() * 20 + 10),
      openIssues: found.openIssues + Math.floor(Math.random() * 10 - 5),
      todayStars: Math.floor(Math.random() * 600) + 50,
      todayForks: Math.floor(Math.random() * 60) + 5,
      trendScore: Math.round(Math.random() * 800 + 100),
      rank: Math.floor(Math.random() * 20) + 1,
      rankChange: Math.floor(Math.random() * 11) - 5,
    }
  })

  return { repo: found, snapshots }
}

export async function mockGetLanguages(): Promise<LanguageStat[]> {
  await delay(200 + Math.random() * 100)
  return mockLanguageStats
}

export async function mockGetTopics(): Promise<TopicStat[]> {
  await delay(200 + Math.random() * 100)
  return mockTopicStats
}

export async function mockGetStatsOverview(): Promise<StatsOverview> {
  await delay(150 + Math.random() * 100)
  return {
    totalRepos: 20,
    todayStars: 14250,
    languageCount: 5,
    aiProjectCount: 6,
    topTopic: 'ai',
    topLanguage: 'Python',
  }
}

export async function mockTriggerSync(): Promise<SyncLog> {
  await delay(500 + Math.random() * 300)
  return {
    id: mockSyncLogs.length + 1,
    syncDate: new Date().toISOString(),
    status: 'success',
    totalRepos: 20,
    message: 'Sync completed successfully',
    duration: Math.floor(Math.random() * 60) + 20,
  }
}
