import React from 'react'
import { Chip, Box, Typography } from '@mui/material'
import { CheckCircle, Cancel, AccessTime, Pending } from '@mui/icons-material'

const StatusBadge = ({ status, type, size = 'small' }) => {
  const getConfig = () => {
    switch (type) {
      case 'task':
        switch (status) {
          case 'pending':
            return { label: 'Pending', color: '#f59e0b', icon: <Pending />, bg: '#f59e0b20' }
          case 'working':
            return { label: 'Working', color: '#3b82f6', icon: <AccessTime />, bg: '#3b82f620' }
          case 'completed':
            return { label: 'Completed', color: '#10b981', icon: <CheckCircle />, bg: '#10b98120' }
          default:
            return { label: status, color: '#6b7280', icon: null, bg: '#e5e7eb' }
        }
      
      case 'attendance':
        switch (status) {
          case 'present':
            return { label: 'Present', color: '#10b981', icon: <CheckCircle />, bg: '#10b98120' }
          case 'absent':
            return { label: 'Absent', color: '#ef4444', icon: <Cancel />, bg: '#ef444420' }
          case 'late':
            return { label: 'Late', color: '#f59e0b', icon: <AccessTime />, bg: '#f59e0b20' }
          case 'half-day':
            return { label: 'Half Day', color: '#8b5cf6', icon: <AccessTime />, bg: '#8b5cf620' }
          default:
            return { label: status, color: '#6b7280', icon: null, bg: '#e5e7eb' }
        }
      
      default:
        return { label: status, color: '#6b7280', icon: null, bg: '#e5e7eb' }
    }
  }

  const config = getConfig()

  return (
    <Chip
      label={config.label}
      size={size}
      icon={config.icon}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        '& .MuiChip-icon': { color: config.color },
        fontWeight: 500,
      }}
    />
  )
}

export default StatusBadge