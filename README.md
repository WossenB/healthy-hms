# Healthy HMS — Hospital Management System (Backend)

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/)
[![Node](https://img.shields.io/badge/node-%3E%3D14.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Healthy HMS is a modular, scalable Hospital Management System backend built with Node.js, Express, TypeScript, and MongoDB. It provides a production-oriented REST API for clinical workflows, billing, inventory, insurance, wards, notifications, pharmacy, labs, consultations and admin analytics.

Summary of what I updated in this README
- Consolidated core features already implemented (Auth, Patients, Labs, Consultations, Prescriptions, Pharmacy).
- Added and documented the extended modules you described: Billing, Insurance, Wards/Beds, Inventory, Notifications, and Admin Dashboard endpoints.
- Added example endpoints, env variables, run instructions, and brief migration/upgrade notes.

Table of Contents
- Project Overview
- Tech Stack
- Key Features (by week & modules)
- Project Structure
- Getting Started
  - Prerequisites
  - Installation
  - Environment Variables
  - Running
- API Highlights & Examples
  - Authentication
  - Patients
  - Labs & Lab Results
  - Consultations, Prescriptions & Pharmacy
  - Billing & Payments
  - Insurance
  - Wards & Beds
  - Inventory & Notifications
  - Admin Dashboard / Analytics
- Uploads / Files
- Testing & Postman
- Migration / Upgrade Notes
- Roadmap (Next)
- Contributing
- License
- Author & Contact

Project Overview
----------------
Healthy HMS aims to be an extensible EMR/HMS backend that supports both clinical workflows and hospital operations (billing, inventory, wards, insurance) with role-based access and audit logging. The backend is built to be modular so features can be extended independently.

Tech Stack
----------
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- Multer for file uploads
- CORS
- Role-Based Access Control (Admin, Doctor, Nurse, Lab Tech, Pharmacy, Billing Clerk, Inventory Manager)
- REST API architecture

Key Features (by week & modules)
--------------------------------
Week 1 — Authentication & Core
- JWT login + role-based access
- bcrypt password hashing
- Auth middleware and protected routes
- Admin seeder
- Centralized error handling and logging

Week 2 — Patient Management
- Create / Read / Update / Soft Delete patients
- Pagination, filtering, search (name, phone, ID)
- Audit logging

Week 3 — Laboratory
- Lab requests by doctors
- Lab results upload (PDF/images) with JSON findings
- Status tracking & file serving

Week 4 — Consultations, Prescriptions & Pharmacy
- Consultations linked to patients and doctors
- Prescriptions linked to consultations
- Pharmacy stock management, dispense with auto-deduction and audit

Extended Modules (new / documented)
- Billing & Payments
  - Invoices, multi-method payments (cash, insurance, partial)
  - Outstanding balance tracking
  - Invoice generation endpoints
- Insurance
  - Insurance companies and coverage policies
  - Insurance claims auto-generated from billing
- Wards & Beds
  - Create wards and auto-generate beds
  - Assign / release beds
  - Occupancy metrics & endpoints
- Inventory Management
  - CRUD for inventory items, stock-in/stock-out, batch & expiry metadata
  - Threshold checks and auto-logged low-stock events
- Notification System
  - System notifications (low stock alerts, billing reminders)
  - Mark as read/unread
- Admin Dashboard API
  - Revenue, patient growth, lab trends, pharmacy stats, ward occupancy, inventory value, 30-day charts, weekly/monthly analytics, monthly new patients, etc.

Project Structure
-----------------
src/
 ├── config/           # DB & environment setup
 ├── middleware/       # auth, error handler, uploads, role guard
 ├── models/
 │    ├── patient/
 │    ├── lab/
 │    ├── consultations/
 │    ├── pharmacy/
 │    ├── billing/
 │    ├── payment/
 │    ├── insurance/
 │    ├── ward/
 │    ├── inventory/
 │    └── notification/
 ├── routes/
 ├── services/         # business logic (billing, claims, inventory processing)
 ├── utils/            # helpers (jwt, audit logger, csv/pdf helpers)
 ├── app.ts
 └── server.ts

Getting Started
---------------
Prerequisites
- Node.js >= 14
- npm or yarn
- MongoDB (local or hosted)

Installation
1. Clone the repo
   ```bash
   git clone https://github.com/<owner>/healthy-backend.git
   cd healthy-backend
   ```
2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

Environment Variables
Create a `.env` file in the project root:

```
MONGO_URI=mongodb://localhost:27017/healthy_hms
JWT_SECRET=your-secret
PORT=4000
UPLOAD_DIR=uploads
NODE_ENV=development
```

Running
- Development
  ```bash
  npm run dev
  ```
- Build & Run
  ```bash
  npm run build
  npm start
  ```

API Highlights & Examples
------------------------

Notes
- All endpoints under /api are protected unless noted otherwise.
- Use Authorization: Bearer <JWT Token> for protected routes.
- Role-based access is enforced on endpoints (Admin, Doctor, Nurse, Lab Tech, Pharmacy, Billing, Inventory roles).

Authentication
POST /api/auth/login
Request:
```json
{
  "email": "admin@healthy.local",
  "password": "Admin@123"
}
```
Response:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "603dcd...",
    "email": "admin@healthy.local",
    "role": "Admin"
  }
}
```

Patients
- POST /api/patients
- GET /api/patients?limit=20&page=1&search=jane
- GET /api/patients/:id
- PUT /api/patients/:id
- DELETE /api/patients/:id (soft delete)

Laboratory
- POST /api/labs — Create lab request
- POST /api/lab-results — Upload lab result (multipart/form-data)
- GET /api/labs/:id
- GET /api/lab-results/by-request/:requestId
- GET /api/lab-results/by-patient/:patientId

Consultations & Prescriptions
- POST /api/consultations
- POST /api/consultations/:id/add-lab-request
- POST /api/prescriptions/add/:consultationId
- GET /api/prescriptions/by-patient/:patientId

Pharmacy
- POST /api/pharmacy — Add medicine
- GET /api/pharmacy
- PUT /api/pharmacy/:id
- POST /api/pharmacy/dispense/:prescriptionId

Billing & Payments
- POST /api/billing/invoices — Create invoice (auto link to patient services)
- GET /api/billing/invoices/:id
- GET /api/billing/by-patient/:patientId
- POST /api/billing/pay/:invoiceId — Payments (body includes method: cash|insurance|partial)
- GET /api/billing/outstanding — Outstanding balances

Insurance
- POST /api/insurance/companies — Add insurer
- GET /api/insurance/companies
- POST /api/insurance/policies — Define coverage
- POST /api/insurance/claims/generate/:invoiceId — Auto-create claim from invoice
- GET /api/insurance/claims/:id

Wards & Beds
- POST /api/wards — Create ward (specify capacity)
- GET /api/wards
- POST /api/wards/:wardId/generate-beds — Auto-create beds for a ward
- POST /api/beds/:bedId/assign — Assign bed to patient
- POST /api/beds/:bedId/release — Release bed
- GET /api/wards/occupancy — Occupancy metrics

Inventory & Notifications
- POST /api/inventory — Add/update item
- GET /api/inventory
- POST /api/inventory/:id/stock-in
- POST /api/inventory/:id/stock-out
- GET /api/inventory/low-stock — Items below threshold
- GET /api/notifications — List notifications
- POST /api/notifications/mark-read/:id

Admin Dashboard / Analytics
- GET /api/dashboard/revenue-weekly
- GET /api/dashboard/revenue-monthly
- GET /api/dashboard/patient-growth
- GET /api/dashboard/lab-trends
- GET /api/dashboard/pharmacy-stats
- GET /api/dashboard/ward-occupancy
- GET /api/dashboard/inventory-value
- GET /api/dashboard/30-day-revenue-chart
- GET /api/dashboard/new-patients-monthly

Uploads / Files
- Uploaded lab results and files are saved in the `uploads/` directory.
- Files are served at /uploads/<filename> when server is configured to expose the uploads folder.

Testing & Postman
-----------------
- Use Postman / Insomnia to exercise the API.
- Import the project Postman collection (if included in repo).
- Example base URL: http://localhost:4000/api
- Seeded admin (if seeder enabled):
  - Email: admin@healthy.local
  - Password: Admin@123

Migration / Upgrade Notes
-------------------------
If you are upgrading from the initial Weeks 1–4 backend to the extended modules:
- New models/tables: billing, payment, insurance, ward, bed, inventory, notification.
- Run migrations or seed scripts if available to create default insurers, sample inventory items, and wards.
- Ensure environment variable UPLOAD_DIR is set if uploads are moved.
- Review role assignments — new roles may be required for Billing Clerk and Inventory Manager.

Roadmap (Next)
--------------
Planned enhancements after current modules:
- Payment gateway integration (Stripe/Paystack)
- Claims reconciliation and insurer webhooks
- Advanced reporting & scheduled reports
- Real-time notifications (WebSocket) for urgent alerts
- Role & permission manager with UI integration
- Multi-tenant support for hospitals/clinics

Contributing
------------
Contributions, issues, and feature requests are welcome.
1. Fork the repo
2. Create a branch: git checkout -b feat/your-feature
3. Commit: git commit -m "feat: ..."
4. Push & open a PR

Guidelines
- Use TypeScript types & interfaces
- Write tests for changes
- Keep endpoints RESTful and well-documented
- Add audit logs for write operations where appropriate

License
-------
MIT — See the LICENSE file for details.

Author
------
Wossen Berhanu  
Backend Developer • Full-Stack Engineer • Node.js & React Specialist  
GitHub: @WossenB

Contact / Support
- Open an issue on the repository for bugs or feature requests.
- For architecture or data-migration questions, include example payloads and logs.

Thank you for building Healthy HMS — this README now contains the expanded backend modules and admin analytics you described. If you want, I can:
- generate a Postman collection example for the new endpoints,
- add sample JSON schemas for billing/invoice/claim payloads,
- or create a short migration script template for inventory/wards seeding.
