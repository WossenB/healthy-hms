import * as service from "./report.service.js";

// Finance (admin only)
export const financeOverviewController = async (req, res, next) => {
  try {
    const data = await service.financeOverview();
    res.json(data);
  } catch (err) { next(err); }
};

export const financeDailyController = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(String(req.query.date)) : new Date();
    const data = await service.financeDaily(date);
    res.json(data);
  } catch (err) { next(err); }
};

export const financeMonthlyController = async (req, res, next) => {
  try {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth();
    const data = await service.financeMonthly(year, month);
    res.json(data);
  } catch (err) { next(err); }
};

// Patients (staff + admin)
export const patientReportController = async (req, res, next) => {
  try {
    const data = await service.patientStats();
    res.json(data);
  } catch (err) { next(err); }
};

// Labs
export const labReportController = async (req, res, next) => {
  try {
    const data = await service.labStats();
    res.json(data);
  } catch (err) { next(err); }
};

// Inventory (admin)
export const inventoryReportController = async (req, res, next) => {
  try {
    const data = await service.inventoryStats();
    res.json(data);
  } catch (err) { next(err); }
};

// Overview (admin only)
export const overviewController = async (req, res, next) => {
  try {
    const out = await service.overviewReport();
    res.json(out);
  } catch (err) { next(err); }
};
