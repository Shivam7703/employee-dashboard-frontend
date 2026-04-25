import React from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Lock } from '@mui/icons-material'
import { motion } from 'framer-motion'

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <Lock sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have permission to access this page.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default Unauthorized