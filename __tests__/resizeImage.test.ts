import { resizeImage } from '../src/controllers/resizeImageController';
import sharp from 'sharp';

jest.mock('sharp');
jest.setTimeout(10000); // 10 seconds
describe('Image Resize Function', () => {


  it('should return an error when no image is uploaded', async () => {
    const req: any = { file: null };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await resizeImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No image uploaded' });
  });
});
