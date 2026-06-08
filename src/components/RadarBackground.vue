<script setup lang="ts">
// Pure CSS radar animation - no props needed
</script>

<template>
  <div class="radar-bg" aria-hidden="true">
    <div class="radar-center"></div>
    <div class="radar-ring ring-1"></div>
    <div class="radar-ring ring-2"></div>
    <div class="radar-ring ring-3"></div>
    <div class="radar-ring ring-4"></div>
    <div class="radar-sweep"></div>
  </div>
</template>

<style scoped lang="scss">
.radar-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.radar-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #00e5ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
  z-index: 2;
}

.radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(0, 229, 255, 0.07);
  transform: translate(-50%, -50%);

  &.ring-1 {
    width: 120px;
    height: 120px;
    border-color: rgba(0, 229, 255, 0.12);
  }

  &.ring-2 {
    width: 240px;
    height: 240px;
  }

  &.ring-3 {
    width: 380px;
    height: 380px;
  }

  &.ring-4 {
    width: 520px;
    height: 520px;
  }
}

.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 260px;
  height: 260px;
  transform-origin: 0 0;
  transform: translate(0, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(0, 229, 255, 0.08) 30deg,
    transparent 60deg
  );
  border-radius: 0 260px 260px 0;
  animation: radar-spin 4s linear infinite;
  z-index: 1;
}

@keyframes radar-spin {
  from {
    transform: translate(0, -50%) rotate(0deg);
  }
  to {
    transform: translate(0, -50%) rotate(360deg);
  }
}
</style>
