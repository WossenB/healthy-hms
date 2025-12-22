import Appointment from "./appointment.model.js";
import { getPagination } from "../../utils/pagination.js";

export const createAppointment = async (data) => {
  return Appointment.create(data);
};

export const getAllAppointments = async (query) => {
  const { search = "" } = query;
  const { page, limit, skip } = getPagination(query);

  const filter = {
    isActive: true,
    $or: [
      { patient: { $regex: search, $options: "i" } },
      { doctor: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ],
  };

  const appointments = await Appointment.find(filter)
    .populate("patient", "firstName lastName phone")
    .populate("doctor", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Appointment.countDocuments(filter);

  return {
    data: appointments,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getDoctorQueue = async (doctorId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return Appointment.find({
    doctor: doctorId,
    appointmentDate: { $gte: start, $lte: end },
    status: { $in: ["scheduled", "checked_in"] },
  })
    .populate("patient", "firstName lastName phone")
    .sort({ appointmentDate: 1 })
    .lean();
};

export const updateAppointmentStatus = async (id, status) => {
  return Appointment.findByIdAndUpdate(id, { status }, { new: true });
};
