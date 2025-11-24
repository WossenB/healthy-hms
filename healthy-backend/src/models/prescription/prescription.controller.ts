import {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByConsultation
} from "./prescription.service.js";
import { logAction } from "../../utils/auditLogger.js";

// Create new prescription
export const addPrescriptionController = async (req, res, next) => {
  try {
    const prescription = await createPrescription(req.params.id, {
      doctor: req.user.id,
      ...req.body,
    });

    await logAction(req.user.id, "CREATE_PRESCRIPTION", prescription._id, "Prescription");

    res.status(201).json({
      message: "Prescription added successfully",
      prescription,
    });
  } catch (err) {
    next(err);
  }
};

// Get single prescription
export const getPrescriptionController = async (req, res, next) => {
  try {
    const pres = await getPrescriptionById(req.params.id);
    if (!pres) return res.status(404).json({ message: "Prescription not found" });
    res.json(pres);
  } catch (err) {
    next(err);
  }
};

// Get prescriptions by patient
export const getByPatientController = async (req, res, next) => {
  try {
    const list = await getPrescriptionsByPatient(req.params.patientId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Get prescriptions by consultation
export const getByConsultationController = async (req, res, next) => {
  try {
    const list = await getPrescriptionsByConsultation(req.params.consultationId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};
