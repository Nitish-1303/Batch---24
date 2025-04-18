const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "college.db");
let db = null;

const SECRET_KEY = "your_strong_secret_key_here";
const SALT_ROUNDS = 10;

// Initialize DB and start the server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await createTables();
    app.listen(7800, () => {
      console.log(`Server Running at http://localhost:7800/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

const createTables = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      branch TEXT NOT NULL,
      year INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      roll_number TEXT NOT NULL,
      branch TEXT NOT NULL,
      complaint_type TEXT NOT NULL,
      location TEXT NOT NULL,
      specific_item TEXT,
      problem_description TEXT NOT NULL,
      suggestions TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

initializeDBAndServer();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

// Input validation middleware
const validateStudentRegistration = (req, res, next) => {
  const { roll_number, password, name, email, branch, year } = req.body;

  if (!roll_number || !password || !name || !email || !branch || !year) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long",
    });
  }

  next();
};

// Student Registration
app.post(
  "/api/students/register",
  validateStudentRegistration,
  async (req, res) => {
    const { roll_number, password, name, email, branch, year } = req.body;

    try {
      const existingStudent = await db.get(
        "SELECT * FROM students WHERE roll_number = ? OR email = ?",
        [roll_number, email]
      );

      if (existingStudent) {
        const errorField =
          existingStudent.roll_number === roll_number ? "roll_number" : "email";
        return res.status(409).json({
          success: false,
          error: `${errorField} already exists`,
          field: errorField,
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { lastID } = await db.run(
        `INSERT INTO students (roll_number, name, email, password, branch, year) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [roll_number, name, email, hashedPassword, branch, year]
      );

      const newStudent = await db.get(
        "SELECT id, roll_number, name, email, branch, year FROM students WHERE id = ?",
        [lastID]
      );

      res.status(201).json({
        success: true,
        message: "Student registered successfully",
        data: newStudent,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Registration failed. Please try again later.",
      });
    }
  }
);

// Student Login
app.post("/api/students/login", async (req, res) => {
  const { roll_number, password } = req.body;

  if (!roll_number || !password) {
    return res.status(400).json({
      success: false,
      error: "Roll number and password are required",
    });
  }

  try {
    const student = await db.get(
      "SELECT * FROM students WHERE roll_number = ?",
      [roll_number]
    );

    if (!student) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: student.id,
        roll_number: student.roll_number,
        name: student.name,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: student.id,
          roll_number: student.roll_number,
          name: student.name,
          email: student.email,
          branch: student.branch,
          year: student.year,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again later.",
    });
  }
});

// Complaint Validation Middleware
const validateComplaint = (req, res, next) => {
  const { complaint_type, location, problem_description } = req.body;

  if (!complaint_type || !location || !problem_description) {
    return res.status(400).json({
      success: false,
      error: "Required fields are missing",
    });
  }

  next();
};

// Submit Complaint
app.post(
  "/api/complaints",
  authenticateToken,
  validateComplaint,
  async (req, res) => {
    const {
      complaint_type,
      location,
      specific_item,
      problem_description,
      suggestions,
    } = req.body;

    try {
      // Get student details from the JWT token
      const studentId = req.user.id;

      // Get additional student details from the database
      const student = await db.get(
        "SELECT name, roll_number, branch FROM students WHERE id = ?",
        [studentId]
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student not found",
        });
      }

      const { lastID } = await db.run(
        `INSERT INTO complaints (
        student_id, name, roll_number, branch, complaint_type, 
        location, specific_item, problem_description, suggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          student.name,
          student.roll_number,
          student.branch,
          complaint_type,
          location,
          specific_item || null,
          problem_description,
          suggestions || null,
        ]
      );

      const newComplaint = await db.get(
        "SELECT * FROM complaints WHERE id = ?",
        [lastID]
      );

      res.status(201).json({
        success: true,
        message: "Complaint submitted successfully",
        data: newComplaint,
      });
    } catch (error) {
      console.error("Complaint submission error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to submit complaint. Please try again later.",
      });
    }
  }
);

// Get All Complaints for a Student
app.get("/api/complaints", authenticateToken, async (req, res) => {
  try {
    const complaints = await db.all(
      `SELECT 
        id, complaint_type, location, specific_item, 
        problem_description, suggestions, status, 
        strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
       FROM complaints 
       WHERE student_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Fetch complaints error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch complaints. Please try again later.",
    });
  }
});

