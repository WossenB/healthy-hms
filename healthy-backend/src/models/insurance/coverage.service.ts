import InsuranceCoverage from "./coverage.model.js";

export const addCoverage = (data) => {
  return InsuranceCoverage.create(data);
};

export const getPatientCoverage = (patientId) => {
  return InsuranceCoverage.findOne({ patient: patientId, active: true })
    .populate("insuranceCompany");
};

export const updateCoverage = (id, data) => {
  return InsuranceCoverage.findByIdAndUpdate(id, data, { new: true });
};

export const disableCoverage = (id) => {
  return InsuranceCoverage.findByIdAndUpdate(id, { active: false }, { new: true });
};
