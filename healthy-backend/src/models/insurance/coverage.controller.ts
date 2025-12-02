import {
    addCoverage,
    getPatientCoverage,
    updateCoverage,
    disableCoverage
  } from "./coverage.service.js";
  
  export const createCoverage = async (req, res) => {
    const coverage = await addCoverage(req.body);
    res.json({ message: "Coverage added", coverage });
  };
  
  export const getCoverageByPatient = async (req, res) => {
    const coverage = await getPatientCoverage(req.params.patientId);
    res.json(coverage);
  };
  
  export const editCoverage = async (req, res) => {
    const updated = await updateCoverage(req.params.id, req.body);
    res.json({ message: "Updated", updated });
  };
  
  export const removeCoverage = async (req, res) => {
    const updated = await disableCoverage(req.params.id);
    res.json({ message: "Disabled", updated });
  };
  