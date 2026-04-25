import React, { useState, useEffect } from 'react'
import { Box, Toolbar, Container, useTheme, useMediaQuery } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import Sidebar from '../components/Layout/Sidebar'
import Header from '../components/Layout/Header'
import StatsCards from '../components/Admin/StatsCards'
import EmployeeTable from '../components/Admin/EmployeeTable'
import TaskAssignment from '../components/Admin/TaskAssignment'
import AttendanceSheet from '../components/Admin/AttendanceSheet'
import SalaryManagement from '../components/Admin/SalaryManagement'
import NotificationPanel from '../components/Admin/NotificationPanel'
import ChatWidget from '../components/Common/ChatWidget'
import { fetchMyNotifications } from '../store/slices/notificationSlice'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMyNotifications())
  }, [dispatch])

  const components = {
    0: StatsCards,
    1: EmployeeTable,
    2: TaskAssignment,
    3: AttendanceSheet,
    4: SalaryManagement,
    5: NotificationPanel,
    chat: ChatWidget,
  }

  const ActiveComponent = components[activeTab] || StatsCards

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    // Implement theme change logic
  }

  const handleNotificationClick = () => {
    setActiveTab(5) // Switch to notifications tab
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? '#121212' : '#f5f5f5' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Header 
          toggleDrawer={() => setMobileOpen(!mobileOpen)}
          toggleTheme={toggleTheme}
          darkMode={darkMode}
          unreadCount={0}
          onNotificationClick={handleNotificationClick}
        />
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  )
}

export default AdminDashboard