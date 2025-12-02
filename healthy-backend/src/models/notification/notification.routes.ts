import express from "express";
import { protect } from "../../midleware/auth.js";

import {
  createNotificationController,
  listNotificationsController,
  listUnreadNotificationsController,
  markReadController,
  deleteNotificationController,
} from "./notification.controller.js";

const router = express.Router();

// Create
router.post("/", protect, createNotificationController);

// List all
router.get("/", protect, listNotificationsController);

// List unread
router.get("/unread", protect, listUnreadNotificationsController);

// Mark read
router.put("/read/:id", protect, markReadController);

// Delete
router.delete("/:id", protect, deleteNotificationController);

export default router;