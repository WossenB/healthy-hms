import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. 'CREATE_PATIENT', 'UPDATE_PATIENT', 'DELETE_PATIENT'
    target: { type: mongoose.Schema.Types.ObjectId, refPath: "targetModel" },
    targetModel: { type: String, required: true }, // e.g. 'Patient'
    details: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
