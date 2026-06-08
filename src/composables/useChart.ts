import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import type { EChartsOption } from 'echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

// --- Color Palette ---
const PALETTE = {
  blue: '#38BDF8',
  cyan: '#22D3EE',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  pink: '#EC4899',
  emerald: '#34D399',
  amber: '#FBBF24',
  rose: '#FB7185',
}

const PALETTE_ARRAY = Object.values(PALETTE)

// --- Dark Theme Defaults ---
const DARK = {
  text: '#CBD5E1',
  axisLine: 'rgba(56,189,248,0.2)',
  splitLine: 'rgba(56,189,248,0.08)',
  tooltipBg: 'rgba(15,23,42,0.92)',
}

// --- Shared Builders ---

function baseGrid(left = 50, right = 20, top = 40, bottom = 30) {
  return { left, right, top, bottom, containLabel: true }
}

function baseTooltip(trigger: 'axis' | 'item' = 'axis') {
  return {
    trigger,
    backgroundColor: DARK.tooltipBg,
    borderColor: 'rgba(56,189,248,0.3)',
    textStyle: { color: DARK.text, fontSize: 12 },
  }
}

function baseAxis(
  type: 'category' | 'value',
  data?: string[],
  opts: Record<string, unknown> = {},
) {
  const common = {
    axisLine: { lineStyle: { color: DARK.axisLine } },
    axisTick: { show: false },
    axisLabel: { color: DARK.text, fontSize: 11 },
    splitLine: { lineStyle: { color: DARK.splitLine } },
    ...opts,
  }
  return type === 'category' ? { type, data, ...common } : { type, ...common }
}

// --- Types ---

export interface StarTrendItem {
  date: string
  count: number
}

export interface LanguagePieItem {
  name: string
  value: number
}

export interface TopicBarItem {
  name: string
  count: number
}

export interface RepoBarItem {
  name: string
  stars: number
}

export interface ForkTrendItem {
  date: string
  count: number
}

// --- Mock Data Generators ---

function generateDates(days: number): string[] {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

export function mockStarTrendData(days = 30): StarTrendItem[] {
  let base = 1200
  return generateDates(days).map((date) => {
    base += Math.floor(Math.random() * 80 - 10)
    return { date, count: Math.max(base, 0) }
  })
}

export function mockLanguagePieData(): LanguagePieItem[] {
  return [
    { name: 'TypeScript', value: 42 },
    { name: 'Rust', value: 18 },
    { name: 'Python', value: 15 },
    { name: 'Go', value: 11 },
    { name: 'JavaScript', value: 8 },
    { name: 'Other', value: 6 },
  ]
}

export function mockTopicHeatmapData(): TopicBarItem[] {
  return [
    { name: 'machine-learning', count: 312 },
    { name: 'web-framework', count: 278 },
    { name: 'cli-tool', count: 215 },
    { name: 'database', count: 189 },
    { name: 'devops', count: 156 },
    { name: 'security', count: 134 },
    { name: 'compiler', count: 98 },
    { name: 'game-engine', count: 76 },
  ]
}

export function mockTopReposData(): RepoBarItem[] {
  return [
    { name: 'deno', stars: 98200 },
    { name: 'tauri', stars: 82400 },
    { name: 'zed', stars: 51300 },
    { name: 'bun', stars: 74100 },
    { name: 'vite', stars: 67800 },
    { name: 'astro', stars: 48200 },
    { name: 'turbo', stars: 26700 },
    { name: 'biome', stars: 15400 },
  ]
}

export function mockForkTrendData(days = 30): ForkTrendItem[] {
  let base = 340
  return generateDates(days).map((date) => {
    base += Math.floor(Math.random() * 20 - 4)
    return { date, count: Math.max(base, 0) }
  })
}

// --- Option Factories ---

export function createStarTrendOption(data: StarTrendItem[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    grid: baseGrid(50, 20, 40, 30),
    tooltip: baseTooltip('axis'),
    xAxis: baseAxis('category', data.map((d) => d.date)),
    yAxis: baseAxis('value'),
    series: [
      {
        type: 'line',
        data: data.map((d) => d.count),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: PALETTE.blue },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56,189,248,0.35)' },
              { offset: 1, color: 'rgba(56,189,248,0.02)' },
            ],
          },
        },
      },
    ],
  }
}

export function createLanguagePieOption(data: LanguagePieItem[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: baseTooltip('item'),
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: DARK.text, fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: 'transparent', borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: DARK.text },
        },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: PALETTE_ARRAY[i % PALETTE_ARRAY.length] },
        })),
      },
    ],
  }
}

export function createTopicHeatmapOption(data: TopicBarItem[]): EChartsOption {
  const sorted = [...data].sort((a, b) => a.count - b.count)
  return {
    backgroundColor: 'transparent',
    grid: baseGrid(110, 30, 20, 30),
    tooltip: baseTooltip('axis'),
    xAxis: baseAxis('value'),
    yAxis: baseAxis('category', sorted.map((d) => d.name)),
    series: [
      {
        type: 'bar',
        data: sorted.map((d, i) => ({
          value: d.count,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: PALETTE.purple },
                { offset: 1, color: PALETTE.cyan },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '60%',
      },
    ],
  }
}

export function createTopReposBarOption(data: RepoBarItem[]): EChartsOption {
  const sorted = [...data].sort((a, b) => a.stars - b.stars)
  return {
    backgroundColor: 'transparent',
    grid: baseGrid(100, 30, 20, 30),
    tooltip: {
      ...baseTooltip('axis'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}<br/>Stars: <b>${(p.value as number).toLocaleString()}</b>`
      },
    },
    xAxis: baseAxis('value'),
    yAxis: baseAxis('category', sorted.map((d) => d.name)),
    series: [
      {
        type: 'bar',
        data: sorted.map((d, i) => ({
          value: d.stars,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: PALETTE.indigo },
                { offset: 1, color: PALETTE.blue },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '55%',
      },
    ],
  }
}

export function createForkTrendOption(data: ForkTrendItem[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    grid: baseGrid(50, 20, 40, 30),
    tooltip: baseTooltip('axis'),
    xAxis: baseAxis('category', data.map((d) => d.date)),
    yAxis: baseAxis('value'),
    series: [
      {
        type: 'line',
        data: data.map((d) => d.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: PALETTE.purple },
        itemStyle: { color: PALETTE.purple, borderWidth: 0 },
      },
    ],
  }
}

// --- Composable ---

export function useChart() {
  return {
    // Option creators
    createStarTrendOption,
    createLanguagePieOption,
    createTopicHeatmapOption,
    createTopReposBarOption,
    createForkTrendOption,
    // Mock data
    mockStarTrendData,
    mockLanguagePieData,
    mockTopicHeatmapData,
    mockTopReposData,
    mockForkTrendData,
    // Theme constants
    PALETTE,
    DARK,
  }
}
