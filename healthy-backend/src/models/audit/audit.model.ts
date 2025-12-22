import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    targetModel: {
      type: String,
      required: false,
    },

    details: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

// 🔥 Add indexes for filtering performance
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ targetModel: 1 });
AuditLogSchema.index({ createdAt: -1 });

// Re-use compiled model in watch mode to avoid OverwriteModelError
export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
