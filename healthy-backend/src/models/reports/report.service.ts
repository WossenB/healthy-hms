import Invoice from "../billing/invoice.model.js";
import Payment from "../payment/Payment.model.js";
import Patient from "../patient/patient.model.js";
import LabRequest from "../lab/LabRequest.js";
import LabResult from "../lab/labResult.model.js";
import InventoryItem from "../inventory/inventory.model.js";

const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
};
const endOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(23,59,59,999);
  return x;
};

export const financeOverview = async () => {
  // totals
  const totalInvoices = await Invoice.countDocuments();
  const totalInvoiceAmountAgg = await Invoice.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const totalInvoiceAmount = totalInvoiceAmountAgg[0]?.total || 0;

  const totalPaymentsAgg = await Payment.aggregate([
    { $group: { _id: null, totalPaid: { $sum: "$amountPaid" } } }
  ]);
  const totalPaid = totalPaymentsAgg[0]?.totalPaid || 0;

  // outstanding
  const outstandingAgg = await Invoice.aggregate([
    { $match: { status: { $ne: "paid" } } },
    { $group: { _id: null, outstanding: { $sum: "$total" } } }
  ]);
  const outstanding = outstandingAgg[0]?.outstanding || 0;

  return {
    totalInvoices,
    totalInvoiceAmount,
    totalPaid,
    outstanding
  };
};

export const financeDaily = async (date = new Date()) => {
  const start = startOfDay(date);
  const end = endOfDay(date);

  const invoicesAgg = await Invoice.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalInvoiced: { $sum: "$total" }, count: { $sum: 1 } } }
  ]);

  const paymentsAgg = await Payment.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, count: { $sum: 1 } } }
  ]);

  return {
    date: start,
    invoices: invoicesAgg[0] || { totalInvoiced: 0, count: 0 },
    payments: paymentsAgg[0] || { totalPaid: 0, count: 0 }
  };
};

export const financeMonthly = async (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const invoicesAgg = await Invoice.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalInvoiced: { $sum: "$total" }, count: { $sum: 1 } } }
  ]);

  const paymentsAgg = await Payment.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, count: { $sum: 1 } } }
  ]);

  return {
    year,
    month,
    invoices: invoicesAgg[0] || { totalInvoiced: 0, count: 0 },
    payments: paymentsAgg[0] || { totalPaid: 0, count: 0 }
  };
};

export const patientStats = async () => {
  const totalPatients = await Patient.countDocuments();
  // new patients last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newLast7 = await Patient.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  // active patients (example: patients with consultations)
  const activeAgg = await LabRequest.aggregate([
    { $group: { _id: "$patient" } },
    { $count: "activePatients" }
  ]);
  const activePatients = activeAgg[0]?.activePatients || 0;

  return { totalPatients, newLast7, activePatients };
};

export const labStats = async () => {
  const pending = await LabRequest.countDocuments({ status: "pending" });
  const inProgress = await LabRequest.countDocuments({ status: "in-progress" });
  const completed = await LabResult.countDocuments();

  return { pending, inProgress, completed };
};

export const inventoryStats = async () => {
  const totalItems = await InventoryItem.countDocuments();
  const lowStock = await InventoryItem.find({ $expr: { $lte: ["$quantity", "$threshold"] } }).countDocuments();
  // soon-to-expire (next 30 days)
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const expiring = await InventoryItem.countDocuments({ expiryDate: { $lte: in30, $exists: true } });

  return { totalItems, lowStock, expiring };
};

export const overviewReport = async () => {
  const [finance, patients, labs, inventory] = await Promise.all([
    financeOverview(),
    patientStats(),
    labStats(),
    inventoryStats()
  ]);
  return { finance, patients, labs, inventory, generatedAt: new Date() };
};
