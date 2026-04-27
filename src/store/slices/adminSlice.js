import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/admin`

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchAllEmployees = createAsyncThunk(
  'admin/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'admin/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.put(`${API_URL}/employees/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Employee updated successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteEmployee = createAsyncThunk(
  'admin/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(`${API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Employee deleted successfully!')
      return id
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchTaskReport = createAsyncThunk(
  'admin/fetchTaskReport',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/task-report`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    employees: [],
    taskReport: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchAllEmployees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = action.payload
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(e => e._id === action.payload._id)
        if (index !== -1) state.employees[index] = action.payload
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(e => e._id !== action.payload)
      })
      .addCase(fetchTaskReport.fulfilled, (state, action) => {
        state.taskReport = action.payload
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer