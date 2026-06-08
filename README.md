# GitPulse

A real-time GitHub trending repository dashboard that tracks star growth, fork activity, and trend scores across the most popular open-source projects. Built with a modern frontend stack and deployed entirely on Cloudflare's free tier.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3, TypeScript, Vite |
| State Management | Pinia |
| Charts | ECharts + vue-echarts |
| Styling | SCSS |
| Backend | Cloudflare Pages Functions (Workers) |
| Database | Cloudflare D1 (SQLite at the edge) |
| Hosting | Cloudflare Pages (free tier) |
| Scheduling | GitHub Actions (daily sync) |

## Features

- **Trending Repositories** -- Browse repos sorted by trend score, daily stars, total stars, forks, or recent activity
- **Time Range Filtering** -- View trends for today, this week, or this month
- **Language & Topic Filters** -- Filter by programming language or GitHub topic
- **Full-Text Search** -- Search repositories by name or description
- **Repository Detail** -- Deep dive into individual repo metrics and history
- **Language Statistics** -- Aggregate stats and charts per programming language
- **Topic Statistics** -- Aggregate stats and charts per GitHub topic
- **Stats Dashboard** -- High-level overview with key metrics (total repos, daily stars, AI projects, etc.)
- **Auto-Sync** -- Daily automated data refresh via GitHub Actions
- **Mock Data Fallback** -- Works without a database connection using built-in demo data

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm` or `corepack enable`)
- A Cloudflare account (free tier)
- A GitHub Personal Access Token

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/gitpulse.git
cd gitpulse

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your GitHub token
# GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Start the dev server
pnpm dev
```

The app runs at `http://localhost:5173`. API endpoints fall back to mock data when no D1 database is configured locally.

### Build

```bash
pnpm build       # Type-check + Vite build
pnpm preview     # Preview the production build locally
```

## Project Structure

```
gitpulse/
├── .github/
│   └── workflows/
│       └── sync.yml              # Daily data sync via GitHub Actions
├── database/
│   └── schema.sql                # D1 database schema
├── functions/
│   └── api/                      # Cloudflare Pages Functions (API routes)
│       ├── _middleware.ts        # CORS middleware
│       ├── sync.ts              # POST /api/sync -- trigger data sync
│       ├── trending.ts          # GET  /api/trending -- trending repos
│       ├── languages.ts         # GET  /api/languages -- language stats
│       ├── topics.ts            # GET  /api/topics -- topic stats
│       ├── stats/
│       │   └── overview.ts      # GET  /api/stats/overview -- dashboard stats
│       └── repos/
│           └── [owner]/
│               └── [repo].ts    # GET  /api/repos/:owner/:repo -- repo detail
├── public/
│   └── favicon.ico
├── scripts/
│   └── sync.mjs                 # Local sync script
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AppHeader.vue
│   │   ├── DateRangeTabs.vue
│   │   ├── EmptyState.vue
│   │   ├── HeroSection.vue
│   │   ├── LanguageFilter.vue
│   │   ├── LoadingSkeleton.vue
│   │   ├── RadarBackground.vue
│   │   ├── RepoDetailPanel.vue
│   │   ├── RepoRankList.vue
│   │   ├── RepoTrendCard.vue
│   │   ├── SearchBar.vue
│   │   ├── StatCard.vue
│   │   ├── TopicTag.vue
│   │   └── TrendChart.vue
│   ├── composables/             # Vue composables
│   ├── router/                  # Vue Router config
│   ├── services/                # API service layer
│   ├── stores/                  # Pinia stores
│   ├── styles/                  # SCSS variables and global styles
│   ├── types/                   # TypeScript type definitions
│   ├── views/                   # Page-level components
│   │   ├── DashboardView.vue
│   │   ├── TrendingView.vue
│   │   ├── LanguagesView.vue
│   │   ├── TopicsView.vue
│   │   ├── RepoDetailView.vue
│   │   └── AboutView.vue
│   ├── App.vue
│   └── main.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── wrangler.toml                # Cloudflare Workers/Pages config
```

## API Endpoints

All endpoints are served by Cloudflare Pages Functions. Responses follow this envelope:

```json
{ "success": true, "data": ... }
```

| Method | Path | Description | Query Parameters |
|--------|------|-------------|------------------|
| GET | `/api/trending` | Paginated trending repos | `page`, `pageSize`, `range` (today/weekly/monthly), `language`, `topic`, `search`, `sortBy` (trend_score/today_stars/stars/forks/pushed_at/created_at) |
| GET | `/api/languages` | Language statistics | -- |
| GET | `/api/topics` | Topic statistics | -- |
| GET | `/api/stats/overview` | Dashboard overview stats | -- |
| GET | `/api/repos/:owner/:repo` | Single repository detail | -- |
| POST | `/api/sync` | Trigger a data sync | -- (requires `Authorization: Bearer <SYNC_SECRET>`) |

### Example: Fetch Trending Repos

```bash
curl "https://your-pages.pages.dev/api/trending?range=weekly&language=TypeScript&page=1&pageSize=10"
```

### Example: Trigger Sync

```bash
curl -X POST "https://your-pages.pages.dev/api/sync" \
  -H "Authorization: Bearer YOUR_SYNC_SECRET"
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token with `public_repo` scope. Used to extend API rate limits during sync. |
| `SYNC_SECRET` | Yes | Bearer token for authenticating POST requests to `/api/sync`. |
| `VITE_API_BASE_URL` | No | Override the API base URL for local development. Leave empty to use the same origin. |

### Cloudflare D1 Binding

| Binding | Variable | Database |
|---------|----------|----------|
| D1 | `DB` | `gitpulse-db` |

This binding is configured in the Cloudflare Pages dashboard, not in `.env`. See [DEPLOYMENT.md](./DEPLOYMENT.md) for setup instructions.

## License

MIT
