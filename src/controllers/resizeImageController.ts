
import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const resizeImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const imagePath = req.file.path;
  const outputPath = path.join('uploads', `resized-${req.file.filename}.png`);

  try {
    await sharp(imagePath)
      .resize(200, 200)
      .toFile(outputPath);

    res.download(outputPath, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error downloading the image.' });
      }
      fs.unlinkSync(imagePath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error resizing the image.' });
  }
};
