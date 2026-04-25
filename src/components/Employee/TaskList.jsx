import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
} from '@mui/material'
import {
  CheckCircle,
  Pending,
  PlayArrow,
  Cancel,
  Flag,
  AccessTime,
  Comment,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyTasks, updateTaskStatus } from '../../store/slices/taskSlice'
import toast from 'react-hot-toast'

const TaskList = () => {
  const dispatch = useDispatch()
  const { tasks, isLoading } = useSelector((state) => state.tasks)
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [statusNote, setStatusNote] = useState('')

  useEffect(() => {
    dispatch(fetchMyTasks())
  }, [dispatch])

  const handleStatusUpdate = async (taskId, newStatus) => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus, note: statusNote }))
    setOpenDialog(false)
    setStatusNote('')
  }

  const handleOpenStatusDialog = (task) => {
    setSelectedTask(task)
    setOpenDialog(true)
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626',
    }
    return colors[priority] || '#6b7280'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Pending sx={{ color: '#f59e0b' }} />
      case 'working': return <PlayArrow sx={{ color: '#3b82f6' }} />
      case 'completed': return <CheckCircle sx={{ color: '#10b981' }} />
      default: return <Pending />
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    working: tasks.filter(t => t.status === 'working').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    total: tasks.length,
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Tasks
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', bgcolor: '#f59e0b10' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                  {stats.pending}
                </Typography>
                <Typography variant="body2">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', bgcolor: '#3b82f610' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#3b82f6">
                  {stats.working}
                </Typography>
                <Typography variant="body2">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', bgcolor: '#10b98110' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {stats.completed}
                </Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Toggle */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, newValue) => newValue && setFilter(newValue)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="working">Working</ToggleButton>
            <ToggleButton value="completed">Completed</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Task Cards */}
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const daysRemaining = getDaysRemaining(task.dueDate)
              const isOverdue = daysRemaining < 0
              
              return (
                <Grid item xs={12} md={6} lg={4} key={task._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {getStatusIcon(task.status)}
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{ bgcolor: getPriorityColor(task.status) + '20', color: getPriorityColor(task.status) }}
                          />
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{ bgcolor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
                            icon={<Flag sx={{ fontSize: 14 }} />}
                          />
                          {isOverdue && task.status !== 'completed' && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>

                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {task.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="caption" color={isOverdue ? 'error' : 'text.secondary'}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                            {!isOverdue && daysRemaining > 0 && ` (${daysRemaining} days left)`}
                          </Typography>
                        </Box>

                        {task.statusHistory && task.statusHistory.length > 0 && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" color="text.secondary">
                              Last updated: {new Date(task.updatedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        {task.status !== 'completed' && task.status !== 'cancelled' && (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleOpenStatusDialog(task)}
                            startIcon={task.status === 'pending' ? <PlayArrow /> : <CheckCircle />}
                          >
                            {task.status === 'pending' ? 'Start Working' : 'Mark Complete'}
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            startIcon={<CheckCircle />}
                          >
                            Completed
                          </Button>
                        )}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              )
            })}
          </AnimatePresence>
        </Grid>

        {/* Status Update Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Update Task Status
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" gutterBottom>
                Task: <strong>{selectedTask?.title}</strong>
              </Typography>
              <TextField
                label="Add a note (optional)"
                multiline
                rows={3}
                fullWidth
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Any comments about the task progress..."
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => handleStatusUpdate(
                selectedTask?._id,
                selectedTask?.status === 'pending' ? 'working' : 'completed'
              )}
            >
              {selectedTask?.status === 'pending' ? 'Start Working' : 'Mark Complete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default TaskList