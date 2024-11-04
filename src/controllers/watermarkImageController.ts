import { Request, Response } from 'express';
import sharp from 'sharp';
import { createCanvas } from 'canvas';
import path from 'path';
import fs from 'fs';

export const addWatermark = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const { watermarkText } = req.body; // The text you want to use as a watermark
  const imagePath = req.file.path;
  const outputPath = path.join('uploads', `watermarked-${req.file.filename}`);

  try {
    // Load the original image to get dimensions
    const { width, height } = await sharp(imagePath).metadata();

    // Create a canvas with the same dimensions as the original image
    const canvas = createCanvas(width || 200, height || 200); // Defaults if dimensions not available
    const ctx = canvas.getContext('2d');

    // Set background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configure watermark font and style
    ctx.font = '48px Arial'; // Adjust font size as needed
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White with 50% opacity
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Position the text at the center of the canvas
    ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);

    // Convert canvas to buffer
    const watermarkBuffer = canvas.toBuffer();

    // Process the image with Sharp, compositing the watermark buffer
    await sharp(imagePath)
      .composite([{ input: watermarkBuffer, gravity: 'center' }]) // Overlay watermark in center
      .toFile(outputPath);

    res.status(200).json({
      message: 'Watermark added successfully',
      watermarkedImage: outputPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding watermark to the image.' });
  } finally {
    // Clean up the original uploaded image file
    fs.unlinkSync(imagePath);
  }
};
