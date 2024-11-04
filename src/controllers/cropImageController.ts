
import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const cropImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  // Set crop dimensions (example: top, left, width, height)
  const { top, left, width, height } = req.body;
  const imagePath = req.file.path;
  const outputPath = path.join('uploads', `cropped-${req.file.filename}`);

  try {
    // Crop the image using sharp
    await sharp(imagePath)
      .extract({ 
        width: parseInt(width), 
        height: parseInt(height), 
        left: parseInt(left), 
        top: parseInt(top) 
      })
      .toFile(outputPath);

    res.status(200).json({
      message: 'Image cropped successfully',
      croppedImage: outputPath,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error cropping the image.' });
  } finally {
    // Clean up the original uploaded image file
    fs.unlinkSync(imagePath);
  }
};
