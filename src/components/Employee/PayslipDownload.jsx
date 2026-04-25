import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Avatar,
} from '@mui/material'
import {
  PictureAsPdf,
  Download,
  Receipt,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPayslips } from '../../store/slices/payslipSlice'

const PayslipDownload = () => {
  const dispatch = useDispatch()
  const { myPayslips, isLoading } = useSelector((state) => state.payslips)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState('all')

  useEffect(() => {
    dispatch(fetchMyPayslips())
  }, [dispatch])

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank')
  }

  const filteredPayslips = myPayslips.filter(slip => {
    if (selectedYear && slip.year !== selectedYear) return false
    if (selectedMonth !== 'all' && slip.month !== parseInt(selectedMonth)) return false
    return true
  })

  const stats = {
    totalEarned: filteredPayslips.reduce((sum, slip) => sum + slip.netSalary, 0),
    averageSalary: filteredPayslips.length ? filteredPayslips.reduce((sum, slip) => sum + slip.netSalary, 0) / filteredPayslips.length : 0,
    highestSalary: Math.max(...filteredPayslips.map(s => s.netSalary), 0),
    totalPayslips: filteredPayslips.length,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Salary Payslips
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#10b98110' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Earned</Typography>
                <Typography variant="h6" fontWeight="bold" color="#10b981">
                  ₹{stats.totalEarned.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#3b82f610' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Average Salary</Typography>
                <Typography variant="h6" fontWeight="bold" color="#3b82f6">
                  ₹{stats.averageSalary.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#8b5cf610' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Highest Salary</Typography>
                <Typography variant="h6" fontWeight="bold" color="#8b5cf6">
                  ₹{stats.highestSalary.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#f59e0b10' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Payslips</Typography>
                <Typography variant="h6" fontWeight="bold" color="#f59e0b">
                  {stats.totalPayslips}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {[2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Month"
            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Months</MenuItem>
            <MenuItem value="1">January</MenuItem>
            <MenuItem value="2">February</MenuItem>
            <MenuItem value="3">March</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">May</MenuItem>
            <MenuItem value="6">June</MenuItem>
            <MenuItem value="7">July</MenuItem>
            <MenuItem value="8">August</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </TextField>
        </Box>

        {/* Payslips Table */}
        {isLoading ? (
          <LinearProgress />
        ) : filteredPayslips.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Receipt sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No payslips found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payslips will appear here on the 9th of each month
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
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
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(2000, slip.month - 1).toLocaleString('default', { month: 'long' })} {slip.year}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp fontSize="small" sx={{ color: '#10b981' }} />
                        ₹{slip.totalAllowances?.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingDown fontSize="small" sx={{ color: '#ef4444' }} />
                        ₹{slip.totalDeductions?.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="#10b981">
                        ₹{slip.netSalary?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={slip.isDownloaded ? 'Downloaded' : 'New'}
                        size="small"
                        color={slip.isDownloaded ? 'success' : 'primary'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PictureAsPdf />}
                        onClick={() => handleDownload(slip.pdfUrl)}
                        sx={{ textTransform: 'none' }}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </motion.div>
  )
}

export default PayslipDownload