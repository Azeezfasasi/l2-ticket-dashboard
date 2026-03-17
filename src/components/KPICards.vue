<script setup lang="ts">
import type { KPIMetric } from '@/types/ticket'

interface Props {
  metrics: KPIMetric[]
}

defineProps<Props>()

const getPriorityColor = (label: string) => {
  const colorMap: Record<string, string> = {
    Critical: 'bg-red-50 border-red-200',
    High: 'bg-orange-50 border-orange-200',
    Medium: 'bg-yellow-50 border-yellow-200',
    Low: 'bg-green-50 border-green-200',
  }
  return colorMap[label] || 'bg-blue-50 border-blue-200'
}

const getValueColor = (label: string) => {
  const colorMap: Record<string, string> = {
    Critical: 'text-red-600',
    High: 'text-orange-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600',
  }
  return colorMap[label] || 'text-blue-600'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="metric in metrics"
      :key="metric.label"
      :class="`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${getPriorityColor(metric.label)}`"
    >
      <p class="text-sm font-medium text-gray-600">{{ metric.label }}</p>
      <p :class="`text-3xl font-bold mt-2 ${getValueColor(metric.label)}`">
        {{ metric.value }}
      </p>
      <p v-if="metric.change" class="text-xs mt-2 text-gray-500">
        <span :class="metric.changeType === 'increase' ? 'text-red-600' : 'text-green-600'">
          {{ metric.changeType === 'increase' ? '↑' : '↓' }}
          {{ Math.abs(metric.change) }}%
        </span>
      </p>
    </div>
  </div>
</template>
