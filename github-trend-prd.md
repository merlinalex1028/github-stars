# GitHub Trend 趋势榜网站 PRD

## 1. 产品概述

### 1.1 产品名称

暂定名称：**GitPulse**

备选名称：

- CodeTrend
- OpenSource Radar
- GitHub Trend Radar

### 1.2 产品定位

GitPulse 是一个面向开发者的 GitHub 开源项目趋势发现平台。网站每天自动从 GitHub 获取公开仓库数据，通过自定义趋势算法计算每日、每周、每月热门开源项目，并以科技感数据看板的形式展示 GitHub 开源生态动态。

### 1.3 产品目标

- 每日自动收集 GitHub 公开仓库数据。
- 计算仓库趋势分数，生成热门项目榜单。
- 支持按语言、Topic、时间范围筛选项目。
- 提供仓库详情、趋势图表、语言榜、Topic 榜等功能。
- 打造科技感、未来感、开发者友好的开源趋势网站。
- 可作为个人作品站、开源导航站或开发者工具站使用。

### 1.4 核心用户

- 前端开发者
- 后端开发者
- 全栈开发者
- AI / LLM 从业者
- 开源项目爱好者
- 技术博主
- 投资、产品、技术趋势研究人员

---

## 2. 背景说明

GitHub 官方提供公开 REST API 和 GraphQL API，可以获取仓库、Star、Fork、Issue、语言、Topic 等数据，但 GitHub 没有官方 Trending API。

因此本项目需要通过 GitHub 公开 API 自行拉取公开仓库数据，并基于每日快照计算趋势数据。

### 2.1 数据获取原则

- 不在前端直接请求 GitHub API。
- GitHub Token 只允许存在后端环境变量中。
- 每日通过后端定时任务同步数据。
- 数据同步后存入数据库。
- 前端只请求本站后端接口。
- 趋势榜基于数据库快照计算。

---

## 3. 技术方案

### 3.1 推荐技术栈

#### 前端

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus 或 Naive UI
- ECharts / Chart.js
- SCSS

#### 后端

可选择以下任一方案：

- Node.js + Express / Fastify
- Nitro / Nuxt Server API
- Vercel Serverless Functions
- Cloudflare Workers
- Supabase Edge Functions

#### 数据库

可选择以下任一方案：

- SQLite
- PostgreSQL
- Supabase
- Vercel KV
- Cloudflare D1

### 3.2 推荐部署方案

#### 方案一：Vercel

- 前端：Vercel
- 后端：Vercel Serverless Functions
- 数据库：Supabase / Neon PostgreSQL
- 定时任务：Vercel Cron Jobs

#### 方案二：Cloudflare

- 前端：Cloudflare Pages
- 后端：Cloudflare Workers
- 数据库：Cloudflare D1
- 定时任务：Cloudflare Cron Triggers

---

## 4. 数据来源设计

### 4.1 GitHub API

项目优先使用 GitHub REST API。

示例接口：

```txt
GET https://api.github.com/search/repositories?q=created:>YYYY-MM-DD&sort=stars&order=desc&per_page=100
```

按语言查询示例：

```txt
GET https://api.github.com/search/repositories?q=language:TypeScript created:>YYYY-MM-DD&sort=stars&order=desc&per_page=50
```

### 4.2 API 鉴权

后端通过环境变量读取 GitHub Token。

```env
GITHUB_TOKEN=xxx
DATABASE_URL=xxx
SYNC_CRON=0 2 * * *
```

### 4.3 Rate Limit 处理

GitHub API 存在请求频率限制，因此需要：

- 使用 GitHub Token。
- 控制每日同步任务请求数量。
- 对语言和 Topic 分批同步。
- 失败时记录日志。
- 达到限流时延迟重试。
- 前端禁止直接调用 GitHub API。

---

## 5. 数据字段设计

### 5.1 仓库基础字段

需要从 GitHub API 中获取并存储以下字段：

| 字段 | 说明 |
|---|---|
| id | GitHub 仓库 ID |
| full_name | 仓库完整名称，例如 owner/repo |
| owner | 仓库所有者 |
| owner_avatar | 所有者头像 |
| description | 仓库描述 |
| html_url | GitHub 仓库地址 |
| stargazers_count | Star 数 |
| forks_count | Fork 数 |
| open_issues_count | Issue 数 |
| language | 主语言 |
| topics | Topic 标签 |
| license | 开源协议 |
| created_at | 创建时间 |
| updated_at | 更新时间 |
| pushed_at | 最近 push 时间 |
| homepage | 项目主页 |
| default_branch | 默认分支 |

