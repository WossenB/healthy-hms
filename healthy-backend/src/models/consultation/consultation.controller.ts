import {
    createConsultation,
    getConsultationById,
    listConsultationsByPatient,
  } from "./consultation.service.js";
  import { logAction } from "../../utils/auditLogger.js";
  import { addLabToConsultation } from "./consultation.service.js";
  
  export const createConsultationController = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        patient: req.body.patientId,
        doctor: req.user.id,
      };
  
      const consultation = await createConsultation(data);
  
      await logAction(
        req.user.id,
        "CREATE_CONSULTATION",
        consultation._id,
        "Consultation",
        { patient: consultation.patient }
      );
  
      res.status(201).json({
        message: "Consultation created successfully",
        consultation,
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getConsultationByIdController = async (req, res, next) => {
    try {
      const consultation = await getConsultationById(req.params.id);
      if (!consultation)
        return res.status(404).json({ message: "Consultation not found" });
  
      res.json(consultation);
    } catch (err) {
      next(err);
    }
  };
  
  export const listConsultationsByPatientController = async (req, res, next) => {
    try {
      const consultations = await listConsultationsByPatient(req.params.patientId);
      res.json(consultations);
    } catch (err) {
      next(err);
    }
  };
  export const attachLabRequestController = async (req, res, next) => {
    try {
      const { id } = req.params;         // consultation id
      const { labRequestId } = req.body; // sent from postman
  
      const updated = await addLabToConsultation(id, labRequestId);
  
      res.json({
        message: "Lab request attached successfully",
        consultation: updated,
      });
    } catch (error) {
      next(error);
    }
  };