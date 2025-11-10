import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
} from "./patient.service.js";
import { logAction } from "../../utils/auditLogger.js";

export const createPatientController = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const patient = await createPatient(data);

    // 🔹 Log creation action
    await logAction(req.user.id, "CREATE_PATIENT", patient._id, "Patient", {
      name: `${patient.firstName} ${patient.lastName}`,
    });

    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (err) {
    next(err);
  }
};

export const getAllPatientsController = async (req, res, next) => {
  try {
    const result = await getAllPatients(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getPatientByIdController = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id);
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

export const updatePatientController = async (req, res, next) => {
  try {
    const updated = await updatePatient(req.params.id, req.body);

    // 🔹 Log update action
    await logAction(req.user.id, "UPDATE_PATIENT", updated._id, "Patient", req.body);

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePatientController = async (req, res, next) => {
  try {
    const deleted = await softDeletePatient(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });

    // 🔹 Log delete (soft delete) action
    await logAction(req.user.id, "DELETE_PATIENT", deleted._id, "Patient", {
      isActive: deleted.isActive,
    });

    res.status(200).json({ message: "Patient deactivated" });
  } catch (err) {
    next(err);
  }
};
