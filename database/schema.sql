-- GitPulse D1 Database Schema

CREATE TABLE IF NOT EXISTS repos (
  id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL UNIQUE,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  owner_avatar TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS snapshots (
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
  FOREIGN KEY (repo_id) REFERENCES repos(id),
  UNIQUE(repo_id, date)
);

CREATE TABLE IF NOT EXISTS repo_topics (
  repo_id INTEGER NOT NULL,
  topic TEXT NOT NULL,
  FOREIGN KEY (repo_id) REFERENCES repos(id),
  UNIQUE(repo_id, topic)
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sync_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  total_repos INTEGER NOT NULL DEFAULT 0,
  message TEXT DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_snapshots_date ON snapshots(date);
CREATE INDEX IF NOT EXISTS idx_snapshots_repo_date ON snapshots(repo_id, date);
CREATE INDEX IF NOT EXISTS idx_repo_topics_topic ON repo_topics(topic);
CREATE INDEX IF NOT EXISTS idx_repo_topics_repo ON repo_topics(repo_id);
CREATE INDEX IF NOT EXISTS idx_repos_language ON repos(language);
CREATE INDEX IF NOT EXISTS idx_repos_stars ON repos(stars DESC);
