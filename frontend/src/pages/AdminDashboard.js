import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  InputAdornment,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getAdminComplaints,
  updateComplaintStatus,
  getStatistics,
} from "../services/api";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    byStatus: [],
    byType: [],
    byBranch: [],
    recent: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    branch: "",
    status: "",
    complaint_type: "",
    search: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Status update
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Alert
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch complaints and statistics on mount
  useEffect(() => {
    fetchComplaints();
    fetchStatistics();
  }, []);

  // Fetch complaints based on filters
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await getAdminComplaints(filters);
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setAlert({
        open: true,
        message: "Failed to fetch complaints",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await getStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchComplaints();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      branch: "",
      status: "",
      complaint_type: "",
      search: "",
    });
    fetchComplaints();
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open status dialog
  const openStatusDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setStatusDialog(true);
  };

  // Close status dialog
  const closeStatusDialog = () => {
    setStatusDialog(false);
    setSelectedComplaint(null);
    setNewStatus("");
  };

  // Update complaint status
  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    setStatusUpdateLoading(true);
    try {
      const response = await updateComplaintStatus(
        selectedComplaint.id,
        newStatus
      );
      if (response.data.success) {
        // Update the complaint in the list
        setComplaints(
          complaints.map((c) =>
            c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
          )
        );
        setAlert({
          open: true,
          message: "Status updated successfully",
          severity: "success",
        });
        fetchStatistics(); // Refresh statistics
        closeStatusDialog();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setAlert({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Status color based on value
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return theme.palette.success.main;
      case "In Progress":
        return theme.palette.warning.main;
      default:
        return theme.palette.error.main;
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get the complaint types for filter dropdown
  const complaintTypes = Array.from(
    new Set(complaints.map((c) => c.complaint_type))
  ).filter(Boolean);

  // Get the branches for filter dropdown
  const branches = Array.from(new Set(complaints.map((c) => c.branch))).filter(
    Boolean
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("isAdmin");
              navigate("/admin/login");
            }}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6">Total Complaints</Typography>
                <Typography variant="h3">{statistics.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ backgroundColor: theme.palette.error.main, color: "white" }}
            >
              <CardContent>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h3">
                  {statistics.byStatus?.find((s) => s.status === "Pending")
                    ?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: theme.palette.warning.main,
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6">In Progress</Typography>
                <Typography variant="h3">
                  {statistics.byStatus?.find((s) => s.status === "In Progress")
                    ?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: theme.palette.success.main,
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6">Resolved</Typography>
                <Typography variant="h3">
                  {statistics.byStatus?.find((s) => s.status === "Resolved")
                    ?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6" gutterBottom>
                Complaints by Status
              </Typography>
              {statistics.byStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={statistics.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statistics.byStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80%",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6" gutterBottom>
                Complaints by Type
              </Typography>
              {statistics.byType?.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={statistics.byType}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="complaint_type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80%",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Filters */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Filter Complaints</Typography>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branch"
                      value={filters.branch}
                      onChange={handleFilterChange}
                      label="Branch"
                    >
                      <MenuItem value="">All Branches</MenuItem>
                      {branches.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      label="Status"
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Complaint Type</InputLabel>
                    <Select
                      name="complaint_type"
                      value={filters.complaint_type}
                      onChange={handleFilterChange}
                      label="Complaint Type"
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {complaintTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="search"
                    label="Search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    startIcon={<FilterListIcon />}
                    sx={{ mr: 1 }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetFilters}
                    startIcon={<RefreshIcon />}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Complaints Table */}
          <Grid item xs={12}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Complaints ({complaints.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchComplaints}
                >
                  Refresh
                </Button>
              </Box>
              <Divider />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : complaints.length > 0 ? (
                <>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Student</TableCell>
                          <TableCell>Roll Number</TableCell>
                          <TableCell>Branch</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Problem</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {complaints
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((complaint) => (
                            <TableRow hover key={complaint.id}>
                              <TableCell>{complaint.id}</TableCell>
                              <TableCell>{complaint.name}</TableCell>
                              <TableCell>{complaint.roll_number}</TableCell>
                              <TableCell>{complaint.branch}</TableCell>
                              <TableCell>{complaint.complaint_type}</TableCell>
                              <TableCell>{complaint.location}</TableCell>
                              <TableCell>
                                {complaint.problem_description.length > 50
                                  ? `${complaint.problem_description.substring(
                                      0,
                                      50
                                    )}...`
                                  : complaint.problem_description}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={complaint.status}
                                  sx={{
                                    backgroundColor: getStatusColor(
                                      complaint.status
                                    ),
                                    color: "white",
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {formatDate(complaint.created_at)}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  onClick={() => openStatusDialog(complaint)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={complaints.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    No complaints found
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Status Update Dialog */}
        <Dialog open={statusDialog} onClose={closeStatusDialog}>
          <DialogTitle>Update Complaint Status</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update the status for complaint #{selectedComplaint?.id} from{" "}
              {selectedComplaint?.name}.
            </DialogContentText>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeStatusDialog}>Cancel</Button>
            <Button
              onClick={handleStatusUpdate}
              variant="contained"
              disabled={statusUpdateLoading}
              startIcon={
                statusUpdateLoading ? <CircularProgress size={20} /> : null
              }
            >
              {statusUpdateLoading ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alerts */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
