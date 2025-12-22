import express from "express";
import { protect, authorize } from "../../midleware/auth.js";
import {
  createAppointmentController,
  doctorQueueController,
  updateAppointmentStatusController,
} from "./appointment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment scheduling and queues
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Appointment created
 *       401:
 *         description: Unauthorized
 */
// Receptionist books
router.post(
  "/",
  protect,
  authorize("reception", "doctor"),
  createAppointmentController
);

/**
 * @swagger
 * /api/appointments/queue:
 *   get:
 *     summary: Get doctor's appointment queue
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue fetched
 *       401:
 *         description: Unauthorized
 */
// Doctor views queue
router.get(
  "/queue",
  protect,
  authorize("doctor"),
  doctorQueueController
);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Unauthorized
 */
// Update status
router.put(
  "/:id/status",
  protect,
  authorize("doctor", "reception"),
  updateAppointmentStatusController
);

export default router;
