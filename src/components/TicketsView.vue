<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'
import FilterPanel from '@/components/FilterPanel.vue'
import TicketsTable from '@/components/TicketsTable.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">All Tickets</h1>
      <p class="text-gray-600 mt-1">Search, filter, and manage all service desk tickets</p>
    </div>

    <!-- Filter Panel -->
    <FilterPanel :tickets="useTicketStore().paginatedTickets" />

    <!-- Tickets Table -->
    <TicketsTable :tickets="useTicketStore().paginatedTickets" />
  </div>
</template>
