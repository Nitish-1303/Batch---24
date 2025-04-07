# Batch-24


# 🏫 College Infrastructure Management System

A MERN Stack-based web application to manage departmental infrastructure, lab equipment, and classroom/lab fault reporting with role-based access control.

## 👨‍💻 Team Members / Contributors

- [M.Sai Vinayak] 
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
| Faculty        | Approve requests, manage equipment, verify returns       |
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
