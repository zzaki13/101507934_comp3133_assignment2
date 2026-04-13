# COMP3133 Assignment 2 - Employee Management Frontend

**Student ID:** 101507934  
**Student Name:** Zaki Mohammed  
**Course:** COMP3133 - Full Stack Development  

---

## Live Demo
- **Frontend:** https://101507934-comp3133-assignment2.vercel.app
- **Backend API:** https://comp3133-101507934-backend.onrender.com/graphql

---

## Features
- User Authentication (Signup, Login, Logout) with JWT
- View all employees in a table
- Add new employee with photo upload
- View employee details
- Update employee information
- Delete employee
- Search employees by department or designation
- Route guards to protect authenticated pages
- Responsive UI with Bootstrap

---

## Tech Stack
- **Frontend:** Angular 21, Apollo Angular, Bootstrap 5
- **Backend:** Node.js, Express, Apollo Server, GraphQL
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (frontend), Render (backend)

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- Angular CLI

### Frontend
```bash
npm install
ng serve
```
App runs at `http://localhost:4200`

### Backend
See [Assignment 1 Repository](https://github.com/zzaki13/COMP3133_101507934_Assignment1)

---

## GraphQL Operations

### Queries
- `getEmployees` - Get all employees
- `searchEmployeeById(id)` - Get employee by ID
- `searchEmployeeByDesignationOrDepartment(designation, department)` - Search employees

### Mutations
- `signup(username, email, password)` - Register user
- `login(usernameOrEmail, password)` - Login and get JWT
- `addEmployee(...)` - Add new employee
- `updateEmployee(id, ...)` - Update employee
- `deleteEmployee(id)` - Delete employee
