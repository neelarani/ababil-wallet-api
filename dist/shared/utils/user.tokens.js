"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const config_1 = require("../../config");
const jwt_1 = require("./jwt");
const createUserTokens = (user) => {
    const JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(JwtPayload, config_1.ENV.JWT_ACCESS_SECRET, config_1.ENV.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(JwtPayload, config_1.ENV.JWT_REFRESH_SECRET, config_1.ENV.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
