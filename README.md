# Healthy HMS (Hospital Management System)

Healthy HMS is a modular hospital management system designed with a micro-service inspired structure.  
It includes core medical and administrative features: EMR/MRS, patient records, appointments, billing, pharmacy, lab, and inventory.

---

## ✅ Week-1 Deliverables (Completed)

### 🔐 Authentication & Access Control
- JWT-based login
- Role-based access (Admin, Doctor, Nurse, Lab Tech, Pharmacy)
- Auth middleware (`protect`)
- Password hashing (bcrypt)
- Admin seeding script

### 🧠 System Setup
- TypeScript backend
- Express server
- MongoDB connection
- Environment config (`.env`)
- Project structure cleaned & organized
- Error handling middleware

### 🧪 Testing & Validation
- Tested login in Postman
- Tested protected route access with JWT
- Verified database connection

---

## 📂 Project Structure (Current)

healthy-backend/
└─ src/
├─ config/
├─ middleware/
├─ models/
├─ routes/
├─ utils/

---

## 🚀 Next (Week-2 Goals)

| Module | Goal |
|---|---|
Patient Module | CRUD + validation + role access  
Doctor restrictions | Only admin & doctors can manage patients  
Postman Collection | Full testing suite  
Prepare for Appointment System | Next phase after Patients  

---

## 🏥 Week 2 - Patient Management Module

### ✅ Completed Features
- Patient model, routes, and controllers
- Create, view, update, and soft delete
- Pagination, filtering, and search
- Role-based access (Admin, Doctor)
- Audit log system (tracks CREATE, UPDATE, DELETE actions)

### 📦 Example Endpoints
- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/:id`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

  ---

## 🛠️ Tech Stack

- Node.js (Express + TypeScript)
- MongoDB & Mongoose
- JWT Authentication
- bcrypt password hashing
- Postman API testing
