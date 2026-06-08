<script setup lang="ts">
const dataSources = [
  {
    title: 'GitHub REST API',
    description: 'Repository metadata, star counts, fork counts, topics, and language information are fetched directly from the GitHub API.',
    icon: '&#128640;',
  },
  {
    title: 'Daily Snapshots',
    description: 'A scheduled sync job captures daily snapshots of all tracked repositories, recording star and fork deltas to compute trend data.',
    icon: '&#128197;',
  },
  {
    title: 'Cloudflare D1 Database',
    description: 'All data is stored in a Cloudflare D1 (SQLite) database, enabling fast serverless queries at the edge.',
    icon: '&#9729;',
  },
]

const algorithmSteps = [
  {
    step: 1,
    title: 'Star Velocity',
    description: 'Measure the number of new stars gained in the selected time window (today, weekly, or monthly). Higher velocity indicates rising popularity.',
  },
  {
    step: 2,
    title: 'Fork Activity',
    description: 'Track fork creation rate as a proxy for active development interest and community contribution potential.',
  },
  {
    step: 3,
    title: 'Issue Engagement',
    description: 'Factor in open issue counts and recent push activity to gauge active maintenance and community health.',
  },
  {
    step: 4,
    title: 'Weighted Composite Score',
    description: 'Combine all signals into a single trend score using weighted coefficients. Star velocity carries the highest weight (60%), followed by fork activity (25%) and engagement (15%).',
  },
  {
    step: 5,
    title: 'Ranking & Change Detection',
    description: 'Sort all repositories by their composite score. Track rank changes between snapshots to surface rising and falling projects.',
  },
]
</script>

<template>
  <div class="about">
    <h1 class="page-title">About GitPulse</h1>

    <p class="intro">
      GitPulse is an open-source analytics dashboard that tracks GitHub trending repositories
      in real time. It provides star velocity analysis, language distribution, topic trends,
      and a proprietary trend scoring algorithm to surface the most interesting projects on GitHub.
    </p>

    <!-- Data Sources -->
    <section class="section">
      <h2 class="section__title">Data Sources</h2>
      <div class="source-grid">
        <article v-for="src in dataSources" :key="src.title" class="source-card glass">
          <div class="source-card__icon" v-html="src.icon" />
          <h3 class="source-card__title">{{ src.title }}</h3>
          <p class="source-card__desc">{{ src.description }}</p>
        </article>
      </div>
    </section>

    <!-- Algorithm -->
    <section class="section">
      <h2 class="section__title">Ranking Algorithm</h2>
      <div class="algo-timeline">
        <div v-for="step in algorithmSteps" :key="step.step" class="algo-step glass">
          <div class="algo-step__number">{{ step.step }}</div>
          <div class="algo-step__content">
            <h3 class="algo-step__title">{{ step.title }}</h3>
            <p class="algo-step__desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="section">
      <h2 class="section__title">Disclaimer</h2>
      <div class="disclaimer glass">
        <div class="disclaimer__icon">&#9888;</div>
        <div class="disclaimer__body">
          <p>
            GitPulse is an independent project and is not affiliated with, endorsed by, or connected to GitHub, Inc.
            All GitHub logos, trademarks, and data are the property of their respective owners.
          </p>
          <p>
            Trend scores are algorithmic estimates based on publicly available data and should not be considered
            financial or investment advice. Past star activity does not guarantee future popularity.
          </p>
          <p>
            Data accuracy depends on the GitHub API and the sync schedule. There may be delays or gaps
            in historical data. Use this tool as a directional reference, not a definitive ranking.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="about-footer">
      <p>GitPulse &mdash; Built with Vue 3, Cloudflare Workers &amp; D1</p>
      <p class="about-footer__version">v1.0.0</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
$max-width: 1280px;
$bg: #050816;
$card-bg: #0B1026;
$border: rgba(99, 102, 241, 0.15);
$glow: #6366f1;
$text: #e2e8f0;
$text-muted: #94a3b8;

.about {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.glass {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.06);
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, $glow, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.intro {
  color: $text-muted;
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 800px;
}

/* Section */
.section {
  margin-bottom: 2.5rem;

  &__title {
    font-size: 1.5rem;
    font-weight: 800;
    color: $text;
    margin: 0 0 1.25rem;
    position: relative;
    padding-left: 1rem;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.25rem;
      bottom: 0.25rem;
      width: 3px;
      border-radius: 2px;
      background: linear-gradient(180deg, $glow, #ec4899);
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
    }
  }
}

/* Source Grid */
.source-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.source-card {
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.12);
  }

  &__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: $text;
    margin: 0 0 0.5rem;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }
}

/* Algorithm Timeline */
.algo-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 1.75rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, $glow, rgba(99, 102, 241, 0.1));
  }
}

.algo-step {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  position: relative;

  &__number {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $glow;
    color: #fff;
    font-weight: 800;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    z-index: 1;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: $text;
    margin: 0 0 0.375rem;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.88rem;
    line-height: 1.5;
    margin: 0;
  }
}

/* Disclaimer */
.disclaimer {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  border-color: rgba(245, 158, 11, 0.2);

  &__icon {
    font-size: 1.75rem;
    flex-shrink: 0;
    color: #f59e0b;
  }

  &__body {
    p {
      color: $text-muted;
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0 0 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 2rem 0 1rem;
  border-top: 1px solid $border;
  margin-top: 2rem;

  p {
    color: $text-muted;
    font-size: 0.85rem;
    margin: 0;
  }

  &__version {
    margin-top: 0.25rem;
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .source-grid {
    grid-template-columns: 1fr;
  }

  .disclaimer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .algo-timeline::before {
    left: 1.25rem;
  }
}
</style>
