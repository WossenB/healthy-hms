import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createPaymentController,
  getPaymentController,
  getPaymentsByPatientController,
  getAllPaymentsController,
} from "./payment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Invoice payments
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Payment recorded
 */
// Cashier + Admin
router.post("/", protect, (req, res, next) => {
  if (!["admin", "cashier"].includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
}, createPaymentController);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment
 */
// Get one payment
router.get("/:id", protect, getPaymentController);

/**
 * @swagger
 * /api/payments/by-patient/{patientId}:
 *   get:
 *     summary: Get payments by patient
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payments
 */
// Get all payments for patient
router.get("/by-patient/:patientId", protect, getPaymentsByPatientController);

// Get all payments
router.get("/", protect, getAllPaymentsController);

export default router;
