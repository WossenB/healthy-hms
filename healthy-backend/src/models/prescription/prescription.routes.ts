import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  addPrescriptionController,
  getPrescriptionController,
  getByPatientController,
  getByConsultationController,
} from "./prescription.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Medication prescriptions
 */

/**
 * @swagger
 * /api/prescriptions/add/{id}:
 *   post:
 *     summary: Add prescription for a consultation
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultation ID
 *     responses:
 *       201:
 *         description: Prescription created
 */
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

/**
 * @swagger
 * /api/prescriptions/by-patient/{patientId}:
 *   get:
 *     summary: Get prescriptions by patient
 *     tags: [Prescriptions]
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
 *         description: List of prescriptions
 */
// GET routes — specific BEFORE generic
router.get("/by-patient/:patientId", protect, getByPatientController);

/**
 * @swagger
 * /api/prescriptions/by-consultation/{consultationId}:
 *   get:
 *     summary: Get prescriptions by consultation
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
router.get("/by-consultation/:consultationId", protect, getByConsultationController);

/**
 * @swagger
 * /api/prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     tags: [Prescriptions]
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
 *         description: Prescription data
 *       404:
 *         description: Not found
 */
// MUST BE LAST
router.get("/:id", protect, getPrescriptionController);

export default router;
