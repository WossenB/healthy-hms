import {
  createInsuranceClaim,
  approveClaim,
  rejectClaim,
  getClaim,
  getClaimsByPatient
} from "./claim.service.js";
import InsuranceCoverage from "./coverage.model.js";

export const createClaimController = async (req, res, next) => {
  try {
    const { patient, invoice, coverage, description } = req.body;

    // Step 1: Get the coverage document
    const coverageDoc = await InsuranceCoverage.findById(coverage).populate("insuranceCompany");
    if (!coverageDoc)
      return res.status(404).json({ message: "Coverage not found" });

    // Step 2: Call service with correct mapped fields
    const claim = await createInsuranceClaim({
      invoiceId: invoice,
      patient,
      company: coverageDoc.insuranceCompany._id,
      coverage: coverageDoc.coveragePercentage
    });

    res.status(201).json({
      message: "Insurance claim created",
      claim
    });

  } catch (err) {
    next(err);
  }
};

export const approveClaimController = async (req, res, next) => {
  try {
    const claim = await approveClaim(req.params.id);
    res.json({ message: "Claim approved", claim });
  } catch (err) {
    next(err);
  }
};

export const rejectClaimController = async (req, res, next) => {
  try {
    const claim = await rejectClaim(req.params.id);
    res.json({ message: "Claim rejected", claim });
  } catch (err) {
    next(err);
  }
};

export const getClaimController = async (req, res, next) => {
  try {
    const claim = await getClaim(req.params.id);
    res.json(claim);
  } catch (err) {
    next(err);
  }
};

export const getClaimsByPatientController = async (req, res, next) => {
  try {
    const claims = await getClaimsByPatient(req.params.patientId);
    res.json(claims);
  } catch (err) {
    next(err);
  }
};
