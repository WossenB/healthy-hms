import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobile-banking"],
      required: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },

    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate receipt number
paymentSchema.pre("save", function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = "RCPT-" + Date.now();
  }
  next();
});

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
