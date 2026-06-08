import type { GithubRepo, RepoTrendSnapshot } from '../../../../src/types/index'

interface Env {
  DB: D1Database
}

interface RepoDetailResponse {
  repo: GithubRepo
  snapshots: RepoTrendSnapshot[]
}

const MOCK_REPOS: Record<string, { repo: GithubRepo; snapshots: RepoTrendSnapshot[] }> = {
  'vercel/next.js': {
    repo: {
      id: 1, fullName: 'vercel/next.js', owner: 'vercel', ownerAvatar: 'https://avatars.githubusercontent.com/u/14985020',
      description: 'The React Framework', url: 'https://github.com/vercel/next.js', stars: 128900, forks: 27400,
      openIssues: 2840, language: 'TypeScript', topics: ['react', 'framework', 'nextjs', 'ssr', 'jamstack'],
      license: 'MIT', createdAt: '2016-10-05T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
      pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://nextjs.org', defaultBranch: 'canary',
    },
    snapshots: [
      { repoId: 1, date: '2026-06-08', stars: 128900, forks: 27400, openIssues: 2840, todayStars: 342, todayForks: 48, trendScore: 98.5, rank: 1, rankChange: 0 },
      { repoId: 1, date: '2026-06-07', stars: 128558, forks: 27352, openIssues: 2855, todayStars: 298, todayForks: 42, trendScore: 96.8, rank: 1, rankChange: 0 },
      { repoId: 1, date: '2026-06-06', stars: 128260, forks: 27310, openIssues: 2860, todayStars: 315, todayForks: 45, trendScore: 97.2, rank: 1, rankChange: 1 },
      { repoId: 1, date: '2026-06-05', stars: 127945, forks: 27265, openIssues: 2870, todayStars: 280, todayForks: 38, trendScore: 95.1, rank: 2, rankChange: -1 },
      { repoId: 1, date: '2026-06-04', stars: 127665, forks: 27227, openIssues: 2880, todayStars: 305, todayForks: 44, trendScore: 96.5, rank: 1, rankChange: 0 },
      { repoId: 1, date: '2026-06-03', stars: 127360, forks: 27183, openIssues: 2890, todayStars: 275, todayForks: 36, trendScore: 94.3, rank: 1, rankChange: 0 },
      { repoId: 1, date: '2026-06-02', stars: 127085, forks: 27147, openIssues: 2895, todayStars: 290, todayForks: 40, trendScore: 95.7, rank: 1, rankChange: 1 },
    ],
  },
  'facebook/react': {
    repo: {
      id: 2, fullName: 'facebook/react', owner: 'facebook', ownerAvatar: 'https://avatars.githubusercontent.com/u/69631',
      description: 'The library for web and native user interfaces.', url: 'https://github.com/facebook/react', stars: 232000, forks: 47500,
      openIssues: 1120, language: 'JavaScript', topics: ['javascript', 'react', 'frontend', 'ui'],
      license: 'MIT', createdAt: '2013-05-24T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
      pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://react.dev', defaultBranch: 'main',
    },
    snapshots: [
      { repoId: 2, date: '2026-06-08', stars: 232000, forks: 47500, openIssues: 1120, todayStars: 287, todayForks: 35, trendScore: 96.2, rank: 2, rankChange: 1 },
      { repoId: 2, date: '2026-06-07', stars: 231713, forks: 47465, openIssues: 1125, todayStars: 265, todayForks: 32, trendScore: 94.8, rank: 3, rankChange: -1 },
      { repoId: 2, date: '2026-06-06', stars: 231448, forks: 47433, openIssues: 1130, todayStars: 278, todayForks: 34, trendScore: 95.5, rank: 2, rankChange: 0 },
      { repoId: 2, date: '2026-06-05', stars: 231170, forks: 47399, openIssues: 1135, todayStars: 255, todayForks: 30, trendScore: 93.2, rank: 3, rankChange: 0 },
      { repoId: 2, date: '2026-06-04', stars: 230915, forks: 47369, openIssues: 1140, todayStars: 270, todayForks: 33, trendScore: 94.1, rank: 2, rankChange: 1 },
      { repoId: 2, date: '2026-06-03', stars: 230645, forks: 47336, openIssues: 1145, todayStars: 248, todayForks: 28, trendScore: 92.5, rank: 3, rankChange: -1 },
      { repoId: 2, date: '2026-06-02', stars: 230397, forks: 47308, openIssues: 1150, todayStars: 262, todayForks: 31, trendScore: 93.8, rank: 2, rankChange: 0 },
    ],
  },
  'denoland/deno': {
    repo: {
      id: 3, fullName: 'denoland/deno', owner: 'denoland', ownerAvatar: 'https://avatars.githubusercontent.com/u/44010072',
      description: 'A modern runtime for JavaScript and TypeScript.', url: 'https://github.com/denoland/deno', stars: 98700, forks: 5400,
      openIssues: 1890, language: 'Rust', topics: ['javascript', 'typescript', 'runtime', 'deno', 'v8'],
      license: 'MIT', createdAt: '2018-05-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
      pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://deno.com', defaultBranch: 'main',
    },
    snapshots: [
      { repoId: 3, date: '2026-06-08', stars: 98700, forks: 5400, openIssues: 1890, todayStars: 256, todayForks: 22, trendScore: 94.1, rank: 3, rankChange: -1 },
      { repoId: 3, date: '2026-06-07', stars: 98444, forks: 5378, openIssues: 1895, todayStars: 240, todayForks: 20, trendScore: 92.6, rank: 2, rankChange: 1 },
      { repoId: 3, date: '2026-06-06', stars: 98204, forks: 5358, openIssues: 1900, todayStars: 248, todayForks: 21, trendScore: 93.3, rank: 3, rankChange: 0 },
      { repoId: 3, date: '2026-06-05', stars: 97956, forks: 5337, openIssues: 1905, todayStars: 230, todayForks: 18, trendScore: 91.5, rank: 4, rankChange: -1 },
      { repoId: 3, date: '2026-06-04', stars: 97726, forks: 5319, openIssues: 1910, todayStars: 245, todayForks: 20, trendScore: 92.8, rank: 3, rankChange: 1 },
      { repoId: 3, date: '2026-06-03', stars: 97481, forks: 5299, openIssues: 1915, todayStars: 225, todayForks: 17, trendScore: 90.9, rank: 4, rankChange: 0 },
      { repoId: 3, date: '2026-06-02', stars: 97256, forks: 5282, openIssues: 1920, todayStars: 238, todayForks: 19, trendScore: 91.8, rank: 3, rankChange: 0 },
    ],
  },
  'ollama/ollama': {
    repo: {
      id: 12, fullName: 'ollama/ollama', owner: 'ollama', ownerAvatar: 'https://avatars.githubusercontent.com/u/151674099',
      description: 'Get up and running with large language models locally.', url: 'https://github.com/ollama/ollama', stars: 118000, forks: 8900,
      openIssues: 2340, language: 'Go', topics: ['llm', 'ai', 'local', 'ollama', 'go'],
      license: 'MIT', createdAt: '2023-06-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
      pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://ollama.com', defaultBranch: 'main',
    },
    snapshots: [
      { repoId: 12, date: '2026-06-08', stars: 118000, forks: 8900, openIssues: 2340, todayStars: 128, todayForks: 11, trendScore: 78.1, rank: 12, rankChange: -1 },
      { repoId: 12, date: '2026-06-07', stars: 117872, forks: 8889, openIssues: 2345, todayStars: 118, todayForks: 10, trendScore: 76.5, rank: 11, rankChange: 1 },
      { repoId: 12, date: '2026-06-06', stars: 117754, forks: 8879, openIssues: 2350, todayStars: 122, todayForks: 10, trendScore: 77.2, rank: 12, rankChange: 0 },
      { repoId: 12, date: '2026-06-05', stars: 117632, forks: 8869, openIssues: 2355, todayStars: 115, todayForks: 9, trendScore: 75.8, rank: 13, rankChange: -1 },
      { repoId: 12, date: '2026-06-04', stars: 117517, forks: 8860, openIssues: 2360, todayStars: 120, todayForks: 10, trendScore: 76.9, rank: 12, rankChange: 0 },
      { repoId: 12, date: '2026-06-03', stars: 117397, forks: 8850, openIssues: 2365, todayStars: 110, todayForks: 8, trendScore: 74.6, rank: 13, rankChange: -1 },
      { repoId: 12, date: '2026-06-02', stars: 117287, forks: 8842, openIssues: 2370, todayStars: 116, todayForks: 9, trendScore: 75.5, rank: 12, rankChange: 1 },
    ],
  },
  'langchain-ai/langchain': {
    repo: {
      id: 11, fullName: 'langchain-ai/langchain', owner: 'langchain-ai', ownerAvatar: 'https://avatars.githubusercontent.com/u/126732335',
      description: 'Build context-aware reasoning applications.', url: 'https://github.com/langchain-ai/langchain', stars: 98500, forks: 15200,
      openIssues: 870, language: 'Python', topics: ['llm', 'ai', 'langchain', 'agents', 'rag'],
      license: 'MIT', createdAt: '2022-10-17T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
      pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://langchain.com', defaultBranch: 'master',
    },
    snapshots: [
      { repoId: 11, date: '2026-06-08', stars: 98500, forks: 15200, openIssues: 870, todayStars: 135, todayForks: 19, trendScore: 79.8, rank: 11, rankChange: 0 },
      { repoId: 11, date: '2026-06-07', stars: 98365, forks: 15181, openIssues: 875, todayStars: 125, todayForks: 17, trendScore: 78.2, rank: 11, rankChange: 0 },
      { repoId: 11, date: '2026-06-06', stars: 98240, forks: 15164, openIssues: 880, todayStars: 130, todayForks: 18, trendScore: 79.0, rank: 11, rankChange: 1 },
      { repoId: 11, date: '2026-06-05', stars: 98110, forks: 15146, openIssues: 885, todayStars: 118, todayForks: 15, trendScore: 77.1, rank: 12, rankChange: -1 },
      { repoId: 11, date: '2026-06-04', stars: 97992, forks: 15131, openIssues: 890, todayStars: 128, todayForks: 17, trendScore: 78.5, rank: 11, rankChange: 0 },
      { repoId: 11, date: '2026-06-03', stars: 97864, forks: 15114, openIssues: 895, todayStars: 115, todayForks: 14, trendScore: 76.4, rank: 12, rankChange: 0 },
      { repoId: 11, date: '2026-06-02', stars: 97749, forks: 15100, openIssues: 900, todayStars: 122, todayForks: 16, trendScore: 77.6, rank: 12, rankChange: 1 },
    ],
  },
}

