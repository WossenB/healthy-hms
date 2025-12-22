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

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Billing and invoices
 */

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Invoice created
 */
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

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
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
 *         description: Invoice
 */
// Get invoice
router.get("/:id", protect, getInvoiceController);

/**
 * @swagger
 * /api/invoices/by-patient/{patientId}:
 *   get:
 *     summary: Get invoices by patient
 *     tags: [Invoices]
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
 *         description: Invoices
 */
// Get invoices by patient
router.get("/by-patient/:patientId", protect, getByPatientController);

// Get invoices by consultation
router.get(
  "/by-consultation/:consultationId",
  protect,
  getByConsultationController
);

/**
 * @swagger
 * /api/invoices/pay/{id}:
 *   put:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
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
 *         description: Invoice marked as paid
 */
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
