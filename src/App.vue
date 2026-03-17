<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (routeName: string) => route.name === routeName
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto py-2 lg:py-0 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:justify-between items-center lg:h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-4 lg:mb-0">
            <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center gap-4 lg:gap-0 justify-center">
              <span class="text-white font-bold text-lg">📊</span>
            </div>
            <span class="text-xl font-bold text-gray-900">L2 Service Desk</span>
          </div>

          <!-- Navigation Links -->
          <div class="flex gap-8">
            <RouterLink
              to="/"
              :class="{
                'text-blue-600 font-semibold border-b-2 border-blue-600': isActive('dashboard'),
                'text-gray-600 hover:text-gray-900': !isActive('dashboard'),
              }"
              class="pb-4 transition-colors"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/tickets"
              :class="{
                'text-blue-600 font-semibold border-b-2 border-blue-600': isActive('tickets'),
                'text-gray-600 hover:text-gray-900': !isActive('tickets'),
              }"
              class="pb-4 transition-colors"
            >
              All Tickets
            </RouterLink>
          </div>

          <!-- User Info -->
          <div class="text-sm text-gray-600">
            Last updated: {{ new Date().toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
