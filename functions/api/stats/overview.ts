import type { StatsOverview } from '../../../src/types/index'

interface Env {
  DB: D1Database
}

const MOCK_OVERVIEW: StatsOverview = {
  totalRepos: 25,
  todayStars: 3847,
  languageCount: 15,
  aiProjectCount: 7,
  topTopic: 'ai',
  topLanguage: 'TypeScript',
}

async function fetchFromDB(db: D1Database): Promise<StatsOverview | null> {
  try {
    const totalRepos = await db.prepare(
      'SELECT COUNT(*) as count FROM repos'
    ).first<{ count: number }>()

    const todayStars = await db.prepare(
      `SELECT COALESCE(SUM(today_stars), 0) as total FROM snapshots WHERE date = date('now')`
    ).first<{ total: number }>()

    const languageCount = await db.prepare(
      'SELECT COUNT(DISTINCT language) as count FROM repos WHERE language IS NOT NULL AND language != \'\''
    ).first<{ count: number }>()

    const aiProjectCount = await db.prepare(
      `SELECT COUNT(DISTINCT rt.repo_id) as count FROM repo_topics rt WHERE rt.topic IN ('ai', 'llm', 'machine-learning', 'deep-learning', 'agents')`
    ).first<{ count: number }>()

    const topTopic = await db.prepare(
      `SELECT rt.topic FROM repo_topics rt JOIN repos r ON rt.repo_id = r.id GROUP BY rt.topic ORDER BY SUM(r.stars) DESC LIMIT 1`
    ).first<{ topic: string }>()

    const topLanguage = await db.prepare(
      `SELECT language FROM repos WHERE language IS NOT NULL GROUP BY language ORDER BY SUM(stars) DESC LIMIT 1`
    ).first<{ language: string }>()

    if (!totalRepos) return null

    return {
      totalRepos: totalRepos.count,
      todayStars: todayStars?.total || 0,
      languageCount: languageCount?.count || 0,
      aiProjectCount: aiProjectCount?.count || 0,
      topTopic: topTopic?.topic || 'ai',
      topLanguage: topLanguage?.language || 'TypeScript',
    }
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const dbResult = context.env.DB ? await fetchFromDB(context.env.DB) : null
  const overview = dbResult || MOCK_OVERVIEW

  return new Response(JSON.stringify({ success: true, data: overview }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
