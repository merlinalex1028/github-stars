# GitPulse - GitHub Trend 趋势榜网站 实现计划

## Architecture Overview

**Cloudflare Pages Full-Stack** (Free Plan)
- Frontend: Vue 3 + TypeScript + Vite → 静态部署到 Cloudflare Pages
- Backend: Cloudflare Pages Functions (Hono 框架) → 自动随前端部署
- Database: Cloudflare D1 (SQLite-compatible, 免费 5M reads/day)
- Cron Sync: GitHub Actions (免费, 可靠替代付费 Workers Cron Triggers)

## Project Structure

```
gitpulse/
├── functions/                    # Cloudflare Pages Functions (Backend API)
│   └── api/
│       ├── [[catchall]].ts       # CORS middleware & error handler
│       ├── trending.ts           # GET /api/trending
│       ├── repos/
│       │   └── [owner]/
│       │       └── [repo].ts     # GET /api/repos/:owner/:repo
│       ├── languages.ts          # GET /api/languages
│       ├── topics.ts             # GET /api/topics
│       ├── stats/
│       │   └── overview.ts       # GET /api/stats/overview
│       └── sync.ts               # POST /api/jobs/sync-github-trending
├── src/                          # Vue 3 Frontend
│   ├── main.ts
│   ├── App.vue
│   ├── router/index.ts
│   ├── stores/                   # Pinia stores
│   │   ├── repos.ts
│   │   ├── stats.ts
│   │   └── filters.ts
│   ├── services/                 # API service layer
│   │   ├── api.ts
│   │   └── mock.ts
│   ├── views/                    # 6 pages
│   │   ├── DashboardView.vue
│   │   ├── TrendingView.vue
│   │   ├── RepoDetailView.vue
│   │   ├── LanguagesView.vue
│   │   ├── TopicsView.vue
│   │   └── AboutView.vue
│   ├── components/               # Reusable components
│   │   ├── AppHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── StatCard.vue
│   │   ├── RepoTrendCard.vue
│   │   ├── RepoRankList.vue
│   │   ├── LanguageFilter.vue
│   │   ├── TopicTag.vue
│   │   ├── TrendChart.vue
│   │   ├── RadarBackground.vue
│   │   ├── DateRangeTabs.vue
│   │   ├── SearchBar.vue
│   │   ├── EmptyState.vue
│   │   ├── LoadingSkeleton.vue
│   │   └── RepoDetailPanel.vue
│   ├── composables/
│   │   └── useChart.ts
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── global.scss
│   │   └── animations.scss
│   └── types/
│       └── index.ts
├── public/
│   └── favicon.svg
├── database/
│   └── schema.sql                # D1 schema
├── scripts/
│   └── seed.ts                   # Seed mock data
├── .github/
│   └── workflows/
│       └── sync.yml              # GitHub Actions daily sync
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── wrangler.toml
├── .gitignore
├── .env.example
├── README.md
└── DEPLOYMENT.md                 # 详细部署文档
```

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Vue 3 + TypeScript + Vite | PRD requirement, fast DX |
| State | Pinia | Vue 3 official state management |
| Router | Vue Router | Vue 3 official routing |
| Charts | ECharts | PRD requirement, powerful |
| Styling | SCSS | PRD requirement |
| Backend | Hono on Cloudflare Pages Functions | Lightweight, fast, TypeScript-native |
| Database | Cloudflare D1 | Free, SQLite-compatible, integrated with Pages |
| ORM | Drizzle ORM | Type-safe D1 queries |
| Cron | GitHub Actions | Free, reliable, no paid Workers plan |

## Implementation Phases

### Phase 1: Project Scaffolding (~5 min)
- Initialize Vue 3 + TypeScript + Vite project
- Install all dependencies
- Create directory structure
- Configure tsconfig, vite.config, wrangler.toml
- Set up .gitignore, .env.example

### Phase 2: Database & Backend API (~15 min)
- Create D1 schema (3 tables: repositories, repo_snapshots, sync_logs)
- Implement GitHub API service with rate limiting & retry
- Implement trend score algorithm
- Implement data sync logic
- Implement 6 API endpoints with Hono
- Create mock data for development

### Phase 3: Frontend Foundation (~10 min)
- Configure Vue Router (6 routes)
- Create Pinia stores
- Create API service layer with mock fallback
- Set up SCSS variables and global styles
- Create dark sci-fi theme foundation

### Phase 4: Frontend Pages & Components (~20 min)
- Build all 6 pages
- Build all 14 reusable components
- Implement glass morphism, glowing borders, grid background
- Implement hover effects, loading skeletons, empty states
- Implement search, filter, sort, pagination

### Phase 5: Charts & Data Visualization (~10 min)
- ECharts dark theme configuration
- Star trend line chart
- Language distribution pie/donut chart
- Topic heatmap
- Top repos bar chart
- Number scroll animations

### Phase 6: Deployment & Documentation (~10 min)
- Write DEPLOYMENT.md with step-by-step Cloudflare Pages deployment
- Write GitHub Actions workflow for daily sync
- Write README.md with project overview
- Final testing and polish

## Deployment Strategy (Cloudflare Pages Free)

1. Push code to GitHub repository
2. Connect Cloudflare Pages to GitHub repo
3. Create D1 database in Cloudflare dashboard
4. Configure D1 binding in Pages settings
5. Set environment variables (GITHUB_TOKEN, SYNC_SECRET)
6. Push triggers auto-deploy
7. GitHub Actions runs daily sync at 02:00 UTC
8. Site live at https://your-project.pages.dev

**Free Tier Limits:**
- Pages: Unlimited requests, 500 builds/month
- D1: 5M reads/day, 100K writes/day, 5GB storage
- GitHub Actions: 2000 min/month (free plan)
