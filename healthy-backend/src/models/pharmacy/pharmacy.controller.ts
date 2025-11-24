import {
    createMedicine,
    updateMedicine,
    getAllMedicines,
    getMedicineById,
    dispenseMedicine,
  } from "./pharmacy.service.js";
  
  export const addMedicineController = async (req, res, next) => {
    try {
      const item = await createMedicine({ ...req.body, createdBy: req.user.id });
      res.status(201).json({ message: "Medicine added", item });
    } catch (err) {
      next(err);
    }
  };
  
  export const updateMedicineController = async (req, res, next) => {
    try {
      const updated = await updateMedicine(req.params.id, {
        ...req.body,
        updatedBy: req.user.id,
      });
      res.json({ message: "Medicine updated", updated });
    } catch (err) {
      next(err);
    }
  };
  
  export const listMedicinesController = async (req, res, next) => {
    try {
      const items = await getAllMedicines();
      res.json(items);
    } catch (err) {
      next(err);
    }
  };
  
  export const getMedicineController = async (req, res, next) => {
    try {
      const item = await getMedicineById(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (err) {
      next(err);
    }
  };
  
  export const dispenseController = async (req, res, next) => {
    try {
      const data = await dispenseMedicine(
        req.params.prescriptionId,
        req.user.id
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  