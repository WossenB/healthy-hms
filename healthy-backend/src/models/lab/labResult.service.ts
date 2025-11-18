import LabRequest from "./LabRequest.js";
import LabResult from "./labResult.model.js";

export const createLabResult = async ({ requestId, findings, remarks, files, processedBy }) => {
  // 1. check request
  const reqDoc = await LabRequest.findById(requestId);
  if (!reqDoc) throw new Error("Lab request not found");

  // 2. create result
  const result = await LabResult.create({
    request: requestId,
    patient: reqDoc.patient,
    processedBy,
    findings,
    remarks,
    files,
  });

  // 3. link result to request and update status
  reqDoc.result = result._id;
  reqDoc.status = "completed";
  await reqDoc.save();

  return result;
};

export const getResultById = async (id) => {
  return await LabResult.findById(id)
    .populate("patient", "firstName lastName")
    .populate("processedBy", "name email role")
    .populate({
      path: "request",
      populate: { path: "requestedBy", select: "name email role" },
    });
};

export const getResultByRequest = async (requestId) => {
  return await LabResult.findOne({ request: requestId })
    .populate("patient", "firstName lastName")
    .populate("processedBy", "name email role");
};

export const getResultsByPatient = async (patientId) => {
  return await LabResult.find({ patient: patientId }).populate("processedBy", "name email");
};
