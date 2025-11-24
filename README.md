# Healthy HMS — Hospital Management System (Backend)

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/)
[![Node](https://img.shields.io/badge/node-%3E%3D14.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Healthy HMS is a modular, scalable Hospital Management System backend built with Node.js, Express, TypeScript, and MongoDB. It aims to provide a clean, well-structured EMR/HMS backend supporting authentication, patient management, consultations, labs, prescriptions, pharmacy, and more.

Table of Contents
- Project Overview
- Tech Stack
- Key Features (by week)
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
- Uploads / Files
- Testing
- Roadmap (Next)
- Contributing
- License
- Author

Project Overview
----------------
Healthy HMS provides RESTful APIs to manage hospital workflows: authentication and RBAC, patient records, lab requests and results, consultations, prescriptions, and pharmacy dispensing. It focuses on modularity, audit logging, and clear separation of concerns to make it easy to extend.

Tech Stack
----------
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- Multer for file uploads
- Role-Based Access Control (Admin, Doctor, Nurse, Lab Tech, Pharmacy)
- REST API architecture

Key Features (by week)
----------------------
Week 1 — Authentication & Core
- JWT login + role-based access
- bcrypt password hashing
- Auth middleware and protected routes
- Admin seeding script
- Centralized error handler

Week 2 — Patient Management
- Create / Read / Update / Soft Delete patients
- Pagination, filtering, and search (name, phone, ID)
- Role access (Admin & Doctor)
- Full audit logging for CRUD actions

Week 3 — Laboratory Module
- Create lab requests (doctors)
- Status tracking: pending → completed
- Lab results: upload PDFs/images, findings as JSON
- Auto-link results to lab requests
- File serving via /uploads

Week 4 — Consultations, Prescriptions & Pharmacy
- Consultations: record symptoms, diagnosis, vitals and link lab requests/prescriptions
- Prescriptions: linked to consultations; query by patient/consultation
- Pharmacy: manage stock, edit medicines, dispense from prescription with auto-deduction and audit

Project Structure
-----------------
healthy-backend/
├─ src/
│  ├─ config/           # DB & env setup
│  ├─ middleware/       # auth, error handler, file uploads
│  ├─ models/           # modular models (patient, lab, consultation, prescription, pharmacy)
│  ├─ routes/           # route registrars
│  ├─ utils/            # helpers (JWT, audit logger, etc)
├─ uploads/              # lab result uploads (served publicly)
├─ server.ts             # app entry point

Getting Started
---------------
Prerequisites
- Node.js >= 14
- npm or yarn
- MongoDB (local or a hosted instance)

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
Create a `.env` file in the project root with at least:

```
MONGO_URI=your_mongo_connection_url
JWT_SECRET=your_secret_key
PORT=4000
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
- All endpoints under /api are protected unless noted.
- Use Authorization: Bearer <token> header for protected routes.
- Role-based access: Admin, Doctor, Nurse, Lab Tech, Pharmacy.

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
- POST /api/patients — Create patient (Admin, Doctor)
- GET /api/patients — Paginated list with filters
- GET /api/patients/:id — Get by ID
- PUT /api/patients/:id — Update
- DELETE /api/patients/:id — Soft delete

Example: Create patient
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+2519xxxxxxx",
    "dob": "1990-05-12",
    "gender": "female"
  }'
```

Laboratory
- POST /api/labs — Create lab request (Doctor)
- POST /api/lab-results — Upload lab result (Lab Tech) — multipart/form-data for files
- GET /api/labs/:id
- GET /api/lab-results/by-request/:requestId
- GET /api/lab-results/by-patient/:patientId

Consultations
- POST /api/consultations — Create consultation (Doctor)
- POST /api/consultations/:id/add-lab-request — Attach lab request
- GET /api/consultations/:id

Prescriptions
- POST /api/prescriptions/add/:consultationId — Create prescription
- GET /api/prescriptions/:id
- GET /api/prescriptions/by-patient/:patientId
- GET /api/prescriptions/by-consultation/:consultationId

Pharmacy
- POST /api/pharmacy — Add medicine to stock
- GET /api/pharmacy
- GET /api/pharmacy/:id
- PUT /api/pharmacy/:id
- POST /api/pharmacy/dispense/:prescriptionId — Dispense medicines (auto-deduct stock, audit who dispensed)

Uploads / Files
- Uploaded lab results (PDF/images) are saved to /uploads.
- Files are served statically at the /uploads route (e.g., http://host/uploads/<file>).

Testing
-------
- Use Postman / Insomnia to exercise the API endpoints.
- Seeded admin credentials (if seeder runs at setup) may be:
  - Email: admin@healthy.local
  - Password: Admin@123
- Run unit/integration tests (if any)
  ```bash
  npm test
  ```

Roadmap (Next: Week 5+)
-----------------------
Planned features:
- Inventory Module (equipment & supplies)
  - Stock in / stock out, batch & expiry, low stock alerts
- Billing & Invoicing
  - Service charges, payments, patient billing history
- Notifications & Alerts
- Improved analytics and reporting

Contributing
------------
Contributions, issues, and feature requests are welcome.
1. Fork the repo
2. Create a feature branch: git checkout -b feat/my-feature
3. Commit your changes: git commit -m "feat: add ..."
4. Push to the branch and open a PR

Guidelines
- Use TypeScript types & interfaces
- Write unit tests for new features
- Keep endpoints RESTful and documented

License
-------
MIT — See the LICENSE file for details.

Author
------
Wossen Berhanu  
Backend Developer • Full-Stack Engineer • Node.js & React Specialist  
GitHub: @WossenB

Contact / Support
- Open an issue on this repository for bugs or feature requests.
- For design/architecture questions, please include relevant request ids, example payloads, and logs where appropriate.

Thank you for checking out Healthy HMS — contributions and feedback are very welcome!
