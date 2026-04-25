import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import {
  LocationOn,
  AccessTime,
  CheckCircle,
  Cancel,
  MoreVert,
  Edit,
  Event,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllAttendance, markAttendance } from '../../store/slices/attendanceSlice'
import { fetchAllEmployees } from '../../store/slices/adminSlice'
import toast from 'react-hot-toast'

const AttendanceSheet = () => {
  const dispatch = useDispatch()
  const { allRecords } = useSelector((state) => state.attendance)
  const { employees } = useSelector((state) => state.admin)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [markStatus, setMarkStatus] = useState('present')
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    dispatch(fetchAllAttendance({ date: selectedDate, employeeId: selectedEmployee }))
  }, [dispatch, selectedDate, selectedEmployee])

  const handleMenuOpen = (event, record) => {
    setAnchorEl(event.currentTarget)
    setSelectedAttendance(record)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditAttendance = () => {
    setMarkStatus(selectedAttendance?.status || 'present')
    setRemarks(selectedAttendance?.remarks || '')
    setOpenDialog(true)
    handleMenuClose()
  }

  const handleUpdateAttendance = async () => {
    await dispatch(markAttendance({
      employeeId: selectedAttendance.employeeId._id,
      date: selectedDate,
      status: markStatus,
      remarks,
    }))
    setOpenDialog(false)
    dispatch(fetchAllAttendance({ date: selectedDate, employeeId: selectedEmployee }))
    toast.success('Attendance updated successfully!')
  }

  const getStatusColor = (status) => {
    const colors = {
      present: '#10b981',
      absent: '#ef4444',
      late: '#f59e0b',
      'half-day': '#8b5cf6',
    }
    return colors[status] || '#6b7280'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle sx={{ color: '#10b981' }} />
      case 'absent': return <Cancel sx={{ color: '#ef4444' }} />
      default: return <AccessTime sx={{ color: '#f59e0b' }} />
    }
  }

  const stats = {
    present: allRecords.filter(r => r.status === 'present').length,
    absent: allRecords.filter(r => r.status === 'absent').length,
    late: allRecords.filter(r => r.status === 'late').length,
    halfDay: allRecords.filter(r => r.status === 'half-day').length,
    total: allRecords.length,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Attendance Management
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            sx={{ width: 200 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Employee</InputLabel>
            <Select
              value={selectedEmployee}
              label="Filter by Employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <MenuItem value="">All Employees</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name} - {emp.employeeId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#10b98110', border: '1px solid #10b98130' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {stats.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#ef444410', border: '1px solid #ef444430' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#ef4444">
                  {stats.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#f59e0b10', border: '1px solid #f59e0b30' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                  {stats.late}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#8b5cf610', border: '1px solid #8b5cf630' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#8b5cf6">
                  {stats.halfDay}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Half Day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRecords.map((record, index) => (
                <motion.tr
                  key={record._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={record.employeeId?.profilePicture} sx={{ width: 32, height: 32 }}>
                        {record.employeeId?.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{record.employeeId?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{record.employeeId?.employeeId}</TableCell>
                  <TableCell>
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>{record.workingHours || 0} hrs</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(record.status) + '20',
                        color: getStatusColor(record.status),
                      }}
                      icon={getStatusIcon(record.status)}
                    />
                  </TableCell>
                  <TableCell>{record.remarks || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, record)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={markStatus}
                  label="Status"
                  onChange={(e) => setMarkStatus(e.target.value)}
                >
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="half-day">Half Day</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Remarks"
                multiline
                rows={2}
                fullWidth
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateAttendance} variant="contained">Update</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default AttendanceSheet