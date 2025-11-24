import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  addPrescriptionController,
  getPrescriptionController,
  getByPatientController,
  getByConsultationController,
} from "./prescription.controller.js";

const router = express.Router();

router.post(
  "/add/:id",
  protect,
  (req, res, next) => {
    if (!["doctor", "admin"].includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  },
  addPrescriptionController
);

// GET routes — specific BEFORE generic
router.get("/by-patient/:patientId", protect, getByPatientController);
router.get("/by-consultation/:consultationId", protect, getByConsultationController);

// MUST BE LAST
router.get("/:id", protect, getPrescriptionController);

export default router;
