<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dataSources = [
  {
    titleKey: 'about.githubApiTitle',
    descKey: 'about.githubApiDesc',
    icon: '&#128640;',
    stickyBg: '#fef9c3',
  },
  {
    titleKey: 'about.dailySnapshotsTitle',
    descKey: 'about.dailySnapshotsDesc',
    icon: '&#128197;',
    stickyBg: '#dbeafe',
  },
  {
    titleKey: 'about.databaseTitle',
    descKey: 'about.databaseDesc',
    icon: '&#9729;',
    stickyBg: '#dcfce7',
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
        <article
          v-for="src in dataSources"
          :key="src.titleKey"
          class="source-card"
          :style="{ '--sticky-bg': src.stickyBg }"
        >
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
        <div v-for="step in algorithmSteps" :key="step.step" class="algo-step">
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
      <div class="disclaimer">
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
$text: #1f2937;
$text-body: #374151;
$text-muted: #6b7280;
$border: #d1d5db;
$shadow: 3px 3px 0 rgba(0, 0, 0, 0.06);
$shadow-hover: 5px 5px 0 rgba(0, 0, 0, 0.08);

.about {
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Caveat', cursive;
  margin: 0 0 1rem;
  color: $text;
}

.intro {
  color: $text-muted;
  font-size: 1.05rem;
  font-family: 'Patrick Hand', cursive;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 800px;
}

/* Section */
.section {
  margin-bottom: 2.5rem;

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
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
      border-radius: 1px;
      background: #1f2937;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  background: var(--sticky-bg, #ffffff);
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;
  transform: rotate(-0.5deg);

  &:nth-child(2n) {
    transform: rotate(0.5deg);
  }

  &:nth-child(3n) {
    transform: rotate(-1deg);
  }

  &:hover {
    transform: translateY(-3px) rotate(0deg);
    box-shadow: $shadow-hover;
  }

  &__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    color: $text;
    margin: 0 0 0.5rem;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.9rem;
    font-family: 'Patrick Hand', cursive;
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
    background: $border;
    border-style: dashed;
    border-left: 2px dashed $border;
    background: transparent;
  }
}

.algo-step {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  position: relative;
  background: #ffffff;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;

  &__number {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #fef9c3;
    border: 2px solid #d1d5db;
    color: #92400e;
    font-weight: 700;
    font-size: 0.85rem;
    font-family: 'Caveat', cursive;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.04);
    z-index: 1;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    color: $text;
    margin: 0 0 0.375rem;
  }

  &__desc {
    color: $text-muted;
    font-size: 0.88rem;
    font-family: 'Patrick Hand', cursive;
    line-height: 1.5;
    margin: 0;
  }
}

/* Disclaimer */
.disclaimer {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #fef9c3;
  border: 1.5px solid $border;
  border-radius: 3px;
  box-shadow: $shadow;

  &__icon {
    font-size: 1.75rem;
    flex-shrink: 0;
    color: #b45309;
  }

  &__body {
    p {
      color: $text-muted;
      font-size: 0.9rem;
      font-family: 'Patrick Hand', cursive;
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
  border-top: 2px dashed $border;
  margin-top: 2rem;

  p {
    color: $text-muted;
    font-size: 0.85rem;
    font-family: 'Patrick Hand', cursive;
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
