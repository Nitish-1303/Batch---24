import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7800/api",
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Students API
const getStudents = () => api.get("/students");
const getStudent = (id) => api.get(`/students/${id}`);
const createStudent = (data) => api.post("/students", data);
const updateStudent = (id, data) => api.put(`/students/${id}`, data);
const deleteStudent = (id) => api.delete(`/students/${id}`);

// Teachers API
const getTeachers = () => api.get("/teachers");
const getTeacher = (id) => api.get(`/teachers/${id}`);
const createTeacher = (data) => api.post("/teachers", data);
const updateTeacher = (id, data) => api.put(`/teachers/${id}`, data);
const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

// Courses API
const getCourses = () => api.get("/courses");
const getCourse = (id) => api.get(`/courses/${id}`);
const createCourse = (data) => api.post("/courses", data);
const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Auth API
const login = (data) => api.post("/students/login", data);
const register = (data) => api.post("/students/register", data);
const teacherLogin = (data) => api.post("/teachers/login", data);
const teacherRegister = (data) => api.post("/teachers/register", data);

// Complaints API
const submitComplaint = (data) => api.post("/complaints", data);
const getComplaints = () => api.get("/complaints");
const getComplaintsByRollNumber = (rollNumber) =>
  api.get(`/complaints/by-roll-number/${rollNumber}`);
const getTeacherComplaints = (filters = {}) => {
  return api.get("/teachers/complaints", { params: filters });
};

// Admin API
const adminLogin = (data) => api.post("/admin/login", data);
const getAdminComplaints = (filters = {}) => {
  return api.get("/admin/complaints", { params: filters });
};
const updateComplaintStatus = (id, status) => {
  return api.patch(`/admin/complaints/${id}/status`, { status });
};
const getStatistics = () => api.get("/admin/statistics");

export {
  // Students
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  // Teachers
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  // Auth
  login,
  register,
  teacherLogin,
  teacherRegister,
  // Complaints
  submitComplaint,
  getComplaints,
  getComplaintsByRollNumber,
  getTeacherComplaints,
  // Admin
  adminLogin,
  getAdminComplaints,
  updateComplaintStatus,
  getStatistics,
};
