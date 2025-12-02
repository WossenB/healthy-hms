import express from "express";
import { protect, authorize } from "../../midleware/auth.js";
import {
  financeOverviewController,
  financeDailyController,
  financeMonthlyController,
  patientReportController,
  labReportController,
  inventoryReportController,
  overviewController
} from "./report.controller.js";

const router = express.Router();

// Finance - admin only
router.get("/finance", protect, authorize(["admin"]), financeOverviewController);
router.get("/finance/daily", protect, authorize(["admin"]), financeDailyController);
router.get("/finance/monthly", protect, authorize(["admin"]), financeMonthlyController);

// Patients - staff + admin
router.get("/patients", protect, authorize(["admin","doctor","nurse","reception"]), patientReportController);

// Labs - lab_tech, doctor, admin
router.get("/labs", protect, authorize(["admin","lab_tech","doctor"]), labReportController);

// Inventory - admin only
router.get("/inventory", protect, authorize(["admin"]), inventoryReportController);
router.get("/inventory/low-stock", protect, authorize(["admin"]), async (req, res, next) => {
  try {
    const data = await (await import("../inventory/inventory.service.js")).listInventoryItems();
    const low = data.filter(i => i.quantity <= i.threshold);
    res.json(low);
  } catch (err) { next(err); }
});
router.get("/inventory/expiring", protect, authorize(["admin"]), async (req, res, next) => {
  try {
    const in30 = new Date(); in30.setDate(in30.getDate()+30);
    const data = await (await import("../inventory/inventory.service.js")).listInventoryItems();
    const exp = data.filter(i => i.expiryDate && new Date(i.expiryDate) <= in30);
    res.json(exp);
  } catch (err) { next(err); }
});

// Overview - admin only (Option A)
router.get("/overview", protect, authorize(["admin"]), overviewController);

export default router;
