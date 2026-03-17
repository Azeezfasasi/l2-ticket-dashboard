import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Ticket, FilterOptions } from '@/types/ticket'

export const useTicketStore = defineStore('tickets', () => {
  // State
  const tickets = ref<Ticket[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<FilterOptions>({})
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // ============================================
  // GOOGLE SHEETS CONFIGURATION
  // ============================================
  // Choose one of the following options:
  
  // Option 1: SHEETY (Recommended - Easiest)
  // const SHEETS_API = 'https://api.sheety.co/YOUR_PROJECT_ID/tickets/rows'
  // const USE_SHEETY = true
  
  // Option 2: GOOGLE SHEETS API DIRECT
  // const SHEET_ID = 'YOUR_SHEET_ID'
  // const API_KEY = 'YOUR_API_KEY'
  // const SHEETS_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Tickets?key=${API_KEY}`
  // const USE_SHEETY = false
  
  // For now, using MOCK DATA for development
  const USE_SHEETY = true
  // New Sheety endpoint - using l2WebTicketsVersion workspace
  const SHEETS_API = `https://api.sheety.co/73eef10e01519aaba5552fe70398e31d/l2WebTicketsVersion/sheet1`

  // Mock data for development
  const initMockData = () => {
    tickets.value = [
      {
        id: '1',
        ticketId: 'TK-001',
        summary: 'SQL Server Alert System - Replication Warning',
        issueType: 'Incident',
        priority: 'High',
        status: 'Open',
        assignee: 'Taofiq',
        reporter: 'John Doe',
        daysOpen: 5,
        createdDate: '2026-03-12',
        category: 'Database',
      },
      {
        id: '2',
        ticketId: 'TK-002',
        summary: 'User access request - Finance Department',
        issueType: 'Service Request',
        priority: 'Medium',
        status: 'In Progress',
        assignee: 'Oluwasegun',
        reporter: 'Jane Smith',
        daysOpen: 2,
        createdDate: '2026-03-15',
        category: 'Access Management',
      },
      {
        id: '3',
        ticketId: 'TK-003',
        summary: 'Email server down',
        issueType: 'Incident',
        priority: 'Critical',
        status: 'Closed',
        assignee: 'Taofiq',
        reporter: 'Admin',
        daysOpen: 1,
        createdDate: '2026-03-16',
        resolvedDate: '2026-03-17',
        category: 'Email',
      },
      {
        id: '4',
        ticketId: 'TK-004',
        summary: 'Software license renewal',
        issueType: 'Service Request',
        priority: 'Low',
        status: 'Open',
        assignee: 'Oluwasegun',
        reporter: 'Manager',
        daysOpen: 10,
        createdDate: '2026-03-07',
        category: 'Licensing',
      },
    ]
  }

  // Computed
  const filteredTickets = computed(() => {
    let result = [...tickets.value]

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (t) =>
          t.summary.toLowerCase().includes(query) ||
          t.ticketId.toLowerCase().includes(query) ||
          t.assignee?.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.value.priority?.length) {
      result = result.filter((t) => filters.value.priority?.includes(t.priority))
    }
    if (filters.value.status?.length) {
      result = result.filter((t) => filters.value.status?.includes(t.status))
    }
    if (filters.value.assignee?.length) {
      result = result.filter((t) =>
        filters.value.assignee?.includes(t.assignee || '')
      )
    }

    return result
  })

  const paginatedTickets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTickets.value.slice(start, end)
  })

  const totalPages = computed(() =>
    Math.ceil(filteredTickets.value.length / itemsPerPage.value)
  )

  const kpis = computed(() => ({
    totalTickets: tickets.value.length,
    openTickets: tickets.value.filter((t) => t.status === 'Open').length,
    avgDaysOpen: Math.round(
      tickets.value.reduce((sum, t) => sum + t.daysOpen, 0) / tickets.value.length
    ),
    criticalTickets: tickets.value.filter((t) => t.priority === 'Critical').length,
  }))

  const ticketsByPriority = computed(() => {
    const grouped = tickets.value.reduce(
      (acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const result = Object.entries(grouped).map(([priority, count]) => ({
      priority,
      count,
    }))
    console.log('ticketsByPriority computed:', result)
    return result
  })

  const ticketsByStatus = computed(() => {
    const grouped = tickets.value.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }))
  })

  const assigneeWorkload = computed(() => {
    const grouped = tickets.value.reduce(
      (acc, t) => {
        if (t.assignee) {
          acc[t.assignee] = (acc[t.assignee] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(grouped)
      .map(([assignee, count]) => ({
        assignee,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  })

  // Methods
  const fetchTickets = async () => {
    isLoading.value = true
    error.value = null
    try {
      if (!SHEETS_API) {
        // No API configured, use mock data
        initMockData()
        return
      }

      const response = await axios.get(SHEETS_API)

      // DEBUG: Log the response to see the data structure
      console.log('Sheety Response:', response.data)

      if (USE_SHEETY) {
        // Sheety returns: { sheet1: [...] } - access data via sheet name key
        const sheetData = response.data.sheet1 || response.data.Sheet1 || response.data.rows || []
        console.log('Available sheet names:', Object.keys(response.data))
        
        if (sheetData.length === 0) {
          console.warn('No data returned from Sheety API, falling back to mock data')
          initMockData()
        } else {
          tickets.value = sheetData.map((row: Record<string, string>, idx: number) => ({
            id: `${idx}`,
            ticketId: row.key || '',
            summary: row.summary || '',
            issueType: row.issueType || 'Service Request',
            priority: row.priority || 'Medium',
            status: row.status || 'Open',
            assignee: row.assignee || '',
            reporter: row.reporter || '',
            daysOpen: parseInt(row.daysOpened as string) || 0,
            createdDate: row.createdDate || row.created || '',
            resolvedDate: row.updated || '',
            category: row.dayRanged || '',
          }))
          console.log('Loaded tickets from Sheety:', tickets.value.length)
        }
      } else {
        // Parse CSV from Google Sheets export
        const lines = response.data.split('\n').filter((line: string) => line.trim())
        
        if (lines.length > 1) {
          // Parse rows
          tickets.value = lines.slice(1).map((line: string, idx: number) => {
            const cells = line.split(',').map((c: string) => c.trim())
            
            return {
              id: `${idx}`,
              ticketId: cells[0] || '',
              summary: cells[2] || '',
              issueType: cells[1] || 'Service Request',
              priority: cells[5] || 'Medium',
              status: cells[6] || 'Open',
              assignee: cells[3] || '',
              reporter: cells[4] || '',
              daysOpen: parseInt(cells[10] || '0') || 0,
              createdDate: cells[8] || '',
              resolvedDate: cells[9] || '',
              category: cells[11] || '',
            }
          })
          
          console.log('Loaded tickets from CSV:', tickets.value.length)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tickets'
      console.error('Fetch error:', err)
      // Fall back to mock data on error
      initMockData()
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (newFilters: FilterOptions) => {
    filters.value = newFilters
    currentPage.value = 1
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const goToPage = (page: number) => {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
  }

  // Fetch real data on store creation
  fetchTickets()

  return {
    tickets,
    isLoading,
    error,
    filters,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredTickets,
    paginatedTickets,
    totalPages,
    kpis,
    ticketsByPriority,
    ticketsByStatus,
    assigneeWorkload,
    fetchTickets,
    setFilters,
    setSearchQuery,
    goToPage,
    setItemsPerPage,
  }
})
