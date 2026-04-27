import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://employee-dashboard-backend-7h53.onrender.com/',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'https://employee-dashboard-backend-7h53.onrender.com/',
        ws: true
      },
      '/payslips': {
        target: 'https://employee-dashboard-backend-7h53.onrender.com/',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})