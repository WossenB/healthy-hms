// src/models/dashboard/dashboard.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as svc from "./dashboard.service.js";
import Consultation from "../consultation/consultation.model.js";
import { getDailyRevenue } from "./dashboard.service.js";
import { getOutstandingDebts } from "./dashboard.service.js";
import InventoryItem from "../inventory/inventory.model.js";
import Prescription from "../prescription/prescription.model.js";
import LabRequest from "../lab/LabRequest.js";
import Patient from "../patient/patient.model.js";
import Ward from "../ward/ward.model.js";
import Bed from "../ward/bed.model.js";

export const adminSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.getSummary();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

export const revenueTimeseries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt((req.query.days as string) || "30", 10);
    const series = await svc.getRevenueTimeseries(days);
    res.json({ series });
  } catch (err) {
    next(err);
  }
};
export const getDailyRevenueController = async (req, res) => {
  const days = Number(req.query.days) || 30;

  const result = await getDailyRevenue(days);
  res.json(result);
};
export const outstandingDebtsController = async (req, res) => {
  const debts = await getOutstandingDebts();
  res.json(debts);
};

export const patientsPerMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const months = parseInt((req.query.months as string) || "6", 10);
    const series = await svc.getPatientsPerMonth(months);
    res.json({ series });
  } catch (err) {
    next(err);
  }
};

export const consultationsPerWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const weeks = parseInt((req.query.weeks as string) || "8", 10);

    const start = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);

    const rows = await Consultation.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%G-W%V",   // Example "2025-W48"
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = rows.map(r => ({
      week: r._id,
      count: r.count,
    }));

    res.json({ series: result });
  } catch (err) {
    next(err);
  }
};

export const inventoryOverviewController = async (req, res) => {
  const items = await InventoryItem.find();

  // Total inventory stock value
  const totalValue = items.reduce((sum, item) => {
    const price = item.price || 0; // if you don't have price, we skip or set zero
    return sum + price * item.quantity;
  }, 0);

  // Items below threshold
  const lowStockItems = items.filter(item => item.quantity <= item.threshold);

  // Top 5 items needing restock
  const restockList = lowStockItems
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  res.json({
    totalValue,
    lowStockCount: lowStockItems.length,
    restockList
  });
};

export const laboratoryStatsController = async (req, res) => {
  // total number of lab tests
  const totalTests = await LabRequest.countDocuments();

  // most common lab tests
  const popularTests = await LabRequest.aggregate([
    {
      $group: {
        _id: "$testType",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // weekly test trend – last 7 days
  const weeklyTrend = await LabRequest.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    totalTests,
    popularTests,
    weeklyTrend
  });
};

export const pharmacyStatsController = async (req, res) => {
  // total prescriptions issued
  const totalPrescriptions = await Prescription.countDocuments();

  // most used medicines (group by medicineName)
  const topMedicines = await Prescription.aggregate([
    {
      $group: {
        _id: "$medicineName",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // prescriptions issued per day (last 7 days)
  const last7Days = await Prescription.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    totalPrescriptions,
    topMedicines,
    last7Days
  });
};

export const lowStockList = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await svc.getLowStock();
    res.json({ list });
  } catch (err) {
    next(err);
  }
};

export const expiringSoon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt((req.query.days as string) || "30", 10);
    const list = await svc.getExpiringSoon(days);
    res.json({ list });
  } catch (err) {
    next(err);
  }
};

export const topMedications = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await svc.getTopMedications();
    res.json({ list });
  } catch (err) {
    next(err);
  }
};

export const patientGrowthController = async (req, res) => {

  // 1) New patients per month (last 12 months)
  const monthlyNewPatients = await Patient.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // 2) Active patients (those who had a consultation)
  const activePatients = await Patient.countDocuments({ isActive: true });

  // 3) Inactive patients
  const inactivePatients = await Patient.countDocuments({ isActive: false });

  res.json({
    monthlyNewPatients,
    activePatients,
    inactivePatients
  });
};
export const resourceUtilizationController = async (req, res) => {
  // Total beds
  const totalBeds = await Bed.countDocuments();

  // Occupied beds
  const occupiedBeds = await Bed.countDocuments({ occupied: true });

  // Free beds
  const freeBeds = await Bed.countDocuments({ occupied: false });

  // Occupancy rate
  const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  // Average stay duration (if model contains admission/discharge dates)
  let averageStay = 0;

  try {
    const stays = await Bed.aggregate([
      {
        $match: {
          admissionDate: { $exists: true },
          dischargeDate: { $exists: true }
        }
      },
      {
        $project: {
          stayLength: {
            $divide: [
              { $subtract: ["$dischargeDate", "$admissionDate"] },
              1000 * 60 * 60 * 24 // convert ms → days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageStay: { $avg: "$stayLength" }
        }
      }
    ]);

    if (stays.length > 0) {
      averageStay = stays[0].averageStay;
    }
  } catch (_) {
    averageStay = 0;
  }

  res.json({
    totalBeds,
    occupiedBeds,
    freeBeds,
    occupancyRate: Number(occupancyRate.toFixed(2)),
    averageStay
  });
};
