import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const filterImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const { filter } = req.body; // Expecting filter type in the request body
  const imagePath = req.file.path;
  const outputPath = path.join('uploads', `filtered-${req.file.filename}`);

  try {
    // Apply the selected filter using sharp
    let image = sharp(imagePath);
    
    if (filter === 'grayscale') {
      image = image.grayscale();
    } else if (filter === 'blur') {
      image = image.blur(5); // Blur amount can be adjusted
    } else {
      res.status(400).json({ error: 'Invalid filter type.' });
      return;
    }

    await image.toFile(outputPath);

    res.status(200).json({
      message: 'Image filtered successfully',
      filteredImage: outputPath,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error filtering the image.' });
  } finally {
    // Clean up the original uploaded image file
    fs.unlinkSync(imagePath);
  }
};
