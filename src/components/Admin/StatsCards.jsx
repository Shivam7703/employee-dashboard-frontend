import React from 'react'
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material'
import { motion } from 'framer-motion'
import {
  People,
  CheckCircle,
  Pending,
  BeachAccess,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchStats = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('No token found')
  }
  const { data } = await axios.get('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

const StatsCards = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats,
    refetchInterval: 30000,
    retry: 1,
  })

  const cards = [
    { title: 'Total Employees', value: stats?.totalEmployees || 0, icon: <People />, color: '#3b82f6', change: '+12%' },
    { title: 'Present Today', value: stats?.presentToday || 0, icon: <CheckCircle />, color: '#10b981', change: '+5%' },
    { title: 'Pending Tasks', value: stats?.pendingTasks || 0, icon: <Pending />, color: '#f59e0b', change: '-3%' },
    { title: 'Completed Today', value: stats?.completedTasks || 0, icon: <TrendingUp />, color: '#8b5cf6', change: '+18%' },
    { title: 'On Leave', value: stats?.onLeave || 0, icon: <BeachAccess />, color: '#ef4444', change: '0%' },
    { title: 'Monthly Salary', value: `₹${(stats?.monthlySalary || 0).toLocaleString()}`, icon: <AttachMoney />, color: '#06b6d4', change: '+8%' },
  ]

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">Failed to load stats: {error.message}</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${card.color}15, white)`,
                border: `1px solid ${card.color}30`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ 
                  color: card.color,
                  '& svg': { fontSize: 32 }
                }}>
                  {card.icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: card.change.startsWith('+') ? '#10b981' : '#ef4444',
                    bgcolor: card.change.startsWith('+') ? '#10b98120' : '#ef444420',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {card.change}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {card.title}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatsCards