import { Router } from "express";
import ActivityLog from "./activityLog.model";
import { protect, authorize } from "../../midleware/auth";

const router = Router();

// GET activity logs (admin only)
router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
