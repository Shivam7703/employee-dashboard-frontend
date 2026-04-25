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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  CheckCircle,
  Pending,
  PlayArrow,
  Cancel,
  Flag,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllTasks, createTask, updateTaskStatus, deleteTask } from '../../store/slices/taskSlice'
import { fetchAllEmployees } from '../../store/slices/adminSlice'
import toast from 'react-hot-toast'

const TaskAssignment = () => {
  const dispatch = useDispatch()
  const { allTasks, isLoading } = useSelector((state) => state.tasks)
  const { employees } = useSelector((state) => state.admin)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: new Date(),
    priority: 'medium',
    estimatedHours: 0,
  })

  useEffect(() => {
    dispatch(fetchAllTasks())
    dispatch(fetchAllEmployees())
  }, [dispatch])

  const handleCreateTask = async () => {
    if (!formData.title || !formData.description || !formData.assignedTo) {
      toast.error('Please fill all required fields')
      return
    }
    await dispatch(createTask(formData))
    setOpenDialog(false)
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: new Date(),
      priority: 'medium',
      estimatedHours: 0,
    })
  }

  const handleStatusUpdate = async (taskId, newStatus) => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus }))
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(taskId))
    }
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
      case 'cancelled': return <Cancel sx={{ color: '#ef4444' }} />
      default: return <Pending />
    }
  }

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
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
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            }}
          >
            Assign New Task
          </Button>
        </Box>

        <Grid container spacing={3}>
          <AnimatePresence>
            {allTasks.map((task, index) => (
              <Grid item xs={12} md={6} lg={4} key={task._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card sx={{ borderRadius: 3, position: 'relative', overflow: 'visible' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Delete Task">
                        <IconButton size="small" onClick={() => handleDeleteTask(task._id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {getStatusIcon(task.status)}
                        <Chip
                          label={getStatusLabel(task.status)}
                          size="small"
                          sx={{ bgcolor: getPriorityColor(task.status) + '20', color: getPriorityColor(task.status) }}
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{ bgcolor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
                          icon={<Flag sx={{ fontSize: 14 }} />}
                        />
                      </Box>

                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {task.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {task.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#3b82f6' }}>
                          {task.assignedTo?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          Assigned to: {task.assignedTo?.name}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {task.status !== 'completed' && task.status !== 'cancelled' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PlayArrow />}
                              onClick={() => handleStatusUpdate(task._id, 'working')}
                              disabled={task.status === 'working'}
                            >
                              Start
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleStatusUpdate(task._id, 'completed')}
                            >
                              Complete
                            </Button>
                          </>
                        )}
                        {task.status === 'working' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleStatusUpdate(task._id, 'pending')}
                          >
                            Reset
                          </Button>
                        )}
                      </Box>

                      {task.statusHistory && task.statusHistory.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary">
                            Last update: {new Date(task.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* Create Task Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Task Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  label="Assign To"
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name} - {emp.employeeId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              // Replace DatePicker with TextField
<TextField
  type="date"
  label="Due Date"
  value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : formData.dueDate}
  onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
  InputLabelProps={{ shrink: true }}
  fullWidth
/>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Estimated Hours"
                type="number"
                fullWidth
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateTask} variant="contained">Create Task</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default TaskAssignment