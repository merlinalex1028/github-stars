<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}>()
</script>

<template>
  <div class="stat-card">
    <div class="card-header">
      <span v-if="icon" class="card-icon">{{ icon }}</span>
      <span class="card-title">{{ title }}</span>
    </div>
    <div class="card-value">{{ value }}</div>
    <div v-if="trend && trendValue" class="card-trend" :class="trend">
      <span class="trend-arrow">
        {{ trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→' }}
      </span>
      <span class="trend-text">{{ trendValue }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(100, 200, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: rgba(0, 229, 255, 0.2);
    box-shadow: 0 0 24px rgba(0, 229, 255, 0.06);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-icon {
  font-size: 18px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 8px;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;

  &.up {
    color: #00e676;
  }

  &.down {
    color: #ff5252;
  }

  &.neutral {
    color: rgba(255, 255, 255, 0.4);
  }
}

.trend-arrow {
  font-size: 15px;
}

.trend-text {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 400;
}
</style>
