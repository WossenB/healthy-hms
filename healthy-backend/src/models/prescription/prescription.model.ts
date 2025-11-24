import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },          // "500mg"
    frequency: { type: String, required: true },       // "3 times a day"
    duration: { type: String, required: true },        // "5 days"
    route: { type: String, default: "oral" },          // oral, injection, IV
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
