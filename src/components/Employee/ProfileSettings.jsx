import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  PhotoCamera,
  Save,
  Lock,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword, updateUser } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const ProfileSettings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
  })
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState({})

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      await dispatch(updateUser(profileData))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' })
      return
    }
    
    setIsLoading(true)
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }))
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Password changed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Profile Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      bgcolor: '#3b82f6',
                      fontSize: 48,
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      boxShadow: 1,
                    }}
                    size="small"
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role === 'admin' ? 'Administrator' : user?.employeeId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Work fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {user?.position || 'Position not set'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {user?.department || 'Department not set'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Button
                onClick={() => setActiveTab('profile')}
                sx={{
                  color: activeTab === 'profile' ? '#3b82f6' : 'text.secondary',
                  borderBottom: activeTab === 'profile' ? 2 : 0,
                  borderColor: '#3b82f6',
                  borderRadius: 0,
                }}
              >
                <Person sx={{ mr: 1 }} /> Profile Information
              </Button>
              <Button
                onClick={() => setActiveTab('password')}
                sx={{
                  color: activeTab === 'password' ? '#3b82f6' : 'text.secondary',
                  borderBottom: activeTab === 'password' ? 2 : 0,
                  borderColor: '#3b82f6',
                  borderRadius: 0,
                }}
              >
                <Lock sx={{ mr: 1 }} /> Change Password
              </Button>
            </Box>

            {isLoading && <LinearProgress sx={{ mb: 2 }} />}

            {activeTab === 'profile' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={profileData.phoneNumber}
                          onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                          placeholder="10 digit mobile number"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Address
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Street Address"
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, street: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={profileData.address.city}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, city: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="State"
                          value={profileData.address.state}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, state: e.target.value }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Pincode"
                          value={profileData.address.pincode}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, pincode: e.target.value }
                          })}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={handleProfileUpdate}
                        startIcon={<Save />}
                        disabled={isLoading}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Change Password
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Password must be at least 6 characters long
                    </Alert>
                                       <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Current Password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="password"
                          label="New Password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          error={!!errors.newPassword}
                          helperText={errors.newPassword}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword}
                          required
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={handlePasswordChange}
                        startIcon={<Lock />}
                        disabled={isLoading}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  )
}

export default ProfileSettings