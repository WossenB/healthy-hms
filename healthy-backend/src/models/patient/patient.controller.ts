import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
} from "./patient.service.js";

import { logAction } from "../../utils/auditLogger.js";
import { logActivity } from "../../utils/logActivity.js";
import { successResponse } from "../../utils/response.js";

// ----------------------------------------------------
// CREATE PATIENT (Light Log + Action Log)
// ----------------------------------------------------
export const createPatientController = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const patient = await createPatient(data);

    // 🔹 Basic audit logger
    await logAction(req.user.id, "CREATE_PATIENT", patient._id, "Patient", {
      name: `${patient.firstName} ${patient.lastName}`,
    });

    // 🔹 Light hybrid audit
    await logActivity({
      user: req.user,
      module: "patients",
      action: "create",
      description: `Created patient ${patient.firstName} ${patient.lastName}`,
      type: "light",
      before: null,
      after: patient.toObject(),
    });

    return successResponse(
      res,
      "Patient created successfully",
      patient,
      null,
      201
    );
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------
// GET ALL PATIENTS
// ----------------------------------------------------
export const getAllPatientsController = async (req, res, next) => {
  try {
    const result = await getAllPatients(req.query);
    return successResponse(
      res,
      "Patients fetched successfully",
      result.data,
      result.meta
    );
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------
// GET PATIENT BY ID
// ----------------------------------------------------
export const getPatientByIdController = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id);
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------
// UPDATE PATIENT (Advanced Log + C3 Diff)
// ----------------------------------------------------
export const updatePatientController = async (req, res, next) => {
  try {
    // Get BEFORE snapshot
    const before = await getPatientById(req.params.id);
    if (!before) return res.status(404).json({ message: "Patient not found" });

    const beforeObj = before.toObject();

    // Update patient
    const updated = await updatePatient(req.params.id, req.body);
    const afterObj = updated.toObject();

    // 🔹 Advanced hybrid audit with full before/after + diff
    await logActivity({
      user: req.user,
      module: "patients",
      action: "update",
      description: `Updated patient ${updated._id}`,
      type: "advanced",
      before: beforeObj,
      after: afterObj,
    });

    // 🔹 Basic audit log entry
    await logAction(req.user.id, "UPDATE_PATIENT", updated._id, "Patient", req.body);

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updated,
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------------------
// SOFT DELETE PATIENT (Light Log)
// ----------------------------------------------------
export const deletePatientController = async (req, res, next) => {
  try {
    const deleted = await softDeletePatient(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });

    // 🔹 Basic log
    await logAction(req.user.id, "DELETE_PATIENT", deleted._id, "Patient", {
      isActive: deleted.isActive,
    });

    // 🔹 Light audit (no need for before/after here)
    await logActivity({
      user: req.user,
      module: "patients",
      action: "delete",
      description: `Soft deleted patient ${deleted._id}`,
      type: "light",
      before: null,
      after: { isActive: deleted.isActive },
    });

    res.status(200).json({ message: "Patient deactivated" });
  } catch (err) {
    next(err);
  }
};
export const uploadPatientDocuments = async (req, res, next) => {
  try {
    if (!req.files) return res.status(400).json({ message: "No files uploaded" });

    const files = req.files.map(
      (file) => `/${file.path.replace(/\\/g, "/")}`
    );

    const patient = await updatePatient(req.params.id, {
      $push: { documents: { $each: files } },
    });

    res.json({
      message: "Documents uploaded successfully",
      files,
    });
  } catch (err) {
    next(err);
  }
};
