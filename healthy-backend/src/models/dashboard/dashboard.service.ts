// src/models/dashboard/dashboard.service.ts
import Invoice from "../billing/invoice.model.js";
import Payment from "../payment/Payment.model.js";
import Patient from "../patient/patient.model.js";
import InventoryItem from "../inventory/inventory.model.js";
import Consultation from "../consultation/consultation.model.js";
import Ward from "../ward/ward.model.js";
import Notification from "../notification/notification.model.js";
import Prescription from "../prescription/prescription.model.js";
import LabRequest from "../lab/LabRequest.js";
import mongoose from "mongoose";

/**
 * Helper: date range helpers
 */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const getSummary = async () => {
  // Patients
  const totalPatients = await Patient.countDocuments();
  const newPatientsThisMonth = await Patient.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  });

  // Consultations
  const totalConsultations = await Consultation.countDocuments();
  const consultationsThisMonth = await Consultation.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  });

  // Financials
  const totalRevenueAgg = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } },
  ]);
  const totalRevenue = (totalRevenueAgg[0] && totalRevenueAgg[0].total) || 0;

  const pendingInvoices = await Invoice.countDocuments({ status: "unpaid" });
  const paidInvoices = await Invoice.countDocuments({ status: "paid" });

  // Inventory
  const totalInventoryItems = await InventoryItem.countDocuments();
  const lowStockItems = await InventoryItem.find({ $expr: { $lte: ["$quantity", "$threshold"] } }).limit(10);

  // Wards & Beds
  const totalWards = await Ward.countDocuments();
  const bedsAgg = await Ward.aggregate([
    { $unwind: "$beds" },
    { $group: { _id: null, totalBeds: { $sum: 1 }, occupied: { $sum: { $cond: ["$beds.occupied", 1, 0] } } } },
  ]);
  const totalBeds = (bedsAgg[0] && bedsAgg[0].totalBeds) || 0;
  const occupiedBeds = (bedsAgg[0] && bedsAgg[0].occupied) || 0;

  // Notifications
  const unreadNotifications = await Notification.countDocuments({ read: false });

  // Quick counts
  return {
    patients: { total: totalPatients, newThisMonth: newPatientsThisMonth },
    consultations: { total: totalConsultations, thisMonth: consultationsThisMonth },
    revenue: { total: totalRevenue, pendingInvoices, paidInvoices },
    inventory: { totalItems: totalInventoryItems, lowStockCount: lowStockItems.length, lowStockExamples: lowStockItems.slice(0, 6) },
    wards: { totalWards, totalBeds, occupiedBeds, availableBeds: totalBeds - occupiedBeds },
    notifications: { unread: unreadNotifications },
  };
};

export const getDailyRevenue = async (days = 30) => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const revenue = await Invoice.aggregate([
    {
      $match: {
        status: "paid",
        paidAt: { $gte: sinceDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
          day: { $dayOfMonth: "$paidAt" }
        },
        total: { $sum: "$total" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1
      }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day"
          }
        },
        total: 1
      }
    }
  ]);

  return revenue;
};

export const getOutstandingDebts = async () => {
  return Invoice.find({ status: "unpaid" })
    .populate("patient", "firstName lastName")
    .select("total createdAt patient");
};
export const getRevenueTimeseries = async (days = 30) => {
  const start = startOfDay(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));
  const pipeline = [
    { $match: { status: "completed", createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        total: { $sum: "$amountPaid" },
      },
    },
    { $sort: { "_id": 1 } },
  ];
  const rows = await Payment.aggregate(pipeline);
  // normalize to include days with zero
  const map = new Map(rows.map((r) => [r._id, r.total]));
  const out = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const label = day.toISOString().slice(0, 10);
    out.push({ date: label, total: map.get(label) || 0 });
  }
  return out;
};

/**
 * Patients per month (last `months` months)
 */
export const getPatientsPerMonth = async (months = 6) => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const pipeline = [
    { $match: { createdAt: { $gte: first } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
  const rows = await Patient.aggregate(pipeline);
  // normalize
  const map = new Map(rows.map((r) => [r._id, r.count]));
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toISOString().slice(0, 7);
    out.push({ month: label, count: map.get(label) || 0 });
  }
  return out;
};

/**
 * Consultations per week (last N weeks)
 */
export const getConsultationsPerWeek = async (weeks = 8) => {
  const start = startOfDay(new Date(Date.now() - (weeks * 7 - 1) * 24 * 60 * 60 * 1000));
  const pipeline = [
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          $isoWeekYear: "$createdAt",
          week: { $isoWeek: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        label: { $concat: [{ $toString: "$_id.$isoWeekYear" }, "-W", { $toString: "$_id.week" }] },
        count: 1,
      },
    },
    { $sort: { label: 1 } },
  ];
  const rows = await Consultation.aggregate(pipeline);
  return rows.map((r) => ({ week: r.label, count: r.count }));
};

/**
 * Low-stock & expiring soon
 */
export const getLowStock = async (limit = 20) => {
  const low = await InventoryItem.find({ $expr: { $lte: ["$quantity", "$threshold"] } }).sort({ quantity: 1 }).limit(limit);
  return low;
};

export const getExpiringSoon = async (days = 30) => {
  const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return InventoryItem.find({ expiryDate: { $lte: cutoff } }).sort({ expiryDate: 1 }).limit(20);
};

export const getTopMedications = async (limit = 10) => {
  // naive approach: top by total dispensed (if you have dispense logs add an aggregation)
  // we try to use prescriptions frequency
  const rows = await Prescription.aggregate([
    { $group: { _id: "$medicineName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return rows.map((r) => ({ name: r._id, prescriptions: r.count }));
};
