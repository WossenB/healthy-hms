import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  addMedicineController,
  updateMedicineController,
  listMedicinesController,
  getMedicineController,
  dispenseController,
} from "./pharmacy.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pharmacy
 *   description: Pharmacy inventory and dispensing
 */

const allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
};

/**
 * @swagger
 * /api/pharmacy:
 *   post:
 *     summary: Add a new medicine
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Medicine created
 */
// Add medicine (admin + pharmacist)
router.post("/", protect, allow("admin", "pharmacist"), addMedicineController);

/**
 * @swagger
 * /api/pharmacy/{id}:
 *   put:
 *     summary: Update medicine
 *     tags: [Pharmacy]
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
 *         description: Updated
 */
// Update medicine
router.put("/:id", protect, allow("admin", "pharmacist"), updateMedicineController);

/**
 * @swagger
 * /api/pharmacy:
 *   get:
 *     summary: List medicines
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medicines list
 */
// List
router.get("/", protect, listMedicinesController);

/**
 * @swagger
 * /api/pharmacy/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     tags: [Pharmacy]
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
 *         description: Medicine
 *       404:
 *         description: Not found
 */
// Single item
router.get("/:id", protect, getMedicineController);

/**
 * @swagger
 * /api/pharmacy/dispense/{prescriptionId}:
 *   post:
 *     summary: Dispense medicine for a prescription
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine dispensed
 */
// Dispense medicine
router.post(
  "/dispense/:prescriptionId",
  protect,
  allow("admin", "pharmacist"),
  dispenseController
);

export default router;
