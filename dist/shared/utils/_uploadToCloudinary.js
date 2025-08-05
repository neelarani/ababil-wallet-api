"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const config_1 = require("../../config");
const cloudinary_1 = require("cloudinary");
const parser_1 = __importDefault(require("datauri/parser"));
const path_1 = require("path");
cloudinary_1.v2.config({
    cloud_name: config_1.ENV.CLOUDINARY_CLAUDE_NAME,
    api_key: config_1.ENV.CLOUDINARY_API_KEY,
    api_secret: config_1.ENV.CLOUDINARY_API_SECRET,
});
const parser = new parser_1.default();
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `${Date.now()}-${Math.random()
        .toString()
        .split('.')[1]
        .slice(5)}${(0, path_1.extname)(file.originalname)}`;
    return yield cloudinary_1.v2.uploader.upload(parser.format(fileName, file.buffer).content);
});
exports.uploadToCloudinary = uploadToCloudinary;
