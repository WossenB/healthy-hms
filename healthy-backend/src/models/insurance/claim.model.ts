import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    insuranceCompany: { type: mongoose.Schema.Types.ObjectId, ref: "InsuranceCompany", required: true },
    coveragePercentage: Number,
    amountCovered: Number,
    amountRemaining: Number,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("InsuranceClaim", insuranceClaimSchema);
