import Patient from "./patient.model.js";

export const createPatient = async (data) => {
  return await Patient.create(data);
};

export const getAllPatients = async (query) => {
  const { page = 1, limit = 10, search = "" } = query;

  const filter = {
    isActive: true,
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { gender: { $regex: search, $options: "i" } },
    ],
  };

  const patients = await Patient.find(filter)
    .populate("createdBy", "name email role")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Patient.countDocuments(filter);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    patients,
  };
};

export const softDeletePatient = async (id) => {
  return await Patient.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
export const getPatientById = async (id: string) => {
  const patient = await Patient.findById(id).populate("createdBy", "name email role");
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const updatePatient = async (id: string, data: any) => {
  const patient = await Patient.findById(id);
  if (!patient) throw new Error("Patient not found");

  Object.assign(patient, data);
  await patient.save();
  return patient;
};

