import mongoose from "mongoose";

const labRequestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Doctor
    testType: { type: String, required: true }, // e.g., 'Blood Test', 'X-Ray', etc.
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    result: { type: mongoose.Schema.Types.ObjectId, ref: "LabResult" },
  },
  { timestamps: true }
);

export default mongoose.models.LabRequest || mongoose.model("LabRequest", labRequestSchema);
