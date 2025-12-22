import ActivityLog from "../models/activity/activityLog.model.js";

/**
 * logActivity(params)
 * params:
 *  - user: { id, role }  (req.user)
 *  - module: string
 *  - action: string
 *  - description: string
 *  - type: "light" | "advanced"
 *  - before: object | null
 *  - after: object | null
 */
export const logActivity = async ({ user, module, action, description, type = "light", before = null, after = null }) => {
  let changes = null;

  if (type === "advanced" && before && after) {
    changes = {};
    // compute field-level differences (shallow)
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    keys.forEach((k) => {
      const a = before[k];
      const b = after[k];
      // treat undefined and null as different values
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        changes[k] = { from: a === undefined ? null : a, to: b === undefined ? null : b };
      }
    });
  }

  await ActivityLog.create({
    user: user.id || user._id,
    role: user.role,
    module,
    action,
    description,
    type,
    before,
    after,
    changes
  });
};
