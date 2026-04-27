import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/attendance`


export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (location, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/check-in`, 
        { location },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Checked in successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/check-out`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Checked out successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchMyAttendance = createAsyncThunk(
  'attendance/fetchMyAttendance',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/my-attendance?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAllAttendance',
  async ({ date, employeeId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}`, {
        params: { date, employeeId },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/mark`, attendanceData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Attendance marked successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    allRecords: [],
    todayStatus: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.fulfilled, (state, action) => {
        state.todayStatus = action.payload
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.todayStatus = action.payload
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.records = action.payload
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.allRecords = action.payload
      })
  },
})

export default attendanceSlice.reducer