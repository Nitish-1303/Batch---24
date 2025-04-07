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

const Students = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    roll_number: "",
    password: "",
    name: "",
    email: "",
    branch: "CSE",
    year: "1",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const years = ["1", "2", "3", "4"];

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
      const url = `http://localhost:7800/api/students/${endpoint}`;

      // Prepare the data to send based on login/register
      const requestData = isLogin
        ? {
            roll_number: formData.roll_number,
            password: formData.password,
          }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

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
        setLoggedIn(true);
        // Redirect after successful login
        setTimeout(() => navigate("/complaints"), 1000);
      } else {
        // Switch to login form after successful registration
        setIsLogin(true);
        // Clear form except for roll number and password
        setFormData((prev) => ({
          ...prev,
          name: "",
          email: "",
          branch: "CSE",
          year: "1",
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An error occurred",
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
              to="/complaints"
              variant="contained"
              color="primary"
              size="small"
            >
              Go to Complaints
            </Button>
          </Box>
        )}

        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          {isLogin ? "Student Login" : "Register New Student"}
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
                name="branch"
                label="Branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                {branches.map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                margin="normal"
                name="year"
                label="Year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <TextField
            fullWidth
            margin="normal"
            name="roll_number"
            label="Roll Number"
            value={formData.roll_number}
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

export default Students;