function generateFallbackSnapshots(repoId: number, currentStars: number): RepoTrendSnapshot[] {
  const snapshots: RepoTrendSnapshot[] = []
  let stars = currentStars

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dailyStars = Math.floor(Math.random() * 200) + 50

    snapshots.push({
      repoId,
      date: dateStr,
      stars: stars,
      forks: Math.floor(stars * 0.2),
      openIssues: Math.floor(stars * 0.02),
      todayStars: dailyStars,
      todayForks: Math.floor(dailyStars * 0.12),
      trendScore: Math.round((70 + Math.random() * 30) * 10) / 10,
      rank: Math.floor(Math.random() * 50) + 1,
      rankChange: Math.floor(Math.random() * 11) - 5,
    })

    stars -= dailyStars
  }

  return snapshots
}

async function fetchFromDB(
  db: D1Database,
  owner: string,
  repo: string
): Promise<RepoDetailResponse | null> {
  try {
    const fullName = `${owner}/${repo}`

    const row = await db.prepare(
      'SELECT * FROM repos WHERE full_name = ?'
    ).bind(fullName).first<Record<string, unknown>>()

    if (!row) return null

    const snapshotsResult = await db.prepare(
      `SELECT * FROM snapshots WHERE repo_id = ? ORDER BY date DESC LIMIT 30`
    ).bind(row.id).all()

    const repoData: GithubRepo = {
      id: row.id as number,
      fullName: row.full_name as string,
      owner: row.owner as string,
      ownerAvatar: row.owner_avatar as string,
      description: row.description as string,
      url: row.url as string,
      stars: row.stars as number,
      forks: row.forks as number,
      openIssues: row.open_issues as number,
      language: row.language as string,
      topics: JSON.parse((row.topics as string) || '[]'),
      license: row.license as string | null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      pushedAt: row.pushed_at as string,
      homepage: row.homepage as string | null,
      defaultBranch: row.default_branch as string,
    }

    const snapshots: RepoTrendSnapshot[] = (snapshotsResult.results || []).map((s: Record<string, unknown>) => ({
      repoId: s.repo_id as number,
      date: s.date as string,
      stars: s.stars as number,
      forks: s.forks as number,
      openIssues: s.open_issues as number,
      todayStars: s.today_stars as number,
      todayForks: s.today_forks as number,
      trendScore: s.trend_score as number,
      rank: s.rank as number,
      rankChange: s.rank_change as number,
    }))

    return { repo: repoData, snapshots }
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const params = context.params as { owner: string; repo: string }
  const owner = params.owner as string
  const repo = params.repo as string
  const fullName = `${owner}/${repo}`

  if (context.env.DB) {
    const dbResult = await fetchFromDB(context.env.DB, owner, repo)
    if (dbResult) {
      return new Response(JSON.stringify({ success: true, ...dbResult }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const mockKey = fullName.toLowerCase()
  if (MOCK_REPOS[mockKey]) {
    return new Response(JSON.stringify({ success: true, ...MOCK_REPOS[mockKey] }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const fallbackRepo: GithubRepo = {
    id: Math.floor(Math.random() * 100000),
    fullName,
    owner,
    ownerAvatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100000)}`,
    description: `Repository ${fullName}`,
    url: `https://github.com/${fullName}`,
    stars: Math.floor(Math.random() * 50000) + 1000,
    forks: Math.floor(Math.random() * 10000) + 100,
    openIssues: Math.floor(Math.random() * 500),
    language: 'TypeScript',
    topics: ['open-source'],
    license: 'MIT',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z',
    homepage: `https://github.com/${fullName}`,
    defaultBranch: 'main',
  }

  const snapshots = generateFallbackSnapshots(fallbackRepo.id, fallbackRepo.stars)

  return new Response(JSON.stringify({ success: true, repo: fallbackRepo, snapshots }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
