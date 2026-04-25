import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  LinearProgress,
} from '@mui/material'
import {
  Download,
  Receipt,
  GetApp,
  PictureAsPdf,
  TrendingUp,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllPayslips, generatePayslip } from '../../store/slices/payslipSlice'
import { fetchAllEmployees } from '../../store/slices/adminSlice'
import toast from 'react-hot-toast'

const SalaryManagement = () => {
  const dispatch = useDispatch()
  const { allPayslips } = useSelector((state) => state.payslips)
  const { employees } = useSelector((state) => state.admin)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    dispatch(fetchAllPayslips())
    dispatch(fetchAllEmployees())
  }, [dispatch])

  const filteredPayslips = allPayslips.filter(slip => {
    let match = true
    if (selectedEmployee) match = match && slip.employeeId?._id === selectedEmployee
    if (selectedMonth) match = match && slip.month === selectedMonth
    if (selectedYear) match = match && slip.year === selectedYear
    return match
  })

  const handleGeneratePayslip = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee')
      return
    }
    setGenerating(true)
    await dispatch(generatePayslip({
      employeeId: selectedEmployee,
      month: selectedMonth,
      year: selectedYear,
    }))
    setGenerating(false)
    setOpenDialog(false)
    dispatch(fetchAllPayslips())
  }

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank')
  }

  const totalSalary = filteredPayslips.reduce((sum, slip) => sum + slip.netSalary, 0)
  const averageSalary = filteredPayslips.length ? totalSalary / filteredPayslips.length : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Salary Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
            }}
          >
            Generate Payslip
          </Button>
        </Box>

        {/* Stats Summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#3b82f610', border: '1px solid #3b82f630' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Salary</Typography>
                <Typography variant="h5" fontWeight="bold" color="#3b82f6">
                  ₹{totalSalary.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#8b5cf610', border: '1px solid #8b5cf630' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Average Salary</Typography>
                <Typography variant="h5" fontWeight="bold" color="#8b5cf6">
                  ₹{averageSalary.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#10b98110', border: '1px solid #10b98130' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Payslips</Typography>
                <Typography variant="h5" fontWeight="bold" color="#10b981">
                  {filteredPayslips.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <MenuItem key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            {[2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Employees</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.name} - {emp.employeeId}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Payslips Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>Employee</TableCell>
                <TableCell>Month/Year</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Allowances</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayslips.map((slip, index) => (
                <motion.tr
                  key={slip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {slip.employeeId?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {slip.employeeId?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {slip.employeeId?.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(2000, slip.month - 1).toLocaleString('default', { month: 'long' })} {slip.year}
                  </TableCell>
                  <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
                  <TableCell>₹{slip.totalAllowances?.toLocaleString()}</TableCell>
                  <TableCell>₹{slip.totalDeductions?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="#10b981">
                      ₹{slip.netSalary?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={slip.isDownloaded ? 'Downloaded' : 'Generated'}
                      size="small"
                      color={slip.isDownloaded ? 'success' : 'primary'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleDownload(slip.pdfUrl)} color="primary">
                      <PictureAsPdf />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Generate Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Generate Payslip</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Select Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  label="Select Employee"
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name} - {emp.employeeId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                select
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                fullWidth
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                fullWidth
              >
                {[2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleGeneratePayslip} variant="contained" disabled={generating}>
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  )
}

export default SalaryManagement