// Get Complaints by Roll Number (no authentication required)
app.get("/api/complaints/by-roll-number/:roll_number", async (req, res) => {
  try {
    const { roll_number } = req.params;

    const complaints = await db.all(
      `SELECT 
        id, complaint_type, location, specific_item, 
        problem_description, suggestions, status, 
        strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
       FROM complaints 
       WHERE roll_number = ? 
       ORDER BY created_at DESC`,
      [roll_number]
    );

    res.json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Fetch complaints by roll number error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch complaints. Please try again later.",
    });
  }
});

// Get Single Complaint
app.get("/api/complaints/:id", authenticateToken, async (req, res) => {
  try {
    const complaint = await db.get(
      `SELECT 
        id, name, roll_number, branch, complaint_type, 
        location, specific_item, problem_description, 
        suggestions, status, 
        strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
       FROM complaints 
       WHERE id = ? AND student_id = ?`,
      [req.params.id, req.user.id]
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Fetch complaint error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch complaint. Please try again later.",
    });
  }
});

// Update Complaint Status
app.patch("/api/complaints/:id/status", authenticateToken, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "In Progress", "Resolved"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status value",
    });
  }

  try {
    const result = await db.run(
      "UPDATE complaints SET status = ? WHERE id = ? AND student_id = ?",
      [status, req.params.id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found or not owned by student",
      });
    }

    res.json({
      success: true,
      message: "Complaint status updated successfully",
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update complaint status. Please try again later.",
    });
  }
});

// Get Student Profile
app.get("/api/students/me", authenticateToken, async (req, res) => {
  try {
    const student = await db.get(
      `SELECT 
        id, roll_number, name, email, branch, year,
        strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
       FROM students 
       WHERE id = ?`,
      [req.user.id]
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch student profile. Please try again later.",
    });
  }
});

// Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Username and password are required",
    });
  }

  try {
    const admin = await db.get("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        isAdmin: true,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          isAdmin: true,
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again later.",
    });
  }
});

// Create Admin (only accessible via direct API request like Postman)
app.post("/api/admin/register", async (req, res) => {
  const { username, password, name, email } = req.body;

  if (!username || !password || !name || !email) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long",
    });
  }

  try {
    const existingAdmin = await db.get(
      "SELECT * FROM admins WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingAdmin) {
      const errorField =
        existingAdmin.username === username ? "username" : "email";
      return res.status(409).json({
        success: false,
        error: `${errorField} already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { lastID } = await db.run(
      `INSERT INTO admins (username, password, name, email) 
       VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, name, email]
    );

    const newAdmin = await db.get(
      "SELECT id, username, name, email FROM admins WHERE id = ?",
      [lastID]
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: newAdmin,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again later.",
    });
  }
});

// Get All Complaints for Admin
app.get(
  "/api/admin/complaints",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { branch, status, complaint_type, search } = req.query;

      let query = `
      SELECT 
        c.id, c.name, c.roll_number, c.branch, c.complaint_type, 
        c.location, c.specific_item, c.problem_description, 
        c.suggestions, c.status, 
        strftime('%Y-%m-%d %H:%M:%S', c.created_at) as created_at
      FROM complaints c
    `;

      const whereConditions = [];
      const queryParams = [];

      if (branch) {
        whereConditions.push("c.branch = ?");
        queryParams.push(branch);
      }

      if (status) {
        whereConditions.push("c.status = ?");
        queryParams.push(status);
      }

      if (complaint_type) {
        whereConditions.push("c.complaint_type = ?");
        queryParams.push(complaint_type);
      }

      if (search) {
        whereConditions.push(
          `(c.name LIKE ? OR c.roll_number LIKE ? OR c.problem_description LIKE ? OR c.location LIKE ?)`
        );
        const searchParam = `%${search}%`;
        queryParams.push(searchParam, searchParam, searchParam, searchParam);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(" AND ")}`;
      }

      query += " ORDER BY c.created_at DESC";

      const complaints = await db.all(query, queryParams);

      res.json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      console.error("Admin fetch complaints error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch complaints. Please try again later.",
      });
    }
  }
);

// Update Complaint Status by Admin
app.patch(
  "/api/admin/complaints/:id/status",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Progress", "Resolved"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    try {
      const result = await db.run(
        "UPDATE complaints SET status = ? WHERE id = ?",
        [status, req.params.id]
      );

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          error: "Complaint not found",
        });
      }

      res.json({
        success: true,
        message: "Complaint status updated successfully",
      });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update complaint status. Please try again later.",
      });
    }
  }
);

// Get Complaint Statistics for Admin Dashboard
app.get(
  "/api/admin/statistics",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      // Total complaints
      const totalComplaints = await db.get(
        "SELECT COUNT(*) as count FROM complaints"
      );

      // Complaints by status
      const byStatus = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM complaints 
      GROUP BY status
    `);

      // Complaints by type
      const byType = await db.all(`
      SELECT complaint_type, COUNT(*) as count 
      FROM complaints 
      GROUP BY complaint_type
    `);

      // Complaints by branch
      const byBranch = await db.all(`
      SELECT branch, COUNT(*) as count 
      FROM complaints 
      GROUP BY branch
    `);

      // Recent complaints (last 7 days)
      const recentComplaints = await db.get(`
      SELECT COUNT(*) as count 
      FROM complaints 
      WHERE created_at >= datetime('now', '-7 days')
    `);

      res.json({
        success: true,
        data: {
          total: totalComplaints.count,
          byStatus,
          byType,
          byBranch,
          recent: recentComplaints.count,
        },
      });
    } catch (error) {
      console.error("Statistics error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch statistics. Please try again later.",
      });
    }
  }
);

