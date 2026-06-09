import type { SyncLog } from '../../src/types/index'

interface Env {
  DB: D1Database
  GITHUB_TOKEN?: string
  SYNC_SECRET?: string
}

function unauthorized(message: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  )
}

function badRequest(message: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  )
}

async function runBatch(db: D1Database, statements: D1PreparedStatement[], chunkSize = 100): Promise<void> {
  for (let i = 0; i < statements.length; i += chunkSize) {
    await db.batch(statements.slice(i, i + chunkSize))
  }
}

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

async function performSync(env: Env): Promise<SyncLog> {
  const startTime = Date.now()
  const syncDate = new Date().toISOString().split('T')[0]

  try {
    if (!env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN not configured')
    }

    const response = await fetch(
      'https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=100',
      {
        headers: {
          Authorization: `token ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'GitPulse-Bot',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`)
    }

    const data = await response.json() as { items: Array<Record<string, unknown>> }
    const repos = data.items || []

    if (env.DB) {
      const repoRows = repos.map((repo, index) => {
        const fullName = repo.full_name as string
        const [owner, name] = fullName.split('/')
        const repoId = repo.id as number
        const stars = (repo.stargazers_count as number) || 0
        const forks = (repo.forks_count as number) || 0
        const openIssues = (repo.open_issues_count as number) || 0
        const topics = Array.isArray(repo.topics) ? repo.topics as string[] : []

        return {
          repo,
          repoId,
          fullName,
          owner,
          name,
          stars,
          forks,
          openIssues,
          topics,
          rank: index + 1,
        }
      })

      const previousByRepoId = new Map<number, { stars: number; forks: number; rank: number }>()
      for (const repoChunk of chunkArray(repoRows, 50)) {
        const placeholders = repoChunk.map(() => '?').join(',')
        const previousSnapshots = await env.DB.prepare(
          `SELECT s.repo_id, s.stars, s.forks, s.rank
           FROM snapshots s
           JOIN (
             SELECT repo_id, MAX(date) AS date
             FROM snapshots
             WHERE repo_id IN (${placeholders}) AND date < ?
             GROUP BY repo_id
           ) latest ON s.repo_id = latest.repo_id AND s.date = latest.date`
        ).bind(...repoChunk.map(row => row.repoId), syncDate).all<{
          repo_id: number
          stars: number
          forks: number
          rank: number
        }>()

        for (const snapshot of previousSnapshots.results || []) {
          previousByRepoId.set(snapshot.repo_id, {
            stars: snapshot.stars,
            forks: snapshot.forks,
            rank: snapshot.rank,
          })
        }
      }

      const statements: D1PreparedStatement[] = []
      const topicStatements: D1PreparedStatement[] = []

      for (const row of repoRows) {
        const previousSnapshot = previousByRepoId.get(row.repoId)

        const todayStars = previousSnapshot ? Math.max(0, row.stars - previousSnapshot.stars) : 0
        const todayForks = previousSnapshot ? Math.max(0, row.forks - previousSnapshot.forks) : 0
        const rankChange = previousSnapshot ? previousSnapshot.rank - row.rank : 0
        const trendScore = todayStars * 2 + todayForks + Math.max(0, rankChange) * 5

        statements.push(env.DB.prepare(
          `INSERT INTO repos (id, full_name, owner, name, owner_avatar, description, url, stars, forks, open_issues, language, topics, license, created_at, updated_at, pushed_at, homepage, default_branch)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(full_name) DO UPDATE SET
             id = excluded.id,
             stars = excluded.stars,
             forks = excluded.forks,
             open_issues = excluded.open_issues,
             updated_at = excluded.updated_at,
             pushed_at = excluded.pushed_at,
             topics = excluded.topics,
             homepage = excluded.homepage,
             default_branch = excluded.default_branch`
        ).bind(
          row.repoId,
          row.fullName,
          row.owner,
          row.name,
          (row.repo.owner as Record<string, string>)?.avatar_url || '',
          row.repo.description || '',
          row.repo.html_url || '',
          row.stars,
          row.forks,
          row.openIssues,
          row.repo.language || '',
          JSON.stringify(row.topics),
          (row.repo.license as Record<string, string>)?.spdx_id || null,
          row.repo.created_at || '',
          row.repo.updated_at || '',
          row.repo.pushed_at || '',
          row.repo.homepage || null,
          row.repo.default_branch || 'main',
        ))

        statements.push(env.DB.prepare(
          `INSERT INTO snapshots (repo_id, date, stars, forks, open_issues, today_stars, today_forks, trend_score, rank, rank_change)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(repo_id, date) DO UPDATE SET
             stars = excluded.stars,
             forks = excluded.forks,
             open_issues = excluded.open_issues,
             today_stars = excluded.today_stars,
             today_forks = excluded.today_forks,
             trend_score = excluded.trend_score,
             rank = excluded.rank,
             rank_change = excluded.rank_change`
        ).bind(
          row.repoId,
          syncDate,
          row.stars,
          row.forks,
          row.openIssues,
          todayStars,
          todayForks,
          trendScore,
          row.rank,
          rankChange,
        ))

        for (const topic of row.topics) {
          topicStatements.push(env.DB.prepare(
            `INSERT OR IGNORE INTO repo_topics (repo_id, topic) VALUES (?, ?)`
          ).bind(row.repoId, topic))
        }
      }

      await runBatch(env.DB, statements)

      for (const repoChunk of chunkArray(repoRows, 50)) {
        const placeholders = repoChunk.map(() => '?').join(',')
        await env.DB.prepare(
          `DELETE FROM repo_topics WHERE repo_id IN (${placeholders})`
        ).bind(...repoChunk.map(row => row.repoId)).run()
      }

      await runBatch(env.DB, topicStatements)

      await env.DB.prepare(
        `INSERT INTO sync_logs (sync_date, status, total_repos, message, duration)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(
        syncDate,
        'success',
        repos.length,
        `Synced ${repos.length} repos successfully`,
        Date.now() - startTime
      ).run()
    }

    return {
      id: Date.now(),
      syncDate,
      status: 'success',
      totalRepos: repos.length,
      message: `Synced ${repos.length} repos from GitHub`,
      duration: Date.now() - startTime,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during sync'

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO sync_logs (sync_date, status, total_repos, message, duration)
           VALUES (?, ?, ?, ?, ?)`
        ).bind(syncDate, 'failed', 0, message, Date.now() - startTime).run()
      } catch {
        // Ignore DB logging errors
      }
    }

    return {
      id: Date.now(),
      syncDate,
      status: 'failed',
      totalRepos: 0,
      message,
      duration: Date.now() - startTime,
    }
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return badRequest('Only POST method is allowed')
  }

  const authHeader = context.request.headers.get('Authorization')
  if (!authHeader) {
    return unauthorized('Missing Authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  const validToken = context.env.SYNC_SECRET || 'gitpulse-sync-secret'

  if (token !== validToken) {
    return unauthorized('Invalid authorization token')
  }

  const syncLog = await performSync(context.env)

  const status = syncLog.status === 'success' ? 200 : 500

  return new Response(
    JSON.stringify({ success: syncLog.status === 'success', data: syncLog }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}
