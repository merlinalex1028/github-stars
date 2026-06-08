import type {
  RepoWithTrend,
  PaginatedResponse,
  TimeRange,
  SortBy,
} from '../../src/types/index'

interface Env {
  DB: D1Database
}

const MOCK_REPOS: RepoWithTrend[] = [
  {
    id: 1, fullName: 'vercel/next.js', owner: 'vercel', ownerAvatar: 'https://avatars.githubusercontent.com/u/14985020',
    description: 'The React Framework', url: 'https://github.com/vercel/next.js', stars: 128900, forks: 27400,
    openIssues: 2840, language: 'TypeScript', topics: ['react', 'framework', 'nextjs', 'ssr', 'jamstack'],
    license: 'MIT', createdAt: '2016-10-05T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://nextjs.org', defaultBranch: 'canary',
    todayStars: 342, todayForks: 48, trendScore: 98.5, rank: 1, rankChange: 0,
  },
  {
    id: 2, fullName: 'facebook/react', owner: 'facebook', ownerAvatar: 'https://avatars.githubusercontent.com/u/69631',
    description: 'The library for web and native user interfaces.', url: 'https://github.com/facebook/react', stars: 232000, forks: 47500,
    openIssues: 1120, language: 'JavaScript', topics: ['javascript', 'react', 'frontend', 'ui'],
    license: 'MIT', createdAt: '2013-05-24T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://react.dev', defaultBranch: 'main',
    todayStars: 287, todayForks: 35, trendScore: 96.2, rank: 2, rankChange: 1,
  },
  {
    id: 3, fullName: 'denoland/deno', owner: 'denoland', ownerAvatar: 'https://avatars.githubusercontent.com/u/44010072',
    description: 'A modern runtime for JavaScript and TypeScript.', url: 'https://github.com/denoland/deno', stars: 98700, forks: 5400,
    openIssues: 1890, language: 'Rust', topics: ['javascript', 'typescript', 'runtime', 'deno', 'v8'],
    license: 'MIT', createdAt: '2018-05-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://deno.com', defaultBranch: 'main',
    todayStars: 256, todayForks: 22, trendScore: 94.1, rank: 3, rankChange: -1,
  },
  {
    id: 4, fullName: 'sveltejs/svelte', owner: 'sveltejs', ownerAvatar: 'https://avatars.githubusercontent.com/u/23617963',
    description: 'Cybernetically enhanced web apps', url: 'https://github.com/sveltejs/svelte', stars: 81200, forks: 4300,
    openIssues: 980, language: 'TypeScript', topics: ['javascript', 'framework', 'svelte', 'compiler'],
    license: 'MIT', createdAt: '2016-11-20T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://svelte.dev', defaultBranch: 'main',
    todayStars: 231, todayForks: 18, trendScore: 91.8, rank: 4, rankChange: 2,
  },
  {
    id: 5, fullName: 'astro-community/astro', owner: 'astro-community', ownerAvatar: 'https://avatars.githubusercontent.com/u/74661398',
    description: 'The web framework for content-driven websites.', url: 'https://github.com/withastro/astro', stars: 47800, forks: 2500,
    openIssues: 620, language: 'TypeScript', topics: ['astro', 'framework', 'static-site', 'ssr', 'islands'],
    license: 'MIT', createdAt: '2021-03-15T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://astro.build', defaultBranch: 'main',
    todayStars: 198, todayForks: 14, trendScore: 89.3, rank: 5, rankChange: 3,
  },
  {
    id: 6, fullName: 'tailwindlabs/tailwindcss', owner: 'tailwindlabs', ownerAvatar: 'https://avatars.githubusercontent.com/u/67109815',
    description: 'A utility-first CSS framework for rapid UI development.', url: 'https://github.com/tailwindlabs/tailwindcss', stars: 84500, forks: 4300,
    openIssues: 340, language: 'TypeScript', topics: ['css', 'tailwindcss', 'framework', 'design-system'],
    license: 'MIT', createdAt: '2017-10-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://tailwindcss.com', defaultBranch: 'next',
    todayStars: 185, todayForks: 12, trendScore: 87.6, rank: 6, rankChange: -1,
  },
  {
    id: 7, fullName: 'shadcn-ui/ui', owner: 'shadcn-ui', ownerAvatar: 'https://avatars.githubusercontent.com/u/139895814',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', url: 'https://github.com/shadcn-ui/ui', stars: 76300, forks: 4800,
    openIssues: 890, language: 'TypeScript', topics: ['react', 'ui', 'tailwindcss', 'radix', 'components'],
    license: 'MIT', createdAt: '2023-01-04T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://ui.shadcn.com', defaultBranch: 'main',
    todayStars: 178, todayForks: 20, trendScore: 85.9, rank: 7, rankChange: 0,
  },
  {
    id: 8, fullName: 'oven-sh/bun', owner: 'oven-sh', ownerAvatar: 'https://avatars.githubusercontent.com/u/108928989',
    description: 'Incredibly fast JavaScript runtime, bundler, test runner, and package manager.', url: 'https://github.com/oven-sh/bun', stars: 74200, forks: 2700,
    openIssues: 2100, language: 'Zig', topics: ['javascript', 'runtime', 'bundler', 'typescript', 'zig'],
    license: 'MIT', createdAt: '2021-03-12T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://bun.sh', defaultBranch: 'main',
    todayStars: 165, todayForks: 16, trendScore: 84.2, rank: 8, rankChange: 1,
  },
  {
    id: 9, fullName: 'biomejs/biome', owner: 'biomejs', ownerAvatar: 'https://avatars.githubusercontent.com/u/132139830',
    description: 'A toolchain for web projects, aimed to provide functionalities to maintain them.', url: 'https://github.com/biomejs/biome', stars: 18900, forks: 620,
    openIssues: 430, language: 'Rust', topics: ['linter', 'formatter', 'javascript', 'typescript', 'rust'],
    license: 'MIT', createdAt: '2023-08-28T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://biomejs.dev', defaultBranch: 'main',
    todayStars: 152, todayForks: 8, trendScore: 82.7, rank: 9, rankChange: 4,
  },
  {
    id: 10, fullName: 'huggingface/transformers', owner: 'huggingface', ownerAvatar: 'https://avatars.githubusercontent.com/u/25413848',
    description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.', url: 'https://github.com/huggingface/transformers', stars: 142000, forks: 28300,
    openIssues: 1560, language: 'Python', topics: ['machine-learning', 'deep-learning', 'nlp', 'pytorch', 'transformers'],
    license: 'Apache-2.0', createdAt: '2018-10-29T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://huggingface.co', defaultBranch: 'main',
    todayStars: 148, todayForks: 24, trendScore: 81.3, rank: 10, rankChange: -2,
  },
  {
    id: 11, fullName: 'langchain-ai/langchain', owner: 'langchain-ai', ownerAvatar: 'https://avatars.githubusercontent.com/u/126732335',
    description: 'Build context-aware reasoning applications.', url: 'https://github.com/langchain-ai/langchain', stars: 98500, forks: 15200,
    openIssues: 870, language: 'Python', topics: ['llm', 'ai', 'langchain', 'agents', 'rag'],
    license: 'MIT', createdAt: '2022-10-17T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://langchain.com', defaultBranch: 'master',
    todayStars: 135, todayForks: 19, trendScore: 79.8, rank: 11, rankChange: 0,
  },
  {
    id: 12, fullName: 'ollama/ollama', owner: 'ollama', ownerAvatar: 'https://avatars.githubusercontent.com/u/151674099',
    description: 'Get up and running with large language models locally.', url: 'https://github.com/ollama/ollama', stars: 118000, forks: 8900,
    openIssues: 2340, language: 'Go', topics: ['llm', 'ai', 'local', 'ollama', 'go'],
    license: 'MIT', createdAt: '2023-06-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://ollama.com', defaultBranch: 'main',
    todayStars: 128, todayForks: 11, trendScore: 78.1, rank: 12, rankChange: -1,
  },
  {
    id: 13, fullName: 'vuejs/core', owner: 'vuejs', ownerAvatar: 'https://avatars.githubusercontent.com/u/6128107',
    description: 'Vue.js is a progressive JavaScript framework for building UI on the web.', url: 'https://github.com/vuejs/core', stars: 48900, forks: 8500,
    openIssues: 680, language: 'TypeScript', topics: ['vue', 'javascript', 'framework', 'typescript'],
    license: 'MIT', createdAt: '2018-09-30T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://vuejs.org', defaultBranch: 'main',
    todayStars: 118, todayForks: 14, trendScore: 76.5, rank: 13, rankChange: 1,
  },
  {
    id: 14, fullName: 'microsoft/TypeScript', owner: 'microsoft', ownerAvatar: 'https://avatars.githubusercontent.com/u/6154722',
    description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.', url: 'https://github.com/microsoft/TypeScript', stars: 101000, forks: 12400,
    openIssues: 5780, language: 'TypeScript', topics: ['typescript', 'javascript', 'compiler', 'language'],
    license: 'Apache-2.0', createdAt: '2014-10-05T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://www.typescriptlang.org', defaultBranch: 'main',
    todayStars: 112, todayForks: 10, trendScore: 75.2, rank: 14, rankChange: -1,
  },
  {
    id: 15, fullName: 'vitejs/vite', owner: 'vitejs', ownerAvatar: 'https://avatars.githubusercontent.com/u/65625612',
    description: 'Next generation frontend tooling.', url: 'https://github.com/vitejs/vite', stars: 70100, forks: 6300,
    openIssues: 480, language: 'TypeScript', topics: ['vite', 'bundler', 'dev-server', 'esm'],
    license: 'MIT', createdAt: '2020-04-20T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://vitejs.dev', defaultBranch: 'main',
    todayStars: 105, todayForks: 9, trendScore: 73.8, rank: 15, rankChange: 0,
  },
  {
    id: 16, fullName: 'rust-lang/rust', owner: 'rust-lang', ownerAvatar: 'https://avatars.githubusercontent.com/u/54301289',
    description: 'Empowering everyone to build reliable and efficient software.', url: 'https://github.com/rust-lang/rust', stars: 101000, forks: 13100,
    openIssues: 9800, language: 'Rust', topics: ['rust', 'language', 'compiler', 'systems'],
    license: 'MIT', createdAt: '2010-06-18T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://www.rust-lang.org', defaultBranch: 'master',
    todayStars: 98, todayForks: 8, trendScore: 72.1, rank: 16, rankChange: 2,
  },
  {
    id: 17, fullName: 'golang/go', owner: 'golang', ownerAvatar: 'https://avatars.githubusercontent.com/u/4314092',
    description: 'The Go programming language.', url: 'https://github.com/golang/go', stars: 125000, forks: 17800,
    openIssues: 8700, language: 'Go', topics: ['go', 'language', 'compiler', 'systems'],
    license: 'BSD-3-Clause', createdAt: '2014-08-19T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://go.dev', defaultBranch: 'master',
    todayStars: 92, todayForks: 7, trendScore: 70.5, rank: 17, rankChange: -1,
  },
  {
    id: 18, fullName: 'anthropics/claude-code', owner: 'anthropics', ownerAvatar: 'https://avatars.githubusercontent.com/u/76263028',
    description: 'Claude Code is an agentic coding tool that lives in your terminal.', url: 'https://github.com/anthropics/claude-code', stars: 34200, forks: 1800,
    openIssues: 560, language: 'TypeScript', topics: ['ai', 'cli', 'coding-agent', 'claude', 'terminal'],
    license: 'Apache-2.0', createdAt: '2025-02-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://docs.anthropic.com', defaultBranch: 'main',
    todayStars: 88, todayForks: 6, trendScore: 68.9, rank: 18, rankChange: 5,
  },
  {
    id: 19, fullName: 'microsoft/vscode', owner: 'microsoft', ownerAvatar: 'https://avatars.githubusercontent.com/u/6154722',
    description: 'Visual Studio Code', url: 'https://github.com/microsoft/vscode', stars: 165000, forks: 28700,
    openIssues: 6200, language: 'TypeScript', topics: ['editor', 'vscode', 'typescript', 'electron'],
    license: 'MIT', createdAt: '2015-09-03T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://code.visualstudio.com', defaultBranch: 'main',
    todayStars: 82, todayForks: 12, trendScore: 67.3, rank: 19, rankChange: -2,
  },
  {
    id: 20, fullName: 'supabase/supabase', owner: 'supabase', ownerAvatar: 'https://avatars.githubusercontent.com/u/54469796',
    description: 'The open source Firebase alternative.', url: 'https://github.com/supabase/supabase', stars: 76800, forks: 7200,
    openIssues: 420, language: 'TypeScript', topics: ['firebase', 'supabase', 'postgres', 'auth', 'realtime'],
    license: 'Apache-2.0', createdAt: '2020-01-08T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://supabase.com', defaultBranch: 'master',
    todayStars: 76, todayForks: 8, trendScore: 65.8, rank: 20, rankChange: 0,
  },
  {
    id: 21, fullName: 'drizzle-team/drizzle-orm', owner: 'drizzle-team', ownerAvatar: 'https://avatars.githubusercontent.com/u/108969103',
    description: 'Headless TypeScript ORM with a head.', url: 'https://github.com/drizzle-team/drizzle-orm', stars: 26800, forks: 680,
    openIssues: 890, language: 'TypeScript', topics: ['orm', 'typescript', 'sql', 'postgres', 'database'],
    license: 'Apache-2.0', createdAt: '2022-08-01T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://orm.drizzle.team', defaultBranch: 'main',
    todayStars: 72, todayForks: 5, trendScore: 64.1, rank: 21, rankChange: 3,
  },
  {
    id: 22, fullName: 'prisma/prisma', owner: 'prisma', ownerAvatar: 'https://avatars.githubusercontent.com/u/17219288',
    description: 'Next-generation ORM for Node.js and TypeScript.', url: 'https://github.com/prisma/prisma', stars: 40200, forks: 1500,
    openIssues: 2100, language: 'TypeScript', topics: ['orm', 'typescript', 'prisma', 'database', 'graphql'],
    license: 'Apache-2.0', createdAt: '2019-06-12T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://www.prisma.io', defaultBranch: 'main',
    todayStars: 65, todayForks: 7, trendScore: 62.4, rank: 22, rankChange: -1,
  },
  {
    id: 23, fullName: 'tanstack/router', owner: 'tanstack', ownerAvatar: 'https://avatars.githubusercontent.com/u/72518612',
    description: 'Type-safe router with built-in caching & URL state management for React, Solid, Vue & Vanilla JS.', url: 'https://github.com/TanStack/router', stars: 9800, forks: 520,
    openIssues: 340, language: 'TypeScript', topics: ['react', 'router', 'typescript', 'spa'],
    license: 'MIT', createdAt: '2022-01-15T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://tanstack.com/router', defaultBranch: 'main',
    todayStars: 58, todayForks: 4, trendScore: 60.7, rank: 23, rankChange: 6,
  },
  {
    id: 24, fullName: 'elysiajs/elysia', owner: 'elysiajs', ownerAvatar: 'https://avatars.githubusercontent.com/u/112216035',
    description: 'Ergonomic web framework for building anime waifu server.', url: 'https://github.com/elysiajs/elysia', stars: 12400, forks: 320,
    openIssues: 210, language: 'TypeScript', topics: ['bun', 'typescript', 'web-framework', 'elysia'],
    license: 'MIT', createdAt: '2023-01-15T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-07T00:00:00Z', homepage: 'https://elysiajs.com', defaultBranch: 'main',
    todayStars: 52, todayForks: 3, trendScore: 58.9, rank: 24, rankChange: 2,
  },
  {
    id: 25, fullName: 'cloudflare/workers-sdk', owner: 'cloudflare', ownerAvatar: 'https://avatars.githubusercontent.com/u/314135',
    description: 'Cloudflare Workers CLI and tooling.', url: 'https://github.com/cloudflare/workers-sdk', stars: 2800, forks: 450,
    openIssues: 580, language: 'TypeScript', topics: ['cloudflare', 'workers', 'edge', 'serverless'],
    license: 'MIT', createdAt: '2022-03-15T00:00:00Z', updatedAt: '2026-06-08T00:00:00Z',
    pushedAt: '2026-06-08T00:00:00Z', homepage: 'https://developers.cloudflare.com/workers', defaultBranch: 'main',
    todayStars: 45, todayForks: 3, trendScore: 57.2, rank: 25, rankChange: 1,
  },
]

