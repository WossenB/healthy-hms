import Invoice from "./invoice.model.js";

export const createInvoice = async (data) => {
  const invoice = await Invoice.create(data);

  // Auto-calc total
  invoice.total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  await invoice.save();

  return invoice;
};

export const getInvoiceById = async (id) => {
  return await Invoice.findById(id)
    .populate("patient", "firstName lastName")
    .populate("consultation", "diagnosis");
};

export const getInvoicesByPatient = async (patientId) => {
  return await Invoice.find({ patient: patientId });
};

export const getInvoicesByConsultation = async (consultationId) => {
  return await Invoice.find({ consultation: consultationId });
};

export const markInvoicePaid = async (id, userId) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new Error("Invoice not found");

  invoice.status = "paid";
  invoice.paidAt = new Date();
  invoice.updatedBy = userId;

  await invoice.save();
  return invoice;
};
