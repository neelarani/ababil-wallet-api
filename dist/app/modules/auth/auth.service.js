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
exports.changePassword = exports.setPassword = exports.forgotPassword = exports.resetPassword = exports.getNewAccessToken = exports.verifyUser = exports.getVerifyUserSecret = void 0;
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const user_interface_1 = require("../user/user.interface");
const getVerifyUserSecret = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, 'User not found!');
    if (user.isVerified)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User already verified!');
    const secret = jsonwebtoken_1.default.sign({ id: user._id }, config_1.ENV.USER_VERIFY_SECRET, {
        expiresIn: '5m',
    });
    const info = yield (0, shared_1.sendMail)({
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
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, shared_1.createNewAccessTokenWithRefresh)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
exports.getNewAccessToken = getNewAccessToken;
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.userId) {
        throw new errors_1.AppError(401, 'You can not reset your password');
    }
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new errors_1.AppError(401, 'User does not exist');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.ENV.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    yield user.save();
});
exports.resetPassword = resetPassword;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_GATEWAY, `Email is required`);
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User does not exist');
    if (!user.isVerified)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User is not verified');
    if (user.isActive === user_interface_1.IsActive.BLOCKED || user.isActive === user_interface_1.IsActive.INACTIVE)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `User is ${user.isActive}`);
    if (user.isDeleted)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User is deleted');
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.ENV.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });
    const info = yield (0, shared_1.sendMail)({
        to: user.email,
        subject: 'Password Reset',
        template: {
            name: 'forgetPassword',
            data: {
                name: user.name,
                resetUILink: `${config_1.ENV.FRONTEND_BASE_URL}/reset-password?id=${user._id}&token=${resetToken}`,
            },
        },
    });
    if (!info.accepted.includes(user.email))
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to send reset email Link`);
});
exports.forgotPassword = forgotPassword;
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new errors_1.AppError(404, 'User not found');
    if (user.password &&
        user.auths.some(providerObject => providerObject.provider === 'google'))
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'You have already set you password. Now you can change the password from your profile password update');
    const hashedPassword = bcryptjs_1.default.hashSync(plainPassword, bcryptjs_1.default.genSaltSync(config_1.ENV.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: 'credentials',
        providerId: user.email,
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    yield user.save();
});
exports.setPassword = setPassword;
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = bcryptjs_1.default.compareSync(oldPassword, user.password);
    if (!isOldPasswordMatch)
        throw new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, 'Old Password does not match');
    user.password = bcryptjs_1.default.hashSync(newPassword, bcryptjs_1.default.genSaltSync(config_1.ENV.BCRYPT_SALT_ROUND));
    user.save();
});
exports.changePassword = changePassword;
