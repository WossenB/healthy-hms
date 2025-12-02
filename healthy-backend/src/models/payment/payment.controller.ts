import {
    createPayment,
    getPaymentById,
    getPaymentsByPatient,
    getAllPayments,
  } from "./payment.service.js";
  
  export const createPaymentController = async (req, res, next) => {
    try {
      const { invoiceId, amountPaid, paymentMethod, transactionId } = req.body;
  
      const payment = await createPayment({
        invoiceId,
        amountPaid,
        paymentMethod,
        transactionId,
        receivedBy: req.user.id,
      });
  
      res.status(201).json({
        message: "Payment completed successfully",
        payment,
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getPaymentController = async (req, res, next) => {
    try {
      const payment = await getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  };
  
  export const getPaymentsByPatientController = async (req, res, next) => {
    try {
      const list = await getPaymentsByPatient(req.params.patientId);
      res.json(list);
    } catch (err) {
      next(err);
    }
  };
  
  export const getAllPaymentsController = async (req, res, next) => {
    try {
      const list = await getAllPayments();
      res.json(list);
    } catch (err) {
      next(err);
    }
  };
  