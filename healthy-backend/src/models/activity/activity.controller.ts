import ActivityLog from "./activityLog.model.js";

export const getActivityLogs = async (req, res, next) => {
  try {
    const {
      user,
      role,
      module,
      action,
      type,
      from,
      to,
    } = req.query;

    // Explicit filter shape so TypeScript recognizes dynamic props
    const filter: {
      ["user._id"]?: string;
      role?: string;
      module?: string;
      action?: string;
      type?: string;
      createdAt?: { $gte?: Date; $lte?: Date };
    } = {};

    if (user) filter["user._id"] = user;
    if (role) filter.role = role;
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (type) filter.type = type;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};
