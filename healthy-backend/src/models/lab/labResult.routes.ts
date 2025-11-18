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

// Get a result by result id
router.get("/:id", protect, (req, res, next) => {
  if (!["doctor", "technician", "admin"].includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
}, getLabResultByIdController);

// Get by lab request id
router.get("/by-request/:requestId", protect, getLabResultByRequestController);

// Get by patient
router.get("/by-patient/:patientId", protect, getResultsByPatientController);

export default router;
