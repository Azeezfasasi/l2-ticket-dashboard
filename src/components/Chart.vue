<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Bar, Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  type: 'bar' | 'pie' | 'line'
  title: string
  labels: string[]
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: () => [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
  ],
  borderColor: '#ffffff',
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      data: props.data,
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 14,
        weight: 'bold' as const,
      },
    },
  },
}))
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96">
    <component :is="type === 'bar' ? Bar : type === 'pie' ? Pie : Line" :data="chartData" :options="chartOptions" />
  </div>
</template>
