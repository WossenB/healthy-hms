import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './midleware/errorHandler.js';
import { protect, type AuthRequest } from './midleware/auth.js';
import patientRoutes from "./models/patient/patient.routes.js";
import labRoutes from "./models/lab/lab.routes.js";
import labResultRoutes from "./models/lab/labResult.routes.js";
import consultationRoutes from "./models/consultation/consultation.routes.js";
import prescriptionRoutes from "./models/prescription/prescription.routes.js";
import pharmacyRoutes from "./models/pharmacy/pharmacy.routes.js";
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
app.get('/', (_, res) => res.send('Healthy HMS Backend ✅'));

// ✅ Protected test route
app.get('/api/protected', protect, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted ✅', user: req.user });
});

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
