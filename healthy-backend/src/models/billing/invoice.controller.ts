import {
    createInvoice,
    getInvoiceById,
    getInvoicesByPatient,
    getInvoicesByConsultation,
    markInvoicePaid,
  } from "./invoice.service.js";
  
  export const createInvoiceController = async (req, res, next) => {
    try {
      const data = {
        patient: req.body.patient,
        consultation: req.body.consultation || null,
        items: req.body.items,
        createdBy: req.user.id,
      };
  
      const invoice = await createInvoice(data);
  
      res.status(201).json({
        message: "Invoice created successfully",
        invoice,
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getInvoiceController = async (req, res, next) => {
    try {
      const invoice = await getInvoiceById(req.params.id);
      if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  
      res.json(invoice);
    } catch (err) {
      next(err);
    }
  };
  
  export const getByPatientController = async (req, res, next) => {
    try {
      const invoices = await getInvoicesByPatient(req.params.patientId);
      res.json(invoices);
    } catch (err) {
      next(err);
    }
  };
  
  export const getByConsultationController = async (req, res, next) => {
    try {
      const invoices = await getInvoicesByConsultation(req.params.consultationId);
      res.json(invoices);
    } catch (err) {
      next(err);
    }
  };
  
  export const payInvoiceController = async (req, res, next) => {
    try {
      const updated = await markInvoicePaid(req.params.id, req.user.id);
  
      res.json({
        message: "Invoice marked as paid",
        invoice: updated,
      });
    } catch (err) {
      next(err);
    }
  };
  