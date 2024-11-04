/*import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { handleError } from '../utils/errorHandler';

export const resizeImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const imagePath = req.file.path;
  const outputPath = path.join('uploads', `resized-${req.file.filename}.png`);

  try {
    // Resize the image using sharp
    await sharp(imagePath)
      .resize(200, 200) // Example dimensions
      .toFile(outputPath);

    // Send the resized image back to the client
    res.download(outputPath, (err) => {
      if (err) {
        handleError(err, res);
      }
      // Clean up files after sending
      fs.unlinkSync(imagePath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    handleError(error, res);
  }
};*/
import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { handleError } from '../utils/errorHandler';

export const resizeImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const imagePath = req.file.path;
  const uploadsDir = path.join(__dirname, '../uploads'); // Path to the uploads directory
  const ext = path.extname(req.file.filename);
  const outputPath = path.join(uploadsDir, `resized-${req.file.filename.replace(ext, '')}.jpg`); // Keeps original filename but changes the extension

  // Get width and height from query parameters, ensuring they are treated as numbers
  const width = parseInt(req.query.width as string) || 200; // Default width
  const height = parseInt(req.query.height as string) || 200; // Default height

  try {
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Resize the image using sharp
    await sharp(imagePath)
      .resize(width, height) // Resize to specified dimensions
      .toFile(outputPath);

    // Send the resized image back to the client
    res.download(outputPath, (err) => {
      if (err) {
        handleError(err, res);
      }
      // Clean up files after sending
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`Error deleting original image: ${err}`);
      });
      fs.unlink(outputPath, (err) => {
        if (err) console.error(`Error deleting resized image: ${err}`);
      });
    });
  } catch (error) {
    handleError(error, res);
  }
};

