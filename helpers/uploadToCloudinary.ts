import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// const streamUploadImages = (buffer: Buffer): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       (error, result) => {
//         if (result) {
//           resolve(result);
//         } else {
//           reject(error);
//         }
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
//   const result = await streamUploadImages(buffer);
//   return result.url!;
// };

const streamUpload = (buffer: Buffer, resource_type: "image" | "video" | "auto"): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloudinary = async (buffer: Buffer, mimetype: string): Promise<string> => {
  let resource_type: "image" | "video" | "auto" = "auto";

  if (mimetype.startsWith("image/")) {
    resource_type = "image";
  } else if (mimetype.startsWith("audio/")) {
    resource_type = "video"; 
  }

  const result = await streamUpload(buffer, resource_type);
  return result.secure_url!;
};

export default uploadToCloudinary;
