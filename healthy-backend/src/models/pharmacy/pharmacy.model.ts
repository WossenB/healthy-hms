import mongoose from "mongoose";

const pharmacyItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    strength: { type: String, required: true }, // e.g. "500mg"
    unit: { type: String, enum: ["tablet", "syrup", "capsule", "injection"], required: true },

    quantity: { type: Number, required: true, min: 0 },

    expiryDate: { type: Date, required: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("PharmacyItem", pharmacyItemSchema);