### 5.2 TypeScript 类型设计

```ts
export interface GithubRepo {
  id: number
  fullName: string
  owner: string
  ownerAvatar: string
  description: string
  url: string
  stars: number
  forks: number
  openIssues: number
  language: string
  topics: string[]
  license?: string
  createdAt: string
  updatedAt: string
  pushedAt: string
  homepage?: string
}

export interface RepoTrendSnapshot {
  repoId: number
  date: string
  stars: number
  forks: number
  openIssues: number
  todayStars: number
  todayForks: number
  trendScore: number
  rank: number
  rankChange: number
}
```

---

## 6. 趋势算法设计

### 6.1 趋势分数

系统需要设计 `trend_score` 字段，用于趋势榜排序。

参考算法：

```txt
trend_score =
今日新增 Star * 10
+ 今日新增 Fork * 4
+ 今日新增 Issue * 1
+ 近 7 天活跃权重
+ 新项目加成
+ README / Topic / License 完整度加成
```

### 6.2 评分因子说明

| 因子 | 权重说明 |
|---|---|
| 今日新增 Star | 权重最高，代表项目关注度增长 |
| 今日新增 Fork | 代表项目被使用或二次开发的潜力 |
| Issue 活跃度 | 代表社区活跃程度 |
| 最近 Push 时间 | 越近权重越高 |
| 新项目加成 | 新创建项目获得一定曝光 |
| Topic 完整度 | Topic 越完整，分类价值越高 |
| License | 有开源协议的项目加分 |
| README | 有 README 的项目加分 |

### 6.3 榜单类型

系统需要支持以下榜单：

- 今日趋势
- 本周趋势
- 本月趋势
- 新项目榜
- AI 项目榜
- 前端项目榜
- 后端项目榜
- 工具类项目榜
- TypeScript 榜
- JavaScript 榜
- Python 榜
- Go 榜
- Rust 榜
- Java 榜
- Vue 榜
- React 榜

---

## 7. 页面需求

## 7.1 首页 Dashboard

### 页面路径

```txt
/
```

### 页面目标

首页需要展示整体数据概览、今日热门项目、趋势图表，形成科技感数据大屏效果。

### 页面模块

#### 7.1.1 顶部导航栏

包含：

- Logo
- 今日趋势
- 语言榜
- Topic 榜
- 收藏
- 关于
- GitHub 登录按钮，可选

#### 7.1.2 Hero 区域

文案：

```txt
Discover What Developers Are Building
Daily GitHub trends, open-source signals, and developer radar.
```

右侧视觉元素：

- 科技感代码流
- 星球轨道
- 数据节点
- GitHub 仓库卡片漂浮效果
- 雷达扫描动效

#### 7.1.3 数据概览卡片

展示：

- 今日收录仓库数
- 今日新增 Star
- 热门语言数量
- AI 项目数量
- 最活跃 Topic

#### 7.1.4 今日 Top 10 趋势榜

展示字段：

- 排名
- 仓库名称
- 仓库描述
- 语言标签
- Star 总数
- 今日新增 Star
- Fork 数
- 更新时间
- 趋势分数
- GitHub 跳转按钮

#### 7.1.5 趋势图表

包含：

- 今日新增 Star 折线图
- 热门语言占比环图
- Topic 热力图
- Top 仓库 Star 增长柱状图

---

## 7.2 趋势列表页

### 页面路径

```txt
/trending
```

### 页面目标

展示完整趋势仓库列表，支持筛选、搜索和排序。

### 功能需求

#### 时间范围筛选

支持：

- Today
- Weekly
- Monthly

#### 语言筛选

支持：

- All
- TypeScript
- JavaScript
- Python
- Go
- Rust
- Java
- Vue
- React

#### Topic 筛选

支持：

- AI
- LLM
- Agent
- Vue
- React
- Rust
- CLI
- Database
- DevTools

#### 搜索功能

支持按仓库名称模糊搜索。

#### 排序功能

支持：

- 趋势分数
- 今日新增 Star
- 总 Star
- Fork
- 最近更新
- 创建时间

### 列表卡片字段

每个仓库卡片展示：

