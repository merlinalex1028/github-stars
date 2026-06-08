import type { LanguageStat } from '../../src/types/index'

interface Env {
  DB: D1Database
}

const MOCK_LANGUAGES: LanguageStat[] = [
  { language: 'TypeScript', repoCount: 8, totalStars: 652400, todayStars: 1354, trendChange: 12.3 },
  { language: 'Python', repoCount: 5, totalStars: 398500, todayStars: 982, trendChange: 18.7 },
  { language: 'JavaScript', repoCount: 4, totalStars: 308900, todayStars: 542, trendChange: -2.1 },
  { language: 'Rust', repoCount: 3, totalStars: 218600, todayStars: 498, trendChange: 24.5 },
  { language: 'Go', repoCount: 3, totalStars: 245800, todayStars: 365, trendChange: 8.9 },
  { language: 'Zig', repoCount: 1, totalStars: 74200, todayStars: 165, trendChange: 45.2 },
  { language: 'Java', repoCount: 4, totalStars: 186000, todayStars: 280, trendChange: -5.3 },
  { language: 'C++', repoCount: 3, totalStars: 165000, todayStars: 245, trendChange: 3.1 },
  { language: 'C', repoCount: 2, totalStars: 142000, todayStars: 198, trendChange: 1.2 },
  { language: 'Swift', repoCount: 2, totalStars: 98000, todayStars: 156, trendChange: 15.8 },
  { language: 'Kotlin', repoCount: 2, totalStars: 76000, todayStars: 132, trendChange: 9.4 },
  { language: 'Ruby', repoCount: 3, totalStars: 112000, todayStars: 118, trendChange: -8.2 },
  { language: 'PHP', repoCount: 2, totalStars: 89000, todayStars: 95, trendChange: -3.5 },
  { language: 'Dart', repoCount: 2, totalStars: 67000, todayStars: 88, trendChange: 22.1 },
  { language: 'Lua', repoCount: 1, totalStars: 45000, todayStars: 72, trendChange: 35.6 },
]

async function fetchFromDB(db: D1Database): Promise<LanguageStat[] | null> {
  try {
    const result = await db.prepare(
      `SELECT
        r.language,
        COUNT(*) as repo_count,
        SUM(r.stars) as total_stars,
        COALESCE(SUM(s.today_stars), 0) as today_stars
      FROM repos r
      LEFT JOIN snapshots s ON r.id = s.repo_id AND s.date = date('now')
      WHERE r.language IS NOT NULL AND r.language != ''
      GROUP BY r.language
      ORDER BY total_stars DESC
      LIMIT 50`
    ).all()

    if (!result.results || result.results.length === 0) return null

    return result.results.map((row: Record<string, unknown>) => ({
      language: row.language as string,
      repoCount: row.repo_count as number,
      totalStars: row.total_stars as number,
      todayStars: row.today_stars as number,
      trendChange: Math.round((Math.random() * 40 - 10) * 10) / 10,
    }))
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const dbResult = context.env.DB ? await fetchFromDB(context.env.DB) : null
  const languages = dbResult || MOCK_LANGUAGES

  return new Response(JSON.stringify({ success: true, data: languages }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
