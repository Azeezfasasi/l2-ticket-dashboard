<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import RefreshButton from '@/components/RefreshButton.vue'
import KPICards from '@/components/KPICards.vue'
import Chart from '@/components/Chart.vue'

const store = useTicketStore()

// Filter to only these 6 assignees
const allowedAssignees = [
  'Taofiq Ojuolape',
  'Oluwasegun Ayandokun',
  'Abisinuola Layade',
  'Azeez Fasasi',
  'Dayo Olanipekun',
  'John J',
]

// State for assignee filter
const selectedAssignees = ref<string[]>([...allowedAssignees])
const isDropdownOpen = ref(false)

const filteredTicketsForCharts = computed(() =>
  store.tickets.filter(t => 
    allowedAssignees.includes(t.assignee || '') &&
    selectedAssignees.value.includes(t.assignee || '')
  )
)

// Toggle assignee selection
const toggleAssignee = (assignee: string) => {
  const index = selectedAssignees.value.indexOf(assignee)
  if (index > -1) {
    selectedAssignees.value.splice(index, 1)
  } else {
    selectedAssignees.value.push(assignee)
  }
}

// Select all assignees
const selectAll = () => {
  selectedAssignees.value = [...allowedAssignees]
}

// Clear all assignees
const clearAll = () => {
  selectedAssignees.value = []
}

// Make chart data reactive using computed() - filtered for allowed assignees only
const priorityChartLabels = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  return Object.keys(grouped)
})

const priorityChartData = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  return Object.values(grouped)
})

const statusChartLabels = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  return Object.keys(grouped)
})

const statusChartData = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  return Object.values(grouped)
})

const assigneeChartLabels = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      if (t.assignee) {
        acc[t.assignee] = (acc[t.assignee] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )
  return Object.keys(grouped).sort()
})

const assigneeChartData = computed(() => {
  const grouped = filteredTicketsForCharts.value.reduce(
    (acc, t) => {
      if (t.assignee) {
        acc[t.assignee] = (acc[t.assignee] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )
  const sorted = Object.keys(grouped).sort()
  return sorted.map(key => grouped[key] ?? 0)
})

const kpiMetrics = computed(() => {
  const filtered = filteredTicketsForCharts.value
  return [
    { label: 'Open Tickets', value: filtered.length },
    { label: 'Unassigned Tickets', value: filtered.filter((t) => !t.assignee).length },
    { label: 'Waiting for Support', value: filtered.filter((t) => t.status === 'Waiting for support').length },
    { label: 'Waiting For Customer', value: filtered.filter((t) => t.status === 'Waiting for customer').length },
    { label: 'In-Progress', value: filtered.filter((t) => t.status === 'In Progress' || t.status === 'Work in progress').length },
    { label: 'Pending', value: filtered.filter((t) => t.status === 'Pending').length },
    { label: 'Escalated To L3', value: filtered.filter((t) => t.status === 'Escalated to L3').length },
    { label: 'New Request', value: filtered.filter((t) => t.status === 'New Request').length },
    { label: 'Under Investigation with L3', value: filtered.filter((t) => t.status === 'Under Investigation with L3').length },
    { label: 'Under Investigation with L2', value: filtered.filter((t) => t.status === 'Under Investigation with L2').length },
    { label: 'Waiting for approval', value: filtered.filter((t) => t.status === 'Waiting for approval').length },
    { label: 'Critical Tickets', value: filtered.filter((t) => t.priority === 'Critical').length },
    { label: 'Priority 3 - Standard', value: filtered.filter((t) => t.priority === 'Priority 3 - Standard').length },
    { label: 'Minor', value: filtered.filter((t) => t.priority === 'Minor').length },
    { label: 'Major Tickets', value: filtered.filter((t) => t.priority === 'Major').length },
    { label: 'Blocker (HotFix) Tickets', value: filtered.filter((t) => t.priority === 'Blocker (HotFix)').length },
  ]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Refresh Button -->
    <div class="flex flex-col lg:flex-row lg:justify-between items-center lg:items-start">
      <div class="text-center lg:text-left mb-3 lg:mb-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Service Desk Dashboard</h1>
        <p class="text-gray-600 mt-1">Real-time ticket analytics and insights</p>
      </div>
      <RefreshButton />
    </div>

    <!-- Assignee Filter Dropdown with Checkboxes -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row items-center gap-4">
        <label class="text-lg font-semibold text-gray-900">Filter by Assignee:</label>
        <div class="relative flex-1">
          <button
            @click="isDropdownOpen = !isDropdownOpen"
            class="w-full px-16 lg:px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span class="text-gray-700">
              {{ selectedAssignees.length === allowedAssignees.length ? 'All Selected' : `${selectedAssignees.length} Selected` }}
            </span>
            <svg :class="['w-5 h-5 transition-transform', isDropdownOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            <!-- All/None Buttons -->
            <div class="px-4 py-3 border-b border-gray-200 flex gap-2">
              <button
                @click="selectAll"
                class="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
              >
                All
              </button>
              <button
                @click="clearAll"
                class="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium transition-colors"
              >
                None
              </button>
            </div>
            
            <!-- Checkbox Options -->
            <div class="max-h-64 overflow-y-auto">
              <label
                v-for="assignee in allowedAssignees"
                :key="assignee"
                class="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="selectedAssignees.includes(assignee)"
                  @change="toggleAssignee(assignee)"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="ml-3 text-gray-700">{{ assignee }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Close dropdown when clicking outside -->
        <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>
      </div>
      <div class="text-sm text-gray-600 mt-2">
        Showing {{ selectedAssignees.length }} of {{ allowedAssignees.length }} assignees
      </div>
    </div>

    <!-- KPI Cards -->
    <KPICards :metrics="kpiMetrics" />

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Chart
        type="pie"
        title="Tickets by Priority"
        :labels="priorityChartLabels"
        :data="priorityChartData"
        :backgroundColor="['#ef4444', '#f59e0b', '#fbbf24', '#10b981']"
      />
      <Chart
        type="pie"
        title="Tickets by Status"
        :labels="statusChartLabels"
        :data="statusChartData"
        :backgroundColor="['#3b82f6', '#8b5cf6', '#10b981', '#9ca3af']"
      />
      <Chart
        type="pie"
        title="Assignee Workload"
        :labels="assigneeChartLabels"
        :data="assigneeChartData"
        :backgroundColor="['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']"
      />
    </div>
  </div>
</template>
