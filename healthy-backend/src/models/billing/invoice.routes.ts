import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createInvoiceController,
  getInvoiceController,
  getByPatientController,
  getByConsultationController,
  payInvoiceController,
} from "./invoice.controller.js";

const router = express.Router();

// Create invoice (Admin + Doctor)
router.post(
  "/",
  protect,
  (req, res, next) => {
    if (!["admin", "doctor"].includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  },
  createInvoiceController
);

// Get invoice
router.get("/:id", protect, getInvoiceController);

// Get invoices by patient
router.get("/by-patient/:patientId", protect, getByPatientController);

// Get invoices by consultation
router.get(
  "/by-consultation/:consultationId",
  protect,
  getByConsultationController
);

// Mark as PAID
router.put(
  "/pay/:id",
  protect,
  (req, res, next) => {
    if (!["admin", "cashier"].includes(req.user.role))
      return res.status(403).json({ message: "Only cashier/admin can mark paid" });
    next();
  },
  payInvoiceController
);

export default router;
