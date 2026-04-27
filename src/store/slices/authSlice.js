import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/auth`

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      const userData = response.data
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('accessToken', userData.accessToken)
      localStorage.setItem('refreshToken', userData.refreshToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.accessToken}`
      toast.success('Login successful!')
      return userData
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const registerEmployee = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Employee registered successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/change-password`, 
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Password changed successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

// ADD THIS MISSING EXPORT
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.put(`${API_URL}/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const updatedUser = response.data
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const mergedUser = { ...currentUser, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(mergedUser))
      toast.success('Profile updated successfully!')
      return mergedUser
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await axios.post(`${API_URL}/logout`, { refreshToken })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }
})

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken })
      const { accessToken, refreshToken: newRefreshToken } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      return { accessToken, refreshToken: newRefreshToken }
    } catch (error) {
      return rejectWithValue('Token refresh failed')
    }
  }
)

// Axios interceptor for token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Store reference for dispatch (will be set after store creation)
let storeRef = null

export const setStoreRef = (store) => {
  storeRef = store
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        if (!storeRef) throw new Error('Store not initialized')
        const result = await storeRef.dispatch(refreshAccessToken()).unwrap()
        processQueue(null, result.accessToken)
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
        return axios(originalRequest)
      } catch (err) {
        processQueue(err, null)
        if (storeRef) {
          storeRef.dispatch(logout())
        }
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUserState: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.error = null
      })
      .addCase(registerEmployee.fulfilled, (state) => {
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null
      })
  },
})

export const { clearError, updateUserState } = authSlice.actions
export default authSlice.reducer