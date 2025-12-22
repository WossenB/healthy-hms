import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: { type: String, required: true }, // e.g. consumable, equipment

    quantity: { type: Number, required: true },

    unit: { type: String, required: true }, // e.g. pcs, boxes, liters

    threshold: { type: Number, default: 10 }, // Low-stock trigger

    expiryDate: { type: Date }, // optional for medicines & perishables

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ quantity: 1 });

export default mongoose.model("InventoryItem", inventorySchema);
