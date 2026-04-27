import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    this.socket = io(process.env.REACT_APP_API_URL || 'https://employee-dashboard-backend-7h53.onrender.com/', {
      withCredentials: true,
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId)
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send-message', data)
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback)
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback)
    }
  }

  emitTyping(data) {
    if (this.socket) {
      this.socket.emit('typing', data)
    }
  }
}

export default new SocketService()