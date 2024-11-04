import { Response } from 'express';

export const handleError = (error: any, res: Response) => {
  console.error(error);
  res.status(500).json({ error: 'An error occurred during image processing' });
};
