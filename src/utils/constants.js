export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  TASKS: '/api/tasks',
  ATTENDANCE: '/api/attendance',
  PAYSLIPS: '/api/payslips',
  CHAT: '/api/chat',
  NOTIFICATIONS: '/api/notifications',
  ADMIN: '/api/admin',
}

export const TASK_STATUS = {
  PENDING: 'pending',
  WORKING: 'working',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
}

export const NOTIFICATION_TYPES = {
  HOLIDAY: 'holiday',
  MEETING: 'meeting',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  TASK: 'task',
}

export const DEPARTMENT = {
  IT: 'IT',
  HR: 'HR',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  OPERATIONS: 'Operations',
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const YEARS = [2023, 2024, 2025, 2026]

export const getMonthName = (month) => MONTHS[month - 1]

export const getStatusColor = (status, type) => {
  if (type === 'task') {
    switch (status) {
      case TASK_STATUS.PENDING: return '#f59e0b'
      case TASK_STATUS.WORKING: return '#3b82f6'
      case TASK_STATUS.COMPLETED: return '#10b981'
      default: return '#6b7280'
    }
  }
  
  if (type === 'attendance') {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT: return '#10b981'
      case ATTENDANCE_STATUS.ABSENT: return '#ef4444'
      case ATTENDANCE_STATUS.LATE: return '#f59e0b'
      case ATTENDANCE_STATUS.HALF_DAY: return '#8b5cf6'
      default: return '#6b7280'
    }
  }
  
  return '#6b7280'
}