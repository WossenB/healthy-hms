import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  addMedicineController,
  updateMedicineController,
  listMedicinesController,
  getMedicineController,
  dispenseController,
} from "./pharmacy.controller.js";

const router = express.Router();

const allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
};

// Add medicine (admin + pharmacist)
router.post("/", protect, allow("admin", "pharmacist"), addMedicineController);

// Update medicine
router.put("/:id", protect, allow("admin", "pharmacist"), updateMedicineController);

// List
router.get("/", protect, listMedicinesController);

// Single item
router.get("/:id", protect, getMedicineController);

// Dispense medicine
router.post(
  "/dispense/:prescriptionId",
  protect,
  allow("admin", "pharmacist"),
  dispenseController
);

export default router;
