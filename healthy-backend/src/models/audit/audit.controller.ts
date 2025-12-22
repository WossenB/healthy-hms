import AuditLog from "./audit.model.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { user, action, model, from, to } = req.query;

    // Explicit filter shape so TypeScript recognizes createdAt usage
    const filter: {
      user?: string;
      action?: string;
      targetModel?: string;
      createdAt?: { $gte?: Date; $lte?: Date };
    } = {};

    if (user) filter.user = user;
    if (action) filter.action = action;
    if (model) filter.targetModel = model;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await AuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};