function getRangeMultiplier(range: string): number {
  switch (range) {
    case 'weekly': return 7
    case 'monthly': return 30
    default: return 1
  }
}

function filterAndSort(
  repos: RepoWithTrend[],
  params: {
    range?: string
    language?: string
    topic?: string
    search?: string
    sortBy?: string
  }
): RepoWithTrend[] {
  let filtered = [...repos]

  if (params.language) {
    const lang = params.language.toLowerCase()
    filtered = filtered.filter(r => r.language.toLowerCase() === lang)
  }

  if (params.topic) {
    const topic = params.topic.toLowerCase()
    filtered = filtered.filter(r => r.topics.some(t => t.toLowerCase() === topic))
  }

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(r =>
      r.fullName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    )
  }

  const rangeMultiplier = getRangeMultiplier(params.range || 'today')

  const sortBy = params.sortBy || 'trend_score'
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'today_stars':
        return (b.todayStars * rangeMultiplier) - (a.todayStars * rangeMultiplier)
      case 'stars':
        return b.stars - a.stars
      case 'forks':
        return b.forks - a.forks
      case 'pushed_at':
        return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
      case 'created_at':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'trend_score':
      default:
        return b.trendScore - a.trendScore
    }
  })

  return filtered.map(repo => ({
    ...repo,
    todayStars: Math.round(repo.todayStars * rangeMultiplier),
    todayForks: Math.round(repo.todayForks * rangeMultiplier),
    trendScore: Math.round(repo.trendScore * (rangeMultiplier === 1 ? 1 : rangeMultiplier === 7 ? 0.95 : 0.88) * 10) / 10,
  }))
}

