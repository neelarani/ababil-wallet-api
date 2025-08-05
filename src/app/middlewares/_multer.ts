import multer from 'multer';
import { AppError } from '@/app/errors';
import { HTTP_CODE, mimetypeImages } from '@/shared';

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (!mimetypeImages.includes(file.mimetype))
      return callback(
        new AppError(
          HTTP_CODE.BAD_REQUEST,
          `The provided images not support in Neela Wallet API`
        )
      );
    callback(null, true);
  },
});
