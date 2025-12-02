import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., ICU, General, Maternity
    capacity: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Ward", wardSchema);
