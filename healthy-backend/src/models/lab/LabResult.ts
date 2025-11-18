import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "LabRequest", required: true },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Technician
    findings: { type: String, required: true },
    attachmentUrl: { type: String }, // Optional file (e.g., PDF result)
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("LabResult", labResultSchema);
