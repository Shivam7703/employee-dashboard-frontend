import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff, Work, Login as LoginIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { login } from '../../store/slices/authSlice'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    if (result.payload?.role) {
      navigate(result.payload.role === 'admin' ? '/admin' : '/employee')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background circles */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            translateX: [0, 100, 0],
            translateY: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '10%',
            left: '10%',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            translateX: [0, -100, 0],
            translateY: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            bottom: '10%',
            right: '10%',
          }}
        />
      </Box>

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box textAlign="center" mb={4}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Work sx={{ fontSize: 60, color: '#667eea' }} />
              </motion.div>
              <Typography variant="h4" fontWeight="bold" mt={2}>
                Employee Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Sign in to access your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
                variant="outlined"
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
                variant="outlined"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a67d8 30%, #6b46a0 90%)',
                  },
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
              <strong>Demo Credentials:</strong>
              <br />
              Admin: admin@example.com / admin123
              <br />
              Employee: employee@example.com / employee123
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Login