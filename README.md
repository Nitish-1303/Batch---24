# Batch-24


# 🏫 College Infrastructure Management System

A MERN Stack-based web application to manage departmental infrastructure, lab equipment, and classroom/lab fault reporting with role-based access control.

## 👨‍💻 Team Members / Contributors

- [M.Sai Vinayak] (https://github.com/your-username)
- [Y.Sandhya] 
- [Y.Nitish] 
- [G.Sivani] 

## 🏗️ Project Overview

The system provides:
- Department-wise infrastructure management
- Role-based lab equipment management
- Complaint registration & fault reporting system
- Admin and HOD-level reporting & approvals
- Notification system for alerts

## 🏛️ Departments Covered

- Basic Science & Humanities  
- Computer Science & Engineering (CSE)  
- Electronics & Communication Engineering (ECE)  
- Mechanical Engineering  
- Electrical & Electronics Engineering (EEE)  
- Civil Engineering

## ⚙️ Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Tailwind CSS / Bootstrap (UI)
- Cloudinary (for image uploads)
- JWT (for authentication)


## 🔐 Role-Based Access Control

| Role           | Access                                                             |
|----------------|--------------------------------------------------------------------|
| Student        | Request/check-out equipment, report faults                         |
| Faculty        | Approve requests, manage equipment, verify returns, comment        |
| Lab Assistant  | Same as Faculty                                                    |
| HOD            | View reports, oversee approvals, full access                       |
| Admin          | Full system access                                                 |

## 🧰 Key Features

### 🧪 Lab Equipment Management
- Add/Edit/Delete equipment (Faculty & Lab Assistant only)
- Student checkout request flow
- Approval & return verification
- Equipment usage logs & reports
- Notifications for approvals, low stock, and due returns

### 🛠️ Complaint/Fault Reporting System
- Fault registration with image uploads
- Role-based commenting & follow-up
- Admin-only internal comments
- Editable/deletable user comments
- Soft delete support for comments

## 🖼️ Screenshots

> Add screenshots here for dashboard, equipment view, complaint form, etc.

## 🔧 Setup Instructions

1. Clone the repository:
`bash
git clone https://github.com/your-team/infrastructure-management-system.git


2. Install frontend & backend dependencies:
bash
cd client && npm install
cd ../server && npm install


3. Set up environment variables:
Create `.env` in `/server` folder with:
``
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_URL=your-cloudinary-credentials
`

4. Run the development servers:
``bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm start
