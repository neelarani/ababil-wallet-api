"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../../app/errors");
const shared_1 = require("../../shared");
exports.multerUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter(req, file, callback) {
        if (!shared_1.mimetypeImages.includes(file.mimetype))
            return callback(new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `The provided images not support in Neela Wallet API`));
        callback(null, true);
    },
});