- 排名编号
- owner avatar
- full_name
- description
- language
- topics
- stars
- today_stars
- forks
- issues
- license
- pushed_at
- GitHub 按钮
- 收藏按钮

---

## 7.3 仓库详情页

### 页面路径

```txt
/repo/:owner/:repo
```

### 页面目标

展示单个仓库的详细信息和趋势分析。

### 页面内容

- 仓库名称
- Owner 信息
- 仓库描述
- GitHub 链接
- 项目主页链接
- Star 总数
- Fork 总数
- Issue 数
- License
- Topic 标签
- README 摘要区域
- Star 趋势图
- Fork 趋势图
- Issue 活跃度图
- 语言占比图
- 最近更新时间
- 相似项目推荐

### 视觉要求

页面需要呈现为科技感项目分析报告，强调数据分析感。

---

## 7.4 语言榜页面

### 页面路径

```txt
/languages
```

### 页面目标

展示不同编程语言在 GitHub 上的热度趋势。

### 页面内容

- 热门语言排行
- 每种语言的今日热门仓库
- 每种语言的趋势曲线
- 语言占比图
- 点击语言后进入对应语言趋势列表

---

## 7.5 Topic 榜页面

### 页面路径

```txt
/topics
```

### 页面目标

展示热门技术 Topic 的活跃度和项目数量。

### 页面内容

- AI
- LLM
- Agent
- Vue
- React
- Rust
- CLI
- Database
- DevTools
- Topic 热力图
- 每个 Topic 的仓库数量
- 每个 Topic 的总 Star
- 每个 Topic 的今日新增 Star
- Topic 下热门仓库列表

---

## 7.6 关于页面

### 页面路径

```txt
/about
```

### 页面目标

说明网站的数据来源、排名算法和免责声明。

### 页面文案

页面需要说明：

- 本站每日从 GitHub 公开 API 获取公开仓库数据。
- 排名由本站自定义趋势算法生成。
- 数据仅用于开源项目发现与趋势观察。
- GitHub 是数据来源。
- 本站不是 GitHub 官方产品。
- 如果项目数据存在延迟，以 GitHub 官方数据为准。

---

## 8. 后端接口需求

### 8.1 获取趋势列表

```txt
GET /api/trending?range=today&language=TypeScript&topic=ai&page=1&pageSize=20
```

参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| range | string | today / weekly / monthly |
| language | string | 编程语言，可选 |
| topic | string | Topic，可选 |
| page | number | 页码 |
| pageSize | number | 每页数量 |

返回：

- 仓库列表
- 分页信息
- 排名信息
- 趋势分数

### 8.2 获取仓库详情

```txt
GET /api/repos/:owner/:repo
```

返回：

- 仓库基础信息
- 趋势快照
- 图表数据
- README 摘要
- 相似项目

### 8.3 获取语言榜

```txt
GET /api/languages
```

返回：

- 语言排行
- 仓库数量
- Star 总数
- 今日新增 Star
- 趋势变化

### 8.4 获取 Topic 榜

```txt
GET /api/topics
```

返回：

- Topic 排行
- 仓库数量
- Star 总数
- 今日新增 Star
- 趋势变化

### 8.5 获取首页概览

```txt
GET /api/stats/overview
```

返回：

- 今日收录仓库数
- 今日新增 Star
- 热门语言数量
- AI 项目数量
- 最活跃 Topic
- 图表数据

### 8.6 手动同步 GitHub 数据

```txt
POST /api/jobs/sync-github-trending
```

说明：

- 用于管理员手动触发数据同步。
- 需要鉴权。
- 不能暴露给普通用户直接调用。

---

## 9. 定时任务需求

### 9.1 执行时间

默认每天凌晨 2 点执行。

```txt
0 2 * * *
```

### 9.2 同步流程

1. 读取 GitHub Token。
2. 根据语言、Topic、创建时间等条件请求 GitHub API。
3. 清洗仓库数据。
4. 存储仓库基础信息。
5. 生成当日快照。
6. 对比昨日快照。
7. 计算今日新增 Star、Fork、Issue。
8. 计算趋势分数。
9. 生成榜单排名。
10. 记录同步日志。

### 9.3 异常处理

需要支持：

- API 请求失败重试
- GitHub 限流处理
- 数据去重
- 数据格式异常跳过
- 同步日志记录
- 同步失败告警，可选

---

## 10. 数据库设计

