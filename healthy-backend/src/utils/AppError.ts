class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;

  constructor(
    message: string,
    statusCode = 400,
    errorCode = "APP_ERROR",
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export default AppError;
