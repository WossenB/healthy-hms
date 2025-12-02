import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createPaymentController,
  getPaymentController,
  getPaymentsByPatientController,
  getAllPaymentsController,
} from "./payment.controller.js";

const router = express.Router();

// Cashier + Admin
router.post("/", protect, (req, res, next) => {
  if (!["admin", "cashier"].includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
}, createPaymentController);

// Get one payment
router.get("/:id", protect, getPaymentController);

// Get all payments for patient
router.get("/by-patient/:patientId", protect, getPaymentsByPatientController);

// Get all payments
router.get("/", protect, getAllPaymentsController);

export default router;
