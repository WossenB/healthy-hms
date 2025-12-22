import express from "express";
import {
  createPatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController,
} from "./patient.controller.js";
import { uploadPatientDocs } from "../../utils/upload.js";
import { protect, authorize } from "../../midleware/auth.js";
import { uploadPatientDocuments } from "./patient.controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management
 */

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, authorizeRoles("admin", "doctor", "reception", "nurse"), createPatientController);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: List of patients
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, authorizeRoles("admin", "doctor", "nurse", "reception"), getAllPatientsController);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.get("/:id", protect, authorizeRoles("admin", "doctor", "nurse", "reception"), getPatientByIdController);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.put("/:id", protect, authorizeRoles("admin", "doctor", "nurse", "reception"), updatePatientController);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.delete("/:id", protect, authorizeRoles("admin"), deletePatientController);

/**
 * @swagger
 * /api/patients/{id}/upload:
 *   post:
 *     summary: Upload patient documents
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
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
 *         description: Files uploaded successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.post("/:id/upload", protect, authorize( "admin", "reception"), uploadPatientDocs.array("files", 5), uploadPatientDocuments);

export default router;
