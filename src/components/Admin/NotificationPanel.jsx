import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  Notifications as NotificationsIcon,
  Event,
  People,
  Announcement,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllNotifications, createNotification, deleteNotification } from '../../store/slices/notificationSlice'
import { fetchAllEmployees } from '../../store/slices/adminSlice'
import toast from 'react-hot-toast'

const NotificationPanel = () => {
  const dispatch = useDispatch()
  const { allNotifications } = useSelector((state) => state.notifications)
  const { employees } = useSelector((state) => state.admin)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    date: new Date(),
    isGlobal: true,
    targetUsers: [],
  })

  useEffect(() => {
    dispatch(fetchAllNotifications())
    dispatch(fetchAllEmployees())
  }, [dispatch])

  const handleCreateNotification = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill all required fields')
      return
    }
    await dispatch(createNotification(formData))
    setOpenDialog(false)
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      date: new Date(),
      isGlobal: true,
      targetUsers: [],
    })
  }

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await dispatch(deleteNotification(id))
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'holiday': return <Event />
      case 'meeting': return <People />
      default: return <Announcement />
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      holiday: '#10b981',
      meeting: '#8b5cf6',
      announcement: '#3b82f6',
      reminder: '#f59e0b',
      task: '#ef4444',
    }
    return colors[type] || '#6b7280'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Notifications & Announcements
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            }}
          >
            Create Notification
          </Button>
        </Box>

        <Grid container spacing={3}>
          <AnimatePresence>
            {allNotifications.map((notification, index) => (
              <Grid item xs={12} md={6} key={notification._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card sx={{ borderRadius: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: getTypeColor(notification.type) + '20', color: getTypeColor(notification.type) }}>
                          {getTypeIcon(notification.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={notification.type}
                          size="small"
                          sx={{ bgcolor: getTypeColor(notification.type) + '20', color: getTypeColor(notification.type) }}
                        />
                        {!notification.isGlobal && (
                          <Chip
                            label={`Target: ${notification.targetUsers?.length || 0} employees`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* Create Notification Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Notification</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <TextField
                label="Message"
                multiline
                rows={3}
                fullWidth
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="announcement">Announcement</MenuItem>
                  <MenuItem value="holiday">Holiday</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="reminder">Reminder</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                sx={{ width: '100%' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isGlobal}
                    onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
                  />
                }
                label="Send to all employees"
              />
              {!formData.isGlobal && (
                <FormControl fullWidth>
                  <InputLabel>Select Employees</InputLabel>
                  <Select
                    multiple
                    value={formData.targetUsers}
                    label="Select Employees"
                    onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const emp = employees.find(e => e._id === value)
                          return <Chip key={value} label={emp?.name} size="small" />
                        })}
                      </Box>
                    )}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name} - {emp.employeeId}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateNotification} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default NotificationPanel