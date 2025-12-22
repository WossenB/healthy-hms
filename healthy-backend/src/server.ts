import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './midleware/errorHandler.js';
import { protect, type AuthRequest } from './midleware/auth.js';
import patientRoutes from "./models/patient/patient.routes.js";
import labRoutes from "./models/lab/lab.routes.js";
import labResultRoutes from "./models/lab/labResult.routes.js";
import consultationRoutes from "./models/consultation/consultation.routes.js";
import prescriptionRoutes from "./models/prescription/prescription.routes.js";
import pharmacyRoutes from "./models/pharmacy/pharmacy.routes.js";
import invoiceRoutes from "./models/billing/invoice.routes.js";
import paymentRoutes from "./models/payment/payment.routes.js";
import insuranceCompanyRoutes from "./models/insurance/company.routes.js";
import coverageRoutes from "./models/insurance/coverage.routes.js";
import claimRoutes from "./models/insurance/claim.routes.js";
import wardRoutes from "./models/ward/ward.routes.js";
import inventoryRoutes from "./models/inventory/inventory.routes.js";
import reportRoutes from "./models/reports/report.routes.js";
import dashboardRoutes from "./models/dashboard/dashboard.routes.js";
import notificationRoutes from "./models/notification/notification.routes.js"; 
import activityLogRoutes from "./models/activity/activityLog.routes.js";
import auditLogRoutes from "./models/audit/audit.routes.js";
import messageRoutes from "./models/message/message.routes.js";
import appointmentRoutes from "./models/appointment/appointment.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";


import path from "path";
 // ✅ import at top

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/insurance-companies", insuranceCompanyRoutes);
app.use("/api/insurance-coverage", coverageRoutes);
app.use("/api/insurance-claims", claimRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.get('/', (_, res) => res.send('Healthy HMS Backend ✅'));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ✅ Protected test route
app.get('/api/protected', protect, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted ✅', user: req.user });
});

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
