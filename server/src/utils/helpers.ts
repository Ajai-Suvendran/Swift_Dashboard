import { Request, Response } from 'express';

export const formatResponse = (data: any, message: string = 'Success') => {
  return {
    status: 'success',
    message,
    data,
  };
};

export const handleError = (res: Response, error: any) => {
  console.error(error);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export const validateRequestBody = (req: Request, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !(field in req.body));
  return missingFields.length === 0 ? null : missingFields;
};