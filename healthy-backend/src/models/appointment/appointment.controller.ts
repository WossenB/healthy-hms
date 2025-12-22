import {
    createAppointment,
    getDoctorQueue,
    updateAppointmentStatus,
  } from "./appointment.service.js";
  import { logActivity } from "../../utils/logActivity.js";
  
  export const createAppointmentController = async (req, res, next) => {
    try {
      const appointment = await createAppointment({
        ...req.body,
        createdBy: req.user.id,
      });
  
      await logActivity({
        user: req.user,
        module: "appointment",
        action: "create",
        description: "Appointment scheduled",
        type: "light",
        before: null,
        after: appointment,
      });
  
      res.status(201).json({ message: "Appointment created", appointment });
    } catch (err) {
      next(err);
    }
  };
  
  export const doctorQueueController = async (req, res, next) => {
    try {
      const { doctorId, date } = req.query;
      const queue = await getDoctorQueue(doctorId, date);
      res.json(queue);
    } catch (err) {
      next(err);
    }
  };
  
  export const updateAppointmentStatusController = async (req, res, next) => {
    try {
      const updated = await updateAppointmentStatus(
        req.params.id,
        req.body.status
      );
  
      await logActivity({
        user: req.user,
        module: "appointment",
        action: "status_update",
        description: `Appointment marked as ${req.body.status}`,
        type: "advanced",
        before: null,
        after: updated,
      });
  
      res.json({ message: "Status updated", appointment: updated });
    } catch (err) {
      next(err);
    }
  };
  