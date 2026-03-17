export interface Ticket {
  id: string
  ticketId: string
  summary: string
  description?: string
  issueType: 'Incident' | 'Service Request'
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Priority 3 - Standard' | 'Major' | 'Minor' | 'Blocker (HotFix)'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Waiting for support' | 'Escalated to L3' | 'Waiting for customer' | 'Under Investigation with L3' | 'Under Investigation with L2' | 'Work in progress' | 'Waiting for approval' | 'Pending' | 'New Request'
  assignee?: string
  reporter?: string
  daysOpen: number
  createdDate: string
  resolvedDate?: string
  category?: string
}

export interface FilterOptions {
  priority?: string[]
  status?: string[]
  assignee?: string[]
  dateRange?: {
    start: string
    end: string
  }
}

export interface KPIMetric {
  label: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
}
