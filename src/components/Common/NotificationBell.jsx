import React, { useState } from 'react'
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
} from '@mui/material'
import {
  Notifications,
  Event,
  Announcement,
  Group,
  Task,
  CheckCircle,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { markNotificationRead } from '../../store/slices/notificationSlice'
import { formatDistanceToNow } from 'date-fns'

const NotificationBell = () => {
  const dispatch = useDispatch()
  const { myNotifications, unreadCount } = useSelector((state) => state.notifications)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkRead = async (id) => {
    await dispatch(markNotificationRead(id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'holiday':
        return <Event fontSize="small" sx={{ color: '#10b981' }} />
      case 'meeting':
        return <Group fontSize="small" sx={{ color: '#8b5cf6' }} />
      case 'announcement':
        return <Announcement fontSize="small" sx={{ color: '#3b82f6' }} />
      case 'task':
        return <Task fontSize="small" sx={{ color: '#ef4444' }} />
      default:
        return <Announcement fontSize="small" />
    }
  }

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            You have {unreadCount} unread notifications
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {myNotifications.slice(0, 10).map((notification, index) => {
              const isRead = notification.isRead?.some(
                r => r.userId === JSON.parse(localStorage.getItem('user'))?._id
              )
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <ListItem
                    sx={{
                      bgcolor: isRead ? 'transparent' : '#eff6ff',
                      '&:hover': { bgcolor: '#f3f4f6' },
                      cursor: 'pointer',
                    }}
                    onClick={() => !isRead && handleMarkRead(notification._id)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={!isRead ? 'bold' : 'normal'}>
                            {notification.title}
                          </Typography>
                          {!isRead && (
                            <Chip label="New" size="small" color="primary" sx={{ height: 20 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </List>

        {myNotifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Announcement sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  )
}

export default NotificationBell