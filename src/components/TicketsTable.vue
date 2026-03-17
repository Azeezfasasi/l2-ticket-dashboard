<script setup lang="ts">
import { computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const store = useTicketStore()

const getPriorityBadge = (priority: string) => {
  const colorMap: Record<string, string> = {
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  }
  return colorMap[priority] || 'bg-gray-100 text-gray-800'
}

const getStatusBadge = (status: string) => {
  const colorMap: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const selectedItemsPerPage = computed({
  get: () => store.itemsPerPage,
  set: (value: number) => store.setItemsPerPage(value),
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Table Controls -->
    <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <div>
        <span class="text-sm text-gray-600">
          Showing <span class="font-semibold">{{ (store.currentPage - 1) * store.itemsPerPage + 1 }}</span>
          to
          <span class="font-semibold">{{
            Math.min(store.currentPage * store.itemsPerPage, store.filteredTickets.length)
          }}</span>
          of <span class="font-semibold">{{ store.filteredTickets.length }}</span>
          tickets
        </span>
      </div>
      <div>
        <label for="items-per-page" class="text-sm text-gray-600 mr-2">Items per page:</label>
        <select
          id="items-per-page"
          v-model.number="selectedItemsPerPage"
          class="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-blue-100 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Summary</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Assignee</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Days Open</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in store.paginatedTickets" :key="ticket.id" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ ticket.ticketId }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ ticket.summary }}</td>
            <td class="px-6 py-4 text-sm">
              <span :class="`inline-block px-2 py-1 text-xs font-semibold rounded ${getPriorityBadge(ticket.priority)}`">
                {{ ticket.priority }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span :class="`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(ticket.status)}`">
                {{ ticket.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ ticket.assignee || '—' }}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ ticket.daysOpen }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <button
        @click="store.goToPage(store.currentPage - 1)"
        :disabled="store.currentPage === 1"
        class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
          Page <span class="font-semibold">{{ store.currentPage }}</span> of
          <span class="font-semibold">{{ store.totalPages }}</span>
        </span>
      </div>
      <button
        @click="store.goToPage(store.currentPage + 1)"
        :disabled="store.currentPage === store.totalPages"
        class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>
