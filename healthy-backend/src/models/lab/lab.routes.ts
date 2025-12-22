import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createLabRequestController,
  getAllLabRequestsController,
  getLabRequestByIdController,
  updateLabRequestController,
  deleteLabRequestController,
} from "./lab.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Labs
 *   description: Lab requests
 */

/**
 * @swagger
 * /api/labs:
 *   post:
 *     summary: Create a new lab request
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lab request created
 */
// Create lab request
router.post("/", protect, createLabRequestController);

/**
 * @swagger
 * /api/labs:
 *   get:
 *     summary: Get all lab requests
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lab requests
 */
// Get all lab requests
router.get("/", protect, getAllLabRequestsController);

/**
 * @swagger
 * /api/labs/{id}:
 *   get:
 *     summary: Get lab request by ID
 *     tags: [Labs]
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
 *         description: Lab request data
 *       404:
 *         description: Not found
 */
// ⭐ GET single lab request
router.get("/:id", protect, getLabRequestByIdController);

/**
 * @swagger
 * /api/labs/{id}:
 *   put:
 *     summary: Update lab request
 *     tags: [Labs]
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
// Update lab request
router.put("/:id", protect, updateLabRequestController);

/**
 * @swagger
 * /api/labs/{id}:
 *   delete:
 *     summary: Delete lab request
 *     tags: [Labs]
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
 *         description: Deleted
 */
// Delete lab request
router.delete("/:id", protect, deleteLabRequestController);

export default router;
