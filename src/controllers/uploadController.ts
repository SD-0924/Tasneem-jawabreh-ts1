
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Set up storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // specify the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // save file with a unique name
  },
});

const upload = multer({ storage });

// Upload function
export const uploadImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  // Respond with the file details
  res.status(200).json({
    message: 'Image uploaded successfully',
    file: req.file,
  });
};

// Export the multer upload middleware for use in routes
export const uploadMiddleware = upload.single('image'); // 'image' is the field name for the uploaded file
