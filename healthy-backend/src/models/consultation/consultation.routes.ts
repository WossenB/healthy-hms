import express from "express";
import { protect } from "../../midleware/auth.js";
import { attachLabRequestController } from "./consultation.controller.js";

import {
  createConsultationController,
  getConsultationByIdController,
  listConsultationsByPatientController,
} from "./consultation.controller.js";

const router = express.Router();

const doctorOnly = (req, res, next) => {
  if (!["doctor", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.post("/", protect, doctorOnly, createConsultationController);

router.get("/:id", protect, getConsultationByIdController);

router.get("/patient/:patientId", protect, listConsultationsByPatientController);
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
