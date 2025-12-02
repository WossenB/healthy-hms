import mongoose from "mongoose";

const insuranceCompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    contactEmail: String,
    contactPhone: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("InsuranceCompany", insuranceCompanySchema);
