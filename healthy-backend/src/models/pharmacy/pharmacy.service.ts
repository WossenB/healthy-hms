import PharmacyItem from "./pharmacy.model.js";
import Prescription from "../prescription/prescription.model.js";

export const createMedicine = async (data) => {
  return await PharmacyItem.create(data);
};

export const updateMedicine = async (id, data) => {
  return await PharmacyItem.findByIdAndUpdate(id, data, { new: true });
};

export const getAllMedicines = async () => {
  return await PharmacyItem.find().sort({ createdAt: -1 });
};

export const getMedicineById = async (id) => {
  return await PharmacyItem.findById(id);
};

export const dispenseMedicine = async (prescriptionId, pharmacistId) => {
  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) throw new Error("Prescription not found");

  // Find matching medicine item
  const med = await PharmacyItem.findOne({
    name: prescription.medicineName,
    strength: prescription.dosage,
  });

  if (!med) throw new Error("Medicine not found in pharmacy");

  if (med.quantity <= 0) throw new Error("Medicine is out of stock");

  // Deduct 1 unit for now (later: dose-based detection)
  med.quantity = med.quantity - 1;
  med.updatedBy = pharmacistId;
  await med.save();

  return {
    message: "Medicine dispensed successfully",
    med,
    prescription,
  };
};
