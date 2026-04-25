import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  AccessTime,
  LocationOn,
  Login,
  Logout,
  Event,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { checkIn, checkOut, fetchMyAttendance } from '../../store/slices/attendanceSlice'
import toast from 'react-hot-toast'

const AttendanceCalendar = () => {
  const dispatch = useDispatch()
  const { records, todayStatus, isLoading } = useSelector((state) => state.attendance)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [location, setLocation] = useState(null)

  useEffect(() => {
    dispatch(fetchMyAttendance({ month: currentMonth, year: currentYear }))
  }, [dispatch, currentMonth, currentYear])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return null
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          toast.error('Unable to get location')
          reject(error)
        }
      )
    })
  }

  const handleCheckIn = async () => {
    const loc = await getCurrentLocation()
    await dispatch(checkIn(loc))
    dispatch(fetchMyAttendance({ month: currentMonth, year: currentYear }))
  }

  const handleCheckOut = async () => {
    await dispatch(checkOut())
    dispatch(fetchMyAttendance({ month: currentMonth, year: currentYear }))
  }

  const getAttendanceStats = () => {
    const present = records.filter(r => r.status === 'present').length
    const absent = records.filter(r => r.status === 'absent').length
    const late = records.filter(r => r.status === 'late').length
    const halfDay = records.filter(r => r.status === 'half-day').length
    const total = new Date(currentYear, currentMonth, 0).getDate()
    const percentage = (present / total) * 100

    return { present, absent, late, halfDay, total, percentage }
  }

  const stats = getAttendanceStats()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Attendance Tracker
        </Typography>

        {/* Today's Status */}
        <Card sx={{ mb: 3, bgcolor: '#3b82f610' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#3b82f6', width: 56, height: 56 }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h6">Today's Attendance</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {!todayStatus?.checkOutTime ? (
                  !todayStatus?.checkInTime ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Login />}
                      onClick={handleCheckIn}
                      disabled={isLoading}
                      sx={{ bgcolor: '#10b981' }}
                    >
                      Check In
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Logout />}
                      onClick={handleCheckOut}
                      disabled={isLoading}
                    >
                      Check Out
                    </Button>
                  )
                ) : (
                  <Alert severity="success" icon={<CheckCircle />}>
                    You have completed your attendance for today!
                  </Alert>
                )}
              </Box>
            </Box>

            {todayStatus?.checkInTime && (
              <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Login fontSize="small" color="primary" />
                  <Typography variant="body2">
                    Check In: {new Date(todayStatus.checkInTime).toLocaleTimeString()}
                  </Typography>
                </Box>
                {todayStatus.checkOutTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Logout fontSize="small" color="primary" />
                    <Typography variant="body2">
                      Check Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}
                    </Typography>
                  </Box>
                )}
                {todayStatus.workingHours > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                      Working Hours: {todayStatus.workingHours} hrs
                    </Typography>
                  </Box>
                )}
                {todayStatus.location?.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2" noWrap>
                      {todayStatus.location.address}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {stats.present}
                </Typography>
                <Typography variant="body2">Present</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#ef4444">
                  {stats.absent}
                </Typography>
                <Typography variant="body2">Absent</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                  {stats.late}
                </Typography>
                <Typography variant="body2">Late</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="#8b5cf6">
                  {stats.halfDay}
                </Typography>
                <Typography variant="body2">Half Day</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Attendance Rate</Typography>
            <Typography variant="body2" fontWeight="bold">
              {stats.percentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.percentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                bgcolor: stats.percentage >= 75 ? '#10b981' : stats.percentage >= 50 ? '#f59e0b' : '#ef4444',
                borderRadius: 5,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Present {stats.present} out of {stats.total} days
          </Typography>
        </Box>

        {/* Recent Attendance Records */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Recent Attendance
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {records.slice(0, 10).map((record, index) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.checkInTime && `In: ${new Date(record.checkInTime).toLocaleTimeString()}`}
                        {record.checkOutTime && ` | Out: ${new Date(record.checkOutTime).toLocaleTimeString()}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={record.status}
                      size="small"
                      sx={{
                        bgcolor: record.status === 'present' ? '#10b98120' : record.status === 'late' ? '#f59e0b20' : '#ef444420',
                        color: record.status === 'present' ? '#10b981' : record.status === 'late' ? '#f59e0b' : '#ef4444',
                      }}
                      icon={record.status === 'present' ? <CheckCircle /> : <Cancel />}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Paper>
    </motion.div>
  )
}

export default AttendanceCalendar