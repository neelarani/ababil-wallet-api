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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefresh = exports.createUserTokens = void 0;
const user_interface_1 = require("../../app/modules/user/user.interface");
const user_model_1 = require("../../app/modules/user/user.model");
const config_1 = require("../../config");
const shared_1 = require("../../shared");
const errors_1 = require("../../app/errors");
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, shared_1.generateToken)(jwtPayload, config_1.ENV.JWT_ACCESS_SECRET, config_1.ENV.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, shared_1.generateToken)(jwtPayload, config_1.ENV.JWT_REFRESH_SECRET, config_1.ENV.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, shared_1.verifyToken)(refreshToken, config_1.ENV.JWT_REFRESH_SECRET);
    let user = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!user)
        throw new errors_1.AppError(404, 'User not exist to getNewAccessToken');
    if ((user === null || user === void 0 ? void 0 : user.isActive) === user_interface_1.IsActive.BLOCKED ||
        (user === null || user === void 0 ? void 0 : user.isActive) === user_interface_1.IsActive.INACTIVE)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `User is: ${user.isActive}`);
    if ((user === null || user === void 0 ? void 0 : user.isDeleted) === true)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'User is deleted!');
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user.role,
    };
    const accessToken = (0, shared_1.generateToken)(jwtPayload, config_1.ENV.JWT_ACCESS_SECRET, '1d');
    return accessToken;
});
exports.createNewAccessTokenWithRefresh = createNewAccessTokenWithRefresh;
