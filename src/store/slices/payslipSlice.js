import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/payslips`

export const fetchMyPayslips = createAsyncThunk(
  'payslips/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/my-payslips`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchAllPayslips = createAsyncThunk(
  'payslips/fetchAll',
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

export const generatePayslip = createAsyncThunk(
  'payslips/generate',
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/generate`, 
        { employeeId, month, year },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Payslip generated successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed')
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const payslipSlice = createSlice({
  name: 'payslips',
  initialState: {
    myPayslips: [],
    allPayslips: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayslips.fulfilled, (state, action) => {
        state.myPayslips = action.payload
      })
      .addCase(fetchAllPayslips.fulfilled, (state, action) => {
        state.allPayslips = action.payload
      })
      .addCase(generatePayslip.fulfilled, (state, action) => {
        state.allPayslips.unshift(action.payload)
      })
  },
})

export default payslipSlice.reducer