import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/notifications`

export const fetchMyNotifications = createAsyncThunk(
  'notifications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/my-notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchAllNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const createNotification = createAsyncThunk(
  'notifications/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(API_URL, notificationData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Notification created!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Notification deleted!')
      return id
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API_URL}/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    myNotifications: [],
    allNotifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.myNotifications.unshift(action.payload)
      state.unreadCount++
    },
    clearNotifications: (state) => {
      state.myNotifications = []
      state.allNotifications = []
      state.unreadCount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNotifications.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.myNotifications = action.payload
        const userId = JSON.parse(localStorage.getItem('user'))?._id
        state.unreadCount = action.payload.filter(n => 
          !n.isRead?.some(r => r.userId === userId)
        ).length
      })
      .addCase(fetchMyNotifications.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.allNotifications = action.payload
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.allNotifications.unshift(action.payload)
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.allNotifications = state.allNotifications.filter(n => n._id !== action.payload)
        state.myNotifications = state.myNotifications.filter(n => n._id !== action.payload)
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.myNotifications.find(n => n._id === action.payload)
        if (notification) {
          const userId = JSON.parse(localStorage.getItem('user'))?._id
          if (!notification.isRead) notification.isRead = []
          if (!notification.isRead.some(r => r.userId === userId)) {
            notification.isRead.push({ userId, readAt: new Date() })
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        }
      })
  },
})

export const { addNotification, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer