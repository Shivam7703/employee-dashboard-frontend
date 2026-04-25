import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import taskReducer from './slices/taskSlice'
import attendanceReducer from './slices/attendanceSlice'
import chatReducer from './slices/chatSlice'
import notificationReducer from './slices/notificationSlice'
import adminReducer from './slices/adminSlice'
import payslipReducer from './slices/payslipSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    attendance: attendanceReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    payslips: payslipReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})