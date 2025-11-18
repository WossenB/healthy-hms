import { createLabResult, getResultById, getResultByRequest, getResultsByPatient } from "./labResult.service.js";
import { logAction } from "../../utils/auditLogger.js";
import path from "path";

export const uploadLabResultController = async (req, res, next) => {
  try {
    // files come from multer: req.files (array)
    const files = (req.files || []).map((f) => {
      // store a public URL path (serve via /uploads)
      return `/uploads/lab-results/${path.basename(f.path)}`;
    });

    // findings may be sent as JSON string or as object
    const findingsRaw = req.body.findings;
    let findings;
    if (typeof findingsRaw === "string") {
      try { findings = JSON.parse(findingsRaw); } catch { findings = { raw: findingsRaw }; }
    } else findings = findingsRaw || {};

    const { request: requestId, remarks } = req.body;

    const result = await createLabResult({
      requestId,
      findings,
      remarks,
      files,
      processedBy: req.user.id,
    });

    await logAction(req.user.id, "LAB_RESULT_UPLOADED", result._id, "LabResult", {
      request: result.request,
      patient: result.patient,
      files: result.files,
    });

    res.status(201).json({ message: "Lab result uploaded successfully", result });
  } catch (err) {
    next(err);
  }
};

export const getLabResultByIdController = async (req, res, next) => {
  try {
    const result = await getResultById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getLabResultByRequestController = async (req, res, next) => {
  try {
    const result = await getResultByRequest(req.params.requestId);
    if (!result) return res.status(404).json({ message: "No result found for that request" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getResultsByPatientController = async (req, res, next) => {
  try {
    const results = await getResultsByPatient(req.params.patientId);
    res.json(results);
  } catch (err) {
    next(err);
  }
};
