<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import type { Ticket, FilterOptions } from '@/types/ticket'

const store = useTicketStore()

interface Props {
  tickets: Ticket[]
}

defineProps<Props>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  filter: [filters: FilterOptions]
  search: [query: string]
  sort: [field: string]
}>()

const uniquePriorities = computed(() => [...new Set(store.tickets.map((t) => t.priority))])
const uniqueStatuses = computed(() => [...new Set(store.tickets.map((t) => t.status))])
const uniqueAssignees = computed(() => [...new Set(store.tickets.map((t) => t.assignee).filter(Boolean))])

const selectedPriorities = computed(() => store.filters.priority || [])
const selectedStatuses = computed(() => store.filters.status || [])
const selectedAssignees = computed(() => store.filters.assignee || [])

// Dropdown states
const isPriorityDropdownOpen = ref(false)
const isStatusDropdownOpen = ref(false)
const isAssigneeDropdownOpen = ref(false)

const togglePriority = (priority: string) => {
  const newFilters = { ...store.filters }
  if (!newFilters.priority) newFilters.priority = []
  const index = newFilters.priority.indexOf(priority)
  if (index > -1) {
    newFilters.priority.splice(index, 1)
  } else {
    newFilters.priority.push(priority)
  }
  store.setFilters(newFilters)
}

const toggleStatus = (status: string) => {
  const newFilters = { ...store.filters }
  if (!newFilters.status) newFilters.status = []
  const index = newFilters.status.indexOf(status)
  if (index > -1) {
    newFilters.status.splice(index, 1)
  } else {
    newFilters.status.push(status)
  }
  store.setFilters(newFilters)
}

const toggleAssignee = (assignee: string) => {
  const newFilters = { ...store.filters }
  if (!newFilters.assignee) newFilters.assignee = []
  const index = newFilters.assignee.indexOf(assignee)
  if (index > -1) {
    newFilters.assignee.splice(index, 1)
  } else {
    newFilters.assignee.push(assignee)
  }
  store.setFilters(newFilters)
}

// All/None functions
const selectAllPriorities = () => {
  const newFilters = { ...store.filters }
  newFilters.priority = [...uniquePriorities.value]
  store.setFilters(newFilters)
}

const clearAllPriorities = () => {
  const newFilters = { ...store.filters }
  newFilters.priority = []
  store.setFilters(newFilters)
}

const selectAllStatuses = () => {
  const newFilters = { ...store.filters }
  newFilters.status = [...uniqueStatuses.value]
  store.setFilters(newFilters)
}

const clearAllStatuses = () => {
  const newFilters = { ...store.filters }
  newFilters.status = []
  store.setFilters(newFilters)
}

const selectAllAssignees = () => {
  const newFilters = { ...store.filters }
  newFilters.assignee = uniqueAssignees.value.filter((a): a is string => a !== undefined)
  store.setFilters(newFilters)
}

const clearAllAssignees = () => {
  const newFilters = { ...store.filters }
  newFilters.assignee = []
  store.setFilters(newFilters)
}

// Helper to safely get assignee value
const getAssigneeValue = (assignee: string | undefined): string => assignee || ''

const clearFilters = () => {
  store.setFilters({})
  store.setSearchQuery('')
}

const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.setSearchQuery(target.value)
}
</script>

<template>
  <div class="card p-6 space-y-6 mb-6">
    <!-- Search Bar -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
      <input
        type="text"
        placeholder="Search by ticket ID, summary, or assignee..."
        :value="store.searchQuery"
        @input="handleSearch"
        class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Filter Sections with Dropdowns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Priority Filter Dropdown -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <div class="relative">
          <button
            @click="isPriorityDropdownOpen = !isPriorityDropdownOpen"
            class="w-full px-4 py-2 border border-blue-200 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span class="text-gray-700 text-sm">
              {{ selectedPriorities.length === 0 ? 'Select Priority' : `${selectedPriorities.length} Selected` }}
            </span>
            <svg :class="['w-4 h-4 transition-transform', isPriorityDropdownOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          
          <div v-if="isPriorityDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-blue-200 rounded-lg shadow-lg">
            <div class="px-3 py-2 border-b border-blue-200 flex gap-2">
              <button
                @click="selectAllPriorities"
                class="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
              >
                All
              </button>
              <button
                @click="clearAllPriorities"
                class="flex-1 px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium transition-colors"
              >
                None
              </button>
            </div>
            <div class="max-h-48 overflow-y-auto">
              <label
                v-for="priority in uniquePriorities"
                :key="priority"
                class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="selectedPriorities.includes(priority)"
                  @change="togglePriority(priority)"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ priority }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="isPriorityDropdownOpen" @click="isPriorityDropdownOpen = false" class="fixed inset-0 z-40"></div>
      </div>

      <!-- Status Filter Dropdown -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div class="relative">
          <button
            @click="isStatusDropdownOpen = !isStatusDropdownOpen"
            class="w-full px-4 py-2 border border-blue-200 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span class="text-gray-700 text-sm">
              {{ selectedStatuses.length === 0 ? 'Select Status' : `${selectedStatuses.length} Selected` }}
            </span>
            <svg :class="['w-4 h-4 transition-transform', isStatusDropdownOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          
          <div v-if="isStatusDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div class="px-3 py-2 border-b border-gray-200 flex gap-2">
              <button
                @click="selectAllStatuses"
                class="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
              >
                All
              </button>
              <button
                @click="clearAllStatuses"
                class="flex-1 px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium transition-colors"
              >
                None
              </button>
            </div>
            <div class="max-h-48 overflow-y-auto">
              <label
                v-for="status in uniqueStatuses"
                :key="status"
                class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="selectedStatuses.includes(status)"
                  @change="toggleStatus(status)"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ status }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="isStatusDropdownOpen" @click="isStatusDropdownOpen = false" class="fixed inset-0 z-40"></div>
      </div>

      <!-- Assignee Filter Dropdown -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
        <div class="relative">
          <button
            @click="isAssigneeDropdownOpen = !isAssigneeDropdownOpen"
            class="w-full px-4 py-2 border border-blue-200 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span class="text-gray-700 text-sm">
              {{ selectedAssignees.length === 0 ? 'Select Assignee' : `${selectedAssignees.length} Selected` }}
            </span>
            <svg :class="['w-4 h-4 transition-transform', isAssigneeDropdownOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          
          <div v-if="isAssigneeDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div class="px-3 py-2 border-b border-gray-200 flex gap-2">
              <button
                @click="selectAllAssignees"
                class="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
              >
                All
              </button>
              <button
                @click="clearAllAssignees"
                class="flex-1 px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium transition-colors"
              >
                None
              </button>
            </div>
            <div class="max-h-48 overflow-y-auto">
              <label
                v-for="assignee in uniqueAssignees"
                :key="assignee"
                class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="selectedAssignees.includes(getAssigneeValue(assignee))"
                  @change="toggleAssignee(getAssigneeValue(assignee))"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ assignee }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="isAssigneeDropdownOpen" @click="isAssigneeDropdownOpen = false" class="fixed inset-0 z-40"></div>
      </div>
    </div>

    <!-- Clear Button -->
    <div class="flex justify-end">
      <button
        @click="clearFilters"
        class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>
