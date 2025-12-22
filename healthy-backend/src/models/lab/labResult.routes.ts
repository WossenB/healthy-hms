import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  uploadLabResultController,
  getLabResultByIdController,
  getLabResultByRequestController,
  getResultsByPatientController,
} from "./labResult.controller.js";
import { uploadFiles } from "../../midleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: LabResults
 *   description: Lab result files and reports
 */

/**
 * @swagger
 * /api/lab-results:
 *   post:
 *     summary: Upload lab result files
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Results uploaded
 */
// Only technicians and admins can upload results
router.post(
  "/",
  protect,
  (req, res, next) => {
    if (!["technician", "admin"].includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
    next();
  },
  uploadFiles.array("files", 6), // field name = files, max 6
  uploadLabResultController
);

/**
 * @swagger
 * /api/lab-results/{id}:
 *   get:
 *     summary: Get lab result by ID
 *     tags: [LabResults]
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
 *         description: Lab result
 */
// Get a result by result id
router.get("/:id", protect, (req, res, next) => {
  if (!["doctor", "technician", "admin"].includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
}, getLabResultByIdController);

/**
 * @swagger
 * /api/lab-results/by-request/{requestId}:
 *   get:
 *     summary: Get lab results by lab request
 *     tags: [LabResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab results
 */
// Get by lab request id
router.get("/by-request/:requestId", protect, getLabResultByRequestController);

/**
 * @swagger
 * /api/lab-results/by-patient/{patientId}:
 *   get:
 *     summary: Get lab results by patient
 *     tags: [LabResults]
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
 *         description: Lab results
 */
// Get by patient
router.get("/by-patient/:patientId", protect, getResultsByPatientController);

export default router;
