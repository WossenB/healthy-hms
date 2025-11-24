import Prescription from "./prescription.model.js";
import Consultation from "../consultation/consultation.model.js";

export const createPrescription = async (consultationId, data, doctorId) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) throw new Error("Consultation not found");

  const prescription = await Prescription.create({
    consultation: consultationId,
    patient: consultation.patient,
    doctor: doctorId,
    ...data,
  });

  // link to consultation
  consultation.prescriptions.push(prescription._id);
  await consultation.save();

  return prescription;
};

export const getPrescriptionById = async (id) => {
  return await Prescription.findById(id)
    .populate("doctor", "name email")
    .populate("patient", "firstName lastName")
    .populate("consultation", "_id diagnosis");
};


export const getPrescriptionsByPatient = async (patientId) => {
  return await Prescription.find({ patient: patientId })
    .populate("doctor", "name email")
    .sort({ createdAt: -1 });
};

export const getPrescriptionsByConsultation = async (consultId) => {
  return await Prescription.find({ consultation: consultId });
};




