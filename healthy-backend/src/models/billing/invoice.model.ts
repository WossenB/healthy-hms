import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },

    items: [invoiceItemSchema],

    total: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["unpaid", "paid", "cancelled"],
      default: "unpaid",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paidAt: { type: Date },
  },
  { timestamps: true }
);

invoiceSchema.index({ patient: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: -1 });


export default mongoose.model("Invoice", invoiceSchema);

