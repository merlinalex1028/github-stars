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
      for (const [index, repo] of repos.entries()) {
        const fullName = repo.full_name as string
        const [owner, name] = fullName.split('/')
        const repoId = repo.id as number
        const stars = (repo.stargazers_count as number) || 0
        const forks = (repo.forks_count as number) || 0
        const openIssues = (repo.open_issues_count as number) || 0
        const topics = Array.isArray(repo.topics) ? repo.topics as string[] : []

        const previousSnapshot = await env.DB.prepare(
          `SELECT stars, forks, rank
           FROM snapshots
           WHERE repo_id = ? AND date < ?
           ORDER BY date DESC
           LIMIT 1`
        ).bind(repoId, syncDate).first<{
          stars: number
          forks: number
          rank: number
        }>()

        const todayStars = previousSnapshot ? Math.max(0, stars - previousSnapshot.stars) : 0
        const todayForks = previousSnapshot ? Math.max(0, forks - previousSnapshot.forks) : 0
        const rank = index + 1
        const rankChange = previousSnapshot ? previousSnapshot.rank - rank : 0
        const trendScore = todayStars * 2 + todayForks + Math.max(0, rankChange) * 5

        await env.DB.prepare(
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
          repoId,
          fullName,
          owner,
          name,
          (repo.owner as Record<string, string>)?.avatar_url || '',
          repo.description || '',
          repo.html_url || '',
          stars,
          forks,
          openIssues,
          repo.language || '',
          JSON.stringify(topics),
          (repo.license as Record<string, string>)?.spdx_id || null,
          repo.created_at || '',
          repo.updated_at || '',
          repo.pushed_at || '',
          repo.homepage || null,
          repo.default_branch || 'main',
        ).run()

        await env.DB.prepare(
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
          repoId,
          syncDate,
          stars,
          forks,
          openIssues,
          todayStars,
          todayForks,
          trendScore,
          rank,
          rankChange,
        ).run()

        await env.DB.prepare('DELETE FROM repo_topics WHERE repo_id = ?').bind(repoId).run()
        for (const topic of topics) {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO repo_topics (repo_id, topic) VALUES (?, ?)`
          ).bind(repoId, topic).run()
        }
      }

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
