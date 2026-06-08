<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  option: EChartsOption
  height?: string
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const DARK_THEME: Record<string, unknown> = {
  backgroundColor: 'transparent',
  textStyle: { color: 'rgba(255,255,255,0.5)' },
  title: { textStyle: { color: 'rgba(255,255,255,0.8)' } },
  legend: { textStyle: { color: 'rgba(255,255,255,0.5)' } },
  tooltip: {
    backgroundColor: 'rgba(10,10,30,0.9)',
    borderColor: 'rgba(100,200,255,0.15)',
    textStyle: { color: '#fff' },
  },
  xAxis: {
    axisLine: { lineStyle: { color: 'rgba(100,200,255,0.12)' } },
    axisTick: { lineStyle: { color: 'rgba(100,200,255,0.08)' } },
    axisLabel: { color: 'rgba(255,255,255,0.35)' },
    splitLine: { lineStyle: { color: 'rgba(100,200,255,0.05)' } },
  },
  yAxis: {
    axisLine: { lineStyle: { color: 'rgba(100,200,255,0.12)' } },
    axisTick: { lineStyle: { color: 'rgba(100,200,255,0.08)' } },
    axisLabel: { color: 'rgba(255,255,255,0.35)' },
    splitLine: { lineStyle: { color: 'rgba(100,200,255,0.05)' } },
  },
}

function initChart() {
  if (!chartRef.value) return
  echarts.registerTheme('gitpulse-dark', DARK_THEME)
  chartInstance = echarts.init(chartRef.value, 'gitpulse-dark')
  chartInstance.setOption(props.option)
}

function handleResize() {
  chartInstance?.resize()
}

watch(
  () => props.option,
  (opt) => {
    chartInstance?.setOption(opt, { notMerge: true })
  },
  { deep: true },
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div
    ref="chartRef"
    class="trend-chart"
    :style="{ height: height || '320px' }"
  ></div>
</template>

<style scoped lang="scss">
.trend-chart {
  width: 100%;
  border-radius: 12px;
}
</style>
