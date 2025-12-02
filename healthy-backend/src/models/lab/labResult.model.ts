import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabRequest",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    findings: {
      type: Object,
      required: true,
    },

    remarks: {
      type: String,
    },

    files: [
      {
        type: String, // store file URL such as /uploads/lab-results/file.pdf
      },
    ],

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.LabResult || mongoose.model("LabResult", labResultSchema);
