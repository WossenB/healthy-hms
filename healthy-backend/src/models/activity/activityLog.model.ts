import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },

    module: { type: String, required: true },    // e.g. "patients", "inventory", "billing"
    action: { type: String, required: true },    // e.g. "create", "update", "deduct_stock"
    description: { type: String, required: true },

    type: { type: String, enum: ["light", "advanced"], default: "light" },

    // Advanced audit fields
    before: { type: Object, default: null },
    after: { type: Object, default: null },
    changes: { type: Object, default: null }
  },
  { timestamps: true }
);

activityLogSchema.index({ module: 1 });
activityLogSchema.index({ role: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
