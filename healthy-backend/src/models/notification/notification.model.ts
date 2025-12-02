import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["low_stock", "system", "warning", "info"],
      required: true,
    },

    message: { type: String, required: true },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
    }, // optional — used for low_stock

    read: { type: Boolean, default: false },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
