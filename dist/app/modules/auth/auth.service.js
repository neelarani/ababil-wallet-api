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
exports.verifyUser = exports.getVerifyUserSecret = void 0;
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const _sendMail_1 = require("../../../shared/utils/_sendMail");
const getVerifyUserSecret = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, 'User not found!');
    if (user.isVerified)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User already verified!');
    const secret = jsonwebtoken_1.default.sign({ id: user._id }, config_1.ENV.USER_VERIFY_SECRET, {
        expiresIn: '5m',
    });
    const info = yield (0, _sendMail_1.sendMail)({
        to: user.email,
        subject: 'Verify your account',
        template: {
            name: 'verify-user',
            data: {
                secretURL: `${config_1.ENV.BACKEND_BASE_URL}/api/v1/auth/verify?secret=${secret}`,
                username: user.name,
            },
        },
    });
    if (!info.accepted.includes(user.email))
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to send verify email!`);
});
exports.getVerifyUserSecret = getVerifyUserSecret;
const verifyUser = (secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = jsonwebtoken_1.default.verify(secret, config_1.ENV.USER_VERIFY_SECRET);
        const user = yield user_model_1.User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
        return user;
    }
    catch (error) {
        return null;
    }
});
exports.verifyUser = verifyUser;
