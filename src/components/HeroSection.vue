<script setup lang="ts">
import RadarBackground from './RadarBackground.vue'
</script>

<template>
  <section class="hero">
    <RadarBackground />
    <div class="hero-content">
      <h1 class="hero-title">Discover What Developers Are Building</h1>
      <p class="hero-subtitle">
        Real-time GitHub trending analytics powered by stars, forks, and community momentum.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 64px 24px;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.hero-title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ffffff 0%, #00e5ff 50%, #7c4dff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(14px, 2vw, 18px);
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin: 0;
  max-width: 560px;
  margin-inline: auto;
}
</style>
