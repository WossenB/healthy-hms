import express from "express";
import ActivityLog from "./activityLog.model.js";
import { protect, authorize } from "../../midleware/auth.js";

const router = express.Router();

/**
  GET /api/activity-logs
  Query params: module, user, role, type, from, to, limit
  Admin-only.
*/
router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { module, user, role, type, from, to, limit = 200 } = req.query;
    const filter: any = {};

    if (module) filter.module = module;
    if (user) filter.user = user;
    if (role) filter.role = role;
    if (type) filter.type = type;

    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(String(from));
    if (to) filter.createdAt.$lte = new Date(String(to));

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("user", "name email role");

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
