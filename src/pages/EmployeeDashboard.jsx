import React, { useState, useEffect } from 'react'
import { Box, Toolbar, Container, useTheme, useMediaQuery } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import Sidebar from '../components/Layout/Sidebar'
import Header from '../components/Layout/Header'
import TaskList from '../components/Employee/TaskList'
import AttendanceCalendar from '../components/Employee/AttendanceCalendar'
import PayslipDownload from '../components/Employee/PayslipDownload'
import NotificationPanel from '../components/Admin/NotificationPanel'
import ProfileSettings from '../components/Employee/ProfileSettings'
import ChatWidget from '../components/Common/ChatWidget'
import { fetchMyTasks } from '../store/slices/taskSlice'
import { fetchMyNotifications } from '../store/slices/notificationSlice'

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const theme = useTheme()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMyTasks())
    dispatch(fetchMyNotifications())
  }, [dispatch])

  const components = {
    0: TaskList,
    1: AttendanceCalendar,
    2: PayslipDownload,
    3: NotificationPanel,
    4: ProfileSettings,
    chat: ChatWidget,
  }

  const ActiveComponent = components[activeTab] || TaskList

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const handleNotificationClick = () => {
    setActiveTab(3)
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

export default EmployeeDashboard