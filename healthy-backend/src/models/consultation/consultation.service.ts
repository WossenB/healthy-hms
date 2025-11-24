import Consultation from "./consultation.model.js";
import LabRequest from "../lab/LabRequest.js";

export const createConsultation = async (data) => {
  const consultation = await Consultation.create(data);
  return consultation;
};

export const getConsultationById = async (id) => {
  return await Consultation.findById(id)
    .populate("patient", "firstName lastName gender")
    .populate("doctor", "name email role")
    .populate("labRequests")
    .populate("prescriptions");
};

export const listConsultationsByPatient = async (patientId) => {
  return await Consultation.find({ patient: patientId })
    .sort({ createdAt: -1 })
    .populate("doctor", "name email role");
};
export const addLabToConsultation = async (consultationId, labRequestId) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) throw new Error("Consultation not found");

  const labRequest = await LabRequest.findById(labRequestId);
  if (!labRequest) throw new Error("Lab request not found");

  // prevent duplicates
  if (consultation.labRequests.includes(labRequestId)) {
    throw new Error("Lab request already attached to this consultation");
  }

  consultation.labRequests.push(labRequestId);
  await consultation.save();

  return consultation;
};
