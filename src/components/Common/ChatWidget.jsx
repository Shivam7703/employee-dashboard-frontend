import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Typography,
  Badge,
  Divider,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import {
  Chat,
  Close,
  Send,
  Person,
} from '@mui/icons-material'  // ← Removed CloseIcon, using Close instead
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { fetchConversations, fetchChatHistory, sendMessage, setActiveChat, addNewMessage } from '../../store/slices/chatSlice'
import { fetchAllEmployees } from '../../store/slices/adminSlice'
import { formatDistanceToNow } from 'date-fns'

const ChatWidget = () => {
  const dispatch = useDispatch()
  const { conversations, messages, activeChat, isLoading } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.auth)
  const { employees } = useSelector((state) => state.admin)
  const [isOpen, setIsOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const newSocket = io(API_URL, {
      withCredentials: true,
    })
    setSocket(newSocket)

    newSocket.on('receive-message', (data) => {
      dispatch(addNewMessage(data))
    })

    newSocket.on('user-typing', (data) => {
      if (data.userId === activeChat && data.isTyping) {
        setTyping(true)
        setTimeout(() => setTyping(false), 2000)
      }
    })

    return () => {
      newSocket.close()
    }
  }, [dispatch, activeChat])

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchConversations())
      if (user?.role === 'admin') {
        dispatch(fetchAllEmployees())
      }
    }
  }, [isOpen, dispatch, user])

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchChatHistory(activeChat))
      if (socket) {
        socket.emit('join-room', activeChat)
      }
    }
  }, [activeChat, dispatch, socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return

    const messageData = {
      receiverId: activeChat,
      message: newMessage,
    }

    await dispatch(sendMessage(messageData))
    
    if (socket) {
      socket.emit('send-message', {
        ...messageData,
        senderId: user._id,
        createdAt: new Date(),
      })
    }

    setNewMessage('')
  }

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    
    if (socket && activeChat) {
      socket.emit('typing', {
        receiverId: activeChat,
        userId: user._id,
        isTyping: true,
      })
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && activeChat) {
        socket.emit('typing', {
          receiverId: activeChat,
          userId: user._id,
          isTyping: false,
        })
      }
    }, 1000)
  }

  const getConversationName = (conversationId) => {
    if (user?.role === 'admin') {
      const emp = employees.find(e => e._id === conversationId)
      return emp?.name || 'Employee'
    }
    return 'Admin'
  }

  const getConversationAvatar = (conversationId) => {
    const name = getConversationName(conversationId)
    return name.charAt(0).toUpperCase()
  }

  const currentMessages = messages[activeChat] || []

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          }}
          onClick={() => setIsOpen(true)}
        >
          <Badge
            badgeContent={conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
            color="error"
          >
            <Chat sx={{ color: 'white' }} />
          </Badge>
        </Paper>
      </motion.div>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            height: { xs: '100%', sm: '80%' },
            top: { sm: 'auto' },
            bottom: { sm: 80 },
            right: { sm: 24 },
            borderRadius: { sm: 3 },
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Live Chat
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Chat Content */}
          {!activeChat ? (
            // Conversations List
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {user?.role === 'admin' ? (
                  employees.map((employee) => {
                    const conversation = conversations.find(c => c._id === employee._id)
                    return (
                      <ListItem
                        key={employee._id}
                        button
                        onClick={() => dispatch(setActiveChat(employee._id))}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            variant="dot"
                            color="success"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          >
                            <Avatar sx={{ bgcolor: '#3b82f6' }}>
                              {employee.name.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={employee.name}
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {conversation?.lastMessage || 'No messages yet'}
                            </Typography>
                          }
                        />
                        {conversation?.unreadCount > 0 && (
                          <Badge badgeContent={conversation.unreadCount} color="error" />
                        )}
                      </ListItem>
                    )
                  })
                ) : (
                  <ListItem button onClick={() => dispatch(setActiveChat('admin'))}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#8b5cf6' }}>A</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Admin Support"
                      secondary={conversations[0]?.lastMessage || 'Chat with admin'}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          ) : (
            // Chat Messages
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IconButton size="small" onClick={() => dispatch(setActiveChat(null))}>
                  <Close />  {/* ← Changed from CloseIcon to Close */}
                </IconButton>
                <Avatar sx={{ bgcolor: '#3b82f6' }}>
                  {getConversationAvatar(activeChat)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {getConversationName(activeChat)}
                  </Typography>
                  {typing && (
                    <Typography variant="caption" color="text.secondary">
                      Typing...
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f9fafb' }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : (
                  <AnimatePresence>
                    {currentMessages.map((msg, index) => (
                      <motion.div
                        key={msg._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: 'flex',
                          justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
                          marginBottom: 16,
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: msg.senderId === user._id ? '#3b82f6' : 'white',
                            color: msg.senderId === user._id ? 'white' : 'text.primary',
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="body2">{msg.message}</Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              color: msg.senderId === user._id ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                              fontSize: '0.65rem',
                            }}
                          >
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                )}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                  onKeyUp={handleTyping}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default ChatWidget