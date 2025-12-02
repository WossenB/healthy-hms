import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createWardController,
  getWardsController,
  getBedsByWardController,
  assignBedController,
  releaseBedController
} from "./ward.controller.js";

const router = express.Router();

// Only admin can create wards
router.post("/", protect, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  next();
}, createWardController);

// List all wards
router.get("/", protect, getWardsController);

// List all beds in a ward
router.get("/beds/:wardId", protect, getBedsByWardController);

// Assign bed to patient
router.put("/assign/:bedId", protect, assignBedController);

// Release bed
router.put("/release/:bedId", protect, releaseBedController);

export default router;