### 10.1 repositories 表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | number | GitHub 仓库 ID |
| full_name | string | 仓库完整名称 |
| owner | string | 所有者 |
| owner_avatar | string | 头像 |
| description | string | 描述 |
| html_url | string | GitHub 地址 |
| stars | number | 当前 Star |
| forks | number | 当前 Fork |
| open_issues | number | 当前 Issue |
| language | string | 主语言 |
| topics | json | Topic 列表 |
| license | string | 开源协议 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| pushed_at | datetime | 最近 push 时间 |
| homepage | string | 项目主页 |
| default_branch | string | 默认分支 |

### 10.2 repo_snapshots 表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | number | 主键 |
| repo_id | number | 仓库 ID |
| date | date | 快照日期 |
| stars | number | 当日 Star |
| forks | number | 当日 Fork |
| open_issues | number | 当日 Issue |
| today_stars | number | 今日新增 Star |
| today_forks | number | 今日新增 Fork |
| trend_score | number | 趋势分数 |
| rank | number | 排名 |
| rank_change | number | 排名变化 |

### 10.3 sync_logs 表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | number | 主键 |
| sync_date | datetime | 同步时间 |
| status | string | success / failed |
| total_repos | number | 同步仓库数量 |
| message | string | 日志信息 |
| duration | number | 同步耗时 |

---

## 11. UI 设计规范

### 11.1 整体风格

整体风格为：

- 科技感
- 暗色系
- 数据中台
- 未来感
- 开源社区感
- 开发者工具感

整体不能像普通后台管理系统，需要更像科技产品官网 + 数据看板。

### 11.2 色彩规范

#### 主背景

```css
--bg-primary: #050816;
--bg-secondary: #070B1F;
--bg-card: #0B1026;
```

#### 主色

```css
--color-blue: #38BDF8;
--color-purple: #8B5CF6;
--color-cyan: #22D3EE;
--color-green: #34D399;
--color-orange: #F59E0B;
```

#### 文字

```css
--text-primary: #F8FAFC;
--text-secondary: #CBD5E1;
--text-muted: #64748B;
```

### 11.3 视觉元素

需要加入：

- 玻璃拟态卡片
- 细描边
- 发光边框
- 网格背景
- 渐变光斑
- 代码流装饰
- 数据节点连线
- 雷达扫描动效
- 仓库卡片 hover 浮起
- 数字滚动动画
- 排名变化箭头

### 11.4 布局规范

| 项目 | 规范 |
|---|---|
| 主内容最大宽度 | 1280px |
| 卡片圆角 | 16px |
| 卡片内边距 | 20px - 28px |
| 模块间距 | 24px - 40px |
| 页面左右留白 | 桌面端充足留白 |
| 响应式 | 桌面端优先，兼容移动端 |

---

## 12. 组件设计

需要封装以下组件：

| 组件名 | 说明 |
|---|---|
| AppHeader | 顶部导航栏 |
| AppSidebar | 侧边栏，可选 |
| HeroSection | 首页 Hero 区域 |
| StatCard | 数据统计卡片 |
| RepoTrendCard | 仓库趋势卡片 |
| RepoRankList | 仓库排行榜 |
| LanguageFilter | 语言筛选器 |
| TopicTag | Topic 标签 |
| TrendChart | 趋势图表 |
| RadarBackground | 雷达背景装饰 |
| DateRangeTabs | 时间范围切换 |
| SearchBar | 搜索框 |
| EmptyState | 空状态 |
| LoadingSkeleton | 加载骨架屏 |
| RepoDetailPanel | 仓库详情面板 |

---

## 13. 交互需求

### 13.1 通用交互

- 鼠标悬浮仓库卡片时，边框出现蓝紫渐变发光。
- 仓库卡片 hover 时轻微上浮。
- Top 3 排名使用特殊视觉效果。
- 语言标签使用不同颜色区分。
- 点击仓库卡片进入详情页。
- 点击 GitHub 图标新窗口打开仓库。
- 支持加载态骨架屏。
- 支持空状态。
- 支持错误提示。
- 支持 API 限流提示。
- 支持深色主题，默认深色。

### 13.2 排名变化

排名变化需要展示：

- 上升箭头
- 下降箭头
- 持平状态
- 新上榜标识

### 13.3 收藏功能

收藏功能可作为二期功能，初期可以先使用 localStorage 保存。

---

## 14. 状态设计

