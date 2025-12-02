// src/models/dashboard/dashboard.routes.ts
import express from "express";
import { protect, authorize } from "../../midleware/auth.js";
import { getDailyRevenueController } from "./dashboard.controller.js";
import { outstandingDebtsController } from "./dashboard.controller.js";
import { inventoryOverviewController } from "./dashboard.controller.js";
import { pharmacyStatsController } from "./dashboard.controller.js";
import { laboratoryStatsController } from "./dashboard.controller.js";
import { patientGrowthController } from "./dashboard.controller.js";
import { resourceUtilizationController } from "./dashboard.controller.js";
import {
  adminSummary,
  revenueTimeseries,
  patientsPerMonth,
  consultationsPerWeek,
  lowStockList,
  expiringSoon,
  topMedications,
} from "./dashboard.controller.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// all routes require admin
router.get("/admin", protect, authorize(["admin"]), adminSummary);

// charts / timeseries
router.get("/revenue", protect, authorize(["admin"]), revenueTimeseries); // ?days=30
router.get("/patients-month", protect, authorize(["admin"]), patientsPerMonth); // ?months=6
router.get("/consultations-week", protect, authorize(["admin"]), consultationsPerWeek); // ?weeks=8
router.get("/revenue/daily", protect, authorize(["admin"]), getDailyRevenueController);
router.get("/debts", protect, adminOnly, outstandingDebtsController);
router.get("/inventory-overview", protect,  adminOnly, inventoryOverviewController );
router.get("/pharmacy-stats", protect, adminOnly,pharmacyStatsController);
router.get("/laboratory-stats", protect, adminOnly, laboratoryStatsController);
router.get("/patient-growth", protect, adminOnly, patientGrowthController);
router.get( "/resource-utilization", protect, adminOnly, resourceUtilizationController);



// inventory / notifications
router.get("/low-stock", protect, authorize(["admin"]), lowStockList);
router.get("/expiring-soon", protect, authorize(["admin"]), expiringSoon); // ?days=30
router.get("/top-medications", protect, authorize(["admin"]), topMedications);

export default router;