async function fetchFromDB(db: D1Database, params: URLSearchParams): Promise<PaginatedResponse<RepoWithTrend> | null> {
  try {
    const page = Math.max(1, parseInt(params.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get('pageSize') || '20', 10)))
    const range = params.get('range') || 'today'
    const language = params.get('language')
    const topic = params.get('topic')
    const search = params.get('search')
    const sortBy = params.get('sortBy') || 'trend_score'

    let whereClause = 'WHERE 1=1'
    const bindings: unknown[] = []

    if (language) {
      whereClause += ' AND r.language = ?'
      bindings.push(language)
    }

    if (topic) {
      whereClause += ' AND EXISTS (SELECT 1 FROM repo_topics rt WHERE rt.repo_id = r.id AND rt.topic = ?)'
      bindings.push(topic)
    }

    if (search) {
      whereClause += ' AND (r.full_name LIKE ? OR r.description LIKE ?)'
      const q = `%${search}%`
      bindings.push(q, q)
    }

    const dateStr = new Date().toISOString().split('T')[0]

    let orderClause: string
    switch (sortBy) {
      case 'today_stars': orderClause = 's.today_stars DESC'; break
      case 'stars': orderClause = 'r.stars DESC'; break
      case 'forks': orderClause = 'r.forks DESC'; break
      case 'pushed_at': orderClause = 'r.pushed_at DESC'; break
      case 'created_at': orderClause = 'r.created_at DESC'; break
      default: orderClause = 's.trend_score DESC'
    }

    const countResult = await db.prepare(
      `SELECT COUNT(*) as total FROM repos r ${whereClause}`
    ).bind(...bindings).first<{ total: number }>()

    const total = countResult?.total || 0

    const offset = (page - 1) * pageSize
    const rows = await db.prepare(
      `SELECT r.*, s.today_stars, s.today_forks, s.trend_score, s.rank, s.rank_change
       FROM repos r
       LEFT JOIN snapshots s ON r.id = s.repo_id AND s.date = ?
       ${whereClause}
       ORDER BY ${orderClause}
       LIMIT ? OFFSET ?`
    ).bind(dateStr, ...bindings, pageSize, offset).all()

    if (!rows.results || rows.results.length === 0) {
      return null
    }

    const data: RepoWithTrend[] = rows.results.map((row: Record<string, unknown>) => ({
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
      todayStars: (row.today_stars as number) || 0,
      todayForks: (row.today_forks as number) || 0,
      trendScore: (row.trend_score as number) || 0,
      rank: (row.rank as number) || 0,
      rankChange: (row.rank_change as number) || 0,
    }))

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const params = url.searchParams

  const page = Math.max(1, parseInt(params.get('page') || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(params.get('pageSize') || '20', 10)))
  const range = params.get('range') || 'today'
  const language = params.get('language')
  const topic = params.get('topic')
  const search = params.get('search')
  const sortBy = params.get('sortBy') || 'trend_score'

  const dbResult = context.env.DB ? await fetchFromDB(context.env.DB, params) : null

  if (dbResult) {
    return new Response(JSON.stringify({ success: true, ...dbResult }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const filtered = filterAndSort(MOCK_REPOS, { range, language, topic, search, sortBy })
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  const response: PaginatedResponse<RepoWithTrend> = {
    data,
    total,
    page,
    pageSize,
    totalPages,
  }

  return new Response(JSON.stringify({ success: true, ...response }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