### 14.1 加载状态

- 首屏加载时显示骨架屏。
- 图表加载时显示局部 loading。
- 列表分页加载时显示按钮 loading。

### 14.2 空状态

出现条件：

- 当前筛选条件无数据。
- 搜索结果为空。
- API 请求失败且无缓存数据。

空状态文案示例：

```txt
No repositories found.
Try another language, topic, or date range.
```

### 14.3 错误状态

出现条件：

- 后端 API 请求失败。
- GitHub API 限流。
- 数据同步失败。
- 数据库查询失败。

错误提示需要清晰说明原因，并提供重试按钮。

---

## 15. 权限与安全

### 15.1 GitHub Token 安全

- GitHub Token 只能存储在后端环境变量。
- 前端不能暴露 Token。
- 前端不能直接调用 GitHub API。
- 手动同步接口需要管理员鉴权。

### 15.2 数据安全

- 只存储 GitHub 公开数据。
- 不存储用户隐私数据。
- 如果后续支持 GitHub 登录，需要单独设计 OAuth 权限范围。

---

## 16. 非功能需求

### 16.1 性能

- 首页首屏加载需要尽量快。
- 图表数据按需加载。
- 趋势列表分页加载。
- 对列表接口增加缓存。
- 定时同步任务不能影响用户访问。

### 16.2 可维护性

- 趋势算法需要独立封装。
- GitHub API 请求逻辑需要独立封装。
- 数据库访问层需要独立封装。
- 页面组件需要拆分清晰。
- Mock 数据和真实 API 数据结构保持一致。

### 16.3 兼容性

- 优先支持桌面端。
- 兼容常见现代浏览器。
- 移动端需要基础适配。

---

## 17. 迭代规划

### 17.1 MVP 版本

包含：

- 首页 Dashboard
- 趋势列表页
- GitHub API 每日同步
- 仓库基础数据存储
- 今日趋势榜
- 语言筛选
- Topic 筛选
- Mock 图表或真实图表
- 科技感 UI

### 17.2 V1 版本

增加：

- 仓库详情页
- 语言榜页面
- Topic 榜页面
- 完整趋势图表
- 每周 / 每月榜单
- 排名变化
- 同步日志
- 手动同步接口

### 17.3 V2 版本

增加：

- GitHub 登录
- 用户收藏
- 项目订阅
- 趋势邮件推送
- AI 项目自动分类
- README 摘要
- 相似项目推荐
- 项目质量评分

---

## 18. 验收标准

### 18.1 功能验收

- 可以正常展示首页数据。
- 可以正常展示今日趋势榜。
- 可以按语言筛选趋势项目。
- 可以按 Topic 筛选趋势项目。
- 可以搜索仓库名称。
- 可以点击仓库进入详情页。
- 可以跳转 GitHub 原始仓库。
- 每日同步任务可以正常执行。
- 同步后可以生成仓库快照。
- 趋势分数可以正确计算。
- 前端不会暴露 GitHub Token。

### 18.2 UI 验收

- 页面整体为暗色科技感。
- 卡片具有玻璃拟态和发光效果。
- 首页具有数据大屏氛围。
- 图表风格统一。
- 仓库卡片信息层级清晰。
- Top 3 排名有特殊视觉强调。
- 页面不是普通后台管理风格。

### 18.3 性能验收

- 首页数据加载稳定。
- 列表分页不卡顿。
- 图表渲染流畅。
- API 请求失败时有错误提示。
- 空数据时有空状态。

---

## 19. 可用于 AI 生成网站的简短提示词

```md
请基于这份 PRD 生成一个 GitHub Trend 趋势榜网站。

技术栈使用 Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus/Naive UI + ECharts + SCSS。

网站风格为暗色科技感、数据看板、未来感、开源社区风。需要包含首页 Dashboard、趋势列表页、仓库详情页、语言榜、Topic 榜、关于页面。

GitHub 没有官方 Trending API，请通过 GitHub REST API 或 GraphQL API 每日拉取公开仓库数据，存储快照，并基于新增 Star、Fork、Issue、活跃度、新项目加成等规则计算 trend_score。GitHub Token 只能放在后端环境变量中，前端不能暴露 Token。

请输出完整可运行项目代码，包括前端页面、组件、路由、状态管理、API 封装、mock 数据、趋势算法、后端接口示例、定时同步任务示例、README 和部署说明。
```
