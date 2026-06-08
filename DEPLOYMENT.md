# Deploying GitPulse to Cloudflare Pages (Free Tier)

This guide walks through every step of deploying GitPulse to Cloudflare Pages with a D1 database, from zero to a live site with automated daily syncs. Everything described here stays within Cloudflare's free tier limits.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Fork or Clone the Repository](#2-fork-or-clone-the-repository)
3. [Create a Cloudflare Pages Project](#3-create-a-cloudflare-pages-project)
4. [Create a D1 Database](#4-create-a-d1-database)
5. [Configure the D1 Binding](#5-configure-the-d1-binding)
6. [Set Environment Variables](#6-set-environment-variables)
7. [Initialize the Database Schema](#7-initialize-the-database-schema)
8. [First Deploy](#8-first-deploy)
9. [Set Up Daily Sync via GitHub Actions](#9-set-up-daily-sync-via-github-actions)
10. [Custom Domain (Optional)](#10-custom-domain-optional)
11. [Verify the Deployment](#11-verify-the-deployment)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Make sure you have the following before starting:

- **GitHub account** -- the repo must be hosted on GitHub to use the Git integration
- **Cloudflare account** -- sign up free at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
- **GitHub Personal Access Token** -- needed for the daily sync job to call the GitHub API
  - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
  - Click **Generate new token (classic)**
  - Name it something like `gitpulse-sync`
  - Check the **public_repo** scope (read-only access to public repositories)
  - Click **Generate token**
  - Copy the token immediately (you will not see it again)

## 2. Fork or Clone the Repository

```bash
# Option A: Fork on GitHub (recommended for deployment)
# Click the "Fork" button on the repository page

# Option B: Clone directly
git clone https://github.com/your-username/gitpulse.git
cd gitpulse
```

Push the code to your own GitHub repository if you cloned it:

```bash
git remote set-url origin https://github.com/your-username/gitpulse.git
git push -u origin main
```

## 3. Create a Cloudflare Pages Project

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).

2. In the left sidebar, go to **Workers & Pages**.

3. Click the **Create** button.

4. Select the **Pages** tab.

5. Click **Connect to Git**.

6. Authorize Cloudflare to access your GitHub account if prompted.

7. Select your `gitpulse` repository from the list.

8. Click **Begin setup**.

9. Configure the build settings:

   | Setting | Value |
   |---------|-------|
   | **Production branch** | `main` |
   | **Framework preset** | `Vue` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist` |

10. Click **Save and Deploy**.

Cloudflare will run the first build. It may fail at this point because the D1 binding and environment variables are not configured yet. That is expected -- continue with the next steps.

## 4. Create a D1 Database

1. In the Cloudflare Dashboard, go to **Workers & Pages** in the left sidebar.

2. Click the **D1** tab at the top of the page.

3. Click **Create database**.

4. Enter the database name: `gitpulse-db`

5. Leave the location set to **Automatic** (Cloudflare picks the closest region).

6. Click **Create**.

7. After creation, copy the **Database ID** from the database details page. You will need this for the `wrangler.toml` file (only needed for local development with wrangler).

## 5. Configure the D1 Binding

The D1 binding connects your Pages project to the database so that serverless functions can access it via `context.env.DB`.

1. In the Cloudflare Dashboard, go to **Workers & Pages**.

2. Click on your **gitpulse** Pages project.

3. Go to **Settings** > **Functions**.

4. Scroll down to the **D1 database bindings** section.

5. Click **Add binding**.

6. Fill in:

   | Field | Value |
   |-------|-------|
   | **Variable name** | `DB` |
   | **D1 database** | `gitpulse-db` (select from the dropdown) |

7. Click **Save**.

This makes the D1 database available as `context.env.DB` inside all Pages Functions.

## 6. Set Environment Variables

Environment variables are used by the sync endpoint and the build process.

1. In your Pages project, go to **Settings** > **Environment variables**.

2. Add the following variables for the **Production** environment:

   | Variable name | Value | Notes |
   |---------------|-------|-------|
   | `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | Your GitHub PAT from Step 1. Mark as **Encrypt** for security. |
   | `SYNC_SECRET` | `your-random-secret-here` | A random string used to authenticate sync requests. Generate one with `openssl rand -hex 32`. Mark as **Encrypt**. |

3. Click **Save**.

**Important**: Do NOT set `VITE_API_BASE_URL` in production. The frontend uses relative paths (`/api/...`) which work automatically when the API and frontend are on the same domain.

## 7. Initialize the Database Schema

The database starts empty. You need to create the tables before the sync can work.

1. In the Cloudflare Dashboard, go to **Workers & Pages** > **D1**.

2. Click on your **gitpulse-db** database.

3. Click the **Console** tab (this opens the SQL editor).

4. Paste the entire contents of `database/schema.sql`:

```sql
-- GitPulse D1 Database Schema

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

5. Click **Execute**.

You should see a success message for each statement. The database is now ready.

## 8. First Deploy

After configuring the D1 binding and environment variables, trigger a new deployment:

**Option A: Push a commit**

```bash
git commit --allow-empty -m "chore: trigger redeploy after env config"
git push origin main
```

**Option B: Manual redeploy**

1. In your Pages project, go to **Deployments**.
2. Click the **...** menu on the latest deployment.
3. Click **Retry deployment**.

Wait for the build to complete (usually 1-2 minutes). Once it succeeds:

1. Click the deployment URL (e.g., `https://gitpulse.pages.dev`).
2. The dashboard should load with mock data (since no sync has run yet).

## 9. Set Up Daily Sync via GitHub Actions

The sync endpoint (`POST /api/sync`) fetches the top 100 starred repositories from GitHub and writes them to D1. You automate this with GitHub Actions.

### 9.1 Add Repository Secrets

1. Go to your GitHub repository on github.com.

2. Click **Settings** > **Secrets and variables** > **Actions**.

3. Click **New repository secret** and add:

   | Secret name | Value |
   |-------------|-------|
   | `SYNC_URL` | `https://your-project.pages.dev/api/sync` (replace with your actual Pages URL) |
   | `SYNC_SECRET` | The same value you set as `SYNC_SECRET` in Cloudflare |

### 9.2 Create the Workflow File

Create the file `.github/workflows/sync.yml` in your repository:

```yaml
name: Daily Sync

on:
  schedule:
    # Run daily at 02:00 UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger from GitHub UI

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Trigger sync endpoint
        run: |
          HTTP_STATUS=$(curl -s -o /tmp/response.txt -w "%{http_code}" \
            -X POST "${{ secrets.SYNC_URL }}" \
            -H "Authorization: Bearer ${{ secrets.SYNC_SECRET }}" \
            -H "Content-Type: application/json" \
            --max-time 30 \
            --retry 3 \
            --retry-delay 10)

          echo "HTTP Status: $HTTP_STATUS"
          echo "Response:"
          cat /tmp/response.txt
          echo ""

          if [ "$HTTP_STATUS" -ne 200 ]; then
            echo "::error::Sync failed with HTTP status $HTTP_STATUS"
            exit 1
          fi

          # Check if the response indicates success
          SUCCESS=$(cat /tmp/response.txt | grep -o '"success":true' || true)
          if [ -z "$SUCCESS" ]; then
            echo "::error::Sync endpoint returned success=false"
            cat /tmp/response.txt
            exit 1
          fi

          echo "Sync completed successfully"
```

### 9.3 Commit and Push

```bash
git add .github/workflows/sync.yml
git commit -m "ci: add daily sync workflow"
git push origin main
```

### 9.4 Verify the Workflow

1. Go to your repository on GitHub.
2. Click the **Actions** tab.
3. You should see the "Daily Sync" workflow listed.
4. Click **Run workflow** to trigger it manually for the first time.
5. Check the workflow run logs to confirm it succeeded.

After the first successful sync, the dashboard will show real data from GitHub.

## 10. Custom Domain (Optional)

To use your own domain instead of `*.pages.dev`:

1. In your Pages project, go to **Custom domains**.

2. Click **Set up a custom domain**.

3. Enter your domain (e.g., `gitpulse.yourdomain.com`).

4. Click **Continue**.

5. Cloudflare will provide DNS records to add:
   - If your domain is already on Cloudflare: the CNAME record is added automatically.
   - If your domain is elsewhere: add a CNAME record pointing `gitpulse` to `gitpulse.pages.dev`.

6. Wait for DNS propagation (usually a few minutes on Cloudflare, up to 24 hours elsewhere).

7. SSL is provisioned automatically once DNS is verified.

## 11. Verify the Deployment

Run through this checklist to confirm everything works:

1. **Homepage loads** -- Visit `https://your-project.pages.dev`. The dashboard should render without errors.

2. **API responds** -- Open `https://your-project.pages.dev/api/trending` in a browser. You should see a JSON response with `success: true`.

3. **Database has data** -- Open `https://your-project.pages.dev/api/trending?pageSize=5`. If the sync has run, `data` should contain real repositories.

4. **Filters work** -- Try `?language=TypeScript`, `?topic=ai`, `?search=react`, `?range=weekly`.

5. **Sync endpoint works** -- From a terminal:
   ```bash
   curl -X POST "https://your-project.pages.dev/api/sync" \
     -H "Authorization: Bearer YOUR_SYNC_SECRET"
   ```
   You should get back a JSON response with `success: true` and sync details.

6. **GitHub Actions runs** -- Check the Actions tab in your repo. The daily workflow should have run (or you can trigger it manually).

## 12. Troubleshooting

### Build fails with TypeScript errors

The build command includes `vue-tsc --noEmit` for type checking. If the build fails:

- Check the build logs in the Cloudflare dashboard for specific TypeScript errors.
- Run `npm run build` locally to reproduce and fix the issue.

### API returns mock data instead of real data

This means the D1 database is either empty or not bound correctly.

1. **Check the D1 binding**: Settings > Functions > D1 bindings. Variable name must be exactly `DB`.
2. **Check the database**: Go to D1 > gitpulse-db > Console. Run `SELECT COUNT(*) FROM repos;`. If it returns 0, the sync has not run yet.
3. **Run the sync**: Trigger it manually via the API or GitHub Actions.

### Sync endpoint returns 401 Unauthorized

The `SYNC_SECRET` is missing or does not match.

1. Verify the `SYNC_SECRET` environment variable in Cloudflare Pages settings.
2. Verify the `SYNC_SECRET` repository secret in GitHub matches.
3. Make sure the GitHub Actions workflow is sending the correct header: `Authorization: Bearer <secret>`.

### Sync endpoint returns 500

The `GITHUB_TOKEN` may be invalid or missing.

1. Check that `GITHUB_TOKEN` is set in the Pages environment variables.
2. Verify the token has not expired on GitHub.
3. Check that the token has the `public_repo` scope.
4. Look at the sync response body for the specific error message.

### D1 binding error: "DB is not defined"

The Pages function cannot find the D1 binding.

1. Go to Settings > Functions in your Pages project.
2. Confirm the binding exists with variable name `DB` and points to `gitpulse-db`.
3. Redeploy after adding or changing bindings.

### GitHub Actions workflow does not trigger

1. Make sure the workflow file is on the `main` branch (or your production branch).
2. Check that the cron syntax is correct: `0 2 * * *` for 02:00 UTC daily.
3. GitHub disables scheduled workflows in repos with no activity in 60 days. Push a commit to re-enable.
4. Verify the `SYNC_URL` and `SYNC_SECRET` secrets are set in the repository settings.

### Pages free tier limits

Cloudflare Pages free tier includes:

- 500 builds per month
- 100,000 requests per day to Functions
- 1 GB D1 storage
- 5 million D1 rows read per day
- 100,000 D1 rows written per day

For a project of this size, these limits are more than sufficient. Monitor usage in the Cloudflare Dashboard under **Workers & Pages** > your project > **Analytics**.

### Local development without D1

When running `npm run dev` locally, there is no D1 database available. The API functions automatically fall back to mock data so the UI is fully functional without a database connection.

To test with a real D1 database locally:

1. Update `wrangler.toml` with your D1 database ID.
2. Run `npx wrangler pages dev dist --d1 DB=gitpulse-db` (after building).
3. Or use `npm run db:init` to initialize a local D1 database via wrangler.
