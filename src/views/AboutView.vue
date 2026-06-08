<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dataSources = [
  {
    titleKey: 'about.githubApiTitle',
    descKey: 'about.githubApiDesc',
    icon: '&#128640;',
  },
  {
    titleKey: 'about.dailySnapshotsTitle',
    descKey: 'about.dailySnapshotsDesc',
    icon: '&#128197;',
  },
  {
    titleKey: 'about.databaseTitle',
    descKey: 'about.databaseDesc',
    icon: '&#9729;',
  },
]

const algorithmSteps = [
  { step: 1, titleKey: 'about.step1Title', descKey: 'about.step1Desc' },
  { step: 2, titleKey: 'about.step2Title', descKey: 'about.step2Desc' },
  { step: 3, titleKey: 'about.step3Title', descKey: 'about.step3Desc' },
  { step: 4, titleKey: 'about.step4Title', descKey: 'about.step4Desc' },
  { step: 5, titleKey: 'about.step5Title', descKey: 'about.step5Desc' },
]
</script>

<template>
  <div class="about">
    <h1 class="page-title">{{ t('about.pageTitle') }}</h1>

    <p class="intro">
      {{ t('about.intro') }}
    </p>

    <!-- Data Sources -->
    <section class="section">
      <h2 class="section__title">{{ t('about.dataSourcesTitle') }}</h2>
      <div class="source-grid">
        <article v-for="src in dataSources" :key="src.titleKey" class="source-card glass">
          <div class="source-card__icon" v-html="src.icon" />
          <h3 class="source-card__title">{{ t(src.titleKey) }}</h3>
          <p class="source-card__desc">{{ t(src.descKey) }}</p>
        </article>
      </div>
    </section>

    <!-- Algorithm -->
    <section class="section">
      <h2 class="section__title">{{ t('about.algorithmTitle') }}</h2>
      <div class="algo-timeline">
        <div v-for="step in algorithmSteps" :key="step.step" class="algo-step glass">
          <div class="algo-step__number">{{ step.step }}</div>
          <div class="algo-step__content">
            <h3 class="algo-step__title">{{ t(step.titleKey) }}</h3>
            <p class="algo-step__desc">{{ t(step.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="section">
      <h2 class="section__title">{{ t('about.disclaimerTitle') }}</h2>
      <div class="disclaimer glass">
        <div class="disclaimer__icon">&#9888;</div>
        <div class="disclaimer__body">
          <p>{{ t('about.disclaimer1') }}</p>
          <p>{{ t('about.disclaimer2') }}</p>
          <p>{{ t('about.disclaimer3') }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="about-footer">
      <p>{{ t('about.footer') }}</p>
      <p class="about-footer__version">v1.0.0</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
$max-width: 1280px;
$bg: #f8faff;
$card-bg: #ffffff;
$border: rgba(99, 102, 241, 0.12);
$glow: #4f6df5;
$text: #1e293b;
$text-muted: #64748b;

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
              0 1px 2px rgba(0, 0, 0, 0.06),
              0 0 1px rgba(99, 102, 241, 0.06);
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, $glow, #7c3aed);
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
      background: linear-gradient(180deg, $glow, #7c3aed);
      box-shadow: 0 0 8px rgba(79, 109, 245, 0.3);
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
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
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
    background: linear-gradient(180deg, $glow, rgba(79, 109, 245, 0.1));
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
    box-shadow: 0 2px 8px rgba(79, 109, 245, 0.25);
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
    color: #d97706;
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
