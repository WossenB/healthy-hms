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

// Create lab request
router.post("/", protect, createLabRequestController);

// Get all lab requests
router.get("/", protect, getAllLabRequestsController);

// ⭐ GET single lab request
router.get("/:id", protect, getLabRequestByIdController);

// Update lab request
router.put("/:id", protect, updateLabRequestController);

// Delete lab request
router.delete("/:id", protect, deleteLabRequestController);

export default router;
