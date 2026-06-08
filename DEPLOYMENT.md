# GitPulse 部署指南（Cloudflare Pages 免费方案）

本指南将带你从零开始，将 GitPulse 部署到 Cloudflare Pages，全程使用免费套餐。

---

## 目录

1. [环境要求](#1-环境要求)
2. [本地开发启动](#2-本地开发启动)
3. [Fork 或克隆仓库](#3-fork-或克隆仓库)
4. [创建 Cloudflare Pages 项目](#4-创建-cloudflare-pages-项目)
5. [创建 D1 数据库](#5-创建-d1-数据库)
6. [配置 D1 数据库绑定](#6-配置-d1-数据库绑定)
7. [设置环境变量](#7-设置环境变量)
8. [初始化数据库表结构](#8-初始化数据库表结构)
9. [首次部署](#9-首次部署)
10. [配置每日自动同步（GitHub Actions）](#10-配置每日自动同步github-actions)
11. [绑定自定义域名（可选）](#11-绑定自定义域名可选)
12. [验证部署是否成功](#12-验证部署是否成功)
13. [常见问题排查](#13-常见问题排查)

---

## 1. 环境要求

开始之前，请确保你有以下条件：

- **GitHub 账号** — 仓库需要托管在 GitHub 上才能使用 Git 集成部署
- **Cloudflare 账号** — 免费注册：[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
- **Node.js 18+** — 本地开发需要
- **GitHub Personal Access Token** — 每日同步任务需要调用 GitHub API
  - 前往 [github.com/settings/tokens](https://github.com/settings/tokens)
  - 点击 **Generate new token (classic)**
  - 命名为 `gitpulse-sync`
  - 勾选 **public_repo** 权限（只读访问公开仓库）
  - 点击 **Generate token**
  - 立即复制 token（之后无法再次查看）

---

## 2. 本地开发启动

### 2.1 安装依赖

```bash
cd gitpulse
npm install
```

### 2.2 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173` 即可看到页面。

**说明：** 本地开发时，API 接口会自动使用 mock 数据（无需数据库），所有页面和功能都可以正常预览。

### 2.3 可用的 npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（热更新） |
| `npm run build` | 构建生产版本到 `dist/` 目录 |
| `npm run preview` | 本地预览构建后的生产版本 |
| `npm run deploy` | 构建并部署到 Cloudflare Pages |
| `npm run db:init` | 初始化本地 D1 数据库表结构 |
| `npm run db:seed` | 向本地 D1 数据库写入测试数据 |

### 2.4 本地测试 Pages Functions（可选）

如果你想在本地测试 Cloudflare Pages Functions（后端 API），需要使用 Wrangler：

```bash
# 先构建前端
npm run build

# 使用 Wrangler 启动本地 Pages 环境（含 D1）
npx wrangler pages dev dist --d1 DB=gitpulse-db
```

这会同时启动前端静态文件和后端 API，模拟真实的 Cloudflare Pages 环境。

---

## 3. Fork 或克隆仓库

```bash
# 方式一：在 GitHub 上 Fork（推荐）
# 在仓库页面点击右上角 "Fork" 按钮

# 方式二：直接克隆
git clone https://github.com/your-username/gitpulse.git
cd gitpulse
```

如果你是克隆的，需要推送到自己的 GitHub 仓库：

```bash
git remote set-url origin https://github.com/your-username/gitpulse.git
git push -u origin main
```

---

## 4. 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)

2. 在左侧菜单进入 **Workers & Pages**

3. 点击 **Create** 按钮

4. 选择 **Pages** 标签页

5. 点击 **Connect to Git**

6. 如果提示授权，允许 Cloudflare 访问你的 GitHub 账号

7. 从列表中选择你的 `gitpulse` 仓库

8. 点击 **Begin setup**

9. 配置构建设置：

   | 设置项 | 值 |
   |--------|-----|
   | **Production branch** | `main` |
   | **Framework preset** | `Vue` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist` |

10. 点击 **Save and Deploy**

Cloudflare 会执行首次构建。此时因为 D1 绑定和环境变量还没配置，构建可能会失败，这是正常的，请继续后续步骤。

---

## 5. 创建 D1 数据库

1. 在 Cloudflare Dashboard 左侧菜单进入 **Workers & Pages**

2. 点击顶部的 **D1** 标签页

3. 点击 **Create database**

4. 数据库名称填写：`gitpulse-db`

5. Location 保持 **Automatic**（Cloudflare 自动选择最近区域）

6. 点击 **Create**

7. 创建完成后，在数据库详情页复制 **Database ID**（本地开发用 wrangler 时需要）

---

## 6. 配置 D1 数据库绑定

D1 绑定让 Pages Functions 能通过 `context.env.DB` 访问数据库。

1. 在 Cloudflare Dashboard 进入 **Workers & Pages**

2. 点击你的 **gitpulse** Pages 项目

3. 进入 **Settings** > **Functions**

4. 向下滚动到 **D1 database bindings** 部分

5. 点击 **Add binding**

6. 填写：

   | 字段 | 值 |
   |------|-----|
   | **Variable name** | `DB` |
   | **D1 database** | `gitpulse-db`（从下拉菜单选择） |

7. 点击 **Save**

这样所有 Pages Functions 就可以通过 `context.env.DB` 访问 D1 数据库了。

---

## 7. 设置环境变量

环境变量用于同步端点和构建过程。

1. 在你的 Pages 项目中，进入 **Settings** > **Environment variables**

2. 为 **Production** 环境添加以下变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | 第 1 步生成的 GitHub Token，建议标记为 **Encrypt** |
   | `SYNC_SECRET` | `你的随机密钥` | 用于验证同步请求的随机字符串，用 `openssl rand -hex 32` 生成，建议标记为 **Encrypt** |

3. 点击 **Save**

**注意：** 生产环境不要设置 `VITE_API_BASE_URL`。前端使用相对路径（`/api/...`），在同一域名下自动生效。

---

## 8. 初始化数据库表结构

数据库初始为空，需要先创建表结构才能进行数据同步。

1. 在 Cloudflare Dashboard 进入 **Workers & Pages** > **D1**

2. 点击你的 **gitpulse-db** 数据库

3. 点击 **Console** 标签页（打开 SQL 编辑器）

4. 粘贴 `database/schema.sql` 文件的完整内容：

```sql
-- GitPulse 数据库表结构

CREATE TABLE IF NOT EXISTS repositories (
  id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL UNIQUE,
  owner TEXT NOT NULL,
  owner_avatar TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  html_url TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  open_issues INTEGER NOT NULL DEFAULT 0,
  language TEXT DEFAULT '',
  topics TEXT DEFAULT '[]',
  license TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  pushed_at TEXT NOT NULL,
  homepage TEXT DEFAULT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main'
);

CREATE TABLE IF NOT EXISTS repo_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  open_issues INTEGER NOT NULL DEFAULT 0,
  today_stars INTEGER NOT NULL DEFAULT 0,
  today_forks INTEGER NOT NULL DEFAULT 0,
  trend_score REAL NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  rank_change INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  UNIQUE(repo_id, date)
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sync_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  total_repos INTEGER NOT NULL DEFAULT 0,
  message TEXT DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_snapshots_date ON repo_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_snapshots_repo_date ON repo_snapshots(repo_id, date);
CREATE INDEX IF NOT EXISTS idx_repos_language ON repositories(language);
CREATE INDEX IF NOT EXISTS idx_repos_stars ON repositories(stars DESC);
```

5. 点击 **Execute**

你应该看到每条语句都执行成功。数据库现在已准备就绪。

---

## 9. 首次部署

配置好 D1 绑定和环境变量后，触发一次新的部署：

**方式一：推送一个空提交**

```bash
git commit --allow-empty -m "chore: 配置完成后触发重新部署"
git push origin main
```

**方式二：手动重新部署**

1. 在 Pages 项目中进入 **Deployments**
2. 点击最近一次部署的 **...** 菜单
3. 点击 **Retry deployment**

等待构建完成（通常 1-2 分钟）。构建成功后：

1. 点击部署链接（如 `https://gitpulse.pages.dev`）
2. Dashboard 应该能正常加载（显示 mock 数据，因为还没有运行同步）

---

## 10. 配置每日自动同步（GitHub Actions）

同步端点（`POST /api/sync`）会从 GitHub 获取 Top 100 热门仓库并写入 D1。我们用 GitHub Actions 实现每日自动执行。

### 10.1 添加仓库密钥

1. 进入你的 GitHub 仓库页面

2. 点击 **Settings** > **Secrets and variables** > **Actions**

3. 点击 **New repository secret**，添加：

   | 密钥名 | 值 |
   |--------|-----|
   | `SYNC_URL` | `https://你的项目.pages.dev/api/sync`（替换为你的实际 Pages 地址） |
   | `SYNC_SECRET` | 与 Cloudflare 环境变量中设置的 `SYNC_SECRET` 相同 |

### 10.2 确认工作流文件

项目中已包含 `.github/workflows/sync.yml`，内容如下：

```yaml
name: Daily Sync

on:
  schedule:
    # 每天 UTC 02:00 执行（北京时间 10:00）
    - cron: '0 2 * * *'
  workflow_dispatch: # 支持从 GitHub 页面手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: 触发同步接口
        run: |
          HTTP_STATUS=$(curl -s -o /tmp/response.txt -w "%{http_code}" \
            -X POST "${{ secrets.SYNC_URL }}" \
            -H "Authorization: Bearer ${{ secrets.SYNC_SECRET }}" \
            -H "Content-Type: application/json" \
            --max-time 30 \
            --retry 3 \
            --retry-delay 10)

          echo "HTTP 状态码: $HTTP_STATUS"
          echo "响应内容:"
          cat /tmp/response.txt
          echo ""

          if [ "$HTTP_STATUS" -ne 200 ]; then
            echo "::error::同步失败，HTTP 状态码 $HTTP_STATUS"
            exit 1
          fi

          SUCCESS=$(cat /tmp/response.txt | grep -o '"success":true' || true)
          if [ -z "$SUCCESS" ]; then
            echo "::error::同步接口返回 success=false"
            cat /tmp/response.txt
            exit 1
          fi

          echo "同步完成"
```

### 10.3 提交并推送

```bash
git add .github/workflows/sync.yml
git commit -m "ci: 添加每日同步工作流"
git push origin main
```

### 10.4 验证工作流

1. 进入你的 GitHub 仓库
2. 点击 **Actions** 标签页
3. 你应该能看到 "Daily Sync" 工作流
4. 点击 **Run workflow** 手动触发一次
5. 检查工作流运行日志确认成功

首次同步成功后，Dashboard 就会显示来自 GitHub 的真实数据了。

---

## 11. 绑定自定义域名（可选）

如果你想用自己的域名替代 `*.pages.dev`：

1. 在 Pages 项目中进入 **Custom domains**

2. 点击 **Set up a custom domain**

3. 输入你的域名（如 `gitpulse.yourdomain.com`）

4. 点击 **Continue**

5. Cloudflare 会提供需要添加的 DNS 记录：
   - 如果你的域名已经在 Cloudflare：CNAME 记录会自动添加
   - 如果域名在其他服务商：手动添加 CNAME 记录，指向 `gitpulse.pages.dev`

6. 等待 DNS 生效（Cloudflare 通常几分钟，其他服务商最多 24 小时）

7. DNS 验证通过后 SSL 证书会自动签发

---

## 12. 验证部署是否成功

按照以下清单逐项确认：

1. **首页能打开** — 访问 `https://你的项目.pages.dev`，Dashboard 应正常渲染

2. **API 有响应** — 浏览器打开 `https://你的项目.pages.dev/api/trending`，应该返回 JSON 数据

3. **数据库有数据** — 访问 `https://你的项目.pages.dev/api/trending?pageSize=5`，如果同步已运行，`data` 应包含真实仓库

4. **筛选功能正常** — 尝试 `?language=TypeScript`、`?topic=ai`、`?search=react`、`?range=weekly`

5. **同步端点正常** — 在终端执行：
   ```bash
   curl -X POST "https://你的项目.pages.dev/api/sync" \
     -H "Authorization: Bearer 你的SYNC_SECRET"
   ```
   应返回 `success: true` 和同步详情

6. **GitHub Actions 正常** — 检查仓库的 Actions 标签页，每日工作流应该已运行（或手动触发一次）

---

## 13. 常见问题排查

### 构建失败，TypeScript 报错

构建命令包含 `vue-tsc --noEmit` 类型检查。如果构建失败：

- 在 Cloudflare Dashboard 查看构建日志中的具体 TypeScript 错误
- 本地执行 `npm run build` 复现并修复问题

### API 返回 mock 数据而不是真实数据

说明 D1 数据库为空或绑定配置有误。

1. **检查 D1 绑定**：Settings > Functions > D1 bindings，变量名必须是 `DB`
2. **检查数据库**：进入 D1 > gitpulse-db > Console，执行 `SELECT COUNT(*) FROM repositories;`，如果返回 0 说明同步还没运行
3. **运行同步**：通过 API 或 GitHub Actions 手动触发同步

### 同步端点返回 401 Unauthorized

`SYNC_SECRET` 缺失或不匹配。

1. 检查 Cloudflare Pages 环境变量中的 `SYNC_SECRET`
2. 检查 GitHub 仓库密钥中的 `SYNC_SECRET` 是否一致
3. 确认 GitHub Actions 发送的 header 格式为 `Authorization: Bearer <secret>`

### 同步端点返回 500

`GITHUB_TOKEN` 可能无效或缺失。

1. 检查 Pages 环境变量中是否设置了 `GITHUB_TOKEN`
2. 确认 token 在 GitHub 上没有过期
3. 确认 token 拥有 `public_repo` 权限
4. 查看同步响应体中的具体错误信息

### D1 绑定报错："DB is not defined"

Pages Functions 找不到 D1 绑定。

1. 进入 Pages 项目 Settings > Functions
2. 确认绑定存在，变量名为 `DB`，指向 `gitpulse-db`
3. 添加或修改绑定后需要重新部署

### GitHub Actions 工作流不触发

1. 确认工作流文件在 `main` 分支（或你的生产分支）上
2. 检查 cron 语法是否正确：`0 2 * * *` 表示每天 UTC 02:00
3. GitHub 会在仓库 60 天无活动后禁用定时工作流，推送一次提交即可重新启用
4. 确认仓库设置中已配置 `SYNC_URL` 和 `SYNC_SECRET` 密钥

### Cloudflare Pages 免费套餐限制

Cloudflare Pages 免费套餐包含：

- 每月 500 次构建
- 每天 100,000 次 Functions 请求
- 1 GB D1 存储
- 每天 500 万次 D1 行读取
- 每天 100,000 次 D1 行写入

对于本项目的体量，这些限额绰绰有余。可以在 Cloudflare Dashboard 的 **Workers & Pages** > 项目 > **Analytics** 中监控使用情况。

### 本地开发没有 D1 数据库

执行 `npm run dev` 时没有 D1 数据库，API 会自动回退到 mock 数据，UI 可以完整预览。

如果需要本地测试真实 D1：

1. 在 `wrangler.toml` 中填入你的 D1 Database ID
2. 构建后执行 `npx wrangler pages dev dist --d1 DB=gitpulse-db`
3. 或使用 `npm run db:init` 通过 wrangler 初始化本地 D1 数据库
