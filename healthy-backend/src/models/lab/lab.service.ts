import LabRequest from "./LabRequest.js";
import Patient from "../patient/patient.model.js";

export const createLabRequest = async (data) => {
  const { patient, testType, description, requestedBy } = data;

  // Check if the patient exists
  const existingPatient = await Patient.findById(patient);
  if (!existingPatient) throw new Error("Patient not found");

  const labRequest = await LabRequest.create({
    patient,
    testType,
    description,
    requestedBy,
  });

  return labRequest;
};

export const getAllLabRequests = async (filter = {}) => {
  return await LabRequest.find(filter)
    .populate("patient", "firstName lastName gender")
    .populate("requestedBy", "name role email")
    .sort({ createdAt: -1 });
};

export const getLabRequestById = async (id: string) => {
  return await LabRequest.findById(id)
    .populate("patient", "firstName lastName gender")
    .populate("requestedBy", "name role email");
};

export const updateLabRequest = async (id: string, updates) => {
  return await LabRequest.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteLabRequest = async (id: string) => {
  return await LabRequest.findByIdAndDelete(id);
};
