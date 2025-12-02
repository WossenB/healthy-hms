import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createCoverage,
  getCoverageByPatient,
  editCoverage,
  removeCoverage
} from "./coverage.controller.js";

const router = express.Router();

router.post("/", protect, createCoverage);
router.get("/patient/:patientId", protect, getCoverageByPatient);
router.put("/:id", protect, editCoverage);
router.delete("/:id", protect, removeCoverage);

export default router;
