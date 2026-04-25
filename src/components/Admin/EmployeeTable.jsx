import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Add,
  Block,
  CheckCircle,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllEmployees, updateEmployee, deleteEmployee } from '../../store/slices/adminSlice'
import { registerEmployee } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const EmployeeTable = () => {
  const dispatch = useDispatch()
  const { employees, isLoading } = useSelector((state) => state.admin)
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [dialogType, setDialogType] = useState('') // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    position: '',
    department: 'IT',
  })

  useEffect(() => {
    dispatch(fetchAllEmployees())
  }, [dispatch])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    setFormData({
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      salary: selectedEmployee.salary,
      position: selectedEmployee.position,
      department: selectedEmployee.department,
    })
    setOpenEditDialog(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await dispatch(deleteEmployee(selectedEmployee._id))
      handleMenuClose()
    }
  }

  const handleToggleStatus = async () => {
    await dispatch(updateEmployee({
      id: selectedEmployee._id,
      data: { isActive: !selectedEmployee.isActive }
    }))
    handleMenuClose()
  }

  const handleAddEmployee = () => {
    setDialogType('add')
    setFormData({
      name: '',
      email: '',
      password: '',
      salary: '',
      position: '',
      department: 'IT',
    })
    setOpenDialog(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.salary) {
      toast.error('Please fill all required fields')
      return
    }
    await dispatch(registerEmployee(formData))
    setOpenDialog(false)
    dispatch(fetchAllEmployees())
  }

  const handleSubmitEdit = async () => {
    await dispatch(updateEmployee({
      id: selectedEmployee._id,
      data: formData
    }))
    setOpenEditDialog(false)
    dispatch(fetchAllEmployees())
  }

  const getStatusChip = (isActive) => {
    return isActive ? (
      <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />
    ) : (
      <Chip label="Inactive" color="error" size="small" icon={<Block />} />
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Employee Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search employees..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddEmployee}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              }}
            >
              Add Employee
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee, index) => (
                <motion.tr
                  key={employee._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#3b82f6' }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {employee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.employeeId || 'N/A'}</TableCell>
                  <TableCell>{employee.department || 'N/A'}</TableCell>
                  <TableCell>{employee.position || 'N/A'}</TableCell>
                  <TableCell>₹{employee.salary?.toLocaleString() || 0}</TableCell>
                  <TableCell>{getStatusChip(employee.isActive)}</TableCell>
                  <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, employee)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleToggleStatus}>
            {selectedEmployee?.isActive ? (
              <>
                <Block fontSize="small" sx={{ mr: 1 }} /> Deactivate
              </>
            ) : (
              <>
                <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Activate
              </>
            )}
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Add Employee Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <TextField
                label="Salary"
                type="number"
                fullWidth
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
              <TextField
                label="Position"
                fullWidth
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitAdd} variant="contained">Add Employee</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Salary"
                type="number"
                fullWidth
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
              <TextField
                label="Position"
                fullWidth
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitEdit} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default EmployeeTable