import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { teacherLogin, teacherRegister } from "../services/api";

const Teachers = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    teacher_id: "",
    password: "",
    name: "",
    email: "",
    department: "CSE",
    designation: "Assistant Professor",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const designations = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "HOD",
    "Lab Assistant",
    "Guest Faculty",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "login" : "register";

      // Prepare the data to send based on login/register
      const requestData = isLogin
        ? {
            teacher_id: formData.teacher_id,
            password: formData.password,
          }
        : formData;

      // Use the api functions instead of fetch
      const response = isLogin
        ? await teacherLogin(requestData)
        : await teacherRegister(requestData);

      const data = response.data;

      setSnackbar({
        open: true,
        message: isLogin
          ? "Login successful!"
          : "Registration successful! Please login.",
        severity: "success",
      });

      if (isLogin) {
        console.log(data);
        // Store user data and token
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("userType", "teacher");
        setLoggedIn(true);
        // Redirect after successful login to view complaints
        setTimeout(() => navigate("/teacher-dashboard"), 1000);
      } else {
        // Switch to login form after successful registration
        setIsLogin(true);
        // Clear form except for teacher ID and password
        setFormData((prev) => ({
          ...prev,
          name: "",
          email: "",
          department: "CSE",
          designation: "Assistant Professor",
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "An error occurred",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {loggedIn && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            <Button
              component={RouterLink}
              to="/teacher-dashboard"
              variant="contained"
              color="primary"
              size="small"
            >
              Go to Dashboard
            </Button>
          </Box>
        )}

        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          {isLogin ? "Teacher Login" : "Register New Teacher"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                select
                fullWidth
                margin="normal"
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                margin="normal"
                name="designation"
                label="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
              >
                {designations.map((designation) => (
                  <MenuItem key={designation} value={designation}>
                    {designation}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <TextField
            fullWidth
            margin="normal"
            name="teacher_id"
            label="Teacher ID"
            value={formData.teacher_id}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              sx={{ fontWeight: "bold" }}
            >
              {isLogin ? "Register here" : "Login here"}
            </Link>
          </Typography>
        </Box>
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

export default Teachers;
