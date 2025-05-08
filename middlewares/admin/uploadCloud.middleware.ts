import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import uploadToCloudinary from '../../helpers/uploadToCloudinary'; 

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const file = req.file as Express.Multer.File | undefined;  // Ép kiểu rõ ràng

  if (file) {
    try {
      const link = await uploadToCloudinary(file.buffer);  // Upload ảnh lên Cloudinary
      req.body[file.fieldname] = link;
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ message: 'Upload failed' });
      return;
    }
  }
  next();  // Tiếp tục với middleware tiếp theo
};

export const upload = (req: Request, res: Response, next: NextFunction): void => {
  const file = req.file as Express.Multer.File | undefined;  // Ép kiểu rõ ràng

  // Kiểm tra nếu không có file, tiếp tục với middleware tiếp theo
  if (!file || !file.buffer || !file.fieldname) return next();

  const streamUpload = (): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);  // Trả về kết quả nếu thành công
        } else {
          reject(error);  // Reject nếu có lỗi
        }
      });

      // Pipe dữ liệu file vào Cloudinary stream
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  };

  // Hàm async xử lý upload
  async function uploadFile() {
    const file = req.file as Express.Multer.File | undefined; // Đảm bảo file là kiểu Express.Multer.File
    if (!file) {
      console.error('File is undefined');
      return res.status(400).json({ message: 'No file provided' });
    }

    try {
      const result = await streamUpload();  // Chờ kết quả upload
      req.body[file.fieldname] = result.url;  // Gán URL ảnh vào body
      next();  // Tiếp tục với middleware tiếp theo
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    }
  }

  uploadFile();  // Thực thi upload
};