// Teacher Registration validation middleware
const validateTeacherRegistration = (req, res, next) => {
  const { teacher_id, password, name, email, department, designation } =
    req.body;

  if (
    !teacher_id ||
    !password ||
    !name ||
    !email ||
    !department ||
    !designation
  ) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long",
    });
  }

  next();
};

// Teacher Registration
app.post(
  "/api/teachers/register",
  validateTeacherRegistration,
  async (req, res) => {
    const { teacher_id, password, name, email, department, designation } =
      req.body;

    try {
      const existingTeacher = await db.get(
        "SELECT * FROM teachers WHERE teacher_id = ? OR email = ?",
        [teacher_id, email]
      );

      if (existingTeacher) {
        const errorField =
          existingTeacher.teacher_id === teacher_id ? "teacher_id" : "email";
        return res.status(409).json({
          success: false,
          error: `${errorField} already exists`,
          field: errorField,
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { lastID } = await db.run(
        `INSERT INTO teachers (teacher_id, name, email, password, department, designation) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [teacher_id, name, email, hashedPassword, department, designation]
      );

      const newTeacher = await db.get(
        "SELECT id, teacher_id, name, email, department, designation FROM teachers WHERE id = ?",
        [lastID]
      );

      res.status(201).json({
        success: true,
        message: "Teacher registered successfully",
        data: newTeacher,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Registration failed. Please try again later.",
      });
    }
  }
);

// Teacher Login
app.post("/api/teachers/login", async (req, res) => {
  const { teacher_id, password } = req.body;

  if (!teacher_id || !password) {
    return res.status(400).json({
      success: false,
      error: "Teacher ID and password are required",
    });
  }

  try {
    const teacher = await db.get(
      "SELECT * FROM teachers WHERE teacher_id = ?",
      [teacher_id]
    );

    if (!teacher) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        teacher_id: teacher.teacher_id,
        name: teacher.name,
        role: "teacher",
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: teacher.id,
          teacher_id: teacher.teacher_id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          designation: teacher.designation,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again later.",
    });
  }
});

// Teacher middleware to verify teacher role
const isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Teacher privileges required.",
    });
  }
  next();
};

// Get All Complaints for Teachers
app.get(
  "/api/teachers/complaints",
  authenticateToken,
  isTeacher,
  async (req, res) => {
    try {
      const { branch, status, complaint_type, search } = req.query;

      let query = `
      SELECT 
        c.id, c.name, c.roll_number, c.branch, c.complaint_type, 
        c.location, c.specific_item, c.problem_description, 
        c.suggestions, c.status, 
        strftime('%Y-%m-%d %H:%M:%S', c.created_at) as created_at
      FROM complaints c
    `;

      const whereConditions = [];
      const queryParams = [];

      if (branch) {
        whereConditions.push("c.branch = ?");
        queryParams.push(branch);
      }

      if (status) {
        whereConditions.push("c.status = ?");
        queryParams.push(status);
      }

      if (complaint_type) {
        whereConditions.push("c.complaint_type = ?");
        queryParams.push(complaint_type);
      }

      if (search) {
        whereConditions.push(
          `(c.name LIKE ? OR c.roll_number LIKE ? OR c.problem_description LIKE ? OR c.location LIKE ?)`
        );
        const searchParam = `%${search}%`;
        queryParams.push(searchParam, searchParam, searchParam, searchParam);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(" AND ")}`;
      }

      query += " ORDER BY c.created_at DESC";

      const complaints = await db.all(query, queryParams);

      res.json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      console.error("Teacher fetch complaints error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch complaints. Please try again later.",
      });
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

module.exports = app;
