import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Typography,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,  // ← ADD THIS MISSING IMPORT
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications,
  Brightness4,
  Brightness7,
  Person,
  Settings,
  Logout,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import NotificationBell from '../Common/NotificationBell'

const Header = ({ toggleDrawer, toggleTheme, darkMode, onNotificationClick }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
    handleMenuClose()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
            Welcome back, {user?.name?.split(' ')[0]}!
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="Toggle Theme">
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={onNotificationClick}>
                <NotificationBell />
              </IconButton>
            </Tooltip>
          </motion.div>
          
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <Divider />  {/* This now works because Divider is imported */}
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header