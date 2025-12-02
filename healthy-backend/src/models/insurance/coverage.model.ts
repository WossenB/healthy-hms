import mongoose from "mongoose";

const insuranceCoverageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    insuranceCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsuranceCompany",
      required: true,
    },
    policyNumber: String,
    memberId: String,
    coveragePercentage: { type: Number, default: 80 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("InsuranceCoverage", insuranceCoverageSchema);
