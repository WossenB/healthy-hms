import Payment from "./Payment.model.js";
import Invoice from "../billing/invoice.model.js";

export const createPayment = async ({
  invoiceId,
  amountPaid,
  paymentMethod,
  transactionId,
  receivedBy,
}) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  if (invoice.status === "paid") throw new Error("Invoice already paid");

  if (amountPaid < invoice.total)
    throw new Error("Paid amount is less than invoice total");

  const payment = await Payment.create({
    invoice: invoiceId,
    patient: invoice.patient,
    amountPaid,
    paymentMethod,
    transactionId,
    receivedBy,
  });

  // Mark invoice as paid
  invoice.status = "paid";
  invoice.paidAt = new Date();
  await invoice.save();

  return payment;
};

export const getPaymentById = async (id) => {
  return await Payment.findById(id)
    .populate("patient", "firstName lastName")
    .populate("invoice", "total status")
    .populate("receivedBy", "name email");
};

export const getPaymentsByPatient = async (patientId) => {
  return await Payment.find({ patient: patientId }).populate(
    "invoice",
    "total status"
  );
};

export const getAllPayments = async () => {
  return await Payment.find()
    .populate("patient", "firstName lastName")
    .populate("invoice", "total status");
};
