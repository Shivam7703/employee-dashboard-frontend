import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = `${import.meta.env.VITE_API_URL}/chat`

export const sendMessage = createAsyncThunk(
  'chat/send',
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/send`, 
        { receiverId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { userId, messages: response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const markMessageAsRead = createAsyncThunk(
  'chat/markRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API_URL}/read/${messageId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return messageId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: {},
    activeChat: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload
    },
    addNewMessage: (state, action) => {
      const { senderId, receiverId } = action.payload
      const userId = senderId === state.activeChat ? receiverId : senderId
      if (state.messages[userId]) {
        state.messages[userId].push(action.payload)
      } else if (userId === state.activeChat) {
        state.messages[userId] = [action.payload]
      }
    },
    markMessagesAsRead: (state, action) => {
      const { userId } = action.payload
      if (state.messages[userId]) {
        state.messages[userId] = state.messages[userId].map(msg => ({
          ...msg,
          isRead: true
        }))
      }
      const conversation = state.conversations.find(c => c._id === userId)
      if (conversation) {
        conversation.unreadCount = 0
      }
    },
    clearChat: (state) => {
      state.conversations = []
      state.messages = {}
      state.activeChat = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages[action.payload.userId] = action.payload.messages
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const receiverId = action.payload.receiverId
        const senderId = action.payload.senderId
        const userId = senderId === state.activeChat ? receiverId : senderId
        if (state.messages[userId]) {
          state.messages[userId].push(action.payload)
        } else if (userId === state.activeChat) {
          state.messages[userId] = [action.payload]
        }
      })
  },
})

export const { setActiveChat, addNewMessage, markMessagesAsRead, clearChat } = chatSlice.actions
export default chatSlice.reducer