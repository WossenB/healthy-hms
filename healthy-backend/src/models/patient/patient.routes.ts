import express from "express";
import {
  createPatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController,
} from "./patient.controller.js";
import { protect } from "../../midleware/auth.js";

const router = express.Router();

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.post("/", protect, authorizeRoles("admin", "doctor"), createPatientController);
router.get("/", protect, authorizeRoles("admin", "doctor"), getAllPatientsController);
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getPatientByIdController);
router.put("/:id", protect, authorizeRoles("admin", "doctor"), updatePatientController);
router.delete("/:id", protect, authorizeRoles("admin", "doctor"), deletePatientController);

export default router;


