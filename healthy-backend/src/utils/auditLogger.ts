import AuditLog from "../models/AuditLog.js";

export const logAction = async (userId, action, targetId, targetModel, details = {}) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      target: targetId,
      targetModel,
      details,
    });
  } catch (error) {
    console.error("Failed to log action:", error.message);
  }
};
