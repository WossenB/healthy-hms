import Ward from "./ward.model.js";
import Bed from "./bed.model.js";

export const createWard = async ({ name, capacity, user }) => {
  const ward = await Ward.create({ name, capacity, createdBy: user });

  // auto create beds
  const beds = [];
  for (let i = 1; i <= capacity; i++) {
    beds.push({ ward: ward._id, bedNumber: `B-${i}` });
  }

  await Bed.insertMany(beds);

  return ward;
};

export const getAllWards = () => Ward.find();

export const getBedsByWard = (wardId) =>
  Bed.find({ ward: wardId }).populate("patient", "firstName lastName");

export const assignBed = async ({ bedId, patient }) => {
  const bed = await Bed.findById(bedId);
  if (!bed) throw new Error("Bed not found");
  if (bed.occupied) throw new Error("Bed already occupied");

  bed.occupied = true;
  bed.patient = patient;
  await bed.save();

  return bed;
};

export const releaseBed = async (bedId) => {
  const bed = await Bed.findById(bedId);
  if (!bed) throw new Error("Bed not found");

  bed.occupied = false;
  bed.patient = null;
  await bed.save();

  return bed;
};
