import express from "express";
import { protect } from "../../midleware/auth.js";
import { attachLabRequestController } from "./consultation.controller.js";

import {
  createConsultationController,
  getConsultationByIdController,
  listConsultationsByPatientController,
} from "./consultation.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consultations
 *   description: Doctor consultations
 */

const doctorOnly = (req, res, next) => {
  if (!["doctor", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Create a new consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Consultation created
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, doctorOnly, createConsultationController);

/**
 * @swagger
 * /api/consultations/{id}:
 *   get:
 *     summary: Get consultation by ID
 *     tags: [Consultations]
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
 *         description: Consultation data
 *       404:
 *         description: Not found
 */
router.get("/:id", protect, getConsultationByIdController);

/**
 * @swagger
 * /api/consultations/patient/{patientId}:
 *   get:
 *     summary: List consultations for a patient
 *     tags: [Consultations]
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
 *         description: Consultations list
 */
router.get("/patient/:patientId", protect, listConsultationsByPatientController);

/**
 * @swagger
 * /api/consultations/{id}/add-lab:
 *   post:
 *     summary: Attach lab request to consultation
 *     tags: [Consultations]
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
 *         description: Lab request attached
 */
router.post(
  "/:id/add-lab",
  protect,
  (req, res, next) => {
    if (!["doctor", "admin"].includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  },
  attachLabRequestController
);
export default router;
