import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,  // ← Make sure Divider is imported
  Typography,
  Avatar,
  useTheme,
  Badge,
} from '@mui/material'
import {
  Dashboard,
  People,
  Assignment,
  CalendarToday,
  AttachMoney,
  Notifications,
  Chat,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Person,
  Receipt,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

// Rest of the component remains the same...

const menuItems = {
  admin: [
    { text: 'Overview', icon: <Dashboard />, value: 0 },
    { text: 'Employees', icon: <People />, value: 1 },
    { text: 'Tasks', icon: <Assignment />, value: 2 },
    { text: 'Attendance', icon: <CalendarToday />, value: 3 },
    { text: 'Salary', icon: <AttachMoney />, value: 4 },
    { text: 'Notifications', icon: <Notifications />, value: 5 },
  ],
  employee: [
    { text: 'My Tasks', icon: <Assignment />, value: 0 },
    { text: 'Attendance', icon: <CalendarToday />, value: 1 },
    { text: 'Payslips', icon: <Receipt />, value: 2 },
    { text: 'Notifications', icon: <Notifications />, value: 3 },
    { text: 'Profile', icon: <Person />, value: 4 },
  ],
}

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notifications)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  const drawerWidth = collapsed ? 80 : 280

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Employee Hub
          </Typography>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </Box>
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: collapsed ? 40 : 80,
            height: collapsed ? 40 : 80,
            margin: '0 auto',
            bgcolor: theme.palette.primary.main,
            fontSize: collapsed ? 20 : 32,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        {!collapsed && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mt={1}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role === 'admin' ? 'Administrator' : user?.employeeId}
            </Typography>
          </>
        )}
      </Box>
      <Divider />

      <List sx={{ flex: 1, px: 1 }}>
        {menuItems[user?.role]?.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeTab === item.value}
              onClick={() => setActiveTab(item.value)}
              sx={{
                justifyContent: collapsed ? 'center' : 'initial',
                py: 1.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.main + '20',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main + '30',
                  },
                },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  justifyContent: 'center', 
                  minWidth: collapsed ? 'auto' : 56,
                  color: activeTab === item.value ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.text === 'Notifications' && unreadCount > 0 ? (
                  <Badge badgeContent={unreadCount} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton 
            onClick={() => setActiveTab('chat')} 
            sx={{ 
              justifyContent: collapsed ? 'center' : 'initial', 
              py: 1.5,
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ justifyContent: 'center', minWidth: collapsed ? 'auto' : 56 }}>
              <Chat />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Live Chat" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              justifyContent: collapsed ? 'center' : 'initial', 
              py: 1.5,
              borderRadius: 2,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: theme.palette.error.main + '10',
              },
            }}
          >
            <ListItemIcon sx={{ justifyContent: 'center', minWidth: collapsed ? 'auto' : 56, color: 'inherit' }}>
              <Logout />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Sidebar