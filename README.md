#🌿 Healthy HMS — Hospital Management System

Healthy HMS is a scalable, modular hospital management system built with a clean architecture approach.
It includes EMR/MRS features such as patient management, lab workflows, authentication, audit trails, and more.

This backend is structured for real hospital operations and designed to integrate with a future frontend/mobile app.

📅 Project Progress Overview
✅ Week 1 — System Foundation
🔐 Authentication & Access Control

JWT-based login system

Secure password hashing (bcrypt)

Role-based access (Admin, Doctor, Technician, Pharmacy, Nurse)

Auth middleware: protect()

Admin seeding script for initial setup

🛠 System Setup

Express + TypeScript backend initialized

MongoDB connection with Mongoose

Structured project architecture

Global error handling

Environment variable configuration (.env)

🧪 Testing

Login tested in Postman

Protected routes validated using JWT

Database connection verified

✅ Week 2 — Patient Management Module
🏥 Patient Module (MRS/EMR Core)

Patient registration

Patient listing with pagination + filtering + search

Single patient view

Update patient info

Soft delete patient (isActive = false)

🔐 Role Authorization

Only Admin and Doctor can manage patients

🕵️ Audit Logs

All actions automatically logged:

CREATE_PATIENT

UPDATE_PATIENT

DELETE_PATIENT

🔗 Endpoints
Method	Endpoint	Description
POST	/api/patients	Create patient
GET	/api/patients	List + Search
GET	/api/patients/:id	Get one patient
PUT	/api/patients/:id	Update
DELETE	/api/patients/:id	Soft delete
✅ Week 3 — Laboratory Module (Requests & Results)
🧪 Lab Request System

Doctors/Admins can:

Create lab requests

View all lab requests

View single lab request

Update lab request

Soft delete lab request

🔬 Lab Result System

Lab Technicians/Admins can:

Upload lab results + file attachments (PDF, images, etc.)

Store structured findings (JSON)

Automatically link results to their corresponding request

Mark lab request status → completed

Retrieve results by:

Result ID

Request ID

Patient ID

📁 File Upload Handling

Multer-based upload middleware

Files stored inside uploads/lab-results/

Public URLs returned in API response

🔗 Example Lab Result Endpoints
Method	Endpoint	Description
POST	/api/labs	Create lab request
GET	/api/labs/:id	Get lab request
PUT	/api/labs/:id	Update lab request
DELETE	/api/labs/:id	Soft delete
POST	/api/lab-results	Upload lab result
GET	/api/lab-results/:id	Get result
GET	/api/lab-results/by-request/:requestId	Get result by request
GET	/api/lab-results/by-patient/:patientId	All results for patient
📂 Current Project Structure
healthy-backend/
└── src/
    ├── config/
    ├── middleware/
    │   ├── auth.ts
    │   ├── errorHandler.ts
    │   └── upload.ts
    ├── models/
    │   ├── patient/
    │   ├── lab/
    │   └── User.ts
    ├── routes/
    ├── utils/
    └── server.ts

🛠 Tech Stack

Node.js + Express

TypeScript

MongoDB + Mongoose

JWT Authentication

bcrypt Password Security

Multer File Uploads

Postman for API Testing
