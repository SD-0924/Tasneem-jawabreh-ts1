import multer from 'multer';
import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';
import { resizeImage } from '../controllers/resizeImageController';
import { cropImage } from '../controllers/cropImageController';
import { downloadImage } from '../controllers/downloadImageController';
import { filterImage } from '../controllers/filterImageController'; // Import the filter controller
import { addWatermark } from '../controllers/watermarkImageController'; // Import the watermark controller

const router = Router();

// Route for uploading an image
router.post('/upload', uploadMiddleware, uploadImage);

// Route for resizing an image
router.post('/resize', uploadMiddleware, resizeImage);

// Route for cropping an image
router.post('/crop', uploadMiddleware, cropImage);

// Route for downloading an image by filename
router.get('/download/:filename', downloadImage);
// POST route for filtering images

router.post('/filter', uploadMiddleware, filterImage); 

// POST route for watermarking images
router.post('/watermark', uploadMiddleware, addWatermark); 

export default router;
