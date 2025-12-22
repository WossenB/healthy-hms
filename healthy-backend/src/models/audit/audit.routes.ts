import { Router } from "express";
import AuditLog from "./audit.model";
import { protect, authorize } from "../../midleware/auth";

const router = Router();

// GET all audit logs (Admin only)
router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
