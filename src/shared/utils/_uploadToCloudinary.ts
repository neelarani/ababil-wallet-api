import { ENV } from '@/config';
import { UploadApiResponse, v2 } from 'cloudinary';
import DataURIParser from 'datauri/parser';
import { extname } from 'path';

v2.config({
  cloud_name: ENV.CLOUDINARY_CLAUDE_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

const parser = new DataURIParser();

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  const fileName = `${Date.now()}-${Math.random()
    .toString()
    .split('.')[1]
    .slice(5)}${extname(file.originalname)}`;

  return await v2.uploader.upload(
    parser.format(fileName, file.buffer).content as string
  );
};
