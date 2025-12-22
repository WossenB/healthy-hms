import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Known AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details || null,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value",
      errorCode: "DUPLICATE_KEY",
      details: err.keyValue,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const details: any = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errorCode: "VALIDATION_ERROR",
      details,
    });
  }

  // Unknown error (fallback)
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR",
    details: null,
  });
};
