import InsuranceClaim from "./claim.model.js";
import Invoice from "../billing/invoice.model.js";

export const createInsuranceClaim = async ({ invoiceId, patient, company, coverage }) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  const amountCovered = (invoice.total * coverage) / 100;
  const amountRemaining = invoice.total - amountCovered;

  const claim = await InsuranceClaim.create({
    invoice: invoiceId,
    patient,
    insuranceCompany: company,
    coveragePercentage: coverage,
    amountCovered,
    amountRemaining
  });

  return claim;
};

export const approveClaim = async (id) => {
  return InsuranceClaim.findByIdAndUpdate(id, { status: "approved" }, { new: true });
};

export const rejectClaim = async (id) => {
  return InsuranceClaim.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
};

export const getClaim = (id) => InsuranceClaim.findById(id);
export const getClaimsByPatient = (pid) => InsuranceClaim.find({ patient: pid });
