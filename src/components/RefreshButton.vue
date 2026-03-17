<script setup lang="ts">
import { ref } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const store = useTicketStore()
const isRefreshing = ref(false)

const handleRefresh = async () => {
  isRefreshing.value = true
  await store.fetchTickets()
  isRefreshing.value = false
}
</script>

<template>
  <button
    @click="handleRefresh"
    :disabled="isRefreshing"
    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span v-if="!isRefreshing">🔄 Refresh Data</span>
    <span v-else>⟳ Refreshing...</span>
  </button>
</template>
