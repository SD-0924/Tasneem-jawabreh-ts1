import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const downloadImage = (req: Request, res: Response): void => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, '../uploads', filename);

  console.log('Attempting to download file at path:', filePath); 

  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath); 
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.download(filePath, (err) => {
    if (err) {
      console.log('Error downloading the file:', err); 
      res.status(500).json({ error: 'Error downloading the file' });
    }
  });
};
