import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = '/api/tasks'

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllTasks',
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(API_URL, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Task created successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Task creation failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.put(`${API_URL}/${id}/status`, 
        { status, note },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Task status updated!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Task deleted successfully!')
      return id
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    allTasks: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allTasks = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.allTasks.unshift(action.payload)
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id)
        if (index !== -1) state.tasks[index] = action.payload
        const allIndex = state.allTasks.findIndex(t => t._id === action.payload._id)
        if (allIndex !== -1) state.allTasks[allIndex] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.allTasks = state.allTasks.filter(t => t._id !== action.payload)
        state.tasks = state.tasks.filter(t => t._id !== action.payload)
      })
  },
})
// Add these missing exports to your existing taskSlice.js

export const fetchEmployeeTasks = createAsyncThunk(
  'tasks/fetchEmployeeTasks',
  async (employeeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Task updated successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)
export const { clearTaskError } = taskSlice.actions
export default taskSlice.reducer

