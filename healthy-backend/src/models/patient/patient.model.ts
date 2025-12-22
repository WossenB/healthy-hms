import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    // Optional medical info
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    documents: {
      type: [String],
      default: [],
    },
    chronicDiseases: [{ type: String }],
    allergies: [{ type: String }],

    // Audit fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ phone: 1 }, { unique: true });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ isActive: 1 });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
