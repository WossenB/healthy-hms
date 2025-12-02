import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    ward: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
    bedNumber: { type: String, required: true },
    occupied: { type: Boolean, default: false },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);
