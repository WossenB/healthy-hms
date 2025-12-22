# Healthy HMS — Hospital Management System (Backend)

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/WossenB/healthy-hms)
[![Node](https://img.shields.io/badge/node-%3E%3D14.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Healthy HMS is a modular, production-oriented backend for hospital operations and clinical workflows. Built with Node.js, Express, TypeScript and MongoDB, it provides REST APIs for authentication, patient management, labs, consultations, prescriptions, pharmacy, billing, insurance, wards & beds, inventory, notifications, and admin analytics.

Table of Contents
- Project Overview
- Tech Stack
- Key Features
- Project Structure
- Getting Started
  - Prerequisites
  - Installation
  - Environment Variables
  - Scripts
- API Highlights & Example Requests
- Uploads / Files
- Testing & Postman
- Seeding & Migration Notes
- Roadmap
- Contributing
- License
- Author & Contact

Project Overview
----------------
Healthy HMS supports both clinical and administrative workflows with role-based access control and audit logging. It aims to be extensible so teams can add integrations (payment gateways, insurer webhooks), real-time notifications, or multi-tenant support.

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

Key Features
------------
- Authentication & role enforcement (JWT)
- Patient CRUD with pagination, search & soft-delete
- Lab requests and lab result uploads (files + JSON findings)
- Consultations & prescriptions (link to patients & doctors)
- Pharmacy stock with dispense & auto-deduction
- Billing & payments (invoices, multiple payment methods, outstanding balances)
- Insurance (companies, policies, claim generation)
- Wards & beds (auto-generate beds, assign/release)
- Inventory management (stock in/out, expiry, low-stock alerts)
- Notifications (system alerts, mark read/unread)
- Admin dashboard endpoints (revenue, patient growth, lab trends, etc.)
- Uploads served from a configurable directory
- Seeders for initial admin and demo data (if included)

Project Structure (recommended)
-------------------------------
src/
  ├─ config/           # DB & environment setup
  ├─ middleware/       # auth, error handler, uploads, role guard
  ├─ models/
  │   ├─ patient/
  │   ├─ lab/
  │   ├─ consultations/
  │   ├─ pharmacy/
  │   ├─ billing/
  │   ├─ payment/
  │   ├─ insurance/
  │   ├─ ward/
  │   ├─ inventory/
  │   └─ notification/
  ├─ routes/
  ├─ services/         # business logic (billing, claims, inventory)
  ├─ utils/            # helpers (jwt, audit logger, csv/pdf)
  ├─ app.ts
  └─ server.ts

Getting Started
---------------

Prerequisites
- Node.js >= 14
- npm >= 6 or yarn
- MongoDB (local or hosted)

Installation
1. Clone the repo
```bash
git clone https://github.com/WossenB/healthy-hms.git
cd healthy-hms
```

2. Install dependencies
```bash
npm install
# or
yarn
```

Environment Variables
Create a `.env` file in the project root. Minimum recommended variables:
```
MONGO_URI=mongodb://localhost:27017/healthy_hms
JWT_SECRET=your_jwt_secret
PORT=4000
UPLOAD_DIR=uploads
NODE_ENV=development
SALT_ROUNDS=10
LOG_LEVEL=info
DEFAULT_PAGE_SIZE=20
ADMIN_EMAIL=admin@healthy.local
ADMIN_PASSWORD=Admin@123
```

Important:
- Keep `JWT_SECRET` and any payment/insurer keys secret (use secrets manager in production).
- Set `UPLOAD_DIR` to a secure path accessible by your server process.

Scripts
- Development (watch): npm run dev
- Build: npm run build
- Start (production): npm start
- Seed (if available): npm run seed
- Lint/Format/Test: npm run lint | npm run test | npm run format

(Confirm scripts in package.json; adjust commands above to match.)

API Highlights & Example Requests
--------------------------------
Base URL example: http://localhost:4000/api

Notes:
- All protected endpoints require `Authorization: Bearer <JWT>`
- Role checks enforced on role-protected routes

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
    "role": "Admin",
    "name": "Admin User"
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
- POST /api/billing/invoices — Create invoice (auto-link to services)
- GET /api/billing/invoices/:id
- GET /api/billing/by-patient/:patientId
- POST /api/billing/pay/:invoiceId — body: { method: "cash" | "insurance" | "card", amount: 100, reference?: "..." }
- GET /api/billing/outstanding

Insurance
- POST /api/insurance/companies
- POST /api/insurance/policies
- POST /api/insurance/claims/generate/:invoiceId
- GET /api/insurance/claims/:id

Wards & Beds
- POST /api/wards — Create ward with capacity
- GET /api/wards
- POST /api/wards/:wardId/generate-beds
- POST /api/beds/:bedId/assign
- POST /api/beds/:bedId/release
- GET /api/wards/occupancy

Inventory & Notifications
- POST /api/inventory
- GET /api/inventory
- POST /api/inventory/:id/stock-in
- POST /api/inventory/:id/stock-out
- GET /api/inventory/low-stock
- GET /api/notifications
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
- Uploaded lab results and other files are stored under `UPLOAD_DIR` (default: `uploads/`).
- Files can be served via a static route such as `/uploads/<filename>` (ensure production security & access controls).

Testing & Postman
-----------------
- Use Postman, Insomnia, or similar to test endpoints.
- Import a Postman collection if included in `postman/` or `docs/`.
- Example base URL: http://localhost:4000/api
- Example seeded admin: admin@healthy.local / Admin@123 (if seeder provided)

Seeding & Migration Notes
-------------------------
- New models added for extended modules: billing, payment, insurance, ward, bed, inventory, notification.
- If you upgrade from a smaller initial release, run seeder/migration scripts to create:
  - Admin user & roles
  - Default insurance companies/policies
  - Sample wards & beds
  - Initial inventory items & thresholds
- Migration tips:
  - Back up MongoDB before running migrations.
  - Add indexes for high-read collections (patients, invoices).
  - Review role assignments: add Billing Clerk, Inventory Manager where needed.

Security & Production Considerations
------------------------------------
- Use HTTPS and strong JWT expiration + refresh pattern.
- Keep secrets in a secrets manager or environment variables in your deployment platform.
- Limit file uploads size and validate file types for lab results.
- Sanitize inputs and add strict rate-limiting on auth endpoints.
- Add monitoring and alerting for job failures and background processing.

Roadmap
-------
Planned next items:
- Payment gateway integration (Stripe/Paystack)
- Claims reconciliation and insurer webhooks
- Advanced reporting and scheduled reports
- Real-time notifications (WebSockets)
- Role & permission manager (admin UI)
- Multi-tenancy support for hospitals/clinics

Contributing
------------
Contributions are welcome. Suggested workflow:
1. Fork the repository
2. Create a feature branch: git checkout -b feat/your-feature
3. Commit changes: git commit -m "feat: your feature"
4. Push and open a Pull Request

Guidelines
- Use TypeScript types & interfaces.
- Add tests for changes.
- Keep endpoints RESTful.
- Add audit logs for write operations where appropriate.

License
-------
MIT — See the LICENSE file for details.

Author
------
Wossen Berhanu  
Backend Developer • Full-Stack Engineer • Node.js & React Specialist  
GitHub: [@WossenB](https://github.com/WossenB)

Contact / Support
-----------------
- Open an issue on this repository for bugs or feature requests.
- For migration/architecture questions, provide example payloads and logs.

Appendix — Example JSON Schemas (short)
---------------------------------------
Invoice (example):
```json
{
  "patientId": "603dcd...",
  "items": [
    { "description": "Consultation", "price": 20, "quantity": 1 },
    { "description": "Lab: CBC", "price": 15, "quantity": 1 }
  ],
  "total": 35,
  "payments": [],
  "status": "pending"
}
```

Claim (example):
```json
{
  "invoiceId": "60abcd...",
  "insurerId": "60insr...",
  "policyId": "60pol...",
  "requestedAmount": 35,
  "status": "submitted"
}
```

Need help finishing anything else?
- I can generate a Postman collection for the endpoints above.
- I can add detailed JSON schemas for key models (patient, invoice, claim).
- I can draft seed scripts for admin/wards/inventory if you want — tell me which seed data you prefer.
