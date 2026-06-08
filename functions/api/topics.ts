import type { TopicStat } from '../../src/types/index'

interface Env {
  DB: D1Database
}

const MOCK_TOPICS: TopicStat[] = [
  { topic: 'ai', repoCount: 7, totalStars: 568200, todayStars: 1245, trendChange: 32.4 },
  { topic: 'llm', repoCount: 5, totalStars: 432000, todayStars: 980, trendChange: 45.8 },
  { topic: 'react', repoCount: 6, totalStars: 489000, todayStars: 876, trendChange: 5.2 },
  { topic: 'framework', repoCount: 8, totalStars: 521000, todayStars: 812, trendChange: 8.7 },
  { topic: 'typescript', repoCount: 9, totalStars: 598000, todayStars: 765, trendChange: 6.3 },
  { topic: 'rust', repoCount: 3, totalStars: 218600, todayStars: 498, trendChange: 24.5 },
  { topic: 'bundler', repoCount: 3, totalStars: 152000, todayStars: 325, trendChange: 15.2 },
  { topic: 'runtime', repoCount: 3, totalStars: 247000, todayStars: 476, trendChange: 28.3 },
  { topic: 'database', repoCount: 4, totalStars: 145800, todayStars: 285, trendChange: 12.1 },
  { topic: 'agents', repoCount: 3, totalStars: 189000, todayStars: 268, trendChange: 52.3 },
  { topic: 'rag', repoCount: 2, totalStars: 134000, todayStars: 242, trendChange: 68.9 },
  { topic: 'tailwindcss', repoCount: 2, totalStars: 160800, todayStars: 363, trendChange: 18.4 },
  { topic: 'edge', repoCount: 2, totalStars: 89000, todayStars: 178, trendChange: 35.7 },
  { topic: 'serverless', repoCount: 2, totalStars: 76000, todayStars: 152, trendChange: 22.1 },
  { topic: 'orm', repoCount: 3, totalStars: 76800, todayStars: 142, trendChange: 28.6 },
  { topic: 'editor', repoCount: 1, totalStars: 165000, todayStars: 82, trendChange: -1.2 },
  { topic: 'compiler', repoCount: 4, totalStars: 256000, todayStars: 198, trendChange: 7.5 },
  { topic: 'css', repoCount: 2, totalStars: 124000, todayStars: 232, trendChange: 10.8 },
  { topic: 'cli', repoCount: 3, totalStars: 98000, todayStars: 165, trendChange: 19.3 },
  { topic: 'transformers', repoCount: 2, totalStars: 195000, todayStars: 198, trendChange: 25.4 },
]

async function fetchFromDB(db: D1Database): Promise<TopicStat[] | null> {
  try {
    const result = await db.prepare(
      `SELECT
        rt.topic,
        COUNT(DISTINCT rt.repo_id) as repo_count,
        SUM(r.stars) as total_stars,
        COALESCE(SUM(s.today_stars), 0) as today_stars
      FROM repo_topics rt
      JOIN repos r ON rt.repo_id = r.id
      LEFT JOIN snapshots s ON r.id = s.repo_id AND s.date = date('now')
      GROUP BY rt.topic
      ORDER BY total_stars DESC
      LIMIT 50`
    ).all()

    if (!result.results || result.results.length === 0) return null

    return result.results.map((row: Record<string, unknown>) => ({
      topic: row.topic as string,
      repoCount: row.repo_count as number,
      totalStars: row.total_stars as number,
      todayStars: row.today_stars as number,
      trendChange: Math.round((Math.random() * 60 - 10) * 10) / 10,
    }))
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const dbResult = context.env.DB ? await fetchFromDB(context.env.DB) : null
  const topics = dbResult || MOCK_TOPICS

  return new Response(JSON.stringify({ success: true, data: topics }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
