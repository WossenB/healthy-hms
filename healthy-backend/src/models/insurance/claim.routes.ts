import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createClaimController,
  approveClaimController,
  rejectClaimController,
  getClaimController,
  getClaimsByPatientController
} from "./claim.controller.js";

const router = express.Router();

router.post("/", protect, createClaimController);
router.put("/approve/:id", protect, approveClaimController);
router.put("/reject/:id", protect, rejectClaimController);
router.get("/:id", protect, getClaimController);
router.get("/patient/:patientId", protect, getClaimsByPatientController);

export default router;
