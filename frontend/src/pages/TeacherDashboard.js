import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTeacherComplaints } from "../services/api";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    branch: "",
    status: "",
    complaint_type: "",
    search: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const complaintTypes = [
    "Fans",
    "Bathrooms",
    "Benches",
    "Lights",
    "Projectors",
    "Classroom Equipment",
  ];

  const statusTypes = ["Pending", "In Progress", "Resolved", "Rejected"];

  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

  // Check authentication status and verify user type is teacher
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const userType = localStorage.getItem("userType");

    if (token && userData && userType === "teacher") {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
      fetchComplaints();
    } else {
      // Redirect to teacher login if not authenticated as teacher
      navigate("/teachers");
    }
  }, [navigate]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Use the teacher complaints API which gives access to all complaints for teachers
      const response = await getTeacherComplaints(filters);
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch complaints. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchComplaints();
  };

  const resetFilters = () => {
    setFilters({
      branch: "",
      status: "",
      complaint_type: "",
      search: "",
    });
    // Fetch all complaints without filters
    getTeacherComplaints().then((response) => {
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "warning";
      case "Rejected":
        return "error";
      case "Pending":
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/teachers");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Teacher Dashboard</Typography>
          <Box>
            {user && (
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Welcome, {user.name} | Department: {user.department}
              </Typography>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom>
          View All Complaints
        </Typography>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Complaints
          </Typography>
          <Grid container spacing={2}>
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
                  {statusTypes.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
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
                placeholder="Search by name, roll #, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Complaints Table */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : complaints.length === 0 ? (
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="h6">No complaints found</Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your filters or check back later.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>
                      {complaint.name}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {complaint.roll_number}
                      </Typography>
                    </TableCell>
                    <TableCell>{complaint.branch}</TableCell>
                    <TableCell>{complaint.complaint_type}</TableCell>
                    <TableCell>
                      {complaint.location}
                      {complaint.specific_item && (
                        <>
                          <br />
                          <Typography variant="caption">
                            Item: {complaint.specific_item}
                          </Typography>
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {complaint.problem_description}
                      {complaint.suggestions && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="caption" color="textSecondary">
                            <strong>Suggestions:</strong>{" "}
                            {complaint.suggestions}
                          </Typography>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status || "Pending"}
                        color={getStatusColor(complaint.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(complaint.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherDashboard;
